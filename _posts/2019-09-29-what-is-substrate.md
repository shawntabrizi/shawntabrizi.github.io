---
title: What is Substrate?
date: 2019-09-29T16:14:03-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/what-is-substrate/
categories:
  - Substrate
tags:
  - runtime
  - module
---

##### In this post, I will try to explain the Substrate blockchain framework in a way that anyone with a bit of technical experience could understand.

You may have heard before that Substrate is an **extensible**, **modular**, and **open-source** framework for building blockchains. But what does that mean?

Substrate provides you with all the core components needed to build a distributed blockchain network:

 * [Database](#Database)
 * [Networking](#Networking)
 * [Transaction Queue](#Transaction-Queue)
 * [Consensus](#Consensus)

While these layers are extensible, Substrate mostly assumes the average blockchain developer should not care about the specific implementation details of these core components. Instead, Substrate's core philosophy is to make development of a blockchain's state transition function as flexible and easy as possible for development. We call this layer the [Substrate runtime](#Substrate-Runtime).

But before we dive into all the details,  first we need to establish a common understanding of what a blockchain is...

## What is a Blockchain?

In its most basic form, a blockchain is a simple data structure where _blocks_ of data are linked together forming an ordered _chain_. The specific details of a blockchain can vary depending on the functionality of that chain. However, at a high level, all blockchains should share some common properties.

![](https://i.imgur.com/ccfsWu9.png)

### Blocks

Each block in a blockchain has some data that can be used to generate a unique identifier for that block. One part of this data is the unique identifier for the preceding block, known as the "parent block". With this information, the blocks can be ordered in a deterministic way.

![](https://i.imgur.com/bgyjRWO.png)


Any small changes to the data in the block will change it's unique ID. Since this block's ID changed, the block that comes after it ("child block") will also have to change in order to keep the link to the updated parent block. As a result, this child block will also change it's unique ID... In fact, all the blocks that come after the originally modified block will have to change their unique ID! This means that it is easy to verify the content of a chain by simply checking the unique identifier of the last block on the chain.

> To learn more about these basics of a blockchain, visit the demo/videos found here: https://anders.com/blockchain/ 

### Block Production

Due to these properties, blockchain systems are commonly used to keep track of a shared [ledger](https://en.wikipedia.org/wiki/Ledger). The contents of the ledger are changed not by changing an existing block, but by adding a new block to the blockchain with instructions about how the state of the ledger should change from block to block. These instructions are commonly referred to as transactions.

![](https://i.imgur.com/gFrLLcz.png)

There are usually rules associated with how the ledger can change, which are defined by a [state transition function](https://en.wikipedia.org/wiki/Transition_system). For cryptocurrency systems, these rules can be quite simple; for example:

> **Rule:** Users can only spend funds which they own.

The rules can also be more complex, even allowing for blockchain systems to act as a [Turing complete](https://simple.wikipedia.org/wiki/Turing_complete) computer, and the ledger acting as that computer's storage.

Once a set of valid transactions are collected, they are be put into the content of a block, and then this block is be placed at the end of the chain. This block production process allows the state of the blockchain to change over time.

### Block Finalization

Now that a new block has been produced, it can be shared with others who want to construct the same shared ledger. However, since blockchains are decentralized in nature, it could be that two different, yet still valid blocks compete for the same position at the end of a chain. Different block finalization mechanisms can be used to determine which "chain of blocks" is the _canonical_ blockchain. For any given blockchain, there should only be one true final state of the shared ledger. Any alternative states of the blockchain are known as "forks".

![](https://i.imgur.com/stMNnKT.png)

Forks are normal, expected, and generally not a problem. The block finalization process is in place to help a non-canonical chain get back in sync. We will return to forking later in this page.

### Nodes

At this point, you should be able to see that the blockchain is designed to be distributed and decentralized. You want multiple users, around the world, to be able to keep track of this shared ledger without the need of intermediary third parties. By following the rules above, each participant of this shared ledger can run a _node_, which is a computer program which follows the rules of the blockchain network and connects to other nodes which do the same, all without the need for a centralized service. Blockchain system are often "open" systems, which mean that anyone can participate. To prevent against malicious actors, mechanisms are put in place to incentivize good behavior while punishing bad behavior. With all of these mechanisms in place, a blockchain system can become an unstoppable machine.

## Substrate Components

Now that you have a high level understanding of what a blockchain is, we can now start to understand how Substrate is a framework for building them. The first claim about the Substrate framework is that it is **extensible**. This means that it makes as few assumptions about how you design your blockchain and attempts to be as _generic_ as possible.

### Database

As we illustrated, at the heart of the blockchain is a shared ledger which must be maintained and stored. Substrate makes no assumptions about the content or structure this data. The underlying database layer uses simple key-value storage, on top of which you are able to build additional storage abstractions. Substrate provides low level APIs to access this key-value storage in addition to pre-built abstractions like a [Modified Patricia Merkle Tree](https://github.com/paritytech/trie).

![](https://i.imgur.com/dSysQew.png)

### Networking

In order for a decentralized blockchain system to communicate, it needs to establish a peer-to-peer networking protocol. Substrate uses [libp2p](https://github.com/libp2p) as a modular peer-to-peer networking stack. Through this networking layer, Substrate based blockchains are able to share transactions, blocks, peers, and other system critical details without the need for centralized servers. In line with Substrate's philosophy, libp2p is unique in the fact that it makes no assumptions on your specific networking protocol. As a result, you are able to implement and use different transports on top of a Substrate based blockchain.

![](https://i.imgur.com/QOm96HE.png)

### Transaction Queue

As mentioned above, transactions are collected and formed into blocks which ultimately define how the state of the blockchain changes. However, the order of these transactions can impact the final state of the ledger. Substrate allows you full control over the dependency and queue management of transactions on your network. Substrate only assumes that a transaction has a _weight_ and a set of prerequisite _tags_, that are used create dependency graphs. In the simplest case, these dependency graphs are linear, but they can become more complex, and Substrate will handle that for you automatically.

![](https://i.imgur.com/99V4gki.png)

### Consensus

Recall that there are different ways that a blockchain network can come to consensus about changes to the chain. Traditionally, these consensus engines are tightly coupled to the rest of the blockchain components. However, Substrate has spent extra effort designing a consensus layer which can be easily changed during development. In fact, extra effort was made such that consensus could even be hot-swapped after the chain goes live! Built into Substrate are multiple different consensus engines such as [Aura (Authority Round)](https://github.com/poanetwork/wiki/wiki/Aura-Consensus-Protocol-Audit) and Polkadot consensus which separates the block production process ([BABE](https://research.web3.foundation/en/latest/polkadot/BABE/Babe/)) from the block finalization process ([GRANDPA](https://research.web3.foundation/en/latest/polkadot/GRANDPA/)).

![](https://i.imgur.com/IsDaYDj.png)

## Substrate Runtime

So far, we have touched on all the core blockchain components that Substrate provides to you. As you have read, Substrate has made every effort to stay as generic and extensible as possible. However, arguably the most customizable part of Substrate is its **modular** runtime. The runtime is the _state transition function_ for your blockchain, which we spoke of earlier.

Substrate believes that average blockchain developer does not need to care so much about the blockchain components listed above. As long as the components are battle tested and production ready, the implementation details are often of little importance. However, the core blockchain logic which determines what is and is not valid for a network is often of critical importance for any unique chain.

**Thus, Substrate's core philosophy is to make blockchain runtime development as flexible and easy as possible.**

### Substrate Runtime Module Library (SRML)

A Substrate runtime is divided into separate logical components which are known as _runtime modules_. These modules will control some aspect of the on-chain logic managed by that blockchain. You can think of these modules like "plug-ins" for your system. As a Substrate developer, you are able to pick and choose the modules and functionality that you want to include in your chain.

For example, there is a module called "Balances" which can manage the currency of the chain, if you want one. There are also a set of modules which handle decision making and governance for the chain. There is even a module called "Contracts" which can turn any Substrate based chain into a [smart contract](https://en.wikipedia.org/wiki/Smart_contract) platform. These kinds of modules are provided to you automatically when you build on Substrate.

However, you are not limited to only the modules provided by Substrate. In fact, developers can easily build their own runtime modules, either as independent logical components, or even directly interacting with other external runtime modules. We believe that long term, the module system in Substrate will act much like an "app store", where users can simply pick and choose the functionality they want to include, and with minimal technical expertise, deploy a distributed blockchain network!

![](https://i.imgur.com/4ozTtqM.jpg)

### Forkless Runtime Upgrades

If we follow the analogy of the Substrate module ecosystem acting like an app store, then we must also address how we update our runtime. Whether it be bug fixes, general improvements to existing modules, or even new features that you want to add to your blockchain, the ability to change your runtime is something that Substrate has made a first class process. 

However, changes to the state transition function of your chain also impacts consensus of the network. If one node running on your network has one version of your runtime logic, while another node has a different one, these two nodes will not be able to reach consensus with one another. They will fundamentally disagree on the true state of the ledger, resulting in what we defined earlier as a fork. These kinds of irreconcilable forks are bad because they reduce the security of your network, as only a subset of nodes will correctly create and verify new blocks.

![](https://i.imgur.com/vJ0xUM2.png)

Substrate has addressed this issue by having the network come to consensus about the runtime logic itself! Using the [Wasm](https://webassembly.org/) binary format, we are able to put the Substrate runtime code on the blockchain as part of the shared ledger. This means that anyone running a node is able to verify that their node has the latest logic. If it does not, then it will instead execute the on-chain Wasm directly! This means runtime upgrades to your blockchain can happen in real time on a live network!

In the spirit of Substrate's flexibility, you do not need to enable this feature at all! If you want to disable on-chain upgrades, you have the ability to control that too. Truly, Substrate provides you with all the tools needed to create living, breathing blockchain.

## Free, Open-Source, Production Ready

Substrate is a completely free and [open-source project](https://github.com/paritytech/substrate/blob/master/LICENSE). It is built using the [Rust programming language](https://www.rust-lang.org/), which is designed for creating fast and inherently safe software. Coordination and development of Substrate happens through public communities like [GitHub](https://github.com/paritytech/substrate) and [Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org), with nearly 100 individual contributors.

Substrate is a project born from the [Polkadot network](https://polkadot.network/), a larger vision toward a world with many interoperable blockchains. Substrate powers the blockchain which runs this public network in addition to most of the chains that will connect to this network. You can feel secure that the technology which backs your blockchain is the same technology which powers multiple other production level blockchains.

Substrate aims to be the absolute best platform for blockchain innovators, and the natural choice for anyone who is thinking about building a blockchain.

## Summary

At this point, we hope that you can see why we say that Substrate an **extensible**, **modular**, and **open-source** platform for building blockchain systems. At every point in the Substrate development process, emphasis in keeping things generic has remained a priority. As a result, Substrate can be used as a platform to build future technologies, even those which are not yet thought of.
