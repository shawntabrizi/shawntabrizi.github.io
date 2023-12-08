---
title: Transparent Keys in Substrate
date: 2020-03-29T16:14:03-08:00
authors: shawntabrizi
slug: /substrate/transparent-keys-in-substrate/
categories:
  - Substrate
tags:
  - storage
  - runtime
  - module
  - keys
  - rpc
---

##### In this post, we will take a look at the new Substrate storage hashers that allow you to transparently extract the keys for any given value in Substrate.

The more I learn about Substrate (and blockchain development in general), the more I come to understand the importance of storage design.

In retrospect, I guess this is obvious since the blockchain is all about coming to consensus about an underlying database, but I cannot overemphasize the fact that once you begin to fully understand the storage layers of Substrate, design decisions across the entire platform start to make more sense.

This blog post will be an extension of a previous post I wrote [Interacting with the Substrate RPC Endpoint](./2019-07-28-interacting-with-the-substrate-rpc-endpoint.md), where we investigated a little about how Substrate storage works, and how you can use basic RPC requests, along with the Substrate metadata, to retrieve information from the chain about the current state of the runtime.

This blog post will dive into the changes introduced to the Substrate storage keys since my last post by this PR: [Refactor away from opaque hashes #5226](https://github.com/paritytech/substrate/pull/5226)

Ultimately, I hope to show you how a simple design decision about the key format for Substrate storage maps has made the platform infinitely more friendly to external APIs.

## Opaque Storage Keys

Just do to a quick recap, in [my last post about interacting with Substrate storage via RPC](./2019-07-28-interacting-with-the-substrate-rpc-endpoint.md), we showed an example of how you can get all the balances in your Substrate blockchain using the `getKeys` query and knowledge about the underlying prefix tries used in runtime storage.

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

However, I also mentioned that this would only allow you to calculate the total balance in your system. It would _not_ necessarily allow you to know the individual balances of all the accounts because those Account IDs are cryptographically hashed and placed into the key. To figure out which account corresponds to each of the keys above, you would need to know the account ahead of time and then verify that the hash matches the bytes at the end of one of these keys.

In general, it is important that we use hashes in the construction of the storage key to [avoid unbalanced tries](./2019-12-09-substrate-storage-deep-dive.md). Imagine instead we use the raw Account ID rather than the hash of it in constructing these storage keys. I could attack a Substrate chain by transferring a very small balance to all accounts whose hexadecimal representation start with `0x69`. This means that any _real_ account that also shares that first byte would be more heavy to access since we will need to traverse past all of the "dust" accounts in the trie.

![](/assets/images/unbalanced-trie.png)

You can see in this illustration, most accounts take only 4 hops to get access to the final value, but some in the middle can take up to 6 hops. This is a very tame example of an "unbalanced trie", but when actually attacking a system, you can imagine introducing many extra additional hops to access some user accounts.

So we can't use the Account ID directly because it is not safe for the chain, and using hashes is completely opaque to the user... Is there maybe some middle ground?

## Customizable Storage Keys

This whole blog is about customizable storage keys in Substrate, so before we jump into it, lets talk about what this means.

In Substrate, each Pallet you design can introduce new storage items that will become part of your blockchain's state. These storage items can be simple single value items, or more complex storage maps. When you define storage maps in substrate, you must also specify a `hasher` that you want to use:

```rust
Foo get(fn foo): map hasher(blake2_128_concat) T::AccountId => T::Balance;
                     ^^^^^^^^^^^^^^^^^^^^^^^^^
```

You actually have the flexibility in Substrate to change which `hasher` gets used for each different storage map, and as a result, change the way your underlying storage keys are saved in the Substrate database. The `hasher` you select will be a part of blockchain's metadata, so any external UI will know what to do in order to correctly access your Substrate storage.

But you might be asking, what do these `hasher`s do?

## Concatenating Hashers

In [PR #5226](https://github.com/paritytech/substrate/pull/5226) a new set of "hashers" were introduced into the Substrate runtime storage system:

- `blake2_128_concat`
- `twox_64_concat`

These hashers are precisely a middle ground between using an opaque hash and using the raw key value, like an Account ID.

When we use these hashers, we take a key, find the hash, and then append to the end the hash the raw key itself. For example:

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
-------------- hash --------------++++++++++++++++++++++++++ raw key +++++++++++++++++++++++++++++
```

So if you have this `blake2_128_concat` formed key, you will directly be able to find the underlying Account ID used to generate the key, you just need to look at the last 32 bytes. But since it is prefixed with a hash, it is also safe to use in the underlying storage trie since it cannot be trivially manipulated to attack the system as described in the previous section.

You can see these concatenating hashers comes in two flavors: `twox_64` and `blake2_128`. The only difference here is the security provided by the underlying hashing algorithm. `twox`/`xxhash` is not a cryptographically secure hashing algorithm, but it is significantly faster to execute. `blake2` is cryptographically secure, but also more resource heavy. So, when should we choose to use each of these?

That ultimately depends on how much control the users have over the value being hashed. Remember, we must always assume that the users of our blockchain are malicious, and build our chain to be resistent to that malicious activity.

So let's talk about when it would be appropriate to use each hasher and also show some examples of they they are being used in Substrate today.

### Blake2 128 Concat

`blake2_128_concat` should be the default choice for any storage key. Because the prefix of the final key uses Blake2, a cryptographically secure hashing algorithm, we need not worry about the content of the starting key. This `hasher` will work for anything.

So where is it used?

```rust
/// The full account information for a particular account ID.
pub Account get(fn account):
  map hasher(blake2_128_concat) T::AccountId => AccountInfo<T::Index, T::AccountData>;
```

This is the `Account` storage item in the FRAME System. Your default substrate configuration will put all user balances in here.

So why must we use `blake2_128_concat` for this storage item?

Well, this storage item can be _completely_ controlled by external users. An Account ID (as implemented in a Substrate node) is any valid 32 bytes. When you make a transfer, you can specify any 32 bytes as the recipient of that balance transfer. That account need not have an existing balance or even a private key for someone to access it. So the attack we described earlier in the article where a malicious user could overpopulate parts of the trie still applies. Unfortunately, a non-cryptographic hashing algorithm like `twox` would not really help stop this attack. A malicious user would simply "mine" for an arbitrary account that generates a `twox` hash starting with some prefix, and perform the same attack. Because the `twox` hasher is not cryptographically secure, this kind of mining attack is not hard to the attacker.

So given that the starting key of this Storage Map is in complete and full control of the users in your network, we must use `blake2`.

### TwoX 64 Concat

`twox_64_concat` should only be used as an optimization to `blake2_128_concat` in situations where you know that starting key cannot be chosen arbitrarily by your users.

Let's look at a few ways it is used in Substrate:

#### Incrementing Index

```rust
/// The next free referendum index, aka the number of referenda started so far.
pub ReferendumCount get(fn referendum_count) build(|_| 0 as ReferendumIndex): ReferendumIndex;

/// Information concerning any given referendum.
pub ReferendumInfoOf get(fn referendum_info):
  map hasher(twox_64_concat) ReferendumIndex
  => Option<ReferendumInfo<T::BlockNumber, T::Hash, BalanceOf<T>>>;
```

Referendums are a part of Substrate's Democracy Pallet, allowing people to execute on-chain governance which can evolve your Substrate chain. Here you will see that we place information about an ongoing referendum into a map where the key uses `twox_64_concat`.

The starting key in this situation is a `ReferendumIndex`, which is simply a value that will be incremented for each new referendum. I have included the `ReferendumCount` storage item above to show you were the current `ReferendumIndex` is being tracked. Technically speaking, the starting key of a referendum is allowed to be any `ReferendumIndex` value. However, practically speaking, this value is not really in control of the end user. If a malicious user wants to insert some data where `ReferendumIndex = 420`, they will need to open up 419 other referendums, all of which has some underlying economic cost to the user (a deposit, a transaction fee, etc...).

And that is just to populate one key!

So a user can only manipulate the `ReferendumIndex` by creating more referendums, and ultimately, that is within the safety conditions of what the `twox` hasher can provide. Do note though, that if it was _much_ easier for a user to increment this referendum count, for example by submitting a low cost transaction or a transaction which allows them to increment the index multiple spots at a time, then it is possible that `twox_64_concat` would not be good enough again. You will need to justify the use on a case by base basis.

#### Real Accounts

Let's stay in the Democracy Pallet.

```rust
/// All votes for a particular voter. We store the balance for the number of votes that we
/// have recorded. The second item is the total amount of delegations, that will be added.
pub VotingOf: map hasher(twox_64_concat) T::AccountId => Voting<BalanceOf<T>, T::AccountId, T::BlockNumber>;
```

Here we have all of the votes of users in our system for various referendums or proposals. You can see that this storage map is very similar to the `Account` storage item that we used `blake2_128_concat` for, as it maps from Account ID to some value.

So why can we use `twox_64_concat` here and not there?

Well the way this storage item is populated is very different than in the case of managing user balances. Only when a user submits a vote onto the blockchain will this storage item be populated. Specifically, this implies the user has the private key to the account in question. If an attacker wanted to put onto the blockchain some data under an arbitrary public key, they would need to generate private keys until one had the corresponding public key they wanted. But at that point, it is as difficult to attack as a regular cryptographic hash.

### Identity

One last option you have which I did not mention yet is the `identity` `hasher`. As its name implies, it does not do any hashing at all, and instead directly uses the starting key as the final storage key for the storage item. An example of this in Substrate can also be found in the Democracry Pallet:

```rust
/// Map of hashes to the proposal preimage, along with who registered it and their deposit.
/// The block number is the block at which it was deposited.
pub Preimages:
  map hasher(identity) T::Hash
  => Option<PreimageStatus<T::AccountId, BalanceOf<T>, T::BlockNumber>>;
```

This should only be used when the starting key is already a cryptographic hash. In the example above, a user can submit a call that will be later executed by a democracy proposal, and we track that call on-chain using the hashing algorithm defined by the runtime, in this case Blake2. So there is no need to append any additional data to the key, we can just use it directly!

## Listing All Users

Okay, so now that you understand the new hashers introduced to Substrate, lets go through a clear example why this is so great from a UX perspective.

In my old RPC blog post, I was able to list all the user balances, and calculate with it the total balance in my Substrate chain, but I was not able to tell you how much each person has. Well, with our new transparent storage keys, we can do this!

I will start a regular Substrate dev node and make a query to return all `System.Accounts`. They will all have a shared prefix of:

```
twox_128("System")                 + twox_128("Account")
0x26aa394eea5630e07c48ae0c9558cef7 + 0xb99d880ec681799c0cf30e8886371da9

> 0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9
```

So then I call the `getKeys` rpc for my dev node:

```bash
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getKeys", "params": ["0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9"]}' http://localhost:9933
```

Which returns:

```json
{
  "jsonrpc": "2.0",
  "result": [
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9007cbc1270b5b091758f9c42f5915b3e8ac59e11963af19174d0b94d5d78041c233f55d2e19324665bafdfb62925af2d",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da923a05cabf6d3bde7ca3ef0d11596b5611cbd2d43530a44705ad088af313e18f80b53ef16b36177cd4b77b846f2a5f07c",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da932a5935f6edc617ae178fef9eb1e211fbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da94f9aea1afa791265fae359272badc1cf8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da95ecffd7b6c0f78751baa9d281e0bfa3a6d6f646c70792f74727372790000000000000000000000000000000000000000",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da96f2e33376834a63c86a195bcf685aebbfe65717dad0447d715f660a0a58411de509b42e6efb8375f562f58a554d5860e",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da98578796c363c105114787203e4d93ca6101191192fc877c24d725b337120fa3edc63d227bbc92705db1e2cb65f56981a",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9b0edae20838083f2cde1c4080db8cf8090b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9b321d16960ce1d9190b61e2421cc60131e07379407fecc4b89eb7dbd287c2c781cfb1907a96947a3eb18e4f8e7198625",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9e5e802737cce3a54b0bc9e3d3e6be26e306721211d5404bd9da88e0204360a1a9ab8b87c66c1bc2fcdd37f3c2222cc20",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9edeaa42c2163f68084a988529a0e2ec5e659a7a1628cdd93febc04a4e0646ea20e9f5f0ce097d9a05290d4a9e054df4e",
    "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9f3f619a1c2956443880db9cc9a13d058e860f1b1c7227f7c22602f53f15af80747814dffd839719731ee3bba6edc126c"
  ],
  "id": 1
}
```

Now, I know that all these storage keys use `blake2_128_concat` with the Account ID as the starting key, so I know that there should be an additional 48 bytes added to the end of their shard prefix, and the last 32 bytes should be the raw Account ID information!

Let's break one down manually:

```
0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da932a5935f6edc617ae178fef9eb1e211fbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f
---------------------- storage prefix key ------------------------+++++++ blake2 128 hash ++++++++------------------------ account id ----------------------------
```

Taking a closer look at the last 32 bytes:

```
Account ID:      0xbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f
Blake2 128 Hash: 0x32a5935f6edc617ae178fef9eb1e211f
Address:         5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY
```

And this address corresponds to "Alice's Stash" account:

![](/assets/images/alice-stash-account.png)

Nice! So we could follow this same process for every key that is returned under `System.Account` and get a full list of all the accounts in our Substrate dev node!

## Final Thoughts

At this point, it should be obvious why this storage key design is really an amazing feature for Substrate and its users. It provides safety, flexibility, and usability to everyone on the platform. I am not sure you can ask for much more.

One thing to note is that Substrate is able to quickly change fundamental design decisions like these storage key patterns due to its modular nature and the minimal number underlying assumptions it makes. If you are a blockchain developer who wants to introduce another storage key system, it really would not be that hard to do it!

I have created some tools at [https://www.shawntabrizi.com/substrate-js-utilities/](https://www.shawntabrizi.com/substrate-js-utilities/) that allow people to quickly calculate the `blake2_128_concat` or `twox_64_concat` of some arbitrary string or hex bytes. Try out these examples on your own and see for yourself the advantages that these new transparent storage keys bring to you.

As always, if you enjoy the content I write, you can send me a friendly tip on my [donations page](https://www.shawntabrizi.com/donate/).
