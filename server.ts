import express from 'express';
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
  // 'unsafe-inline' tolerated for GA/gtag snippets; external scripts are still
  // restricted to known analytics origins.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // Firebase Auth/Firestore/FCM + GA endpoints.
  "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com https://www.google-analytics.com https://analytics.google.com",
  "frame-src 'self' https://*.firebaseapp.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests'
].join('; ');

function securityHeaders(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  if (isProduction) {
    // HTTPS-only for a year incl. subdomains; safe behind Vercel/self-host TLS.
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Behind Vercel / load balancers, trust the first proxy hop for req.ip.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(securityHeaders);
  // Small body cap — a lead form never needs more than a few KB.
  app.use(express.json({ limit: '10kb' }));

  // The legacy endpoint fails closed; inquiries are saved directly to Firestore.
  app.all('/api/contact', contactHandler);

  // JSON error responses for API routes (e.g. body-parser 413/400) instead of
  // Express's default HTML error page. Registered AFTER the routes so errors
  // from express.json() and from the handlers themselves both land here.
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

  // Automated XML Sitemap (/sitemap.xml)
  app.get('/sitemap.xml', (_req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jhaaccounting.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/blog/gstr-2b-reconciliation-guide-2026</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/blog/startup-financial-stack-guide-2026</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://jhaaccounting.com/admin/analytics</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`);
  });

  // Robots.txt (/robots.txt)
  app.get('/robots.txt', (_req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: https://jhaaccounting.com/sitemap.xml`);
  });

  // Mount Vite middleware in non-production, static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Hashed build assets are immutable → cache for a year. HTML must
    // revalidate so deploys reach customers immediately.
    app.use(
      express.static(path.resolve(__dirname, 'dist'), {
        setHeaders(res, filePath) {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            res.setHeader('Cache-Control', 'no-cache');
          }
        }
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Jha Accounting Solutions] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
