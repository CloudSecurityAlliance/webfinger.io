
// filename: ./src/securitytxt.js
// RFC 9116 says Expires should be less than a year out. We refresh QUARTERLY,
// each time setting it a year ahead, so the file is never close to expiring and
// the task stays in a rhythm we actually notice. An annual renewal is too easy
// to forget. Next refresh due 2026-12-05 -> set Expires to 2027-12-05.
export function getsecuritytxt() {
    let htmlContent = `Contact: mailto:security@webfinger.io
Expires: 2027-09-05T00:00:00.000Z
Canonical: https://webfinger.io/.well-known/security.txt
Policy: https://cloudsecurityalliance.org/security
Preferred-Languages: en
`;
return htmlContent;
}
