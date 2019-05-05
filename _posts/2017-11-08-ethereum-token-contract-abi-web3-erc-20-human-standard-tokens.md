---
title: Ethereum Token Contract ABI in Web3.js for ERC-20 and Human Standard Tokens
date: 2017-11-08T08:13:19-08:00
author: Shawn Tabrizi
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
<h5>This post will introduce you to Token Contract ABIs in Ethereum, and show you how you can use a the <a href="https://github.com/shawntabrizi/ERC-20-Token-Balance/blob/master/human_standard_token_abi.js">Human Standard Token ABI</a> to access the token balances of ERC-20 compatible tokens.</h5>

&nbsp;

<p>Let me start by saying that this post may be trivial to some, but was very confusing to me, a brand new user to the Ethereum and Web3.js development world. After writing my <a href="https://shawntabrizi.com/crypto/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/">"Hello World" project</a> which gets the ETH balance for an Ethereum Address in Web3, I began to think about the next small step I can take and teach to others. Naturally, I thought it would make sense to do a similar project, but instead, get the Token Balance for ERC-20 tokens at an Ethereum Address.</p>

<p>With Web3.js, you can easily find the template for this functionality:</p>

```javascript
var tokenContract = eth.contract(tokenABI).at(tokenAddress);
var tokenBalance = tokenContract.balanceOf(ethereumAddress);
```

<p>Seems easy enough to get the <a href="https://etherscan.io/tokens">Token Address</a>, but what is this <code>tokenABI</code> value that we need to use?</p>

<h2>A simplified explanation of a token contract ABI</h2>

<p>A little bit of searching will give you documents that teach you about the Application Binary Interface (ABI) <a href="https://solidity.readthedocs.io/en/develop/abi-spec.html">like this</a>, but no real layman's terms explanation. Here is my attempt at one:</p>

<p><blockquote>In Ethereum, the Application Binary Interface (ABI) is a predefined template of the functions a contract exposes.</blockquote></p>

<p>You know when you import a new library into an IDE, you automatically get all that nice autocomplete and Intellisense? You type the library name, add "<code>.</code>" and a list of functions appears in front of you:</p>

<p><img alt='' class='alignnone size-full wp-image-261 ' src='/assets/images/img_5a02bedd6be8c.png' /></p>

<p>Imagine if instead, you needed to know ahead of time the functions the library exposes, and then define them for the IDE so that the autocomplete would work... that is pretty much what is happening here.</p>

<p>An Ethereum Contract ABI will define the different functions that a contract exposes, and each function definition will contain things like the function type, name, inputs, outputs, <a href="https://solidity.readthedocs.io/en/develop/abi-spec.html#json">and more</a>. It even contains information like whether the contract accepts payments in ether or not. Here is the JSON ABI of the <code>balanceOf()</code> function we ultimately want to use:</p>

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

<p>I think this is easy enough to read: It is a <code>function</code> which accepts an <code>address</code> as an input, and outputs a <code>balance</code> as an unsigned int. <strong>But is this enough to start talking to an Ethereum contract? What about all the other functions that contract might have? How will I find the full contract ABI for each contract I want to talk to?</strong></p>

<p>Here are the things I learned when trying to answer these questions:</p>

<ul>
 	<li>You do NOT need the full ABI to interact with a Token Contract. You only need to define the functions which you want to use.</li>
 	<li>You cannot programmatically generate the ABI for a given contract using data from the Ethereum blockchain. In order to generate the full contract ABI from scratch, you will need the full contract source code, before it is compiled. Note that only the compiled code exists at a contract address.</li>
 	<li>Some contracts have functions which are intentionally 'hidden' from the public, and they do not intend the public to use.</li>
</ul>

<p>Therefore, there really is no way to dynamically call any contract address. If only there were some standard set of functions shared across all contracts...</p>

<h2>The ERC-20 and Human Standard Token</h2>

<p>From <a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md">the specification</a>:</p>

<blockquote>
<h2 style="padding-left: 30px;">Simple Summary</h2>
<p style="padding-left: 30px;">A standard interface for tokens.</p>
</blockquote>

<p>The value of ERC-20 tokens is that they all have a standard set of functions which allow you to interact with each of them in the exact same way. This is why there is so much hype around new Ethereum application which use ERC-20 tokens: there is nearly zero effort to add these tokens to existing platforms like Cryptocurrency Exchanges which means smoother adoption, easier to sell/track, and of course more hype ($$$).</p>

<p>What does it take to be ERC-20 compliant?</p>

<p>Not much really. You just need to expose the non-optional methods and events described <a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md">here</a>. Beyond the core ERC-20 standard, there are also standard optional parameters which are intended for humans. See<a href="https://github.com/ConsenSys/Tokens"> here</a>:</p>

<blockquote>
<p style="padding-left: 30px;">In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans.
Imagine coins, currencies, shares, voting weight, etc.
Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.</p>
<p style="padding-left: 30px;">1) Initial Finite Supply (upon creation one specifies how much is minted).
2) In the absence of a token registry: Optional Decimal, Symbol & Name.
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.</p>
</blockquote>

<p>This is the "Human Standard Token", which of course is a super-set of the ERC-20 standard. Additionally, many tokens have a <code>version()</code> function which is also available in the ABI provided below.</p>

<h2>So let's get it working!</h2>
<p>Now that you have sufficient background to understand what is going on, lets actually go and make some calls to ERC-20 token contracts.</p>

<p>To start, you can find the Human Standard Token ABI <a href="https://github.com/shawntabrizi/ERC-20-Token-Balance/blob/master/human_standard_token_abi.js">here on GitHub</a>. The JS file simply puts the ABI JSON object into a varaible called <code>human_standard_token_abi</code> which allows you to really easily use it in a project.</p>

<p>The most basic project that can take advantage of these things would look something like this:</p>

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

<p>And the output:</p>
<p id="RkQVwvO"><img class="alignnone size-full wp-image-252 " src="/assets/images/img_5a02b864c00dc.png" alt="" /></p>
<p>Take a look at an implementation of this sample <a href="https://shawntabrizi.com/ethbalance/erc20/">here</a>. You can find the source code for this on <a href="https://github.com/shawntabrizi/ERC-20-Token-Balance">GitHub</a>.</p>

<h2>What if...</h2>
<p>Let's try a few fringe scenarios with this contract ABI. We will be testing this against <a href="https://etherscan.io/token/OmiseGo?a=0x0e2e75240c69495d2b9e768b548db381de2142b9#readContract">OmiseGo</a>.</p>

<ul>
 	<li>What if we call a contract with a function we defined, but does not exist on the contract?</li>
</ul>

<p style="padding-left: 30px;">OMG does not have a <code>version()</code> function, but we define it by default in our <code>human_standard_token_abi</code>. So let's call it:</p>

<pre style="padding-left: 30px;">console.log(tokenContract.version())</pre>

<blockquote>

<p id="lFoSWLl" style="padding-left: 30px;">"Uncaught Error: new BigNumber() not a base 16 number"</p>
</blockquote>

<p id="iNVCeEY" style="padding-left: 30px;"><img class="alignnone size-full wp-image-254 " src="/assets/images/img_5a02ba10afdf7.png" alt="" /></p>

<ul>
 	<li>What if we call a contract with a function that exists, but we did not define in the ABI?</li>
</ul>

<p style="padding-left: 30px;">OMG has the function <code>mintingFinished()</code> which is not part of the Human Standard Token ABI. If we call it, we get the following error:</p>

<p><blockquote style="padding-left: 30px;">"Uncaught TypeError: tokenContract.mintingFinished is not a function"</blockquote></p>

<p id="GdLgoXa" style="padding-left: 30px;"><img class="alignnone size-full wp-image-255 " src="/assets/images/img_5a02bad1835e2.png" alt="" /></p>

&nbsp;
<h2>What I hope you learned:</h2>

<ul>
 	<li>The requirements to call an ERC-20 compliant token contract using Web3.js</li>
 	<li>What a Token Contract ABI is on the Ethereum Blockchain</li>
 	<li>Why the ERC-20 standard is pretty great for develeopers</li>
 	<li>How to easily add the <code>human_standard_token_abi</code> to your JavaScript web application</li>
</ul>

<p>Keep an eye out for <a href="https://shawntabrizi.com/crypto/making-web3-js-work-asynchronously-javascript-promises-await/">my next post</a>, which will detail how to set up Web3.js for JavaScript promises, so we can execute multiple Web3 functions asynchronously.</p>

<p>If you liked this post, and want to support me, feel free to <a href="https://shawntabrizi.com/donate/">send me a donation.</a></p>