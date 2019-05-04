---
id: 528
title: Using Web3.js 1.0 Subscribe and Infura WebSockets to Visualize Ethereum Transactions
date: 2018-05-24T22:42:19-08:00
author: Shawn Tabrizi
layout: post
guid: http://shawntabrizi.com/?p=528
permalink: /ethereum/using-web3-js-1-0-subscribe-and-infura-websockets-to-visualize-ethereum-transactions/
categories:
  - Ethereum
tags:
  - blockchain
  - ethereum
  - graph
  - html
  - infura
  - javascript
  - web3
  - websockets
---
<h5>In this tutorial, you will learn how to subscribe to an Ethereum WebSocket using Web3.js to dynamically pull pending transactions on the blockchain.</h5>
<p>Recently, I have been pretty lurking on the <a href="https://ethereum.stackexchange.com/">Ethereum StackExchange</a>, and I have been seeing a pretty common question repeat itself.
<br />
<blockquote>How can I detect when a specific transaction occurs on Ethereum?</blockquote>
</p>

<p>It might be that the user wants to see every time their account gets a payment. Or maybe they want track when another contract sends Ether.</p>

<p>By trying to answer this question I learned in <a href="https://web3js.readthedocs.io/en/1.0/index.html">Web3.js 1.0</a> is introducing support for WebSockets, which will allow client applications to have an open and interactive session with the Ethereum blockchain. With WebSockets, you can automatically receive event-driven responses from Ethereum without having to repeatedly poll the blockchain. (<em>As of this writing, Web3.js 1.0 is still in beta.</em>)</p>

<p>As of right now, you can <a href="https://web3js.readthedocs.io/en/1.0/web3-eth-subscribe.html">subscribe to 4 kinds of events</a>: <code>pendingTransactions</code>, <code>newBlockHeaders</code>, <code>syncing</code>, and <code>logs</code>.</p>

<p>Logs are particularly interesting because you can add additional <code>options</code> like an Ethereum address to only get back the logs for that account, which will allow you to really easily monitor when different events happen, such as a payment.</p>

```javascript
var subscription = web3.eth.subscribe('logs', {
address: '0x123456..',
topics: ['0x12345...']
}, function(error, result){
if (!error)
console.log(result);
})
.on("data", function(log){
console.log(log);
})
.on("changed", function(log){
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
if(success)
console.log('Successfully unsubscribed!');
});
```

<h2>ETH Transaction Graph</h2>

<p>I wanted try out this feature, so I decided I would build a little visual which would show transactions on the Ethereum blockchain. I thought it would be cool to let transactions come in, and see if we can start to find addresses which have a ton of activity. A natural visual for transactions is to <a href="https://en.wikipedia.org/wiki/Graph_drawing">draw a graph</a>, and if we do things correctly, we should see these central nodes appear; where tons of different addresses are interacting with a single Ethereum contract or other type of account.</p>

<p>You can check out the web app I built here: <a href="http://shawntabrizi.com/ethtxs/">http://shawntabrizi.com/ethtxs/</a>.
<br />
Letting it run for a little bit will generate a neat <a href="https://en.wikipedia.org/wiki/Force-directed_graph_drawing">force-directed graph drawing</a> like the one below:</p>

<img alt='Graph Drawing Result' class='alignnone size-full wp-image-539 ' src='http://shawntabrizi.com/wordpress/wp-content/uploads/2018/05/img_5b07a77621420.png' />


<p>You can find the source code to this app on <a href="https://github.com/shawntabrizi/ETH-Transaction-Graph">my GitHub</a>.</p>

<h3>How does it work?</h3>

<p>Before you can do anything with Web3.js, you will need to gain access to an Ethereum WebSocket. This technology is still pretty new, so there aren't many options. But you can always rely on <a href="https://infura.io/">Infura</a> to be ahead of the game. Although as of this writing, <a href="https://github.com/INFURA/infura/issues/97">WebSockets on Infura are not quite production ready</a>, they should be in the near future. Connecting to the WebSocket is easy:</p>

```javascript
var web3 = new Web3('wss://mainnet.infura.io/_ws');
```

<p><em>Note that it is important you do not include the normal check for <a href="https://metamask.io/">MetaMask</a>, since the browser plugin does not yet support WebSockets.</em></p>

<p>Now that you are connected to your WebSocket, you just need to set up a subscription using Web3.js:</p>

```javascript
subscription = web3.eth.subscribe('pendingTransactions', function (error, result) {})
    .on("data", function (transactionHash) {
        web3.eth.getTransaction(transactionHash)
        .then(function (transaction) {
            createNode(transaction.from, transaction.to);
        });
    })
```

<p>Using the code above, I will get a stream of transactions hashes coming to my app. Whenever I get a transaction hash, I use <code>web3.eth.getTransaction</code> to then get data about the transaction. Finally, from that data, I get the <code>to</code> address and the <code>from</code> address. These go into my <code>createNode</code> function which adds the transaction to the graph drawing. I won't be going into much details about <a href="https://d3js.org/">D3.js</a>, which generates the graph, because it is black magic to me. (Lots of copy and pasting code to get this sample to work...)</p>

<p>If you are setting up a subscription, don't forget to also set up a way to unsubscribe! This is particularly important for my little sample because the browser starts to get REALLY slow once you have a few thousand transactions drawn.</p>
```javascript
subscription.unsubscribe(function (error, success) {
    if (success)
        console.log('Successfully unsubscribed!');
});
```

<p>That's really all you need to know to set up a sample similar to this! I wanted to keep this example as dead simple as possible, but you could imagine a million ways to modify and improve the design here. For example, imagine having each node grow and shrink as Ether is sent to and from the Ethereum Address! If you want to fork my code, I would love to see what kinds of projects you can think of using my sample as a baseline.</p>

<p>As always, I am excited to share with you fun, simple projects in the Ethereum development space, and I would love to hear any and all feedback you have. Know a cool project that you think someone should build and write about? Let me know!</p>

<p>If this post helped you, and you want to say "Thanks!", take a look at my <a href="http://shawntabrizi.com/donate/">donations page</a>.</p>