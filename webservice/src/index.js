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
//import { strictNormalizeEmailAddress } from "./strictNormalize.js";

// registration content
import { gethtmlContentRegistration } from "./htmlContentRegistration.js";

// webfinger
import { handleWebfingerGETRequest } from "./webfinger.js";

// Processing content email/html
//import { gethtmlContentProcessing } from "./htmlContentProcessing.js"
//import { getemailContentProcessing } from "./emailContentProcessing.js"

import { gethtmlContentProcessingNew } from "./htmlContentProcessingNew.js"

import { readProcessingRequestBodyPOST } from "./logicProcessing.js"


import { handleConfirmationGETRequest } from "./logicConfirmation.js"
import { readConfirmationRequestBodyPOST } from "./logicConfirmation.js"

import { handleVerifiedEmailGETRequest } from "./logicVerifiedPage.js"
import { handleVerifiedTwitterGETRequest } from "./logicVerifiedPage.js"
import { handleVerifiedGitHubGETRequest } from "./logicVerifiedPage.js"
import { handleVerifiedRedditGETRequest } from "./logicVerifiedPage.js"


// Processing email handler
//import { handleEmail } from "./emailHandler.js"

//import { handleVerification } from "./verificationHandler.js"

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
    let postData = {};
    for (const entry of formData.entries()) {
      // TODO: toLowercase this all
      postData[entry[0]] = entry[1];
    }
    let normalizedRequestData = strictNormalizeWebData(postData);
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
  let paramData = {};
  if (searchParams.get("mastodon_id")) {
    paramData["mastodon_id"] = searchParams.get("mastodon_id");
  }
  if (searchParams.get("action")) {
    paramData["action"] = searchParams.get("action");
  }
  if (searchParams.get("email_address")) {
    paramData["email_address"] = searchParams.get("email_address");
  }
  if (searchParams.get("github_id")) {
    paramData["github_id"] = searchParams.get("github_id");
  }
  if (searchParams.get("linkedin_id")) {
    paramData["linkedin_id"] = searchParams.get("linkedin_id");
  }
  if (searchParams.get("reddit_id")) {
    paramData["reddit_id"] = searchParams.get("reddit_id");
  }
  if (searchParams.get("twitter_id")) {
    paramData["twitter_id"] = searchParams.get("twitter_id");
  }
  if (searchParams.get("token")) {
    paramData["token"] = searchParams.get("token");
  }
  
  let normalizedRequestData = strictNormalizeWebData(paramData);
  // TODO: ALSO INCLUDE ORIGINAL DATA
  return normalizedRequestData;
//  return new Response(JSON.stringify(normalizedRequestData), {status: "200", headers: {"content-type": "text/plain"}});
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// POST Request
// 
// Routes:
// webfinger.io/apiv1/processing/*
// webfinger.io/apiv1/confirmation/*
///////////////////////////////////////////////////////////////////////////////////////////////////
async function handlePOSTRequest(requestData) {
  let requestURL = new URL(requestData.url);
  if (requestURL.pathname === "/apiv1/processing") {
    let normalizedData = await readPOSTRequestBody(requestData);
    let replyBody = await readProcessingRequestBodyPOST(normalizedData);


    let webpage_reply = gethtmlContentProcessingNew(replyBody, normalizedData);
    return new Response(webpage_reply, {status: "200", headers: {"content-type": "text/html;charset=UTF-8"}});
    
	} 
  else if (requestURL.pathname === "/apiv1/confirmation") {
    // TODO: take confirmation GET request and to the work
    // 
    let normalizedData = await readPOSTRequestBody(requestData);
    let replyBody = await readConfirmationRequestBodyPOST(normalizedData);
    return replyBody;
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
    htmlContent = gethtmlContentRegistration("registration");
    return new Response(htmlContent, {status: "200", headers: {'content-type': 'text/html;charset=UTF-8'}});
	} 
  else if (requestURL.pathname === "/new") {
    let initial_data = {};
    initial_data["uuid"] = uuidv4();
    htmlContent = gethtmlContentRegistration("newregistration", initial_data);
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
  // startsWith /github/ means GitHub
  else if (requestURL.pathname.startsWith("/github/") || requestURL.pathname.startsWith("/GitHub/") || requestURL.pathname.startsWith("/Github/")) {
    //return new Response("GitHub account", {status: "200", headers: {"content-type": "text/plain"}});
    replyBody = await handleVerifiedGitHubGETRequest(requestURL.pathname);
    return replyBody;
	} 
  // startsWith /u/ means Reddit
  else if (requestURL.pathname.startsWith("/u/") || requestURL.pathname.startsWith("/reddit/") ) {
    replyBody = await handleVerifiedRedditGETRequest(requestURL.pathname);
    return replyBody;
  } 
  // startsWith @ means twitter
  else if (requestURL.pathname.startsWith("/@") || requestURL.pathname.startsWith("/twitter/")) {
    //return new Response("Twitter account", {status: "200", headers: {"content-type": "text/plain"}});
    replyBody = await handleVerifiedTwitterGETRequest(requestURL.pathname);
    return replyBody;
	} 
  // an @ in it means it's an email
  else if (requestURL.pathname.includes("@") || requestURL.pathname.startsWith("/email/")) {
    replyBody = await handleVerifiedEmailGETRequest(requestURL.pathname);
    return replyBody;
	} 
  // /GitHub/*
  // /u/* reddit
  // /LinkedIn/*
  // /HackerNews/*
  // /Instagram/*
  // /TikTok/*
  // /FaceBook/*
  // /YouTube/*
  // /WhatsApp/*
  // /WeChat/*
  // /dns/*
  // 
  // Things we explicitly will not support:
  // Phone numbers
  // Physical addresses
  // Gov ID numbers
  // Because PII concerns, and we can't verify them safely
  // 
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
