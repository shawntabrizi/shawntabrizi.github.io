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
  - block
  - database
  - networking
  - transaction queue
  - consensus
---

##### In this post, I will try to explain the Substrate blockchain framework in a way that anyone with a bit of technical experience could understand.

You may have heard before that Substrate is an **extensible**, **modular**, and **open-source** framework for building blockchains. But what does that mean?

Substrate provides you with all the core components needed to build a distributed blockchain network:

 * [Database](#database)
 * [Networking](#networking)
 * [Transaction Queue](#transaction-queue)
 * [Consensus](#consensus)

While these layers are extensible, Substrate mostly assumes the average blockchain developer should not care about the specific implementation details of these core components. Instead, Substrate's core philosophy is to make development of a blockchain's state transition function as flexible and easy as possible. This layer is called the [Substrate runtime](#substrate-runtime).

But before we dive into all these details, first we need to establish a common understanding of what a blockchain is...

## What is a Blockchain?

In its most basic form, a blockchain is a simple data structure where _blocks_ of data are linked together forming an ordered _chain_. The specific details of a blockchain can vary depending on the functionality of that chain. However, at a high level, all blockchains should share some common properties.

### Blocks

Each block in a blockchain has some data that can be used to generate a unique identifier for that block. One part of this data is the unique identifier for the preceding block, known as the "parent block". Since each block has a pointer to its parent block, the blocks can be ordered in a deterministic way.

![Blockchain Blocks](/assets/images/wis-blocks.png)

Any small changes to the data in a block will change its unique ID. Since this block's ID changed, the block that comes after it (the "child block") will also change. Same with the next child, and the next one, and the next... In fact, all the blocks that come after the originally modified block will have to change their unique ID in order to maintain the chain! This means that it is easy to verify that two blockchains have the exact same data by simply checking the unique identifier of the last block on the chain.

> To learn more about these basics of a blockchain, visit the demo/videos found here: [https://anders.com/blockchain/](https://anders.com/blockchain/)

### Block Production

Due to these properties, blockchain systems are commonly used to keep track of a shared [ledger](https://en.wikipedia.org/wiki/Ledger). The contents of the ledger are changed not by changing an existing block, but by adding new blocks to the blockchain with instructions about how the state of the ledger should change from block to block. These instructions are commonly referred to as _transactions_.

![Block Production](/assets/images/wis-block-production.png)

There are usually rules associated with how the ledger can change, which are defined by a [state transition function](https://en.wikipedia.org/wiki/Transition_system). For cryptocurrency systems, these rules can be quite simple; for example:

> **Rule:** Users can only spend funds that they own.

These rules can also be more complex, even allowing for blockchain systems to act as a [Turing complete](https://simple.wikipedia.org/wiki/Turing_complete) computer, and the ledger acting as that computer's storage.

Once a valid set of transactions are collected, they are put into the content of a block, and then this block is placed at the end of the chain. This block production process allows the underlying state of the blockchain to change over time.

### Block Finalization

Now that a new block has been produced, it can be shared with others who want to construct the same shared ledger. However, since blockchains are decentralized in nature, it could be that two different, yet still valid blocks compete for the same position at the end of a chain. Different block finalization mechanisms can be used to determine which "chain of blocks" is the _canonical_ blockchain. For any given blockchain, there should only be one true final state of the shared ledger. Any alternative states of the blockchain are known as "forks".

![Blockchain Fork](/assets/images/wis-forking.png)

Forks are normal, expected, and generally not a problem. The block finalization process is in place to help non-canonical chains get back in sync. We will return to forking later in this post.

### Nodes

At this point, you should be able to see that blockchains are designed to be distributed and decentralized. You want multiple users around the world to be able to keep track of this shared ledger without the need of intermediary third parties. By following the rules above, each participant of this shared ledger can run a _node_, which is a computer program that follows the rules of the blockchain network and connects to other nodes that do the same, all without the need for a centralized service. Blockchain system are often "open" systems, which mean that anyone can participate. To prevent against malicious actors, mechanisms are put in place to incentivize good behavior while punishing bad behavior. With all of these mechanisms in place, a blockchain system can become an unstoppable machine.

## Substrate Components

Now that you have a high level understanding of what a blockchain is, we can now start to understand how Substrate is a framework for building them. The first claim about the Substrate framework is that it is **extensible**. This means that it makes as few assumptions about how you design your blockchain and attempts to be as _generic_ as possible.

### Database

As we illustrated, the heart of a blockchain is its shared ledger that must be maintained and stored. Substrate makes no assumptions about the content or structure of the data in your blockchain. The underlying database layer uses simple key-value storage, on top of which a modified Patricia Merkle tree ([trie](https://github.com/paritytech/trie)) is implemented. This special storage structure allows us to easily verify all the contents of one ledger match the contents of another, just like the unique identifier of the last block can do for the whole blockchain. It is important to realize that the ledger is not actually stored on the blockchain, but reconstructed locally by processing each block and executing the individual state transitions. This long process is called syncing, and the trie structure allows us to quickly verify that no mistakes were made during that process.

![Trie Structure](/assets/images/wis-trie.png)

### Networking

In order for a decentralized blockchain system to communicate, it needs to establish a peer-to-peer networking protocol. Substrate uses [libp2p](https://github.com/libp2p) as a modular peer-to-peer networking stack. Through this networking layer, Substrate-based blockchains are able to share transactions, blocks, peers, and other system critical details without the need for centralized servers. In line with Substrate's philosophy, libp2p is unique in the fact that it makes no assumptions about your specific networking protocol. As a result, you are able to implement and use different transports on top of a Substrate-based blockchain.

![Peer-to-Peer Networking](/assets/images/wis-p2p.png)

### Transaction Queue

As mentioned above, transactions are collected and formed into blocks that ultimately define how the state of the blockchain changes. However, the order of these transactions can impact the final state of the ledger. Substrate allows you full control over the dependency and queue management of transactions on your network. Substrate only assumes that a transaction has a _weight_ and a set of prerequisite _tags_ that are used to create dependency graphs. These dependency graphs are linear in the simplest case, but they can become more complex. Substrate handles those complexities for you automatically.

![](/assets/images/wis-txq.png)

### Consensus

Recall that there are different ways that a blockchain network can come to consensus about changes to the chain. Traditionally, these consensus engines are tightly coupled to the other blockchain components. However, Substrate has spent extra effort designing a consensus layer that can be easily changed during development. In fact, it was made such that consensus could even be hot-swapped after the chain goes live! Built into Substrate are multiple different consensus engines such as traditional [Proof of Work (PoW)](https://en.wikipedia.org/wiki/Proof_of_work), [Aura (Authority Round)](https://github.com/poanetwork/wiki/wiki/Aura-Consensus-Protocol-Audit), and Polkadot consensus, which is unique in the fact that it separates the block production process ([BABE](https://research.web3.foundation/en/latest/polkadot/BABE/Babe/)) from the block finalization process ([GRANDPA](https://research.web3.foundation/en/latest/polkadot/GRANDPA/)).

![GRANDPA Consensus](/assets/images/wis-grandpa.png)

## Substrate Runtime

So far, we have touched on all the core blockchain components that Substrate provides to you. As you have read, Substrate has made every effort to stay as generic and extensible as possible. However, arguably the most customizable part of Substrate is its **modular** runtime. The runtime is Substrate's _state transition function_ that we mentioned earlier.

Substrate believes that the average blockchain developer does not need to care so much about the blockchain components listed above. As long as the components are battle-tested and production-ready, the implementation details are often of little importance. However, the core blockchain logic that determines what is and is not valid for a network is often of critical importance for any chain.

**Thus, Substrate's core philosophy is to make blockchain runtime development as flexible and easy as possible.**

### Substrate Runtime Module Library (SRML)

A Substrate runtime is divided into separate logical components that are known as _runtime modules_. These modules will control some aspect of the on-chain logic managed by that blockchain. You can think of these modules like "plug-ins" for your system. As a Substrate developer, you are able to pick and choose the modules and functionality that you want to include in your chain.

For example, there is a module called "Balances" that manages the currency of the chain. There are also a set of modules like "Collective", "Democracy", and "Elections" that handle decision making and governance for the chain. There is even a module called "Contracts" that can turn any Substrate-based chain into a [smart contract](https://en.wikipedia.org/wiki/Smart_contract) platform. These kinds of modules are provided to you automatically when you build on Substrate.

However, you are not limited to only the modules provided by Substrate. In fact, developers can easily build their own runtime modules, either as independent logical components, or even directly interacting with other runtime modules to build more complicated logic. I believe that long term, the module system in Substrate will act much like an "app store", where users can simply pick and choose the functionality they want to include, and with minimal technical expertise, deploy a distributed blockchain network!

![Modern App Store](/assets/images/wis-app-store.png)

### Forkless Runtime Upgrades

If we follow the analogy of the Substrate module ecosystem acting like an app store, then we must also address how we update our runtime. Whether it be bug fixes, general improvements to existing modules, or even new features that you want to add to your blockchain, the ability to change your runtime is something that Substrate has made a first class process. 

However, changes to the state transition function of your chain also impact consensus of the network. If one node running on your network has one version of your runtime logic, while another node has a different one, these two nodes will not be able to reach consensus with one another. They will fundamentally disagree on the true state of the ledger, resulting in what we defined earlier as a fork. These kinds of irreconcilable forks are bad because they reduce the security of your network, as only a subset of nodes will correctly create and verify new blocks.

![Blockchain Hard Fork Upgrade](/assets/images/wis-upgrade.png)

Substrate has addressed this issue by having the network come to consensus about the runtime logic itself! Using the [Wasm](https://webassembly.org/) binary format, we are able to put the Substrate runtime code on the blockchain as part of the shared ledger. This means that anyone running a node is able to verify that their node has the latest logic. If it does not, then it will instead execute the on-chain Wasm directly! This means runtime upgrades to your blockchain can happen in real time, on a live network, without creating forks!

In the spirit of Substrate's flexibility, you do not need to enable this feature at all. If you want to disable on-chain upgrades, you can. Truly, Substrate provides you with all the tools needed to create a living, breathing blockchain.

## Free, Open-Source, Production Ready

Substrate is a completely free and [**open-source**](https://github.com/paritytech/substrate/blob/master/LICENSE) project. It is built using the [Rust programming language](https://www.rust-lang.org/), which is designed for creating fast and inherently safe software. Coordination and development of Substrate happens through public communities like [GitHub](https://github.com/paritytech/substrate) and [Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org), with over 100 individual contributors.

Substrate is a project born from [Polkadot](https://polkadot.network/), a larger vision of a world with many interoperable blockchains. Substrate powers the blockchain that connects this public network in addition to most of the chains that will be connected to it. You can feel secure that the technology that backs your blockchain is the same technology that powers multiple other production-level blockchains.

Substrate aims to be the absolute best platform for blockchain innovators, and the natural choice for anyone who is thinking about building a blockchain.

## Summary

At this point, I hope that you can see why we say that Substrate an **extensible**, **modular**, and **open-source** platform for building blockchain systems. At every point in the Substrate development process, keeping things generic has remained a priority. As a result, Substrate can be used as a platform to build future technologies, even those that are not yet thought of.

If you enjoy this content and want to see more, consider taking a look at my [donations page](https://shawntabrizi.com/donate/) to see how you can support me.
