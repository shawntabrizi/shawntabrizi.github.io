"use strict";(self.webpackChunkshawntabrizi=self.webpackChunkshawntabrizi||[]).push([[3811],{91684:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var t=i(85893),s=i(11151);const o={title:"Shawn Notes: CryptoZombies Lessons 1 - 5 in Solidity",date:new Date("2018-04-23T09:02:26.000Z"),authors:"shawntabrizi",slug:"/ethereum/shawn-notes-cryptozombies-lessons-1-5-in-solidity/",categories:["Ethereum"],tags:["blockchain","cryptozombies","ethereum","programming","shawn notes","solidity"]},r=void 0,a={permalink:"/blog/ethereum/shawn-notes-cryptozombies-lessons-1-5-in-solidity/",source:"@site/blog/2018-04-23-shawn-notes-cryptozombies-lessons-1-5-in-solidity.md",title:"Shawn Notes: CryptoZombies Lessons 1 - 5 in Solidity",description:"In this post I will be summarizing some of the key takeaways from lessons 1 - 5 of the popular CryptoZombies tutorial. This should cover all of the Solidity aspects of building a CryptoKitties clone.",date:"2018-04-23T09:02:26.000Z",tags:[{inline:!0,label:"blockchain",permalink:"/blog/tags/blockchain"},{inline:!0,label:"cryptozombies",permalink:"/blog/tags/cryptozombies"},{inline:!0,label:"ethereum",permalink:"/blog/tags/ethereum"},{inline:!0,label:"programming",permalink:"/blog/tags/programming"},{inline:!0,label:"shawn notes",permalink:"/blog/tags/shawn-notes"},{inline:!0,label:"solidity",permalink:"/blog/tags/solidity"}],readingTime:9.705,hasTruncateMarker:!1,authors:[{name:"Shawn Tabrizi",title:"Software Engineer",url:"https://github.com/shawntabrizi",imageURL:"https://github.com/shawntabrizi.png",key:"shawntabrizi",page:null}],frontMatter:{title:"Shawn Notes: CryptoZombies Lessons 1 - 5 in Solidity",date:"2018-04-23T09:02:26.000Z",authors:"shawntabrizi",slug:"/ethereum/shawn-notes-cryptozombies-lessons-1-5-in-solidity/",categories:["Ethereum"],tags:["blockchain","cryptozombies","ethereum","programming","shawn notes","solidity"]},unlisted:!1,prevItem:{title:"Using Web3.js 1.0 Subscribe and Infura WebSockets to Visualize Ethereum Transactions",permalink:"/blog/ethereum/using-web3-js-1-0-subscribe-and-infura-websockets-to-visualize-ethereum-transactions/"},nextItem:{title:"Graphing ETH Balance History of an Ethereum Address using Parallel Asynchronous Requests in Web3.js",permalink:"/blog/ethereum/graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js/"}},l={authorsImageUrls:[void 0]},c=[{value:"In this post I will be summarizing some of the key takeaways from lessons 1 - 5 of the popular CryptoZombies tutorial. This should cover all of the Solidity aspects of building a CryptoKitties clone.",id:"in-this-post-i-will-be-summarizing-some-of-the-key-takeaways-from-lessons-1---5-of-the-popular-cryptozombies-tutorial-this-should-cover-all-of-the-solidity-aspects-of-building-a-cryptokitties-clone",level:5},{value:"Lesson 1 Summary",id:"lesson-1-summary",level:2},{value:"Lesson 2 Summary",id:"lesson-2-summary",level:2},{value:"Lesson 3 Summary",id:"lesson-3-summary",level:2},{value:"Lesson 4 Summary",id:"lesson-4-summary",level:2},{value:"Lesson 5 Summary",id:"lesson-5-summary",level:2}];function d(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h5:"h5",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h5,{id:"in-this-post-i-will-be-summarizing-some-of-the-key-takeaways-from-lessons-1---5-of-the-popular-cryptozombies-tutorial-this-should-cover-all-of-the-solidity-aspects-of-building-a-cryptokitties-clone",children:["In this post I will be summarizing some of the key takeaways from lessons 1 - 5 of the popular ",(0,t.jsx)(n.a,{href:"https://cryptozombies.io",children:"CryptoZombies tutorial"}),". This should cover all of the Solidity aspects of building a CryptoKitties clone."]}),"\n",(0,t.jsx)(n.p,{children:"This post should not act as a replacement for taking the course, which I strongly recommend you do. Instead this will be a good way to keep some of the new concepts and best practices fresh in your mind if you are jumping into a new Solidity project. This post will be written assuming that the reader is relatively versed in other programming languages so things like the modular function, if/else statements, and for loops wont be included."}),"\n",(0,t.jsx)(n.p,{children:"Really I want to use this post as a way for me to look back and refresh my memory the next time I jump on a Solidity project."}),"\n",(0,t.jsx)(n.p,{children:"So let's get started!"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:i(12194).Z+"",width:"618",height:"1093"})}),"\n",(0,t.jsx)(n.h2,{id:"lesson-1-summary",children:"Lesson 1 Summary"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Use ",(0,t.jsx)(n.code,{children:"pragma solidity ^"})," to define the version of Solidity you want to use"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Create a contract using ",(0,t.jsx)(n.code,{children:"contract contractName {}"})]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"uint"})," is an alias for ",(0,t.jsx)(n.code,{children:"uint256"}),". You can also individually specify ",(0,t.jsx)(n.code,{children:"uint8"}),", ",(0,t.jsx)(n.code,{children:"uint16"}),", etc..."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Exponential operator in Solidity is ",(0,t.jsx)(n.code,{children:"**"}),", i.e. ",(0,t.jsx)(n.code,{children:"uint x = 5 **2; // equal to 5^2 = 25"})]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Structs are available in Solidity and can be defined like:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"struct Person {\n\tuint age;\n\tstring name;\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Fixed (",(0,t.jsx)(n.code,{children:"uint[2] fixedArray"}),") and dynamic arrays (",(0,t.jsx)(n.code,{children:"uint[] dynamicArray"}),") are both available in Solidity."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You can also create an array of structs."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["If you declare an array as ",(0,t.jsx)(n.code,{children:"public"}),", Solidity will automatically create a getter method for it."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You can define a function within a contract like so:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"function eatHamburgers(string _name, uint _amount) {...}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["It is convention to start function parameter variable names with an underscore (",(0,t.jsx)(n.code,{children:"_"}),"), differentiating them from global variables."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Functions are ",(0,t.jsx)(n.code,{children:"public"})," by default, which means anyone can call them. Usually you want to mark your functions ",(0,t.jsx)(n.code,{children:"private"})," by default, and only make functions public if you want to expose them to others. We also start private functions with an underscore (",(0,t.jsx)(n.code,{children:"_"}),") by convention."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You need to declare the type of value a function will return if it returns a value like so:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"function sayHello() public returns (string) {\n\treturn greeting;\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["If a function does not change any values or write anything, we can additionally label the function as a ",(0,t.jsx)(n.code,{children:"view"})," function."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["If the function doesn't even read from the state of the app, and only uses the function parameters we can label it ",(0,t.jsx)(n.code,{children:"pure"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Both ",(0,t.jsx)(n.code,{children:"view"})," and ",(0,t.jsx)(n.code,{children:"pure"})," functions can help users save gas when using your contract. More about this in lesson 3."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Typecasting is available in Solidity by wrapping a variable with the type, i.e. ",(0,t.jsx)(n.code,{children:"uint8(var)"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You can use events to communicate that something has happened on the blockchain. This is particularly useful when creating a front-end for your Solidity application."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"// declare the event\nevent IntegersAdded(uint x, uint y, uint result);\n\nfunction add(uint _x, uint _y) public {\n\tuint result = _x + _y;\n\t// fire an event to let the app know the function was called:\n\tIntegersAdded(_x, _y, result);\n\treturn result;\n}\n"})}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"lesson-2-summary",children:"Lesson 2 Summary"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["In Solidity, there is a variable type ",(0,t.jsx)(n.code,{children:"address"}),", that is a unique id to represent an Ethereum account."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Solidity has the concept of a ",(0,t.jsx)(n.code,{children:"mapping"}),", which is like a hash table, ",(0,t.jsx)(n.a,{href:"https://solidity.readthedocs.io/en/develop/types.html#mappings",children:"but a little different"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"// For a financial app, storing a uint that holds the user's account balance:\nmapping (address => uint) public accountBalance;\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can use ",(0,t.jsx)(n.code,{children:"msg.sender"})," to refer to the address of the person or smart contract that called a particular function."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["We can make functions throw an error if a condition is not true using ",(0,t.jsx)(n.code,{children:"require();"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can use the inheritance phrase ",(0,t.jsx)(n.code,{children:"is"})," to split up your contracts into a more object-oriented design."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:'contract Doge {\n\tfunction catchphrase() public returns (string) {\n\treturn "So Wow CryptoDoge";\n\t}\n}\n\ncontract BabyDoge is Doge {\n\tfunction anotherCatchphrase() public returns (string) {\n\treturn "Such Moon BabyDoge";\n\t}\n}\n'})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can also split up your code into multiple files using the ",(0,t.jsx)(n.code,{children:"import"})," keyword, referencing the other Solidity files."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["There are two places you can store variables: ",(0,t.jsx)(n.code,{children:"storage"})," and ",(0,t.jsx)(n.code,{children:"memory"}),". ",(0,t.jsx)(n.code,{children:"storage"})," being permanently written information in the blockchain, and ",(0,t.jsx)(n.code,{children:"memory"})," being temporary data which disappears at the end of a function call."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["In addition to ",(0,t.jsx)(n.code,{children:"public"})," and ",(0,t.jsx)(n.code,{children:"private"}),", functions can also be ",(0,t.jsx)(n.code,{children:"internal"})," or ",(0,t.jsx)(n.code,{children:"external"}),". ",(0,t.jsx)(n.code,{children:"internal"})," is the same as ",(0,t.jsx)(n.code,{children:"private"})," except that it is also accessible to contracts which inherit from the one that contains this function. ",(0,t.jsx)(n.code,{children:"external"})," is similar to ",(0,t.jsx)(n.code,{children:"public"})," except that they can only be called outside the contract, not by functions inside the contract."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can define an ",(0,t.jsx)(n.code,{children:"interface"})," to allow one contract to talk to another that we do not own."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"interface NumberInterface {\n\tfunction getNum(address _myAddress) public view returns (uint);\n}\n\ncontract MyContract {\n\taddress NumberInterfaceAddress = 0xab38...\n\t// ^ The address of the FavoriteNumber contract on Ethereum\n\tNumberInterface numberContract = NumberInterface(NumberInterfaceAddress);\n\t// Now `numberContract` is pointing to the other contract\n\n\tfunction someFunction() public {\n\t\t// Now we can call `getNum` from that contract:\n\t\tuint num = numberContract.getNum(msg.sender);\n\t\t// ...and do something with `num` here\n\t}\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You can have functions return multiple variables and do multiple assignments using this format:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"function multipleReturns() internal returns(uint a, uint b, uint c) {\n\treturn (1, 2, 3);\n}\n\nfunction processMultipleReturns() external {\n\tuint a;\n\tuint b;\n\tuint c;\n\t// This is how you do multiple assignment:\n\t(a, b, c) = multipleReturns();\n}\n\n// Or if we only cared about one of the values:\nfunction getLastReturnValue() external {\n\tuint c;\n\t// We can just leave the other fields blank:\n\t(,,c) = multipleReturns();\n}\n"})}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"lesson-3-summary",children:"Lesson 3 Summary"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Ethereum contracts are immutable, so it may make sense to break apart your project into multiple contracts, where individual parts could get updated later by referencing a new contract with updated code."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["It is common practice to add ownership to contracts. One such library that adds this functionality out of the box is ",(0,t.jsx)(n.a,{href:"https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/ownership/Ownable.sol",children:"OpenZeppelin's Ownable.sol"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Constructors are a special kind of function that has the same name as the contract and will only execute one time: when the contract is first created."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["A ",(0,t.jsx)(n.code,{children:"modifier"})," is logic that can be applied on top of a function, usually to check requirements before the function actually executes."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Function ",(0,t.jsx)(n.code,{children:"modifier"}),"s can also accept arguments."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"// A mapping to store a user's age:\nmapping (uint => uint) public age;\n\n// Modifier that requires this user to be older than a certain age:\nmodifier olderThan(uint _age, uint _userId) {\n\trequire(age[_userId] >= _age);\n\t_;\n}\n\n// Must be older than 16 to drive a car (in the US, at least).\n// We can call the `olderThan` modifier with arguments like so:\nfunction driveCar(uint _userId) public olderThan(16, _userId) {\n\t// Some function logic\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Transactions on Ethereum are not free, and running functions or storing values on the blockchain require ",(0,t.jsx)(n.code,{children:"gas"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Normally, Solidity will reserve 256 bits of storage no matter what variable sub-type you use, so you will not save on gas."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["The exception to this rule is in a ",(0,t.jsx)(n.code,{children:"struct"}),", where Solidity will package multiple smaller variables together."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Solidity uses unix time, and has built into the language time units like ",(0,t.jsx)(n.code,{children:"seconds"}),", ",(0,t.jsx)(n.code,{children:"minutes"}),", ",(0,t.jsx)(n.code,{children:"hours"}),", ",(0,t.jsx)(n.code,{children:"days"}),", ",(0,t.jsx)(n.code,{children:"weeks"}),", ",(0,t.jsx)(n.code,{children:"years"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can also call ",(0,t.jsx)(n.code,{children:"now"}),", which will return the current unix time for that block."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Earlier we mentioned that we can label functions with ",(0,t.jsx)(n.code,{children:"view"})," if they are read only functions. Solidity also makes ",(0,t.jsx)(n.code,{children:"view"})," functions free to call, therefore, wherever possible, make sure to make your functions ",(0,t.jsx)(n.code,{children:"external view"}),". The same applies to ",(0,t.jsx)(n.code,{children:"pure"})," functions."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["When you write to ",(0,t.jsx)(n.code,{children:"storage"}),", it takes a ton of gas. The tutorial states:"]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["In order to keep costs down, you want to avoid writing data to storage except when absolutely necessary. Sometimes this involves seemingly inefficient programming logic \u2014 like rebuilding an array in ",(0,t.jsx)(n.code,{children:"memory"})," every time a function is called instead of simply saving that array in a variable for quick lookups."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["With the current version of Solidity, ",(0,t.jsx)(n.code,{children:"memory"})," arrays must be fixed length."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"CryptoZombies then talks about the correct way to implement mapping zombies to owners, it is a little long so I won't summarize it here."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"lesson-4-summary",children:"Lesson 4 Summary"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can mark a function as ",(0,t.jsx)(n.code,{children:"payable"})," which will allow the function to accept Ether payments. Otherwise, the function will reject all transactions containing Ether."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["The amount of ether sent to the contract can be viewed using ",(0,t.jsx)(n.code,{children:"msg.value"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"contract OnlineStore {\n\tfunction buySomething() external payable {\n\t\t// Check to make sure 0.001 ether was sent to the function call:\n\t\trequire(msg.value == 0.001 ether);\n\t\t// If so, some logic to transfer the digital item to the caller of the function:\n\t\ttransferThing(msg.sender);\n\t}\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can use ",(0,t.jsx)(n.code,{children:"this.balance"})," to get the amount of ether available in the contract."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can use the ",(0,t.jsx)(n.code,{children:"transfer"})," function to send funds to any Ethereum address."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"contract GetPaid is Ownable {\n\tfunction withdraw() external onlyOwner {\n\t\towner.transfer(this.balance);\n\t}\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can use ",(0,t.jsx)(n.code,{children:"keccak256"})," for random number generation, but it is exploitable, so only use it in non-critical scenarios."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"The rest of this lesson is about implementing specific game functionality in CryptoZombies and refactoring old code, which I wont go into here."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"lesson-5-summary",children:"Lesson 5 Summary"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md",children:"ERC20"})," tokens are great for representing alternative currencies within Ethereum."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md",children:"ERC721"})," tokens are good for representing collectables and other non-fungible assets."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Solidity contracts can inherit from multiple contracts like so:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"contract ZombieOwnership is ZombieAttack, ERC721 {...}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You need to define the functions which make the token ERC721 compatible, and the logic may change depending on the specific implementation and functionality of your token. I will not go into these details."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"You cannot have function modifiers with the same name."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You should use another ",(0,t.jsx)(n.a,{href:"https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol",children:"OpenZeppelin library called SafeMath"})," to prevent overflows and underflows which may lead to security vulnerabilities."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["SafeMath uses the ",(0,t.jsx)(n.code,{children:"assert"})," statement to make sure that the result of math functions are as we would suspect."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-solidity",children:"function add(uint256 a, uint256 b) internal pure returns (uint256) {\n\tuint256 c = a + b;\n\tassert(c >= a);\n\treturn c;\n}\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"assert"})," is similar to ",(0,t.jsx)(n.code,{children:"require"})," in that it will throw an error if false, however ",(0,t.jsx)(n.code,{children:"assert"})," will not refund unused gas when a function fails."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You will need to define the SafeMath library for each different type of ",(0,t.jsx)(n.code,{children:"uint"})," you use in your contract. As is, SafeMath will only work on ",(0,t.jsx)(n.code,{children:"uint256"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["You can add comments to Solidity code using ",(0,t.jsx)(n.code,{children:"//"})," or multi-line comments with ",(0,t.jsx)(n.code,{children:"/* ... */"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["The standard way to format your comments among the Solidity community is the ",(0,t.jsx)(n.a,{href:"https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format",children:"Ethereum Natural Specification Format"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h1,{id:"thats-all-folks",children:"That's all folks!"}),"\n",(0,t.jsxs)(n.p,{children:["Again, I strongly recommend that you follow the ",(0,t.jsx)(n.a,{href:"https://cryptozombies.io",children:"CryptoZombies tutorial"}),". It is funny, comprehensive, and very informative. I talked about a lot of the Solidity specific knowledge that CryptoZombies teaches, but I leave out the most critical learning aspect: Designing and implementing a game using Solidity. This you can only learn by completing the full tutorial."]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Did this post help you?"}),"\n",(0,t.jsx)(n.li,{children:"Did I miss a critical piece of knowledge?"}),"\n",(0,t.jsx)(n.li,{children:"Did I make a mistake?"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Let me know, and as always, if you like what I do, you can send me a friendly thanks in the ",(0,t.jsx)(n.a,{href:"https://shawntabrizi.com/donate/",children:"form of a donation"})," :)"]})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},12194:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/img_5add32b676792-af10f97b235546d70006b52afda0c688.png"},11151:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>r});var t=i(67294);const s={},o=t.createContext(s);function r(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);