---
title: Ethereum Token Contract ABI in Web3.js for ERC-20 and Human Standard Tokens
date: 2017-11-08T08:13:19-08:00
authors: shawntabrizi
layout: post
permalink: /ethereum/ethereum-token-contract-abi-web3-erc-20-human-standard-tokens/
categories:
  - Ethereum
tags:
  - application binary interface
  - blockchain
  - erc20
  - ethereum
  - human standard token
  - javascript
  - token
  - web3
github: ERC-20-Token-Balance
---

##### This post will introduce you to Token Contract ABIs in Ethereum, and show you how you can use a the [Human Standard Token ABI](https://github.com/shawntabrizi/ERC-20-Token-Balance/blob/master/human_standard_token_abi.js) to access the token balances of ERC-20 compatible tokens.

Let me start by saying that this post may be trivial to some, but was very confusing to me, a brand new user to the Ethereum and Web3.js development world. After writing my ["Hello World" project](https://shawntabrizi.com/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/) which gets the ETH balance for an Ethereum Address in Web3, I began to think about the next small step I can take and teach to others. Naturally, I thought it would make sense to do a similar project, but instead, get the Token Balance for ERC-20 tokens at an Ethereum Address.

With Web3.js, you can easily find the template for this functionality:

```javascript
var tokenContract = eth.contract(tokenABI).at(tokenAddress);
var tokenBalance = tokenContract.balanceOf(ethereumAddress);
```

Seems easy enough to get the [Token Address](https://etherscan.io/tokens), but what is this `tokenABI` value that we need to use?

## A simplified explanation of a token contract ABI

A little bit of searching will give you documents that teach you about the Application Binary Interface (ABI) [like this](https://solidity.readthedocs.io/en/develop/abi-spec.html), but no real layman's terms explanation. Here is my attempt at one:

> In Ethereum, the Application Binary Interface (ABI) is a predefined template of the functions a contract exposes.

You know when you import a new library into an IDE, you automatically get all that nice autocomplete and Intellisense? You type the library name, add "`.`" and a list of functions appears in front of you:

![](/assets/images/img_5a02bedd6be8c.png)

Imagine if instead, you needed to know ahead of time the functions the library exposes, and then define them for the IDE so that the autocomplete would work... that is pretty much what is happening here.

An Ethereum Contract ABI will define the different functions that a contract exposes, and each function definition will contain things like the function type, name, inputs, outputs, [and more](https://solidity.readthedocs.io/en/develop/abi-spec.html#json). It even contains information like whether the contract accepts payments in ether or not. Here is the JSON ABI of the `balanceOf()` function we ultimately want to use:

```json
{
  "constant": true,
  "inputs": [
    {
      "name": "_owner",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "name": "balance",
      "type": "uint256"
    }
  ],
  "payable": false,
  "type": "function"
}
```

I think this is easy enough to read: It is a `function` which accepts an `address` as an input, and outputs a `balance` as an unsigned int. **But is this enough to start talking to an Ethereum contract? What about all the other functions that contract might have? How will I find the full contract ABI for each contract I want to talk to?**

Here are the things I learned when trying to answer these questions:

* You do NOT need the full ABI to interact with a Token Contract. You only need to define the functions which you want to use.
* You cannot programmatically generate the ABI for a given contract using data from the Ethereum blockchain. In order to generate the full contract ABI from scratch, you will need the full contract source code, before it is compiled. Note that only the compiled code exists at a contract address.
* Some contracts have functions which are intentionally 'hidden' from the public, and they do not intend the public to use.

Therefore, there really is no way to dynamically call any contract address. If only there were some standard set of functions shared across all contracts...

## The ERC-20 and Human Standard Token

From [the specification](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md):

> ## Simple Summary
>
> A standard interface for tokens.

The value of ERC-20 tokens is that they all have a standard set of functions which allow you to interact with each of them in the exact same way. This is why there is so much hype around new Ethereum application which use ERC-20 tokens: there is nearly zero effort to add these tokens to existing platforms like Cryptocurrency Exchanges which means smoother adoption, easier to sell/track, and of course more hype ($$$).

What does it take to be ERC-20 compliant?

Not much really. You just need to expose the non-optional methods and events described [here](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md). Beyond the core ERC-20 standard, there are also standard optional parameters which are intended for humans. See [here](https://github.com/ConsenSys/Tokens):

> In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans. Imagine coins, currencies, shares, voting weight, etc. Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.
>
> 1) Initial Finite Supply (upon creation one specifies how much is minted). 2) In the absence of a token registry: Optional Decimal, Symbol & Name. 3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

This is the "Human Standard Token", which of course is a super-set of the ERC-20 standard. Additionally, many tokens have a `version()` function which is also available in the ABI provided below.

## So let's get it working!

Now that you have sufficient background to understand what is going on, lets actually go and make some calls to ERC-20 token contracts.

To start, you can find the Human Standard Token ABI [here on GitHub](https://github.com/shawntabrizi/ERC-20-Token-Balance/blob/master/human_standard_token_abi.js). The JS file simply puts the ABI JSON object into a varaible called `human_standard_token_abi` which allows you to really easily use it in a project.

The most basic project that can take advantage of these things would look something like this:

```html
<html>
<head>
  <meta charset="UTF-8">
  <script type="text/javascript" src="./web3.min.js"></script>
  <script type="text/javascript" src="./human_standard_token_abi.js"></script>
  <script>
    var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));

    address = "0x0e2e75240c69495d2b9e768b548db381de2142b9" //From Etherscan
    contractAddress = "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07" //OMG
    contractABI = human_standard_token_abi

    tokenContract = web3.eth.contract(contractABI).at(contractAddress)

    console.log(tokenContract.balanceOf(address).toNumber())
  </script>
</head>
<body>
  <p>Check the console (F12)</p>
</body>
</html>
```

And the output:

![](/assets/images/img_5a02b864c00dc.png)

Take a look at an implementation of this sample [here](https://shawntabrizi.com/ERC20-Token-Balance/). You can find the source code for this on [GitHub](https://github.com/shawntabrizi/ERC20-Token-Balance).

## What if...

Let's try a few fringe scenarios with this contract ABI. We will be testing this against [OmiseGo](https://etherscan.io/token/OmiseGo?a=0x0e2e75240c69495d2b9e768b548db381de2142b9#readContract).

* What if we call a contract with a function we defined, but does not exist on the contract?

OMG does not have a `version()` function, but we define it by default in our `human_standard_token_abi`. So let's call it:

```javascript
console.log(tokenContract.version())
```

> "Uncaught Error: new BigNumber() not a base 16 number"

![](/assets/images/img_5a02ba10afdf7.png)

* What if we call a contract with a function that exists, but we did not define in the ABI?

OMG has the function `mintingFinished()` which is not part of the Human Standard Token ABI. If we call it, we get the following error:

> "Uncaught TypeError: tokenContract.mintingFinished is not a function"

![](/assets/images/img_5a02bad1835e2.png)

## What I hope you learned:

* The requirements to call an ERC-20 compliant token contract using Web3.js
* What a Token Contract ABI is on the Ethereum Blockchain
* Why the ERC-20 standard is pretty great for develeopers
* How to easily add the `human_standard_token_abi` to your JavaScript web application

Keep an eye out for [my next post](https://shawntabrizi.com/ethereum/making-web3-js-work-asynchronously-javascript-promises-await/), which will detail how to set up Web3.js for JavaScript promises, so we can execute multiple Web3 functions asynchronously.

If you liked this post, and want to support me, feel free to [send me a donation.](https://shawntabrizi.com/donate/)
