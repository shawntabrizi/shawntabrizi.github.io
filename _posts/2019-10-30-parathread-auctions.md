---
title: Parathread Auctions
date: 2019-10-29T16:14:03-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/parathread-auctions/
categories:
  - Substrate
tags:
  - runtime
  - module
  - transaction queue
  - tips
  - fees
  - signed extensions
  - parathread
  - auction
---

##### In this post, I will break down how the Polkadot relay chain supports Parathread auctions using Substrate's signed extensions feature.

Parathreads are an exciting new feature [recently announced](https://polkadot.network/parathreads-parathreads-pay-as-you-go-parachains/) for the Polkadot network. It allows blockchain projects which may not have the funds for a full parachain slot to still participate in this next generation network.

I want to highlight a really clever mechanism that was implemented into Polkadot that enables parathreads to bid for a spot to finalize a block on the relay chain. We will talk about:

* Parathread Auction Mechanics
* Substrate Signed Extensions
* Transaction Tips
* Transaction Queue

## Parathread Auctions

So what is a parathread anyway?

![Parathread Pool](/assets/images/parathread-pool.png)

Parathreads are almost literally the same as parachains throughout the Polkadot codebase. Both parathreads and parachains are given a unique identifier called a `ParaId`. The only real difference is that parathreads are marked as having a `Dynamic` schedule, whereas parachains are `Always` scheduled.

This mean that each block, parachains are guaranteed to have a spot available on the relay chain. But there may be extra availability beyond the

So how do we


## Signed Extensions

Substrate comes with a very generic transaction queue. As mentioned in my [previous posts](), the only assumptions it makes is that there is a _weight_ and a set of prerequisite _tags_ that are used to create dependency graphs. However, through your individual runtime modules, you can add additional logic which is executed by the transaction queue in order to validate or throw away incoming transactions.

This is handled by Substrate's signed extensions feature:

> Means by which a transaction may be extended. This type embodies both the data and the logic that should be additionally associated with the transaction.

A transaction's signed extension has access to data like the `AccountId` of the calling user, the extrinsic function that is being called, 

### Validation Function

A validation function is called by the transaction queue to determine if a transaction is... valid or not. The validation function has access to all parts of the runtime including storage, Ultimately, it returns `TransactionValidity`:

```rust
/// Information on a transaction's validity and, if valid, on how it relates to other transactions.
pub type TransactionValidity = Result<ValidTransaction, TransactionValidityError>;
```

An invalid transaction can include why the transaction was found to be invalid through the `TransactionValidityError`:

* `Call`: The call of the transaction is not expected.
* `Payment`: General error to do with the inability to pay some fees (e.g. account balance too low).
* `Future`: General error to do with the transaction not yet being valid (e.g. nonce too high).
* `Stale`: General error to do with the transaction being outdated (e.g. nonce too low).
* `BadProof`: General error to do with the transaction's proofs (e.g. signature).
* `AncientBirthBlock`: The transaction birth block is ancient.
* `ExhaustsResources`: The transaction might be valid, but there are not enough resources left in the current block.
* `Custom(u8)`: Any other custom invalid validity that is not covered by this enum.

But if a transaction is valid, it can also provide controlling data about the transaction which the queue will continue to use:

* `priority`: Priority determines the ordering of two transactions that have all their dependencies (required tags) satisfied.
* `requires`: A non-empty list signifies that some other transactions which provide given tags are required to be included before that one.
* `provides`: A list of tags this transaction provides. Successfully importing the transaction will enable other transactions that depend on (require) those tags to be included as well. Provided and required tags allow Substrate to build a dependency graph of transactions and import them in the right (linear) order.
* `longevity`: Longevity describes minimum number of blocks the validity is correct. After this period transaction should be removed from the pool or revalidated.
* `propagate`: A flag indicating if the transaction should be propagated to other peers.

## Transaction Tips

So let's take a look at how this validation function is used 
