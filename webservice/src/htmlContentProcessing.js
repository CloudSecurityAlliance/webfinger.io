// filename: ./src/htmlContentProcessing.js

export function gethtmlContentProcessing(status, data) {
    // Default assign data to false, we don't need it for e.g. "badinput"
    html_content = {};

    html_content["header"] = `
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

    html_content["badinput"] = `
    We cannot process your request at this time, please try again later.
    Please check that your email and Mastodon ID were entered correctly.
    </section>
    </body>
    </html>
    `;

    html_content["link_mastodon_id"] = `
    We have processed your request to link MASTODON_ID to EMAIL_ADDRESS, you should check 
    for an email shortly, please check your spam folders if it doesn't show up. 
    It will be valid for one hour, and then the link expires.
    </section>
    </body>
    </html>
    `;

    html_content["block_email"] = `
    We have processed your request to unsubscribe and block any more email to EMAIL_ADDRESS. 
    In order to prevent abuse we've sent an email with a confirmation link, 
    please check your spam folders if it doesn't show up. It will be valid 
    for one hour, and then the link expires.
    </section>
    </body>
    </html>
    `;
    html_content["delete_record"] = `
    We have processed your request to delete the record for EMAIL_ADDRESS, you should check for 
    an email shortly, please check your spam folders if it doesn't show up. It will be valid 
    for one hour, and then the link expires.
    </section>
    </body>
    </html>
    `;
    
    if (html_content[status]) {
        new_content = "";
        if (data["token"]) {
            new_content = html_content[status].replace(/TOKEN/g, data["token"]);
            html_content[status] = new_content;
        } 
        if (data["email_address"]) {
            new_content = html_content[status].replace(/EMAIL_ADDRESS/g, data["email_address"]);
            html_content[status] = new_content;
        } 
        if (data["mastodon_id"]) {
            new_content = html_content[status].replace(/MASTODON_ID/g, data["mastodon_id"]);
            html_content[status] = new_content;
        } 
        return html_content["header"] + html_content[status];
    }
    else {
        return false;
    }
}
