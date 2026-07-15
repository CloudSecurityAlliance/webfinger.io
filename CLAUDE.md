# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

webfinger.io is a public [WebFinger](https://webfinger.net/) service (a Cloud Security Alliance research
project) that links a person's email address and social-media accounts to their Mastodon ID, after proving
control of the linked identity. Anyone can then resolve `acct:user@domain` to the linked Mastodon account.
The service's whole reason for existing is *strong proof of control* before a link is published, so most of
the code is verification and normalization logic, not plumbing.

## Two-tier architecture (this is the key thing to understand)

The system is split across two runtimes with a trust boundary between them:

1. **`webservice/`** — a **Cloudflare Worker** (the public site + API). It handles registration, email
   verification, WebFinger lookups, and stores all state in Cloudflare KV. It never scrapes anything itself.
2. **`verification-api/`** — a **PHP script on a Linux host** that proves control of *social-media* accounts.
   The Worker POSTs a verification job to it; the PHP script drives **headless Chrome inside a VPN'd network
   namespace** (`ip netns exec ns1 google-chrome ... --dump-dom`) to fetch the profile page, greps it for the
   claimed Mastodon ID, and — only on a match — calls back to the Worker's `/apiv1/confirmation` endpoint
   with `curl` to create the record.

Email proof of control uses a different, self-contained mechanism (a mailed confirmation link), so email
verification lives entirely in the Worker and does **not** touch the PHP API.

### The verification flow (social media)

```
browser → Worker /apiv1/processing (POST form)
        → logicProcessing.js writes a 1-hour "auth" KV record + calls handleVerification()
        → PHP validation.php (headless Chrome in netns/VPN scrapes profile, greps for Mastodon ID)
        → on match, PHP curls Worker /apiv1/confirmation (POST) with the CALLBACK_TOKEN
        → logicConfirmation.js checks token matches the auth KV record, then writes the permanent "data" record
```

The callback is authenticated **only** by the per-request UUID token (`CALLBACK_TOKEN`) matching the value
stashed in the auth KV namespace. The PHP endpoint itself is gated by a shared `API_TOKEN_VERIFICATION`.

## Cloudflare Worker specifics (`webservice/`)

- **Legacy service-worker format**, not ES modules. Entry point registers `addEventListener('fetch', ...)`
  in `src/index.js`, which routes by method (`handlePOSTRequest` / `handleGETRequest`) then by pathname.
- **Wrangler v2** (`wrangler` 2.1.10, pinned). Commands:
  - `cd webservice && npm install`
  - `npm start` → `wrangler dev` (local dev)
  - `npm run deploy` → `wrangler publish`. **Production deploys need the env:** `wrangler publish --env production`
    (the `[env.production]` block in `wrangler.toml` binds the real KV namespaces and vars).
- **Config is not committed.** Copy `wrangler-EXAMPLE.toml` → `webservice/wrangler.toml` (gitignored) and fill
  in KV namespace IDs, DKIM keys, and the verification-API URL/token.
- No test suite, linter, or build step. Ad-hoc testing is done with the `wget`/`curl` one-liners left in
  comments at the top of `index.js`, `logicProcessing.js`, and `validation.php`.

### Ambient globals — important gotcha

The Worker relies on injected/implicit globals rather than imports or a strict module scope:

- **KV bindings** `webfingerio_prod_auth` and `webfingerio_prod_data`, and **env vars** `DKIM_DOMAIN`,
  `DKIM_SELECTOR`, `DKIM_PRIVATE_KEY`, `API_URL_VERIFICATION`, `API_TOKEN_VERIFICATION` are all defined in
  `wrangler.toml` and appear as **global identifiers** at runtime — they are never imported.
- Much of the logic (`logicProcessing.js`, `logicConfirmation.js`, `webfinger.js`, `strictNormalize.js`)
  assigns to **undeclared variables** (e.g. `processing_results = {}`, `uuid_value`, `KVkeyValue`, `requestURL`).
  This only works because the service-worker format runs in non-strict mode. Do **not** add `"use strict"` or
  convert to ES modules without deliberately declaring these; you will break the request handlers.

### KV data model

Two namespaces, one temporary and one permanent:

- **`webfingerio_prod_auth`** — short-lived pending-verification records, written with `{expirationTtl: 3600}`
  (1 hour). Their existence also serves as an anti-abuse lock so a second request for the same identity is
  ignored (returns `ERROR:AUTH_KEY_EXISTS`) rather than re-sending mail / re-triggering scraping.
- **`webfingerio_prod_data`** — permanent published records.

Key naming conventions (built by hand throughout the code):

| Identity type | KV key format |
|---|---|
| Email | `email:<domain>:<localpart>` |
| GitHub | `github:<name>` |
| Reddit | `reddit:<name>` |
| Twitter | `twitter:<name>` |

Email keys deliberately split domain-first so blocked domains can be reasoned about later. Record values are
JSON, typically `{ "token", "mastodon_id", "action" }` (auth) or `{ "mastodon_id", "block_email" }` (data).

## Normalization is the security layer (`strictNormalize.js`)

All inbound data (both POST body and GET params) is funneled through `strictNormalizeWebData()` before use.
Per-field normalizers enforce strict formats and return one of three states, which downstream code depends on:

- **missing entirely** → `false` ("field not present")
- **present but invalid** → `""` (caller should surface a helpful error)
- **valid** → the normalized value

Notable rules:
- **Email**: lowercased, `+tag` suffix stripped, and **dots removed from the local part** (Gmail-style
  canonicalization) so `f.o.o+bar@x.com` and `foo@x.com` collapse to one identity — this is what makes proof
  of control meaningful.
- **Mastodon ID**: accepts `@user@server`, `https://server/@user`, or `server/@user` and normalizes to
  `@user@server`.
- GitHub/Reddit/Twitter names have their own length + regex constraints.

WebFinger output is also re-normalized on the way *out* (`webfinger.js`) rather than trusted from storage.
When touching any request-handling path, run values through the appropriate normalizer; don't hand-roll
validation.

## HTML/email content generation

There is no template engine. Pages and emails are generated by `getHtml*` / `getEmail*` functions
(`htmlContent*.js`, `emailContentProcessing.js`) that take a `status` string selecting a variant plus an
optional `data` object for substitution. `htmlContentProcessingNew.js` is the current processing-page
generator (the older `htmlContentProcessing.js` is imported only by `logicProcessing.js` for emails).
Static assets (CSS/fonts/images) are **not** served by the Worker — they're hosted separately at
`assetswebfingerio.pages.dev` (a Cloudflare Pages deploy of `assets/`) and referenced by absolute URL.

## Routing map (from `index.js`)

- `GET /` and `/new` — registration form
- `GET /.well-known/webfinger?resource=acct:...` — the actual WebFinger lookup
- `GET /.well-known/security.txt`, `/robots.txt`, `/favicon.ico` — static-ish responses
- `POST /apiv1/processing` — registration form submission → sends mail / triggers social verification
- `GET|POST /apiv1/confirmation` — GET renders a confirm screen; POST does the work (also the PHP callback target)
- `GET /github/*` `/GitHub/*`, `/u/*` `/reddit/*`, `/@*` `/twitter/*`, `/*@*` (`/email/*`) — "verified"
  profile pages that render the stored Mastodon link for a given identity
- Anything else → 307 redirect to `https://webfinger.io/`

## Verification API host setup (`verification-api/`)

The PHP side is not containerized (yet). It needs Chrome running in an isolated network namespace behind a
VPN — see `verification/VPN.md` (NordVPN/OpenVPN inside `ns1`) and the `vpn-*.sh` / `system-setup.sh` scripts.
Chrome needs **≥8 GB RAM** or it fails with a tracepoint/break error. The API token in `validation.php`
(`$secret_api_token`) must match the Worker's `API_TOKEN_VERIFICATION`.

## Docs

`docs.webfinger.io/` holds setup notes: `SETUP.MD` (overview), `DKIM-setup.md` (generating DKIM keys and DNS
records for MailChannels email sending — the Worker sends via `https://api.mailchannels.net/tx/v1/send`).

## Conventions & status

- Code is a **work in progress** with many `TODO`s and commented-out debug branches; some confirmation
  responses still append numeric debug markers (e.g. `+ "1234"`) to error pages. Prefer removing these over
  preserving them when you touch that code.
- The service does **not** verify Mastodon IDs are owned by the user (planned), and explicitly refuses to
  handle phone numbers, physical addresses, and government IDs for PII reasons.
