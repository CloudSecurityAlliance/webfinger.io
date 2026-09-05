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
- [x] **Refresh `security.txt` `Expires` every 3 months.** Recurring calendar
      reminder created 2026-09-05, first firing 2026-12-07. Each refresh sets the
      date a further 12 months out, so we touch it 4x/year and it is never near
      expiry. RFC 9116 wants under a year; annual renewal is too easy to forget.
      Field lives in `webservice/src/securitytxt.js`; requires a deploy to take
      effect (see `DEPLOY.md`). Currently 2027-09-05.
- [ ] Apply the same treatment to other CSA properties — riskrubric.ai is
      currently 2050-01-01 (non-conformant), cloudsecurityalliance.org expires
      2027-01-01. Both are outside this repo.
- [x] **Secrets removed from `wrangler.toml` entirely** (2026-09-05). `DKIM_*` and
      `API_*_VERIFICATION` were plaintext Worker vars; nothing in the bundle reads
      them any more, so they were deleted rather than migrated. The config now holds
      no secret material.
      Context: the DKIM signing key for this domain had been publicly disclosed since
      January 2023 in a fork of this repo that committed `wrangler.toml` before
      `.gitignore` covered it. The `mailchannels._domainkey.webfinger.io` DNS record
      has been deleted, so the disclosed key can no longer authenticate anything, and
      `relay.mailchannels.net` was dropped from SPF. Mail now goes solely via Google
      Workspace under the `google` selector.
- [ ] If a secret is ever needed again, use `wrangler secret put` — never
      `[env.production.vars]`, which is a plaintext file that can be committed.
- [ ] Code relies on **implicit globals / non-strict mode** (see CLAUDE.md). The
      rewrite should use explicit declarations / ES modules.
- [ ] Remove leftover debug markers (e.g. `+ "1234"` in `logicConfirmation.js`).
      Not currently shipped — that module is no longer imported by `index.js` since
      signups closed — but it should go in the rewrite.
