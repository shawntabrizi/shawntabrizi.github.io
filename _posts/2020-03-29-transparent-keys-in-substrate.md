---
title: Transparent Keys in Substrate
date: 2020-03-29T16:14:03-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/transparent-keys-in-substrate/
categories:
  - Substrate
tags:
  - storage
  - runtime
  - module
  - keys
  - rpc
---

##### In this post, we will look at the new format for Substrate storage hashes that allow you to transparently extract the keys for any given map in Substrate.

The more I learn about Substrate and blockchain development in general, the more I come to understand the importance of storage design.

In retrospect, I guess this is obvious since the blockchain is all about coming to consensus about an underlying database, but I cannot overemphasize the fact that once you begin to fully understand the storage layers of Substrate, design decisions across the entire platform start to make more sense.

This blog post will be an extension of a previous post I wrote [Interacting with the Substrate RPC Endpoint](% post_url 2019-07-28-interacting-with-the-substrate-rpc-endpoint %), and will dive into the changes introduced since then by this brilliant PR:

[Refactor away from opaque hashes #5226](https://github.com/paritytech/substrate/pull/5226)

Ultimately, I will show you how a simple design decision about the key format for Substrate storage maps has made the platform infinitely more friendly to external APIs.

## Opaque Storage Keys

Just do to a quick recap, in my last post about interacting with Substrate storage via RPC, we showed an example of how you can get all the balances in your Substrate blockchain using the `getKeys` query and knowledge about the underlying prefix tries used in runtime storage.

> This means you could actually use the `state_getKeys` API to get all the storage keys for all the free balances in your system!
>
> ```bash
> curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getKeys", "params": ["0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4"]}' http://localhost:9933
>
> {"jsonrpc":"2.0","result":[
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4024cd62ab7726e039438193d4bbd915427f2d7de85afbcf00bd16fadbcad6aed",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b42e3fb4c297a84c5cebc0e78257d213d0927ccc7596044c6ba013dd05522aacba",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b44724e5390fcf0d08afc9608ff4c45df257266ae599ac7a32baba26155dcf4402",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b454b75224d766c852ac60eb44e1329aec5058574ae8daf703d43bc2fbd9f33d6c",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b465d0de2c1f75d898c078307a00486016783280c8f3407db41dc9547d3e3d651e",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b46b1ab1274bcbe3a4176e17eb2917654904f19b3261911ec3f7a30a473a04dcc8",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b477d14a2289dda9bbb32dd9313db096ef628101ac5bbb3b19301ede2c61915b89",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4927407fbcfe5afa14bcfb44714a843c532f291a9c33612677cb9e0ae5e2bd5de",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b494772f97f5f6b539aac74e798bc395119f39603402d0c85bc9eda5dfc5ae2160",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b49a9304efeee429067b2e8dfbcfd8a22d96f9d996a5d6daa02899b96bd7a667b1",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b49ea52149af6b15f4d523ad4342f63089646e29232a1777737159c7bc84173597",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4a315ee9e56d2f3bb24992a1cff6617b0f7510628a15722b680c42c2be8bb7452",
>  "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4c4a80eb5e32005323fb878ca749473d7e5f40d60ed5e74e887bc125a3659f258"],"id":1}
> ```

However, I also mentioned that this would only allow you to calculate the total balance in your system. It would _not_ necessarily allow you to know the individual balances of all the accounts because those account ids are cryptographically hashed and placed into the key. To figure out which account corresponds to each of the keys above, you would need to know the account ahead of time and then verify that the hash matches the bytes at the end of this key.

It is important that we use hashes in the construction of the storage key to [avoid unbalanced tries](% post_url 2019-12-09-substrate-storage-deep-dive %). Imagine instead we use the raw Account Id rather than the hash of it in constructing these keys. I could attack a Substrate chain by transferring a very small balance to all accounts whose hexadecimal representation start with `0x69`. This means that any _real_ account that also shares that first byte would be more heavy to access since we will need to traverse past all of the "dust" accounts in the trie.

So we can't use the Account Id directly because it is not safe for the chain, and using hashes is completely opaque to the user... maybe there is some middle ground?

## Concatenating Hashers

In [PR #5226](https://github.com/paritytech/substrate/pull/5226) a new set of "hashers" were introduced into the Substrate runtime storage system:

* `blake2_128_concat`
* `twox_64_concat`

These hashers are precisely a middle ground between using an opaque hash and using the raw key value, like an Account Id.

When we use these hashers, we take a key, find the hash, and then append to the end the raw key itself. For example:

**Account ID**

```
5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

**Account Bytes in Hex**

```
0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
```

**Blake2 128 of Account Hex**
```
0xde1e86a9a8c739864cf3cc5ec2bea59f
```

**Blake2 128 Concat of Account Hex**

```
0xde1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
----------------------------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
```

So if you have this `blake2_128_concat` formed key, you will directly be able to find the underlying Account Id used to generate the key, you just need to look at the last 32 bytes. But since it is prefixed with a hash, it is also safe to use in the underlying trie since it cannot be trivially manipulated.

You can see these concatenating hashers comes in two flavors: `twox_64` and `blake2_128`. The only difference here is the security provided by the underlying hashing algorithm. `twox`/`xxhash` is not a cryptographically secure hashing algorithm, but it is significantly faster to execute. `blake2` is cryptographically secure, but also more resource heavy.
