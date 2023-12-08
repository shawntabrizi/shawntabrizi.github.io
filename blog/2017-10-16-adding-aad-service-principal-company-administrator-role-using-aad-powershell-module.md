---
title: Adding AAD Service Principal to the Company Administrator Role using the AAD PowerShell Module
date: 2017-10-16T01:20:39-08:00
authors: shawntabrizi
layout: post
slug: /aad/adding-aad-service-principal-company-administrator-role-using-aad-powershell-module/
categories:
  - AAD
tags:
  - aad powershell module
  - azure active directory
  - graph api
  - powershell
  - tenant administrator
---

When creating a new Azure Active Directory application, developers may run into a a problem when calling the AAD Graph API where they lack the correct permissions to call the APIs they want when calling in the App Only Flow (Client Credentials Flow).

Is this message familiar to you?

```json
"odata.error":{
  "code":"Authorization_RequestDenied",
  "message":{
      "lang":"en","value":"Insufficient privileges to complete the operation."
  }
}
```

The correct thing to do would be to try and investigate the permissions you have granted to your application, but there are some APIs which are not even supported through the permissions publicly exposed by the AAD Graph API. Maybe you just want to overcome this error for the time being and continue testing your end to end experience.

Using the AAD PowerShell Module, you can:

- Give your application full access to the Graph API in the context of my tenant.

**or**

- Grant your application permissions to my tenant which are not currently supported with the permissions exposed by the AAD Graph API.

"How?" you might ask.

Well, you can elevate the level of access an Application has in your tenant by adding the service principal of that application to the `Company Administrator` Directory Role. This will give the Application the same level of permissions as the Company Administrator, who can do anything. You can follow these same instructions for any type of Directory Role depending on the level of access you want to give to this application.

> **Note:** This will only affect the access your app has in your tenant.
>
> Also you must already be a Company Administrator of the tenant to follow these instructions.

In order to make the change, you will need to install the [Azure Active Directory PowerShell Module](https://docs.microsoft.com/en-us/powershell/msonline/v1/azureactivedirectory).

Once you have the module installed, authenticate to your tenant with your Administrator Account:

```powershell
Connect-MSOLService
```

Then we need to get the Object ID of both the Service Principal we want to elevate, and the Company Administrator Role for your tenant.

Search for Service Principal by App ID GUID:

```powershell
$sp = Get-MsolServicePrincipal -AppPrincipalId <App ID GUID>
```

Search for Directory Role by Name

```powershell
$role = Get-MsolRole -RoleName "Company Administrator"
```

Now we can use the `Add-MsolRoleMember` command to add this role to the service principal.

```powershell
Add-MsolRoleMember -RoleObjectId $role.ObjectId -RoleMemberType ServicePrincipal -RoleMemberObjectId $sp.ObjectId
```

To check everything is working, lets get back all the members of the Company Administrator role:

```powershell
Get-MsolRoleMember -RoleObjectId $role.ObjectId
```

You should see your application in that list, where `RoleMemberType` is `ServicePrincipal` and `DisplayName` is the name of your application.

Now your application should be able to perform any Graph API calls that the Company Administrator could do, all without a user signed-in, using the Client Credential Flow.

Let me know if this helps!
