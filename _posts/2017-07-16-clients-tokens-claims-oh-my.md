---
title: Clients and Tokens and Claims! Oh My!
date: 2017-07-16T22:52:31-08:00
author: Shawn Tabrizi
layout: post
permalink: /aad/clients-tokens-claims-oh-my/
categories:
  - AAD
tags:
  - access token
  - application
  - azure active directory
  - claims
  - client
  - group membership claims
  - resource
---
<p>Let me just jump to the point with this post: Client applications should not depend on claims in access tokens to gather data about the signed-in user or anything about the authenticated session.</p>

<p>Time and time again, I have seen client applications complain to me that certain claims, like group membership claims, are not appearing in the access token they receive, and they ask me how to enable this. They incorrectly assume that if they go into their application manifest, and change the "groupMembershipClaims" settings, that they will be able to start getting claims, but everyone eventually finds out... it doesn't work!</p>

<p>Let's take a look at source material; from the <a href="https://tools.ietf.org/html/rfc6749#section-1.4">OAuth 2 specification</a>:</p>

<p><blockquote>An access token is a string representing an authorization issued to the client. <strong>The string is usually opaque to the client</strong>.</blockquote></p>

<p>Unfortunately, the OAuth 2 specification is intentionally broad, but in summary, the 'access token' that is given to a client should only really be explored by the specified audience of the token. Some implementations of OAuth 2 do not even pass a JWT token to the client. Instead they pass a unique string, and then the resource exchanges that string for the actual token using a signed request. Alternatively, other implementations pass an encrypted JWT token rather than just a signed token. This means that the resource application uploads a token signing key which the authorization server uses to encrypt the full token. That means that the only person who can look at the claims in the token is the resource who also has the private key for decryption.</p>

<p>The implementation of OAuth 2 that I am most familiar with, Azure Active Directory,  issues a signed token, which means that its content is completely visible to the client. In the future, Azure AD may add support for encrypted tokens, which means that clients are going to have to start following the correct practices.</p>

<p>Need to know about the user signed into your web application?</p>

<p style="padding-left: 30px;">>> Get an <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-token-and-claims#idtokens">ID token</a>! These are meant for client consumption!</p>

<p>Need to know which groups a user is a member of?</p>

<p style="padding-left: 30px;">>> Get an access token to the AAD or Microsoft Graph API and query the API!</p>

<p>Now lets go back to the original problem. If groupMembershipClaims are not meant for clients to get the claims in the access token, what are they used for? You might have figured out by now, but they are for <strong>resource</strong> applications to get the claims in the access token!</p>

<p>Lets show an example. To set up, I have registered two Azure AD Web Apps/APIs called Web API 1 and Web API 2. Both of these applications are identical, except Web API 1 has the setting "groupMembershipClaims": "All", and the other is set to null, which is default. I have to set up a fake App ID URI for both apps, and I have to make sure that each application has the other set as a "required permission".</p>

<p>I will be using my <a href="https://shawntabrizi.com/aad/azure-ad-authentication-with-powershell-and-adal/">PowerShell Scripts</a> to quickly get two access tokens. One where the client is Web API 1 and the resource is Web API 2, and vice versa.</p>

<p>Let's look at the results, using my JWT Decoder to look at the payload:</p>

<h4>Payload 1:  Client = Web API 1, Resource = Web API 2</h4>

<pre>{
    "aud": "https://shawntest.onmicrosoft.com/WebApi2",
    "iss": "https://sts.windows.net/4a4d599f-e69d-4cd8-a9e1-9882ea340fb5/",
    "iat": 1500243353,
    "nbf": 1500243353,
    "exp": 1500247253,
    "acr": "1",
    "aio": "ATQAy/.../oU",
    "amr": [ "rsa", "mfa" ],
    "appid": "eb7b6208-538c-487b-b5b5-137ac6ab6646",
    "appidacr": "1",
    "email": "shtabriz@microsoft.com",
    "family_name": "Tabrizi",
    "given_name": "Shawn",
    "idp": "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
    "in_corp": "true",
    "ipaddr": "XX.XXX.XXX.XXX",
    "name": "Shawn Tabrizi",
    "oid": "41bdce9b-3940-40a9-b2f2-03a003ad599c",
    "platf": "3",
    "scp": "user_impersonation",
    "sub": "hfS9IZ_..._JW8c5Gg",
    "tid": "4a4d599f-e69d-4cd8-a9e1-9882ea340fb5",
    "unique_name": "shtabriz@microsoft.com",
    "ver": "1.0"
}</pre>

<h4>Payload 2: Client = Web API 2, Resource = Web API 1</h4>

<pre>{
    "aud": "https://shawntest.onmicrosoft.com/WebApi1",
    "iss": "https://sts.windows.net/4a4d599f-e69d-4cd8-a9e1-9882ea340fb5/",
    "iat": 1500243330,
    "nbf": 1500243330,
    "exp": 1500247230,
    "acr": "1",
    "aio": "ATQAy/...BLDunA",
    "amr": [ "rsa", "mfa" ],
    "appid": "554e427d-36c3-4a77-89a5-a082ee333e12",
    "appidacr": "1",
    "email": "shtabriz@microsoft.com",
    "family_name": "Tabrizi",
    "given_name": "Shawn",
    <strong>"groups": [ "0f4374e6-8131-413e-b32b-f98bfdb371ed" ],</strong>
    "idp": "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
    "in_corp": "true",
    "ipaddr": "XX.XXX.XXX.XXX",
    "name": "Shawn Tabrizi",
    "oid": "41bdce9b-3940-40a9-b2f2-03a003ad599c",
    "platf": "3",
    "scp": "user_impersonation",
    "sub": "xy..._zGJEZnIB4",
    "tid": "4a4d599f-e69d-4cd8-a9e1-9882ea340fb5",
    "unique_name": "shtabriz@microsoft.com",
    "ver": "1.0",
    "wids": [ "62e90394-69f5-4237-9190-012177145e10" ]
}</pre>

<p>Note that we only get the group membership claims when the <strong>resource</strong> application has this setting, not the client application. The client application has no power to control the types of claims in the token, because ultimately the token is not for them!</p>

<p>If you are building a client application using Azure Active Directory, please do not use the access token to try and get information about the authenticated session. The correct practice here is to request separately an ID Token , or to call the AAD / Microsoft Graph API to get the information you need. I hope you learned exactly how to use the "groupMembershipClaims" property and I hope this helps you build better apps in the future!</p>