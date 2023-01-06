// filename: ./src/htmlContentProcessingNew.js

export function gethtmlContentProcessingNew(processing_results, data) {
    // check processing_results and generate the HTML
    // then process the variables via data
    
    html_content = {};

    html_content["header"] = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>webfinger.io (a Cloud Security Alliance Research project)</title>
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
    <h3>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project</h3>
    
    `

    html_content["badinput"] = `
    <p>We cannot process your request at this time, please try again later.
    Please check that your email and Mastodon ID were entered correctly.</p>
    `;

    html_content["link_mastodon_id_email"] = `
    <p>We have processed your request to link MASTODON_ID to EMAIL_ADDRESS, you should check 
    for an email shortly, please check your spam folders if it doesn't show up. 
    It will be valid for one hour, and then the link expires.</p>
    `;

    html_content["link_mastodon_id_social"] = `
    <p>We have processed your request to link MASTODON_ID to SOCIAL_ID (please wait about 10 seconds and then click to ensure it works, you should see a success and a link to your GitHub profile). </p>
    `;

    html_content["block_email"] = `
    <p>We have processed your request to unsubscribe and block any more email to EMAIL_ADDRESS. 
    In order to prevent abuse we've sent an email with a confirmation link, 
    please check your spam folders if it doesn't show up. It will be valid 
    for one hour, and then the link expires.</p>
    `;

    html_content["delete_record"] = `
    <p>We have processed your request to delete the record for SOCIAL_ID, you should check for 
    an email shortly, please check your spam folders if it doesn't show up. It will be valid 
    for one hour, and then the link expires.</p>
    `;

    html_content["footer"] = `
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>
    
    </body>
    </html>
    `;


    
    new_content = html_content["header"];

    // Email processing

    if (processing_results["email_address"]){
        if (processing_results["email_address"] == "SUCCESS:LINK_MASTODON_ID") {
            new_content = new_content + html_content["link_mastodon_id_email"];
        }
        else if (processing_results["email_address"] == "SUCCESS:BLOCK_EMAIL") {
            new_content = new_content + html_content["block_email"];
        }
        else if (processing_results["email_address"] == "SUCCESS:DELETE_RECORD") {
            new_content = new_content + html_content["delete_record"];
        }
        // replacements go later since email is special
    }


    // Twitter processing
    if (processing_results["twitter_id"]){
        if (processing_results["twitter_id"] == "SUCCESS:LINK_MASTODON_ID") {
            new_content = new_content + html_content["link_mastodon_id_social"];
        }
        else if (processing_results["twitter_id"] == "SUCCESS:DELETE_RECORD") {
            new_content = new_content + html_content["delete_record"];
        }
        new_content = new_content.replace(/SOCIAL_ID/g, "<a target=\"_blank\" href=\"https://webfinger.io/@TWITTER_ID\">https://webfinger.io/@TWITTER_ID</a>");
    }

    // GitHub processing
    if (processing_results["github_id"]){
        if (processing_results["github_id"] == "SUCCESS:LINK_MASTODON_ID") {
            new_content = new_content + html_content["link_mastodon_id_social"];
        }
        else if (processing_results["github_id"] == "SUCCESS:DELETE_RECORD") {
            new_content = new_content + html_content["delete_record"];
        }
        new_content = new_content.replace(/SOCIAL_ID/g, "<a target=\"_blank\" href=\"https://webfinger.io/github/GITHUB_ID\">https://webfinger.io/github/GITHUB_ID</a>");
    }

    // Reddit processing
    if (processing_results["reddit_id"]){
        if (processing_results["reddit_id"] == "SUCCESS:LINK_MASTODON_ID") {
            new_content = new_content + html_content["link_mastodon_id_social"];
        }
        else if (processing_results["reddit_id"] == "SUCCESS:DELETE_RECORD") {
            new_content = new_content + html_content["delete_record"];
        }
        new_content = new_content.replace(/SOCIAL_ID/g, "<a target=\"_blank\" href=\"https://webfinger.io/u/REDDIT_ID\">https://webfinger.io/u/REDDIT_ID</a>");
    }

    // Add footer
    new_content = new_content + html_content["footer"];

    // replacements of ID's, tokens, etc.
    if (data["mastodon_id"]) {
        new_content = new_content.replace(/MASTODON_ID/g, data["mastodon_id"]);
    } 
    if (data["token"]) {
        new_content = new_content.replace(/TOKEN/g, data["token"]);
    }
    if (data["email_address"]) {
        new_content = new_content.replace(/EMAIL_ADDRESS/g, data["email_address"]);
    } 
    if (data["twitter_id"]) {
        new_content = new_content.replace(/TWITTER_ID/g, data["twitter_id"]);
    } 
    if (data["github_id"]) {
        new_content = new_content.replace(/GITHUB_ID/g, data["github_id"]);
    } 
    if (data["reddit_id"]) {
        new_content = new_content.replace(/REDDIT_ID/g, data["reddit_id"]);
    } 
    return new_content;

}
