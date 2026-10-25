import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

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

// ---------------------------------------------------------------------------
// Contact payload validation (zod) — mirrors the client-side schema in
// src/lib/validations.ts but stays tolerant of both form shapes
// (Contact Desk uses `name`, legacy payloads may use `fullName`).
// ---------------------------------------------------------------------------
const contactPayloadSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    fullName: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().min(3).max(120).email(),
    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .or(z.literal('')),
    company: z.string().trim().max(120).optional().or(z.literal('')),
    businessStage: z.string().trim().max(100).optional().or(z.literal('')),
    serviceNeeded: z.string().trim().max(120).optional().or(z.literal('')),
    message: z.string().trim().max(2000).optional().or(z.literal(''))
  })
  .refine((v) => Boolean(v.name || v.fullName), {
    message: 'A full name is required.',
    path: ['name']
  });

// ---------------------------------------------------------------------------
// Minimal in-memory rate limiter for the public contact endpoint.
// Single-instance is enough for a lead form; behind Vercel the serverless
// function in /api/contact.js applies the same validation.
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_REQUESTS = 5;
const contactHits = new Map<string, number[]>();

function rateLimitContact(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const hits = (contactHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);

  if (hits.length >= RATE_MAX_REQUESTS) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_WINDOW_MS / 1000)));
    return res.status(429).json({
      success: false,
      message: 'Too many consultation requests from this connection. Please try again in a few minutes, or reach us on WhatsApp +91 88828 60226.'
    });
  }

  hits.push(now);
  contactHits.set(ip, hits);

  // Opportunistic cleanup so the Map cannot grow without bound.
  if (contactHits.size > 10_000) {
    for (const [key, times] of contactHits) {
      const live = times.filter((t) => now - t < RATE_WINDOW_MS);
      if (live.length === 0) contactHits.delete(key);
      else contactHits.set(key, live);
    }
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

  // Webhook/Email contact route (/api/contact)
  app.post('/api/contact', rateLimitContact, (req, res) => {
    const parsed = contactPayloadSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Please check the highlighted fields and try again.',
        issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
      });
    }

    const { fullName, name, email, phone, businessStage, serviceNeeded } = parsed.data;
    const clientName = fullName || name || 'Valued Partner';
    const refId = `JAS-REQ-${Date.now().toString().slice(-6)}`;

    console.log(`[API Contact] New Lead Received (${refId}):`, {
      clientName,
      email,
      phone,
      businessStage,
      serviceNeeded
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation request received successfully. Dedicated lead accountant assigned.',
      referenceId: refId,
      timestamp: new Date().toISOString()
    });
  });

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
