---
title: 'Ethereum and Web3.js &#8220;Hello World&#8221;: Get the ETH Balance of an Ethereum Address'
date: 2017-11-02T10:19:09-08:00
authors: shawntabrizi
layout: post
slug: /ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/
categories:
  - Ethereum
tags:
  - blockchain
  - ethereum
  - html
  - javascript
  - web3
github: ETH-Balance
---

##### Using just 41 lines of HTML + JS, we create a Web3.JS application which can get the ETH Balance of an Ethereum Address [[Final Result]](https://shawntabrizi.com/ethbalance/) [[GitHub]](https://github.com/shawntabrizi/ETH-Balance)

For me, the hardest part of learning new technical skills is overcoming the hurdle of simply getting started. The Ethereum development space is booming, and the ability to make relatively simple web applications that interact with the Ethereum blockchain is at a premium. Today, development on World Wide Web requires you to compete with a huge number of fully developed, feature rich applications, where it is very unlikely that you are actually contributing value. However, the same is absolutely not true for Ethereum and blockchain as a whole. There are so many utilities and tools that can bring value to this ecosystem, all with relatively low feature requirements.

**So let's overcome the first barrier by building a "Hello World" application.**

From my perspective, the perfect project for something like this would be a bare-bones single-page application which fetches the ETH balance of an Ethereum address. This is about as simple as it gets to allow a user to interact with the blockchain, and thanks to Web3.js, it is also really simple to implement!

## Prerequisites

To gain access to the Ethereum network, you will need to gain access to a Web3 Provider. As I will talk about more below, this comes natively with certain Ethereum focused browsers, but for the average user you will need to provide them with their own gateway to the blockchain. Basically, you need someone to provide your app the data that is actually on the blockchain, and Web3.js has the ability to interact directly with an HTTP Provider to bring you this data with minimal effort.

I used [Infura.io](https://infura.io/) as my Ethereum provider (for no other reason than they showed up first when searching), and after spending less than a minute registering with them for free, I was given my unique address to their Main Ethereum Network where my API Key was appended at the end.

![](/assets/images/img_59fad787df3db.png)

Save this URL, as you will be using it very shortly.

```
https://mainnet.infura.io/<apikey>
```

The only other thing you need to get started is your own copy of Web3.js which can be [found on GitHub](https://github.com/ethereum/web3.js). Just download and unpack the ZIP file.

Create a new folder where you want your project to live, and create an `index.html` file. Then, from the Web3.js download, copy `web3.min.js` to that folder.

```
ethbalance/     (folder)
├── index.html
└── web3.min.js
```

Finally, make sure you initialize your `index.html` skeleton:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>

<body>
</body>
</html>
```

## Let's get started!

To make this as simple as possible, we are going to create a single HTML file which will contain all the code necessary to complete this project. It will be broken into 2 parts:

1.  HTML to render a bare-bones web page
2.  JavaScript to initialize a Web3 object, and interact with our HTTP Provider

### HTML Body

Our HTML body needs a text field for the user to input an Ethereum address, a button to trigger the JavaScript, and an output area to display the result. I am going to assume that if you are reading this post, you have enough familiarity with HTML that I can just breeze over this, and give you the code:

```html
<body>
    <h1>ETH Balance Fetcher</h1>
    <p>Enter your Ethereum Address:</p>
    <input type="text" size="50" id="address" />
    <button type="button" onClick="getBalance();">Get Balance</button>
    <br />
    <br />
    <div id="output"></div>
</body>
```

The only thing of note here is that when you click the button we created, it triggers a JavaScript function `getBalance()`, and that is what we are going to write next!

### HTML Head: JavaScript and Web3

Now it is time to prepare the JavaScript required to make this all work. We are going to need to get the Ethereum address inputted by the user, initiate our connection to the Ethereum Provider, and then query the blockchain for the ETH balance at that address. Oh, of course we will also send back the result and update the HTML with the value. Here is our HTML head template:

```html
<head>
    <!-- Check if Web3 already defined -->
    <!-- If not, connect to HTTP Provider -->
    <!-- getBalance() function -->
</head>
```

First we will load and set up our Web3 provider. If you are using an Ethereum compatible browser like [Brave](https://brave.com/), Chrome + [MetaMask](https://metamask.io/), or [Mist](https://github.com/ethereum/mist/releases), you will already have your own Web3 provider established natively. You can access that connection with this:

```html
<head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="./web3.min.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function () {
            if (typeof web3 !== 'undefined') {
                console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
                window.web3 = new Web3(web3.currentProvider);
            }
        })

    <!-- If not, connect to HTTP Provider -->
    <!-- getBalance() function -->
    </script>
</head>
```

More likely, the user does not have one of these browsers, so we need to establish our own connection to the Ethereum network. We can do this with the URL that you saved earlier from Infura.io, and establishing an HTTP Provider:

```html
<head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="./web3.min.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function () {
            if (typeof web3 !== 'undefined') {
                console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
                window.web3 = new Web3(web3.currentProvider);
            } else {
                console.log('No Web3 Detected... using HTTP Provider')
                window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
            }
        })

    <!-- getBalance() function -->
    </script>
</head>
```

At this point, we can do just about anything that Web3.js offers, but for our purposes we only need to query the blockchain for the address, and return the ETH balance. So let's set up our `getBalance()` function:

```html
<head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="./web3.min.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function () {
            if (typeof web3 !== 'undefined') {
                console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
                window.web3 = new Web3(web3.currentProvider);
            } else {
                console.log('No Web3 Detected... using HTTP Provider')
                window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
            }
        })
        function getBalance() {
            var address, wei, balance
            address = document.getElementById("address").value
            try {
                web3.eth.getBalance(address, function (error, wei) {
                    if (!error) {
                        var balance = web3.fromWei(wei, 'ether');
                        document.getElementById("output").innerHTML = balance + " ETH";
                    }
                });
            } catch (err) {
                document.getElementById("output").innerHTML = err;
            }
        }
    </script>
</head>
```

Walking through the function:

First we store the value of the text field from our HTML page into the `address` variable. Then, we will `try` to use the `web3` object we initialized earlier to call the function `web3.eth.getBalance()` which accepts an Ethereum Address as an input. Note that we need to make this call asynchronously as the user does not have the full blockchain loaded on their machine, so some calls may run slow. Rather than lock the user's interface, we let the the call happen in the background, and when it is complete, we trigger an update to the page. This is [required to support MetaMask](https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#dizzy-all-async---think-of-metamask-as-a-light-client), but benefits all Web3 applications. If you want to learn more about how to make these requests asynchronous, take a look at the ["Using callbacks" section](https://github.com/ethereum/wiki/wiki/JavaScript-API#using-callbacks) in the Web3 documentation.

Once the asynchronous request is complete, we will get back a Wei balance as a result. But we want the Ether value, so we do one last step to convert the value: `web3.fromWei(wei, 'ether')`. If all of this is successful, we update the `output` div with our result, otherwise if it fails at any point we `catch` the error, and output that message instead.

Here is the final `index.html` file which you should be able to use as soon as you paste in your `apikey` from Infura.io. You can also download this project directly from my [GitHub](https://github.com/shawntabrizi/ETH-Balance).

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="./web3.min.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function () {
            if (typeof web3 !== 'undefined') {
                console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
                window.web3 = new Web3(web3.currentProvider);
            } else {
                console.log('No Web3 Detected... using HTTP Provider')
                window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
            }
        })
        function getBalance() {
            var address, wei, balance
            address = document.getElementById("address").value
            try {
                web3.eth.getBalance(address, function (error, wei) {
                    if (!error) {
                        var balance = web3.fromWei(wei, 'ether');
                        document.getElementById("output").innerHTML = balance + " ETH";
                    }
                });
            } catch (err) {
                document.getElementById("output").innerHTML = err;
            }
        }
    </script>
</head>
<body>
    <h1>ETH Balance Fetcher</h1>
    <p>Enter your Ethereum Address:</p>
    <input type="text" size="50" id="address" />
    <button type="button" onClick="getBalance();">Get Balance</button>
    <br />
    <br />
    <div id="output"></div>
</body>
</html>
```

You can try this out right now using the version I hosted here: [https://shawntabrizi.com/ethbalance/](https://shawntabrizi.com/ethbalance/)

![](/assets/images/img_59faeb0dd20de.png)

One thing you should note is that this is a client-side JavaScript application. There are a million reasons why making client-side apps is so much easier for development, but one big downside is that your API key will be exposed to anyone who simply inspects the HTML. Please do not abuse my API key, and please do not ship a production application using a method like this unless you are prepared to get your API key terminated.

Note that I have made updates to this blog post, correcting some issues regarding best practices with Web3\. You can learn more about the errors I made along the way [here](https://shawntabrizi.com/ethereum/correcting-ethereum-web3-js-hello-world/).

I hope this helps you get started with developing for Ethereum using Web3.js! If you liked this content, and want to support me, feel free to [send a donation](https://shawntabrizi.com/donate/).
