---
title: Does Shared Security Improve Interoperability?
date: 2023-05-18T16:14:03-08:00
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - shared security
  - interoperability
---

##### This is a [repost from the Polkadot forum](https://forum.polkadot.network/t/does-shared-security-improve-interoperability/2895), discussing the relationship between shared security and interoperability.

I wanted to start a thread which puts into words an advantage of Polkadot which is not covered that often (that I can see). Hopefully I get everything right below, but I am also writing this as an opportunity to bring further clarity to the actual features that exist, allow others to call out any mistakes, allow others to further the story, and ultimately spread the knowledge to our community.

So the topic at hand is how Polkadot’s cross-chain messaging protocol (XCMP) is advantaged over other protocols, for example IBC or any non-protocol-native messaging system, primarily due to the implications of Shared Security across the interacting chains.

So what is the problem normally?

Any two blockchains can communicate to each other over a bridge. There are many kinds of bridges, ranging from fully trustless to fully trusted, but in the end of the day, messages are passed over the bridge, and transition the state of these chains.

**The issue is that these two interacting chains have completely independent security guarantees.**

The concern is that two chains both change their state due to some cross-chain interaction, but a weak chain is attacked / reorged, and that would leave the two chains in a conflicting state, with no definitive path toward resolution, especially if there are different parties and incentives at play.

This means the security around interactions between two or more chains is as weak as the weakest chain. Compared to Polkadot, where all parachains, and their interactions are secured by the full security of the Polkadot relay chain.

That being said, all chains (even those in Polkadot) are potentially susceptible to some kind of attack where the logic of the chain has a backdoor which manipulates the state of the chain after a cross-chain interaction. This means that even today, there is some level of trust needed between two chains which want to interact with one another, that they will not act maliciously within the sovereignty of their own state transition function.

How would we solve this?

Another seldomly talked about topic which can help solve this is [SPREE](https://wiki.polkadot.network/docs/learn-spree).

At a high level, this is where interactions between two chains is managed by logic which is stored on the relay chain, and also the state is maintained on the relay chain. This would mean that even the two chains interacting with one another would not have control over the specific data and logic around their interaction, but instead follow the rules defined by their common security provider.

This too highlights the need for a shared security layer for a future of truly trustless interoperability.

Continue the discussion on the [Polkadot Forum](https://forum.polkadot.network/t/does-shared-security-improve-interoperability/2895);
