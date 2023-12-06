---
title: Porting Web3.js to Polkadot.js
date: 2020-01-12T16:14:03-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/porting-web3-js-to-polkadot-js/
categories:
  - Substrate
tags:
  - javascript
  - front-end
  - balance
  - graph
  - plotly.js
  - ethereum
  - substrate
github: substrate-balance-graph
customjs:
  - https://www.shawntabrizi.com/substrate-balance-graph/polkadot.js
---

##### In this post, I will go over the changes I needed to make in order to port a Web3.js based Ethereum web app I had [previously blogged about]({% post_url 2018-03-11-graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js %}) to use Polkadot.js and Substrate.

Almost 2 years ago, I was still on my journey learning about Ethereum, when I built a simple web application using Web3.js. At the time, there was a spawn of viral "ponzi scheme" smart contracts, and I wanted to see how these dApps grew and eventually crashed over time.

Check out my previous blog post about [Graphing ETH Balance History of an Ethereum Address using Parallel Asynchronous Requests in Web3.js]({% post_url 2018-03-11-graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js %}) to learn more.

Since the launch of [Kusama](https://kusama.network/), there has been a lot more activity around actually _using_ Substrate, specifically among the validator/nominator community. I wanted to take a look at the my nomination rewards over time, and to do that, I basically needed to rebuild this same application, but using Polkadot.js... ([sneak peek](https://www.shawntabrizi.com/substrate-balance-graph/))

![Before and after screenshot of Web3 to Polkadot port](/assets/images/substrate-balance-graph-hero.png)

Here is **that** journey.

## Creating a Polkadot.js Bundle

The first issue I ran into when trying to migrate from Web3.js to Polkadot.js was generating a standalone JavaScript bundle so I can simply include the dependencies into my barebones project. At the moment, Polkadot.js does not provide an official bundle, but it is easy enough to create with [browserify](http://browserify.org/).

Assuming you already have `npm`, here are those steps:

1. Install browserify:

    ```bash
    npm install -g browserify
    ```

2. Create a new NodeJS project:

    ```bash
    mkdir temp
    cd temp
    npm init
    # lots of interaction here, doesn't matter what you select
    ```

3. Add the Polkadot.js dependencies (I use `@beta`, but the exact versions to use may change over time):

    ```bash
    npm install @polkadot/api@beta
    npm install @polkadot/util@beta
    npm install @polkadot/util-crypto@beta
    npm install @polkadot/keyring@beta
    ```

    You should have a `package.json` that looks like:

    ```json
    "dependencies": {
      "@polkadot/api": "^1.0.0-beta.7",
      "@polkadot/keyring": "^2.0.0-beta.4",
      "@polkadot/util": "^2.0.0-beta.4",
      "@polkadot/util-crypto": "^2.0.0-beta.4"
    }
    ```

4. Create a simple file which exports these libraries into the `window` object:

    ```javascript
    // In a file named `dependencies.js`
    let api = require("@polkadot/api");
    let util = require("@polkadot/util");
    let util_crypto = require("@polkadot/util-crypto");
    let keyring = require("@polkadot/keyring");

    window.api = api;
    window.util = util;
    window.util_crypto = util_crypto;
    window.keyring = keyring;
    ```

5. Create the `polkadot.js` bundle:

    ```bash
    browserify dependencies.js > polkadot.js
    ```

You should now have a `polkadot.js` file that you can include into any HTML page and will export `api`, `util`, `util_crypto`, and `keyring` commands. 

```html
<script src="polkadot.js"></script>
```

Actually, you can find it on this page too! Just open your browser console and try any of these commands.

```javascript
util_crypto.blake2AsHex("Hello, World!")

> "0x511bc81dde11180838c562c82bb35f3223f46061ebde4a955c27b3f489cf1e03"
```

If you don't want to follow these steps, feel free to grab the `polkadot.js` bundle I created at: [shawntabrizi/substrate-balance-graph](https://github.com/shawntabrizi/substrate-balance-graph).

## Connecting to a Node

As a front-end developer, I am not so interested in setting up a local node, to get my app to work. In the Web3.js world, I would use Metamask + a dedicated infura node. From my Ethereum web app [(ethgraph)](https://github.com/shawntabrizi/ethgraph):

```js
// Check for MetaMask, otherwise use an HTTP Provider
window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
    }
})
```

The [polkadot-js/extension](https://github.com/polkadot-js/extension) does not inject a WebSocket provider automatically, so we can skip the "detected" step, and just connect when we know we are not connected. Substrate is also not just a platform for _one_ chain, but many chains, so I wanted to also support the user user customizable endpoints.

I created a `connect` function which looks like this:

```js
// Connect to Substrate endpoint
async function connect() {
    let endpoint = document.getElementById('endpoint').value;
    if (!window.substrate || global.endpoint != endpoint) {
        const provider = new api.WsProvider(endpoint);
        document.getElementById('output').innerHTML = 'Connecting to Endpoint...';
        window.substrate = await api.ApiPromise.create({ provider });
        global.endpoint = endpoint;
        document.getElementById('output').innerHTML = 'Connected';
    }
}
```

You can see I keep track of two global properties:

  1. `window.substrate` - This will be my WebSocket provider and how I access the Polkadot.js APIs. If it already exists, I am already connected!
  2. `window.global.endpoint` - This is a global variable I created to keep track of the current endpoint I am connected to.

When I call `connect`, it will make sure I am connected to the endpoint I want based on the input of the `endpoint` element on the HTML page. For a network like Kusama, this endpoint would be something like:

```
wss://kusama-rpc.polkadot.io/
```

## Querying the Node

At the time of creating `ethgraph`, Web3.js did not support `async`/`await`. Instead, [I wrapped everything in a "promisify" wrapper]({% post_url 2017-11-24-making-web3-js-work-asynchronously-javascript-promises-await %}). Fortunately, Polkadot.js supports this natively, so you can query every API easily and ergonomically with a promise.

For example, here is how we can get the balance of a user:

```javascript
let balance = await substrate.query.balances.freeBalance("EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo")
balance.toNumber()

> 2116624633061757
```

To provide all the functionality of the Ethereum version of this app, I also need to query the timestamp of a block. Ethereum would include this in the block header, but we know that Substrate has no such requirements, and instead provides this through another runtime module:

```javascript
let timestamp = await substrate.query.timestamp.now()
Date(timestamp)

> "Wed Jan 15 2020 22:42:37 GMT+0100 (Central European Standard Time)"
```

Great! But how do we get the _historical_ information?

In Ethereum, we could just provide the block number directly into the query:

```javascript
web3.eth.getBalance(address, blockNumber, function() { /*callback*/ })
```

In Polkadot.js we need to use the `.at(hash, <PARAMS>)` API, which extends all the Substrate queries. `hash` here is the block hash of the block that I want to get the information for. To get the block hash, I need to make an RPC call through the Polkadot.js API:

```javascript
let blockHash = await substrate.rpc.chain.getBlockHash(100)
blockHash.toString()

> "0x46781d9a3350a0e02dbea4b5e7aee7c139331a65b2cd736bb45a824c2f3ffd1a"
```

So all together now:

```javascript
let balance_100 = await substrate.query.balances.freeBalance.at("0x46781d9a3350a0e02dbea4b5e7aee7c139331a65b2cd736bb45a824c2f3ffd1a", "EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo")
balance_100.toNumber()

> 10000000000
```

You can see I gained quite a bit of free balance since block 0! :)

## Keeping it Async

So we have all the pieces to be able convert our old queries into the new ones. However, if we do things naively, we will run into a trap which was warned about in my last blog post.

Can you guess?

Let's take a look how a naive conversion between Web3.js to Polkadot.js would look like:

* Original Web3.js Code

    ```javascript
    // Loop over the blocks, using the step value
    for (let i = startBlock; i < endBlock; i = i + step) {
        // If we already have data about that block, skip it
        if (!global.balances.find(x => x.block == i)) {
            // Create a promise to query the ETH balance for that block
            let balancePromise = promisify(cb => web3.eth.getBalance(address, i, cb));
            // Create a promise to get the timestamp for that block
            let timePromise = promisify(cb => web3.eth.getBlock(i, cb));
            // Push data to a linear array of promises to run in parellel.
            promises.push(i, balancePromise, timePromise);
        }
    }
    ```

* Naive Polkadot.js Code

    ```javascript
    // Loop over the blocks, using the step value
    for (let i = startBlock; i < endBlock; i = i + step) {
        // If we already have data about that block, skip it
        if (!global.balances.find(x => x.block == i)) {
            // Get the block hash
            let blockHash = await substrate.rpc.chain.getBlockHash(i);
            // Create a promise to query the balance for that block
            let freeBalancePromise = substrate.query.balances.freeBalance.at(blockHash, address);
            // Create a promise to get the timestamp for that block
            let timePromise = substrate.query.timestamp.now.at(blockHash);
            // Push data to a linear array of promises to run in parellel.
            promises.push(i, freeBalancePromise, timePromise);
        }
    }
    ```

First, we should call out how incredibly similar the two code blocks look. The naive update is _totally_ working, and really we did not have to change our app at all! But if you are trying this at home, you might notice the app is running pretty slow... over 30 seconds to fetch the data needed to create the graph!

![Image before parallel async](/assets/images/substrate-balance-graph-before.png)

The point of this loop was to collect all the queries and run them asynchronously. As mentioned in the last blog post, this provides a huge boost in performance since we are not waiting for each response to move onto the next one. However, this naive conversion sticks an `await` right in the middle of the loop, and this causes us to serialize querying for all the blocks, and slow down the entire processes.

To solve this, we want to also query all the block hashes for the blocks we need in parallel, but in a separate loop, because we need to know the hash before we can make the next query.

The improved solution looks like:

```javascript
var promises = [];

// Get all block hashes
for (let i = startBlock; i < endBlock; i = i + step) {
    // If we already have data about that block, skip it.
    if (!global.blockHashes.find(x => x.block == i)) {
        let blockHashPromise = substrate.rpc.chain.getBlockHash(i);
        promises.push(i, blockHashPromise);
    }
}

// Call all promises in parallel for speed
var results = await Promise.all(promises);

// Save block hashes globally so we don't query them again if we don't need to.
for (let i = 0; i < results.length; i = i + 2) {
    global.blockHashes.push({
        block: results[i],
        hash: results[i + 1]
    });
}

var promises = [];

// Loop over the blocks, using the step value
for (let i = startBlock; i < endBlock; i = i + step) {
    // If we already have data about that block, skip it
    if (!global.balances.find(x => x.block == i)) {
        // Get the block hash
        let blockHash = global.blockHashes.find(x => x.block == i).hash;
        // Create a promise to query the balance for that block
        let freeBalancePromise = substrate.query.balances.freeBalance.at(blockHash, address);
        // Create a promise to get the timestamp for that block
        let timePromise = substrate.query.timestamp.now.at(blockHash);
        // Push data to a linear array of promises to run in parellel.
        promises.push(i, freeBalancePromise, timePromise);
    }
}

// Call all promises in parallel for speed
var results = await Promise.all(promises);

console.log('Results:', results);
```

This generates a graph for us in under 2 seconds!

![Image after parallel async](/assets/images/substrate-balance-graph-after.png)

Much better, and what you would expect from a modern web application! But here we don't have a traditional database, just a blockchain.

## Final Thoughts

You can play with the final application here: [https://www.shawntabrizi.com/substrate-balance-graph/](https://www.shawntabrizi.com/substrate-balance-graph/)

After this exercise it has become clear to me that porting existing web applications built with Web3.js to Polkadot.js is trivial. Additionally, I already have a ton of experience with Substrate runtime development, so I already know how easy it will be to take existing smart contracts and build them on Substrate, maybe even better than before.

With that in mind, it won't be long until we see a wave of existing dApps joining Substrate/Polkadot, taking advantage of all the next generation features without making any compromises toward their existing functionality. The future seems bright overall, and I am excited to be at the forefront.

As always, if you like the content I create, stop by my [donations page](https://shawntabrizi.com/donate/) and say thanks!
