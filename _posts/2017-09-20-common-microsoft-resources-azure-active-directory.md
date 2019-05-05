---
title: Common Microsoft Resources in Azure Active Directory
date: 2017-09-20T01:23:24-08:00
author: Shawn Tabrizi
layout: post
permalink: /aad/common-microsoft-resources-azure-active-directory/
categories:
  - AAD
tags:
  - access token
  - azure active directory
  - first party applications
  - resource
---
<p>I have seen a lot of StackOverflow posts trying to debug pretty basic errors when getting an access token to Microsoft Resources. Sometimes the issue is as simple as a typo in the "resource" value in the token request. When helping these users, I struggle to find public documentation which shows plainly the correct resource values for these different APIs!</p>

<p>That is going to change starting now. Here will be a list of the most popular Microsoft APIs exposed on Azure Active Directory, along with the basic information you may need to get an access token to those resources for PROD. (If you want the details for other Environments, let me know!)</p>

<h6>Note: The Resource URI must match exactly what is written below, including any trailing '/' or lack thereof.</h6>

&nbsp;
<table>
<tbody>
<tr>
<th>Resource Name</th>
<th>Resource URI</th>
<th>Application ID</th>
</tr>
<tr>
<td>AAD Graph API</td>
<td>https://graph.windows.net/</td>
<td>00000002-0000-0000-c000-000000000000</td>
</tr>
<tr>
<td>Office 365 Exchange Online</td>
<td>https://outlook-sdf.office.com/</td>
<td>00000002-0000-0ff1-ce00-000000000000</td>
</tr>
<tr>
<td>Microsoft Graph</td>
<td>https://graph.microsoft.com</td>
<td>00000003-0000-0000-c000-000000000000</td>
</tr>
<tr>
<td>Skype for Business Online</td>
<td>https://api.skypeforbusiness.com/</td>
<td>00000004-0000-0ff1-ce00-000000000000</td>
</tr>
<tr>
<td>Office 365 Yammer</td>
<td>https://api.yammer.com/</td>
<td>00000005-0000-0ff1-ce00-000000000000</td>
</tr>
<tr>
<td>OneNote</td>
<td>https://onenote.com/</td>
<td>2d4d3d8e-2be3-4bef-9f87-7875a61c29de</td>
</tr>
<tr>
<td>Windows Azure Service Management API</td>
<td>https://management.core.windows.net/</td>
<td>797f4846-ba00-4fd7-ba43-dac1f8f63013</td>
</tr>
<tr>
<td>Office 365 Management APIs</td>
<td>https://manage.office.com</td>
<td>c5393580-f805-4401-95e8-94b7a6ef2fc2</td>
</tr>
<tr>
<td>Microsoft Teams Services</td>
<td>https://api.spaces.skype.com/</td>
<td>cc15fd57-2c6c-4117-a88c-83b1d56b4bbe</td>
</tr>
<tr>
<td>Azure Key Vault</td>
<td>https://vault.azure.net</td>
<td>cfa8b339-82a2-471a-a3c9-0fc0be7a4093</td>
</tr>
</tbody>
</table>

<p>Who knows if this will actually end up helping anyone, but I hope it will!</p>