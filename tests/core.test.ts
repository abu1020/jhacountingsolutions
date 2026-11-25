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

test('shared theme and Inter typography are used by both entry pages', async () => {
  const { readFileSync } = await import('node:fs');
  const index = readFileSync('index.html', 'utf8');
  const portal = readFileSync('public/portal.html', 'utf8');
  const css = readFileSync('src/index.css', 'utf8');
  const theme = readFileSync('public/theme.css', 'utf8');
  assert.match(index, /href="\/theme\.css"/);
  assert.match(portal, /href="\/theme\.css"/);
  assert.match(theme, /--jas-font:\s*'Inter'/);
  assert.match(theme, /inter-latin-variable\.woff2/);
  assert.match(css, /--font-sans:\s*var\(--jas-font\)/);
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

test('optional home sections have separate error recovery and no unsupported push promises', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { SectionErrorBoundary } = await import('../src/components/SectionErrorBoundary.tsx');
  const app = readFileSync('src/App.tsx', 'utf8');
  for (const component of ['TestimonialsCarousel', 'VirtualCfoSpotlight', 'SupportingTools', 'ContactFormAndOffices', 'SupportingResources']) {
    assert.match(app, new RegExp(`<SectionErrorBoundary><Suspense[^\\n]*<${component}\\b`));
  }
  assert.doesNotMatch(app, /PushNotificationManager/);
  assert.equal(existsSync('src/components/PushNotificationManager.tsx'), false);
  assert.match(renderToStaticMarkup(React.createElement(SectionErrorBoundary, null, 'Section content')), /Section content/);
});

test('authentication is strictly Email/Password Admin-only with no registration and external Client Portal redirect', async () => {
  const { readFileSync } = await import('node:fs');
  const firebaseLib = readFileSync('src/lib/firebase.ts', 'utf8');
  const authCtx = readFileSync('src/context/AuthContext.tsx', 'utf8');
  const adminModal = readFileSync('src/components/AdminPortalModal.tsx', 'utf8');
  const app = readFileSync('src/App.tsx', 'utf8');
  const portalHtml = readFileSync('public/portal.html', 'utf8');

  const combined = firebaseLib + authCtx + adminModal + app + portalHtml;
  assert.doesNotMatch(combined, /GoogleAuthProvider|signInWithGoogle|signInWithPopup|signInWithRedirect|createUserWithEmailAndPassword/);
  assert.match(firebaseLib, /signInWithEmailAndPassword/);
  assert.match(adminModal, /type="email"/);
  assert.match(adminModal, /autoComplete="current-password"/);
  assert.match(portalHtml, /https:\/\/jhacountingsolution\.vercel\.app/);
});

test('high-concurrency readiness: zero static Firebase on public home page, resilience helpers, server RAM compression, and enhanced client portal handoff', async () => {
  const { readFileSync } = await import('node:fs');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { retryWithBackoff, getSubmitCooldownRemaining, markSubmitCompleted } = await import('../src/lib/resilience.ts');
  const { LoginRedirectModal } = await import('../src/components/LoginRedirectModal.tsx');

  // 1. Public home components must NOT statically import Firebase (10,000+ visitors stay 100% static)
  const contactForm = readFileSync('src/components/ContactFormAndOffices.tsx', 'utf8');
  const bookingModal = readFileSync('src/components/ContactConsultationModal.tsx', 'utf8');
  const authCtx = readFileSync('src/context/AuthContext.tsx', 'utf8');
  assert.doesNotMatch(contactForm, /import\s+\{[^}]*\}\s+from\s+['"]\.\.\/lib\/firebase['"]/);
  assert.doesNotMatch(bookingModal, /import\s+\{[^}]*\}\s+from\s+['"]\.\.\/lib\/firebase['"]/);
  assert.doesNotMatch(authCtx, /onSnapshot\s*\(|import\s*\([^)]*onSnapshot/);

  // 2. Server has Brotli/Gzip in-memory cache, /healthz, and bounded /api rate limiter
  const serverCode = readFileSync('server.ts', 'utf8');
  assert.match(serverCode, /brotliCompressSync/);
  assert.match(serverCode, /apiRateLimiter/);
  assert.match(serverCode, /\/healthz/);

  // 3. Index preconnects to the external Client Portal
  const indexHtml = readFileSync('index.html', 'utf8');
  assert.match(indexHtml, /rel="preconnect"\s+href="https:\/\/jhacountingsolution\.vercel\.app"/);

  // 4. Retry with backoff recovers from transient failures
  let attempts = 0;
  const recovered = await retryWithBackoff(async () => {
    attempts += 1;
    if (attempts < 2) {
      const err = new Error('transient network error') as Error & { code?: string };
      err.code = 'unavailable';
      throw err;
    }
    return 'ok';
  }, { maxAttempts: 3, baseDelayMs: 5, maxDelayMs: 20 });
  assert.equal(recovered, 'ok');
  assert.equal(attempts, 2);

  // 5. Submit cooldown enforces burst protection
  assert.equal(getSubmitCooldownRemaining('test-form', 5000), 0);
  markSubmitCompleted('test-form');
  assert.ok(getSubmitCooldownRemaining('test-form', 5000) > 0);

  // 6. Upgraded Client Portal modal offers Open in new tab, Pause, Copy portal link, and portal highlights
  const modalHtml = renderToStaticMarkup(React.createElement(LoginRedirectModal, { isOpen: true, onClose: () => {} }));
  assert.match(modalHtml, /Open in new tab/);
  assert.match(modalHtml, /Copy portal link/);
  assert.match(modalHtml, /Pause/);
  assert.match(modalHtml, /GST &amp; ITR Filing Tracker/);
});

test('service images are local, optimized and decorative with preserved booking actions', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { existsSync, statSync } = await import('node:fs');
  const { ServicesSection } = await import('../src/components/ServicesSection.tsx');
  const html = renderToStaticMarkup(React.createElement(ServicesSection, { onOpenBookingModal: () => {} }));
  for (const name of ['gst', 'tax', 'tds', 'bookkeeping']) {
    const file = `public/images/service-${name}.webp`;
    assert.ok(existsSync(file));
    assert.ok(statSync(file).size < 100_000);
    assert.ok(html.includes(`/images/service-${name}.webp`));
  }
  assert.equal((html.match(/loading="lazy"/g) || []).length, 4);
  assert.equal((html.match(/Request a consultation/g) || []).length, 5);
});

test('admin workspace keeps demo explicit and portal copy errors visible', async () => {
  const { readFileSync } = await import('node:fs');
  const workspace = readFileSync('src/components/admin/AdminWorkspace.tsx', 'utf8');
  const login = readFileSync('src/components/AdminPortalModal.tsx', 'utf8');
  const portal = readFileSync('src/components/LoginRedirectModal.tsx', 'utf8');
  assert.doesNotMatch(workspace, /if \(realRecords\.length === 0\) setDemoMode\(true\)/);
  assert.match(workspace, /Demo data is shown/);
  assert.match(login, /aria-labelledby="admin-login-title"/);
  assert.match(login, /event\.key !== 'Tab'/);
  assert.match(portal, /Could not copy the link/);
  assert.doesNotMatch(portal, /execCommand\('copy'\)/);
});

test('sales-focused homepage offers only approved service-specific consultation paths', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { readFileSync } = await import('node:fs');
  const { HeroSection } = await import('../src/components/HeroSection.tsx');
  const { COMPANY_CONTENT } = await import('../src/data/content.ts');
  const html = renderToStaticMarkup(React.createElement(HeroSection, { onOpenBookingModal: () => {}, onExploreServices: () => {} }));
  assert.match(html, /Request a consultation/);
  assert.ok(html.includes(`tel:${COMPANY_CONTENT.brand.directMobileRaw}`));
  for (const service of COMPANY_CONTENT.services) assert.ok(html.includes(`Request a consultation for ${service.title}`));
  assert.equal(COMPANY_CONTENT.services.length, 4);
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.ok(app.indexOf('<ContactFormAndOffices onOpenBookingModal=') < app.indexOf('<SupportingTools onOpenBookingModal='));
  const hero = readFileSync('src/components/HeroSection.tsx', 'utf8');
  assert.match(hero, /onOpenBookingModal\(service\.title\)/);
});

test('bulk client request opens the official WhatsApp number with a draft message', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { BULK_REQUEST_URL, BULK_REQUEST_MESSAGE, BulkRequestLink } = await import('../src/components/BulkRequestLink.tsx');
  const { COMPANY_CONTENT } = await import('../src/data/content.ts');
  const { ServicesSection } = await import('../src/components/ServicesSection.tsx');
  const { Navbar } = await import('../src/components/Navbar.tsx');
  const url = new URL(BULK_REQUEST_URL);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, `/${COMPANY_CONTENT.brand.directMobileRaw.replace(/\D/g, '')}`);
  assert.equal(url.searchParams.get('text'), BULK_REQUEST_MESSAGE);
  const link = renderToStaticMarkup(React.createElement(BulkRequestLink));
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="noopener noreferrer"/);
  assert.match(link, /opens WhatsApp in a new tab/);
  const services = renderToStaticMarkup(React.createElement(ServicesSection, { onOpenBookingModal: () => {} }));
  assert.match(services, /BULK CLIENT MANAGEMENT/);
  assert.ok(services.includes('Request via WhatsApp'));
  const nav = renderToStaticMarkup(React.createElement(Navbar, { currentView: 'home', onNavigate: () => {}, onOpenBookingModal: () => {} }));
  assert.match(nav, /Bulk clients/);
});

test('client directory page filtering searches loaded name, company, ID, phone and email without altering data', async () => {
  const { filterClientPage } = await import('../src/lib/clientDirectoryFilter.ts');
  const first = { id: 'abc123', name: 'Anita', company: 'Example Ltd', email: 'a@example.test', phone: '9876543210', service: '', updatedAt: '' };
  const second = { id: 'xyz', name: 'Raj', company: '', email: 'r@example.test', phone: '1111111111', service: '', updatedAt: '' };
  const page = [first, second];
  for (const query of ['ANITA', ' example ltd ', 'abc123', '9876543210', 'a@example.test']) assert.deepEqual(filterClientPage(page, query), [first]);
  assert.deepEqual(filterClientPage(page, ''), page);
  assert.deepEqual(filterClientPage(page, 'not-here'), []);
  assert.equal(page.length, 2);
});

test('client directory uses server pagination and the existing verified-admin gate', async () => {
  const { readFileSync } = await import('node:fs');
  const integration = readFileSync('src/lib/clientDirectory.ts', 'utf8');
  const page = readFileSync('src/components/clients/ClientDirectory.tsx', 'utf8');
  const modal = readFileSync('src/components/AdminPortalModal.tsx', 'utf8');
  const app = readFileSync('src/App.tsx', 'utf8');
  const rules = readFileSync('firestore.rules', 'utf8');
  assert.match(integration, /getDocsFromServer/);
  assert.match(integration, /limit\(pageSize \+ 1\)/);
  assert.match(integration, /startAfter\(cursor\)/);
  assert.doesNotMatch(integration, /setDoc|updateDoc|deleteDoc/);
  assert.match(app, /pathname === '\/bulk-clients'/);
  assert.match(modal, /isAdminAuthenticated && emailVerified/);
  assert.match(modal, /workspace === 'clients'/);
  assert.match(rules, /allow read: if isAdmin\(\) \|\| isOwner\(userId\)/);
  assert.match(page, /Search applies only to the current page/);
  assert.match(page, /Read-only directory/);
});

test('external free apps are allowlisted and shown in an isolated dialog', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { readFileSync } = await import('node:fs');
  const { FREE_APPS } = await import('../src/config/freeApps.ts');
  const { FreeAppDialog } = await import('../src/components/FreeAppDialog.tsx');
  const { SupportingTools } = await import('../src/components/SupportingTools.tsx');
  assert.deepEqual(FREE_APPS.map(app => app.url), ['https://jhanooks.vercel.app', 'https://jhamanagement.vercel.app', 'https://jhatasks.vercel.app']);
  const tools = renderToStaticMarkup(React.createElement(SupportingTools, { onOpenBookingModal: () => {} }));
  for (const app of FREE_APPS) {
    assert.ok(tools.includes(app.name));
    const dialog = renderToStaticMarkup(React.createElement(FreeAppDialog, { app, onClose: () => {} }));
    assert.match(dialog, /role="dialog"/);
    assert.match(dialog, /referrerPolicy="no-referrer"/);
    assert.match(dialog, /sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"/);
    assert.doesNotMatch(dialog, /Open in new tab|target="_blank"|<a\s/);
    assert.match(dialog, /Google sign-in may open a secure sign-in window/);
  }
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const csp = vercel.headers.flatMap((h: any) => h.headers).find((h: any) => h.key === 'Content-Security-Policy').value;
  const server = readFileSync('server.ts', 'utf8');
  for (const app of FREE_APPS) { assert.ok(csp.includes(app.url)); assert.ok(server.includes(app.url)); }
});
