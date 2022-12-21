
import { gethtmlContentConfirmation } from "./htmlContentConfirmation.js"

export async function handleConfirmationGETRequest(requestData) {

    if (requestData["action"] == "link_mastodon_id") {
        html_form_response = gethtmlContentConfirmation("echovariables", requestData);
        return new Response(html_form_response, {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    } 
    else if (requestData["action"] == "block_email") {
        html_form_response = gethtmlContentConfirmation("echovariables", requestData);
        return new Response(html_form_response, {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});	
    }
    else if (requestData["action"] == "delete_record") {
        html_form_response = gethtmlContentConfirmation("echovariables", requestData);
        return new Response(html_form_response, {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    } 
    else {
        return new Response(gethtmlContentConfirmation("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    } 
} 

export async function readConfirmationRequestBodyPOST(requestData) {

	if (requestData["action"] === false) {
		return new Response("ERROR: no action", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
	if (requestData["email_address"] === false) {
        return new Response("ERROR: no email address", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
	if (requestData["token"] === false) {
        return new Response("ERROR: no token", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
	if (requestData["action"] == "link_mastodon_id") {
		if (requestData["mastodon_id"] === false) {
			return new Response("ERROR: no Mastodon ID", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
		}
	}
	
	// KV STORE get auth key
	KVkeyArray = requestData["email_address"].split("@");
	KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0]
	const KVauthResult = await webfingerio_prod_auth.get(KVkeyValue);

	// null means no record means no key so throw an error now
	if (KVauthResult === null) {
		return new Response(gethtmlContentConfirmation("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
	
	KVauthData = JSON.parse(KVauthResult);

	// check that the unique token matches, if not throw an error
	if (KVauthData["token"] == requestData["token"]) {
		KVdata = {};

		if (requestData["action"] == "link_mastodon_id") {
			KVdata["mastodon_id"] = requestData["mastodon_id"];
			KVdata["block_email"] = "No";
			KVdataJSONString = JSON.stringify(KVdata);
			KVkeyArray = requestData["email_address"].split("@");
			KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0]
			await webfingerio_prod_data.put(KVkeyValue, KVdataJSONString);
			await webfingerio_prod_auth.delete(KVkeyValue);
			return new Response(gethtmlContentConfirmation("link_mastodon_id", requestData), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
		}	
		else if (requestData["action"] == "block_email") {
			KVdata["block_email"] = "Yes";
			KVdataJSONString = JSON.stringify(KVdata);
			KVkeyArray = requestData["email_address"].split("@");
			KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0]
			await webfingerio_prod_data.put(KVkeyValue, KVdataJSONString);
			await webfingerio_prod_auth.delete(KVkeyValue);	
			return new Response(gethtmlContentConfirmation("block_email", requestData), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
		}
		else if (requestData["action"] == "delete_record") {
			KVkeyArray = requestData["email_address"].split("@");
			KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0]
			await webfingerio_prod_data.delete(KVkeyValue);
			await webfingerio_prod_auth.delete(KVkeyValue);
			return new Response(gethtmlContentConfirmation("delete_record", requestData), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
		} else {
			return new Response(gethtmlContentConfirmation("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
		}
	}
    // no matching token return generic error
	else {
		return new Response(gethtmlContentConfirmation("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
}

