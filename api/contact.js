/**
 * Legacy endpoint: it never persisted or delivered inquiries. Public forms use
 * Firestore's inquiries collection instead. Do not report a successful write
 * until a durable server-side delivery integration is configured.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }
  return res.status(503).json({ success: false, message: 'This endpoint is not configured to receive inquiries. Please use the website contact form.' });
}
