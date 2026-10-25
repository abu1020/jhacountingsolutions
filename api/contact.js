/**
 * Vercel serverless counterpart of the Express `/api/contact` route in
 * server.ts. The production deployment is a static Vite build, so without
 * this function the SPA rewrite would swallow POST /api/contact and return
 * HTML. Same zod validation, same JSON contract.
 *
 * Note: per-instance in-memory rate limiting is not meaningful on
 * serverless (cold starts/isolates). The Firestore rules are the real
 * abuse barrier for lead writes; add Vercel WAF rate-limit rules for
 * production-grade throttling of this endpoint.
 */
import { z } from 'zod';

const contactPayloadSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    fullName: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().min(3).max(120).email(),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    company: z.string().trim().max(120).optional().or(z.literal('')),
    businessStage: z.string().trim().max(100).optional().or(z.literal('')),
    serviceNeeded: z.string().trim().max(120).optional().or(z.literal('')),
    message: z.string().trim().max(2000).optional().or(z.literal(''))
  })
  .refine((v) => Boolean(v.name || v.fullName), {
    message: 'A full name is required.',
    path: ['name']
  });

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
    }
  }

  const parsed = contactPayloadSchema.safeParse(body || {});
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
}
