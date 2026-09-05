# TODO

## Status & direction (2026-07-15)

webfinger.io is **kept and maintained**, but treated as a mature/legacy service.
Plan: a clean **rewrite / tidy-up / fix** when time allows — **no ETA, no feature
expansion**. The service's value is the **identity-verification capability**
(proof-of-control of email / social accounts), which is worth keeping as a
general CSA capability.

### Considered and declined: pivot to AI-agent identity/discovery
Evaluated repositioning webfinger.io toward the AI-agent ecosystem. Declined:
- WebFinger effectively **missed the AI era**. Agent discovery is converging on
  **DNS → `/.well-known/` documents** (e.g. A2A `agent-card.json`), which is
  simpler than adopting a separate protocol.
- WebFinger's only real edge — multi-subject handle resolution (`user@domain`)
  from one endpoint — fits the fediverse, **not** the URL/DNS-addressed agent world.
- The reusable asset is the **verification engine**, not the protocol. No plans to
  expose it for agents at this time (revisit only if a concrete need appears).

## Renewal checklist (for the eventual rewrite)

### Correctness / known bugs
- [ ] **Silent failures**: `handleEmail` / `handleVerification` results are discarded;
      users see a success page even when email/verification fails. Surface real errors.
- [ ] Normalizer bug: `strictNormalizeWebData` writes `github_id = false` in the
      `twitter_id` else-branch (should be `twitter_id`).
- [ ] `strictNormalizeEmailAddress` returns `""` on failure, but several callers
      check `=== false`. Make the contract consistent.

### Operational / dependencies
- [x] **Social verification has been retired.** The backend host was decommissioned
      in early 2026 and the `verification-api/` code has now been removed. See
      `social-verification-retired.md` for what it did and why it is not coming
      back in that form.
- [ ] **Email is broken**: MailChannels retired its free Cloudflare Workers tier
      (now 401). Migrate to an authenticated email provider.
- [x] **Signups are closed.** With no working verification method, POSTs to
      `/apiv1/processing` and `/apiv1/confirmation` return 503 with an explanation
      rather than reporting a success that never happened. The front page says so.
      `/.well-known/webfinger` lookups are unaffected and continue to be served.
- [ ] Re-open signups once at least one verification method works again. This means
      choosing an email provider, or implementing `rel="me"` verification natively
      in the Worker.

### Security / hygiene
- [ ] **Refresh `security.txt` `Expires` every 3 months** (calendar reminder needed —
      not yet created). Each refresh sets the date a further 12 months out, so we
      touch it 4x/year and it is never near expiry. RFC 9116 wants under a year;
      annual renewal is too easy to forget, quarterly keeps a rhythm.
      Field lives in `webservice/src/securitytxt.js`. Requires a deploy to take
      effect. Next due: **2026-12-05** (set `Expires` to 2027-12-05).
      Same treatment needed on other CSA properties — riskrubric.ai is currently
      2050-01-01, cloudsecurityalliance.org expires 2027-01-01.
- [ ] Secrets (DKIM private key, verification API token) are stored as **plaintext
      Worker vars**. Rotate and move to `wrangler secret put`.
- [ ] Code relies on **implicit globals / non-strict mode** (see CLAUDE.md). The
      rewrite should use explicit declarations / ES modules.
- [ ] Remove leftover debug markers (e.g. `+ "1234"` appended to error pages).
