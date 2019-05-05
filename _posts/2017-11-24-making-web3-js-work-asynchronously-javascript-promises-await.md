---
title: Making Web3.js work asynchronously with JavaScript Promises and await
date: 2017-11-24T00:47:40-08:00
author: Shawn Tabrizi
layout: post
permalink: /ethereum/making-web3-js-work-asynchronously-javascript-promises-await/
categories:
  - Ethereum
tags:
  - async
  - javascript
  - promises
  - web3
---
<p>One of the things I learned when writing my <a href="https://shawntabrizi.com/crypto/correcting-ethereum-web3-js-hello-world/">"Hello World" tutorial for Ethereum and Web3.js</a> was the importance of having your functions which call the blockchain run asynchronously. Without this, we would be unable to support users who use MetaMask as their Ethereum provider, and probably even more important, we may bring bad user experiences by locking up the browser during long HTTP requests. From the MetaMask developer FAQ:</p>

<blockquote>
<p style="padding-left: 30px;">Using synchronous calls is both a technical limitation and a user experience issue. They block the user's interface. So using them is a bad practice, anyway. Think of this API restriction as a gift to your users.</p>
</blockquote>

<p>Setting up a Web3 function to work asynchronously was pretty easy to figure out for a single call; but what about making multiple calls through Web3, that all need to be asynchronous, but also have dependencies on one another?</p>

<p>An example would be calculating the ERC-20 token balance of an Ethereum address. To do this, you need to know both the balance of tokens at the address, but also the decimals value for that token to convert to the right units. JavaScript Promises are the natural solution here. They allow you to track the status of an asynchronous function, and perform actions after your multiple dependencies all resolve.</p>

<h2>Turning Web3.js functions into JavaScript Promises</h2>
<p>In my <a href="https://shawntabrizi.com/crypto/correcting-ethereum-web3-js-hello-world/">"Hello World" tutorial</a>, I show you can make an asynchronous requests by adding an error first callback to the Web3.js functions:</p>

```javascript
web3.eth.getBalance(address, function (error, result) {
    if (!error) {
        console.log(result);
    } else {
        console.error(error);
    }
});
```

<p>As I mentioned, if we depend on multiple calls from the Ethereum blockchain to create a result, using <a href="https://developers.google.com/web/fundamentals/primers/promises">JavaScript Promises</a> is a good solution. They allow you to react to a success or a failure from an asynchronous function. Creating a promise from the error first callback function is pretty straightforward:</p>

```javascript
function getBalance (address) {
  return new Promise (function (resolve, reject) {
    web3.eth.getBalance(address, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
    }
  })
}
```

<p>But we can actually make this process even simpler for multiple Web3 functions by creating a wrapper which both makes the function asynchronous, and turn it into a promise; basically automating what we would repeat above for each different Web3 function we call.</p>

<p>Here is the wrapper from<a href="https://ethereum.stackexchange.com/a/24238/19577"> 0xcaff posted in StackExchange</a>:</p>

```javascript
const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );
```

<p>Now that we have a Promise, we can take advantage of the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function">async/await pattern</a> which simplifies not only the look, but also the behavior of Promises.</p>

<p>Putting this all together, let's show how simple this makes getting the token balance for an ETH account. We convert our original "Hello World" <code>getBalance</code> into an asyncronous function, like so:</p>

```javascript
async function getBalance() {
    var address, wei, balance
    address = document.getElementById("address").value;
    wei = promisify(cb => web3.eth.getBalance(address, cb))
    try {
        balance = web3.fromWei(await wei, 'ether')
        document.getElementById("output").innerHTML = balance + " ETH";
    } catch (error) {
        document.getElementById("output").innerHTML = error;
    }
}
```


<p>Not much shorter for a single function, but will certainly make things better the more separate functions we call. My next post will show the results of these smaller educational posts, and how we can put it together to create the project I have been hinting above: <a href="https://github.com/shawntabrizi/ERC-20-Token-Balance">Getting the ERC-20 balance of an Ethereum Address</a>.</p>

<p>I hope this teaches you something! Again, this may be trivial to many, but was not so straightforward when I first started to tackling these problems. If it did help you, feel free to support me with a <a href="https://shawntabrizi.com/donate/">small donation.</a></p>