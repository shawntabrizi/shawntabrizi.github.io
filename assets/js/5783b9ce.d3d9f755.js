"use strict";(self.webpackChunkshawntabrizi=self.webpackChunkshawntabrizi||[]).push([[84030],{35815:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>h,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var o=n(85893),r=n(11151);const a={title:'Correcting the Ethereum and Web3.js "Hello World"',date:new Date("2017-11-05T15:57:51.000Z"),authors:"shawntabrizi",slug:"/ethereum/correcting-ethereum-web3-js-hello-world/",categories:["Ethereum"],tags:["blockchain","ethereum","html","javascript","web3"]},s=void 0,i={permalink:"/blog/ethereum/correcting-ethereum-web3-js-hello-world/",source:"@site/blog/2017-11-05-correcting-ethereum-web3-js-hello-world.md",title:'Correcting the Ethereum and Web3.js "Hello World"',description:'Just 2 days ago I blogged about a quick project which I considered a "Hello World" application for Ethereum and Web3.js. However, I quickly learned that even in my short 31 lines of code, I made numerous mistakes which do not follow the best practices for developing Web3.js applications.',date:"2017-11-05T15:57:51.000Z",formattedDate:"November 5, 2017",tags:[{label:"blockchain",permalink:"/blog/tags/blockchain"},{label:"ethereum",permalink:"/blog/tags/ethereum"},{label:"html",permalink:"/blog/tags/html"},{label:"javascript",permalink:"/blog/tags/javascript"},{label:"web3",permalink:"/blog/tags/web-3"}],readingTime:3.625,hasTruncateMarker:!1,authors:[{name:"Shawn Tabrizi",title:"Software Engineer",url:"https://github.com/shawntabrizi",imageURL:"https://github.com/shawntabrizi.png",key:"shawntabrizi"}],frontMatter:{title:'Correcting the Ethereum and Web3.js "Hello World"',date:"2017-11-05T15:57:51.000Z",authors:"shawntabrizi",slug:"/ethereum/correcting-ethereum-web3-js-hello-world/",categories:["Ethereum"],tags:["blockchain","ethereum","html","javascript","web3"]},unlisted:!1,prevItem:{title:"Ethereum Token Contract ABI in Web3.js for ERC-20 and Human Standard Tokens",permalink:"/blog/ethereum/ethereum-token-contract-abi-web3-erc-20-human-standard-tokens/"},nextItem:{title:'Ethereum and Web3.js "Hello World": Get the ETH Balance of an Ethereum Address',permalink:"/blog/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/"}},h={authorsImageUrls:[void 0]},l=[{value:"Ethereum Browser Environment Check",id:"ethereum-browser-environment-check",level:2},{value:"Asynchronous calls to the Ethereum network",id:"asynchronous-calls-to-the-ethereum-network",level:2},{value:"The first, but certainly not last mistake...",id:"the-first-but-certainly-not-last-mistake",level:2}];function c(e){const t={a:"a",blockquote:"blockquote",code:"code",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(t.p,{children:["Just 2 days ago I ",(0,o.jsx)(t.a,{href:"https://shawntabrizi.com/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/",children:"blogged about a quick project"}),' which I considered a "Hello World" application for Ethereum and Web3.js. However, I quickly learned that even in my short 31 lines of code, I made numerous mistakes which do not follow the best practices for developing Web3.js applications.']}),"\n",(0,o.jsx)(t.p,{children:"The main part of the sample was the Web3.js stuff, which could be broken into two logical sections:"}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsx)(t.li,{children:"Establishing a Web3 Provider"}),"\n",(0,o.jsx)(t.li,{children:"Getting the ETH balance of an Ethereum Address"}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["Both of these sections had mistakes in my original code, and this post will show you how to fix them! I will be updating the main blog post to include these changes as well, but I wanted to document the subtleties of the changes, and what I have learned since then. BTW, all of these mistakes could be avoided if you read the ",(0,o.jsx)(t.a,{href:"https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check",children:"MetaMask developer documentation"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"ethereum-browser-environment-check",children:"Ethereum Browser Environment Check"}),"\n",(0,o.jsxs)(t.p,{children:["In my original sample, I simply depend on the Web3 HTTP Provider to access the Ethereum network. However, using ",(0,o.jsx)(t.a,{href:"https://metamask.io/",children:"MetaMask"})," or the ",(0,o.jsx)(t.a,{href:"https://github.com/ethereum/mist",children:"Mist Browser"}),", users will already have direct access to the Ethereum network through those providers, and do not need to use the HTTP Provider. As said in the ",(0,o.jsx)(t.a,{href:"https://github.com/ethereum/wiki/wiki/JavaScript-API#adding-web3",children:"Web3 JavaScript app API Documentation"}),":"]}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsx)(t.p,{children:"...you need to create a web3 instance, setting a provider. To make sure you don't overwrite the already set provider when in mist, check first if the web3 is available..."}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["To fix this, we mostly follow the ",(0,o.jsx)(t.a,{href:"https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check",children:"code sample"})," provided by MetaMask:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-javascript",children:'window.addEventListener("load", function () {\n  if (typeof web3 !== "undefined") {\n    console.log("Web3 Detected! " + web3.currentProvider.constructor.name);\n    window.web3 = new Web3(web3.currentProvider);\n  } else {\n    console.log("No Web3 Detected... using HTTP Provider");\n    window.web3 = new Web3(\n      new Web3.providers.HttpProvider("https://mainnet.infura.io/noapikey")\n    );\n  }\n});\n'})}),"\n",(0,o.jsx)(t.p,{children:"As they mention on the MetaMask developer documentation:"}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsxs)(t.p,{children:["Note that the environmental web3 check is wrapped in a ",(0,o.jsx)(t.code,{children:"window.addEventListener('load', ...)"})," handler. This approach avoids race conditions with web3 injection timing."]}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["With our new code, as soon as the page loads, we detect if the browser being used already has a Web3 provider set up, and if it does we use it! Otherwise, we will use the HTTP Provider from ",(0,o.jsx)(t.a,{href:"https://infura.io/",children:"Infura.io"}),". For most users, I would assume they do not have MetaMask, and thus this change is not very important; but it is certainly best practice, and I am happy to oblige."]}),"\n",(0,o.jsx)(t.p,{children:"Chrome with MetaMask:"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{src:n(39583).Z+"",width:"916",height:"279"})}),"\n",(0,o.jsx)(t.p,{children:"Firefox without Web3 Provider:"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{src:n(71042).Z+"",width:"1058",height:"250"})}),"\n",(0,o.jsx)(t.h2,{id:"asynchronous-calls-to-the-ethereum-network",children:"Asynchronous calls to the Ethereum network"}),"\n",(0,o.jsxs)(t.p,{children:["If you have been following along word for word, you might have copied the changes mentioned above, loaded it in your MetaMask enabled browser (",(0,o.jsx)(t.a,{href:"https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#globe_with_meridians-https---web-server-required",children:"from your web server"}),"), and tried to get your ETH balance... Here is what you will see:"]}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{src:n(51943).Z+"",width:"507",height:"345"})}),"\n",(0,o.jsx)(t.p,{children:"If we continue to read the MetaMask developer documentation, we would see the following:"}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsx)(t.p,{children:"The user does not have the full blockchain on their machine, so data lookups can be a little slow. For this reason, we are unable to support most synchronous methods."}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"This means we need to turn our call to get the ETH balance, which is currently a synchronous HTTP request, into an asynchronous request. We can do this by adding an error first callback as the last parameter of the function:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-javascript",children:'function getBalance() {\n  var address, wei, balance;\n  address = document.getElementById("address").value;\n  try {\n    web3.eth.getBalance(address, function (error, wei) {\n      if (!error) {\n        var balance = web3.fromWei(wei, "ether");\n        document.getElementById("output").innerHTML = balance + " ETH";\n      }\n    });\n  } catch (err) {\n    document.getElementById("output").innerHTML = err;\n  }\n}\n'})}),"\n",(0,o.jsx)(t.p,{children:"If we try to run this code now with MetaMask as our provider, everything works again!"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{src:n(64428).Z+"",width:"831",height:"333"})}),"\n",(0,o.jsx)(t.h2,{id:"the-first-but-certainly-not-last-mistake",children:"The first, but certainly not last mistake..."}),"\n",(0,o.jsxs)(t.p,{children:["Phew! We fixed our Hello World application! Take a look at the ",(0,o.jsx)(t.a,{href:"https://github.com/shawntabrizi/ETH-Balance/commit/daa8ac6c380c6f870807023e295d51a03a21edef",children:"overall changes on GitHub"}),". I think this goes to show how difficult it can be to learn things on your own, and some of the best practices that can be overlooked so easily. I hope that I am able to go through these issues so that you don't have to. If you find any other issues with this or future samples I create, please let me know!"]}),"\n",(0,o.jsxs)(t.p,{children:["Special shout out to ",(0,o.jsx)(t.a,{href:"https://www.reddit.com/r/ethdev/comments/7acshg/in_the_spirit_of_devcon3_build_your_first_web3js/dp9xdff/?utm_content=permalink&utm_medium=user&utm_source=reddit&utm_name=frontpage",children:"Reddit user JonnyLatte"})," for telling me the errors in my ways, and getting me to read more of the documentation around Web3!"]}),"\n",(0,o.jsxs)(t.p,{children:["As always, if you found this content helpful, feel free to check out my ",(0,o.jsx)(t.a,{href:"https://shawntabrizi.com/donate/",children:"donation page"}),"."]})]})}function d(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},71042:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/img_59feb7629ffba-6907067fda1184381de0876e1dcec344.png"},39583:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/img_59feb77ae6a85-aa008c5a86c11b9c05960468e4ce20c0.png"},51943:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/img_59feb8e353a07-6ecfd203ba19e88891cdd7ae9cf09df7.png"},64428:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/img_59febfad543a1-a9729c926007a10e31c1d4bb8f7a37f1.png"},11151:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>s});var o=n(67294);const r={},a=o.createContext(r);function s(e){const t=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(a.Provider,{value:t},e.children)}}}]);