// filename: ./src/emailContentProcessing.js

let globalDomain = "webfinger.io";

export function getemailContentProcessing(status, data) {
    // Default assign data to false, we don't need it for e.g. "badinput"
    email_content = {};
    email_content["type"] = "text/plain";
    
    email_content["link_mastodon_id"] = `Hi, this is an email verification from ` + globalDomain + `. We provide a webfinger service 
that lets people link their Mastodon ID to their email address. 

Click here to link EMAIL_ADDRESS to MASTODON_ID at ` + globalDomain + `

https://` + globalDomain + `/apiv1/confirmation?action=link_mastodon_id&email_address=EMAIL_ADDRESS&mastodon_id=MASTODON_ID&token=TOKEN

If you didn't request this email you can safely ignore it, the link will expire. 
If you want to unsubscribe and block emails from ` + globalDomain + ` simply click:

https://` + globalDomain + `/apiv1/confirmation?action=block_email&email_address=EMAIL_ADDRESS&token=TOKEN

Please note if you choose to block us you will need to email admin@` + globalDomain + ` if 
you want to use the service in future (you can't unblock yourself since we can't send 
you a confirmation email).
`;
    
    email_content["block_email"] = `Hi, this is an email verification from ` + globalDomain + ` to confirm you want to unsubscribe and block emails from 
us. If you did not request this, simply ignore this email. 

https://` + globalDomain + `/apiv1/confirmation?action=block_email&email_address=EMAIL_ADDRESS&token=TOKEN

Please note if you choose to block us you will need to email admin@` + globalDomain + ` if 
you want to use the service in future (you can't unblock yourself since we can't send 
you a confirmation email). We will also remove the Mastodon ID linked to your account if there is one in
order to protect your privacy (again, you won't be able to change or delete it since we can't email you a 
confirmation).
`;
    
    email_content["delete_record"] = `Hi, this is an email verification from ` + globalDomain + ` to confirm you want to delete your record with 
us. If you did not request this, simply ignore this email.

https://` + globalDomain + `/apiv1/confirmation?action=delete_record&email_address=EMAIL_ADDRESS&token=TOKEN

Deleting your record will allow you to create a new one in future. 

If you didn't request this email you can safely ignore it, the link will expire. 
If you want to unsubscribe and block emails from ` + globalDomain + ` simply click:

https://` + globalDomain + `/apiv1/confirmation?action=block_email&email_address=EMAIL_ADDRESS&token=TOKEN

Please note if you choose to block us you will need to email admin@` + globalDomain + ` if 
you want to use the service in future (you can't unblock yourself since we can't send 
you a confirmation email).

If you have any concerns or questions just hit reply to contact our admin help.
`;
    
    email_content["footer"] = `
\n\n
` + globalDomain + ` is a Cloud Security Alliance (https://cloudsecurityalliance.org/) Research beta. 
The Cloud Security Alliance is a not-for-profit organization promoting best practices for 
providing security assurance within Cloud Computing. We are also working on various projects 
within the Blockchain and Fediverse ecosystems. The Cloud Security Alliance privacy policy is available at:
https://cloudsecurityalliance.org/legal/privacy-notice/. You can find us on Mastodon: 

@cloudsecurityalliance@cloudsecurityalliance.org
which currently redirects to:
@cloudsecurityalliance@infosec.exchange
`;
    
    if (email_content[status]) {
        new_content = "";
        if (data["token"]) {
            new_content = email_content[status].replace(/TOKEN/g, data["token"]);
            email_content[status] = new_content;
        } 
        if (data["email_address"]) {
            new_content = email_content[status].replace(/EMAIL_ADDRESS/g, data["email_address"]);
            email_content[status] = new_content;
        } 
        if (data["mastodon_id"]) {
            new_content = email_content[status].replace(/MASTODON_ID/g, data["mastodon_id"]);
            email_content[status] = new_content;
        } 
        local_email_data = {};
        local_email_data["type"] = email_content["type"];
        local_email_data["content"] = email_content[status];
        return local_email_data;
    }
    else {
        return false;
    }
}
