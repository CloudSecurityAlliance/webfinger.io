// filename: ./src/htmlContentRegistration.js

let globalDomain = "webfinger.io";

export function gethtmlContentRegistration(status) {
    if (status == "success") {
        htmlContent = `
<!DOCTYPE html>
<title>webfinger.io (a Cloud Security Alliance Research beta)</title>
<body>
<h1>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research beta</h1>

<p>Simply fill out this form, you'll get a confirmation email with a link, click the link and people can verify you 
at @yourname_domain@webfinger.io and if you point your webfinger service at webfinger.io searching for @yourname@domain will work.</p>

<form action="https://` + globalDomain + `/apiv1/processing" method="post">
<label for="email_address">Email address (mandatory, name@email.tld):</label>
<input type="email_address" id="email_address" name="email_address"><br>
<label for="mastodon_id">Mastodon ID (optional, @username@servername.tld):</label>
<input type="text" id="mastodon_id" name="mastodon_id"><br>
<input type="radio" name="action" value="link_mastodon_id"><strong>Link Mastodon ID (new or updated)</strong><br>
<input type="radio" name="action" value="block_email">Unsubscribe and block all future email<br>
<input type="radio" name="action" value="delete_record">Delete the record for my email address<br>
<input type="submit" value="submit" name="submit">

<p>webfinger.io is a public webfinger service that lets you link your Mastodon ID to your email address. webfinger.io
requires strong proof of control of the email address to prevent abuse, and to ensure only the rightful owner of the email
address can link a Mastodon ID to it.</p>

<p>People can then verify your email address is linked to your Mastodon ID by searching for the alias @username_emaildomain@webfinger.io 
or if you control your domain and redirect /.well-known/webfinger to https://webfinger.io/.well-known/webfinger by searching for your email
in the form of a Mastodon ID @username@emaildomain

<h2>Security and anti-abuse</h2>

<p>We've taken several steps to ensure this service is safe and respects users privacy. We only ask for the data you want us to serve 
(e.g. your email and Mastodon ID). We support email addresses deleting their record, and marking themselves as "do not contact". We 
also support administrative blocklists for both emails and Mastodon IDs, e.g. we can block "example.org" if you do not want your users 
to use this service, contact us at admin at webfinger.io. We also restrict the length and format of emails and Mastodon IDs to 128 
characters. This service runs on Cloudflare Workers and KV store, and uses Mailchannels to send the emails.</p>

<p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research beta</p>

</form>
</body>
`;
    }

    return htmlContent;
}
