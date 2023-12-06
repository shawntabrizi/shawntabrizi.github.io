---
title: Verify Ethereum Contracts Using Web3.js and Solc
date: 2018-11-30T10:20:58-08:00
authors: shawntabrizi
layout: post
permalink: /ethereum/verify-ethereum-contracts-using-web3-js-and-solc/
categories:
  - Ethereum
tags:
  - bytecode
  - etherscan
  - javascript
  - solidity
  - verification
  - web3
github: ethereum-bytecode-verifier-console
---

##### This tutorial will show you how you can verify the source code of an Ethereum contract using Web3.js and Solc-JS, similar to Etherscan.io.

Recently I have been looking into the process of contract verification for Solidity contracts deployed to the Ethereum network. Many of you might be familiar with this [process on Etherscan.io](https://etherscan.io/verifyContract2) where users can submit the source code to their contracts in order to [get a "verified contract" status](https://etherscan.io/contractsVerified) on the site.

At first I thought this process would be pretty trivial since the bytecode for any contract is publicly available through the Web3 APIs, and the Solc compiler is pretty straightforward to use. However, if you try and do the naive approach, you will not get results that match! There are some small details about contract verification that are not really well documented today, and I hope to address that in this post, teaching you what I learned looking into these issues myself.

Before I dive in, I want to give a big shout out to the ConsenSys Diligence project [bytecode-verifier](https://github.com/ConsenSys/bytecode-verifier), whose source code ultimately helped me unblock some of the problems I was running into. Unfortunately this project is a bit out of date and won't work with the latest Solidity contracts, but we will address those problems here. (As of this writing, they support up to v0.4.21) I have written my own minimal version of the same fundamental program [here](https://github.com/shawntabrizi/ethereum-bytecode-verifier-console) with the updates I mention in this post.

## Using the Right Solidity Compiler Version

The first issue I ran into while trying to automate the contract verification process was the problem of using the right Solc version for a given contract. As you may know, the Solidity compiler and even the Solidity programming language is constantly getting updated through [new releases of the software](https://github.com/ethereum/solidity/releases). Depending on which compiler version you use, the resulting bytecode of your contract may change. If you are trying to verify an Ethereum contract, it is important that you have knowledge of which version you need to use to get the correct results. Unfortunately, the common practice for solidity developers is to include a carrot (`^`) in their `pragma solidity` statement (e.g. `pragma solidity ^0.4.16`). This allows the same source code to be compiled with Solidity compilers greater than 0.4.16 without throwing an error. This means to get the right results, you will need to know what compiler version was used to actually generate the bytecode, and not rely completely on the source code.

Another issue is that there is no backwards compatibility in the Solidity compiler. This can be quite annoying if you are trying to automate this process since you will need to have multiple Solc binaries downloaded and managed on your computer. Fortunately Solc-JS can come to the rescue here.

### Using a Legacy Version of Solidity with Solc-JS

Solc-JS is a set of JavaScript bindings for the Solidity compiler. Built into the library is a version manager [briefly documented here](https://github.com/ethereum/solc-js#using-a-legacy-version):

> In order to compile contracts using a specific version of Solidity, the `solc.loadRemoteVersion(version, callback)` method is available. This returns a new solc object that uses a version of the compiler specified.

Here is a minimal example of how this function could be used:

```javascript
const solc = require('solc');

var solc_version = "v0.4.16+commit.d7661dd9"

solc.loadRemoteVersion(solc_version, function (err, solc_specific) {
    if(!err) {
        var output = solc_specific.compile("contract t { function g() {} }", 1)
    }
}
```

In the background, the Solc-JS bindings manages loading and using the right Solidity compiler, and simply gives you the binary output you would expect! You can find all the builds of solidity [here](https://ethereum.github.io/solc-bin/bin/list.json) and simply replace the `solc_version` variable with what you need.

## Compiling a Contract with Multiple Solidity Files

The next thing we may commonly encounter when trying to do contract verification is handling projects which separate their code into multiple distinct files, and connects them using an `import` statement. Fortunately, the Solc-JS library also handles this. Note that when a contract does an `import` to another solidity file, it is really just concatenating the files, so if this part gives you trouble, or you want to simplify your process a bit, you can just merge all the different solidity files into a single file with multiple contracts. This is how the source code is shown on Etherscan.io.

If you do want to compile Solidity contracts broken up into multiple files, this code snippet should work for you assuming all the files are in the same directory:

```javascript
var solc = require('solc')
var fs = require('fs')

var solc_version = "v0.4.16+commit.d7661dd9"
var contracts_directory = "./contracts"
var contract_name = "MyContract"
var contract_filename = "MyContract.sol"
var is_optimized = 1

var input = {}

var files = fs.readdirSync(contracts_directory);

for (file in files) {
    let item = files[file];
    if (item.slice(-4) == ".sol") {
        let file_path = contracts_directory + '/' + item;
        input[item] = fs.readFileSync(file_path, 'utf8');
    }
}

solc.loadRemoteVersion(solc_version, function (err, solc_specific) {
    if (!err) {
        var output = JSON.parse(solc_specific.lowlevel.compileMulti(JSON.stringify({ sources: input }), is_optimized));
        var bytecode = output['contracts'][contract_filename + ':' + contract_name]['runtimeBytecode'];
        console.log(bytecode);
    }
});
```

You will note that we had to also specify the name of the final contract we want to compile and the name of the file which contains that contract code. There are probably ways to simplify this in your automation, but for the sake of making things general and easy to understand, all of these variables are defined upfront.

## Getting the Bytecode of an Existing Ethereum Contract

So now that we know how to generate the bytecode from the smartcontract's source, we need to be able to retrieve the existing bytecode which is on the blockchain to compare it to. Web3.js provides a function called [`getCode()`](https://web3js.readthedocs.io/en/1.0/web3-eth.html#getcode) which returns the bytecode of a contract at a specific address. It looks like this:

```javascript
web3.eth.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8")
.then(console.log);

> "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```

Dead simple.

## The Naive Approach Does Not Work

So what would happen if we use these two new skills and tried to verify a known Ethereum contract? For no particular reason, we will try and verify the source code for the ChainLink Token (LINK).

If you copy the code and compiler settings of the `LinkToken` contract [from Etherscan](https://etherscan.io/address/0x514910771af9ca656af840dff83e8264ecf986ca#code) and use Solc-JS to compile it. You should get the following bytecode:

```
606060405236156100b75763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100bc578063095ea7b31461014757806318160ddd1461017d57806323b872dd146101a2578063313ce567146101de5780634000aea014610207578063661884631461028057806370a08231146102b657806395d89b41146102e7578063a9059cbb14610372578063d73dd623146103a8578063dd62ed3e146103de575b600080fd5b34156100c757600080fd5b6100cf610415565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561010c5780820151818401525b6020016100f3565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015257600080fd5b610169600160a060020a036004351660243561044c565b604051901515815260200160405180910390f35b341561018857600080fd5b610190610499565b60405190815260200160405180910390f35b34156101ad57600080fd5b610169600160a060020a03600435811690602435166044356104a9565b604051901515815260200160405180910390f35b34156101e957600080fd5b6101f16104f8565b60405160ff909116815260200160405180910390f35b341561021257600080fd5b61016960048035600160a060020a03169060248035919060649060443590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506104fd95505050505050565b604051901515815260200160405180910390f35b341561028b57600080fd5b610169600160a060020a036004351660243561054c565b604051901515815260200160405180910390f35b34156102c157600080fd5b610190600160a060020a0360043516610648565b60405190815260200160405180910390f35b34156102f257600080fd5b6100cf610667565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561010c5780820151818401525b6020016100f3565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037d57600080fd5b610169600160a060020a036004351660243561069e565b604051901515815260200160405180910390f35b34156103b357600080fd5b610169600160a060020a03600435166024356106eb565b604051901515815260200160405180910390f35b34156103e957600080fd5b610190600160a060020a0360043581169060243516610790565b60405190815260200160405180910390f35b60408051908101604052600f81527f436861696e4c696e6b20546f6b656e0000000000000000000000000000000000602082015281565b600082600160a060020a03811615801590610479575030600160a060020a031681600160a060020a031614155b151561048457600080fd5b61048e84846107bd565b91505b5b5092915050565b6b033b2e3c9fd0803ce800000081565b600082600160a060020a038116158015906104d6575030600160a060020a031681600160a060020a031614155b15156104e157600080fd5b6104ec85858561082a565b91505b5b509392505050565b601281565b600083600160a060020a0381161580159061052a575030600160a060020a031681600160a060020a031614155b151561053557600080fd5b6104ec85858561093c565b91505b5b509392505050565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054808311156105a957600160a060020a0333811660009081526002602090815260408083209388168352929052908120556105e0565b6105b9818463ffffffff610a2316565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a3600191505b5092915050565b600160a060020a0381166000908152600160205260409020545b919050565b60408051908101604052600481527f4c494e4b00000000000000000000000000000000000000000000000000000000602082015281565b600082600160a060020a038116158015906106cb575030600160a060020a031681600160a060020a031614155b15156106d657600080fd5b61048e8484610a3a565b91505b5b5092915050565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054610723908363ffffffff610afa16565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a35060015b92915050565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a35060015b92915050565b600160a060020a03808416600081815260026020908152604080832033909516835293815283822054928252600190529182205461086e908463ffffffff610a2316565b600160a060020a0380871660009081526001602052604080822093909355908616815220546108a3908463ffffffff610afa16565b600160a060020a0385166000908152600160205260409020556108cc818463ffffffff610a2316565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3600191505b509392505050565b60006109488484610a3a565b5083600160a060020a031633600160a060020a03167fe19260aff97b920c7df27010903aeb9c8d2be5d310a2c67824cf3f15396e4c16858560405182815260406020820181815290820183818151815260200191508051906020019080838360005b838110156109c35780820151818401525b6020016109aa565b50505050905090810190601f1680156109f05780820380516001836020036101000a031916815260200191505b50935050505060405180910390a3610a0784610b14565b15610a1757610a17848484610b23565b5b5060015b9392505050565b600082821115610a2f57fe5b508082035b92915050565b600160a060020a033316600090815260016020526040812054610a63908363ffffffff610a2316565b600160a060020a033381166000908152600160205260408082209390935590851681522054610a98908363ffffffff610afa16565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b92915050565b600082820183811015610b0957fe5b8091505b5092915050565b6000813b908111905b50919050565b82600160a060020a03811663a4c0ed363385856040518463ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018084600160a060020a0316600160a060020a0316815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610bbd5780820151818401525b602001610ba4565b50505050905090810190601f168015610bea5780820380516001836020036101000a031916815260200191505b50945050505050600060405180830381600087803b1515610c0a57600080fd5b6102c65a03f11515610c1b57600080fd5b5050505b505050505600a165627a7a72305820c3685b0297ec9fe5313ede11d56d6f42a2fc15071d0a3ef0e337bc6e3d3877380029
```

However if we get the bytecode from Ethereum, it is different!

```javascript
web3.eth.getCode('0x514910771AF9Ca656af840dff83E8264EcF986CA').then(console.log)
```

```
0x606060405236156100b75763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100bc578063095ea7b31461014757806318160ddd1461017d57806323b872dd146101a2578063313ce567146101de5780634000aea014610207578063661884631461028057806370a08231146102b657806395d89b41146102e7578063a9059cbb14610372578063d73dd623146103a8578063dd62ed3e146103de575b600080fd5b34156100c757600080fd5b6100cf610415565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561010c5780820151818401525b6020016100f3565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015257600080fd5b610169600160a060020a036004351660243561044c565b604051901515815260200160405180910390f35b341561018857600080fd5b610190610499565b60405190815260200160405180910390f35b34156101ad57600080fd5b610169600160a060020a03600435811690602435166044356104a9565b604051901515815260200160405180910390f35b34156101e957600080fd5b6101f16104f8565b60405160ff909116815260200160405180910390f35b341561021257600080fd5b61016960048035600160a060020a03169060248035919060649060443590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506104fd95505050505050565b604051901515815260200160405180910390f35b341561028b57600080fd5b610169600160a060020a036004351660243561054c565b604051901515815260200160405180910390f35b34156102c157600080fd5b610190600160a060020a0360043516610648565b60405190815260200160405180910390f35b34156102f257600080fd5b6100cf610667565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561010c5780820151818401525b6020016100f3565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037d57600080fd5b610169600160a060020a036004351660243561069e565b604051901515815260200160405180910390f35b34156103b357600080fd5b610169600160a060020a03600435166024356106eb565b604051901515815260200160405180910390f35b34156103e957600080fd5b610190600160a060020a0360043581169060243516610790565b60405190815260200160405180910390f35b60408051908101604052600f81527f436861696e4c696e6b20546f6b656e0000000000000000000000000000000000602082015281565b600082600160a060020a03811615801590610479575030600160a060020a031681600160a060020a031614155b151561048457600080fd5b61048e84846107bd565b91505b5b5092915050565b6b033b2e3c9fd0803ce800000081565b600082600160a060020a038116158015906104d6575030600160a060020a031681600160a060020a031614155b15156104e157600080fd5b6104ec85858561082a565b91505b5b509392505050565b601281565b600083600160a060020a0381161580159061052a575030600160a060020a031681600160a060020a031614155b151561053557600080fd5b6104ec85858561093c565b91505b5b509392505050565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054808311156105a957600160a060020a0333811660009081526002602090815260408083209388168352929052908120556105e0565b6105b9818463ffffffff610a2316565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a3600191505b5092915050565b600160a060020a0381166000908152600160205260409020545b919050565b60408051908101604052600481527f4c494e4b00000000000000000000000000000000000000000000000000000000602082015281565b600082600160a060020a038116158015906106cb575030600160a060020a031681600160a060020a031614155b15156106d657600080fd5b61048e8484610a3a565b91505b5b5092915050565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054610723908363ffffffff610afa16565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a35060015b92915050565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a35060015b92915050565b600160a060020a03808416600081815260026020908152604080832033909516835293815283822054928252600190529182205461086e908463ffffffff610a2316565b600160a060020a0380871660009081526001602052604080822093909355908616815220546108a3908463ffffffff610afa16565b600160a060020a0385166000908152600160205260409020556108cc818463ffffffff610a2316565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3600191505b509392505050565b60006109488484610a3a565b5083600160a060020a031633600160a060020a03167fe19260aff97b920c7df27010903aeb9c8d2be5d310a2c67824cf3f15396e4c16858560405182815260406020820181815290820183818151815260200191508051906020019080838360005b838110156109c35780820151818401525b6020016109aa565b50505050905090810190601f1680156109f05780820380516001836020036101000a031916815260200191505b50935050505060405180910390a3610a0784610b14565b15610a1757610a17848484610b23565b5b5060015b9392505050565b600082821115610a2f57fe5b508082035b92915050565b600160a060020a033316600090815260016020526040812054610a63908363ffffffff610a2316565b600160a060020a033381166000908152600160205260408082209390935590851681522054610a98908363ffffffff610afa16565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b92915050565b600082820183811015610b0957fe5b8091505b5092915050565b6000813b908111905b50919050565b82600160a060020a03811663a4c0ed363385856040518463ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018084600160a060020a0316600160a060020a0316815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610bbd5780820151818401525b602001610ba4565b50505050905090810190601f168015610bea5780820380516001836020036101000a031916815260200191505b50945050505050600060405180830381600087803b1515610c0a57600080fd5b6102c65a03f11515610c1b57600080fd5b5050505b505050505600a165627a7a72305820c5f438ff94e5ddaf2058efa0019e246c636c37a622e04bb67827c7374acad8d60029
```

Ignoring the `0x` at the front, we can still find that the end of each bytecode is different: `...37bc6e3d3877380029` vs `...27c7374acad8d60029`.

So what's going on?

## Contract Metadata

What you are seeing here are some of the artifacts of the [contract metadata](https://solidity.readthedocs.io/en/v0.4.24/metadata.html) which gets generated by the solidity compiler. At the end of the bytecode, the Solidity compiler appends a Swarm hash of the metadata file that gets generated at compile time. This section always starts with with `a165627a7a72305820` which is [translated from `0xa1 0x65 'b' 'z' 'z' 'r' '0' 0x58 0x20`](https://solidity.readthedocs.io/en/v0.4.24/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode).

So ultimately we don't want to directly compare the two resulting bytecodes, but the specific parts of the bytecode which represent the smart contract's logic. Fortunately, just like this Swarm hash which is appended at the end of the contract, there is also a common substring in the bytecode which indicates the beginning of the contract: `6060604052`. This bytecode translates to the assembly code which initializes the ["free memory pointer"](https://solidity.readthedocs.io/en/v0.4.24/assembly.html#conventions-in-solidity):

    PUSH1 0x60 PUSH1 0x40 MSTORE

So now, if we only compare the bytecode starting with `6060604052...` and ending with `...a165627a7a72305820` we will actually find that these two bytecodes match!

## Handling Changes to Metadata from Different Solidity Versions

Unfortunately this is not the end of the story. As the Solidity compiler has changed, so has some of the rules around the contract metadata. For example, before Solidity v0.4.7, there was no metadata! So if we tried to do the naive approach on a very old contract, it would have worked!

Also, after Solidity v0.4.22, the free memory pointer initialization changes from `6060604052...` to `6080604052...`. I am not sure [why this changed](https://ethereum.stackexchange.com/questions/63117/when-did-the-ethereum-free-memory-pointer-change-6060-6080), but it means we will need to add a few conditionals to our general source code verification program.

## Generally Working Verification Code

So now that we know how to get the results we want, we can write some code to automate this process. Here is a minimal working example:

```javascript
var solc = require('solc')
var fs = require('fs')
var Web3 = require('web3')

var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"))

var solc_version = "v0.4.16+commit.d7661dd9"
var contracts_directory = "./contracts"
var contract_name = "LinkToken"
var contract_filename = "LinkToken.sol"
var is_optimized = 1

var contract_address = "0x514910771AF9Ca656af840dff83E8264EcF986CA"

var input = {}

var files = fs.readdirSync(contracts_directory);

for (file in files) {
    let item = files[file];
    if (item.slice(-4) == ".sol") {
        let file_path = contracts_directory + '/' + item;
        input[item] = fs.readFileSync(file_path, 'utf8');
    }
}

solc.loadRemoteVersion(solc_version, async function (err, solc_specific) {
    if (!err) {
        var output = JSON.parse(solc_specific.lowlevel.compileMulti(JSON.stringify({ sources: input }), is_optimized));
        var compiled_bytecode = "0x" + output['contracts'][contract_filename + ':' + contract_name]['runtimeBytecode'];
        var blockchain_bytecode = await web3.eth.getCode(contract_address);

        processed_compiled_bytecode = processBytecode(compiled_bytecode);
        processed_blockchain_bytecode = processBytecode(blockchain_bytecode);

        if (processed_blockchain_bytecode == processed_compiled_bytecode) {
            console.log("Verified!")
        } else {
            console.log("Not Verified")
        }
    }
});

function processBytecode(bytecode) {
    // Semantic versioning
    let solc_minor = parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[0].slice(1))
    let solc_patch = parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[1].slice(1))

    if (solc_minor >= 4 && solc_patch >= 22) {
        var starting_point = bytecode.lastIndexOf('6080604052');
        var ending_point = bytecode.search('a165627a7a72305820');
        return bytecode.slice(starting_point, ending_point);
    } else if (solc_minor >= 4 && solc_patch >= 7) {
        var starting_point = bytecode.lastIndexOf('6060604052');
        var ending_point = bytecode.search('a165627a7a72305820');
        return bytecode.slice(starting_point, ending_point);
    } else {
        return bytecode;
    }
}
```

And the result?

```
C:\Temp\solc\node_project>node index.js
Verified!
```

As I mentioned before, the main source which unblocked me trying to do this process was the [ConsenSys/bytecode-verifier](https://github.com/ConsenSys/bytecode-verifier) project. However, their code is a bit out of date, and also contains some non-essential parts. I attempted to simply the code in my own version of the blockchain verifier: [shawntabrizi/ethereum-bytecode-verifier-console](https://github.com/shawntabrizi/ethereum-bytecode-verifier-console).

This code has not been battle tested, but I plan on iterating on it and using it for a larger project I am working on. Feel free to grab it and modify it as you need!

I hope that this post has taught you something new and possibly helped you answer similar questions that I had! If you enjoyed this content, feel free to check out my [donations page](https://shawntabrizi.com/donate/).
