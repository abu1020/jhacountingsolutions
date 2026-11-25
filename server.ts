import express from 'express';
import http from 'http';
import fs from 'fs';
import crypto from 'crypto';
import zlib from 'zlib';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import contactHandler from './api/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

// ---------------------------------------------------------------------------
// Security headers
// Applied to every response (API + static). CSP is production-only because the
// Vite dev server injects inline bootstrap scripts that a strict CSP blocks.
// ---------------------------------------------------------------------------
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com https://www.google-analytics.com https://analytics.google.com https://jhacountingsolution.vercel.app",
  "frame-src 'self' https://*.firebaseapp.com https://jhanooks.vercel.app https://jhamanagement.vercel.app https://jhatasks.vercel.app",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests'
].join('; ');

function securityHeaders(_req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  }
  next();
}

// ---------------------------------------------------------------------------
// High-concurrency in-memory response cache with pre-computed Brotli & Gzip.
// Serves 10,000+ concurrent requests directly from RAM with zero repeated disk
// I/O and zero per-request compression overhead.
// ---------------------------------------------------------------------------
interface CachedPayload {
  raw: Buffer;
  br: Buffer;
  gzip: Buffer;
  etag: string;
  contentType: string;
  cacheControl: string;
}

const MIME_BY_EXT: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.xml', '.txt']);

function buildCachedPayload(raw: Buffer, contentType: string, cacheControl: string, compress: boolean): CachedPayload {
  const hash = crypto.createHash('sha1').update(raw).digest('base64url').slice(0, 16);
  return {
    raw,
    br: compress ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : raw,
    gzip: compress ? zlib.gzipSync(raw, { level: 6 }) : raw,
    etag: `"${hash}"`,
    contentType,
    cacheControl
  };
}

function sendCachedPayload(req: express.Request, res: express.Response, payload: CachedPayload, compressed: boolean) {
  res.setHeader('Content-Type', payload.contentType);
  res.setHeader('Cache-Control', payload.cacheControl);
  res.setHeader('ETag', payload.etag);
  res.setHeader('Vary', 'Accept-Encoding');

  if (req.headers['if-none-match'] === payload.etag) {
    res.status(304).end();
    return;
  }

  const acceptEncoding = String(req.headers['accept-encoding'] || '');
  if (compressed && acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    res.setHeader('Content-Length', String(payload.br.length));
    res.status(200).end(req.method === 'HEAD' ? undefined : payload.br);
    return;
  }
  if (compressed && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', String(payload.gzip.length));
    res.status(200).end(req.method === 'HEAD' ? undefined : payload.gzip);
    return;
  }

  res.setHeader('Content-Length', String(payload.raw.length));
  res.status(200).end(req.method === 'HEAD' ? undefined : payload.raw);
}

// Bounded per-IP sliding-window rate limiter for /api/* (protects against floods
// without ever leaking memory when 10,000+ distinct IPs connect).
const API_WINDOW_MS = 60_000;
const API_MAX_REQUESTS = 30;
const API_MAX_TRACKED_IPS = 10_000;
const apiRateStore = new Map<string, { count: number; resetAt: number }>();

function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  let bucket = apiRateStore.get(ip);

  if (!bucket || now > bucket.resetAt) {
    if (apiRateStore.size >= API_MAX_TRACKED_IPS) {
      // Evict expired entries first, then oldest entry if still full
      for (const [key, entry] of apiRateStore) {
        if (now > entry.resetAt) apiRateStore.delete(key);
        if (apiRateStore.size < API_MAX_TRACKED_IPS * 0.85) break;
      }
      if (apiRateStore.size >= API_MAX_TRACKED_IPS) {
        const oldest = apiRateStore.keys().next().value;
        if (oldest) apiRateStore.delete(oldest);
      }
    }
    bucket = { count: 1, resetAt: now + API_WINDOW_MS };
    apiRateStore.set(ip, bucket);
    next();
    return;
  }

  bucket.count += 1;
  if (bucket.count > API_MAX_REQUESTS) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfterSec));
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment and try again.'
    });
    return;
  }

  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Behind Vercel / load balancers, trust the first proxy hop for req.ip.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.set('etag', false);

  app.use(securityHeaders);
  app.use(express.json({ limit: '10kb' }));

  // Lightweight zero-I/O readiness & liveness probe for load balancers
  app.get('/healthz', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ status: 'ok' });
  });

  // Rate-limited API routes
  app.use('/api', apiRateLimiter);
  app.all('/api/contact', contactHandler);

  app.use('/api', (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(err);
    const status = err?.type === 'entity.too.large' ? 413 : err?.status || err?.statusCode || 400;
    res.status(status).json({
      success: false,
      message:
        status === 413
          ? 'Payload too large. Consultation messages are limited to a few kilobytes.'
          : 'Malformed request payload.'
    });
  });

  // Pre-compressed XML Sitemap (/sitemap.xml)
  const buildDate = new Date().toISOString().split('T')[0];
  const sitemapPayload = buildCachedPayload(
    Buffer.from(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jhaaccounting.com/</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/blog</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/blog/gstr-2b-reconciliation-guide-2026</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/blog/startup-financial-stack-guide-2026</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`,
      'utf8'
    ),
    'application/xml; charset=utf-8',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    true
  );

  app.get('/sitemap.xml', (req, res) => {
    sendCachedPayload(req, res, sitemapPayload, true);
  });

  // Pre-compressed Robots.txt (/robots.txt)
  const robotsPayload = buildCachedPayload(
    Buffer.from(`User-agent: *\nAllow: /\nSitemap: https://jhaaccounting.com/sitemap.xml\n`, 'utf8'),
    'text/plain; charset=utf-8',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    true
  );

  app.get('/robots.txt', (req, res) => {
    sendCachedPayload(req, res, robotsPayload, true);
  });

  // Mount Vite middleware in non-production, high-concurrency RAM cache in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const staticCache = new Map<string, { payload: CachedPayload; compressible: boolean }>();
    let staticCacheBytes = 0;
    const MAX_CACHE_BYTES = 25 * 1024 * 1024; // 25 MB hard ceiling

    const readAndCacheFile = (absPath: string, cacheControl: string) => {
      const existing = staticCache.get(absPath);
      if (existing) return existing;
      if (!fs.existsSync(absPath)) return null;
      const stat = fs.statSync(absPath);
      if (!stat.isFile()) return null;

      const ext = path.extname(absPath).toLowerCase();
      const contentType = MIME_BY_EXT[ext] || 'application/octet-stream';
      const compressible = COMPRESSIBLE_EXTS.has(ext) && stat.size > 256;
      const raw = fs.readFileSync(absPath);
      const payload = buildCachedPayload(raw, contentType, cacheControl, compressible);
      const entry = { payload, compressible };

      const approxSize = payload.raw.length + (compressible ? payload.br.length + payload.gzip.length : 0);
      if (staticCacheBytes + approxSize <= MAX_CACHE_BYTES) {
        staticCache.set(absPath, entry);
        staticCacheBytes += approxSize;
      }
      return entry;
    };

    // Warm up critical entry files into RAM at boot
    const indexPath = path.join(distDir, 'index.html');
    const indexCacheControl = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400';
    const indexEntry = readAndCacheFile(indexPath, indexCacheControl);
    readAndCacheFile(path.join(distDir, 'theme.css'), 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    readAndCacheFile(path.join(distDir, 'portal.html'), 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');

    // Serve hashed /assets/* and public files directly from pre-compressed RAM cache
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      const safeRelPath = path.normalize(decodeURIComponent(req.path)).replace(/^(\.\.[/\\])+/, '');
      const candidate = path.join(distDir, safeRelPath);
      if (!candidate.startsWith(distDir) || candidate === distDir) return next();

      const isImmutableAsset =
        candidate.includes(`${path.sep}assets${path.sep}`) || candidate.includes(`${path.sep}fonts${path.sep}`);
      const cacheControl = isImmutableAsset
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

      const cached = readAndCacheFile(candidate, cacheControl);
      if (!cached) return next();

      sendCachedPayload(req, res, cached.payload, cached.compressible);
    });

    app.get('*', (req, res) => {
      if (indexEntry) {
        sendCachedPayload(req, res, indexEntry.payload, indexEntry.compressible);
      } else {
        res.sendFile(indexPath);
      }
    });
  }

  // Tuned HTTP server for high concurrency (10,000+ concurrent connections behind LB/CDN)
  const server = http.createServer(app);
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;
  server.requestTimeout = 30_000;
  server.maxRequestsPerSocket = 1000;

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Jha Accounting Solutions] Server listening at http://0.0.0.0:${PORT}`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`[Jha Accounting Solutions] ${signal} received, draining active connections...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();
