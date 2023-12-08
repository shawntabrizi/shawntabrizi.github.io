---
title: 'Correcting the Ethereum and Web3.js "Hello World"'
date: 2017-11-05T07:57:51-08:00
authors: shawntabrizi
layout: post
slug: /ethereum/correcting-ethereum-web3-js-hello-world/
categories:
  - Ethereum
tags:
  - blockchain
  - ethereum
  - html
  - javascript
  - web3
---

Just 2 days ago I [blogged about a quick project](https://shawntabrizi.com/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/) which I considered a "Hello World" application for Ethereum and Web3.js. However, I quickly learned that even in my short 31 lines of code, I made numerous mistakes which do not follow the best practices for developing Web3.js applications.

The main part of the sample was the Web3.js stuff, which could be broken into two logical sections:

1.  Establishing a Web3 Provider
2.  Getting the ETH balance of an Ethereum Address

Both of these sections had mistakes in my original code, and this post will show you how to fix them! I will be updating the main blog post to include these changes as well, but I wanted to document the subtleties of the changes, and what I have learned since then. BTW, all of these mistakes could be avoided if you read the [MetaMask developer documentation](https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check).

## Ethereum Browser Environment Check

In my original sample, I simply depend on the Web3 HTTP Provider to access the Ethereum network. However, using [MetaMask](https://metamask.io/) or the [Mist Browser](https://github.com/ethereum/mist), users will already have direct access to the Ethereum network through those providers, and do not need to use the HTTP Provider. As said in the [Web3 JavaScript app API Documentation](https://github.com/ethereum/wiki/wiki/JavaScript-API#adding-web3):

> ...you need to create a web3 instance, setting a provider. To make sure you don't overwrite the already set provider when in mist, check first if the web3 is available...

To fix this, we mostly follow the [code sample](https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check) provided by MetaMask:

```javascript
window.addEventListener("load", function () {
  if (typeof web3 !== "undefined") {
    console.log("Web3 Detected! " + web3.currentProvider.constructor.name);
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log("No Web3 Detected... using HTTP Provider");
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("https://mainnet.infura.io/noapikey")
    );
  }
});
```

As they mention on the MetaMask developer documentation:

> Note that the environmental web3 check is wrapped in a `window.addEventListener('load', ...)` handler. This approach avoids race conditions with web3 injection timing.

With our new code, as soon as the page loads, we detect if the browser being used already has a Web3 provider set up, and if it does we use it! Otherwise, we will use the HTTP Provider from [Infura.io](https://infura.io/). For most users, I would assume they do not have MetaMask, and thus this change is not very important; but it is certainly best practice, and I am happy to oblige.

Chrome with MetaMask:

![](/assets/images/img_59feb77ae6a85.png)

Firefox without Web3 Provider:

![](/assets/images/img_59feb7629ffba.png)

## Asynchronous calls to the Ethereum network

If you have been following along word for word, you might have copied the changes mentioned above, loaded it in your MetaMask enabled browser ([from your web server](https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#globe_with_meridians-https---web-server-required)), and tried to get your ETH balance... Here is what you will see:

![](/assets/images/img_59feb8e353a07.png)

If we continue to read the MetaMask developer documentation, we would see the following:

> The user does not have the full blockchain on their machine, so data lookups can be a little slow. For this reason, we are unable to support most synchronous methods.

This means we need to turn our call to get the ETH balance, which is currently a synchronous HTTP request, into an asynchronous request. We can do this by adding an error first callback as the last parameter of the function:

```javascript
function getBalance() {
  var address, wei, balance;
  address = document.getElementById("address").value;
  try {
    web3.eth.getBalance(address, function (error, wei) {
      if (!error) {
        var balance = web3.fromWei(wei, "ether");
        document.getElementById("output").innerHTML = balance + " ETH";
      }
    });
  } catch (err) {
    document.getElementById("output").innerHTML = err;
  }
}
```

If we try to run this code now with MetaMask as our provider, everything works again!

![](/assets/images/img_59febfad543a1.png)

## The first, but certainly not last mistake...

Phew! We fixed our Hello World application! Take a look at the [overall changes on GitHub](https://github.com/shawntabrizi/ETH-Balance/commit/daa8ac6c380c6f870807023e295d51a03a21edef). I think this goes to show how difficult it can be to learn things on your own, and some of the best practices that can be overlooked so easily. I hope that I am able to go through these issues so that you don't have to. If you find any other issues with this or future samples I create, please let me know!

Special shout out to [Reddit user JonnyLatte](https://www.reddit.com/r/ethdev/comments/7acshg/in_the_spirit_of_devcon3_build_your_first_web3js/dp9xdff/?utm_content=permalink&utm_medium=user&utm_source=reddit&utm_name=frontpage) for telling me the errors in my ways, and getting me to read more of the documentation around Web3!

As always, if you found this content helpful, feel free to check out my [donation page](https://shawntabrizi.com/donate/).
