---
id: 448
title: 'Shawn Notes: CryptoZombies Lessons 1 &#8211; 5 in Solidity'
date: 2018-04-23T01:02:26-08:00
author: Shawn Tabrizi
layout: post
guid: http://shawntabrizi.com/?p=448
permalink: /ethereum/shawn-notes-cryptozombies-lessons-1-5-in-solidity/
categories:
  - Ethereum
tags:
  - blockchain
  - cryptozombies
  - ethereum
  - programming
  - shawn notes
  - solidity
---
<h5>In this post I will be summarizing some of the key takeaways from lessons 1 - 5 of the popular <a href="https://cryptozombies.io">CryptoZombies tutorial</a>. This should cover all of the Solidity aspects of building a CryptoKitties clone.</h5>

<p>This post should not act as a replacement for taking the course, which I strongly recommend you do. Instead this will be a good way to keep some of the new concepts and best practices fresh in your mind if you are jumping into a new Solidity project. This post will be written assuming that the reader is relatively versed in other programming languages so things like the modular function, if/else statements, and for loops wont be included.</p>

<p>Really I want to use this post as a way for me to look back and refresh my memory the next time I jump on a Solidity project.</p>

<p>So let's get started!</p>

<p id="mSvYgsX"><img class="alignnone wp-image-460 size-large" src="/assets/images/img_5add32b676792-579x1024.png" alt="" width="525" height="928" /></p>

<h2>Lesson 1 Summary</h2>
<ul>
 	<li>Use <code>pragma solidity ^<version></code> to define the version of Solidity you want to use</li>
 	<li>Create a contract using <code>contract <contractName> {}</code></li>
 	<li><code>uint</code> is an alias for <code>uint256</code>. You can also individually specify <code>uint8</code>, <code>uint16</code>, etc...</li>
 	<li>Exponential operator in Solidity is <code>**</code>, i.e. <code>uint x = 5 **2; // equal to 5^2 = 25</code></li>
 	<li>Structs are available in Solidity and can be defined like:</li>
</ul>
<pre>struct Person {
    uint age;
    string name;
}</pre>
<ul>
 	<li>Fixed (<code>uint[2] fixedArray</code>)  and dynamic arrays (<code>uint[] dynamicArray</code>) are both available in Solidity.</li>
 	<li>You can also create an array of structs.</li>
 	<li>If you declare an array as <code>public</code>, Solidity will automatically create a getter method for it.</li>
 	<li>You can define a function within a contract like so:</li>
</ul>
<pre>function eatHamburgers(string _name, uint _amount) {

}</pre>
<ul>
 	<li>It is convention to start function parameter variable names with an underscore (<code>_</code>), differentiating them from global variables.</li>
 	<li>Functions are <code>public</code> by default, which means anyone can call them. Usually you want to mark your functions <code>private</code> by default, and only make functions public if you want to expose them to others. We also start private functions with an underscore (<code>_</code>) by convention.</li>
 	<li>You need to declare the type of value a function will return if it returns a value like so:</li>
</ul>
<pre>function sayHello() public returns (string) {
    return greeting;
}</pre>
<ul>
 	<li>If a function does not change any values or write anything, we can additionally label the function as a <code>view</code> function.</li>
 	<li>If the function doesn't even read from the state of the app, and only uses the function parameters we can label it <code>pure</code>.</li>
        <li>Both <code>view</code> and <code>pure</code> functions can help users save gas when using your contract. More about this in lesson 3.</li>
 	<li>Typecasting is available in Solidity by wrapping a variable with the type, i.e. <code>uint8(var)</code>.</li>
 	<li>You can use events to communicate that something has happened on the blockchain. This is particularly useful when creating a front-end for your Solidity application.</li>
</ul>
<pre>// declare the event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
    uint result = _x + _y;
    // fire an event to let the app know the function was called:
    IntegersAdded(_x, _y, result);
    return result;
}</pre>
&nbsp;
<h2>Lesson 2 Summary</h2>
<ul>
 	<li>In Solidity, there is a variable type <code>address</code>, that is a unique id to represent an Ethereum account.</li>
 	<li>Solidity has the concept of a <code>mapping</code>, which is like a hash table, <a href="https://solidity.readthedocs.io/en/develop/types.html#mappings">but a little different</a>.</li>
</ul>
<pre>// For a financial app, storing a uint that holds the user's account balance:
mapping (address => uint) public accountBalance;</pre>
<ul>
 	<li>You can use <code>msg.sender</code> to refer to the address of the person or smart contract that called a particular function.</li>
 	<li>We can make functions throw an error if a condition is not true using <code>require(<bool function>);</code>.</li>
 	<li>You can use the inheritance phrase <code>is</code> to split up your contracts into a more object-oriented design.</li>
</ul>
<pre>contract Doge {
    function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
    }
}

contract BabyDoge is Doge {
    function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
    }
}</pre>
<ul>
 	<li>You can also split up your code into multiple files using the <code>import</code> keyword, referencing the other Solidity files.</li>
 	<li>There are two places you can store variables: <code>storage</code> and <code>memory</code>.  <code>storage</code> being permanently written information in the blockchain, and <code>memory</code> being temporary data which disappears at the end of a function call.</li>
 	<li>In addition to <code>public</code> and <code>private</code>, functions can also be <code>internal</code> or <code>external</code>. <code>internal</code> is the same as <code>private</code> except that it is also accessible to contracts which inherit from the one that contains this function. <code>external</code> is similar to <code>public</code> except that they can only be called outside the contract, not by functions inside the contract.</li>
 	<li>You can define an <code>interface</code> to allow one contract to talk to another that we do not own.</li>
</ul>
<pre>interface NumberInterface {
    function getNum(address _myAddress) public view returns (uint);
}

contract MyContract {
    address NumberInterfaceAddress = 0xab38... 
    // ^ The address of the FavoriteNumber contract on Ethereum
    NumberInterface numberContract = NumberInterface(NumberInterfaceAddress);
    // Now `numberContract` is pointing to the other contract

   function someFunction() public {
        // Now we can call `getNum` from that contract:
        uint num = numberContract.getNum(msg.sender);
        // ...and do something with `num` here
   }
}</pre>
<ul>
 	<li>You can have functions return multiple variables and do multiple assignments using this format:</li>
</ul>
<pre>function multipleReturns() internal returns(uint a, uint b, uint c) {
 return (1, 2, 3);
}

function processMultipleReturns() external {
 uint a;
 uint b;
 uint c;
 // This is how you do multiple assignment:
 (a, b, c) = multipleReturns();
}

// Or if we only cared about one of the values:
function getLastReturnValue() external {
 uint c;
 // We can just leave the other fields blank:
 (,,c) = multipleReturns();
}</pre>
<h2></h2>
<h2>Lesson 3 Summary</h2>
<ul>
 	<li>Ethereum contracts are immutable, so it may make sense to break apart your project into multiple contracts, where individual parts could get updated later by referencing a new contract with updated code.</li>
 	<li>It is common practice to add ownership to contracts. One such library that adds this functionality out of the box is <a href="https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/ownership/Ownable.sol">OpenZeppelin's Ownable.sol</a>.</li>
 	<li>Constructors are a special kind of function that has the same name as the contract and will only execute one time: when the contract is first created.</li>
 	<li>A <code>modifier</code> is logic that can be applied on top of a function, usually to check requirements before the function actually executes.</li>
 	<li>Function <code>modifier</code>s can also accept arguments.</li>
</ul>
<pre>// A mapping to store a user's age:
mapping (uint => uint) public age;

// Modifier that requires this user to be older than a certain age:
modifier olderThan(uint _age, uint _userId) {
 require(age[_userId] >= _age);
 _;
}

// Must be older than 16 to drive a car (in the US, at least).
// We can call the `olderThan` modifier with arguments like so:
function driveCar(uint _userId) public olderThan(16, _userId) {
 // Some function logic
}</pre>
<ul>
 	<li>Transactions on Ethereum are not free, and running functions or storing values on the blockchain require <code>gas</code>.</li>
 	<li>Normally, Solidity will reserve 256 bits of storage no matter what variable sub-type you use, so you will not save on gas.</li>
 	<li>The exception to this rule is in a <code>struct</code>, where Solidity will package multiple smaller variables together.</li>
 	<li>Solidity uses unix time, and has built into the language time units like <code>seconds</code>, <code>minutes</code>, <code>hours</code>, <code>days</code>, <code>weeks</code>, <code>years</code>.</li>
 	<li>You can also call <code>now</code>, which will return the current unix time for that block.</li>
 	<li>Earlier we mentioned that we can label functions with <code>view</code> if they are read only functions. Solidity also makes <code>view</code> functions free to call, therefore, wherever possible, make sure to make your functions <code>external view</code>. The same applies to <code>pure</code> functions.</li>
 	<li>When you write to <code>storage</code>, it takes a ton of gas. The tutorial states:</li>
</ul>
<blockquote style="padding-left: 30px;">In order to keep costs down, you want to avoid writing data to storage except when absolutely necessary. Sometimes this involves seemingly inefficient programming logic — like rebuilding an array in <code>memory</code> every time a function is called instead of simply saving that array in a variable for quick lookups.</blockquote>
<ul>
 	<li>With the current version of Solidity, <code>memory</code> arrays must be fixed length.</li>
 	<li>CryptoZombies then talks about the correct way to implement mapping zombies to owners, it is a little long so I won't summarize it here.</li>
</ul>
<h2></h2>
<h2>Lesson 4 Summary</h2>
<ul>
 	<li>You can mark a function as <code>payable</code> which will allow the function to accept Ether payments. Otherwise, the function will reject all transactions containing Ether.</li>
 	<li>The amount of ether sent to the contract can be viewed using <code>msg.value</code>.</li>
</ul>
<pre>contract OnlineStore {
 function buySomething() external payable {
 // Check to make sure 0.001 ether was sent to the function call:
 require(msg.value == 0.001 ether);
 // If so, some logic to transfer the digital item to the caller of the function:
 transferThing(msg.sender);
 }
}</pre>
&nbsp;
<ul>
 	<li>You can use <code>this.balance</code> to get the amount of ether available in the contract.</li>
 	<li>You can use the <code>transfer</code> function to send funds to any Ethereum address.</li>
</ul>
<pre>contract GetPaid is Ownable {
 function withdraw() external onlyOwner {
 owner.transfer(this.balance);
 }
}</pre>
&nbsp;
<ul>
 	<li>You can use <code>keccak256</code> for random number generation, but it is exploitable, so only use it in non-critical scenarios.</li>
 	<li>The rest of this lesson is about implementing specific game functionality in CryptoZombies and refactoring old code, which I wont go into here.</li>
</ul>
<h2></h2>
<h2>Lesson 5 Summary</h2>
<ul>
 	<li><a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md">ERC20</a> tokens are great for representing alternative currencies within Ethereum.</li>
 	<li><a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md">ERC721</a> tokens are good for representing collectables and other non-fungible assets.</li>
 	<li>Solidity contracts can inherit from multiple contracts like so:</li>
</ul>
<pre>contract ZombieOwnership is ZombieAttack, ERC721 {
}</pre>
<ul>
 	<li>You need to define the functions which make the token ERC721 compatible, and the logic may change depending on the specific implementation and functionality of your token. I will not go into these details.</li>
 	<li>You cannot have function modifiers with the same name.</li>
 	<li>You should use another <a href="https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol">OpenZeppelin library called SafeMath</a> to prevent overflows and underflows which may lead to security vulnerabilities.</li>
 	<li>SafeMath uses the <code>assert</code> statement to make sure that the result of math functions are as we would suspect.</li>
</ul>
<pre>function add(uint256 a, uint256 b) internal pure returns (uint256) {
 uint256 c = a + b;
 assert(c >= a);
 return c;
}</pre>
&nbsp;
<ul>
 	<li><code>assert</code> is similar to <code>require</code> in that it will throw an error if false, however <code>assert</code> will not refund unused gas when a function fails.</li>
 	<li>You will need to define the SafeMath library for each different type of <code>uint</code> you use in your contract. As is, SafeMath will only work on <code>uint256</code>.</li>
 	<li>You can add comments to Solidity code using <code>//</code> or multi-line comments with <code>/* ... */</code>.</li>
 	<li>The standard way to format your comments among the Solidity community is the <a href="https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format">Ethereum Natural Specification Format</a>.</li>
</ul>
&nbsp;
<h1>That's all folks!</h1>

<p>Again, I strongly recommend that you follow the <a href="https://cryptozombies.io">CryptoZombies tutorial</a>. It is funny, comprehensive, and very informative. I talked about a lot of the Solidity specific knowledge that CryptoZombies teaches, but I leave out the most critical learning aspect: Designing and implementing a game using Solidity. This you can only learn by completing the full tutorial.</p>

<p>Did this post help you?</p>

<p>Did I miss a critical piece of knowledge?</p>

<p>Did I make a mistake?</p>

<p>Let me know, and as always, if you like what I do, you can send me a friendly thanks in the <a href="http://shawntabrizi.com/donate/">form of a donation</a> :)</p>