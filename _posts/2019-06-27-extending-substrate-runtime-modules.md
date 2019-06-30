---
title: Extending Substrate Runtime Modules
date: 2019-06-27T16:14:03-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/extending-substrate-runtime-modules/
categories:
  - Substrate
tags:
  - runtime
  - module
  - rust
  - sudo
  - contracts
  - ink
github: sudo-contract
---

##### In this post, I will show you how you can extend the SRML Contracts module to add additional authorization layers to your smart contract blockchain.

One of the best things about Substrate is the ability to easily execute on your ideas when developing blockchain systems. I want to show you a question from the first Substrate Developer Conference (Sub0) that lead to me to investigate how one might extend the functionality of the runtime with a "wrapper module", and ultimately all the Substrate tricks I learned along the way.

First, let's hear the question:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-EJHu0u6hT8?start=6405&end=6573" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> Question: "Can you restrict which accounts can add code to the blockchain?"

> Sergei: "Maybe you can write another module which just wraps the smart contract module, and just does this additional check..."

It turns out [Sergei](https://github.com/pepyakin), as always, was absolutely correct about the appreach

## Background

The [Contract module](https://substrate.dev/rustdocs/v1.0/srml_contract/index.html) is included in the Substrate Runtime Module Library (SRML) and provides your blockchain with the ability to execute smart contracts, similar to existing smart contract platforms like Ethereum.

However, the Contract module is different than Ethereum in a number of ways, one of which is how a contract actually gets deployed.

