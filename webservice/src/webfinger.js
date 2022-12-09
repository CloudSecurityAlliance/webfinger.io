import { strictNormalizeEmailAddress } from "./strictNormalize.js";

export async function handleWebfingerGETRequest(requestDATA) {
    const requestURL = new URL(requestDATA.url);

    // we only care about the resource key
    if (requestURL.searchParams.get('resource')) {
        resourceKey = requestURL.searchParams.get('resource');
    }
    else {
        return new Response("ERROR: no resource parameter", {status: "404"});
    }
    
    resourceKey_toLowerCase = resourceKey.toLowerCase();
  
    if (resourceKey_toLowerCase.match(/^acct:/)) {
        query = resourceKey_toLowerCase.replace("acct:", "");
    }
    else {
        return new Response("ERROR: no acct: parameter", {status: "404"});
    }
  
    // We can normalize the query string since it must be in email format  
    queryNormalized = strictNormalizeEmailAddress(query);
    if (queryNormalized === false) {
        return new Response("ERROR: bad email format", {status: "404"});
    }
  
    // split here to make logic easier, like checking for bocked domains longer term
    // Use the original query, because it might need to contain dots for e.g. domain names
    emailArray = queryNormalized.split("@");
    emailquery = emailArray[0];
    emaildomain = emailArray[1];
  
    if (emaildomain == "webfinger.io") { 
        // Common case is username_domain.tld so convert to email and look that up first
        // if it fails we don't try to check it against webfinger.io since we don't allow underscores 
        // in accounts
        //
        if (emailquery.includes("_")) {
            email = emailquery.replace(/_([^_]*)$/, "@" + '$1');
            //return new Response("EMAIL DEBUG: " + email, {status: "200"});
        } 
        // this is inefficient but readable
        else {
            return new Response("ERROR: bad @webfinger.io query format", {status: "404"});
        }
    }
    // A redirected query to us, we should add a check for domain queries?
    else {
        email = emailquery + "@" + emaildomain
    }
  
    // KV STORE KEY
    KVkeyArray = queryNormalized.split("@");
    KVkeyValue = KVkeyArray[1] + ":" + KVkeyArray[0]
    const KVresult = await webfingerio_prod_data.get(KVkeyValue);
  
    // if that failed try the username@webfinger.io lookup
    if (KVresult === null) {
        return new Response("NOT FOUND", {status: "404"});
    } else {
        emailRecord = JSON.parse(KVresult);
    }
  
    // TODO: add checks on length and formatting as in processing - break into a function
    if (emailRecord["mastodon_id"]) {
        // remove the first @ and check against email parser
        mastodon_id_raw = emailRecord["mastodon_id"].slice(1);
        mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
        if (mastodon_id_normalized === false) {
            return new Response("NOT FOUND", {status: "404"});
        }
    }
    else {
        return new Response("NOT FOUND", {status: "404"});
    }
    
    resourceArray = mastodon_id_normalized.split("@");
    username = resourceArray[0];
    hostname = resourceArray[1];
  
    const jsonData = '{"subject":"acct:' + query + '","aliases":["https://' + hostname + '/@' + username + '","https://' + hostname + '/users/' + username + '"],"links":[{"rel":"http://webfinger.net/rel/profile-page","type":"text/html","href":"https://' + hostname + '/@' + username + '"},{"rel":"self","type":"application/activity+json","href":"https://' + hostname + '/users/' + username + '"},{"rel":"http://ostatus.org/schema/1.0/subscribe","template":"https://' + hostname + '/authorize_interaction?uri={uri}"}]}';
    return new Response(jsonData, {status: "200", headers: {"content-type": "application/json;charset=UTF-8"},
    });
}