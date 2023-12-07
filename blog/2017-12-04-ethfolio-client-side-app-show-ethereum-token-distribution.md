---
title: 'ethfolio: A client side app to show your Ethereum token distribution'
date: 2017-12-04T07:54:33-08:00
authors: shawntabrizi
layout: post
slug: /ethereum/ethfolio-client-side-app-show-ethereum-token-distribution/
categories:
  - Ethereum
tags:
  - cryptocurrency
  - ethereum
  - javascript
github: ethfolio
---

A common question that I have for others investing in cryptocurrencies is: _"What coins are you invested in?"_

It is surprisingly hard to distinguish fear, uncertainty, doubt (FUD), fear of missing out (FOMO), and solid informed advice apart from one another. But as the saying goes:

> Put your money where your mouth is.

This is the goal of ethfolio:

* Allow users to easily import the coins they currently are holding
* Allow users to share this token distribution
* And do so safely without needing to expose their Ethereum addresses or total value of their holdings

This actually seemed very straightforward, so I decided to tackle the project. Rather than go through all the work to actually query the blockchain as I have been learning to do in my other posts, I decided to just use an API which consolidates all this information.

[Ethplorer.io](https://ethplorer.io/) was perfect for this. They have a `/getAddressInfo/` [api endpoint](https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API?from=etop) which provides details about the tokens at an Ethereum address, and even details about those tokens like the price in USD.

This was perfect! So I begin to envision the user story:

1.  User goes to ethfolio, types in one or more Ethereum addresses
2.  User presses a "submit" button
3.  In the background we query the Ethplorer API to get all the tokens across all the addresses, and their current price in USD
4.  We then add up total amount of each token the user has across their wallets
5.  Then, we use the price information, to calculate the relative USD price of each token balance
6.  Then we calculate the total USD price across all balances, to find the percentage a particular token represents in the overall portfolio
7.  Display the results

Following this process, the user can then share details about their token distribution without ever needing to share details about their specific addresses (which is important for anonymity) and without needing to share details about the total balance they hold (which could be sensitive to the user.)

With these steps in mind, I spent a day and created this pretty quickly:

[https://shawntabrizi.com/ethfolio/](https://shawntabrizi.com/ethfolio/)

![](/assets/images/img_5a24f8f17ea4a.png)

You may notice that there are some options to "Store total USD value" and "Store all addresses". Lets talk about what I tried to do with "Save & Share".

I wanted this to be a completely client side application. This means I don't have to do any server stuff,  the user can better trust the application (because they can see all the code), and calling the API would come from each user, so I wouldn't get throttled if the site takes off. My question then was: "How can I create a database for a client side application?"

This means that writing and reading from the database needs to be in such a way that it won't compromise the data being stored. My first thought was to try and use Google Forms/Sheets. Google Forms is a method for publicly entering data, which can get stored into a Google Sheet which can be publicly viewed. Using Google's authorization layer, I could make it so that users could not edit the sheet, only add data to it, and read from it.

I got the part of the app to write to Google working. It doesn't look pretty because the app gives a [CORS error](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), but Google seems to accept the data anyway.

**Ignore the error**

![](/assets/images/img_5a24fdb9c8555.png)

**Cause data gets saved anyway...**

![](/assets/images/img_5a24fd98c904a.png)

However, I was not able to ever retrieve this data! Even though this sheet is public, it seems like to call any of Google's APIs you must be authenticated, at least with an API key.

I created an API key, but trying to use it I get this error:

![](/assets/images/img_5a24fec22ed25.png)

```
"message": "API Key not found. Please pass a valid API key."
```

Every API key is associated with a "Google App Project", and I needed to specifically enable the Google Sheets API for the project where I was creating the API key.

![](/assets/images/img_5a2505a15b129.png)

Now that this call works, I just need to build an interface to read from the sheet, and re-display the data! That will be coming up next!
