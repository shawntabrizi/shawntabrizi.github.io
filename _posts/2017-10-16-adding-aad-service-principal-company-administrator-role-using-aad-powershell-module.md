---
title: Adding AAD Service Principal to the Company Administrator Role using the AAD PowerShell Module
date: 2017-10-16T01:20:39-08:00
author: Shawn Tabrizi
layout: post
permalink: /aad/adding-aad-service-principal-company-administrator-role-using-aad-powershell-module/
categories:
  - AAD
tags:
  - aad powershell module
  - azure active directory
  - graph api
  - powershell
  - tenant administrator
---
<p>When creating a new Azure Active Directory application, developers may run into a a problem when calling the AAD Graph API where they lack the correct permissions to call the APIs they want when calling in the App Only Flow (Client Credentials Flow).</p>

<p>Is this message familiar to you?</p>

<pre class="lang-bsh prettyprint prettyprinted"><code><span class="str">"odata.error"</span><span class="pun">:{</span>
    <span class="str">"code"</span><span class="pun">:</span><span class="str">"Authorization_RequestDenied"</span><span class="pun">,</span>
    <span class="str">"message"</span><span class="pun">:{</span>
        <span class="str">"lang"</span><span class="pun">:</span><span class="str">"en"</span><span class="pun">,</span><span class="str">"value"</span><span class="pun">:</span><span class="str">"Insufficient privileges to complete the operation."</span>
    <span class="pun">}</span>
<span class="pun">}</span></code></pre>

<p>The correct thing to do would be to try and investigate the permissions you have granted to your application, but there are some APIs which are not even supported through the permissions publicly exposed by the AAD Graph API. Maybe you just want to overcome this error for the time being and continue testing your end to end experience.</p>

<p>Using the AAD PowerShell Module, you can:</p>

<ul>
 	<li>Give your application full access to the Graph API in the context of my tenant.</li>
</ul>

<p><strong>or</strong></p>
<ul>
 	<li>Grant your application permissions to my tenant which are not currently supported with the permissions exposed by the AAD Graph API.</li>
</ul>

<p>"How?" you might ask. Well, you can elevate the level of access an Application has in your tenant by adding the service principal of that application to the <code>Company Administrator</code> Directory Role. This will give the Application the same level of permissions as the Company Administrator, who can do anything. You can follow these same instructions for any type of Directory Role depending on the level of access you want to give to this application.</p>

<h6><em>Note that this will only affect the access your app has in your tenant.</em></h6>
<h6><em>Also you must already be a Company Administrator of the tenant to follow these instructions.</em></h6>
&nbsp;

<p>In order to make the change, you will need to install the <a href="https://docs.microsoft.com/en-us/powershell/msonline/v1/azureactivedirectory" rel="nofollow noreferrer">Azure Active Directory PowerShell Module</a>.</p>

<p>Once you have the module installed, authenticate to your tenant with your Administrator Account:</p>
<pre class="lang-bsh prettyprint prettyprinted"><code><span class="typ">Connect</span><span class="pun">-</span><span class="typ">MSOLService</span></code></pre>

<p>Then we need to get the Object ID of both the Service Principal we want to elevate, and the Company Administrator Role for your tenant.</p>

<p>Search for Service Principal by App ID GUID:</p>
<pre class="lang-bsh prettyprint prettyprinted"><code><span class="pln">$sp </span><span class="pun">=</span> <span class="typ">Get</span><span class="pun">-</span><span class="typ">MsolServicePrincipal</span> <span class="pun">-</span><span class="typ">AppPrincipalId</span> <span class="pun"><</span><span class="typ">App</span><span class="pln"> ID GUID</span><span class="pun">></span></code></pre>

<p>Search for Directory Role by Name</p>
<pre class="lang-bsh prettyprint prettyprinted"><code><span class="pln">$role </span><span class="pun">=</span> <span class="typ">Get</span><span class="pun">-</span><span class="typ">MsolRole</span> <span class="pun">-</span><span class="typ">RoleName</span> <span class="str">"Company Administrator"</span></code></pre>

<p>Now we can use the <code>Add-MsolRoleMember</code> command to add this role to the service principal.</p>
<pre class="lang-bsh prettyprint prettyprinted"><code><span class="typ">Add</span><span class="pun">-</span><span class="typ">MsolRoleMember</span> <span class="pun">-</span><span class="typ">RoleObjectId</span><span class="pln"> $role</span><span class="pun">.</span><span class="typ">ObjectId</span> <span class="pun">-</span><span class="typ">RoleMemberType</span> <span class="typ">ServicePrincipal</span> <span class="pun">-</span><span class="typ">RoleMemberObjectId</span><span class="pln"> $sp</span><span class="pun">.</span><span class="typ">ObjectId</span></code></pre>

<p>To check everything is working, lets get back all the members of the Company Administrator role:</p>
<pre class="lang-bsh prettyprint prettyprinted"><code><span class="typ">Get</span><span class="pun">-</span><span class="typ">MsolRoleMember</span> <span class="pun">-</span><span class="typ">RoleObjectId</span><span class="pln"> $role</span><span class="pun">.</span><span class="typ">ObjectId</span></code></pre>

<p>You should see your application in that list, where <code>RoleMemberType</code> is <code>ServicePrincipal</code> and <code>DisplayName</code> is the name of your application.</p>

<p>Now your application should be able to perform any Graph API calls that the Company Administrator could do, all without a user signed-in, using the Client Credential Flow.</p>

<p>Let me know if this helps!</p>