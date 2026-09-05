# Social verification: what it was, and why it is gone

Retired early 2026. This document exists so the planned rewrite does not
rebuild the same design by accident.

## What it did

webfinger.io let you prove you controlled a GitHub, Reddit or Twitter account
by putting your Mastodon ID in that account's public bio. The service fetched
your profile page, looked for the Mastodon ID, and on a match wrote a verified
link into KV so `/.well-known/webfinger` would resolve it.

## Why it lived on a separate server

It ran as a PHP service (`verification-api/`) on its own host rather than in
the Worker, for three reasons that were all true at the time:

1. **The profile pages needed a real browser.** The bio content was rendered
   client-side, so a plain HTTP fetch returned markup without the data. The
   service drove headless Chrome (`--dump-dom`) to get the rendered DOM.
2. **Workers cannot run a browser.** There is no way to execute Chrome inside
   a Cloudflare Worker, so the scrape had to happen somewhere with a real OS.
3. **Egress IP mattered.** Requests from Cloudflare address space were treated
   poorly by the target platforms, so scrapes were run inside a network
   namespace (`ns1`) routed through a commercial VPN to present a residential-
   looking source address.

The Worker called this service over HTTP with a shared token, and the service
called back to `/apiv1/confirmation` to record the result.

## Why it was unreliable

The design was a losing position from the start, and it degraded steadily:

- **Bot blocking.** All three platforms tightened automated-access controls
  over the service's lifetime. Scrapes began returning login walls, consent
  interstitials and challenge pages instead of profile content.
- **VPN whack-a-mole.** The namespace/VPN arrangement existed only to dodge
  that blocking. Exit addresses were themselves blocked over time, so keeping
  it working meant rotating endpoints rather than fixing anything.
- **Platform churn.** Twitter in particular changed its markup and behaviour
  repeatedly; the code carries the comment *"no timeout for now since twitter
  keeps breaking"*, which is a fair summary of the maintenance burden.
- **Silent failure.** A failed verification still returned `SUCCESS` to the
  user, so breakage was invisible until someone checked whether the record
  had actually been written.

We were spending more effort evading blocking than the feature was worth, so
the host was decommissioned in early 2026 and the form inputs were disabled.

## Why the code stayed behind

The feature was already off and the server already gone, so deleting the
leftover code was queued as housekeeping rather than treated as urgent. It sat
in the repository until an external researcher pointed out that
`validation.php` concatenated an untrusted value into a `shell_exec` string
(CWE-78). The finding was correct as a reading of the code. It was never
exploitable after decommissioning, because there was no host left to run it,
but it should not have still been here to find. Hence this removal.

## If verification comes back

Rebuild it in the Worker, not beside it:

- Use `fetch`, never a shell. No part of this needs a subprocess.
- Prefer an official API or a documented, machine-readable endpoint over
  scraping a rendered page. If a platform offers no such path, that platform
  is not a good verification target.
- Prefer approaches the platform intends to support: `rel="me"` link
  verification is the established Fediverse pattern and needs no browser.
- If a page genuinely must be rendered, use Cloudflare Browser Rendering
  rather than a self-managed Chrome on a VPN.
- Surface real errors. Never report success for a verification that did not
  complete.
