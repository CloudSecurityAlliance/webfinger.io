// filename: ./src/htmlContentRegistration.js

let globalDomain = "webfinger.io";

export function gethtmlContentRegistration(status, data) {
    // Data is optional
    if (typeof data === 'undefined') {
        data = {};
    }

    let htmlContent = {};
    let replyContent = "";
    htmlContent["header"] = `
    <!DOCTYPE html>
    <title>webfinger.io (a Cloud Security Alliance Research beta)</title>
    <body>
    <h1>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research beta</h1>
    `;

    htmlContent["registration"] = `    
    <p>Simply fill out this form, you'll get a confirmation email with a link, click the link and people can verify you 
    by searching in a Mastodon client for @yourname_domain@webfinger.io and if you point your webfinger service at 
    webfinger.io searching for @yourname@domain will work.</p>
    `;

    htmlContent["verified-email"] = `
    <a rel="me" href="https://mastodon.social/@MASTODON_ID">Mastodon</a>

    <p>EMAIL_ADDRESS has been verified by webfinger.io and is linked to MASTODON_ID.</p>

    `;

    htmlContent["no-verified-email"] = `<p>No verified email found</p>`;
    
    htmlContent["registration"] = `
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
    
    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research beta. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
    
    </form>
    </body>
    `;
    if (status == "success") {
        replyContent = htmlContent["header"] + htmlContent["registration"];
        return replyContent;
    }
    else if (status == "verified-email") {
        let new_content = "";
        if (data["email_address"]) {
            new_content = htmlContent["verified-email"].replace(/EMAIL_ADDRESS/g, data["email_address"]);
            htmlContent["verified-email"] = new_content;
        } 
        else {
            replyContent = htmlContent["header"] + htmlContent["no-verified-email"] + htmlContent["registration"];
            return replyContent; 
        }

        if (data["mastodon_id"]) {
            new_content = htmlContent["verified-email"].replace(/MASTODON_ID/g, data["mastodon_id"]);
            htmlContent["verified-email"] = new_content;
            return htmlContent["header"] + htmlContent["verified-email"] + htmlContent["registration"];
        } 
        else {
            replyContent = htmlContent["header"] + htmlContent["no-verified-email"] + htmlContent["registration"];
            return replyContent;
        }
    }
    else if (status == "no-verified-email") {
        replyContent = htmlContent["header"] + htmlContent["no-verified-email"] + htmlContent["registration"];
    }
    else {
        return false;
    }
}
