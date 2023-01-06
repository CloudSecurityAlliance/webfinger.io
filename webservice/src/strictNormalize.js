// filename: ./src/strictNormalize.js

export function strictNormalizeEmailAddress(email_address) {
	// returns a normalized email or false
	// Check for length, <128
	// lowercase it all
	// split into array
	// remove dots and anything +after in name
	if (email_address.length > 128) {
		return "";
	}
	email_address_lowercase = email_address.toLowerCase();
	// Check a regex https://stackoverflow.com/questions/4964691/super-simple-email-validation-with-javascript
	// 2,6 for tld needs to be 2,18 for NORTHWESTERNMUTUAL and . TRAVELERSINSURANCE
	if (email_address_lowercase.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,18})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) === null) {
		return "";
	}
	emailArray = email_address_lowercase.split("@");
	emailNameNoDots = emailArray[0].replace(/\./g, "")
	emailNameNoPlus = emailNameNoDots.replace(/\+.*$/g, "")
	final_email_address = emailNameNoPlus + "@" + emailArray[1]
	return final_email_address;
}

export function strictNormalizeMastodon(mastodon_id_value) {
	// @username@mastodon.server or mastodon.server/@username
	// strip any http:// or https://
	//
	if (mastodon_id_value.length > 128) {
		return "";
	}
	mastodon_id_lowercase = mastodon_id_value.toLowerCase();

	if (mastodon_id_lowercase.startsWith("@")) {
		mastodon_id_raw = mastodon_id_lowercase.replace(/^@/, "");
		mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
		if (mastodon_id_normalized === false) {
			return "";
		}
		else {
			return "@" + mastodon_id_normalized;
		}
	}
	else if (mastodon_id_lowercase.startsWith("https://")) {
		mastodon_id_raw_url = mastodon_id_lowercase.replace(/^https:\/\//, "");
		mastodon_id_array = mastodon_id_raw_url.split("/@");
		mastodon_id_raw = mastodon_id_array[1] + "@" + mastodon_id_array[0];
		mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
		if (mastodon_id_normalized === false) {
			return "";
		}
		else {
			return "@" + mastodon_id_normalized;
		}
	}
	else if (mastodon_id_lowercase.startsWith("http://")) {
		mastodon_id_raw_url = mastodon_id_lowercase.replace(/^https:\/\//, "");
		mastodon_id_array = mastodon_id_raw_url.split("/@");
		mastodon_id_raw = mastodon_id_array[1] + "@" + mastodon_id_array[0];
		mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
		if (mastodon_id_normalized === false) {
			return "";
		}
		else {
			return "@" + mastodon_id_normalized;
		}
	}
	// assume something like servername/@username
	else {
		mastodon_id_array = mastodon_id_lowercase.split("/@");
		mastodon_id_raw = mastodon_id_array[1] + "@" + mastodon_id_array[0];
		mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
		if (mastodon_id_normalized === false) {
			return "";
		}
		else {
			return "@" + mastodon_id_normalized;
		}
	}
}

export function strictNormalizeGitHub(github_id_value) {
	if (github_id_value.length > 39) {
		return "";
	}
	github_id_lowercase = github_id_value.toLowerCase();
	var re_github_id = new RegExp("^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$");
	if (re_github_id.test(github_id_lowercase)) {
		return(github_id_lowercase);
	} else {
		return "";
	}
}

export function strictNormalizeReddit(reddit_id_value) {
	if (reddit_id_value.length > 20) {
		return "";
	}
	reddit_id_lowercase = reddit_id_value.toLowerCase();
	var re_reddit_id = new RegExp("^[a-zA-Z0-9-_]{3,20}$");
	if (re_reddit_id.test(reddit_id_lowercase)) {
		return(reddit_id_lowercase);
	} else {
		return "";
	}
}

export function strictNormalizeTwitter(twitter_id_value) {
	if (twitter_id_value.length > 15) {
		return "";
	}
	twitter_id_lowercase = twitter_id_value.toLowerCase();
	var re_twitter_id = new RegExp("^[a-zA-Z0-9-_]{1,20}$");
	if (re_twitter_id.test(twitter_id_lowercase)) {
		return(twitter_id_lowercase);
	} else {
		return "";
	}
}

export function strictNormalizeUUID(uuid_value) {
	var re_uuid = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$");
	if (re_uuid.test(uuid_value)) {
		return(uuid_value);
	} else {
		return "";
	}
}

export function basicEscapeHTML(unsafe) {
	return unsafe
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function strictNormalizeWebData(requestdata) {
	//
	// Basic Logic based on action (implemented in functions):
	// link_mastodon_id: must have mastodon_id, and at leats one email/social_id
	// unsubscribe: must have an email
	// LATER: delete_record: must have email, longer term OR social_id AND token
	// no action present: error out
	// email present but no token present: error out
	// 
	// Basic values are either:
	// 1) Missing entirely - set to false, "not present, don't parse"
	// 2) Wrongly formatted (e.g. "" or "blah" for an email) - set to "", processing and confirmation should throw a helpful error
	// 3) Correctly formatted - leave as is and try to use it
	// Special note: link_mastodon_id is the default action, e.g. for front page, API, etc.

	let normalized_data = {};

	// check for action, explicitly 1 of 2 values, assume linking if not
	if (requestdata["action"]) {
		if (requestdata["action"] != "") {
			if (requestdata["action"] == "block_email") {
				normalized_data["action"] = "block_email";
			}
			else if (requestdata["action"] == "delete_record") {
				normalized_data["action"] = "delete_record";
			}
			else {
				normalized_data["action"] = "link_mastodon_id";
			}
		}
		else {
			normalized_data["action"] = "link_mastodon_id";
		}
	}
	else {
		normalized_data["action"] = "link_mastodon_id";
	}

	if (requestdata["mastodon_id"]) {
		// returns null or normalized mastodon_id
		normalized_data["mastodon_id"] = strictNormalizeMastodon(requestdata["mastodon_id"]);
	}
	else {
		normalized_data["mastodon_id"] = false;
	}

	if (requestdata["email_address"]) {
		// returns null or normalized email
		normalized_data["email_address"] = strictNormalizeEmailAddress(requestdata["email_address"]);
	}
	else {
		normalized_data["email_address"] = false;
	}

	if (requestdata["twitter_id"]) {
		// returns null or normalized email
		normalized_data["twitter_id"] = strictNormalizeTwitter(requestdata["twitter_id"]);
	}
	else {
		normalized_data["github_id"] = false;
	}

	if (requestdata["github_id"]) {
		// returns null or normalized email
		normalized_data["github_id"] = strictNormalizeGitHub(requestdata["github_id"]);
	}
	else {
		normalized_data["github_id"] = false;
	}

	if (requestdata["reddit_id"]) {
		// returns null or normalized email
		normalized_data["reddit_id"] = strictNormalizeReddit(requestdata["reddit_id"]);
	}
	else {
		normalized_data["reddit_id"] = false;
	}
	
	// check for token
	if (requestdata["token"]) {
		normalized_data["token"] = strictNormalizeUUID(requestdata["token"]);
	}
	else {
		normalized_data["token"] = false;
	}

	// Return nice clean normalized data, everything exists
	return normalized_data;
}
