---
title: Substrate Weights and Fees
date: 2020-02-27T16:14:03-08:00
authors: shawntabrizi
layout: post
slug: /substrate/substrate-weight-and-fees/
categories:
  - Substrate
tags:
  - weight
  - transaction
  - fee
  - benchmark
  - substrate
---

##### This is the first in a series of posts explaining our philosophy toward benchmarking and assigning weights to Substrate pallets for the imminent launch of the Polkadot network.

For the past couple of weeks, I have been working hard creating and executing a plan around weighing extrinsic functions across our different FRAME pallets so that we can launch the Polkadot network.

There are a few overall goals that we want to accomplish with this task:

1. Provide computational limits and thresholds for block producers on the network.
2. Provide economic security such that malicious actors would not be able to profitably attack the network.
3. Identify and redesign extrinsics which have non-linear complexity.
4. Improve the runtime architecture to reduce overall complexity.

To follow along this journey, you must first understand what "weights" are in Substrate, and how they are related to the more commonly understood fee system.

## Weights

If you are unfamiliar with weights, the TL;DR is that a Substrate blockchains have limited resources when it comes to producing new blocks. Most notably, there is a limited window for block producers to create a block, limited amount of data that can be included per block ([`MaximumBlockLength`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.MaximumBlockLength)), and an overall practical limit to the storage footprint of the blockchain.

Substrate has introduced a Weight system that allows the runtime developer to tell the block production process how "heavy" an extrinsic is. Given some [`MaximumBlockWeight`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.MaximumBlockWeight), and the weight of the individual extrinsics in a transaction pool, we can select the set of extrinsics that allow us to saturate our block, while not going over the limits.

On top of this basic idea, Substrate has additionally introduced a configurable [`AvailableBlockRatio`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.AvailableBlockRatio) which ensures that only a portion of the total `MaximumBlockWeight` is used for regular transactions. This also introduces the concept of _operational transactions_ which are system critical operations that can use the rest of the available block weight.

### Example

Let's say a `balance_transfer` has weight 1,000, and our Substrate chain is configured to a maximum block weight of 1,000,000, with an available block ratio of 20%.

This means we would be able to include at most:

    1,000,000 * .20 / 1,000 = 200 transfers per block

For more details on weights, read our doc: [https://substrate.dev/docs/en/conceptual/runtime/weight](https://substrate.dev/docs/en/conceptual/runtime/weight)

## Fees

To bring the weight system to the users of our blockchain, Substrate introduces a tightly coupled fee system. In short, users will pay a transaction fee proportional to the weight of the call they are making.

    total_fee = base_fee + length_fee + weight_fee

> Note: There is also a length_fee which takes into account the amount of data included in an extrinsic.

As a pallet developer writing new dispatchable functions, the fee system should mostly be abstract to you, and instead you should primarily think in terms of weights.

For more details on fees, read our doc: [https://substrate.dev/docs/en/development/module/fees](https://substrate.dev/docs/en/development/module/fees)

## Runtime Development

As a runtime developer, it is your goal to:

- Minimize the computational and resource complexity of runtime functions.
- Accurately calculate the relative weight of your runtime functions.

We can accomplish this in three steps:

1. Follow best practices when writing a runtime.
2. Accurately document the computational complexity introduced by runtime functions.
3. Empirically measure the real world cost of running these functions, and associate those measurements back to our computational complexity.

It is beyond the scope of any single blog post to explain all the best practices when it comes to runtime development, but we can start to touch on (2) and follow up and talk more about how to approach (3).

### Documentation of Weights

Dispatchable functions within a FRAME pallet should contain documentation about the computational and resource complexity of the function. The result of weight documentation is to arrive at a final [order of a function](https://en.wikipedia.org/wiki/Big_O_notation). Such as:

```
O(A + logA + BlogC)
```

This should serve as a resource to accurately measure the weight of different functions across all possible inputs, something we would not reasonably able to measure otherwise.

#### What to Document

Your weight documentation should include information about your runtime function which has notable execution costs. For example:

- Storage Operations (read, write, mutate, etc...)
- Codec Operations (serializing/deserializing vecs or large structs)
- Search / Sort / Notable Computation
- Calls to other pallet functions (i.e. reserving some balance through the Currency trait)

We will work off the following example function:

```rust
// Join a group of members.
fn join(origin) {
	let who = ensure_signed(origin)?;
	let deposit = T::Deposit::get(); // configuration constant
	let sorted_members: Vec<T::AccountId> = Self::members();
	ensure!(sorted_members.len() <= 100, "Membership Full");
	match sorted_members.binary_search(&who) {
		// User is not a member.
		Err(i) => {
			T::Currency::reserve(&who, deposit)?;
			members.insert(i, who.clone());
			<Members<T>>::put(sorted_members);
			Ok(())
		},
		// User is already a member, do nothing.
		Ok(_) => Ok(()),
	}
	Self::deposit_event(RawEvent::Joined(who));
}
```

#### Storage and Codec Operations

Accessing storage is a heavy operation, and one that should be well documented and optimized in favor writing "functional code". See [Best Practices](https://www.notion.so/paritytechnologies/Weights-8c916536949b47f299eed1302b6a2074?p=c5aafd34578f4be9ab8c8d7510e98314&showMoveTo=true#best-practices).

The each storage operation should be documented with the relative codec complexity of interacting with that storage.

For example, if you are reading a vector of members from a single value storage item, the weight documentation should read:

    - One storage read to get the members of this pallet: `O(M)`.

In this case reading the vector from storage has a codec complexity of `O(M)` to deserialize the `M` member accounts in the vector.

Later in your module, you might go ahead and write the data back into the runtime, which should also be documented:

    - One storage write to update the members of this pallet: `O(M)`.

#### Search, Sort, and Notable Computations

If you need to search or sort in your runtime module, it is also important to note the relative complexity of those operations.

For example, if you are searching for an item in a sorted list, a `binary_search` operation should take `O(logM)`, while an unsorted list, should take `O(M)`.

So the documentation may look like:

    - Insert a new member into sorted list: O(logM).

This kind of documentation should be present for any sort of notable heavy computation present in your logic.

#### Calls to Other Pallets and Traits

The computational complexity of your function may extend beyond your pallet. If you call other FRAME pallets either directly or through Trait configurations, you should take note of that, and assign these calls with their own variable.

For example, if you write a function which reserves some balance in the Balances pallet or emits an event through the System pallet, you should document:

    - One balance reserve operation: O(B)
    - One event emitted: O(E)

#### Combining the Data

Once you have good documentation for your runtime function, you need to consolidate it into a _single overall order of the function_.Lets combine the different example operations to create a full end to end example.

```text
# <weight>
Key: M (len of members), B (reserve balance), E (event)
- One storage read to get the members of this pallet: `O(M)`.
- One balance reserve operation: O(B)
- Insert a new member into sorted list: O(logM).
- One storage write to update the members of this pallet: `O(M)`.
- One event emitted: O(E)

Total Complexity: O(M + logM + B + E)
# </weight>
```

> Note: You may have introduced multiple different variables into your overall weight documentation, so be sure to document what these variables represent.

If you look at this example, you can see we had two operations that were O(M) (the storage read and write), but our overall order does not take this into account.

**When doing empirical testing, we are unable to separate complexities which have the same order**. This means that there could be many many more operations added to this function, of order `O(M)`, `O(logM`), etc.. but it would not change our final formula as a function of `M`, `B`, and `E`:

    weight(M, B, E) = K_1 + K_2 * M + K_3 * logM + B + E

The difference between two functions with the same order will be empirically measured through on-chain tests. The goal of this step is to simply derive the coefficients (`K`) that we will be searching for when we do the [next step](https://www.notion.so/paritytechnologies/Weights-8c916536949b47f299eed1302b6a2074?p=c5aafd34578f4be9ab8c8d7510e98314&showMoveTo=true#measuring-weights).

## Summary

So hopefully now you can see how we can approach runtime code, and from it, derive a theoretical order of complexity. The next step after this is to actually run benchmarks for these different extrinsics, and start collecting data that we can map back to these derived formulas.

If you enjoy this content and want to see the next post where we dive deeper into actually benchmarking the runtime, consider taking a look at my [donations page](https://shawntabrizi.com/donate/) to see how you can support me.
