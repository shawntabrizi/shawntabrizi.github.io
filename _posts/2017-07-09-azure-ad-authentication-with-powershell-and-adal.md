---
title: Azure AD Authentication with PowerShell and ADAL
date: 2017-07-09T09:54:45-08:00
author: Shawn Tabrizi
layout: post
permalink: /aad/azure-ad-authentication-with-powershell-and-adal/
categories:
  - AAD
tags:
  - access token
  - adal
  - authentication
  - azure active directory
  - graph api
  - powershell
  - programming
  - script
---
<p>In the 3 years I spent on the Azure AD team, I learned a number of useful 'tricks' to make my job (and usually the jobs of others) a ton easier. However, if I had to pick just one trick to share to others trying to learn, it would probably be the PowerShell scripts I wrote to quickly get an access token to Azure Active Directory and then call AAD protected APIs like the AAD Graph API.</p>

<p>In general, authentication is hard, and requires way more set up than should be needed for simple testing. To get AAD authentication working on other platforms, you may need to write a ton of code, compile it, or even publish it to the web. With these scripts, you can get authentication and REST API calls done with as little as 13 lines of PowerShell. Running the code is instant, and modifying the REST calls or even the authentication parameters takes seconds rather than minutes.</p>
<h2>How to get the samples</h2>
<p>You can find all the basic scripts I have written on GitHub here:</p>

<p><a href="https://github.com/shawntabrizi/Azure-AD-Authentication-with-PowerShell-and-ADAL">https://github.com/shawntabrizi/Azure-AD-Authentication-with-PowerShell-and-ADAL</a></p>

<p>I provide different scripts for different authentication flows:</p>
<ol>
 	<li>Authorization Code Grant Flow for Confidential Client</li>
 	<li>Native Client Authentication</li>
 	<li>Client Credential Flow
<ol>
 	<li>Using Application Key</li>
 	<li>Using Client Certificate</li>
</ol>
</li>
</ol>
<p>Each script ends with a REST API call to get the list of Users in your tenant using the AAD Graph API. You should be able to do this with any application because it uses the "Sign in and read basic profile" permission which is assigned to all AAD Applications by default.</p>

<p>Note that to get these samples running, you will need to add the .NET dlls for ADAL v2 into the ADAL folder. You can find those files <a href="https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/2.28.4">on NuGet</a>.</p>

<h2>Why it is so darn useful</h2>
<p>So now that you have the scripts downloaded, and hopefully working, let me illustrate to you just a few of the different scenarios where I have used this tool to greatly simplify my work.</p>

<h3>Verifying Token Claims</h3>
<p>So many errors in AAD app development come from some sort of wrong setting, which may manifest itself in your access token. You might want to check the 'scp' claims to see if your app has the right permissions. You might want to check the 'tid' claim to make sure that you are getting a token to the right tenant! Or even the 'aud' claim to make sure the token is for the correct resource. You can simply pump in the settings for your application into the appropriate PowerShell script, run the script, and you will get a .txt file with your access token in it. Then you can pop that JWT token into a JWT decoder like <a href="http://shawntabrizi.com/jwt/">the one I created...</a> and viola! There are your claims, and it took literally seconds.</p>

<h3>Making quick REST API calls</h3>
<p>Another thing that comes up very often around work is just pulling random data from AAD. Let's say that someone wants to know the settings of a certain Application Object, Service Principal, or even User. You may be able to do this with tools like the <a href="https://graphexplorer.azurewebsites.net/">Graph Explorer</a>, but what about some more complicated queries, or ones that you want to download to a file for later? Or how about simply wanting to test that YOUR app can make those queries rather than the Graph Explorer app. Not to mention the fact that you can call ANY AAD protected API, not just the AAD Graph API with these scripts. Simply update the Invoke-RestMethod command and bam, results will be saved into a .json file!</p>

<h3>Making scripted REST API calls</h3>
<p>Maybe you are still not convinced that these scripts are useful. Most of what I showed above can be done if you want to use multiple other tools. However, I challenge you to find a quicker way to create "scripted" REST API calls. What do I mean by that? Lets say you wanted to pull a list of all the users in your company. Well the AAD Graph API can return at most 999 results in a single call, so you probably want to create a loop that iterates over the paged results that the Graph API returns. This is SIMPLE!</p>

<p>Here is the loop I wrote to solve this exact problem:</p>

```powershell
$result = Invoke-RestMethod -Method Get -Uri ('{0}/{1}/users/?api-version=1.6&amp;amp;amp;$top=999' -f $resourceId,$tenantId) -Headers $headers
$count = 0
$result.value | Export-Csv ([String]$count + "_" +$output) -Encoding UTF8

while (($result.'odata.nextLink' -split 'skiptoken=')[1] -ne $null)
{
  $skiptoken = ($result.'odata.nextLink' -split 'skiptoken=')[1]
  Write-Host ('{0}/{1}/users/?api-version=1.6&amp;amp;amp;$top=999&amp;amp;amp;$skiptoken={2}' -f $resourceId,$tenantId,$skiptoken)

  try
  {
    $result = Invoke-RestMethod -Method Get -Uri ('{0}/{1}/users/?api-version=1.6&amp;amp;amp;$top=999&amp;amp;amp;$skiptoken={2}' -f $resourceId,$tenantId,$skiptoken) -Headers $headers
    $count += 1
    $result.value | Export-Csv ([String]$count + "_" + $output) -Encoding UTF8
  }
  catch
  {
    Write-Host "Error with Invoke Rest Method!"
    Write-Host $result.'odata.nextLink'
    break
  }
}
```

<p>The result is a folder of CSV files all numbered and ready to be merged. If the script fails at some point (like if I lose an internet connection), I can use the outputted 'odata.nextLink' and just pick up where I left off. I couldn't imagine doing this any other way for my needs.</p>
<h2>Convinced?</h2>
<p>I hope that you too will be able to find this little tool helpful for your day to day needs. Let me know if you find some other unconventional uses for this!</p>