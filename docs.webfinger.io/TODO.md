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
- [ ] **Social verification backend is down** (`verification-api.webfinger.io` → 521).
- [ ] **Email is broken**: MailChannels retired its free Cloudflare Workers tier
      (now 401). Migrate to an authenticated email provider.
- [ ] Currently on the registration form, social + email verification are disabled
      and labelled "temporarily unavailable" (stop-gap).

### Security / hygiene
- [ ] Secrets (DKIM private key, verification API token) are stored as **plaintext
      Worker vars**. Rotate and move to `wrangler secret put`.
- [ ] Code relies on **implicit globals / non-strict mode** (see CLAUDE.md). The
      rewrite should use explicit declarations / ES modules.
- [ ] Remove leftover debug markers (e.g. `+ "1234"` appended to error pages).
