// filename: ./src/htmlContentConfirmation.js

let globalDomain = "webfinger.io";

export function gethtmlContentConfirmation(status, data) {
    // data is optional
    if (typeof data === 'undefined') {
        data = {};
    }
    // Default assign data to false, we don't need it for e.g. "badinput"
    let html_content_reply = {};

    html_content_reply["echovariables"] = `
    <!DOCTYPE html>
    <body>
    <h1>` + globalDomain + ` confirmation form</h1>
    <p>In order to avoid problems with email servers preloading links you'll need to click 
    the submit button to confirm your request:</p>
    
    <form action="https://` + globalDomain + `/apiv1/confirmation" method="post">
    <input type="hidden" id="email_address" name="email_address" value="EMAIL_ADDRESS" readonly>
    <input type="hidden" id="mastodon_id" name="mastodon_id" value="MASTODON_ID" readonly>
    <input type="hidden" name="action" value="ACTION_NAME" checked="checked">
    <input type="hidden" id="token" name="token" value="TOKEN" readonly>
    <input type="submit" value="submit" name="submit">
    </form>
    </body>
    `;

    html_content_reply["badinput"] = `
<html>
<title>` + globalDomain + `</title>
<body>
We cannot process your request at this time, please try again later.
Please check that your email and Mastodon ID were entered correctly.
</body>
</html>
`;

    html_content_reply["link_mastodon_id"] = `
<html>
<title>` + globalDomain + `</title>
<body>
We have processed your request to link MASTODON_ID to EMAIL_ADDRESS. 
</body>
</html>
`;

    html_content_reply["block_email"] = `
<html>
<title>` + globalDomain + `</title>
<body>
We have processed your request to unsubscribe and block any more email to EMAIL_ADDRESS.
</body>
</html>
`;

    html_content_reply["delete_record"] = `
<html>
<title>` + globalDomain + `</title>
<body>
We have processed your request to delete the record for EMAIL_ADDRESS.
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
        return html_content_reply[status];
    }
    else {
        return false;
    }
}
