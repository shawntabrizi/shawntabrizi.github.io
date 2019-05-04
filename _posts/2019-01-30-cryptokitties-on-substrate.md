---
id: 816
title: CryptoKitties on Substrate
date: 2019-01-30T14:57:52-08:00
author: Shawn Tabrizi
layout: post
guid: https://shawntabrizi.com/?p=816
permalink: /substrate/cryptokitties-on-substrate/
categories:
  - Substrate
tags:
  - blockchain
  - parity
  - programming
  - runtime
  - substrate
---
You saw in my last post that I started to investigate Substrate runtime development by building a simple [proof of existence](https://shawntabrizi.com/substrate/proof-of-existence-blockchain-with-substrate/) blockchain.

I wanted to take it a step further, and develop a more feature rich runtime module to see what the developer experience is like. Naturally, I decided to build CryptoKitties, or at least some subset of the game, on Substrate. If you are unfamiliar, CryptoKitties is one of the most popular Ethereum DApps which is notorious for almost breaking the Ethereum network with crazy high transaction fees.

The CryptoKitties game is something I am actually pretty familiar with thanks to the CryptoZombies tutorial that was created to teach new developers about smart contract development. I even wrote a summary of [what I learned going through the tutorial](https://shawntabrizi.com/ethereum/shawn-notes-cryptozombies-lessons-1-5-in-solidity/) nearly a year ago.

The CryptoZombies tutorial was such an important part of my experience when I was first learning about Solidity, and really these kinds of 0 to 60 tutorials are so important to build a community of developers who can actually build on your platform.

Long story short, I created an extensive tutorial for building a CryptoKitties like runtime module on Substrate called the "Substrate Collectables Workshop".

<a href="https://shawntabrizi.github.io/substrate-collectables-workshop/#/"><img alt='' class='alignnone size-full wp-image-819 ' src='https://shawntabrizi.com/wordpress/wp-content/uploads/2019/03/img_5c8ed01e77c2f.png' /></a>

I took a lot of inspiration from the CryptoZombies tutorial and all the things they did right. Check it out, and tell me what you think!

Source is of course open source on [GitHub](https://github.com/shawntabrizi/substrate-collectables-workshop).