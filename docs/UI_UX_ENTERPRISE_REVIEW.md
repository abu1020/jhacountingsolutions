# Jha Accounting Solutions — Principal UI/UX Review & Enterprise Action Plan

| | |
|---|---|
| **Scope** | React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Firebase. ~9,800 LOC, 36 components, 3 pages. |
| **Review type** | Code-grounded UX architecture, visual system, motion system and performance audit. Every finding cites the file it was observed in. |
| **Verdict** | A strong *marketing site* wrapped around a *placeholder product*. The visual identity (navy/emerald) is sound; the design *system*, the portal information architecture, and the security posture are not yet enterprise-grade. All three are fixable in phases — Phase 1 is already implemented on this branch (§5). |

---

## Executive scorecard (evidence from the codebase)

| Dimension | State today | Evidence |
|---|---|---|
| Brand identity | ✅ Good foundation | Consistent `#0B1F3A` navy + `#10B981` emerald; Inter / Plus Jakarta Sans / JetBrains Mono (`index.html`, `src/index.css`) |
| Design tokens | ❌ Defined, then bypassed | `@theme` tokens exist in `src/index.css`, yet **446 hard-coded hex literals** across `.tsx` files duplicate them |
| Motion system | ⚠️ Fragmented | **Two animation libraries installed** (`framer-motion@14` + `motion@12`); only 4 files use either. Rest is ad-hoc CSS. Two referenced animations (`animate-indeterminate`, `animate-splash-stroke`) **were never defined** — silently dead |
| Performance | ⚠️ Heavy shell | Baseline build: main chunk **581 kB (177 kB gzip)** + Firebase **486 kB (147 kB gzip)**, both eager. All 4 modals in the initial bundle. 14 Google Font weights |
| Client portal UX | ❌ Placeholder | "Dashboard" and "My Software" rendered the **identical view** (`activeTab === 'dashboard' \|\| 'software'`). No filing status, no deadlines, no documents — the core product loop is invisible |
| Admin UX | ❌ Modal-as-an-app | Entire admin workspace is a modal (`AdminPortalModal.tsx`) with a 420 px nested scroll trap, `any[]` data, unfiltered CSV export, dead-end empty states |
| Data integrity | ❌ Schema drift hidden by `any` | `AdminAssessmentsTab` rendered `businessType`/`turnoverBand`/`gstStateCount`; Firestore stores `entityType`/`annualTurnover` (`src/lib/firebase.ts`). Real records silently showed fallback text |
| Accessibility | ❌ Largely absent | 121 `<button>`s vs **13** `aria-*` usages. No dialog semantics, no Esc-to-close, 10–12 px form text, colour-only status |
| GST filing / mismatch / DSC / e-KYC | ❌ **Do not exist as UI** | These workflows appear only as marketing copy (`src/data/firmData.ts`, `content.ts`). §1.1–1.3 are therefore *greenfield blueprints*, not refactors |
| Security posture | 🔴 Critical (§0) | Hard-coded admin passcode shipped in the public JS bundle; Firestore lead PII is world-readable |

---

## 0. P0 — Trust blockers (fix before any visual polish ships)

Visual authority is worthless if the underlying posture contradicts it. A finance client (or their IT due-diligence) *will* View Source.

### 0.1 Hard-coded admin passcode + world-readable PII (coupled bug)

- `AdminPortalModal.tsx` compares against a literal passcode compiled into the public bundle. Anyone can extract it in seconds.
- It only "works" because `firestore.rules` sets `allow read: if true` on `/inquiries` and `/scopeAssessments` — every lead's name, email and phone is readable by anyone on the internet, no auth needed. `/users` and `/accessRequests` are readable by *any* signed-in user (not just the owner/admin).

**Fix them together, in this order** (annotated in both files on this branch; deliberately *not* half-fixed in code because removing the passcode before claims exist locks the owner out, and tightening rules first breaks the current admin):

1. Set an `admin` custom claim on the partner's Firebase Auth user (Admin SDK / `firebase auth` tooling — server-side only).
2. Tighten rules:
   ```javascript
   function isAdmin() { return request.auth != null && request.auth.token.admin == true; }
   match /inquiries/{id}        { allow create: if <existing validation>; allow read: if isAdmin(); }
   match /scopeAssessments/{id} { allow create: if <existing validation>; allow read: if isAdmin(); }
   match /users/{userId}        { allow read: if isAdmin() || isOwner(userId); /* ... */ }
   ```
3. Delete the passcode path; gate `AdminPortalModal` on `user.getIdTokenResult().claims.admin`. Google sign-in button already exists.
4. Rotate the exposed passcode anywhere it was reused, and assume historical lead data was public — assess DPDP Act notification obligations with counsel.

### 0.2 Three competing "portals"

Navbar login redirects to an external `*.vercel.app` URL (`Navbar.tsx: handleClientLoginClick`), `ClientPortalModal` is a second portal surface, `ClientDashboardPage` a third. Users cannot learn where "the product" lives.

**Fix:** one canonical origin + route (`/app` or `app.jhaaccounting.com`). Modal becomes a *launcher/sign-in* only; all work happens in `ClientDashboardPage`. Remove the external redirect.

### 0.3 `alert()` as an error system

`ContactConsultationModal` and `AccessRequestModal` use `window.alert()` for validation/submission failures — browser chrome in a "bank-grade" product, and invisible to your error tracking. Replace with inline field errors + a toast system (§1.5).

---

## 1. UX Architecture — reducing friction in heavy compliance work

### 1.0 Target information architecture

```
Marketing site (current home/blog)          Product — /app (authenticated shell)
├─ Hero, Stats, Services, GST Map, Tools    ├─ Overview        (filing cycle, deadlines, attention queue)
├─ Insights (blog)                          ├─ GST Filing      (per-GSTIN pipeline → §1.1)
└─ Consultation / Scope intake (forms)      ├─ Reconciliation  (2B mismatch work queue → §1.2)
                                            ├─ Documents & DSC (vault, signing queue → §1.3)
   Admin → promote from modal to /admin     ├─ e-KYC & Entity  (verification status → §1.3)
   route with real table UX (§1.4)          ├─ Software Hub    (current catalog)
                                            ├─ Billing & Plan
                                            └─ Support (ticket timeline, not just WhatsApp)
```

Design principles for tax-heavy data entry (apply everywhere below):

1. **The work queue *is* the home screen.** Accountants don't browse; they clear queues by deadline. Lead with "needs attention," not welcome banners.
2. **Never make them re-type an identifier.** GSTIN/PAN/TAN entered once, validated by checksum, reused everywhere, copyable in one click.
3. **Keyboard-first density.** Filing week = hundreds of rows. Every list needs `/` to search, `j/k` or arrows to move, `Enter` to open, bulk select. Mouse-only card grids fail at scale.
4. **Optimistic, resumable, autosaved.** Long forms (scope assessment, onboarding) save drafts per-field; leaving mid-way must never lose work.
5. **Status is icon + text + colour** — never colour alone (WCAG 1.4.1), and every status shows *who/what is blocking it* and *since when*.

### 1.1 Client Dashboard (`src/pages/ClientDashboardPage.tsx`)

**Today:** a software launcher. Dashboard ≡ Software (same JSX), static banners, avatar header, no compliance data, sidebar overflows content on mobile with no scrim.

**Implemented on this branch (Phase 1):**
- Dashboard and Software split into real, distinct views with keyed panel transitions and a shared-element nav pill (`layoutId`).
- **Monthly GST Filing Cycle stepper** — GSTR-1 (11th) → GSTR-2B Reconciliation (14th) → GSTR-3B (20th) → DSC/EVC sign-off — highlighting the current stage from today's date. Explicitly labelled a *schedule* view (never fake a "Filed" state; receipts are truth).
- **This Month's Compliance Schedule** computed from the existing `JHA_ACCOUNTING_DATA.taxCalendar` (`src/data/firmData.ts`) with passed / due-today / due-soon / upcoming chips.
- Mobile drawer scrim + click-outside close, `aria-current` navigation.

**Next (P1–P2), the real filing pipeline per GSTIN:**

```
GSTIN 07AABCS1429B1Z6 · Delhi · Monthly          [Copy GSTIN] [Switch entity ⌘E]
┌────────────┬──────────────┬────────────┬──────────────┬─────────────┐
│ Sales data │ GSTR-1       │ 2B Recon   │ GSTR-3B      │ DSC Signed  │
│ ✓ Locked   │ ✓ ARN AA07…  │ ⚠ 3 blocks │ ○ Draft      │ ○ Pending   │
└────────────┴──────────────┴────────────┴──────────────┴─────────────┘
  Attention: 3 mismatches block ₹1.84L ITC → [Resolve]
```

- One row per GSTIN; stage chips link *directly* to the blocking task (mismatch queue filtered to that GSTIN). Friction budget: **login → blocking task in ≤ 2 clicks**.
- Entity switcher (`⌘E`) for multi-company clients; the active entity context persists across every screen (sticky sub-header) so a user never files under the wrong GSTIN — the single most expensive error class in this domain.
- Replace the hash-string tab state with URL routes (`/app/filing/:gstin`) so support can deep-link a client to the exact screen during a WhatsApp/call session.

### 1.2 Mismatch resolution (greenfield — highest-value screen you'll build)

Your own content already defines the model (`firmData.ts`: Exact Match / Tolerance Difference / Missing in 2B). Build the queue around it:

| Pattern | Specification |
|---|---|
| Queue, not spreadsheet | Left: mismatch list grouped by vendor, sorted by **₹ ITC at risk** (desc). Right: detail pane. Header metric always visible: `₹X ITC blocked · N invoices · M vendors` |
| Diff-first detail | Side-by-side "Books vs 2B" rows; differing cells highlighted with the delta (`Taxable ₹1,00,000 → ₹10,000 (−90%)`), never two raw tables to eyeball |
| One-click resolutions | Accept-as-per-2B, Accept-with-tolerance (≤ ₹100 / ≤1%), Raise vendor dispute (pre-filled email/WhatsApp from the row), Hold vendor payment — as explicit buttons with consequences stated inline |
| Bulk + keyboard | Checkbox bulk-accept for the tolerance bucket; `a` accept, `d` dispute, `j/k` next/prev. Target: clear 100 tolerance rows in < 2 minutes |
| Audit trail by default | Every resolution stamps user, timestamp, rule applied — visible in a right-rail activity log (your auditors will ask; build it now) |

### 1.3 Digital signatures (DSC) & e-KYC (greenfield blueprints)

**DSC signing queue:** treat signing like code-review approvals.
- Queue of "Ready to sign" returns with pre-sign *summary sheet* (tax payable, ITC claimed, deltas vs last month) — the signer must never open the raw return to feel safe.
- Stepper: `Review summary → Confirm liability (explicit checkbox with ₹ amount) → Sign (DSC PIN / EVC OTP) → Receipt (ARN + timestamp + download)`. Progress is textual + linear; back-navigation safe; session-expiry recovers to the exact step.
- OTP inputs: 6-box segmented control, `autocomplete="one-time-code"`, paste-friendly, auto-advance, visible expiry countdown, resend with rate-limit copy. Errors must not clear the form.
- DSC expiry is a *dashboard-level* alert 30/15/7 days out — DSC lapses discovered on the 20th are a churn event.

**e-KYC / onboarding:** `src/pages/SetupPage.tsx` + `ClientProfileView` are today's seeds.
- Chunked wizard (Entity → GSTIN(s) → PAN/Aadhaar e-KYC → Authorised signatory → DSC status → Billing), one decision per screen, persistent progress rail, **autosave per field** with "Draft saved · 10:42" trust copy.
- Document upload: drag-drop + camera capture on mobile, client-side preview/crop, file-type/size validation *before* upload, resumable progress, and a checklist that flips to "Under verification" with SLA copy — never a silent void.
- Masked display everywhere (`PAN AAAPC••••A`, Aadhaar `•••• •••• 1234`) with reveal-on-hold; never render full identifiers in lists/exports.

### 1.4 Admin Assessments Tab (`AdminAssessmentsTab.tsx` / `AdminInquiriesTab.tsx` / `AdminPortalModal.tsx`)

**Implemented on this branch:**
- `any[]` → typed contracts (`src/types/admin.ts`), which exposed the schema drift in §scorecard; normalisers absorb legacy field names.
- Memoised filter + newest-first sort; export now exports the **filtered** set the admin actually sees.
- Recoverable empty states ("No matches for 'xyz' → Clear filter"), tap-to-email/call, staggered row entrances, skeleton a11y.

**Next (P2) — graduate from cards-in-a-modal to a work queue:**
1. Promote Admin to a route (`/admin`) with full-height layout; kill the modal + 420 px scroll trap.
2. Dense table (48 px rows, sticky header, column sort, resizable) with a **status pipeline**: `New → Contacted → Quoted → Onboarded → Lost` as a segmented filter + per-row status select. Today a lead has no state — it can only pile up.
3. Row click → slide-over detail (full scope answers, timeline, quick actions: WhatsApp deep-link prefilled, create quote, assign owner) without losing list position.
4. Virtualise past ~100 rows; paginate Firestore queries (`orderBy(createdAt desc) + limit`) instead of `getDocs(collection)` full scans + client `.reverse()`.
5. Saved filters ("Uncontacted > 24h", "Turnover > ₹5 Cr") as chips — the two questions the partner asks daily.

### 1.5 Forms & modals (all intake surfaces)

- **Validation:** inline, on-blur, with `aria-describedby` errors and an error summary on submit. GSTIN `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$` + state-code check; PAN `[A-Z]{5}[0-9]{4}[A-Z]`; phone normalised to `+91`. Auto-uppercase identifier fields; never punish casing.
- **Input legibility:** portal/modal inputs are `text-xs` (12 px) JetBrains Mono today. Body inputs → 14 px Inter (16 px on mobile to stop iOS focus-zoom); mono reserved for values being verified character-by-character (GSTIN, ARN, OTP).
- **Dialog system:** `useDialog` hook + `role="dialog" aria-modal` shipped on this branch for all 4 modals (Esc + scroll-lock). P1: focus-trap + initial-focus + focus-return, then extract a shared `<Modal>` shell so `scaleInPanel` motion and behaviour are defined once.
- **Toast system** replacing `alert()` and the orphaned `toastMessage` in `AuthContext`: success/error with undo where destructive, `aria-live="polite"`, max 3 stacked.

### 1.6 GST State Detail Cards (`GstStateDetailCard.tsx` + `IndiaGstMap.tsx`)

**Implemented:** keyed cross-fade between states (`AnimatePresence mode="wait"`, was an instant swap), staggered detail tiles, full legal text (removed `line-clamp-1` truncation of e-Way/PT rules), one-click copy of the state code, `aria-pressed` selectors, 100% token-based colours.

**Next:** pin/compare two states side-by-side (the actual CA workflow when advising on a new registration); deep-link `?state=27` for shareable advice; show *distance to deadline* for the PT date, not just the date; keyboard arrow navigation through the state list (`listbox` pattern).

---

## 2. Visual authority — colour, type and component styling for trust

Your instinct (deep navy + emerald + mono accents) is exactly right for finance. What's missing is *discipline*: the same five hex values re-typed 446 times, mono used for prose, and status colour used decoratively.

### 2.1 Colour: formalise the scale you already have

All values below already exist as literals in your code — this branch names them in `@theme` (`src/index.css`) and migrates `GstStateDetailCard` as the reference (zero visual change):

| Token | Hex | Role |
|---|---|---|
| `navy-950` | `#070D1F` | Portal app backdrop |
| `navy-900` | `#071528` | Input wells, deepest panels |
| `navy-850` | `#0B1F3A` | Primary brand surface / headlines on light |
| `navy-800` | `#102A4E` | Raised card on navy |
| `navy-700` | `#132D52` | Hover state, header strips |
| `navy-600` | `#162D4F` | Hairline borders on navy |
| `navy-500` | `#1E3B66` | Strong borders on navy |
| `corporate-emerald` | `#10B981` | Single accent: primary action, filed/verified, links on navy |
| `corporate-emerald-hover` | `#059669` | Accent hover/active |

Rules that create "precision":
1. **One accent.** Emerald = action or verified-good. Amber/rose/sky are *status-only*, never decoration (the amber "FLAGSHIP" badge + amber business-type chips dilute this today — reserve amber for `status-pending`).
2. **Semantic status tokens** (added): `status-filed #059669`, `status-pending #D97706`, `status-overdue #E11D48`, `status-info #0284C7`. Always paired with icon + text.
3. **Contrast check your small text:** `slate-400` 10–11 px on `navy-800` sits ≈ 4.0:1 — below WCAG AA for small text (4.5:1). Metadata floor: `slate-300` on navy, and nothing informational under 11 px.
4. Light marketing / dark portal split is good (signals "product mode") — keep it, but use *the same tokens* on both sides so components can move across.

### 2.2 Typography hierarchy

| Role | Font | Usage rule |
|---|---|---|
| Display | Plus Jakarta Sans 700/800 | Headlines, KPI numbers, card titles only |
| Body/UI | Inter 400/500/600 | Everything else — including nav labels and form inputs |
| Mono | JetBrains Mono 500/600 | Identifiers & machine values ONLY: GSTIN, PAN, ARN, state codes, timestamps, tabular meta-labels |

- **Stop setting prose and labels in mono.** Dashboard nav, support tables and form labels are currently `font-mono` — mono at 11–12 px reads ~20% slower and looks "terminal," not "bank." Keep mono for the eyebrow-label *style* (uppercase tracking) if you love it, but render it in Inter 600.
- **Numbers are your typography.** Every ₹ amount, count and date gets `tabular-nums` (shipped in `CountingNumber`, admin tabs, deadline chips on this branch) so columns align and digits don't jitter while counting.
- **Font diet:** 14 weights load today. Cut to Inter 400/500/600/700, Jakarta 700/800, JetBrains 500/700 (≈ 40% fewer font bytes, faster LCP) and self-host or `font-display: optional` for the portal.
- Type scale floor: body 14 px in product, 12 px only for dense table meta, 11 px only for uppercase eyebrows, **10 px never**.

### 2.3 Component styling rules (encode these in the token layer)

- **Elevation:** your `shadow-soft-*` scale is good — keep. On navy surfaces, prefer 1 px borders (`navy-600/500`) over shadows; shadows disappear on dark.
- **Radius rhythm:** `rounded-xl` controls, `rounded-2xl` cards, `rounded-3xl` page panels/modals. Mostly true today — make it law.
- **Density modes:** marketing = comfortable (16–24 px padding); product tables = compact (40–48 px rows). One `density` prop on table components, not new components.
- **Focus is a brand moment:** one global `:focus-visible` emerald outline shipped this branch (`src/index.css`); components may add rings but never remove visibility.
- **Trust signals, placed not plastered:** keep "Audit-Ready · 100% Compliant" chips, but anchor them near the action they de-risk (beside Sign / Pay / Submit), each with a verifiable referent (ARN, timestamp, signer). Remove the macOS traffic-light dots in the hero console — they read "mockup," not "product."
- **Data-viz:** charts in navy/emerald/slate only; gridlines `navy-500` dashed (already your hero pattern); always label axes/units — unattributed curves are decoration, and finance users discount them.

---

## 3. Animation integration — one library, one language, strict budgets

### 3.1 Library decision: consolidate on Framer Motion. Do not add GSAP.

| | Framer Motion (keep) | GSAP (decline for now) |
|---|---|---|
| Fit | Declarative, React-idiomatic; you already use it in 4 components | Imperative timelines; would be a *third* mental model alongside your CSS transitions |
| Cost | Already paid — it's in the initial bundle via `PageTransition`/`ComplianceDeadlineBanner` | +~70 kB min for core+ScrollTrigger to do what `whileInView`/`useScroll` already cover |
| Your needs | Entrances, tabs, modals, counters, SVG draw — all covered | Scroll-scrubbed storytelling, complex SVG morphs — a marketing-site luxury you don't currently need |

Revisit GSAP only if a future landing page needs pinned scroll choreography; load it in that lazy chunk only. **Done on this branch:** removed the unused duplicate `motion` package; all motion flows through `src/lib/motion.ts`.

### 3.2 Motion tokens (`src/lib/motion.ts`, shipped)

One easing family — ease-out-expo `[0.16, 1, 0.3, 1]` (fast attack, soft settle = precision instrument); exits shorter than entrances; hard duration ceilings:

```ts
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const DURATION = { micro: 0.15, fast: 0.20, panel: 0.28, reveal: 0.45 } as const;

export const fadeUp: Variants = { /* 14px rise + fade, capped stagger */ };
export const staggerContainer: Variants = { /* 70ms stagger, 50ms lead */ };
export const scaleInPanel: Variants = { /* modal: scale .97→1 + 8px — never animate width/height */ };
export const crossfadePanel: Variants = { /* tabs & state-card swaps */ };
export const springPill: Transition = { type: 'spring', stiffness: 480, damping: 42 }; // nav/tab indicators
```

Non-negotiable rules: **transform + opacity only** (your old banner animated `height: auto` → layout + CLS; fixed), no permanent `will-change` (old `ScrollReveal`/`LoadingButton` leaked compositor layers; fixed), `prefers-reduced-motion` honoured globally via `<MotionConfig reducedMotion="user">` in `src/main.tsx` + the CSS guard in `src/index.css`.

### 3.3 Micro-interaction catalogue (per surface)

| Surface | Interaction | Spec | Status |
|---|---|---|---|
| **Hero** | Choreographed load: badges → H1 → copy → CTAs → trust strip; dashboard panel settles (scale .985, +250 ms); chart **line draws** via SVG `pathLength` (1.2 s) then area fades, endpoint marker pops | `staggerContainer` + `motion.path` in `HeroSection`/`HeroDashboardIllustration` | ✅ Shipped |
| **Hero CTAs** | Hover lift −1 px, press `scale .98`, arrow nudge 4 px | `whileHover`/`whileTap={tapScale}`, colour via CSS (cheaper) | ✅ Shipped |
| **Scroll reveals** | 14 px rise + fade, `once: true`, fires at 15% visibility + 60 px root margin. **Never re-animates** — re-counting/re-hiding financial data on scroll-back reads as instability | `ScrollReveal` rewritten on `whileInView`, API unchanged → all ~15 call sites upgraded free | ✅ Shipped |
| **Stats bar** | Items stagger in; numbers count with expo settle, `en-IN` grouping, `tabular-nums`; **zero React re-renders** during count (MotionValue → DOM) | `CountingNumber` rewritten; triple-duplicated labels removed | ✅ Shipped |
| **Deadline banner** | Fade/slide-in only; countdown digits tick in an isolated memo component | `ComplianceDeadlineBanner` (+ Rules-of-Hooks bugfix, §5) | ✅ Shipped |
| **GST state switch** | Old card exits −8 px (150 ms) → new card enters +12 px with staggered tiles; copy-code flips to a check for 1.6 s | `AnimatePresence mode="wait"` keyed by state id | ✅ Shipped |
| **Portal navigation** | Emerald pill *glides* between nav items; panels cross-fade 280 ms; mobile scrim fades | `layoutId="client-nav-pill"` + `springPill` | ✅ Shipped |
| **Admin lists** | Rows stagger 40 ms (capped 320 ms) on load/filter; no layout animations (lists can be long) | `motion.li` enter-only | ✅ Shipped |
| **Modals** | Backdrop fade 150 ms; panel `scaleInPanel`; Esc/scrim exit 200 ms | Behaviour ✅ shipped (`useDialog`); panel motion pending shared `<Modal>` shell (P1 — needs `AnimatePresence` at call sites, which currently early-return `null`) | ◐ Partial |
| **Loading states** | Skeleton shimmer (token `animate-shimmer`, now actually emitted); auth indeterminate bar (was a dead class, now defined); skeleton→content cross-fade 150 ms, skeletons shaped like final content, minimum skeleton display ~300 ms to avoid flash | `SkeletonLoader`, `BrandedAuthLoader` | ✅ Shipped (cross-fade = P1 with Modal shell) |
| **Success moments** | Form submit: button spinner → check draw (SVG path) → panel swap; preserve your Reference ID pattern (`JAS-REQ-…`) — it's excellent trust UX | `LoadingButton` states exist; check-draw + `AnimatePresence` swap = P1 | ◐ Partial |
| **Splash** | Keep ≤ 800 ms and *only* cover real boot work; yours does (once per load, reduced-motion skip, 1 s safeguard). Consider deleting once LCP < 2.5 s makes it pure theatre on return visits | `SplashScreen` dead class removed | ✅ Shipped |

**Deliberately rejected:** perpetual floating/breathing cards, parallax on data, magnetic buttons, page-curl transitions. In compliance software, motion that never stops competes with numbers that must be read. Premium = *fast, physical, and finished*.

---

## 4. Implementation roadmap (prioritised)

### Phase 0 — Trust & safety (days, do first)
1. §0.1 claims + Firestore rules + delete passcode (annotated in code on this branch).
2. §0.2 single portal origin; remove external `*.vercel.app` redirect in `Navbar.tsx`.
3. Replace `alert()` with inline errors; wire a minimal toast (§1.5).

### Phase 1 — Foundation (✅ implemented on this branch)
1. **Tokens:** navy scale + status palette in `@theme`; `GstStateDetailCard` fully migrated as reference. Remaining hex literal migration is mechanical — do it per-file as touched, or run one codemod: `bg-[#102A4E]→bg-navy-800`, `border-[#162D4F]→border-navy-600`, `text-[#10B981]→text-corporate-emerald`, etc. Add a lint rule (`no-restricted-syntax` on `\[#`) to stop regression.
2. **Motion system:** `src/lib/motion.ts`, one library (removed `motion`), `MotionConfig reducedMotion="user"`, CSS reduced-motion guard, missing `shimmer`/`indeterminate` keyframes defined.
3. **Primitives upgraded in place (no call-site breakage):** `ScrollReveal` (whileInView, once), `CountingNumber` (MotionValue, zero re-renders), `PageTransition` (shared variants), `Skeleton` (token animation + `role="status"`), `useDialog` on all 4 modals.
4. **Surfaces:** Hero choreography + SVG draw, StatsBar hierarchy fix, GST card transitions + de-truncation, Deadline banner correctness/perf fix, Admin tabs typed/filtered-export/recoverable-empty, Client Dashboard split + filing-cycle stepper + compliance schedule + nav pill + mobile scrim.
5. **Next in Phase 1:** lazy-load the 4 modals + Firebase auth bootstrap (`React.lazy` like your sections), font diet (§2.2), `LazyMotion`+`domAnimation` migration (`motion.` → `m.`, strict) for a further FM weight cut, shared `<Modal>` shell with focus-trap.

### Phase 2 — Product depth (weeks)
- Per-GSTIN filing pipeline + entity switcher + URL routing (§1.1); mismatch work queue (§1.2); DSC queue + e-KYC wizard (§1.3); Admin as routed table workspace with lead status pipeline (§1.4); dashboard data bound to Firestore (replacing the hard-coded "Filed (Receipt #GSTR12984)" strings in `ClientPortalModal` — fake receipts in a finance UI are a liability, remove regardless).

### Phase 3 — Scale & polish
- Command palette (`⌘K`: jump to GSTIN, client, return, action); density toggle; saved filter chips; empty-state illustration system; Storybook (or Ladle) for the token/component library; visual-regression tests on the 6 money screens.

### Performance guardrails (apply to every phase)
- Budget: initial route JS ≤ 200 kB gzip (today 183 + 147 Firebase — Firebase deferral is the lever), per-lazy-chunk ≤ 30 kB gzip, CSS ≤ 20 kB gzip (13.6 today).
- Animate transform/opacity only; cap simultaneous blurred layers (`blur-3xl` glows + `backdrop-blur` modals are your main GPU cost — keep glows static, never animate them; prefer solid overlays on low-end devices via `@media (prefers-reduced-transparency)`).
- Virtualise lists > 100 rows; paginate Firestore reads; `React.memo` row components; keep per-second tickers isolated (pattern in `CountdownText`).
- Add `vite-bundle-visualizer` to CI and fail PRs that grow the main chunk > 5 kB gzip without justification.

### Apply-it-yourself examples (for components not yet touched)

```tsx
// 1) Any section entrance — replace bespoke ScrollReveal delays with variants
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../lib/motion';

<motion.div variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }} className="grid ...">
  {items.map(item => <motion.div key={item.id} variants={fadeUp}>…</motion.div>)}
</motion.div>

// 2) Any tab/segmented control — gliding indicator for ~4 lines
<button className="relative" aria-current={active || undefined}>
  {active && <motion.span layoutId="seg-pill" transition={springPill}
              className="absolute inset-0 bg-corporate-emerald rounded-xl" />}
  <span className="relative z-10">Label</span>
</button>

// 3) Money display — aligned, Indian grouping, mono only for the value
<span className="font-mono tabular-nums">
  ₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
</span>

// 4) Status chip — icon + text + semantic token (never colour alone)
<span className="text-status-filed bg-status-filed/10 border-status-filed/30 ...">
  <FileCheck2 aria-hidden /> Filed · ARN AA070123456789A
</span>
```

---

## 5. What shipped on this branch (file map)

| File | Change |
|---|---|
| `src/lib/motion.ts` *(new)* | Motion tokens & variants — single source of truth |
| `src/types/admin.ts` *(new)* | `LeadInquiry`/`ScopeAssessment` contracts + schema-drift normalisers |
| `src/hooks/useDialog.ts` *(new)* | Esc-to-close + scroll-lock for all modals |
| `src/index.css` | Navy scale + status tokens; `shimmer`/`indeterminate` keyframes; global `:focus-visible`; reduced-motion guard |
| `src/main.tsx` | `MotionConfig reducedMotion="user"` |
| `package.json` | Removed duplicate `motion` dependency |
| `ScrollReveal.tsx` | Framer `whileInView`, once-only, no leaked `will-change`; same props |
| `CountingNumber.tsx` | MotionValue-driven; zero React re-renders; count-once; reduced-motion snap |
| `StatsBar.tsx` | Removed triple-duplicated labels; semantic `<ul>`; staggered entrance |
| `HeroSection.tsx` / `HeroDashboardIllustration.tsx` | Stagger choreography; CTA press feedback; SVG chart stroke-draw |
| `ComplianceDeadlineBanner.tsx` | **Bugfix:** `useMemo` after early return (Rules of Hooks violation); height→transform entrance (CLS); isolated 1 s ticker |
| `GstStateDetailCard.tsx` / `IndiaGstMap.tsx` | Keyed cross-fade; full legal text; copy state-code; `aria-pressed`; 100% token colours |
| `AdminAssessmentsTab.tsx` / `AdminInquiriesTab.tsx` / `AdminPortalModal.tsx` | Typed data; memoised sort/filter; **filtered** CSV export; recoverable empty states; mailto/tel; P0 annotation |
| `ClientDashboardPage.tsx` | Dashboard ≠ Software; filing-cycle stepper; monthly compliance schedule; nav pill + panel transitions; mobile scrim |
| 4 modals, `SkeletonLoader`, `BrandedAuthLoader`, `LoadingButton`, `SplashScreen`, `PageTransition` | Dialog semantics/behaviour; working loader animations; dead classes & permanent `will-change` removed |
| `firestore.rules` | P0 annotation (rules + passcode must migrate together — §0.1) |

**Verification:** `npm run lint` (`tsc --noEmit`) clean and `npm run build` green before and after every change set.

---

## 6. Metrics — baseline vs after Phase 1

| Metric | Baseline (this review) | After Phase 1 |
|---|---|---|
| Bundle (`npm run build`) | Main 581 kB (177 gzip) + Firebase 486 kB (147 gzip) eager | **Main 598 kB (183 gzip)** — +5.7 kB gzip attributed to retained framer-motion features (variants/`whileInView`) now used by Hero/Stats/Reveal; Firebase chunk byte-identical (same hash); Client Dashboard lazy chunk 21.5 → 28.6 kB (7.4 gzip, authenticated only); GST Map lazy chunk 18.1 → 19.3 kB; CSS 13.6 kB gzip. No new libraries; one removed |
| Animation libraries | 2 (`framer-motion` + `motion`) | 1 |
| Dead animation classes | 2 (`animate-indeterminate`, `animate-splash-stroke`) | 0 |
| React re-renders during stat count | ~60/s × 4 counters, re-runs per scroll pass | 0 (MotionValue), runs once |
| Dashboard vs Software views | Identical JSX | Distinct (compliance overview vs catalog) |
| Admin export correctness | Exports unfiltered set | Exports filtered set |
| Admin data typing | `any[]` (drift invisible) | Typed contracts; drift surfaced & normalised |
| Dialog keyboard/screen-reader behaviour | None | Esc, scroll-lock, `role=dialog`/`aria-modal` on all 4 |
| Reduced-motion support | Partial (2 components) | Global (MotionConfig + CSS guard) |

Track next: LCP/INP/CLS (field, via `web-vitals` → GA4 you already load), consultation-form completion rate, admin time-to-first-contact per lead, and (Phase 2) median mismatch-resolution time per 100 invoices.

---

*Prepared as a Principal UI/UX + Frontend review. Phase 1 code is on this branch and verified; Phase 0 requires owner action (Firebase claims) and should precede any marketing push that increases lead volume into a world-readable collection.*
