"use strict";(self.webpackChunkshawntabrizi=self.webpackChunkshawntabrizi||[]).push([[1139],{32828:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>c,frontMatter:()=>i,metadata:()=>s,toc:()=>h});var a=n(85893),r=n(11151);const i={title:'Ethereum and Web3.js "Hello World": Get the ETH Balance of an Ethereum Address',date:new Date("2017-11-02T18:19:09.000Z"),authors:"shawntabrizi",slug:"/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/",categories:["Ethereum"],tags:["blockchain","ethereum","html","javascript","web3"],github:"ETH-Balance"},o=void 0,s={permalink:"/blog/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/",source:"@site/blog/2017-11-02-ethereum-web3-js-hello-world-get-eth-balance-ethereum-address.md",title:'Ethereum and Web3.js "Hello World": Get the ETH Balance of an Ethereum Address',description:"Using just 41 lines of HTML + JS, we create a Web3.JS application which can get the ETH Balance of an Ethereum Address [Final Result] [GitHub]",date:"2017-11-02T18:19:09.000Z",tags:[{inline:!0,label:"blockchain",permalink:"/blog/tags/blockchain"},{inline:!0,label:"ethereum",permalink:"/blog/tags/ethereum"},{inline:!0,label:"html",permalink:"/blog/tags/html"},{inline:!0,label:"javascript",permalink:"/blog/tags/javascript"},{inline:!0,label:"web3",permalink:"/blog/tags/web-3"}],readingTime:7.675,hasTruncateMarker:!1,authors:[{name:"Shawn Tabrizi",title:"Software Engineer",url:"https://github.com/shawntabrizi",imageURL:"https://github.com/shawntabrizi.png",key:"shawntabrizi",page:null}],frontMatter:{title:'Ethereum and Web3.js "Hello World": Get the ETH Balance of an Ethereum Address',date:"2017-11-02T18:19:09.000Z",authors:"shawntabrizi",slug:"/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/",categories:["Ethereum"],tags:["blockchain","ethereum","html","javascript","web3"],github:"ETH-Balance"},unlisted:!1,prevItem:{title:'Correcting the Ethereum and Web3.js "Hello World"',permalink:"/blog/ethereum/correcting-ethereum-web3-js-hello-world/"},nextItem:{title:"Getting started with Ethereum Wallet",permalink:"/blog/ethereum/getting-started-ethereum-wallet/"}},l={authorsImageUrls:[void 0]},h=[{value:"Using just 41 lines of HTML + JS, we create a Web3.JS application which can get the ETH Balance of an Ethereum Address [Final Result] [GitHub]",id:"using-just-41-lines-of-html--js-we-create-a-web3js-application-which-can-get-the-eth-balance-of-an-ethereum-address-final-result-github",level:5},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Let&#39;s get started!",id:"lets-get-started",level:2},{value:"HTML Body",id:"html-body",level:3},{value:"HTML Head: JavaScript and Web3",id:"html-head-javascript-and-web3",level:3}];function d(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",h5:"h5",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.h5,{id:"using-just-41-lines-of-html--js-we-create-a-web3js-application-which-can-get-the-eth-balance-of-an-ethereum-address-final-result-github",children:["Using just 41 lines of HTML + JS, we create a Web3.JS application which can get the ETH Balance of an Ethereum Address ",(0,a.jsx)(t.a,{href:"https://shawntabrizi.com/ethbalance/",children:"[Final Result]"})," ",(0,a.jsx)(t.a,{href:"https://github.com/shawntabrizi/ETH-Balance",children:"[GitHub]"})]}),"\n",(0,a.jsx)(t.p,{children:"For me, the hardest part of learning new technical skills is overcoming the hurdle of simply getting started. The Ethereum development space is booming, and the ability to make relatively simple web applications that interact with the Ethereum blockchain is at a premium. Today, development on World Wide Web requires you to compete with a huge number of fully developed, feature rich applications, where it is very unlikely that you are actually contributing value. However, the same is absolutely not true for Ethereum and blockchain as a whole. There are so many utilities and tools that can bring value to this ecosystem, all with relatively low feature requirements."}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.strong,{children:'So let\'s overcome the first barrier by building a "Hello World" application.'})}),"\n",(0,a.jsx)(t.p,{children:"From my perspective, the perfect project for something like this would be a bare-bones single-page application which fetches the ETH balance of an Ethereum address. This is about as simple as it gets to allow a user to interact with the blockchain, and thanks to Web3.js, it is also really simple to implement!"}),"\n",(0,a.jsx)(t.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,a.jsx)(t.p,{children:"To gain access to the Ethereum network, you will need to gain access to a Web3 Provider. As I will talk about more below, this comes natively with certain Ethereum focused browsers, but for the average user you will need to provide them with their own gateway to the blockchain. Basically, you need someone to provide your app the data that is actually on the blockchain, and Web3.js has the ability to interact directly with an HTTP Provider to bring you this data with minimal effort."}),"\n",(0,a.jsxs)(t.p,{children:["I used ",(0,a.jsx)(t.a,{href:"https://infura.io/",children:"Infura.io"})," as my Ethereum provider (for no other reason than they showed up first when searching), and after spending less than a minute registering with them for free, I was given my unique address to their Main Ethereum Network where my API Key was appended at the end."]}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{src:n(67670).Z+"",width:"1260",height:"419"})}),"\n",(0,a.jsx)(t.p,{children:"Save this URL, as you will be using it very shortly."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"https://mainnet.infura.io/<apikey>\n"})}),"\n",(0,a.jsxs)(t.p,{children:["The only other thing you need to get started is your own copy of Web3.js which can be ",(0,a.jsx)(t.a,{href:"https://github.com/ethereum/web3.js",children:"found on GitHub"}),". Just download and unpack the ZIP file."]}),"\n",(0,a.jsxs)(t.p,{children:["Create a new folder where you want your project to live, and create an ",(0,a.jsx)(t.code,{children:"index.html"})," file. Then, from the Web3.js download, copy ",(0,a.jsx)(t.code,{children:"web3.min.js"})," to that folder."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"ethbalance/     (folder)\n\u251c\u2500\u2500 index.html\n\u2514\u2500\u2500 web3.min.js\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Finally, make sure you initialize your ",(0,a.jsx)(t.code,{children:"index.html"})," skeleton:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<!doctype html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n  </head>\n\n  <body></body>\n</html>\n'})}),"\n",(0,a.jsx)(t.h2,{id:"lets-get-started",children:"Let's get started!"}),"\n",(0,a.jsx)(t.p,{children:"To make this as simple as possible, we are going to create a single HTML file which will contain all the code necessary to complete this project. It will be broken into 2 parts:"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"HTML to render a bare-bones web page"}),"\n",(0,a.jsx)(t.li,{children:"JavaScript to initialize a Web3 object, and interact with our HTTP Provider"}),"\n"]}),"\n",(0,a.jsx)(t.h3,{id:"html-body",children:"HTML Body"}),"\n",(0,a.jsx)(t.p,{children:"Our HTML body needs a text field for the user to input an Ethereum address, a button to trigger the JavaScript, and an output area to display the result. I am going to assume that if you are reading this post, you have enough familiarity with HTML that I can just breeze over this, and give you the code:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<body>\n  <h1>ETH Balance Fetcher</h1>\n  <p>Enter your Ethereum Address:</p>\n  <input type="text" size="50" id="address" />\n  <button type="button" onClick="getBalance();">Get Balance</button>\n  <br />\n  <br />\n  <div id="output"></div>\n</body>\n'})}),"\n",(0,a.jsxs)(t.p,{children:["The only thing of note here is that when you click the button we created, it triggers a JavaScript function ",(0,a.jsx)(t.code,{children:"getBalance()"}),", and that is what we are going to write next!"]}),"\n",(0,a.jsx)(t.h3,{id:"html-head-javascript-and-web3",children:"HTML Head: JavaScript and Web3"}),"\n",(0,a.jsx)(t.p,{children:"Now it is time to prepare the JavaScript required to make this all work. We are going to need to get the Ethereum address inputted by the user, initiate our connection to the Ethereum Provider, and then query the blockchain for the ETH balance at that address. Oh, of course we will also send back the result and update the HTML with the value. Here is our HTML head template:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:"<head>\n  \x3c!-- Check if Web3 already defined --\x3e\n  \x3c!-- If not, connect to HTTP Provider --\x3e\n  \x3c!-- getBalance() function --\x3e\n</head>\n"})}),"\n",(0,a.jsxs)(t.p,{children:["First we will load and set up our Web3 provider. If you are using an Ethereum compatible browser like ",(0,a.jsx)(t.a,{href:"https://brave.com/",children:"Brave"}),", Chrome + ",(0,a.jsx)(t.a,{href:"https://metamask.io/",children:"MetaMask"}),", or ",(0,a.jsx)(t.a,{href:"https://github.com/ethereum/mist/releases",children:"Mist"}),", you will already have your own Web3 provider established natively. You can access that connection with this:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<head>\n  <meta charset="UTF-8" />\n  <script type="text/javascript" src="./web3.min.js"><\/script>\n  <script type="text/javascript">\n    window.addEventListener("load", function () {\n      if (typeof web3 !== "undefined") {\n        console.log("Web3 Detected! " + web3.currentProvider.constructor.name);\n        window.web3 = new Web3(web3.currentProvider);\n      }\n    });\n\n    \x3c!-- If not, connect to HTTP Provider --\x3e\n    \x3c!-- getBalance() function --\x3e\n  <\/script>\n</head>\n'})}),"\n",(0,a.jsx)(t.p,{children:"More likely, the user does not have one of these browsers, so we need to establish our own connection to the Ethereum network. We can do this with the URL that you saved earlier from Infura.io, and establishing an HTTP Provider:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<head>\n  <meta charset="UTF-8" />\n  <script type="text/javascript" src="./web3.min.js"><\/script>\n  <script type="text/javascript">\n    window.addEventListener("load", function () {\n      if (typeof web3 !== "undefined") {\n        console.log("Web3 Detected! " + web3.currentProvider.constructor.name);\n        window.web3 = new Web3(web3.currentProvider);\n      } else {\n        console.log("No Web3 Detected... using HTTP Provider");\n        window.web3 = new Web3(\n          new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>")\n        );\n      }\n    });\n\n    \x3c!-- getBalance() function --\x3e\n  <\/script>\n</head>\n'})}),"\n",(0,a.jsxs)(t.p,{children:["At this point, we can do just about anything that Web3.js offers, but for our purposes we only need to query the blockchain for the address, and return the ETH balance. So let's set up our ",(0,a.jsx)(t.code,{children:"getBalance()"})," function:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<head>\n  <meta charset="UTF-8" />\n  <script type="text/javascript" src="./web3.min.js"><\/script>\n  <script type="text/javascript">\n    window.addEventListener("load", function () {\n      if (typeof web3 !== "undefined") {\n        console.log("Web3 Detected! " + web3.currentProvider.constructor.name);\n        window.web3 = new Web3(web3.currentProvider);\n      } else {\n        console.log("No Web3 Detected... using HTTP Provider");\n        window.web3 = new Web3(\n          new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>")\n        );\n      }\n    });\n    function getBalance() {\n      var address, wei, balance;\n      address = document.getElementById("address").value;\n      try {\n        web3.eth.getBalance(address, function (error, wei) {\n          if (!error) {\n            var balance = web3.fromWei(wei, "ether");\n            document.getElementById("output").innerHTML = balance + " ETH";\n          }\n        });\n      } catch (err) {\n        document.getElementById("output").innerHTML = err;\n      }\n    }\n  <\/script>\n</head>\n'})}),"\n",(0,a.jsx)(t.p,{children:"Walking through the function:"}),"\n",(0,a.jsxs)(t.p,{children:["First we store the value of the text field from our HTML page into the ",(0,a.jsx)(t.code,{children:"address"})," variable. Then, we will ",(0,a.jsx)(t.code,{children:"try"})," to use the ",(0,a.jsx)(t.code,{children:"web3"})," object we initialized earlier to call the function ",(0,a.jsx)(t.code,{children:"web3.eth.getBalance()"})," which accepts an Ethereum Address as an input. Note that we need to make this call asynchronously as the user does not have the full blockchain loaded on their machine, so some calls may run slow. Rather than lock the user's interface, we let the the call happen in the background, and when it is complete, we trigger an update to the page. This is ",(0,a.jsx)(t.a,{href:"https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#dizzy-all-async---think-of-metamask-as-a-light-client",children:"required to support MetaMask"}),", but benefits all Web3 applications. If you want to learn more about how to make these requests asynchronous, take a look at the ",(0,a.jsx)(t.a,{href:"https://github.com/ethereum/wiki/wiki/JavaScript-API#using-callbacks",children:'"Using callbacks" section'})," in the Web3 documentation."]}),"\n",(0,a.jsxs)(t.p,{children:["Once the asynchronous request is complete, we will get back a Wei balance as a result. But we want the Ether value, so we do one last step to convert the value: ",(0,a.jsx)(t.code,{children:"web3.fromWei(wei, 'ether')"}),". If all of this is successful, we update the ",(0,a.jsx)(t.code,{children:"output"})," div with our result, otherwise if it fails at any point we ",(0,a.jsx)(t.code,{children:"catch"})," the error, and output that message instead."]}),"\n",(0,a.jsxs)(t.p,{children:["Here is the final ",(0,a.jsx)(t.code,{children:"index.html"})," file which you should be able to use as soon as you paste in your ",(0,a.jsx)(t.code,{children:"apikey"})," from Infura.io. You can also download this project directly from my ",(0,a.jsx)(t.a,{href:"https://github.com/shawntabrizi/ETH-Balance",children:"GitHub"}),"."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-html",children:'<!doctype html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n    <script type="text/javascript" src="./web3.min.js"><\/script>\n    <script type="text/javascript">\n      window.addEventListener("load", function () {\n        if (typeof web3 !== "undefined") {\n          console.log(\n            "Web3 Detected! " + web3.currentProvider.constructor.name\n          );\n          window.web3 = new Web3(web3.currentProvider);\n        } else {\n          console.log("No Web3 Detected... using HTTP Provider");\n          window.web3 = new Web3(\n            new Web3.providers.HttpProvider(\n              "https://mainnet.infura.io/<APIKEY>"\n            )\n          );\n        }\n      });\n      function getBalance() {\n        var address, wei, balance;\n        address = document.getElementById("address").value;\n        try {\n          web3.eth.getBalance(address, function (error, wei) {\n            if (!error) {\n              var balance = web3.fromWei(wei, "ether");\n              document.getElementById("output").innerHTML = balance + " ETH";\n            }\n          });\n        } catch (err) {\n          document.getElementById("output").innerHTML = err;\n        }\n      }\n    <\/script>\n  </head>\n  <body>\n    <h1>ETH Balance Fetcher</h1>\n    <p>Enter your Ethereum Address:</p>\n    <input type="text" size="50" id="address" />\n    <button type="button" onClick="getBalance();">Get Balance</button>\n    <br />\n    <br />\n    <div id="output"></div>\n  </body>\n</html>\n'})}),"\n",(0,a.jsxs)(t.p,{children:["You can try this out right now using the version I hosted here: ",(0,a.jsx)(t.a,{href:"https://shawntabrizi.com/ethbalance/",children:"https://shawntabrizi.com/ethbalance/"})]}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{src:n(8957).Z+"",width:"542",height:"282"})}),"\n",(0,a.jsx)(t.p,{children:"One thing you should note is that this is a client-side JavaScript application. There are a million reasons why making client-side apps is so much easier for development, but one big downside is that your API key will be exposed to anyone who simply inspects the HTML. Please do not abuse my API key, and please do not ship a production application using a method like this unless you are prepared to get your API key terminated."}),"\n",(0,a.jsxs)(t.p,{children:["Note that I have made updates to this blog post, correcting some issues regarding best practices with Web3. You can learn more about the errors I made along the way ",(0,a.jsx)(t.a,{href:"https://shawntabrizi.com/ethereum/correcting-ethereum-web3-js-hello-world/",children:"here"}),"."]}),"\n",(0,a.jsxs)(t.p,{children:["I hope this helps you get started with developing for Ethereum using Web3.js! If you liked this content, and want to support me, feel free to ",(0,a.jsx)(t.a,{href:"https://shawntabrizi.com/donate/",children:"send a donation"}),"."]})]})}function c(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},67670:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/img_59fad787df3db-df77edef4bc52d6bae8bd91f7171571e.png"},8957:(e,t,n)=>{n.d(t,{Z:()=>a});const a="data:image/png;base64,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"},11151:(e,t,n)=>{n.d(t,{Z:()=>s,a:()=>o});var a=n(67294);const r={},i=a.createContext(r);function o(e){const t=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),a.createElement(i.Provider,{value:t},e.children)}}}]);