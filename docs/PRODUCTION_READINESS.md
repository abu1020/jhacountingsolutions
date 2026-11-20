# Production readiness and operations

## Data and deployment

- Both public inquiry forms write to the `inquiries` Firestore collection and only show success after the Firestore write resolves. The returned document ID is the reference. The legacy `/api/contact` endpoint does not persist data and now returns 503 instead of a false success. There is no automatic email or WhatsApp delivery integration.
- `firestore.rules` contains tightened proposed rules. **A repository merge or Vercel deployment does not deploy Firestore rules.** Test these rules in the Firebase emulator against a representative copy of existing documents and all client/admin workflows, then deploy them explicitly to the configured named Firestore database. Until deployment, existing production rules remain in force. Review entitlement provisioning before deployment: owners cannot change `plan` or `unlockedSoftware`; use a trusted administrative backend for grants.
- The current public Firestore create flow has no effective per-IP rate limiting. Configure and enforce Firebase App Check for the web app after testing, and use appropriate quota/abuse monitoring. App Check is not a replacement for authorization or server-side rate limiting. A trusted ingestion endpoint with distributed rate limits would be needed for stronger abuse control.
- The current admin gate uses verified email allowlists in Firebase rules. Prefer custom claims provisioned through a trusted server. Firebase web API keys identify the project and are not authorization secrets; restrict their allowed APIs and origins in Google Cloud. Never place service-account credentials in client code or the repository.
- CRM metadata uses a local cache. A failed cloud write is reported, but there is no automatic retry, multi-user conflict resolution, or guaranteed cross-device synchronization. Do not treat local-only changes as backed up. Export access-controlled Firestore backups on a schedule, verify restore procedures, and define retention and incident-response policies.
- Access-request approval records a decision; it does not itself grant an entitlement in an external software product. That integration requires a trusted provisioning service.

## Verification limits

`npm test`, `npm run lint`, and `npm run build` cover the local checks. The tests do not replace Firestore emulator authorization tests, authenticated end-to-end testing, browser/device testing, accessibility review, or performance measurements. Run these against staging with real Firebase configuration before relying on the application for confidential data. Measure LCP, INP and CLS with real-user monitoring and throttled lab tests; no performance targets are claimed here.

The dependency audit uses npm's resolved production dependency tree. `@grpc/grpc-js` is overridden to a patched version because the Firebase dependency pins an older affected range; verify Firestore integrations after dependency updates. Re-run the audit regularly. A passing dependency audit is not a security certification.
