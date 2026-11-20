import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';
import { contactFormSchema, consultationModalSchema, approvedServicesEnum } from '../src/lib/validations.ts';

const validContact = { name: 'Rishi Jha', company: '', phone: '9876543210', email: 'rishi@example.com', serviceNeeded: 'GST Compliance Services', message: 'Please get in touch.' };
test('contact validation accepts a valid enquiry and rejects malformed input', () => {
  assert.equal(contactFormSchema.safeParse(validContact).success, true);
  assert.equal(contactFormSchema.safeParse({ ...validContact, email: 'invalid' }).success, false);
  assert.equal(contactFormSchema.safeParse({ ...validContact, serviceNeeded: 'Invented Service' }).success, false);
  assert.equal(contactFormSchema.safeParse({ ...validContact, message: 'x'.repeat(1001) }).success, false);
});
test('consultation uses the same approved services', () => {
  assert.equal(consultationModalSchema.safeParse({ fullName: validContact.name, workEmail: validContact.email, phone: validContact.phone, businessType: 'Individual', serviceNeeded: validContact.serviceNeeded, message: '' }).success, true);
  assert.equal(approvedServicesEnum.safeParse('Direct Consultation Request').success, false);
});
function response() {
  const result: { headers: Record<string, string>, statusCode?: number, body?: any, setHeader: Function, status: Function, json: Function } = { headers: {}, setHeader(key: string, value: string) { result.headers[key] = value; }, status(code: number) { result.statusCode = code; return result; }, json(body: any) { result.body = body; return result; } };
  return result;
}
test('legacy endpoint never claims to persist a submission', () => {
  const res = response(); handler({ method: 'POST', body: validContact }, res);
  assert.equal(res.statusCode, 503); assert.equal(res.body.success, false); assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('legacy endpoint rejects non-POST requests', () => {
  const res = response(); handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 405); assert.equal(res.headers.Allow, 'POST');
});

test('shared theme and self-hosted Inter are used by both entry pages', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const index = readFileSync('index.html', 'utf8');
  const portal = readFileSync('public/portal.html', 'utf8');
  const css = readFileSync('src/index.css', 'utf8');
  const theme = readFileSync('public/theme.css', 'utf8');
  assert.match(index, /href="\/theme\.css"/);
  assert.match(portal, /href="\/theme\.css"/);
  assert.match(theme, /font-family:\s*'Inter'/);
  assert.ok(existsSync('public/fonts/inter-latin-variable.woff2'));
  assert.ok(existsSync('public/fonts/inter-latin-ext-variable.woff2'));
  assert.doesNotMatch(index + css + portal, /Georgia|JetBrains|Plus Jakarta|fonts\.googleapis/);
});

test('official contact email is consistent across business data, links and structured data', async () => {
  const { COMPANY_CONTENT, OFFICIAL_EMAIL } = await import('../src/data/content.ts');
  const { JHA_ACCOUNTING_DATA } = await import('../src/data/firmData.ts');
  const { readFileSync } = await import('node:fs');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const React = await import('react');
  const { Footer } = await import('../src/components/Footer.tsx');
  const { TestimonialsCarousel } = await import('../src/components/TestimonialsCarousel.tsx');
  const { FreeToolsSection } = await import('../src/components/FreeToolsSection.tsx');
  assert.equal(OFFICIAL_EMAIL, 'jhacountingsolutions@outlook.com');
  assert.equal(COMPANY_CONTENT.brand.primaryEmail, OFFICIAL_EMAIL);
  assert.ok(COMPANY_CONTENT.officeLocations.every(office => office.email === OFFICIAL_EMAIL));
  assert.equal(JHA_ACCOUNTING_DATA.firm.primaryEmail, OFFICIAL_EMAIL);
  assert.ok(COMPANY_CONTENT.faqs.some(faq => faq.answer.includes(OFFICIAL_EMAIL)));
  const html = readFileSync('index.html', 'utf8');
  assert.ok(html.includes(`"email": "${OFFICIAL_EMAIL}"`));
  const footer = renderToStaticMarkup(React.createElement(Footer, { onNavigate: () => {}, onOpenBookingModal: () => {} }));
  const about = renderToStaticMarkup(React.createElement(TestimonialsCarousel));
  assert.ok(footer.includes(`mailto:${OFFICIAL_EMAIL}`));
  assert.ok(footer.includes(OFFICIAL_EMAIL));
  assert.ok(about.includes(`mailto:${OFFICIAL_EMAIL}`));
  const tools = renderToStaticMarkup(React.createElement(FreeToolsSection, { onOpenBookingModal: () => {} }));
  assert.ok(tools.includes(`mailto:${OFFICIAL_EMAIL}`));
});

test('retired contact address is absent from repository source and configuration', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const retiredAddress = ['rishijha', 'tuta.io'].join('@');
  const files: string[] = ['index.html', 'server.ts', 'firestore.rules', 'firebase-applet-config.json', 'firebase-blueprint.json', 'metadata.json', 'vercel.json'];
  const walk = (dir: string) => { for (const entry of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, entry.name); if (entry.isDirectory()) walk(path); else if (/\.(tsx?|jsx?|html|json|md|css)$/.test(path)) files.push(path); } };
  ['src', 'public', 'api', 'docs'].forEach(walk);
  for (const file of files) assert.ok(!readFileSync(file, 'utf8').toLowerCase().includes(retiredAddress), `retired contact address in ${file}`);
});

test('client portal transition links to the requested software', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { CLIENT_PORTAL_URL } = await import('../src/config/portal.ts');
  const { LoginRedirectModal } = await import('../src/components/LoginRedirectModal.tsx');
  assert.equal(CLIENT_PORTAL_URL, 'https://jhacountingsolution.vercel.app');
  const html = renderToStaticMarkup(React.createElement(LoginRedirectModal, { isOpen: true, onClose: () => {} }));
  assert.ok(html.includes(`href="${CLIENT_PORTAL_URL}"`));
  assert.match(html, /Taking you to/);
  assert.match(html, /Stay on this website/);
  assert.match(html, /role="dialog"/);
  assert.doesNotMatch(html, /SSL Handshake|256-Bit Encrypted Channel/);
});

test('GST calculator handles inclusive, exclusive and invalid amounts', async () => {
  const { calculateGst } = await import('../src/lib/gst.ts');
  const intra = calculateGst(1000, 18, false, 'intra');
  assert.equal(intra.total, 1180);
  assert.equal(intra.cgst, 90);
  assert.equal(intra.sgst, 90);
  assert.equal(intra.igst, 0);
  const inter = calculateGst(1180, 18, true, 'inter');
  assert.equal(inter.base, 1000);
  assert.equal(inter.igst, 180);
  assert.equal(inter.total, 1180);
  assert.equal(calculateGst(Infinity, 18, false, 'intra').total, 0);
  assert.equal(calculateGst(-10, 18, false, 'intra').total, 0);
});

test('both tools use the shared Inter theme and accessible controls', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { readFileSync } = await import('node:fs');
  const { FreeToolsSection } = await import('../src/components/FreeToolsSection.tsx');
  const calculator = renderToStaticMarkup(React.createElement(FreeToolsSection, { initialTab: 'calculator', onOpenBookingModal: () => {} }));
  const dates = renderToStaticMarkup(React.createElement(FreeToolsSection, { initialTab: 'dates', onOpenBookingModal: () => {} }));
  assert.match(calculator, /jas-free-tools/);
  assert.match(dates, /jas-free-tools/);
  assert.match(calculator, /for="gst-amount"/);
  assert.match(calculator, /role="switch"/);
  assert.match(calculator, /aria-pressed="true"/);
  assert.match(readFileSync('src/index.css', 'utf8'), /\.jas-free-tools[^\n]*font-family:var\(--jas-font\)/);
});

test('browser security information makes no unverified security grade claims', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { readFileSync } = await import('node:fs');
  const { SecurityAudit } = await import('../src/components/SecurityAudit.tsx');
  const html = renderToStaticMarkup(React.createElement(SecurityAudit));
  assert.match(html, /not a security audit/);
  assert.match(html, /do not verify TLS configuration/);
  assert.doesNotMatch(html, /Grade A\+|TLS 1\.3 Active|verified safe/);
  const dashboard = readFileSync('src/pages/ClientDashboardPage.tsx', 'utf8');
  assert.doesNotMatch(dashboard, /Grade A\+|Inspect Full Audit/);
});

test('public app reuses the auth provider and separates lazy home sections', async () => {
  const { readFileSync } = await import('node:fs');
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.match(app, /const \{ user: currentUser \} = useAuth\(\)/);
  assert.doesNotMatch(app, /onAuthStateChanged/);
  for (const component of ['TestimonialsCarousel', 'VirtualCfoSpotlight', 'SupportingTools', 'ContactFormAndOffices', 'SupportingResources']) {
    assert.match(app, new RegExp(`<Suspense fallback=\\{<Skeleton className="h-64 w-full" \\/>\\}><${component}\\b`));
  }
});
