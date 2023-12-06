---
title: 'Does Company &#8216;X&#8217; have an Azure Active Directory Tenant?'
date: 2017-07-12T04:50:35-08:00
authors: shawntabrizi
layout: post
permalink: /aad/does-company-x-have-an-azure-active-directory-tenant/
categories:
  - AAD
tags:
  - azure active directory
  - hack
  - powershell
  - programming
  - script
  - tenant
---

One of the cool things about the Open ID Configuration endpoint is that it not only tells us random facts about the tenant, but it confirms that the tenant exists! Make sure to check out [my last post](https://shawntabrizi.com/aad/secret-apis-in-azure-active-directory-and-azure-resource-manager/) to learn more about this. Using some clever scripting and this endpoint behavior, we could probably figure out which companies have an Azure Active Directory Tenant.

Let's try that!

```powershell
$csv = Import-Csv -Path .\input.csv
$output = @()

foreach ($line in $csv)
{
    $companyname = $line.CompanyName
    $companynameencoded = [System.Net.WebUtility]::UrlEncode($companyname)

    $GoogleURI = 'https://www.google.com/search?q=' + $companynameencoded + '&amp;btnI'

    try {
        $GoogleResult = Invoke-WebRequest -Uri $GoogleURI
        $CompanyURI = ([System.Uri]$GoogleResult.BaseResponse.ResponseUri).Host.split('.')[-2..-1] -join '.'
    } catch {
        write-host $_.Exception
        $CompanyURI = "error"
    }

    $OpenIDConfigURL = 'https://login.microsoftonline.com/' + $CompanyURI + '/.well-known/openid-configuration'

    try {
        $OpenIDResult = (Invoke-WebRequest -Uri $OpenIDConfigURL).StatusCode
    } catch {
        $OpenIDResult = $_.Exception.Response.StatusCode.value__
    }

    if ($OpenIDResult -eq 200) {
        $tenant = $true
    } else {
        $tenant = $false
    }

    $result = [pscustomobject]@{
        CompanyName = $companyname.ToString()
        HomepageURI = $CompanyURI.ToString()
        OpenIDResult = $OpenIDResult.ToString()
        HasTenant = $tenant.ToString()
    }

    Write-Host $result
    $output += $result
}

$output | Export-Csv -Path output.csv -NoTypeInformation
```

So in summary what does this script do?

* We take a CSV which lists a bunch of Company Names.
* We then do a Google search, and go to the first result ('I'm Feeling Lucky').
* We assume the first result is the homepage of that company, and the domain they would use for their tenant.
* We pull out the host name, and then check it against the Open ID Configuration endpoint.
    * If we get a valid response from the endpoint, then we say that they have a tenant!
    * Otherwise, we say they do not have a tenant.

One thing to note about these results is that when we get a result that says the company has a tenant, we are nearly 100% correct in that fact. However, if we say that a company does not have a tenant, we are not necessarily correct. It is possible that the google result did not point to their actual domain name, or they are using a different domain name for their AAD Tenant.

If you wanted to do this really robustly, you would probably want to get a better source for your domain names than automated google search results. You might want to also look at other combinations like "companyname.onmicrosoft.com", however we are doing just rough estimates here.

So lets look at the results for the Fortune 500.

A quick Google search later, and I have a CSV with a list of all the Company Names for all 500 companies. Running it through this script, I find that 417, or 83.4% of companies have AAD, which is just a little off from Microsoft's public claim of 85%.

Not bad for a quick and dirty script!
