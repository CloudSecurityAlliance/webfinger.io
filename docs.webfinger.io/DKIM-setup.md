# DKIM setup

## Mailchannels

A basic document on DKIM setup for mailchannels is available at: 
https://mailchannels.zendesk.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature

But it lacks details like creating keys and DNS records.

## Creating a DKIM private and public key:

Private key as PEM file and base64 encoded txt file:

```
openssl genrsa 2048 | tee priv_key.pem | openssl rsa -outform der | openssl base64 -A > priv_key.txt
```

Public key as DNS record:

```
echo -n "v=DKIM1;p=" > pub_key_record.txt && \
openssl rsa -in priv_key.pem -pubout -outform der | openssl base64 -A >> pub_key_record.txt
```

## Creating the public DNS records:

Then set a DNS TXT record of selectorname._domainkey.example.org with the value from pub_key_record.txt, e.g.:

```
mailchannels._domainkey IN TXT "v=DKIM1; p=<content of the file pub_key_record.txt>"
```

Now you need a DMARC record to enforce usage of the DKIM signature:

```
_dmarc IN TXT "v=DMARC1; p=reject; adkim=s; aspf=s; rua=mailto:YYY; ruf=mailto:YYY pct=100; fo=1;"
```

## Setting up your Javascript to use it:

In the add 

```
"dkim_domain": "wexample.org",
"dkim_selector": "mailchannels",
"dkim_private_key": "<content of the file priv_key.txt>"
```

And you should be good to go.
