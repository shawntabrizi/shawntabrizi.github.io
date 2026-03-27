---
title: The Merge of ink! and FRAME
date: 2022-08-11
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - frame
  - ink
  - polkadot
  - devex
  - smart contract
---

##### In this post, I propose a better developer experience and pathway for developers in the Polkadot ecosystem by merging the development language used for ink! smart contracts and FRAME pallets.

![Pathway for a developer](/assets/images/the-merge.jpeg)

ink! and FRAME are two Rust based languages developed by Parity for developing state transition functions. The first focuses on smart contracts, and the second focuses on the blockchain runtime.

Both of these languages heavily rely on Rust macros which form an eDSL for developing these decentralized applications.

### Vision

In short, I believe that Wasm Smart Contract and Substrate Runtime development could use a single shared language, and we could continue to brand that language as ink!.

ink! will be a general language for developing decentralized applications in the Substrate / Polkadot ecosystem.

### Why

Here are some of the reasons why a merge of ink! and FRAME would be valuable to us and our ecosystem.

#### Reduced Onboarding Costs

Parity is working on developing two distinct developer communities at the moment: ink! Smart Contract Developers and FRAME Runtime Developers.

Practically speaking these two communities do not share much besides working within the Substrate / Polkadot ecosystem, and building decentralized applications in Rust.

There is a great potential opportunity to combine these ecosystems, and have them work together on a single shared goal.

Imagine you go to a conference, and rather than there being multiple different workshops on ink! and FRAME, there is instead a single set of workshops on a single language with different levels of difficulty, ranging from contract development, to basic runtime development, to advance runtime development.

Documentation, videos, and everything else related to education become more simple, and from this, we will reduce the costs of onboarding new developers into our ecosystem.

#### Raw Speed Improvements

One of the original sells of Polkadot is to provide a scalability solution to contract developers that feel limited by a single contract chain.

It is likely that ink! contract developers will face similar scaling issues on their layer 1 chains as other parachains.

We know that by simply running code within the Substrate runtime environment, we can get "off the chart" performance increases.

![Pathway for a developer](/assets/images/execution-time.png)

> In the graph above, smaller is better.


#### Parachain Lifecycle

Another problem we can solve here making development on Polkadot more approachable.

Currently, a developer in the Polkadot ecosystem basically needs to believe that their idea is good enough to build a whole team, win a parachain slot, launch, and maintain.

There is basically no room here for simply experimenting with the technology. Allowing users to write a contract, knowing that they can one day use that same code to then launch a parathread or parachain is a great sell for people to feel that even small investments in our ecosystem are worthwhile.

The story becomes:

* Do you have an idea?
    * Make a contract! Try it out! Fast, easy, and nearly zero overhead for you.
* Did you validate your idea with a contract?
    * Upgrade to a parathread! Get the blazing speeds of working in the runtime, with little to no additional coding required! We can even help you migrate your contract data to a parathread.
* Is your parathread going viral?
    * Upgrade it to a parachain! Guarantee your cost of business over the next 2 years.


### How

I claim that every ink! Smart Contract is a valid Substrate Runtime. That is, the set of applications you can develop with ink! is a strict subset of the set of applications you can build with FRAME.

At a high level, both languages break down application development into these components:

* Storage
* Calls / Messages
* Events
* Errors
* Origin / Caller
* etc...

#### ink! Example

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod flipper {
    #[ink(storage)]
    pub struct Flipper {
        value: bool,
    }

    impl Flipper {
        /// Creates a new flipper smart contract initialized with the given value.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        /// Creates a new flipper smart contract initialized to `false`.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(Default::default())
        }

        /// Flips the current value of the Flipper's boolean.
        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        /// Returns the current value of the Flipper's boolean.
        #[ink(message)]
        pub fn get(&self) -> bool {
            self.value
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink_lang as ink;

        #[ink::test]
        fn default_works() {
            let flipper = Flipper::default();
            assert!(!flipper.get());
        }

        #[ink::test]
        fn it_works() {
            let mut flipper = Flipper::new(false);
            assert!(!flipper.get());
            flipper.flip();
            assert!(flipper.get());
        }
    }
}
```

#### FRAME Example

```rust
#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[cfg(test)]
mod mock;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	#[pallet::config]
	pub trait Config: frame_system::Config {}

	#[pallet::storage]
	pub type Flipper<T> = StorageValue<_, bool, ValueQuery>;

	#[pallet::genesis_config]
	pub struct GenesisConfig {
		pub start_value: bool,
	}

	#[cfg(feature = "std")]
	impl Default for GenesisConfig {
		fn default() -> Self {
			Self { start_value: false }
		}
	}

	#[pallet::genesis_build]
	impl<T: Config> GenesisBuild<T> for GenesisConfig {
		fn build(&self) {
			Flipper::<T>::set(self.start_value)
		}
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::weight(10_000 + T::DbWeight::get().writes(1))]
		pub fn flip(_origin: OriginFor<T>) -> DispatchResult {
			Flipper::<T>::mutate(|value| *value = !*value);
			Ok(())
		}
	}
}

#[cfg(test)]
use crate::mock::{new_test_ext, Origin, TemplateModule, Test as T};

#[test]
fn default_works() {
	new_test_ext().execute_with(|| {
		assert!(!Flipper::<T>::get());
	});
}

#[test]
fn it_works() {
	new_test_ext().execute_with(|| {
		assert!(!Flipper::<T>::get());
		assert!(TemplateModule::flip(Origin::signed(1)).is_ok());
		assert!(Flipper::<T>::get());
	});
}
```

These components are simplified and exposed to the user in an expected syntax. This eDSL is then parsed by the macro, and then regular Rust code is generated in the background, which calls low level apis that access the underlying VM environment.

My (naive) belief is that we can manipulate these macros to basically fork the underlying generated code whether

```
                                  ┌───────────────┐
                                  │               │
                                  │   ink! dApp   │
                                  │   ─────────   │
                                  │   Storage     │
                                  │   Calls       │
                                  │   Events      │
                                  │   Errors      │
                                  │   etc...      │
                                  │               │
                                  └───────┬───────┘
                                          │
                                          │
                                          │
┌──────────────────────┐                  │                   ┌──────────────────────┐
│ Target Contracts API │                  ▼                   │   Target FRAME API   │
│ ──────────────────── │                                      │ ──────────────────── │
│                      │ ◄── ink::contract or ink::pallet ──► │ sp-io w/ hashed keys │
│                      │                                      │ dispatchable trait   │
│                      │                                      │ outer event enum     │
│                      │                                      │ dispatchable error   │
│                      │                                      │                      │
│                      │                                      │                      │
│                      │                                      │                      │
│                      │                                      │                      │
└──────────────────────┘                                      └──────────────────────┘

```

In the case where someone built an ink! smart contract, without any changes (maybe just benchmarks), we should be able to compile it to a Substrate Runtime.


### Concerns

- Is it possible?
- Is it maintainable?
- Contracts are immutable by nature, where pallets are not
- Polkadot does not treat contracts as a first class entity today, should the narrative change?

### Known Problems

- weights / metering
- hooks
- runtime config
- coupling of pallets / contracts
- low level api calls (specific to runtime or contract)
- The `<T>` runtime
- Potentially multi-ink things cannot easily talk to each other (contract and pallet have a hard time to talk to each other)
- Release strategy (upgrades are harder in ink!)
- No errors with data
- panics!
