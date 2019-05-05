---
title: Substrate Smart Contracts Workshop
date: 2019-04-28T14:17:06-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/substrate-smart-contracts-workshop/
categories:
  - Substrate
tags:
  - smart contracts
  - rust
github: substrate-contracts-workshop
---

We recently held our very first Sub0 conference right next to the Parity office in Berlin.

Sub0 was an event bringing together users from around the world who share our vision of the future and believe in the technologies we are developing at Parity... and there are quite a few things we are building.

One of the things we showed off for the first time during Sub0 was ink! (previously known as the PDSL), a Rust eDSL for building Wasm smart contracts on Substrate!

This smart contract platform is pretty much the child of two Parity developers: Robin ([Robbepop](https://github.com/Robbepop)) and Sergei ([Pepyakin](https://github.com/pepyakin)). They were so kind as to get me up to speed on what they had built, and it was surprisingly mature and well developed.

I spent a few weeks learning about the end to end smart contract system, including the Contract module provided by Substrate and the three different layers of the ink! language.

Then, the day before Sub0, I spent [2](https://github.com/shawntabrizi/substrate-contracts-workshop/commit/c6e0223018c17841e342dccc47842a8e18afab55)[4](https://github.com/shawntabrizi/substrate-contracts-workshop/commit/7c26536795e80e0504575dfccf8f8c8871f3eaf4) hours building a brand new workshop based on the same structure as the [Substrate Collectables Workshop](https://github.com/shawntabrizi/substrate-collectables-workshop).

[![](/assets/images/img_5cccc806a30b1.png)](https://github.com/shawntabrizi/substrate-contracts-workshop)

Through this tutorial we teach you how to:

- Set up the ink! development environment
- Deploy and interact with the pre-built `flipper` contract
- Write an "incrementer" contract
- Write an ERC20 Token

I am also looking to add instructions for building:

- An ERC721 Token
- A non-token contract, maybe something that more directly interacts with a Substrate module

Anyway, I would love for you all to try it out, and hopefully by the time you do, it will have been much more developed!

If you like the work I do, take a quick look at my [donation page](https://shawntabrizi.com/donate/) to help support future endeavors.
