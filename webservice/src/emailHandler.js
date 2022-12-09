// filename: ./src/emailHandler.js

export async function handleEmail(data, email_content_data) {
    ///////////////////////
    //
    // https://api.mailchannels.net/tx/v1/documentation
    //
    // TODO: add DKIM support https://mailchannels.zendesk.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature
    // https://www.cloudflare.com/en-ca/learning/dns/dns-records/dns-dkim-record/
    //
    ///////////////////////
  
    let send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
        "method": "POST",
        "headers": {
            "content-type": "application/json",
        },
        "body": JSON.stringify({
            "personalizations": [
                { "to": 
                [ 
                    { 
                        "email": data["to_email"]
                    }
                ],
                "dkim_domain": data["DKIM_DOMAIN"],
                "dkim_selector": data["DKIM_SELECTOR"],
                "dkim_private_key": data["DKIM_PRIVATE_KEY"]
                }
            ],
            "from": {
                "email": data["from"],
                "name": data["from_name"],
            },
            "reply_to": {
                "email": data["reply-to"],
                "name": data["reply-to_name"],
            },
            "subject": data["subject"],
            "content": [
                {
                    "type": email_content_data["type"],
                    "value": email_content_data["content"],
                }
            ],
        }),
    });

  
    let respContent = "";
    const resp = await fetch(send_request);
    const respText = await resp.text();
  
    respContent = resp.status + " " + resp.statusText + "\n\n" + respText;

    response_data = {};
    response_data["data"] = data;
    response_data["email_content_data"] = email_content_data;
    response_data["resp"] = resp;
    return response_data;
}

