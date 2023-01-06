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
    <title>webfinger.io (a Cloud Security Alliance Research project)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="https://assetswebfingerio.pages.dev/favicon.ico"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/fonts.googleapis.com-css-family-Roboto-300-300italic-700-700italic.txt"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/normalize.css"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/milligram.min.css"/>
    <link rel="stylesheet" href="https://assetswebfingerio.pages.dev/main.css"/>
    </head>
    <body>
    <section class="container" id="registration">

    <div class="top-container container">
    <div class="row">
      <div class="column" style="text-align:center">
        <img class="logo" src="https://assetswebfingerio.pages.dev/mastodon-validation.png" alt="Mastodon website showing verification of email and social media identities"/>
      </div>
      <div class="column">
        <p><h3>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project</h3></p>
        <p> </p>
      </div>
    </div>
  </div>
   

    

    `;

    htmlContent["verifiedemail"] = `

    <p><strong>EMAIL_ADDRESS has been verified by webfinger.io and is linked to 
    <a rel="me" href="https://MASTODON_DOMAIN/@MASTODON_NAME">MASTODON_ID</a>.</strong></p>

    <a class="button" href="https://webfinger.io/">Get your email address and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    
    </body>
    </html>

    `;

    htmlContent["verifiedtwitter"] = `

    <p><strong>The Twitter user <a href="https://twitter.com/@TWITTER_ID">@TWITTER_ID</a> has been verified by webfinger.io and is linked to 
    <a rel="me" href="https://MASTODON_DOMAIN/@MASTODON_NAME">MASTODON_ID</a>.</strong></p>

    <a class="button" href="https://webfinger.io/">Get your email address and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>

    `;

    htmlContent["verifiedgithub"] = `

    <p><strong>The GitHub user <a href="https://github.com/GITHUB_ID">GITHUB_ID</a> has been verified by webfinger.io and is linked to 
    <a rel="me" href="https://MASTODON_DOMAIN/@MASTODON_NAME">MASTODON_ID</a>.</strong></p>

    <a class="button" href="https://webfinger.io/">Get your email address and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>

    `;

    htmlContent["verifiedreddit"] = `

    <p><strong>The Reddit user <a href="https://reddit.com/user/REDDIT_ID">REDDIT_ID</a> has been verified by webfinger.io and is linked to 
    <a rel="me" href="https://MASTODON_DOMAIN/@MASTODON_NAME">MASTODON_ID</a>.</strong></p>

    <a class="button" href="https://webfinger.io/">Get your email address and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>

    `;


    // TODO: make this more obvious and serve correctly
    htmlContent["noverifiedemail"] = `<p>We could not verify the email address EMAIL_ADDRESS</p>
    
    <a class="button" href="https://webfinger.io/">Get your email address and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>
    
    `;

    htmlContent["noverifiedtwitter"] = `<p>We could not verify the Twitter account <a href="https://twitter.com/@TWITTER_ID">TWITTER_ID</a>.</p>
    
    <a class="button" href="https://webfinger.io/">Get your social media and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>
    
    `;

    htmlContent["noverifiedgithub"] = `<p>We could not verify the GitHub account <a href="https://github.com/GITHUB_ID">GITHUB_ID</a>.</p>
    
    <a class="button" href="https://webfinger.io/">Get your social media and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>
    
    `;

    htmlContent["noverifiedreddit"] = `<p>We could not verify the Reddit account <a href="https://reddit.com/u/REDDIT_ID">REDDIT_ID</a>.</p>
    
    <a class="button" href="https://webfinger.io/">Get your social media and Mastodon ID verified</a>

    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body> 
    </html>
    
    `;

htmlContent["registration"] = `

    <form action="https://` + globalDomain + `/apiv1/processing" method="post">
    
    <p><strong>Verify and link</strong> your social accounts and/or email to your Mastodon ID:</p>

    <label for="mastodon_id">Mastodon ID:</label>
    <input type="text" id="mastodon_id" name="mastodon_id" placeholder="@username@mastodon.server or mastodon.server/@username">
    
    <label for="twitter_id">Twitter ID (verify by listing your Mastodon ID in your <a target="_blank" href="https://twitter.com/settings/profile">"Profile"</a>):</label>
    <input type="text" id="twitter_id" name="twitter_id" placeholder="twitter username">

    <label for="github_id">GitHub ID (verify by listing your Mastodon ID in your <a target="_blank" href="https://github.com/settings/profile">"Bio"</a>):</label>
    <input type="text" id="github_id" name="github_id" placeholder="github username">

    <label for="reddit_id">Reddit ID (verify by listing your Mastodon ID in your <a target="_blank" href="https://www.reddit.com/settings/profile">"About"</a>):</label>
    <input type="text" id="reddit_id" name="reddit_id" placeholder="reddit username">

    <label for="email_address">Email address (verify by clicking a link we'll email you):</label>
    <input type="email" id="email_address" name="email_address" placeholder="username@example.org">

    <input type="submit" value="submit" name="submit">

    <p>Click below to unsubscribe and block all email from us, or delete your email record:</p>
    
    <input type="radio" id="block_email" name="action" value="block_email">
    <label for="block_email" class="label-inline">Unsubscribe and block all future email</label><br>
    
    <!--
    <input type="radio" id="delete_record" name="action" value="delete_record">
    <label for="delete_record" class="label-inline">Delete the record for my email address</label><br>
    -->
    
    <input type="radio" id="link_mastodon_id" name="action" value="link_mastodon_id" checked="checked">
    <label for="link_mastodon_id" class="label-inline">Link to my Mastodon ID</label><br>

    </form>

    <p>webfinger.io is a public webfinger service that lets you link your Mastodon ID to your email address. webfinger.io
    requires strong proof of control of the email address to ensure only the rightful owner of the email address can link it 
    to a Mastodon ID.</p>
    
    <h2>Using webfinger.io</h2>

    <ul>
    <li>Search field: @yourname_emaildomain@webfinger.io</li>
    <li>If you redirect your webfinger to us: @yourname@emaildomain</li>
    <li>Mastodon profile metadata verification: simply add a link
    <ul>
        <li>Twitter: https://webfinger.io/@yourname or https://webfinger.io/twitter/yourname</li>
        <li>GitHub: https://webfinger.io/github/yourname</li>
        <li>Reddit: https://webfinger.io/u/yourname or https://webfinger.io/reddit/yourname</li>
        <li>Email: https://webfinger.io/yourname@emaildomain or https://webfinger.io/email/yourname@emaildomain</li>
        <li>LinkedIN: Coming soon</li>
        </ul>
    </ul>

    <p>To let people search for your email, simply redirect https://youremaildomain/.well-known/webfinger to https://webfinger.io/.well-known/webfinger and it'll work.</p>
    
    <h2>Security and anti-abuse</h2>
    
    <p>We've taken several steps to ensure this service is safe and respects users privacy. We only ask for the data you want us to serve 
    (your email and Mastodon ID). We support email addresses deleting their record, and marking themselves as "do not contact". We 
    also support administrative blocklists for both emails and Mastodon IDs, e.g. we can block "example.org" if you do not want your users 
    to use this service, contact us at admin at webfinger.io. We also restrict the length and format of emails and Mastodon IDs to 128 
    characters. This service runs on Cloudflare Workers and KV store, and uses Mailchannels to send the emails. These providers log data such 
    as IP addresses accessing their service and the email address of email sent.</p>
    
    <p>webfinger.io is a <a href="https://cloudsecurityalliance.org/">Cloud Security Alliance</a> Research project. It is available in GitHub at
    <a href="https://github.com/cloudsecurityalliance/webfinger.io">https://github.com/cloudsecurityalliance/webfinger.io</a>.</p>
  
    <p>The Cloud Security Alliance privacy policy is available 
    <a href="https://cloudsecurityalliance.org/legal/privacy-notice/">here</a>.</p>
    </section>

    </main>
    </body>
    </html>
    `;

    htmlContent["newregistration"] = htmlContent["registration"];

    if (status == "registration") {
        replyContent = htmlContent["header"] + htmlContent["registration"];
        return replyContent;
    }
    if (status == "newregistration") {
        let new_content = "";
        if (data["uuid"]) {
            new_content = htmlContent["newregistration"].replace(/UUID/g, data["uuid"]);
            htmlContent["newregistration"] = new_content;
        } 
        else {
            return false;
        }
        replyContent = htmlContent["header"] + htmlContent["newregistration"];
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

    else if (status == "verifiedtwitter") {
        let new_content = "";
        if (data["twitter_id"]) {
            new_content = htmlContent["verifiedtwitter"].replace(/TWITTER_ID/g, data["twitter_id"]);
            htmlContent["verifiedtwitter"] = new_content;
        } 
        if (data["mastodon_id"]) {
            new_content = htmlContent["verifiedtwitter"].replace(/MASTODON_ID/g, data["mastodon_id"]);
            htmlContent["verifiedtwitter"] = new_content;
        }
        if (data["mastodon_name"]) {
            new_content = htmlContent["verifiedtwitter"].replace(/MASTODON_NAME/g, data["mastodon_name"]);
            htmlContent["verifiedtwitter"] = new_content;
        }
        if (data["mastodon_domain"]) {
            new_content = htmlContent["verifiedtwitter"].replace(/MASTODON_DOMAIN/g, data["mastodon_domain"]);
            htmlContent["verifiedtwitter"] = new_content;
            replyContent = htmlContent["header"] + htmlContent["verifiedtwitter"];
            return replyContent;
        } 
    }

    else if (status == "verifiedgithub") {
        let new_content = "";
        if (data["github_id"]) {
            new_content = htmlContent["verifiedgithub"].replace(/GITHUB_ID/g, data["github_id"]);
            htmlContent["verifiedgithub"] = new_content;
        } 
        if (data["mastodon_id"]) {
            new_content = htmlContent["verifiedgithub"].replace(/MASTODON_ID/g, data["mastodon_id"]);
            htmlContent["verifiedgithub"] = new_content;
        }
        if (data["mastodon_name"]) {
            new_content = htmlContent["verifiedgithub"].replace(/MASTODON_NAME/g, data["mastodon_name"]);
            htmlContent["verifiedgithub"] = new_content;
        }
        if (data["mastodon_domain"]) {
            new_content = htmlContent["verifiedgithub"].replace(/MASTODON_DOMAIN/g, data["mastodon_domain"]);
            htmlContent["verifiedgithub"] = new_content;
            replyContent = htmlContent["header"] + htmlContent["verifiedgithub"];
            return replyContent;
        } 
    }

    else if (status == "verifiedreddit") {
        let new_content = "";
        if (data["reddit_id"]) {
            new_content = htmlContent["verifiedreddit"].replace(/REDDIT_ID/g, data["reddit_id"]);
            htmlContent["verifiedreddit"] = new_content;
        } 
        if (data["mastodon_id"]) {
            new_content = htmlContent["verifiedreddit"].replace(/MASTODON_ID/g, data["mastodon_id"]);
            htmlContent["verifiedreddit"] = new_content;
        }
        if (data["mastodon_name"]) {
            new_content = htmlContent["verifiedreddit"].replace(/MASTODON_NAME/g, data["mastodon_name"]);
            htmlContent["verifiedreddit"] = new_content;
        }
        if (data["mastodon_domain"]) {
            new_content = htmlContent["verifiedreddit"].replace(/MASTODON_DOMAIN/g, data["mastodon_domain"]);
            htmlContent["verifiedreddit"] = new_content;
            replyContent = htmlContent["header"] + htmlContent["verifiedreddit"];
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

    else if (status == "noverifiedtwitter") {
        // We always have an email address, hopefully
        new_content = htmlContent["noverifiedtwitter"].replace(/TWITTER_ID/g, data["twitter_id"]);
        htmlContent["noverifiedtwitter"] = new_content;
        replyContent = htmlContent["header"] + htmlContent["noverifiedtwitter"];

        return replyContent
    }

    else if (status == "noverifiedgithub") {
        // We always have an email address, hopefully
        new_content = htmlContent["noverifiedgithub"].replace(/GITHUB_ID/g, data["github_id"]);
        htmlContent["noverifiedgithub"] = new_content;
        replyContent = htmlContent["header"] + htmlContent["noverifiedgithub"];

        return replyContent
    }

    else if (status == "noverifiedreddit") {
        // We always have an email address, hopefully
        new_content = htmlContent["noverifiedreddit"].replace(/REDDIT_ID/g, data["reddit_id"]);
        htmlContent["noverifiedreddit"] = new_content;
        replyContent = htmlContent["header"] + htmlContent["noverifiedreddit"];

        return replyContent
    }

    else {
        return false;
    }
}
