---
title: Decoding JWT Tokens
date: 2017-07-05T07:38:50-08:00
author: Shawn Tabrizi
layout: post
permalink: /aad/decoding-jwt-tokens/
categories:
  - AAD
tags:
  - azure active directory
  - javascript
  - json web token
  - programming
github: JWT-Decoder-Javascript
---
<blockquote>Forewarning: I know that "JWT Tokens" is case of <a href="https://en.wikipedia.org/wiki/RAS_syndrome">RAS syndrome</a>... but I can't help it!</blockquote></p>
<h2>Are your tokens safe when using online decoders?</h2>
<p>In the identity space, decoding JSON Web Tokens (JWT tokens) is a regular event. One of the first things we do in order to try and debug issues that customers or partners are having is taking a quick peek into the access tokens they are using, and seeing if anything is wrong.</p>

<p>In Azure Active Directory, we are commonly looking at the "audience" claim or the "scopes" in the token to make sure that they have the token to the right resource, and they have the right level of permissions for the task. But sometimes problems can be even more subtle than that. For example, the "tenant" information can be wrong, and people may never notice the subtle difference in GUID.</p>

<p>Either way, being able to read the contents of a token is crucial, and so I have always relied on small web apps created by others to do this. However, at work recently, there was discussion about how the most popular site for this (https://jwt.io/) may be storing the tokens that are submitted into the app. If someone submits a token that is still active, there is a possibility that the site could use that token and impersonate you! Furthermore, the website was created by a Microsoft competitor, Auth0... so just bad news in general.</p>

<p>I wanted to create my own JWT decoder so that I know for certain that my tokens are not being used maliciously, and so I could learn a little more about JWT tokens in general.</p>

<p>I created this very basic page: <a href="https://shawntabrizi.com/jwt/">https://shawntabrizi.com/jwt/</a></p>

<p>You can find the GitHub source <a href="https://github.com/shawntabrizi/JWT-Decoder-Javascript">here</a>. Let's talk about what I did.</p>

<h2>JSON Web Token Structure</h2>

<p>A JWT token is broken up into 3 sections, all separated by periods. The first section is the Header, which contains information about the token type and the algorithm used to sign or encrypt that token. The second section is the Payload, where all the main claims are stored for the token. Finally, the third section is the token signature, where a token issuer can prove that they were the ones that actually minted the token. Tokens do not need to be signed, and if they are not, the third section will be empty. However, they will still contain a period to separate it from the second section as <a href="https://tools.ietf.org/html/rfc7519#section-6.1">shown here</a>.</p>

<p>The problem I needed to solve was pretty simple: Take the encoded JWT token, and get the claims out of it. I think the easiest way to explain the steps is simply to look at my commented code:</p>

```javascript
//This function takes a base 64 url encoded string, and converts it to a JSON object... using a few steps.
function decoder(base64url) {
    try {
        //Convert base 64 url to base 64
        var base64 = base64url.replace('-', '+').replace('_', '/')
        //atob() is a built in JS function that decodes a base-64 encoded string
        var utf8 = atob(base64)
        //Then parse that into JSON
        var json = JSON.parse(utf8)
        //Then make that JSON look pretty
        var json_string = JSON.stringify(json, null, 4)
    } catch (err) {
        json_string = "Bad Section.\nError: " + err.message
    }
    return json_string
}
```

<p>JWT tokens are Base 64 URL encoded. While they are nearly the same, characters like "+" and "/" turn into "-" and "_" respectively. Learn more <a href="https://en.wikipedia.org/wiki/Base64#URL_applications">here</a>. From there, converting a Base 64 encoded string to a pretty JSON string is really self explanatory.</p>

<p>The rest of the work beyond this is just handling random user inputs. We have checks to verify the individual parts of the token are good, and whether or not the token contains a signature. As I suspected, creating a site to decode JWT tokens is really quite simple, and now I have my own site to do it on!</p>