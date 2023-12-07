---
title: Building a Simple Sign-In Page with MSAL.js for Microsoft Identities
date: 2018-07-31T22:25:43-08:00
authors: shawntabrizi
layout: post
slug: /aad/building-a-simple-sign-in-page-with-msal-js-for-microsoft-identities/
categories:
  - AAD
tags:
  - authentication
  - azure active directory
  - javascript
  - msal
github: Microsoft-Authentication-with-MSAL.js
---

##### In this post I will discuss how I used MSAL.js to build a simple sign-in experience for Microsoft Identities, and some of the things I learned along the way.

I have worked with a lot of different people to onboard to Microsoft's Identity system. Whether it be app registration, app development, or even debugging the login experience, people quickly learn that authentication and authorization isn't always as straightforward as one might expect.

It is for that reason I think it is really important to build [minimal, complete, and verifiable examples](https://stackoverflow.com/help/mcve) of the authentication process. I previously had built a minimal authentication sample for [ADAL .NET using PowerShell](https://github.com/shawntabrizi/Azure-AD-Authentication-with-PowerShell-and-ADAL), and [this ended up having a number of different uses](https://shawntabrizi.com/aad/azure-ad-authentication-with-powershell-and-adal/).

I want to do the same for MSAL.js!

## My goals:

* Create a login page
* Use only basic HTML + JavaScript
* Does not require a 'web server', just simple web hosting
* Can obtain an Access Token for a custom resource, with custom scopes
* (Stretch Goal) Allow a user to use their own App ID for getting an access token

## Starting with a Minimal example

Fortunately, MSAL.js has a set of really great [minimal examples](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-core/samples/VanillaJSTestApp) which do not require a back-end web server, unlike its predecessor ADAL.js whose [samples](https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Code-samples) ALL require a .NET backend. (WHY???)

Although there is a `minimal.html` file, I would not start there, since I do not feel that it follows the best practices of using the library. Instead, start with the [`index.html`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/samples/VanillaJSTestApp/index.html) which is still very raw, but includes an `applicationConfig` object, functionalizes the login flow, and also has a basic UX.

One of the important things I came to realize was the importance of creating a global variable for the `MSAL.UserAgentApplication` object. It seems to do a lot of different things like listen for the callback from the popup window that gets created, and captures the returned ID and access token to be ingested by the `acquireToken` functions. I had mistakenly wrapped this variable into my login function, and the results were... weird.

When using the popup experience, the redirection happened WITHIN the popup itself rather than the main page where the sign-in experience was initiated.

![](/assets/images/img_5b614c4d2d483.png)

This was a really awful experience, which then made me go down the path of switching `loginPopup` to `loginRedirect` so that the user would stay on the same page the whole time. However, this then caused issues where the ID token would just end up in the URL as a fragment (`#`) and the callback function which turned an ID token into an access token would not work anymore!

When I first was building this page, I actually ignored these problems, since I was working on a Hackathon, and I just needed to keep building. However, I can say that all of this really was caused simply by NOT having the `UserAgentApplication` object in the global context.

SO DON'T DO THAT!

## A working sample

You can find the end result of my simple sign-in page here:

[https://shawntabrizi.com/Microsoft-Authentication-with-MSAL.js/](https://shawntabrizi.com/Microsoft-Authentication-with-MSAL.js/)

Source code is on [GitHub](https://github.com/shawntabrizi/Microsoft-Authentication-with-MSAL.js).

![](/assets/images/img_5b614ec708ba1.png)

The page currently will sign you in, and get an access token to the Microsoft Graph with the scope `user.read`. Additionally, it will show you your ID token and access token as both a raw JWT and in its decoded JSON format, which I teach how to do [here](https://shawntabrizi.com/aad/decoding-jwt-tokens/).

Besides showing off MSAL.js in a really simple website, I think this app will be useful when trying to use other tools like Postman where you will need to have a valid access token, and generating one may not be so straight forward to the end user.

## Next steps

While this sample in its current form is pretty cool, it does not satisfy all the goals I listed above. That will be the next step for me on this project. I still need to figure out exactly how to call a custom API using a V2 application (which may not even be possible to configure right now until a new UX which a co-worker of mine is working on becomes available). However, allowing a user to input custom scopes should be really easy, and if others configure their own App ID to have my website as a redirect url, then I could see using a custom App ID to be really easy too.

I will be making this updates in the same [GitHub](https://github.com/shawntabrizi/Microsoft-Authentication-with-MSAL.js) I listed above, and you should see the changes directly on the [same page as before](https://shawntabrizi.com/Microsoft-Authentication-with-MSAL.js/)! I hope this was useful for some of you, and if there are additional things I could add to make this project work better for you, just let me know through a GitHub issue.
