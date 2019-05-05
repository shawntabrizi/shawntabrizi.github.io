---
title: 'Shawn Notes: CryptoZombies Lessons 1 &#8211; 5 in Solidity'
date: 2018-04-23T01:02:26-08:00
author: Shawn Tabrizi
layout: post
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

##### In this post I will be summarizing some of the key takeaways from lessons 1 - 5 of the popular [CryptoZombies tutorial](https://cryptozombies.io). This should cover all of the Solidity aspects of building a CryptoKitties clone.

This post should not act as a replacement for taking the course, which I strongly recommend you do. Instead this will be a good way to keep some of the new concepts and best practices fresh in your mind if you are jumping into a new Solidity project. This post will be written assuming that the reader is relatively versed in other programming languages so things like the modular function, if/else statements, and for loops wont be included.

Really I want to use this post as a way for me to look back and refresh my memory the next time I jump on a Solidity project.

So let's get started!

![](/assets/images/img_5add32b676792.png)

## Lesson 1 Summary

* Use `pragma solidity ^` to define the version of Solidity you want to use
* Create a contract using `contract contractName {}`
* `uint` is an alias for `uint256`. You can also individually specify `uint8`, `uint16`, etc...
* Exponential operator in Solidity is `**`, i.e. `uint x = 5 **2; // equal to 5^2 = 25`
* Structs are available in Solidity and can be defined like:

	```solidity
	struct Person {
		uint age;
		string name;
	}
	```

* Fixed (`uint[2] fixedArray`)  and dynamic arrays (`uint[] dynamicArray`) are both available in Solidity.
* You can also create an array of structs.
* If you declare an array as `public`, Solidity will automatically create a getter method for it.
* You can define a function within a contract like so:

	```solidity
	function eatHamburgers(string _name, uint _amount) {...}
	```

* It is convention to start function parameter variable names with an underscore (`_`), differentiating them from global variables.
* Functions are `public` by default, which means anyone can call them. Usually you want to mark your functions `private` by default, and only make functions public if you want to expose them to others. We also start private functions with an underscore (`_`) by convention.
* You need to declare the type of value a function will return if it returns a value like so:

	```solidity
	function sayHello() public returns (string) {
		return greeting;
	}
	```

* If a function does not change any values or write anything, we can additionally label the function as a `view` function.
* If the function doesn't even read from the state of the app, and only uses the function parameters we can label it `pure`.
* Both `view` and `pure` functions can help users save gas when using your contract. More about this in lesson 3.
* Typecasting is available in Solidity by wrapping a variable with the type, i.e. `uint8(var)`.
* You can use events to communicate that something has happened on the blockchain. This is particularly useful when creating a front-end for your Solidity application.

	```solidity
	// declare the event
	event IntegersAdded(uint x, uint y, uint result);

	function add(uint _x, uint _y) public {
		uint result = _x + _y;
		// fire an event to let the app know the function was called:
		IntegersAdded(_x, _y, result);
		return result;
	}
	```

## Lesson 2 Summary

* In Solidity, there is a variable type `address`, that is a unique id to represent an Ethereum account.
* Solidity has the concept of a `mapping`, which is like a hash table, [but a little different](https://solidity.readthedocs.io/en/develop/types.html#mappings).

	```solidity
	// For a financial app, storing a uint that holds the user's account balance:
	mapping (address => uint) public accountBalance;
	```

* You can use `msg.sender` to refer to the address of the person or smart contract that called a particular function.
* We can make functions throw an error if a condition is not true using `require(<bool function="">);</bool>`.
* You can use the inheritance phrase `is` to split up your contracts into a more object-oriented design.

	```solidity
	contract Doge {
		function catchphrase() public returns (string) {
		return "So Wow CryptoDoge";
		}
	}

	contract BabyDoge is Doge {
		function anotherCatchphrase() public returns (string) {
		return "Such Moon BabyDoge";
		}
	}
	```

* You can also split up your code into multiple files using the `import` keyword, referencing the other Solidity files.
* There are two places you can store variables: `storage` and `memory`.  `storage` being permanently written information in the blockchain, and `memory` being temporary data which disappears at the end of a function call.
* In addition to `public` and `private`, functions can also be `internal` or `external`. `internal` is the same as `private` except that it is also accessible to contracts which inherit from the one that contains this function. `external` is similar to `public` except that they can only be called outside the contract, not by functions inside the contract.
* You can define an `interface` to allow one contract to talk to another that we do not own.

	```solidity
	interface NumberInterface {
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
	}
	```

* You can have functions return multiple variables and do multiple assignments using this format:

	```solidity
	function multipleReturns() internal returns(uint a, uint b, uint c) {
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
	}
	```

## Lesson 3 Summary

* Ethereum contracts are immutable, so it may make sense to break apart your project into multiple contracts, where individual parts could get updated later by referencing a new contract with updated code.
* It is common practice to add ownership to contracts. One such library that adds this functionality out of the box is [OpenZeppelin's Ownable.sol](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/ownership/Ownable.sol).
* Constructors are a special kind of function that has the same name as the contract and will only execute one time: when the contract is first created.
* A `modifier` is logic that can be applied on top of a function, usually to check requirements before the function actually executes.
* Function `modifier`s can also accept arguments.

	```solidity
	// A mapping to store a user's age:
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
	}
	```

* Transactions on Ethereum are not free, and running functions or storing values on the blockchain require `gas`.
* Normally, Solidity will reserve 256 bits of storage no matter what variable sub-type you use, so you will not save on gas.
* The exception to this rule is in a `struct`, where Solidity will package multiple smaller variables together.
* Solidity uses unix time, and has built into the language time units like `seconds`, `minutes`, `hours`, `days`, `weeks`, `years`.
* You can also call `now`, which will return the current unix time for that block.
* Earlier we mentioned that we can label functions with `view` if they are read only functions. Solidity also makes `view` functions free to call, therefore, wherever possible, make sure to make your functions `external view`. The same applies to `pure` functions.
* When you write to `storage`, it takes a ton of gas. The tutorial states:

	> In order to keep costs down, you want to avoid writing data to storage except when absolutely necessary. Sometimes this involves seemingly inefficient programming logic — like rebuilding an array in `memory` every time a function is called instead of simply saving that array in a variable for quick lookups.

* With the current version of Solidity, `memory` arrays must be fixed length.
* CryptoZombies then talks about the correct way to implement mapping zombies to owners, it is a little long so I won't summarize it here.

## Lesson 4 Summary

* You can mark a function as `payable` which will allow the function to accept Ether payments. Otherwise, the function will reject all transactions containing Ether.
* The amount of ether sent to the contract can be viewed using `msg.value`.

	```solidity
	contract OnlineStore {
		function buySomething() external payable {
			// Check to make sure 0.001 ether was sent to the function call:
			require(msg.value == 0.001 ether);
			// If so, some logic to transfer the digital item to the caller of the function:
			transferThing(msg.sender);
		}
	}
	```

* You can use `this.balance` to get the amount of ether available in the contract.
* You can use the `transfer` function to send funds to any Ethereum address.

	```solidity
	contract GetPaid is Ownable {
		function withdraw() external onlyOwner {
			owner.transfer(this.balance);
		}
	}
	```

* You can use `keccak256` for random number generation, but it is exploitable, so only use it in non-critical scenarios.
* The rest of this lesson is about implementing specific game functionality in CryptoZombies and refactoring old code, which I wont go into here.

## Lesson 5 Summary

* [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) tokens are great for representing alternative currencies within Ethereum.
* [ERC721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) tokens are good for representing collectables and other non-fungible assets.
* Solidity contracts can inherit from multiple contracts like so:

	```solidity
	contract ZombieOwnership is ZombieAttack, ERC721 {...}
	```

* You need to define the functions which make the token ERC721 compatible, and the logic may change depending on the specific implementation and functionality of your token. I will not go into these details.
* You cannot have function modifiers with the same name.
* You should use another [OpenZeppelin library called SafeMath](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol) to prevent overflows and underflows which may lead to security vulnerabilities.
* SafeMath uses the `assert` statement to make sure that the result of math functions are as we would suspect.

	```solidity
	function add(uint256 a, uint256 b) internal pure returns (uint256) {
		uint256 c = a + b;
		assert(c >= a);
		return c;
	}
	```

* `assert` is similar to `require` in that it will throw an error if false, however `assert` will not refund unused gas when a function fails.
* You will need to define the SafeMath library for each different type of `uint` you use in your contract. As is, SafeMath will only work on `uint256`.
* You can add comments to Solidity code using `//` or multi-line comments with `/* ... */`.
* The standard way to format your comments among the Solidity community is the [Ethereum Natural Specification Format](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format).

# That's all folks!

Again, I strongly recommend that you follow the [CryptoZombies tutorial](https://cryptozombies.io). It is funny, comprehensive, and very informative. I talked about a lot of the Solidity specific knowledge that CryptoZombies teaches, but I leave out the most critical learning aspect: Designing and implementing a game using Solidity. This you can only learn by completing the full tutorial.

* Did this post help you?
* Did I miss a critical piece of knowledge?
* Did I make a mistake?

Let me know, and as always, if you like what I do, you can send me a friendly thanks in the [form of a donation](https://shawntabrizi.com/donate/) :)