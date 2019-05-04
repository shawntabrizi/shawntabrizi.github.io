---
id: 578
title: Building a Simple Sign-In Page with MSAL.js for Microsoft Identities
date: 2018-07-31T22:25:43-08:00
author: Shawn Tabrizi
layout: post
guid: https://shawntabrizi.com/?p=578
permalink: /aad/building-a-simple-sign-in-page-with-msal-js-for-microsoft-identities/
categories:
  - AAD
tags:
  - authentication
  - azure active directory
  - javascript
  - msal
---
<h5>In this post I will discuss how I used MSAL.js to build a simple sign-in experience for Microsoft Identities, and some of the things I learned along the way.</h5>

<p>I have worked with a lot of different people to onboard to Microsoft's Identity system. Whether it be app registration, app development, or even debugging the login experience, people quickly learn that authentication and authorization isn't always as straightforward as one might expect.</p>

<p>It is for that reason I think it is really important to build <a href="https://stackoverflow.com/help/mcve">minimal, complete, and verifiable examples</a> of the authentication process. I previously had built a minimal authentication sample for <a href="https://github.com/shawntabrizi/Azure-AD-Authentication-with-PowerShell-and-ADAL">ADAL .NET using PowerShell</a>, and <a href="https://shawntabrizi.com/aad/azure-ad-authentication-with-powershell-and-adal/">this ended up having a number of different uses</a>.</p>
<p>I want to do the same for MSAL.js!</p>

<h2>My goals:</h2>
<p>
<ul>
<li>Create a login page</li>
<li>Use only basic HTML + JavaScript</li>
<li>Does not require a 'web server', just simple web hosting</li>
<li>Can obtain an Access Token for a custom resource, with custom scopes</li>
<li>(Stretch Goal) Allow a user to use their own App ID for getting an access token</li>
</ul>
</p>

<h2>Starting with a Minimal example</h2>
<p>Fortunately, MSAL.js has a set of really great <a href="https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-core/samples/VanillaJSTestApp">minimal examples</a> which do not require a back-end web server, unlike its predecessor ADAL.js whose <a href="https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Code-samples">samples</a> ALL require a .NET backend. (WHY???)</p>
<p>Although there is a <code>minimal.html</code> file, I would not start there, since I do not feel that it follows the best practices of using the library. Instead, start with the <a href="https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/samples/VanillaJSTestApp/index.html"><code>index.html</code></a> which is still very raw, but includes an <code>applicationConfig</code> object, functionalizes the login flow, and also has a basic UX.</p>

<p>One of the important things I came to realize was the importance of creating a global variable for the <code>MSAL.UserAgentApplication</code> object. It seems to do a lot of different things like listen for the callback from the popup window that gets created, and captures the returned ID and access token to be ingested by the <code>acquireToken</code> functions. I had mistakenly wrapped this variable into my login function, and the results were... weird.</p>

<p>When using the popup experience, the redirection happened WITHIN the popup itself rather than the main page where the sign-in experience was initiated.</p>
<img alt='' class='alignnone size-full wp-image-584 ' src='https://shawntabrizi.com/wordpress/wp-content/uploads/2018/07/img_5b614c4d2d483.png' />
<p>This was a really awful experience, which then made me go down the path of switching <code>loginPopup</code> to <code>loginRedirect</code> so that the user would stay on the same page the whole time. However, this then caused issues where the ID token would just end up in the URL as a fragment (<code>#</code>) and the callback function which turned an ID token into an access token would not work anymore!</p>

<p>When I first was building this page, I actually ignored these problems, since I was working on a Hackathon, and I just needed to keep building. However, I can say that all of this really was caused simply by NOT having the <code>UserAgentApplication</code> object in the global context.</p>
<p>SO DON'T DO THAT!</p>

<h2>A working sample</h2>
<p>You can find the end result of my simple sign-in page here:</p>
<p><a href="https://shawntabrizi.com/msal/">https://shawntabrizi.com/msal/</a></p>

<p>Source code is on <a href="https://github.com/shawntabrizi/Microsoft-Authentication-with-MSAL.js">GitHub</a>.</p>

<img alt='' class='alignnone size-full wp-image-588 ' src='https://shawntabrizi.com/wordpress/wp-content/uploads/2018/07/img_5b614ec708ba1.png' />

<p>The page currently will sign you in, and get an access token to the Microsoft Graph with the scope <code>user.read</code>. Additionally, it will show you your ID token and access token as both a raw JWT and in its decoded JSON format, which I teach how to do <a href="https://shawntabrizi.com/aad/decoding-jwt-tokens/">here</a>.</p>

<p>Besides showing off MSAL.js in a really simple website, I think this app will be useful when trying to use other tools like Postman where you will need to have a valid access token, and generating one may not be so straight forward to the end user.</p>

<h2>Next steps</h2>
<p>While this sample in its current form is pretty cool, it does not satisfy all the goals I listed above. That will be the next step for me on this project. I still need to figure out exactly how to call a custom API using a V2 application (which may not even be possible to configure right now until a new UX which a co-worker of mine is working on becomes available). However, allowing a user to input custom scopes should be really easy, and if others configure their own App ID to have my website as a redirect url, then I could see using a custom App ID to be really easy too.</p>

<p>I will be making this updates in the same <a href="https://github.com/shawntabrizi/Microsoft-Authentication-with-MSAL.js">GitHub</a> I listed above, and you should see the changes directly on the <a href="https://shawntabrizi.com/msal/">same page as before</a>! I hope this was useful for some of you, and if there are additional things I could add to make this project work better for you, just let me know through a GitHub issue.</p>
