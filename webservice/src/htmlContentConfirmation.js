// filename: ./src/htmlContentConfirmation.js

let globalDomain = "webfinger.io";

export function gethtmlContentConfirmation(status, data) {
    // data is optional
    if (typeof data === 'undefined') {
        data = {};
    }
    // Default assign data to false, we don't need it for e.g. "badinput"
    let html_content_reply = {};

    html_content_reply["header"] = `
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
    `

    html_content_reply["echovariables"] = `
    <p>In order to avoid problems with email servers preloading links you'll need to click 
    the submit button to confirm your request:</p>
    
    <form action="https://` + globalDomain + `/apiv1/confirmation" method="post">
    <input type="hidden" id="email_address" name="email_address" value="EMAIL_ADDRESS" readonly>
    <input type="hidden" id="mastodon_id" name="mastodon_id" value="MASTODON_ID" readonly>
    <input type="hidden" name="action" value="ACTION_NAME" checked="checked">
    <input type="hidden" id="token" name="token" value="TOKEN" readonly>
    <input type="submit" value="submit" name="submit">
    </form>
    </section>

    <section class="container" id="privacy">
    The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.
    </section>

    </body>
    `;

    html_content_reply["badinput"] = `
<p>We cannot process your request at this time, please try again later.
Please check that your email and Mastodon ID were entered correctly.</p>

<p>The Cloud Security Alliance privacy policy is available 
<a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
</section>

</body>
</html>
`;

    html_content_reply["link_mastodon_id"] = `
<p>We have processed your request to link MASTODON_ID to EMAIL_ADDRESS.</p>

<p>The Cloud Security Alliance privacy policy is available 
<a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
</section>

</body>
</html>
`;

    html_content_reply["block_email"] = `
<p>We have processed your request to unsubscribe and block any more email to EMAIL_ADDRESS.</p>

<p>The Cloud Security Alliance privacy policy is available 
<a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
</section>

</body>
</html>
`;

    html_content_reply["delete_record"] = `
<p>We have processed your request to delete the record for EMAIL_ADDRESS.</p>

<p>The Cloud Security Alliance privacy policy is available 
<a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
</section>

</body>
</html>
`;
    
    if (html_content_reply[status]) {
        let new_content = "";
        if (data["action"]) {
            new_content = html_content_reply[status].replace(/ACTION_NAME/g, data["action"]);
            html_content_reply[status] = new_content;
        } 
        if (data["token"]) {
            new_content = html_content_reply[status].replace(/TOKEN/g, data["token"]);
            html_content_reply[status] = new_content;
        } 
        if (data["email_address"]) {
            new_content = html_content_reply[status].replace(/EMAIL_ADDRESS/g, data["email_address"]);
            html_content_reply[status] = new_content;
        } 
        if (data["mastodon_id"]) {
            new_content = html_content_reply[status].replace(/MASTODON_ID/g, data["mastodon_id"]);
            html_content_reply[status] = new_content;
        } 
        return html_content_reply["header"] + html_content_reply[status];
    }
    else {
        return false;
    }
}
