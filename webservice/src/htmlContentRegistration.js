// filename: ./src/htmlContentRegistration.js

let globalDomain = "webfinger.io";

export function gethtmlContentRegistration(status, data) {
    // Data is optional
    //if (typeof data === 'undefined') {
    //    data = {};
    //}

    let htmlContent = {};
    
    let replyContent = "";

    htmlContent["header"] = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>webfinger.io (a Cloud Security Alliance Research beta)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="https://assetswebfingerio.pages.dev/favicon.ico"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/fonts.googleapis.com-css-family-Roboto-300-300italic-700-700italic.txt"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/normalize.css"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/milligram.min.css"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/main.css"/>
    </head>
    <body>
    <main>
    <section class="container" id="registration">
    <h1>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research beta</h1>

    `;

    htmlContent["verifiedemail"] = `

    <p>EMAIL_ADDRESS has been verified by webfinger.io and is linked to <a rel="me" href="https://MASTODON_DOMAIN/@MASTODON_NAME">MASTODON_ID</a>.</p>
    `;

    // TODO: make this more obvious and serve correctly
    htmlContent["noverifiedemail"] = `<p>We could not verify EMAIL_ADDRESS</p>`;
    
    htmlContent["registration"] = `
    <form action="https://` + globalDomain + `/apiv1/processing" method="post">
    
    <label for="email_address">Email address (mandatory, name@email.tld):</label>
    <input type="email" id="email_address" name="email_address" placeholder="username@example.org">
    
    <label for="mastodon_id">Mastodon ID (optional, @username@servername.tld):</label>
    <input type="text" id="mastodon_id" name="mastodon_id" placeholder="@username@mastodon.server">
    
    <input type="radio" id="link_mastodon_id" name="action" value="link_mastodon_id">
    <label for="link_mastodon_id" class="label-inline"><strong>Link Mastodon ID (new or updated)</strong></label><br>
    
    <input type="radio" id="block_email" name="action" value="block_email">
    <label for="block_email" class="label-inline">Unsubscribe and block all future email</label><br>
    
    <input type="radio" id="delete_record" name="action" value="delete_record">
    <label for="delete_record" class="label-inline">Delete the record for my email address</label><br>

    <input type="submit" value="submit" name="submit">
    </form>

    <p>webfinger.io is a public webfinger service that lets you link your Mastodon ID to your email address. webfinger.io
    requires strong proof of control of the email address to ensure only the rightful owner of the email address can link it 
    to a Mastodon ID.</p>
    
    <h2>Using webfinger.io</h2>

    <ul>
    <li>Search field: @yourname_emaildomain@webfinger.io</li>
    <li>If you redirect your webfinger to us: @yourname@emaildomain</li>
    <li>Mastodon profile metadata verification: simply add a link like https://webfinger.io/yourname@emaildomain</li>
    </ul>

    <p>To let people search for your email, simply redirect https://youremaildomain/.well-known/webfinger to https://webfinger.io/.well-known/webfinger and it'll work.</p>
    
    <h2>Security and anti-abuse</h2>
    
    <p>We've taken several steps to ensure this service is safe and respects users privacy. We only ask for the data you want us to serve 
    (your email and Mastodon ID). We support email addresses deleting their record, and marking themselves as "do not contact". We 
    also support administrative blocklists for both emails and Mastodon IDs, e.g. we can block "example.org" if you do not want your users 
    to use this service, contact us at admin at webfinger.io. We also restrict the length and format of emails and Mastodon IDs to 128 
    characters. This service runs on Cloudflare Workers and KV store, and uses Mailchannels to send the emails. These providers log data such 
    as IP addresses accessing their service and the email address of email sent.</p>
    
    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research beta. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    `;
    if (status == "success") {
        replyContent = htmlContent["header"] + htmlContent["registration"];
        return replyContent;
    }
    else if (status == "verifiedemail") {
        let new_content = "";
        if (data["email_address"]) {
            new_content = htmlContent["verifiedemail"].replace(/EMAIL_ADDRESS/g, data["email_address"]);
            htmlContent["verifiedemail"] = new_content;
        } 
        else {
            replyContent = htmlContent["header"] + htmlContent["noverifiedemail"];
            return replyContent; 
        }

        if (data["mastodon_id"]) {
            new_content = htmlContent["verifiedemail"].replace(/MASTODON_ID/g, data["mastodon_id"]);
            htmlContent["verifiedemail"] = new_content;
        }
        else {
            replyContent = htmlContent["header"] + htmlContent["noverifiedemail"];
            return replyContent; 
        }

        if (data["mastodon_name"]) {
            new_content = htmlContent["verifiedemail"].replace(/MASTODON_NAME/g, data["mastodon_name"]);
            htmlContent["verifiedemail"] = new_content;
        }
        else {
            replyContent = htmlContent["header"] + htmlContent["noverifiedemail"];
            return replyContent; 
        }

        if (data["mastodon_domain"]) {
            new_content = htmlContent["verifiedemail"].replace(/MASTODON_DOMAIN/g, data["mastodon_domain"]);
            htmlContent["verifiedemail"] = new_content;
            replyContent = htmlContent["header"] + htmlContent["verifiedemail"];
            return replyContent;
        } 
        else {
            replyContent = htmlContent["header"] + htmlContent["noverifiedemail"];
            return replyContent;
        }
    }
    
    else if (status == "noverifiedemail") {
        // We always have an email address, hopefully
        new_content = htmlContent["noverifiedemail"].replace(/EMAIL_ADDRESS/g, data["email_address"]);
        htmlContent["noverifiedemail"] = new_content;
        replyContent = htmlContent["header"] + htmlContent["noverifiedemail"];

        return replyContent
    }
    else {
        return false;
    }
}
