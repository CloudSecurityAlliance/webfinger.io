
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
	// FIX LOGIC HERE
	// This is called via POST from confirmation echo variables which is email only, or from the API verification
	// which is one type of social ID per call only, so no need to batch up replies and data yet

	// action
	// token
	// mastodon_id
	// github_id

	// TESTING
	// wget --post-data "action=link_mastodon_id&mastodon_id=@kurtseifried@mastodon.social&github_id=kurtseifried&token=c1d94e2c-3909-4cd5-8777-49bd4bdeace7" https://webfinger.io/apiv1/confirmation
	
	if (requestData["action"] === false) {
		return new Response("ERROR: no action", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
	if (requestData["token"] === false) {
        return new Response("ERROR: no token", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}

	if (requestData["action"] == "link_mastodon_id") {
		if (requestData["mastodon_id"] === false) {
			return new Response("ERROR: no Mastodon ID", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
		}
	}


	if (requestData["twitter_id"]) {
		// If we have a twitter lets link it up
		if (requestData["twitter_id"] != false) {
			// KV STORE get auth key
			KVkeyValue = "twitter:" + requestData["twitter_id"];
			const KVauthResult = await webfingerio_prod_auth.get(KVkeyValue);

			// null means no record means no key so throw an error now
			if (KVauthResult === null) {
				return new Response(gethtmlContentConfirmation("badinput") + "1234", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
			
			KVauthData = JSON.parse(KVauthResult);

			// check that the unique token matches, if not throw an error
			if (KVauthData["token"] == requestData["token"]) {
				KVdata = {};

				if (requestData["action"] == "link_mastodon_id") {
					KVdata["mastodon_id"] = requestData["mastodon_id"];
					KVdataJSONString = JSON.stringify(KVdata);
					KVkeyValue = "twitter:" + requestData["twitter_id"];
					
					await webfingerio_prod_data.put(KVkeyValue, KVdataJSONString);
					await webfingerio_prod_auth.delete(KVkeyValue);
					return new Response(gethtmlContentConfirmation("link_mastodon_id", requestData) + "9999", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
				else {
					return new Response(gethtmlContentConfirmation("badinput") + "1235", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
			}
			// no matching token return generic error
			else {
				return new Response(gethtmlContentConfirmation("badinput") + "1236", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
		}
	}


	if (requestData["github_id"]) {
		// If we have a github lets link it up
		if (requestData["github_id"] != false) {
			// KV STORE get auth key
			KVkeyValue = "github:" + requestData["github_id"];
			const KVauthResult = await webfingerio_prod_auth.get(KVkeyValue);

			// null means no record means no key so throw an error now
			if (KVauthResult === null) {
				return new Response(gethtmlContentConfirmation("badinput")  + "1237", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
			
			KVauthData = JSON.parse(KVauthResult);

			// check that the unique token matches, if not throw an error
			if (KVauthData["token"] == requestData["token"]) {
				KVdata = {};

				if (requestData["action"] == "link_mastodon_id") {
					KVdata["mastodon_id"] = requestData["mastodon_id"];
					KVdataJSONString = JSON.stringify(KVdata);
					KVkeyValue = "github:" + requestData["github_id"];
					
					await webfingerio_prod_data.put(KVkeyValue, KVdataJSONString);
					await webfingerio_prod_auth.delete(KVkeyValue);
					return new Response(gethtmlContentConfirmation("link_mastodon_id", requestData), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
				else {
					return new Response(gethtmlContentConfirmation("badinput")  + "1238", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
			}
			// no matching token return generic error
			else {
				return new Response(gethtmlContentConfirmation("badinput")  + "1239", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
		}
	}

	if (requestData["reddit_id"]) {
		// If we have a reddit lets link it up
		if (requestData["reddit_id"] != false) {
			// KV STORE get auth key
			KVkeyValue = "reddit:" + requestData["reddit_id"];
			const KVauthResult = await webfingerio_prod_auth.get(KVkeyValue);

			// null means no record means no key so throw an error now
			if (KVauthResult === null) {
				return new Response(gethtmlContentConfirmation("badinput") + "1240", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
			
			KVauthData = JSON.parse(KVauthResult);

			// check that the unique token matches, if not throw an error
			if (KVauthData["token"] == requestData["token"]) {
				KVdata = {};

				if (requestData["action"] == "link_mastodon_id") {
					KVdata["mastodon_id"] = requestData["mastodon_id"];
					KVdataJSONString = JSON.stringify(KVdata);
					KVkeyValue = "reddit:" + requestData["reddit_id"];
					
					await webfingerio_prod_data.put(KVkeyValue, KVdataJSONString);
					await webfingerio_prod_auth.delete(KVkeyValue);
					return new Response(gethtmlContentConfirmation("link_mastodon_id", requestData), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
				else {
					return new Response(gethtmlContentConfirmation("badinput") + "1241", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
			}
			// no matching token return generic error
			else {
				return new Response(gethtmlContentConfirmation("badinput") + "1242", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
		}
	}

	if (requestData["email_address"]) {
		// If we have an email address process it
		if (requestData["email_address"] != false) {
			// KV STORE get auth key
			KVkeyArray = requestData["email_address"].split("@");
			KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0];
			const KVauthResult = await webfingerio_prod_auth.get(KVkeyValue);

			// null means no record means no key so throw an error now
			if (KVauthResult === null) {
				return new Response(gethtmlContentConfirmation("badinput")  + "1243", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
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
					return new Response(gethtmlContentConfirmation("block_email", requestData) + JSON.stringify(requestData) + "44", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
				else if (requestData["action"] == "delete_record") {
					KVkeyArray = requestData["email_address"].split("@");
					KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0]
					await webfingerio_prod_data.delete(KVkeyValue);
					await webfingerio_prod_auth.delete(KVkeyValue);
					return new Response(gethtmlContentConfirmation("delete_record", requestData), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				} else {
					return new Response(gethtmlContentConfirmation("badinput") + "1244", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
				}
			}
			// no matching token return generic error
			else {
				return new Response(gethtmlContentConfirmation("badinput")  + "1245", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
			}
		}
	}

}

