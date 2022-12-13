/**
 * webfinger server
 * 
 * Uses CloudFlare Workers and KV, Mailchannels
 * You'll need a domain name to run this yourself
 */

// wrangler publish --env production  

// Change to variable?
let globalDomain = "webfinger.io";

// npm install uuid
import { v4 as uuidv4 } from 'uuid';

// Separate file to make updates easier
import { getsecuritytxt } from "./securitytxt.js";

// normalize stuff
import { strictNormalizeWebData } from "./strictNormalize.js";
import { strictNormalizeEmailAddress } from "./strictNormalize.js";

// registration content
import { gethtmlContentRegistration } from "./htmlContentRegistration.js";

// webfinger
import { handleWebfingerGETRequest } from "./webfinger.js";

// Processing content email/html
import { gethtmlContentProcessing } from "./htmlContentProcessing.js"
import { getemailContentProcessing } from "./emailContentProcessing.js"

import { handleConfirmationGETRequest } from "./logicConfirmation.js"
import { readConfirmationRequestBodyPOST } from "./logicConfirmation.js"

import { handleVerifiedEmailGETRequest } from "./logicVerifiedEmailPage.js"

// Processing email handler
import { handleEmail } from "./emailHandler.js"

///////////////////////////////////////////////////////////////////////////////////////////////////
// Main POST body
// test via:
// wget --post-data "email_address=test@seifried.org&action=link_mastodon_id&mastodon_id=@iuhku@iuhjkh.com&token=a43fd80f-a924-4c9c-bb53-dad1e6432de7" https://webfinger.io/
///////////////////////////////////////////////////////////////////////////////////////////////////
async function readPOSTRequestBody(request) {
  
  const { headers } = request;
  const contentType = headers.get('content-type') || '';
  // We're doing POST to get form results
  if (contentType.includes('form')) {
    const formData = await request.formData();
    // Get the body and populate the fields
    postData = {};
    for (const entry of formData.entries()) {
      // TODO: toLowercase this all
      postData[entry[0]] = entry[1];
    }

    normalizedRequestData = strictNormalizeWebData(postData);

    return normalizedRequestData;
  }
  else {
    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Main GET body
// test via:
// wget -v "https://webfinger.io/testing?email_address=test@seifried.org&action=link_mastodon_id&mastodon_id=iuhku@iuhjkh.com&token=a43fd80f-a924-4c9c-bb53-dad1e6432de7"
///////////////////////////////////////////////////////////////////////////////////////////////////
async function readGETRequestParams(searchParams) {
  paramData = {};
  if (searchParams.get("action")) {
    paramData["action"] = searchParams.get("action")
  }
  if (searchParams.get("email_address")) {
    paramData["email_address"] = searchParams.get("email_address")
  }
  if (searchParams.get("mastodon_id")) {
    paramData["mastodon_id"] = searchParams.get("mastodon_id")
  }
  if (searchParams.get("token")) {
    paramData["token"] = searchParams.get("token")
  }
  
  let normalizedRequestData = strictNormalizeWebData(paramData);
  return normalizedRequestData;
//  return new Response(JSON.stringify(normalizedRequestData), {status: "200", headers: {"content-type": "text/plain"}});
}


async function readProcessingRequestBody(request) {
  //return new Response(JSON.stringify(request), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  
  // error handling first
  if (request["action"] === false) {
    return new Response("ERROR: action is false", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  }
  else if (request["email_address"] === false) {
    return new Response("ERROR: email is false", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  }
  else if (request["action"] === "link_mastodon_id") {
    if (request["mastodon_id"] === false) {
      return new Response("ERROR: Mastodon ID is false", {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }
  }

  // Check if email is blocked, this simplifies the logic later on
  block_email = "No";
  
  KVkeyArray = request["email_address"].split("@");
  KVkeyValue = KVkeyArray[1] + ":" + KVkeyArray[0]
  const KVDataResult = await webfingerio_prod_data.get(KVkeyValue);
  // remember if no record it returns null, so if it exists we have a record
  if (KVDataResult) {
    KVDataResultJSON = JSON.parse(KVDataResult);
    if (KVDataResultJSON["block_email"] == "Yes") {
      block_email = "Yes";
      // return new Response(gethtmlContentProcessing("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    }
  }

  // KV STORE KEY
  KVkeyArray = request["email_address"].split("@");
  KVkeyValue = KVkeyArray[1] + ":" + KVkeyArray[0]
  const KVauthresult = await webfingerio_prod_auth.get(KVkeyArray);

  // if we find an auth record that means we have a unique key already set (which expires after one hour) so set to no email
  // and continue so we don't leak info
  if (KVauthresult) {
    block_email = "Yes";
    return new Response(gethtmlContentProcessing("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  }

  // Generate a unique ID
  uuid_value = uuidv4();

  KVauthdata = {};
  KVauthdata["token"] = uuid_value;

  KVauthdataJSONString = JSON.stringify(KVauthdata);

  // Set a one hour time limit, this limits activity and means we don't have to do cleanup if anything fails
  // Don't set keys if block_email = "Yes";
  if (block_email == "No") {
    // KV STORE KEY
    KVkeyArray = request["email_address"].split("@");
    KVkeyValue = KVkeyArray[1] + ":" + KVkeyArray[0]
    await webfingerio_prod_auth.put(KVkeyValue, KVauthdataJSONString, {expirationTtl: 3600});
  }
  // TODO: ENV VRIABLES FROM/REPLYTO
  email_data = {};
  email_data["domain"] = "webfinger.io";
  email_data["to_email"] = request["email_address"];
  email_data["from"] = "noreply@webfinger.io";
  email_data["from_name"] = "webfinger.io Email Verification Service";
  email_data["reply-to"] = "admin@webfinger.io";
  email_data["reply-to_name"] = "webfinger.io Email Verification Admin";
  // TODO: change subject to include random value (click link?) so gmail doesn't thread them
  
  email_data["subject"] = "webfinger.io Email verification";
  // These env variables need to be set in wrangler.toml
  // See docs.webfinger.io/DKIM-setup.md for setup details
  email_data["DKIM_DOMAIN"] = DKIM_DOMAIN;
  email_data["DKIM_SELECTOR"] = DKIM_SELECTOR;
  email_data["DKIM_PRIVATE_KEY"] = DKIM_PRIVATE_KEY;

  user_data = {};
  // We always have a uuid and email
  user_data["token"] = uuid_value;
  // TODO: check if it fails here.
  user_data["email_address"] = request["email_address"];

  user_data["mastodon_id"] = request["mastodon_id"];

  // Send the email template as specified (1 of 3)
  if (request["action"] == "link_mastodon_id") {
    if (block_email == "No") {
      email_content = getemailContentProcessing("link_mastodon_id", user_data);
      email_return_code = await handleEmail(email_data, email_content); 
    }
    return new Response(gethtmlContentProcessing("link_mastodon_id", user_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  }
  else if (request["action"] == "block_email") {
    if (block_email == "No") {
      email_content = getemailContentProcessing("block_email", user_data);      
      email_return_code = await handleEmail(email_data, email_content); 
    }
    return new Response(gethtmlContentProcessing("block_email", user_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  }
  else if (request["action"] == "delete_record") {
    if (block_email == "No") {
      email_content = getemailContentProcessing("delete_record", user_data);  
      email_return_code = await handleEmail(email_data, email_content);
    }
    return new Response(gethtmlContentProcessing("delete_record", user_data), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  } 
  else {
    return new Response(gethtmlContentProcessing("badinput"), {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// POST Request
// 
// Routes:
// webfinger.io/apiv1/processing/*
// webfinger.io/apiv1/confirmation/*
///////////////////////////////////////////////////////////////////////////////////////////////////
async function handlePOSTRequest(requestData) {
  requestURL = new URL(requestData.url);
  if (requestURL.pathname === "/apiv1/processing") {
    normalizedData = await readPOSTRequestBody(requestData);
    replyBody = await readProcessingRequestBody(normalizedData);
    return replyBody;
	} 
  else if (requestURL.pathname === "/apiv1/confirmation") {
    // TODO: take confirmation GET request and to the work
    // 
    normalizedData = await readPOSTRequestBody(requestData);
    replyBody = await readConfirmationRequestBodyPOST(normalizedData);
    return replyBody;

//		reqBody = await readPOSTRequestBody(requestData);
 //   replyBody = await jj(reqBody)
  //  return new Response(JSON.stringify(reqBody), {status: "200", headers: {"content-type": "text/plain"}});
//    return reqBody;
	} 

  ///////////////////////////////////////
  // Testing
  //else if (requestURL.pathname === "/testing") {
	//	const reqBody = await readPOSTRequestBody(requestData);
  //  return new Response(JSON.stringify(reqBody), {status: "200", headers: {"content-type": "text/plain"}});
	//} 
  else {
    return Response.redirect("https://webfinger.io/", 307)
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// GET Request
// Routes:
// webfinger.io/
// webfinger.io/robots.txt
// webfinger.io/.well-known/security.txt
// webfinger.io/.well-known/webfinger*
// webfinger.io/apiv1/processing*
// webfinger.io/apiv1/confirmation*
///////////////////////////////////////////////////////////////////////////////////////////////////
async function handleGETRequest(requestData) { 
  // length checks and whatnot here?
  requestURL = new URL(requestData.url);
  // test via
  // https://webfinger.io/.well-known/webfinger?resource=acct:kurt@seifried.org
  if (requestURL.pathname === "/.well-known/webfinger") {
    const webfingerReply = await handleWebfingerGETRequest(requestData);
    return webfingerReply;
  } 
  else if (requestURL.pathname === "/favicon.ico") {
    return Response.redirect("https://cloudsecurityalliance.org/favicon.ico", 307)
  } 
  else if (requestURL.pathname === "/robots.txt") {
    return new Response("User-agent: * Disallow: /", {status: "200", headers: {"content-type": "text/plain"}});
  } 
  else if (requestURL.pathname === "/.well-known/security.txt") {
		return new Response(getsecuritytxt(), {status: "200", headers: {"content-type": "text/plain"}});
	} 
  else if (requestURL.pathname === "/") {
    htmlContent = gethtmlContentRegistration("success");
    return new Response(htmlContent, {status: "200", headers: {'content-type': 'text/html;charset=UTF-8'}});
	} 
  else if (requestURL.pathname === "/apiv1/processing") {
    return Response.redirect("https://webfinger.io/", 307)
	} 
  else if (requestURL.pathname === "/apiv1/confirmation") {
    requestURL = new URL(requestData.url);
    const { searchParams } = new URL(requestData.url)
    const reqBody = await readGETRequestParams(searchParams);
    replyBody = handleConfirmationGETRequest(reqBody);
    return replyBody;
	} 
  else if (requestURL.pathname.includes("@")) {
    replyBody = await handleVerifiedEmailGETRequest(requestURL.pathname);
    return replyBody;
	} 
  ////////////////////////////////////////////////////
  // Testing
  // test via
  // wget -v "https://webfinger.io/testing?email_address=test@seifried.org&action=link_mastodon_id&mastodon_id=iuhku@iuhjkh.com&token=a43fd80f-a924-4c9c-bb53-dad1e6432de7"
  //else if (requestURL.pathname === "/testing") {
  //  requestURL = new URL(requestData.url);
  //  const { searchParams } = new URL(requestData.url)
  //  const reqBody = await readGETRequestParams(searchParams);
  //  return new Response(JSON.stringify(reqBody), {status: "200", headers: {"content-type": "text/plain"}});
  //}
  ///////////////////////////////
  // We're at the end, serve a redirect to the registration page
  else {
    return Response.redirect("https://webfinger.io/", 307)
	} 
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Main request handler
///////////////////////////////////////////////////////////////////////////////////////////////////
addEventListener('fetch', event => {
  const { request } = event;
  if (request.method.toUpperCase() === 'POST') {
    return event.respondWith(handlePOSTRequest(request));
  } 
  else if (request.method.toUpperCase() === 'GET') {
    return event.respondWith(handleGETRequest(request));
  } 
  else {
    return new Response("NOT SUPPORTED", {status: "501", headers: {"content-type": "text/plain"}});
  } 
});
