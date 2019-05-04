---
id: 43
title: Secret APIs in Azure Active Directory and Azure Resource Manager
date: 2017-07-11T08:40:44-08:00
author: Shawn Tabrizi
layout: post
guid: http://shawntabrizi.com/blog/?p=43
permalink: /aad/secret-apis-in-azure-active-directory-and-azure-resource-manager/
categories:
  - AAD
tags:
  - arm
  - azure active directory
  - azure resource manager
  - powershell
  - rest api
  - subscription
  - tenant
---
<p>Have you ever wondered what the Tenant ID for Microsoft (microsoft.com) or any other domain is? Have you ever wondered how you can find the right Tenant ID to sign in a user given their Azure Subscription ID?</p>

...

<p>Oh, you haven't? Well that is certainly more reasonable than the fact that I have; but, if for some reason you are asking the same questions as I am, let me tell you about some of the "secret APIs" that are available to answer those questions.</p>

<h2>Getting the Tenant ID for a Verified Domain in Azure Active Directory</h2>
<p>Azure Active Directory tenants have a special type of domain called a 'verified domain'. Verified domains are what they sound like, domains which a user has proven they own through DNS verification. These domains are unique across all tenants, and can act as a alternative domain to the initial domain given to all tenants (*.onmicrosoft.com).</p>

<p>While authentication and even the AAD Graph API both support the use of these domains for referencing a tenant, not all APIs support this. Sometimes you might need to convert the tenant domain to a Tenant ID... but how?</p>

<h3>Well known open id config</h3>
<p>Check out the specification <a href="https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig">here</a>. This Open ID configuration endpoint is required for all Open ID Providers, which AAD is one of. Let's take a look at what the response looks like for the Microsoft tenant using the verified domain 'microsoft.com':</p>

<a href="https://login.microsoftonline.com/microsoft.com/.well-known/openid-configuration">https://login.microsoftonline.com/<strong>microsoft.com</strong>/.well-known/openid-configuration</a>
<pre>{"authorization_endpoint":"https://login.microsoftonline.com/<strong>72f988bf-86f1-41af-91ab-2d7cd011db47</strong>/oauth2/authorize","token_endpoint":"https://login.microsoftonline.com/<strong>72f988bf-86f1-41af-91ab-2d7cd011db47</strong>/oauth2/token","token_endpoint_auth_methods_supported":["client_secret_post","private_key_jwt"],"jwks_uri":"https://login.microsoftonline.com/common/discovery/keys","response_modes_supported":["query","fragment","form_post"],"subject_types_supported":["pairwise"],"id_token_signing_alg_values_supported":["RS256"],"http_logout_supported":true,"frontchannel_logout_supported":true,"end_session_endpoint":"https://login.microsoftonline.com/<strong>72f988bf-86f1-41af-91ab-2d7cd011db47</strong>/oauth2/logout","response_types_supported":["code","id_token","code id_token","token id_token","token"],"scopes_supported":["openid"],"issuer":"https://sts.windows.net/<strong>72f988bf-86f1-41af-91ab-2d7cd011db47</strong>/","claims_supported":["sub","iss","cloud_instance_name","cloud_graph_host_name","aud","exp","iat","auth_time","acr","amr","nonce","email","given_name","family_name","nickname"],"microsoft_multi_refresh_token":true,"check_session_iframe":"https://login.microsoftonline.com/<strong>72f988bf-86f1-41af-91ab-2d7cd011db47</strong>/oauth2/checksession","userinfo_endpoint":"https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/openid/userinfo","tenant_region_scope":"WW","cloud_instance_name":"microsoftonline.com","cloud_graph_host_name":"graph.windows.net"}</pre>

<p>I honestly have never used most of the data in this JSON, and I am not really sure where it gets used... BUT, you will notice that all of the various authentication endpoints now have a Tenant ID GUID rather than a domain name! This tells us two things:</p>

<ol>
 	<li>The Tenant ID for Microsoft.com is 72f988bf-86f1-41af-91ab-2d7cd011db47</li>
 	<li>(maybe this is obvious already.... but) Microsoft has a tenant!</li>
</ol>

<p>Now the second realization is kind of a super-set of the first, but it makes me think about something else cool we can do. What if we wanted to get a count and see which companies have an Azure Active Directory Tenant? As long as we know their Domain Name, we should be able to use this endpoint to confirm if a tenant exists! I will save this exploration for <a href="http://shawntabrizi.com/blog/index.php/2017/07/12/does-company-x-have-an-azure-active-directory-tenant/">my next blog post</a>.</p>

<h2>Get the Tenant ID for a Specific Azure Subscription ID</h2>
<p>The world of Azure Subscriptions is one of the most complicated spaces that shouldn't be complicated. Depending on how you start using Azure, you may never even know that you have an Azure Active Directory Tenant. You just have your Live ID, which you use to sign on to the Azure Portal, and from there you can access your Subscription ID!  You can't even use the 'common' endpoint with Live IDs on AAD V1, so your lack of knowledge can be really painful here for app developers. We <strong>need</strong> your Tenant ID to know the right login endpoint to send you to. Luckily, we can find that using helpful error messages from Azure Resource Manager! All we need is an application for which we can get a token to Azure Resource Manager.</p>

<p>We can easily execute this plan using my <a href="http://shawntabrizi.com/blog/index.php/2017/07/09/azure-ad-authentication-with-powershell-and-adal/">PowerShell Scripts</a>. Update the scripts to have the following configuration:</p>

<ul>
 	<li>Pick any Tenant ID and Application Information relative to that tenant</li>
 	<li>Set Resource ID to "https://management.azure.com/"</li>
 	<li>Create a variable "$subscriptionId" and set it to the Azure Subscription ID you are looking to investigate.</li>
 	<li>Set up the REST call like this:</li>
</ul>

```powershell
try {
    Invoke-RestMethod -Method Get -Uri ("{0}/subscriptions/{1}?api-version=2016-06-01" -f $resourceId, $subscriptionId) -Headers $headers
} catch {
    Write-Host $_.ErrorDetails.Message
}
```

<p>Hmm... why would I be catching an error? Well let's run it and see what gets outputted:</p>

<blockquote>
<pre>{"error":{"code":"InvalidAuthenticationTokenTenant","message":"The access token is from the wrong issuer 'https://sts.windows.net/4a4d599f-e69d-4cd8-a9e1-9882ea340fb5/'. It must match the tenant 'https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/' associated with this subscription. Please use the authority (URL) 'https://login.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47' to get the token. Note, if the subscription is transferred to another tenant there is no impact to the services, but information about new tenant could take time to propagate (up to an hour). If you just transferred your subscription and see this error message, please try back later."}}</pre>
</blockquote>

<p>Right in the error they tell us the correct tenant for this Subscription ID!</p>
<pre>Please use the authority (URL) 'https://login.windows.net/<strong>72f988bf-86f1-41af-91ab-2d7cd011db47</strong>'</pre>
<p>This really is a "secret API", and we can use it to consistently get back the right tenant for a user, as long as they know what their Azure Subscription is.</p>