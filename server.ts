import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Webhook/Email contact route (/api/contact)
  app.post('/api/contact', (req, res) => {
    const { fullName, name, email, phone, businessStage, serviceNeeded, message } = req.body || {};
    
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
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Jha Accounting Solutions] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
