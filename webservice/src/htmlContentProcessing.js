// filename: ./src/htmlContentProcessing.js

export function gethtmlContentProcessing(status, data) {
    // Default assign data to false, we don't need it for e.g. "badinput"
    html_content = {};

    html_content["badinput"] = `
    <html>
    <title>webfinger.io</title>
    <body>
    We cannot process your request at this time, please try again later.
    Please check that your email and Mastodon ID were entered correctly.
    </body>
    </html>
    `;

    html_content["link_mastodon_id"] = `
    <html>
    <title>webfinger.io</title>
    <body>
    We have processed your request to link MASTODON_ID to EMAIL_ADDRESS, you should check 
    for an email shortly, please check your spam folders if it doesn't show up. 
    It will be valid for one hour, and then the link expires.
    </body>
    </html>
    `;

    html_content["block_email"] = `
    <html>
    <title>webfinger.io</title>
    <body>
    We have processed your request to unsubscribe and block any more email to EMAIL_ADDRESS. 
    In order to prevent abuse we've sent an email with a confirmation link, 
    please check your spam folders if it doesn't show up. It will be valid 
    for one hour, and then the link expires.
    </body>
    </html>
    `;
    html_content["delete_record"] = `
    <html>
    <title>webfinger.io</title>
    <body>
    We have processed your request to delete the record for EMAIL_ADDRESS, you should check for 
    an email shortly, please check your spam folders if it doesn't show up. It will be valid 
    for one hour, and then the link expires.
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
        return html_content[status];
    }
    else {
        return false;
    }
}
