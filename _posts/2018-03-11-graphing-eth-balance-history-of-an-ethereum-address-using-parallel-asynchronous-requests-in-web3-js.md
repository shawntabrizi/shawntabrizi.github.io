---
title: Graphing ETH Balance History of an Ethereum Address using Parallel Asynchronous Requests in Web3.js
date: 2018-03-11T22:31:35-08:00
author: Shawn Tabrizi
layout: post
permalink: /ethereum/graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js/
categories:
  - Ethereum
tags:
  - ethereum
  - javascript
  - web3
---
<h5>This tutorial will show you how you can query the ETH balance of an Ethereum address across multiple Ethereum blocks, and visualize the results as a graph.</h5>
&nbsp;

<p>Continuing my series of simple to consume <a href="https://shawntabrizi.com/crypto/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/">Web3.js tutorials</a>, I want to now look into how we can start to visualize data from the Ethereum blockchain. In the past month or so, a bunch of ponzi scheme Ethereum contracts have been popping. The first notable one was POWHcoin which had the following brilliant whitepaper:</p>

<p id="XmxOSbQ"><img class="alignnone size-full wp-image-437 " src="/assets/images/img_5acdcc67280aa.png" alt="" /></p>

<p>This made me wonder what the actual graph of this Ethereum smart contract looked like...</p>

<p>Unfortunately, this smart contract eventually got hacked, so we won't quite be able to see the peaks and valleys like the picture above shows, but we will be able to see the contract get completely liquidated, which may be interesting itself.</p>

<p>Let's build it!</p>

<h2>Getting the ether balance at a certain block</h2>

<p>The main thing we need to do here is get the ETH balance of an address at a specific block. This is actually quite easy by extending the call we make in my first tutorial:</p>
<h4><a href="https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetbalance">web3.eth.getBalance</a></h4>

<pre><code>web3.eth.getBalance(addressHexString [, defaultBlock] [, callback])</code></pre>

<p>So if we simply pass a block number into this function, we should be able to get the balance at that point in time.</p>

<h2>Getting the first transaction for an Ethereum address</h2>

<p>Before we create a loop getting the various balances, we need to know where to start looking. We could start at block 0, but we will get a ton of empty data before the address was ever used. Unfortunately, Web3.js does not have a good way to query the first transaction of an Ethereum address, so we will use Etherscan's API to get that information. Note that if you want to do this entirely with Web3, you can, you will just need to create a smart searching algorithm, and look at a ton of blocks... probably not very efficient.
<h4><a href="https://etherscan.io/apis#accounts"><strong>Etherescan Developer APIs:</strong> Accounts</a></h4>
<pre>https://api.etherscan.io/api?module=account&action=txlist&address=0xA7CA36F7273D4d38fc2aEC5A454C497F86728a7A&startblock=0&page=1&offset=1</pre>
This query, which includes the POWHcoin address, will return the first transaction of that address, which is the contract creation. You can verify it is a contract creation call because the <code>to</code> value is empty, and the <code>contractAddress</code> is populated and matches the address we are observing.</p>

<p>Now we know to start looking at block 499258.</p>

<h2>Get the current block number</h2>

<p>Really the last piece of information we need is the current block number, so we know where to end our loop. This information is also available via Web3.js with the following call:</p>

<h4><a href="https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethblocknumber">web3.eth.blockNumber</a></h4>

<pre><code>web3.eth.getBlockNumber(callback(error, result){ ... })
</code></pre>

<h2>So let's make a simple loop:</h2>

<p>Here is a simple implementation of what we want to accomplish:</p>

```javascript
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

// Wrapper for Web3 callback
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

// Get the first transaction block for an address
async function getFirstBlock(address) {
    let response = await fetch("https://api.etherscan.io/api?module=account&action=txlist&address=" + address + "&startblock=0&page=1&offset=10&sort=asc");
    let data = await response.json();

    return data.result[0].blockNumber;
}

// Given an address and a range of blocks, query the Ethereum blockchain for the ETH balance across the range
async function getBalanceInRange(address, startBlock, endBlock) {
    // Number of points to fetch between block range
    var pointCount = 50;

    // Calculate the step size given the range of blocks and the number of points we want
    var step = Math.floor((endBlock - startBlock) / pointCount)
    // Make sure step is at least 1
    if (step < 1) {
        step = 1;
    }

    // Store the final result here
    var balances = []

    // Loop over the blocks, using the step value
    for (let i = startBlock; i < endBlock; i = i + step) {
        // Get the ETH value at that block
        let wei = await promisify(cb => web3.eth.getBalance(address, i, cb));
        let ether = parseFloat(web3.fromWei(wei, 'ether'))
        // Add result to final output 
        balances.push({
            block: i,
            balance: ether
        });
    }

    return balances;
}

// Main function
async function graphBalance() {
    // Ethereum Address we want to look at
    var address = "0xA7CA36F7273D4d38fc2aEC5A454C497F86728a7A"

    // Find the intial range, from first block to current block
    var startBlock = parseInt(await getFirstBlock(address));
    var endBlock = parseInt(await promisify(cb => web3.eth.getBlockNumber(cb)));

    var balances = await getBalanceInRange(address, startBlock, endBlock);
    console.log(balances)
}

graphBalance();
```

<p>And the output we get is:</p>

<pre>[{"block":4990258,"balance":0},{"block":4995223,"balance":690.3946401936848},{"block":5000188,"balance":812.2356284509416},{"block":5005153,"balance":1033.1702951440611},{"block":5010118,"balance":74.00248959231331},{"block":5015083,"balance":0.23714259262709267},{"block":5020048,"balance":0.000334978488623982},{"block":5025013,"balance":0.005036602641690202},{"block":5029978,"balance":0.005036602641690202},{"block":5034943,"balance":0.0526236993093083},{"block":5039908,"balance":0.04323124310148216},{"block":5044873,"balance":0.06245124310148216},{"block":5049838,"balance":0.06283124310148216},{"block":5054803,"balance":0.004397267827962452},{"block":5059768,"balance":0.004397267827962452},{"block":5064733,"balance":0.004397267827962452},{"block":5069698,"balance":0.03639726782796245},{"block":5074663,"balance":0.03639726782796245},{"block":5079628,"balance":0.03919726782796245},{"block":5084593,"balance":0.03919726782796245},{"block":5089558,"balance":0.04199726782796245},{"block":5094523,"balance":0.04205726782796245},{"block":5099488,"balance":0.04205726782796245},{"block":5104453,"balance":0.5869572678279624},{"block":5109418,"balance":0.000534060075850865},{"block":5114383,"balance":0.000534060075850865},{"block":5119348,"balance":0.000534060075850865},{"block":5124313,"balance":0.000534060075850865},{"block":5129278,"balance":0.000534060075850865},{"block":5134243,"balance":0.000534060075850865},{"block":5139208,"balance":0.02642294883092996},{"block":5144173,"balance":0.026442948830929958},{"block":5149138,"balance":0.026442948830929958},{"block":5154103,"balance":0.026442948830929958},{"block":5159068,"balance":0.03494294883092996},{"block":5164033,"balance":0.03993222727211795},{"block":5168998,"balance":0.04793222727211795},{"block":5173963,"balance":0.04793222727211795},{"block":5178928,"balance":0.04793222727211795},{"block":5183893,"balance":0.04793222727211795},{"block":5188858,"balance":0.04076568624207472},{"block":5193823,"balance":0.04076568624207472},{"block":5198788,"balance":0.04076568624207472},{"block":5203753,"balance":0.04076568624207472},{"block":5208718,"balance":0.04076568624207472},{"block":5213683,"balance":0.04076568624207472},{"block":5218648,"balance":0.04076568624207472},{"block":5223613,"balance":0.04076568624207472},{"block":5228578,"balance":0.04076568624207472},{"block":5233543,"balance":0.04076568624207472},{"block":5238508,"balance":0.04076568624207472}]</pre>

<p>Looks good so far! But if you run the code yourself, you will feel how dreadfully slow it is... That is because we are essentially doing a serial query, waiting around 100ms for every data-point:</p>

<p id="uoonCrD"><img class="alignnone size-full wp-image-395 " src="/assets/images/img_5aa5b062b26a2.png" alt="" /></p>

<p>But we can dramatically improve this by making the Web3.js requests asynchronous and in parallel!</p>

<h2>Web3.js Asynchronous and Parallel Calls</h2>
<p>We will need to update our <code>getBalanceInRange</code> function. Instead of <code>await</code>ing the balance data within each loop, we should simply queue up all of the requests, and then have them be processed at once with <code>Promise.all</code>.</p>

<p>So our new loop would look something like this:</p>

```javascript
// Given an address and a range of blocks, query the Ethereum blockchain for the ETH balance across the range
async function getBalanceInRange(address, startBlock, endBlock) {
    // Number of points to fetch between block range
    var pointCount = 50;

    // Calculate the step size given the range of blocks and the number of points we want
    var step = Math.floor((endBlock - startBlock) / pointCount)
    // Make sure step is at least 1
    if (step < 1) {
        step = 1;
    }

    // Queue the promises here
    var promises = [];

    // Loop over the blocks, using the step value
    for (let i = startBlock; i < endBlock; i = i + step) {
        // Create a promise to query the ETH balance for that block
        var promise = promisify(cb => web3.eth.getBalance(address, i, cb));
        // Queue the promise and include data about the block for output
        promises.push(promise.then(wei => (
            {
                block: i,
                balance: parseFloat(web3.fromWei(wei, 'ether'))
            })));
    }
    // Resolve all promises in parellel
    var balances = await Promise.all(promises);

    return balances;
}
```

<p>Running this is MUCH faster, and the parallel nature of the calls can be seen in the network traces:</p>

<p id="NAFbksK"><img class="alignnone size-full wp-image-396 " src="/assets/images/img_5aa5b09b0bb6f.png" alt="" /></p>

<h2>Final Result</h2>

<p>From there, you just need to pipe the data into your favorite JavaScript graph library, and you will get a view like this:</p>

<p id="UbiySbl"><img class="alignnone size-full wp-image-388 " src="/assets/images/img_5aa5ad6c84572.png" alt="" /></p>

<p>Here you can see the quick rise of the ponzi scheme, the sell offs of 'weak hands', and finally the contract getting hacked and liquidating all the funds.</p>

<p>I will not go into detail about making this graph in this tutorial, but you can see my final app here:</p>

<p><a href="https://shawntabrizi.com/ethgraph/?address=0xA7CA36F7273D4d38fc2aEC5A454C497F86728a7A&start=4990258&end=5010862">https://shawntabrizi.com/ethgraph/?address=0xA7CA36F7273D4d38fc2aEC5A454C497F86728a7A&start=4990258&end=5010862</a></p>

<p>You can find the source code here:</p>

<p><a href="https://github.com/shawntabrizi/ETH-Balance-graph">https://github.com/shawntabrizi/ETH-Balance-graph</a></p>

<p>If you have any suggestions, or find any bugs please let me know! If you found this short tutorial helpful, feel free to send a donation using the information <a href="https://shawntabrizi.com/donate/">here</a>.</p>