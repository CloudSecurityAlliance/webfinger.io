# Deploying webfinger.io

There is no CI/CD. Production is deployed by hand from a local checkout.

## What runs where

| | |
|---|---|
| Source | `CloudSecurityAlliance/webfinger.io`, branch `main` |
| Entry point | `webservice/src/index.js` |
| Worker | `webfingerio-prod-new` |
| Route | `webfinger.io/*` |
| Config | `webservice/wrangler.toml` — **gitignored, local only** |
| KV | `webfingerio_prod_auth`, `webfingerio_prod_data` |

Static assets (CSS, favicon, images) are **not** served by the Worker. They come
from the `assetswebfingerio` Cloudflare Pages project, which was uploaded by hand
in 2023 and has no Git integration. Changing files under `assets/` in this repo
does not update the live site.

## Prerequisites

1. `wrangler` installed and authenticated (`wrangler whoami`).
2. `webservice/wrangler.toml` present locally. It is gitignored and exists only
   on machines that have deployed before — there is no copy in any repository,
   deliberately. `webservice/wrangler-EXAMPLE.toml` shows the shape; the real
   values (account id, KV namespace ids) come from the Cloudflare dashboard.
3. The account has several profiles. If wrangler reports "more than one account
   available", the `account_id` in `wrangler.toml` selects the right one.

## Deploy

```sh
cd webservice
wrangler deploy --env production --dry-run --outdir /tmp/wfbuild   # build only
wrangler deploy --env production                                   # publish
```

Always dry-run first. It prints the bindings the Worker will get, so you can see
before publishing whether anything unexpected is attached.

## Verify

```sh
# lookups must be unchanged - this is the part real users depend on
curl -s 'https://webfinger.io/.well-known/webfinger?resource=acct:kurt@seifried.org'

# front page (cache-bust; Cloudflare edge-caches it)
curl -s "https://webfinger.io/?v=$RANDOM" | grep -o 'No new registrations'

# signups are closed and should say so
curl -s -o /dev/null -w '%{http_code}\n' https://webfinger.io/apiv1/confirmation   # 503

wrangler deployments list --env production
```

Take a `curl` capture of the WebFinger lookup **before** deploying and `cmp` it
against the same request afterwards. Existing registrations resolving is the one
behaviour that must never regress.

Two things that make verification confusing, both normal:

- **Edge caching.** The front page is cached; a plain request can return the
  previous version for several minutes. Add a cache-busting query parameter.
- **Bot challenges.** Some paths sit behind a Cloudflare managed challenge and
  return `403` with `cf-mitigated: challenge` to `curl`. That is the edge, not
  the Worker. A real browser passes it.

## Rollback

`wrangler deployments list --env production` shows version ids. Roll back with:

```sh
wrangler rollback [<version-id>] --env production
```

## Secrets

`wrangler.toml` should contain **no secret material**. As of 2026-09-05 it holds
only `ENVIRONMENT`, the KV bindings and the route.

If a secret is ever needed, use `wrangler secret put NAME` so it is encrypted and
cannot be committed by accident. Do **not** add it to `[env.production.vars]` —
values there sit in a plaintext file, which is how the DKIM signing key for this
domain ended up publicly disclosed for three years in a fork of this repository.

Note that removing a secret from a repository does not undo its disclosure:
forks share an object store, so a committed blob stays fetchable by commit SHA
from every repository in the network, including forks outside our control.
Rotate or revoke the credential; treat the file removal as cleanup only.
