export async function handleVerification(verification_url, verification_data) {
    ///////////////////////
    //
    // https://api.mailchannels.net/tx/v1/documentation
    //
    // TODO: add DKIM support https://mailchannels.zendesk.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature
    // https://www.cloudflare.com/en-ca/learning/dns/dns-records/dns-dkim-record/
    //
    ///////////////////////
  
    let send_request = new Request(verification_url, {
        "method": "POST",
        "headers": {
            "content-type": "application/json",
        },
        "body": JSON.stringify(verification_data),
    });
  
    let respContent = "";

    // The Verification API should reply with an "I got the message" and then close the connection and keep processing it, it then
    // makes a POST request to confirmation
    // Long term we should put this into a work queue, and send a web hook to trigger processing, so same pattern really,
    // but if the verificaiton API fails, the queue still contains the work
    //
    const resp = await fetch(send_request);
    const respText = await resp.text();
  
    respContent = resp.status + " " + respText;

    return respContent;
}

