---
title: Revoking Consent for Azure Active Directory Applications
date: 2017-08-11T07:17:38-08:00
author: Shawn Tabrizi
layout: post
permalink: /aad/revoking-consent-azure-active-directory-applications/
categories:
  - AAD
tags:
  - azure active directory
  - azure portal
  - consent
  - my apps portal
  - tenant administrator
---
<p>Today I was presenting one of my hackathon projects which I worked on this year to the Identity team at Microsoft. In order for my project to work, I needed to get consent to read the mail of the signed-in user. Depending on who you talk to, a permission like this could be easy as pie to consent to or something that they would never accept. Some people fall in the middle where they are happy to consent as long as they can choose to revoke that consent after they are done playing with the app.</p>

<p>That is why I am writing this. How easy it is to forget that it is NOT very obvious what you need to do to revoke consent for an Azure Active Directory Application. Even people on the Identity team don't always know! So let's talk about how you can do it :)</p>

<h2>Using the My Apps Portal for Individual User Consent</h2>
<p>You can revoke individual user consent through the <a href="https://myapps.microsoft.com/">My Apps Portal</a>. Here you should see a view of all applications that you or even your administrator (on your behalf) has consented to:</p>

<p id="xfDUleQ"><img class="alignnone size-full wp-image-172 " src="/assets/images/img_598d51215d1c7.png" alt="" /></p>

<p>With applications your admin has consented to, all you can do is open the app, however for apps where you individually consented as a user, you can click "Remove" which will revoke consent for the application.</p>

<p id="ugVbKmG"><img class="alignnone size-full wp-image-173 " src="/assets/images/img_598d517f175d3.png" alt="" /></p>

<h2>Using the Azure Portal to Remove Tenant Wide Consent</h2>
<p>If you are a tenant administrator, and you want to revoke consent for an application across your entire tenant, you can go to the <a href="https://portal.azure.com/">Azure Portal</a>.  Whether it be for a bunch of users who individually consented or for an admin who consented on behalf of all the users, by simply deleting the application's service principal, you will remove all <a href="https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity">OAuth 2 Permission Grants </a>(the object used to store consent) linked to that application. Think about removing the service principal like uninstalling the application from your tenant.</p>

<p>You could delete the service principal a bunch of different ways like through <a href="https://docs.microsoft.com/en-us/powershell/module/azuread/remove-azureadserviceprincipal">Azure Active Directory PowerShell </a>or through the <a href="https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/serviceprincipal_delete">Microsoft Graph API</a>, but the easiest way for the average administrator is right through the Azure Portal.</p>

<p>Navigate to the Enterprise Applications blade in the Azure portal:</p>
<p id="vyowlIU"><img class="alignnone size-full wp-image-174 " src="/assets/images/img_598d58dbe2787.png" alt="" /></p>

<p>Then click "All Applications" and search for the application you want to revoke consent for:</p>
<p id="bFsfGTh"><img class="alignnone size-full wp-image-175 " src="/assets/images/img_598d594ddf163.png" alt="" /></p>

<p>When you click the application, you will be brought to an "Overview" section, where a tempting button called "Delete" will be at the top. Before you click this button,  you might want to take a peak at the "Permissions" section to see the types of consent that was granted to this application:</p>
<p id="WwoGsnK"><img class="alignnone size-full wp-image-176 " src="/assets/images/img_598d59b5e2851.png" alt="" /></p>

<p>Once you feel confident that you want to delete this application, go back to "Overview" and click "Delete"!</p>
<p id="BQjBUoD"><img class="alignnone size-full wp-image-178 " src="/assets/images/img_598d5ae51090c.png" alt="" /></p>

<p>Viola! The app and all consent associated with that app is now gone.</p>