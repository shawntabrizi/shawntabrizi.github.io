---
title: Disposable Parachains
date: 2024-01-20
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - parachain
  - airdrop
---

##### This is a [repost from the Polkadot forum](https://forum.polkadot.network/t/disposable-parachains-for-airdrops-and-other-ideas/5769), discussing the possibility of short lived parachains on the Polkadot Network for efficiently executing airdrops.

I had some unorganized thoughts I wanted to share, especially with all the talk about $DED, and what an efficient airdrop might look like on Polkadot.

I want to start by saying that I truly believe most airdrops are just ponzinomics. I don’t necessarily support or like the airdrop culture or think it is healthy for an ecosystem. That being said, it is an interesting technical problem.

For context, doing an Airdrop on Polkadot is inherently harder than other chains. This is because, unlike many other blockchains, Polkadot takes care to ensure that its state properly scales. It does this through things like the existential deposit and other storage deposits, which is also often the blocker for people to make large scale airdrops work.

I want to make clear, this is by design, and it seems it is working well.

But let’s brainstorm, given these constraints, how you could make the largest and most efficient airdrop possible on Polkadot.

My current answer is: Disposable Parachains.

A disposable parachain is a parachain with a short lifetime.

This means that after some relatively short period, the entire parachain, its state, and everything else can be completely dropped.

This is quite the opposite in thinking to most blockchains which are expected to live forever. If we look back to why Polkadot has these limitations on storage, it is precisely because we are constantly concerned with the long term scalability of the chain.

But a disposable parachain does not have this problem. A disposable parachain can be extremely “inefficient”, for example:

- having no existential deposit
- having lots of items in storage (like the airdrop information for a 1M accounts)
- fixed fees / weights, to simplify development
- etc…

So what does this look like in the context of an airdrop?

Let’s imagine we wanted to create an airdrop for DOT2, which is exactly 1:1 for DOT to all existing DOT holders. At the time of writing, this needs to support 1.2M users.

The Assets Parachain / Assets Pallet is just not set up for this kind of task. Each user who wants to receive the airdrop on the Assets Parachain needs to have an existential deposit on that parachain, and perhaps other deposits needed to hold the storage of that asset. For the person who is executing the airdrop, this is a massive up-front cost that would prevent the airdrop all together.

The more scalable solution would be to create some kind of merkle trie which contains all of the claims for tokens into a single merkle root, and then individual claimants could provide proof of their claims and mint the tokens themselves paying their own fees.

In this case, everyone has the “opportunity” to claim their DOT2, but not everyone will do it. Some users have such a little amount, it is not worth it for them to go through the process. Some users are not active, so they won’t claim. Some users don’t see value in the token, so they won’t claim.

IMO, this is all good. All the different ways users can filter themselves from an airdrop that they don't find valuable is better for the whole system and bloat. Having a “reactive” airdrop is much better than a “proactive” one, and is much easier to scale. Most airdrops do this through a claims process.

But now we would need to create and launch some custom Airdrop pallet on the Assets parachain. More than that, we will need to keep track of all claims from users for the lifetime of the airdrop to prevent someone from double claiming. In the case where 500K people claim the airdrop, we would still need to manage those 500k storage entries, which will bloat the chain and the chain history, especially if there will be multiple airdrops in the future.

This is where the disposable parachain comes in.

Polkadot is already designed to shard data and logic to parachains. The entire state of a parachain is boiled down to a single root hash, and that root hash is stored on chain. That means we could have a parachain, handling billions of airdrops, and the impact onto Polkadot is the same as any other parachain.

So imagine, for DOT2, we launch a disposable parachain, which holds all the data about the airdrop for DOT holders. We can store all the data we need on this parachain to make the airdrop work. Users could even pre-trade the token on the parachain, allowing small holders to sell their bags to those who are actually interested in claiming the token.

The parachain would be set up so that it is the owner of an asset on the Assets Parachain. Users would be able to trigger a claim on the Airdrop Disposable Parachain, which will send an XCM to mint the appropriate asset on the Assets Parachain. All fees required to do this need to be covered by the claimant, and can be included in the XCM message. Users who are interested in claiming their token go through this process, and ultimately get their final tokens minted on the Assets Parachain where the tokens are now officially in the Polkadot ecosystem, and should be well supported.

After some period of time, let’s say 6 months, the disposable parachain will “kill itself”, or just let the community decide how long they want to keep it around. But the idea is that once the parachain is no longer needed, it can just be “forgotten” and all of the state and bloat can disappear with it. The only impact it leaves on Polkadot is its state root, which can also be cleaned up if needed.

In this case, we offload the decision making of the airdrop to the users, and do so in a way which leaves no historical debt to Polkadot or any long term parachain.

Follow the conversation further in the [Polkadot Forum](https://forum.polkadot.network/t/disposable-parachains-for-airdrops-and-other-ideas/5769).
