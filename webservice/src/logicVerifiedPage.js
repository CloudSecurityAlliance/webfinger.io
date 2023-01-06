
import { gethtmlContentRegistration } from "./htmlContentRegistration.js"

import { strictNormalizeEmailAddress, strictNormalizeGitHub, strictNormalizeMastodon, strictNormalizeReddit} from "./strictNormalize.js";


import { basicEscapeHTML } from "./strictNormalize.js";


export async function handleVerifiedEmailGETRequest(requestData) {
    // takes /yourname@domain.name or /email/yourname@domain.name
    
    if (requestData.startsWith("/email/")) {
        email_id_array = requestData.split("/");
        email_address = email_id_array[2];
        normalized_email_address = strictNormalizeEmailAddress(email_id_array[2]);
    }
    else {
        email_address = requestData.slice(1);
        normalized_email_address = strictNormalizeEmailAddress(email_address);
    }


    error_result = {};

    error_result["email_address"] = encodeURIComponent(email_address);

    if (normalized_email_address === false) {
        return new Response(gethtmlContentRegistration("noverifiedemail", error_result) + "normalized", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

	// KV STORE get auth key
	KVkeyArray = normalized_email_address.split("@");
	KVkeyValue = "email:" + KVkeyArray[1] + ":" + KVkeyArray[0]
	const KVdataResult = await webfingerio_prod_data.get(KVkeyValue);
    
	// null means no record means no key so throw an error now
	if (KVdataResult === null) {
        return new Response(gethtmlContentRegistration("noverifiedemail", error_result) + "not found", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
    else {
        KVdataReply = JSON.parse(KVdataResult);
    }

    if (KVdataReply["block_email"] == "Yes") {
        return new Response(gethtmlContentRegistration("noverifiedemail", error_result) + "blocked", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

    if (KVdataReply["mastodon_id"]) {
        mastodon_id_raw = KVdataReply["mastodon_id"];
        mastodon_id_normalized = strictNormalizeMastodon(mastodon_id_raw);
        if (mastodon_id_normalized === "") {
            return new Response(gethtmlContentRegistration("noverifiedemail", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
        else {
            mastodon_id_split = mastodon_id_normalized.split("@");

            let substitute_data = {};
            substitute_data["email_address"] = normalized_email_address;
            substitute_data["mastodon_id"] = mastodon_id_normalized;
            substitute_data["mastodon_name"] = mastodon_id_split[1];
            substitute_data["mastodon_domain"] = mastodon_id_split[2];
            return new Response(gethtmlContentRegistration("verifiedemail", substitute_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
    }
}


export async function handleVerifiedTwitterGETRequest(requestData) {
    // /@yourname or /twitter/yourname 
    if (requestData.startsWith("/twitter/")) {
        raw_request = requestData.slice(1);
        twitter_id_array = raw_request.split("/");
        normalized_twitter_id = strictNormalizeReddit(twitter_id_array[1]);
    }
    // Just cut the /@ off
    else {
        raw_request = requestData.slice(2);
        normalized_twitter_id = strictNormalizeReddit(raw_request);
    }

    error_result = {};

    error_result["twitter_id"] = encodeURIComponent(normalized_twitter_id);
    // basicEscapeHTML escape @ and some other stuff we want

    if (normalized_twitter_id === false) {
        // todo change to "" handler
        return new Response(gethtmlContentRegistration("noverifiedtwitter", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

	// KV STORE get auth key
	//KVkeyArray = normalized_github_id.split("@");
    //////////////////////////// TODO FIX FOR MULTIPLE TYPES - lookup table?
	KVkeyValue = "twitter:" + normalized_twitter_id;
	const KVdataResult = await webfingerio_prod_data.get(KVkeyValue);
    
	// null means no record means no key so throw an error now
	if (KVdataResult === null) {
        return new Response(gethtmlContentRegistration("noverifiedtwitter", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
    else {
        KVdataReply = JSON.parse(KVdataResult);
    }

    if (KVdataReply["mastodon_id"]) {
        mastodon_id_raw = KVdataReply["mastodon_id"];
        mastodon_id_normalized = strictNormalizeMastodon(mastodon_id_raw);
        if (mastodon_id_normalized === false) {
            return new Response(gethtmlContentRegistration("noverifiedtwitter", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
        else {
            mastodon_id_split = mastodon_id_normalized.split("@");

            let substitute_data = {};
            substitute_data["twitter_id"] = normalized_twitter_id;
            substitute_data["mastodon_id"] = mastodon_id_normalized;
            substitute_data["mastodon_name"] = mastodon_id_split[1];
            substitute_data["mastodon_domain"] = mastodon_id_split[2];
            return new Response(gethtmlContentRegistration("verifiedtwitter", substitute_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
    }
}


export async function handleVerifiedGitHubGETRequest(requestData) {
    // /github/ or /GitHub/ 

    raw_request = requestData.slice(1);

    github_id_array = raw_request.split("/");

    normalized_github_id = strictNormalizeGitHub(github_id_array[1]);

    error_result = {};

    error_result["github_id"] = encodeURIComponent(normalized_github_id);
    // basicEscapeHTML escape @ and some other stuff we want

    if (normalized_github_id === false) {
        // todo change to "" handler
        return new Response(gethtmlContentRegistration("noverifiedgithub", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

	// KV STORE get auth key
	//KVkeyArray = normalized_github_id.split("@");
    //////////////////////////// TODO FIX FOR MULTIPLE TYPES - lookup table?
	KVkeyValue = "github:" + normalized_github_id;
	const KVdataResult = await webfingerio_prod_data.get(KVkeyValue);
    
	// null means no record means no key so throw an error now
	if (KVdataResult === null) {
        return new Response(gethtmlContentRegistration("noverifiedgithub", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
	}
    else {
        KVdataReply = JSON.parse(KVdataResult);
    }

    if (KVdataReply["mastodon_id"]) {
        mastodon_id_raw = KVdataReply["mastodon_id"];
        mastodon_id_normalized = strictNormalizeMastodon(mastodon_id_raw);
        if (mastodon_id_normalized === false) {
            return new Response(gethtmlContentRegistration("noverifiedgithub", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
        else {
            mastodon_id_split = mastodon_id_normalized.split("@");

            let substitute_data = {};
            substitute_data["github_id"] = normalized_github_id;
            substitute_data["mastodon_id"] = mastodon_id_normalized;
            substitute_data["mastodon_name"] = mastodon_id_split[1];
            substitute_data["mastodon_domain"] = mastodon_id_split[2];
            return new Response(gethtmlContentRegistration("verifiedgithub", substitute_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
    }
}

export async function handleVerifiedRedditGETRequest(requestData) {
    // takes /u/* or /reddit/*

    raw_request = requestData.slice(1);

    reddit_id_array = raw_request.split("/");

    normalized_reddit_id = strictNormalizeReddit(reddit_id_array[1]);

    error_result = {};

    error_result["reddit_id"] = encodeURIComponent(normalized_reddit_id);
    // basicEscapeHTML escape @ and some other stuff we want

    if (normalized_reddit_id === false) {
        // todo change to "" handler
        return new Response(gethtmlContentRegistration("noverifiedreddit", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }

    KVkeyValue = "reddit:" + normalized_reddit_id;
    const KVdataResult = await webfingerio_prod_data.get(KVkeyValue);
    
    // null means no record means no key so throw an error now
    if (KVdataResult === null) {
        return new Response(gethtmlContentRegistration("noverifiedreddit", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }
    else {
        KVdataReply = JSON.parse(KVdataResult);
    }

    if (KVdataReply["mastodon_id"]) {
        mastodon_id_raw = KVdataReply["mastodon_id"];
        mastodon_id_normalized = strictNormalizeMastodon(mastodon_id_raw);
        if (mastodon_id_normalized === false) {
            return new Response(gethtmlContentRegistration("noverifiedreddit", error_result), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
        else {
            mastodon_id_split = mastodon_id_normalized.split("@");

            let substitute_data = {};
            substitute_data["reddit_id"] = normalized_reddit_id;
            substitute_data["mastodon_id"] = mastodon_id_normalized;
            substitute_data["mastodon_name"] = mastodon_id_split[1];
            substitute_data["mastodon_domain"] = mastodon_id_split[2];
            return new Response(gethtmlContentRegistration("verifiedreddit", substitute_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
        }
    }
}
