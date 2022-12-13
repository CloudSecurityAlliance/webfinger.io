// filename: ./src/strictNormalize.js

export function strictNormalizeEmailAddress(email_address) {
	// returns a normalized email or false
	// Check for length, <128
	// lowercase it all
	// split into array
	// remove dots and anything +after in name
	if (email_address.length > 128) {
		return false;
	}
	// Check a regex https://stackoverflow.com/questions/4964691/super-simple-email-validation-with-javascript
	// 2,6 for tld needs to be 2,18 for NORTHWESTERNMUTUAL and . TRAVELERSINSURANCE
	if (email_address.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,18})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) === null) {
		return false;
	}
	email_address_lowercase = email_address.toLowerCase();
	emailArray = email_address_lowercase.split("@");
	emailNameNoDots = emailArray[0].replace(/\./g, "")
	emailNameNoPlus = emailNameNoDots.replace(/\+.*$/g, "")
	final_email_address = emailNameNoPlus + "@" + emailArray[1]
	return final_email_address;
}

export function strictNormalizeUUID(uuid_value) {
	var re_uuid = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$");
	if (re_uuid.test(uuid_value)) {
		return(uuid_value);
	} else {
		return false;
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


// filename: ./src/strictNormalize.js
export function strictNormalizeWebData(requestdata) {
	// returns a normalized data structre or false if things are wrong/missing
	// we must have an action and an email_address
	// if action === link_mastodon_id we must have a mastdon_id
	// we should have a token but if not, setting it to "" is fine because we'll never find it
	
	let normalized_data = {};

	// check for action, explicitly 1 of 3 values, return false if missing or wrong
	if (requestdata["action"]) {
		if (requestdata["action"] === "link_mastodon_id") {
			normalized_data["action"] = "link_mastodon_id";
		}
		else if (requestdata["action"] === "block_email") {
			normalized_data["action"] = "block_email";
		}
		else if (requestdata["action"] === "delete_record") {
			normalized_data["action"] = "delete_record";
		}
		else {
			normalized_data["action"] = false;
		}
	}
	else {
		normalized_data["action"] = false;
	}

	// check for email, set to false if not present, normalize, which sets ot false if it is mangled
	if (requestdata["email_address"]) {
		normalized_data["email_address"] = strictNormalizeEmailAddress(requestdata["email_address"]);
	}
	else {
		normalized_data["email_address"] = false;
	}

	// check for a mastodon_id if action === link_mastodon_id and then normalize
	if (normalized_data["action"] == "link_mastodon_id") {
		if (requestdata["mastodon_id"]) {
			// check for starrting @
			if (requestdata["mastodon_id"].match(/^@/)) {
				mastodon_id_raw = requestdata["mastodon_id"].replace(/^@/, "");
				mastodon_id_normalized = strictNormalizeEmailAddress(mastodon_id_raw);
				if (mastodon_id_normalized === false) {
					normalized_data["mastodon_id"] = false;
				}
				else {
					normalized_data["mastodon_id"] = "@" + mastodon_id_normalized;
				}
			}
			else {
				mastodon_id_normalized = strictNormalizeEmailAddress(requestdata["mastodon_id"]);
				if (mastodon_id_normalized === false) {
					normalized_data["mastodon_id"] = false;
				}
				else {
					normalized_data["mastodon_id"] = "@" + mastodon_id_normalized;
				}
			}
		}
		else {
			normalized_data["mastodon_id"] = false;
		}
	}
	// check for token
	if (requestdata["token"]) {
		normalized_data["token"] = strictNormalizeUUID(requestdata["token"]);
	}
	else {
		normalized_data["token"] = false;
	}
	return normalized_data;
}
