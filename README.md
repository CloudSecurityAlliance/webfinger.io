# webfinger.io

[webfinger.io](https://webfinger.io/) is a public webfinger service that lets you link your Mastodon ID to your email address. webfinger.io requires strong proof of control of the email address to prevent abuse, and to ensure only the rightful owner of the email address can link a Mastodon ID to it.

People can then verify your email address is linked to your Mastodon ID by searching for the alias @username_emaildomain@webfinger.io or if you control your domain and redirect /.well-known/webfinger to https://webfinger.io/.well-known/webfinger by searching for your email in the form of a Mastodon ID @username@emaildomain

## Using webfinger.io

Simply redirect https://example.org/.well-known/webfinger* to https://webfinger.io/.well-known/webfinger

### Cloudflare

Simple create a page rule:

1. URL: https://seifried.org/.well-known/webfinger*
2. Pick a Setting: Forwarding URL
3. Select status code: 302 - Temporary Redirect
4. Enter destination URL: https://webfinger.io/.well-known/webfinger$1

## Service layout

The service is split up into different subdomains to make securing and serving it from different services and levels easier. webfinger.io currently relies upon email based confirmation of a normalized email address (e.g. we remove +stuff and dots) which provides strong proof of control. We do not currently confirm Mastodon ID's are owned by the user, this is planned for the future

### register

webfinger.io frontpage and entry form, passes POST request to processing

### processing

processing script for entry form, takes POST request, checks if email Block is on, if not it generates an auth record and key if not already set, sends email with GET links to the confirmation

### confirmation

confirmation script takes GET request with action, email, key and optional Mastodon ID (if registering one), presents user with a confirmation screen, if they hit submit it sends a POST request to itself and does the action specified and clears the auth record

### webfinger

webfinger script that serves requests from KV store, please note it normalizes outgoing emails and Mastodon ID's for safety and reliability
