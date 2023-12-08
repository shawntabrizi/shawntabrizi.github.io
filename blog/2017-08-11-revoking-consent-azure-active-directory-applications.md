---
title: Revoking Consent for Azure Active Directory Applications
date: 2017-08-11T07:17:38-08:00
authors: shawntabrizi
layout: post
slug: /aad/revoking-consent-azure-active-directory-applications/
categories:
  - AAD
tags:
  - azure active directory
  - azure portal
  - consent
  - my apps portal
  - tenant administrator
---

Today I was presenting one of my hackathon projects which I worked on this year to the Identity team at Microsoft. In order for my project to work, I needed to get consent to read the mail of the signed-in user. Depending on who you talk to, a permission like this could be easy as pie to consent to or something that they would never accept. Some people fall in the middle where they are happy to consent as long as they can choose to revoke that consent after they are done playing with the app.

That is why I am writing this. How easy it is to forget that it is NOT very obvious what you need to do to revoke consent for an Azure Active Directory Application. Even people on the Identity team don't always know! So let's talk about how you can do it :)

## Using the My Apps Portal for Individual User Consent

You can revoke individual user consent through the [My Apps Portal](https://myapps.microsoft.com/). Here you should see a view of all applications that you or even your administrator (on your behalf) has consented to:

![](/assets/images/img_598d51215d1c7.png)

With applications your admin has consented to, all you can do is open the app, however for apps where you individually consented as a user, you can click "Remove" which will revoke consent for the application.

![](/assets/images/img_598d517f175d3.png)

## Using the Azure Portal to Remove Tenant Wide Consent

If you are a tenant administrator, and you want to revoke consent for an application across your entire tenant, you can go to the [Azure Portal](https://portal.azure.com/). Whether it be for a bunch of users who individually consented or for an admin who consented on behalf of all the users, by simply deleting the application's service principal, you will remove all [OAuth 2 Permission Grants](https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) (the object used to store consent) linked to that application. Think about removing the service principal like uninstalling the application from your tenant.

You could delete the service principal a bunch of different ways like through [Azure Active Directory PowerShell](https://docs.microsoft.com/en-us/powershell/module/azuread/remove-azureadserviceprincipal) or through the [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/serviceprincipal_delete), but the easiest way for the average administrator is right through the Azure Portal.

Navigate to the Enterprise Applications blade in the Azure portal:

![](/assets/images/img_598d58dbe2787.png)

Then click "All Applications" and search for the application you want to revoke consent for:

![](/assets/images/img_598d594ddf163.png)

When you click the application, you will be brought to an "Overview" section, where a tempting button called "Delete" will be at the top. Before you click this button, you might want to take a peak at the "Permissions" section to see the types of consent that was granted to this application:

![](/assets/images/img_598d59b5e2851.png)

Once you feel confident that you want to delete this application, go back to "Overview" and click "Delete"!

![](/assets/images/img_598d5ae51090c.png)

Viola! The app and all consent associated with that app is now gone.
