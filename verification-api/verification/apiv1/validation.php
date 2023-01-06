<?php

$secret_api_token = '8294096259801751OIUHEBOWFIH3oiqfhbaf';

// $postdata["API_TOKEN_VERIFICATION"]
// secret API TOKEN, API_TOKEN_VERIFICATION on cloudflare end

// $postdata["ACCOUNT_TYPE"]
// github, twitter, linkedin, instagram, facebook, etc.

// $postdata["ACCOUNT_NAME"]
// Account name, most services are unique

// $postdata["MASTODON_ID"] 
// @username@server only. converted to server/@username for searching

// $postdata["CALLBACK_URL"] 
// URL to send POST to, e.g. confirmation?

// $postdata["CALLBACK_ACTION"] 
// the action e.g. link_mastodon_id

// $postdata["CALLBACK_TOKEN"] 
// the UUID e.g. KV: [twitter:username]:[UUID]

// Buffer all upcoming output...
ob_start();

$postdata = json_decode(file_get_contents('php://input'), true);

if($postdata["API_TOKEN_VERIFICATION"] == $secret_api_token) {
    if ($postdata["ACCOUNT_TYPE"] == 'twitter') {
        if (preg_match("/^[a-z0-9_]{2,15}$/",$postdata["ACCOUNT_NAME"])) {
           echo 'SUCCESS:GOOD TWITTER NAME';
        }
        else {
            echo 'ERROR: INVALID twitter name';
        }
    }
    elseif ($postdata["ACCOUNT_TYPE"] == 'github') {
        if (preg_match("/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/",$postdata["ACCOUNT_NAME"])) {
           echo 'SUCCESS: GOOD GITHUB NAME';
        }
        else {
            echo 'ERROR: INVALID github name';
        }
    }
    else {
        echo 'no valid account type found';
    }

} 
else {
    echo 'ERROR: bad API token';
    exit();
}

// Get the size of the output.
$size = ob_get_length();

// Disable compression (in case content length is compressed).
header("Content-Encoding: none");

// Set the content length of the response.
header("Content-Length: {$size}");

// Close the connection.
header("Connection: close");

// Flush all output.
ob_end_flush();
@ob_flush();
flush();

//// Close current session (if it exists).
if(session_id()) session_write_close();

// Start your work here:

if ($postdata["ACCOUNT_TYPE"] == 'github') {
    if (preg_match("/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/",$postdata["ACCOUNT_NAME"])) {
        $found_mastodon_id = False;

        // 8 gigs of ram and --crash-dumps-dir= otherwise it defaults to /tmp/Crashpad which will cause it to fail
        // if another user also runs google-chrome (e.g. for testing). We do run the output through grep to get
        // the one line we care about
        $github_description_line = shell_exec('sudo -u root ip netns exec ns1 google-chrome --no-sandbox --crash-dumps-dir=/tmp/www --disable-crash-reporter --headless --disable-gpu --enable-javascript --dump-dom https://github.com/' . $postdata["ACCOUNT_NAME"] . ' 2>/dev/null | grep "<meta name=\"description\" content=\""');

        $regex = '/' . $postdata["MASTODON_ID"] . '/';

        list($null_spacer, $mastodon_name, $mastodon_dns) = explode("@", $postdata["MASTODON_ID"]);
        $regex_url = '/' . $mastodon_dns . '\/@' . $mastodon_name . '/';

        if(preg_match($regex, $github_description_line)) {
            $found_mastodon_id = True;
        }
        elseif (preg_match($regex_url, $github_description_line)) {
            $found_mastodon_id = True;
        }
        // If we find no Mastodon URL we're done. CONSIDER: Return an error somehow longer term?
    }
    if ($found_mastodon_id == True) {
        // Do POST to confirmation to create record

        shell_exec('curl -s ' . $postdata["CALLBACK_URL"]  . ' -d "action=' . $postdata["CALLBACK_ACTION"] . '&token=' . $postdata["CALLBACK_TOKEN"] . '&mastodon_id=' . $postdata["MASTODON_ID"] . '&github_id=' . $postdata["ACCOUNT_NAME"] . '" ');    

    }
}

else if ($postdata["ACCOUNT_TYPE"] == 'reddit') {
    if (preg_match("/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/",$postdata["ACCOUNT_NAME"])) {
        $found_mastodon_id = False;

        // 8 gigs of ram and --crash-dumps-dir= otherwise it defaults to /tmp/Crashpad which will cause it to fail
        // if another user also runs google-chrome (e.g. for testing). We do run the output through grep to get
        // the one line we care about
        $reddit_description_line = shell_exec('sudo -u root ip netns exec ns1 google-chrome --no-sandbox --crash-dumps-dir=/tmp/www --disable-crash-reporter --headless --disable-gpu --enable-javascript --dump-dom https://reddit.com/user/' . $postdata["ACCOUNT_NAME"] . ' 2>/dev/null | grep "^      <title>" | head -n 1');

        $regex = '/' . $postdata["MASTODON_ID"] . '/';

        list($null_spacer, $mastodon_name, $mastodon_dns) = explode("@", $postdata["MASTODON_ID"]);
        $regex_url = '/' . $mastodon_dns . '\/@' . $mastodon_name . '/';

        if(preg_match($regex, $reddit_description_line)) {
            $found_mastodon_id = True;
        }
        elseif (preg_match($regex_url, $reddit_description_line)) {
            $found_mastodon_id = True;
        }
        // If we find no Mastodon URL we're done. CONSIDER: Return an error somehow longer term?
    }
    if ($found_mastodon_id == True) {
        // Do POST to confirmation to create record

        shell_exec('curl -s ' . $postdata["CALLBACK_URL"]  . ' -d "action=' . $postdata["CALLBACK_ACTION"] . '&token=' . $postdata["CALLBACK_TOKEN"] . '&mastodon_id=' . $postdata["MASTODON_ID"] . '&reddit_id=' . $postdata["ACCOUNT_NAME"] . '" ');    

    }
}

else if ($postdata["ACCOUNT_TYPE"] == 'twitter') {
    if (preg_match("/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/",$postdata["ACCOUNT_NAME"])) {
        $found_mastodon_id = False;

        // 8 gigs of ram and --crash-dumps-dir= otherwise it defaults to /tmp/Crashpad which will cause it to fail
        // if another user also runs google-chrome (e.g. for testing). We do run the output through grep to get
        // the one line we care about
        $twitter_json_data = shell_exec('sudo -u root ip netns exec ns1 google-chrome --no-sandbox --crash-dumps-dir=/tmp/www --disable-crash-reporter --headless --disable-gpu --enable-javascript --dump-dom https://twitter.com/' . $postdata["ACCOUNT_NAME"] . ' 2>/dev/null | sed -n \'/^  "@context": "http:\/\/schema.org",$/,/^}/p\'');

        $regex = '/' . $postdata["MASTODON_ID"] . '/';

        list($null_spacer, $mastodon_name, $mastodon_dns) = explode("@", $postdata["MASTODON_ID"]);
        $regex_url = '/' . $mastodon_dns . '\/@' . $mastodon_name . '/';

        if(preg_match($regex, $twitter_json_data)) {
            $found_mastodon_id = True;
        }
        elseif (preg_match($regex_url, $twitter_json_data)) {
            $found_mastodon_id = True;
        }
        // If we find no Mastodon URL we're done. CONSIDER: Return an error somehow longer term?
    }
    if ($found_mastodon_id == True) {
        // Do POST to confirmation to create record

        shell_exec('curl -s ' . $postdata["CALLBACK_URL"]  . ' -d "action=' . $postdata["CALLBACK_ACTION"] . '&token=' . $postdata["CALLBACK_TOKEN"] . '&mastodon_id=' . $postdata["MASTODON_ID"] . '&twitter_id=' . $postdata["ACCOUNT_NAME"] . '" ');    
    }
}

exit();


// sed -n '/^  "@context": "http:\/\/schema.org",$/,/^}/p'

// TESTING VALIDATION
// curl -X POST https://verification-api.webfinger.io/apiv1/echo -H 'Content-Type: application/json' -d '{"API_TOKEN_VERIFICATION":"8294096259801751OIUHEBOWFIH3oiqfhbaf","ACCOUNT_TYPE":"github","ACCOUNT_NAME":"kurtseifried","MASTODON_ID":"@kurtseifried@mastodon.social", "CALLBACK_URL":"https://webfinger.io/confirmation","CALLBACK_ACTION":"link_mastodon_id","CALLBACK_TOKEN":"UUID HERE"}'

// TESTING CONFIRMATION - use form action 
// action=link_mastodon_id
// token=7d6ebb10-5e11-4c11-9d98-567422ec7391
// mastodon_id=@kurtseifried@mastodon.social
// github_id=kurtseifried
// curl https://webfinger.io/apiv1/confirmation -d "action=link_mastodon_id&token=332ab269-3ac2-47ac-bdba-ff26dcc1678f&mastodon_id=@kurtseifried@mastodon.social&github_id=kurtseifried" 


// 

?>
