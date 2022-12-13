
import { gethtmlContentRegistration } from "./htmlContentRegistration.js"

import { strictNormalizeEmailAddress } from "./strictNormalize.js";
import { basicEscapeHTML } from "./strictNormalize.js";


export async function handleVerifiedEmailGETRequest(requestData) {

    email_address = requestURL.pathname.slice(1);

    let normalized_email_address = strictNormalizeEmailAddress(email_address);

    error_result = {};
    error_result["email_address"] = basicEscapeHTML(email_address);
    //(email_address);

    if (normalized_email_address === false) {
        return new Response(gethtmlContentRegistration("noverifiedemail", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

	// KV STORE get auth key
	KVkeyArray = normalized_email_address.split("@");
	KVkeyValue = KVkeyArray[1] + ":" + KVkeyArray[0]
	const KVdataResult = await webfingerio_prod_data.get(KVkeyValue);
    
	// null means no record means no key so throw an error now
	if (KVdataResult === null) {
        return new Response(gethtmlContentRegistration("noverifiedemail", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
    else {
        KVdataReply = JSON.parse(KVdataResult);
    }

    if (KVdataReply["block_email"] == "Yes") {
        return new Response(gethtmlContentRegistration("noverifiedemail", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

    if (KVdataReply["mastodon_id"]) {
        mastodon_id_raw = KVdataReply["mastodon_id"].slice(1);
        mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
        if (mastodon_id_normalized === false) {
            return new Response(gethtmlContentRegistration("noverifiedemail", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
        else {
            let mastodon_id_split = {};
            mastodon_id_split = mastodon_id_normalized.split("@");

            let substitute_data = {};
            substitute_data["email_address"] = normalized_email_address;
            substitute_data["mastodon_id"] = "@" + mastodon_id_normalized;
            substitute_data["mastodon_name"] = mastodon_id_split[0];
            substitute_data["mastodon_domain"] = mastodon_id_split[1];
            return new Response(gethtmlContentRegistration("verifiedemail", substitute_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
    }
}
