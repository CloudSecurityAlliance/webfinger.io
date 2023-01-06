# Social media account name rules and regex

## Email

We limit them to 128 and a subset of valid characters (e.g. no @ in the username portion).

Length: 3-128
Contents: 
Case sensitive: no
JavaScript regex:
PHP regex:
Bash regex:

## GitHub

From the github account creation page:
Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.

Length: 1-39
Contents: a-z0-9-
Case sensitive: no
JavaScript regex: ```/^[a-z0-9][a-z0-9-]*$/```
PHP regex:
Bash regex:

## Reddit

https://reddit.com/ create acocunt:
Letters, numbers, dashes, and underscores only. Please try again without symbols. Username must be between 3 and 20 characters.

Length: 3-20
Contents: a-z0-9-_
Case sensitive: no
JavaScript regex: ```/^[a-z0-9-_]{3,20}$/```
PHP regex:
Bash regex:


## Twitter

https://help.twitter.com/en/managing-your-account/twitter-username-rules

Your username cannot be longer than 15 characters. Your name can be longer (50 characters) or shorter than 4 characters, but usernames are kept shorter for the sake of ease. A username can only contain alphanumeric characters (letters A-Z, numbers 0-9) with the exception of underscores, as noted above. Check to make sure your desired username doesn't contain any symbols, dashes, or spaces.

Note: some names exist already that are shorter than 4, e.g. single letters

Length: 1-15
Contents: a-z0-9_
Case sensitive: no
JavaScript regex: ```/^[a-z0-9_]{1,15}$/```
PHP regex:
Bash regex:

