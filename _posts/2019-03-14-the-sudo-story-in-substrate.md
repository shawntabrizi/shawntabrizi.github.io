---
title: The Sudo Story in Substrate
date: 2019-03-14T09:05:44-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/the-sudo-story-in-substrate/
categories:
  - Substrate
---

##### In this post, I will explain how the Sudo module is used to access permissioned functions in Substrate.

If you have ever run a local Substrate node for testing or development, you have probably interacted with the Sudo module. More specifically, you might have noticed that the "Alice" account is special, and can do powerful things to your blockchain!

In this blog post, I will show you end to end how the Sudo module works, why "Alice" is able to use this module, and how it enables access to permissioned functions like the one which enables Substrate runtime upgrades.

## What is Sudo?

> `sudo` is a program for Unix-like computer operating systems that allows users to run programs with the security privileges of another user, by default the **superuser**. It originally stood for "superuser do"...
>
> -- <cite>Wikipedia</cite>

In short, `sudo` is a term used to represent the execution of some highly privileged operation by some highly privileged user. If you are trying to relate this to smart contracts on Ethereum, this is very similar to [the "contract owner"](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol), an account who is allowed to call `onlyOwner` functions.

## The Sudo Module

The Substrate runtime module library (SRML) provides a Sudo module which provides this same functionality, but at the runtime level of your blockchain. At the time of writing this post, the Sudo module is [only 60 lines of code](https://github.com/paritytech/substrate/blob/master/srml/sudo/src/lib.rs), so you can easily look through the source code yourself to understand exactly what it does. But I will break it down for you just in case you are unfamiliar with the structure of Runtime modules.

### The Sudo Key

The Sudo module has a single storage item: the "Sudo key".

```rust
decl_storage! {
	trait Store for Module<T: Trait> as Sudo {
		/// The `AccountId` of the sudo key.
		Key get(key) config(): T::AccountId;
	}
}
```

This holds the `AccountId` of the person who is the "superuser" of your blockchain. Notice that it has the `config()` parameter, which means that this value can be set using the "genesis configuration" of your blockchain. We will talk about that more below.

### The Sudo Module Functions

The Sudo module has two dispatchable functions which allow users to interact with the module.

The first function available in the Sudo module is `set_key(origin, new)`, which allows only the Sudo key to change who the Sudo key is. This is not that interesting, so we won't go into details. 

The second function is `sudo(origin, proposal)`, which allows only the Sudo key to dispatch a privileged call. This authorization check is done in the first two lines of the function:

```rust
let sender = ensure_signed(origin)?;
ensure!(sender == Self::key(), "only the current sudo key can sudo");
```

Then the function dispatches actually happens:

```rust
let ok = proposal.dispatch(system::RawOrigin::Root.into()).is_ok();
```

There are a few different things to note about this innocuous line:

* The `proposal` variable is another dispatchable function within your runtime, and is accepted as an input to the `sudo` function.
* This `proposal` is called using `system::RawOrigin::Root`, which defines the _new_ origin for the downstream call.

At this point, you might be asking "What does this whole `RawOrigin::Root` mean?"

## Privileged Functions

The Sudo module wouldn't do much unless there were also "sudo-able" functions, and that is precisely what we will talk about next.

Substrate has the concept of "Privileged Functions" which are functions which specifically require `Root` origin. The `origin` of a call describes where the call has come from, and every dispatchable function should check at the beginning of the function that the call origin matches what is expected. The origin could be `Signed` as it was in the Sudo module, which represents a basic signed transaction, but Substrate also provides a `Root` origin which describes a call that comes from _within_ the runtime itself. There is no way to produce a `Root` origin other than through internal runtime logic, and as such, we can treat functions that require this origin as privileged functions.

This is what a privileged function look like:

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        pub fn privileged_function(origin) -> Result {
            ensure_root(origin)?;
            // do something...
            Ok(())
        }
    }
}
```

However, macro magic makes this a bit more confusing. Generally, there is a rule for dispatchable functions where the first parameter must always be `origin`. However, when using the `decl_module!` macro, if you omit the `origin` parameter, then it will be added automatically, and `ensure_root(origin)?` will also be added. So an equivalent way to write the `privileged_function` above would be:

```rust
pub fn privileged_function() -> Result {
    // do something...
    Ok(())
}
```

So these kinds of functions will only be callable by internal runtime logic like what is implemented in the Sudo module.

## A Substrate Runtime Upgrade

So let's take a look at a real privileged function which is available within most Substrate runtimes, the runtime upgrade. From the [Consensus module](https://github.com/paritytech/substrate/blob/master/srml/consensus/src/lib.rs):

```rust
/// Set the new code.
pub fn set_code(new: Vec<u8>) {
    storage::unhashed::put_raw(well_known_keys::CODE, &new);
}
```

This single line of logic is enough to power the entire "upgrade" feature of Substrate forkless runtime upgrades. This privileged function checks that the caller must have `Root` origin, thanks to the `decl_module!` macro, then it puts the Wasm bytecode into a `well_known_key` called `CODE`.

Thus, when you use something like the Polkadot UI to do a runtime upgrade, it will look like this:

![](/assets/images/img_5ccc8f228649c.png)

Walking through the UI you will see that:

* We are making a transaction using "Alice", who has been set as the Sudo key.
* We are calling the `sudo` function of the Sudo module.
* The proposal we are making is the `setCode` function of the Consensus module.
* Of which the input to `setCode` is the `wasm` file for our new runtime.

When this transaction is dispatched, the following logic is executed:

1. The `sudo` function checks that "Alice" is the Sudo key.
2. She is, so the rest of the function runs.
3. A `Root` origin call is dispatched to the `setCode` function.
4. The `setCode` function checks that the origin is `Root`.
5. It is, so the rest of the function runs.
6. The storage value is updated for the `CODE` well known key.

And that is the magic of the Sudo module! The last thing we should probably talk about is how "Alice" became the Sudo module to begin with, and for that we need to look at the genesis configuration of our blockchain.

## Initializing the Sudo key

Have you wondered why your substrate test network gives "Alice" a bunch of initial "balance units" and makes her the Sudo key for your runtime? Well, this is all controlled in your blockchain genesis configuration which is defined in a file called [`chain_spec.rs`](https://github.com/paritytech/substrate/blob/master/node-template/src/chain_spec.rs).

We can see that this code ultimately creates a `GenesisConfig` object with the following initial setting:

```rust
sudo: Some(SudoConfig {
    key: root_key,
}),
```

If we follow the logic back, this `root_key` is defined as `account_key("Alice")` which generates an `AccountId` using the seed string "Alice".

```rust
fn account_key(s: &str) -> AccountId {
    sr25519::Pair::from_string(&format!("//{}", s), None)
        .expect("static values are valid; qed")
        .public()
}
```

This works great for test networks since "Alice" can be treated as a well known account that is automatically configured in your UI. However, for a real network, this is probably not what you want to do. Instead, you should pass an `AccountId` directly to this genesis configuration, and keep the seed for this account VERY secret.

![](/assets/images/img_5ccc92f09f522.png)

## The End

That is the entire sudo story in Substrate. I hope you learned something new and that this shed light to some of the things happening behind the scenes of Substrate runtimes.

If you enjoyed this content and want to support me producing more, feel free to check out my [donation page](https://shawntabrizi.com/donate/).
