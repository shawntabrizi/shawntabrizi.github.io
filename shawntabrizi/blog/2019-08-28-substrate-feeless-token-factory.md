---
title: Substrate Feeless Token Factory
date: 2019-08-28T16:14:03-08:00
authors: shawntabrizi
layout: post
permalink: /substrate/substrate-feeless-token-factory/
categories:
  - Substrate
tags:
  - runtime
  - module
  - erc20
  - fee
  - gas
  - token
  - ethberlin
  - hackathon
github: substrate-feeless-token-factory
---

##### In this post, I will share the [Hackathon project](https://github.com/shawntabrizi/substrate-feeless-token-factory) I worked on for ETHBerlin 2019, where we built a Substrate blockchain that supports generating fungible tokens that can be transferred without end-users paying fees.

Ethereum has shown itself to be the ultimate platform for building token economies. Thousands of contracts have been created which support standards like ERC20 and ERC721.

However, businesses using Ethereum have struggled adopting new users into the ecosystem due to the upfront costs of Gas to interact with these token contracts. Many newcomers do not understand why they need ETH to be able to interact with other tokens they actually are interested in.

Businesses have shown that they would be more than happy to fund the usage of their users. Some have done this by providing a faucet or ETH drop to their users, while others have implemented layer 2 solutions or have made compromises building centralized solutions.

## A "Feeless" Token Factory

The [Substrate Feeless Token Factory](https://github.com/shawntabrizi/substrate-feeless-token-factory) (SFTF) removes the pains and costs of token transfer fees from end users, by offloading those costs onto the token creators and community contributors who want to support a particular token.

Transaction fees are used as a mechanism to prevent denial-of-service attacks on public blockchain systems. SFTF is a blockchain level protocol, developed on top of the Substrate blockchain framework, which provides an alternative mechanism for transfer fees on tokens, while still preventing nominal attack vectors. In short, each token built on the network is backed by a fund of the native blockchain currency. This fund is ultimately used to pay for the transfers of that token, on behalf of the user.

Any user can deposit funds into the pot for a token, but we think that most often, it will be the token creator who will be most incentivized to fund their users to transfer and spend their tokens. Users are enabled only a certain number of free transfers per token within a given time period. These transfers are enabled by an extension of the standard ERC20 token API, introducing a `try_free_transfer` function which can allow a user to make a free transfer if underlying conditions are met.

Let's take a look at a hypothetical example: the "Better Energy Foundation" wants to issue a new token to be used as electricity credits. When they do this, they fund the token with an initial supply of the underlying blockchain currency (10,000,000 units), and specify that the users of their token have 10 free transactions every 1,000 blocks. They can sell their tokens and transfer them to the buyers just like a normal ICO. These buyers can then call the `try_free_transfer` function when trying to trade the token among their peers, and the fees are paid for using the fund. Assuming the underlying transfer fee being charged to the pot is 1 unit per transfer, the "Better Energy Foundation" has just supported millions of "free" transfers of their token. Anyone in the community can continue to add more funds, and allow the free transfers to continue when the funds start to dry up. If a user does not have any more "free" transactions left, or if the fund is empty, they can always make a transaction using the normal `transfer` function which will charge them a normal transaction fee directly from their own account.

## Design

First we designed a runtime module which acts as a normal ERC20 compatible token _factory_, this mean the module supports the creation of any number of different fungible tokens. This was mostly based on the [`srml-assets` module](https://github.com/paritytech/substrate/tree/master/frame/assets), but extended to expose an API which matches that of an ERC20 token: transfers on-behalf-of and allowances. We kept the token factory constructor simple by having the user mint all token up front into their own account, and controlling distribution manually.

Without touching any of the fee mechanisms, this module is basically a replacement for any number of ERC20 token contracts, but built at the Substrate runtime level, which should be more efficient and cost effective for everyone.

### Removing Fees

At that point, we needed to remove fees from the runtime module. At the moment, Substrate runtime fees are controlled in two areas:

1. The [Balances module](https://github.com/paritytech/substrate/blob/v1.0/srml/balances/src/lib.rs), which defines a `TransactionBaseFee` and `TransactionByteFee`.
2. The [weight annotation](https://github.com/paritytech/substrate/pull/3157), which allows you to control fees for an individual runtime function.

We configured our runtime such that both the `TransactionBaseFee` and the `TransactionByteFee` would be set to 0:

```
pub const TransactionBaseFee: u128 = 0;
pub const TransactionByteFee: u128 = 0;
```

> NOTE: I think in the long term, the fees within the Balances module will be completely removed in favor of weight annotations. For the time being, weight annotations do not support the concept of "per byte fee", which is why I think it is still around.

Originally, we thought this might be all that is needed to remove fees from our Runtime, however, if we do not specify a weight annotation for a runtime function, it is automatically assigned a default value:

[**sr-primitives/weights**](https://github.com/paritytech/substrate/blob/master/frame/support/src/weights.rs)

```rust
impl Default for SimpleDispatchInfo {
  fn default() -> Self {
    // Default weight of all transactions.
    SimpleDispatchInfo::FixedNormal(10_000)
  }
}
```

So what we actually need to do is label our function(s) explicitly with a zero weight tag:

```rust
#[weight = SimpleDispatchInfo::FixedNormal(0)]
fn my_free_function(origin, ...) { ... }
```

We really only wanted to remove fees from the `transfer` function, not necessarily the other parts of the ERC20 API, so we decided to create a new function `try_free_transfer` which would have a fee of zero, and the additional functionality needed to protect our chain from malicious attacks.

### Protecting Our Chain

The whole reason there are transfer fees on the blockchain is to protect the network from attackers who would be able to perform a denial-of-service attacks and spam the network with transactions. So, if we choose to remove the base fees from our transfer function, we would need to implement a new solution to prevent attacks to our chain.

Here is where you could get very clever, and someone with much more research and knowledge into game theory would probably come up with some really interesting solutions. But we were not those people, and we only had 1 day to build our solution, so we addressed this issue in the simplest way we could think of.

We know that businesses and organizations are the number one user of creating these tokenized assets. Usually they make a huge profit through an ICO and further development of their company. As a result, we predict in most cases they would happily eat any and all costs of fees related to using their token. So, we created an open fund for each token, where the standard token fee will be burned from that fund rather than the individuals who are transferring tokens. While this pot can obviously be funded by the token creators, we allowed open contributions to the pot in order to allow any community members who want to support a token to be able to do so.

To support this new functionality, we continued to develop our API to support an initial contribution when the token is created, and a `deposit` function allowing users to place funds in the pot for a token. If at any point the funds for a token is depleted, the fund can be replenished through new deposits. Futhermore, because we created a separate function for free transfers, we can still support the standard `transfer` function which has a standard fee and allows users to still use a token even when the fund is zero. Really, all these feeless transfer stuff is all extra functionality that is built on top of the token factory, which already works on its own!

One last point of friction we introduced was a limit per user, per token, per time period on how many transfers can be made. This prevents a malicious user from simply spending all of the pot by making frivolous transfers. This mechanism is still vulnerable to a [Sybil attack](https://en.wikipedia.org/wiki/Sybil_attack), where you can imagine an attacker generates millions of accounts and has account 1 send tokens to account 2, who sends tokens to account 3, etc...

However, this is hopefully thwarted by the need for an existential deposit of the base blockchain currency to make an active account. This existential deposit limit could be adjusted in order to provide the needed friction to prevent a single user from having too many accounts. Again, this initial existential deposit could be provided by the companies that want to support their users to use their tokens, and since there are no fees, only the minimum amount is needed to be given to a user, and only one time per user.

I think that the design here has lots of room for improvement, and there are likely a lot of different ways we could prevent malicious attacks on individual token funds, but for the hackathon, I felt that this was a reasonable first step.

## Substrate Patterns

Having gone over all the details of how we designed the SFTF, I want to review a few of the specific implementation details which hopefully convey reusable design patterns for other Substrate runtime modules.

### Module Funds

The main aspect of our feeless token is creating a fund for each token. Ultimately these funds will need to be controlled and managed by our module.

To do this, we create a unique identifier for our module, and use this to generate new accounts for the funds:

```rust
const MODULE_ID: ModuleId =ModuleId(*b"coinfund");

impl<T: Trait> Module<T> {
  pub fn fund_account_id(index: T::TokenId) -> T::AccountId {
    MODULE_ID.into_sub_account(index)
  }
}
```

Using the `into_sub_account` function, we can actually use the unique module id we created to generate any number of unique `AccountIds` which can then represent the funds for each of the tokens.

To then fund these accounts, we simply call the Balances module's `transfer` function, just like you would transfer to any other account:

```rust
fn deposit(origin, #[compact] token_id: T::TokenId, #[compact] value: BalanceOf<T>) {
  let who = ensure_signed(origin)?;
  ensure!(Self::count() > token_id, "Non-existent token");
  T::Currency::transfer(&who, &Self::fund_account_id(token_id), value)?;

  Self::deposit_event(RawEvent::Deposit(token_id, who, value));
}
```

Since funds for different tokens are separated, we don't really need to do fancy tracking of the funds for each account. Instead, we can rely on the Balances module to do that for us! In our `try_free_transfer` function, we do the following:

```rust
// Burn fees from funds
let fund_account = Self::fund_account_id(id);
let fund_fee = T::FundTransferFee::get();
let _ = T::Currency::withdraw(&fund_account, fund_fee, WithdrawReason::Transfer, ExistenceRequirement::AllowDeath)?;
```

If the `withdraw` call fails, then the token does not have enough funds, and we simply fail to complete the `try_free_transfer`. Easy as pie.

### Tracking Transfers Per Time Period

One of the more challenging tricks we had to implement for this runtime module was a storage structure which would allow us to track how many time each user transferred a particular token in a given time period. If we simply wanted to count the total number of transfers, we would be able to create a regular map like so:

```rust
TotalTransferCount get(total_transfer_count): map (T::TokenId, T::AccountId) => u64;
```

However, since we want to reset this count after a certain time period, this is not good enough. To use this regular map in this way, we would need to track each user which spent tokens in a time period, and which tokens they spent, and then we would need to do some unbounded loop over this mapping in order to clear all the entries. This is a big no-no.

The trick here is to take advantage of the `StorageDoubleMap`, which is just a map nested within a map. Most importantly, the `StorageDoubleMap` API provides the ability to clear all entries under a key in the top level map through `remove_prefix`. This means that I simply need to create a `double_map` where the first key is "fixed" (essentially treating the `double_map` as a regular `map`), and then call `remove_prefix` on that fixed first key when I want to clear all entries. This will clean up all of the data in our map without having to do a loop, which we know is generally a runtime sin.

Here is what the double map declaration looks like:

```rust
FreeTransferCount get(free_transfer_count): double_map (), blake2_128((T::TokenId, T::AccountId)) => T::TokenFreeTransfers;
```

When we want to keep track of the user's free transfers, we simply update the storage item like so:

```rust
let free_transfer_count = Self::free_transfer_count(&(), &(id, sender.clone()));
let new_free_transfer_count = free_transfer_count
  .checked_add(&One::one()).ok_or("overflow when counting new transfer")?;

...

<FreeTransferCount<T>>::insert(&(), &(id, sender), &new_free_transfer_count);
```

Finally, when we want to clean up all the tracking and start fresh, we simply call the magical `remove_prefix` API:

```rust
// This function is called at the beginning of every block
fn on_initialize(n: T::BlockNumber) {
  // Check is `true` every `FreeTransferPeriod` number of blocks
  if n % T::FreeTransferPeriod::get() == Zero::zero() {
    // Reset everyone's free transfer count
    <FreeTransferCount<T>>::remove_prefix(&());
  }
}
```

I would hope in the future, the `StorageMap` and `StorageDoubleMap` will implement a `kill` function like the `StorageValue` item has, which would allow a user to easily clear all entries of the mapping. It could even use this trick under the hood! However, it is unclear to me if there are significant costs to doing things this way. ¯\\_(ツ)_/¯

## Next Steps

Because the hackathon is so short, and we were teaching new developers to start building on Substrate, the full potential of this idea was not created, nor was it even conceived. There is so much more potential for exploring how Substrate can enable "feeless" token transfers given that you have full control at the runtime level of how your blockchain operates. This is not feature that you would get with any open smart contract platform.

A few ideas which could further this project are:

* Upgrade the token API to support ERC1155, thus also supporting non-fungible tokens.
* Allow payment of token transfers with the custom token rather than the underlying blockchain currency.

    > We actually mostly did this in the SFTF by implementing `SignedExtension` for a custom `TakeTokenFees` struct. This has logic which transfers a token from the user to the block author, and increases the priority of the transaction. However, limitations of easily generating the correct extrinsic format meant that it would not work in time for the hackathon.

* Allow a small proof of work to replace the cost of transferring the token.
* Create a ban list of users who are not allowed to use any free transfer funds.
* Build a decentralized token exchange module which supports tokens generated from the factory.

Do you have good ideas? Open an issue on the [Substrate Feeless Token Factory](https://github.com/shawntabrizi/substrate-feeless-token-factory/) repository!

As always, if you enjoy this content and want to support me in continuing to write new posts, check out my [donations page](https://shawntabrizi.com/donate/).
