"use strict";(self.webpackChunkshawntabrizi=self.webpackChunkshawntabrizi||[]).push([[6894],{87417:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>c});var a=n(85893),s=n(11151);const o={title:"Porting Web3.js to Polkadot.js",date:new Date("2020-01-12T00:00:00.000Z"),authors:"shawntabrizi",slug:"/substrate/porting-web3-js-to-polkadot-js/",categories:["Substrate"],tags:["javascript","front-end","balance","graph","plotly.js","ethereum","substrate"],github:"substrate-balance-graph",customjs:["https://www.shawntabrizi.com/substrate-balance-graph/polkadot.js"]},i=void 0,r={permalink:"/blog/substrate/porting-web3-js-to-polkadot-js/",source:"@site/blog/2020-01-12-porting-web3-js-to-polkadot-js.md",title:"Porting Web3.js to Polkadot.js",description:"In this post, I will go over the changes I needed to make in order to port a Web3.js based Ethereum web app I had previously blogged about to use Polkadot.js and Substrate.",date:"2020-01-12T00:00:00.000Z",tags:[{inline:!0,label:"javascript",permalink:"/blog/tags/javascript"},{inline:!0,label:"front-end",permalink:"/blog/tags/front-end"},{inline:!0,label:"balance",permalink:"/blog/tags/balance"},{inline:!0,label:"graph",permalink:"/blog/tags/graph"},{inline:!0,label:"plotly.js",permalink:"/blog/tags/plotly-js"},{inline:!0,label:"ethereum",permalink:"/blog/tags/ethereum"},{inline:!0,label:"substrate",permalink:"/blog/tags/substrate"}],readingTime:9.265,hasTruncateMarker:!1,authors:[{name:"Shawn Tabrizi",title:"Software Engineer",url:"https://github.com/shawntabrizi",imageURL:"https://github.com/shawntabrizi.png",key:"shawntabrizi",page:null}],frontMatter:{title:"Porting Web3.js to Polkadot.js",date:"2020-01-12T00:00:00.000Z",authors:"shawntabrizi",slug:"/substrate/porting-web3-js-to-polkadot-js/",categories:["Substrate"],tags:["javascript","front-end","balance","graph","plotly.js","ethereum","substrate"],github:"substrate-balance-graph",customjs:["https://www.shawntabrizi.com/substrate-balance-graph/polkadot.js"]},unlisted:!1,prevItem:{title:"Substrate Weights and Fees",permalink:"/blog/substrate/substrate-weight-and-fees/"},nextItem:{title:"Substrate Storage Deep Dive",permalink:"/blog/substrate/substrate-storage-deep-dive/"}},l={authorsImageUrls:[void 0]},c=[{value:"In this post, I will go over the changes I needed to make in order to port a Web3.js based Ethereum web app I had previously blogged about to use Polkadot.js and Substrate.",id:"in-this-post-i-will-go-over-the-changes-i-needed-to-make-in-order-to-port-a-web3js-based-ethereum-web-app-i-had-previously-blogged-about-to-use-polkadotjs-and-substrate",level:5},{value:"Creating a Polkadot.js Bundle",id:"creating-a-polkadotjs-bundle",level:2},{value:"Connecting to a Node",id:"connecting-to-a-node",level:2},{value:"Querying the Node",id:"querying-the-node",level:2},{value:"Keeping it Async",id:"keeping-it-async",level:2},{value:"Final Thoughts",id:"final-thoughts",level:2}];function d(e){const t={a:"a",code:"code",em:"em",h2:"h2",h5:"h5",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.h5,{id:"in-this-post-i-will-go-over-the-changes-i-needed-to-make-in-order-to-port-a-web3js-based-ethereum-web-app-i-had-previously-blogged-about-to-use-polkadotjs-and-substrate",children:["In this post, I will go over the changes I needed to make in order to port a Web3.js based Ethereum web app I had ",(0,a.jsx)(t.a,{href:"/blog/ethereum/graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js/",children:"previously blogged about"})," to use Polkadot.js and Substrate."]}),"\n",(0,a.jsx)(t.p,{children:'Almost 2 years ago, I was still on my journey learning about Ethereum, when I built a simple web application using Web3.js. At the time, there was a spawn of viral "ponzi scheme" smart contracts, and I wanted to see how these dApps grew and eventually crashed over time.'}),"\n",(0,a.jsxs)(t.p,{children:["Check out my previous blog post about ",(0,a.jsx)(t.a,{href:"/blog/ethereum/graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js/",children:"Graphing ETH Balance History of an Ethereum Address using Parallel Asynchronous Requests in Web3.js"})," to learn more."]}),"\n",(0,a.jsxs)(t.p,{children:["Since the launch of ",(0,a.jsx)(t.a,{href:"https://kusama.network/",children:"Kusama"}),", there has been a lot more activity around actually ",(0,a.jsx)(t.em,{children:"using"})," Substrate, specifically among the validator/nominator community. I wanted to take a look at the my nomination rewards over time, and to do that, I basically needed to rebuild this same application, but using Polkadot.js... (",(0,a.jsx)(t.a,{href:"https://www.shawntabrizi.com/substrate-balance-graph/",children:"sneak peek"}),")"]}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"Before and after screenshot of Web3 to Polkadot port",src:n(48635).Z+"",width:"1086",height:"467"})}),"\n",(0,a.jsxs)(t.p,{children:["Here is ",(0,a.jsx)(t.strong,{children:"that"})," journey."]}),"\n",(0,a.jsx)(t.h2,{id:"creating-a-polkadotjs-bundle",children:"Creating a Polkadot.js Bundle"}),"\n",(0,a.jsxs)(t.p,{children:["The first issue I ran into when trying to migrate from Web3.js to Polkadot.js was generating a standalone JavaScript bundle so I can simply include the dependencies into my barebones project. At the moment, Polkadot.js does not provide an official bundle, but it is easy enough to create with ",(0,a.jsx)(t.a,{href:"http://browserify.org/",children:"browserify"}),"."]}),"\n",(0,a.jsxs)(t.p,{children:["Assuming you already have ",(0,a.jsx)(t.code,{children:"npm"}),", here are those steps:"]}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsx)(t.p,{children:"Install browserify:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"npm install -g browserify\n"})}),"\n"]}),"\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsx)(t.p,{children:"Create a new NodeJS project:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"mkdir temp\ncd temp\nnpm init\n# lots of interaction here, doesn't matter what you select\n"})}),"\n"]}),"\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsxs)(t.p,{children:["Add the Polkadot.js dependencies (I use ",(0,a.jsx)(t.code,{children:"@beta"}),", but the exact versions to use may change over time):"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"npm install @polkadot/api@beta\nnpm install @polkadot/util@beta\nnpm install @polkadot/util-crypto@beta\nnpm install @polkadot/keyring@beta\n"})}),"\n",(0,a.jsxs)(t.p,{children:["You should have a ",(0,a.jsx)(t.code,{children:"package.json"})," that looks like:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-json",children:'"dependencies": {\n  "@polkadot/api": "^1.0.0-beta.7",\n  "@polkadot/keyring": "^2.0.0-beta.4",\n  "@polkadot/util": "^2.0.0-beta.4",\n  "@polkadot/util-crypto": "^2.0.0-beta.4"\n}\n'})}),"\n"]}),"\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsxs)(t.p,{children:["Create a simple file which exports these libraries into the ",(0,a.jsx)(t.code,{children:"window"})," object:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'// In a file named `dependencies.js`\nlet api = require("@polkadot/api");\nlet util = require("@polkadot/util");\nlet util_crypto = require("@polkadot/util-crypto");\nlet keyring = require("@polkadot/keyring");\n\nwindow.api = api;\nwindow.util = util;\nwindow.util_crypto = util_crypto;\nwindow.keyring = keyring;\n'})}),"\n"]}),"\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsxs)(t.p,{children:["Create the ",(0,a.jsx)(t.code,{children:"polkadot.js"})," bundle:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"browserify dependencies.js > polkadot.js\n"})}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(t.p,{children:["You should now have a ",(0,a.jsx)(t.code,{children:"polkadot.js"})," file that you can include into any HTML page and will export ",(0,a.jsx)(t.code,{children:"api"}),", ",(0,a.jsx)(t.code,{children:"util"}),", ",(0,a.jsx)(t.code,{children:"util_crypto"}),", and ",(0,a.jsx)(t.code,{children:"keyring"})," commands."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<script src="polkadot.js"><\/script>\n'})}),"\n",(0,a.jsx)(t.p,{children:"Actually, you can find it on this page too! Just open your browser console and try any of these commands."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'util_crypto.blake2AsHex("Hello, World!") >\n  "0x511bc81dde11180838c562c82bb35f3223f46061ebde4a955c27b3f489cf1e03";\n'})}),"\n",(0,a.jsxs)(t.p,{children:["If you don't want to follow these steps, feel free to grab the ",(0,a.jsx)(t.code,{children:"polkadot.js"})," bundle I created at: ",(0,a.jsx)(t.a,{href:"https://github.com/shawntabrizi/substrate-balance-graph",children:"shawntabrizi/substrate-balance-graph"}),"."]}),"\n",(0,a.jsx)(t.h2,{id:"connecting-to-a-node",children:"Connecting to a Node"}),"\n",(0,a.jsxs)(t.p,{children:["As a front-end developer, I am not so interested in setting up a local node, to get my app to work. In the Web3.js world, I would use Metamask + a dedicated infura node. From my Ethereum web app ",(0,a.jsx)(t.a,{href:"https://github.com/shawntabrizi/ethgraph",children:"(ethgraph)"}),":"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-js",children:'// Check for MetaMask, otherwise use an HTTP Provider\nwindow.addEventListener("load", function () {\n  if (typeof web3 !== "undefined") {\n    console.log("Web3 Detected! " + web3.currentProvider.constructor.name);\n    window.web3 = new Web3(web3.currentProvider);\n  } else {\n    console.log("No Web3 Detected... using HTTP Provider");\n    window.web3 = new Web3(\n      new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>")\n    );\n  }\n});\n'})}),"\n",(0,a.jsxs)(t.p,{children:["The ",(0,a.jsx)(t.a,{href:"https://github.com/polkadot-js/extension",children:"polkadot-js/extension"}),' does not inject a WebSocket provider automatically, so we can skip the "detected" step, and just connect when we know we are not connected. Substrate is also not just a platform for ',(0,a.jsx)(t.em,{children:"one"})," chain, but many chains, so I wanted to also support the user user customizable endpoints."]}),"\n",(0,a.jsxs)(t.p,{children:["I created a ",(0,a.jsx)(t.code,{children:"connect"})," function which looks like this:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-js",children:'// Connect to Substrate endpoint\nasync function connect() {\n  let endpoint = document.getElementById("endpoint").value;\n  if (!window.substrate || global.endpoint != endpoint) {\n    const provider = new api.WsProvider(endpoint);\n    document.getElementById("output").innerHTML = "Connecting to Endpoint...";\n    window.substrate = await api.ApiPromise.create({ provider });\n    global.endpoint = endpoint;\n    document.getElementById("output").innerHTML = "Connected";\n  }\n}\n'})}),"\n",(0,a.jsx)(t.p,{children:"You can see I keep track of two global properties:"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"window.substrate"})," - This will be my WebSocket provider and how I access the Polkadot.js APIs. If it already exists, I am already connected!"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.code,{children:"window.global.endpoint"})," - This is a global variable I created to keep track of the current endpoint I am connected to."]}),"\n"]}),"\n",(0,a.jsxs)(t.p,{children:["When I call ",(0,a.jsx)(t.code,{children:"connect"}),", it will make sure I am connected to the endpoint I want based on the input of the ",(0,a.jsx)(t.code,{children:"endpoint"})," element on the HTML page. For a network like Kusama, this endpoint would be something like:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"wss://kusama-rpc.polkadot.io/\n"})}),"\n",(0,a.jsx)(t.h2,{id:"querying-the-node",children:"Querying the Node"}),"\n",(0,a.jsxs)(t.p,{children:["At the time of creating ",(0,a.jsx)(t.code,{children:"ethgraph"}),", Web3.js did not support ",(0,a.jsx)(t.code,{children:"async"}),"/",(0,a.jsx)(t.code,{children:"await"}),". Instead, ",(0,a.jsx)(t.a,{href:"/blog/ethereum/making-web3-js-work-asynchronously-javascript-promises-await/",children:'I wrapped everything in a "promisify" wrapper'}),". Fortunately, Polkadot.js supports this natively, so you can query every API easily and ergonomically with a promise."]}),"\n",(0,a.jsx)(t.p,{children:"For example, here is how we can get the balance of a user:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'let balance = await substrate.query.balances.freeBalance(\n  "EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo"\n);\nbalance.toNumber() > 2116624633061757;\n'})}),"\n",(0,a.jsx)(t.p,{children:"To provide all the functionality of the Ethereum version of this app, I also need to query the timestamp of a block. Ethereum would include this in the block header, but we know that Substrate has no such requirements, and instead provides this through another runtime module:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'let timestamp = await substrate.query.timestamp.now();\nDate(timestamp) >\n  "Wed Jan 15 2020 22:42:37 GMT+0100 (Central European Standard Time)";\n'})}),"\n",(0,a.jsxs)(t.p,{children:["Great! But how do we get the ",(0,a.jsx)(t.em,{children:"historical"})," information?"]}),"\n",(0,a.jsx)(t.p,{children:"In Ethereum, we could just provide the block number directly into the query:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:"web3.eth.getBalance(address, blockNumber, function () {\n  /*callback*/\n});\n"})}),"\n",(0,a.jsxs)(t.p,{children:["In Polkadot.js we need to use the ",(0,a.jsx)(t.code,{children:".at(hash, <PARAMS>)"})," API, which extends all the Substrate queries. ",(0,a.jsx)(t.code,{children:"hash"})," here is the block hash of the block that I want to get the information for. To get the block hash, I need to make an RPC call through the Polkadot.js API:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'let blockHash = await substrate.rpc.chain.getBlockHash(100);\nblockHash.toString() >\n  "0x46781d9a3350a0e02dbea4b5e7aee7c139331a65b2cd736bb45a824c2f3ffd1a";\n'})}),"\n",(0,a.jsx)(t.p,{children:"So all together now:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:'let balance_100 = await substrate.query.balances.freeBalance.at(\n  "0x46781d9a3350a0e02dbea4b5e7aee7c139331a65b2cd736bb45a824c2f3ffd1a",\n  "EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo"\n);\nbalance_100.toNumber() > 10000000000;\n'})}),"\n",(0,a.jsx)(t.p,{children:"You can see I gained quite a bit of free balance since block 0! :)"}),"\n",(0,a.jsx)(t.h2,{id:"keeping-it-async",children:"Keeping it Async"}),"\n",(0,a.jsx)(t.p,{children:"So we have all the pieces to be able convert our old queries into the new ones. However, if we do things naively, we will run into a trap which was warned about in my last blog post."}),"\n",(0,a.jsx)(t.p,{children:"Can you guess?"}),"\n",(0,a.jsx)(t.p,{children:"Let's take a look how a naive conversion between Web3.js to Polkadot.js would look like:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsx)(t.p,{children:"Original Web3.js Code"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:"// Loop over the blocks, using the step value\nfor (let i = startBlock; i < endBlock; i = i + step) {\n  // If we already have data about that block, skip it\n  if (!global.balances.find((x) => x.block == i)) {\n    // Create a promise to query the ETH balance for that block\n    let balancePromise = promisify((cb) =>\n      web3.eth.getBalance(address, i, cb)\n    );\n    // Create a promise to get the timestamp for that block\n    let timePromise = promisify((cb) => web3.eth.getBlock(i, cb));\n    // Push data to a linear array of promises to run in parellel.\n    promises.push(i, balancePromise, timePromise);\n  }\n}\n"})}),"\n"]}),"\n",(0,a.jsxs)(t.li,{children:["\n",(0,a.jsx)(t.p,{children:"Naive Polkadot.js Code"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:"// Loop over the blocks, using the step value\nfor (let i = startBlock; i < endBlock; i = i + step) {\n  // If we already have data about that block, skip it\n  if (!global.balances.find((x) => x.block == i)) {\n    // Get the block hash\n    let blockHash = await substrate.rpc.chain.getBlockHash(i);\n    // Create a promise to query the balance for that block\n    let freeBalancePromise = substrate.query.balances.freeBalance.at(\n      blockHash,\n      address\n    );\n    // Create a promise to get the timestamp for that block\n    let timePromise = substrate.query.timestamp.now.at(blockHash);\n    // Push data to a linear array of promises to run in parellel.\n    promises.push(i, freeBalancePromise, timePromise);\n  }\n}\n"})}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(t.p,{children:["First, we should call out how incredibly similar the two code blocks look. The naive update is ",(0,a.jsx)(t.em,{children:"totally"})," working, and really we did not have to change our app at all! But if you are trying this at home, you might notice the app is running pretty slow... over 30 seconds to fetch the data needed to create the graph!"]}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"Image before parallel async",src:n(54660).Z+"",width:"2880",height:"1800"})}),"\n",(0,a.jsxs)(t.p,{children:["The point of this loop was to collect all the queries and run them asynchronously. As mentioned in the last blog post, this provides a huge boost in performance since we are not waiting for each response to move onto the next one. However, this naive conversion sticks an ",(0,a.jsx)(t.code,{children:"await"})," right in the middle of the loop, and this causes us to serialize querying for all the blocks, and slow down the entire processes."]}),"\n",(0,a.jsx)(t.p,{children:"To solve this, we want to also query all the block hashes for the blocks we need in parallel, but in a separate loop, because we need to know the hash before we can make the next query."}),"\n",(0,a.jsx)(t.p,{children:"The improved solution looks like:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-javascript",children:"var promises = [];\n\n// Get all block hashes\nfor (let i = startBlock; i < endBlock; i = i + step) {\n  // If we already have data about that block, skip it.\n  if (!global.blockHashes.find((x) => x.block == i)) {\n    let blockHashPromise = substrate.rpc.chain.getBlockHash(i);\n    promises.push(i, blockHashPromise);\n  }\n}\n\n// Call all promises in parallel for speed\nvar results = await Promise.all(promises);\n\n// Save block hashes globally so we don't query them again if we don't need to.\nfor (let i = 0; i < results.length; i = i + 2) {\n  global.blockHashes.push({\n    block: results[i],\n    hash: results[i + 1],\n  });\n}\n\nvar promises = [];\n\n// Loop over the blocks, using the step value\nfor (let i = startBlock; i < endBlock; i = i + step) {\n  // If we already have data about that block, skip it\n  if (!global.balances.find((x) => x.block == i)) {\n    // Get the block hash\n    let blockHash = global.blockHashes.find((x) => x.block == i).hash;\n    // Create a promise to query the balance for that block\n    let freeBalancePromise = substrate.query.balances.freeBalance.at(\n      blockHash,\n      address\n    );\n    // Create a promise to get the timestamp for that block\n    let timePromise = substrate.query.timestamp.now.at(blockHash);\n    // Push data to a linear array of promises to run in parellel.\n    promises.push(i, freeBalancePromise, timePromise);\n  }\n}\n\n// Call all promises in parallel for speed\nvar results = await Promise.all(promises);\n\nconsole.log(\"Results:\", results);\n"})}),"\n",(0,a.jsx)(t.p,{children:"This generates a graph for us in under 2 seconds!"}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"Image after parallel async",src:n(6334).Z+"",width:"2880",height:"1800"})}),"\n",(0,a.jsx)(t.p,{children:"Much better, and what you would expect from a modern web application! But here we don't have a traditional database, just a blockchain."}),"\n",(0,a.jsx)(t.h2,{id:"final-thoughts",children:"Final Thoughts"}),"\n",(0,a.jsxs)(t.p,{children:["You can play with the final application here: ",(0,a.jsx)(t.a,{href:"https://www.shawntabrizi.com/substrate-balance-graph/",children:"https://www.shawntabrizi.com/substrate-balance-graph/"})]}),"\n",(0,a.jsx)(t.p,{children:"After this exercise it has become clear to me that porting existing web applications built with Web3.js to Polkadot.js is trivial. Additionally, I already have a ton of experience with Substrate runtime development, so I already know how easy it will be to take existing smart contracts and build them on Substrate, maybe even better than before."}),"\n",(0,a.jsx)(t.p,{children:"With that in mind, it won't be long until we see a wave of existing dApps joining Substrate/Polkadot, taking advantage of all the next generation features without making any compromises toward their existing functionality. The future seems bright overall, and I am excited to be at the forefront."}),"\n",(0,a.jsxs)(t.p,{children:["As always, if you like the content I create, stop by my ",(0,a.jsx)(t.a,{href:"https://shawntabrizi.com/donate/",children:"donations page"})," and say thanks!"]})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},6334:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/substrate-balance-graph-after-57e92e045e9f6bc0ea73590fa39d5e2a.png"},54660:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/substrate-balance-graph-before-fb6d71a5855ded8244bfdc86226ab570.png"},48635:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/substrate-balance-graph-hero-52698f197d2068bbeede1cb39a98859f.png"},11151:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>i});var a=n(67294);const s={},o=a.createContext(s);function i(e){const t=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),a.createElement(o.Provider,{value:t},e.children)}}}]);