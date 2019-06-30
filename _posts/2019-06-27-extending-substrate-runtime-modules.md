---
title: Extending Substrate Runtime Modules
date: 2019-06-27T16:14:03-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/extending-substrate-runtime-modules/
categories:
  - Substrate
tags:
  - runtime
  - module
  - rust
  - sudo
  - contracts
  - ink
github: sudo-contract
---

##### In this post, I will show you how you can extend the SRML Contracts module to add additional authorization layers to your smart contract blockchain.

One of the best things about Substrate is the ability to easily execute on your ideas when developing blockchain systems. I want to show you a question from the first Substrate Developer Conference (Sub0) that lead to me to investigate how one might extend the functionality of the runtime with a "wrapper module", and ultimately all the Substrate tricks I learned along the way.

Before we can jump in though, first you will need to know a little about the Substrate Contract module.

## Background

The [Contract module](https://substrate.dev/rustdocs/v1.0/srml_contract/index.html) is included in the Substrate Runtime Module Library (SRML) and provides your blockchain with the ability to execute smart contracts, similar to existing smart contract platforms like Ethereum.

There is a two step process for deploying a smart contract using the Contract module:

1. Putting the WebAssembly smart contract code on the blockchain.
2. Creating an instance of a smart contract with a new Contract account.

This has a big major advantage over existing smart contract platforms where you are able to create multiple instances of the same smart contract without needing to waste additional space re-uploading the code. For example, on Ethereum, each and every ERC-20 token uploads their own version of the ERC-20 token. In Substrate and with the Contracts module, a single ERC-20 Wasm contract can be uploaded, and many people can deploy their own tokens using customizable deployment parameters like initial balance, token name, etc...

## Permissioned Access

So now that you are familiar with how to deploy contracts using the Contract module, let's hear the question that was asked at Sub0:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-EJHu0u6hT8?start=6405&end=6573" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> Question: "Can you restrict which accounts can add code to the blockchain?"

> Sergei: "Maybe you can write another module which just wraps the smart contract module, and just does this additional check..."

While there are a few different ways you could approach solving this problem, it turns out [Sergei](https://github.com/pepyakin), as always, was absolutely correct about the best approach.

One could copy the entire Contract module and make changes directly to the source code, but that means that any future updates and improvement to the Contract module would need to get added back into your fork of the module manually. This is definitely not a recommended approach, and one that I believe most users will naturally avoid anyway.

Rather, creating a "wrapper module" which somehow applies itself on top of the existing SRML Contract module, but allows for additional logic to be added, would be the best here. It would create clear separation between the vanilla module and the changes made by the end user, and would allow for the module to automatically stay up to date with the latest changes to Substrate.

So how would we do this?

## Creating Sudo Contract

I have created a Substrate runtime module called [`sudo-contract`](https://github.com/shawntabrizi/sudo-contract) which, as suggested, wraps the SRML Contract module, and provides a simple example on how you might execute similar wrapper modules.

As the name implies, `sudo-contract` uses both the Sudo module and the Contract module to make it so that only the "Sudo key" can put contract code on the blockchain. However, there are no limits on who can deploy an instance of this smart contract, which allows for some practical use cases.

For example, imagine a DeFi (decentralized finance) platform controlled by a trusted smart contract development team like OpenZeppelin. This team would be able to provide a number of standardized, audited, and safe contracts for their users like an ICO contract, ERC-20 Contract, Multi-Signature Contract, etc... Users of this platform can choose from any of the standard contracts provided by the authorized team, and make their own instance of it for their needs.

With `sudo-contract`, this team would be able to tell their users that all smart contracts on their blockchain have been created and audited by their team. Thus, users can feel safe that there is no malicious code, backdoors, or generally broken contracts on this platform.

This could provide a safer, and more consistant experience to all parties trying to take part in a larger decentralized financial system, and you can imagine that the same can be done for other classes of smart contracts with such a utility.

So now that you are convinced of the utility of such a module, let's show you how you can build it!

### Wrapping a Module

The `sudo-contract` module needs to provide all the same functionalities of the SRML Contract module, but have additional authorization checks around one of the functions.

As Sergei suggested, the best way to approach this is to write a "wrapper module", which basically means a module which exposes the same extrinsic calls as the Contract module and forwards those calls to the real Contract module.

For example, the Contract module exposes 4 dispatchable functions:

* `update_schedule`
* `put_code`
* `call`
* `create`

In our `sudo-contract` module, one of these "wrapper functions" will look like this:

```rust
        /// Simply forwards to the `create` function in the Contract module.
        fn create(
            origin,
            #[compact] endowment: BalanceOf<T>,
            #[compact] gas_limit: T::Gas,
            code_hash: CodeHash<T>,
            data: Vec<u8>
        ) -> Result {
            <contract::Module<T>>::create(origin, endowment, gas_limit, code_hash, data)
}
```

All I have done here is copy the function signature for the `create` function, and then passed those parameters to the real `<contract::Module<T>>::create` function. You would do the same thing with each function until you have essentially created a "wrapped module"!

### Adding Authorization Checks

Creating a wrapper module like we have done above is not very useful as is, but using this pattern, we now have the ability to execute some additional logic before or after the main SRML Contract functions!

Our goal here is to add some additional authorization logic before the `put_code` function, where only the Sudo key can call this function. That is actually really easy and can be done like so:

```rust
/// Checks that sender is the Sudo `key` before forwarding to `put_code` in the Contract module.
fn put_code(
    origin,
    #[compact] gas_limit: T::Gas,
    code: Vec<u8>
) -> Result {
    let sender = ensure_signed(origin)?;
    ensure!(sender == <sudo::Module<T>>::key(), "Sender must be the Sudo key to put_code");
    let new_origin = system::RawOrigin::Signed(sender).into();
    <contract::Module<T>>::put_code(new_origin, gas_limit, code)
}
```

Here, we simply call into the Sudo module's storage to retrieve who the current Sudo key is, and check that the sender matches that key. If that check fails, we never make the downstream call to the SRML Contract module to actually put the code on the chain, and thus nothing happens. It really is that easy!

### Other Details

I won't go into a line by line instruction of creating the module, but there a few details I want to call out so that even new runtime developers can understand how some thing work.

#### Accessing Other Modules

In my wrapper module, I have dependencies on both the SRML Contract module and SRML Sudo module. You can see in my code, I reference both modules to either call their functions or to read their storage. I am able to do this because I have imported these dependencies in my module's `Cargo.toml` file, and I have inherited the modules' traits into my own:

```rust
pub trait Trait: contract::Trait + sudo::Trait {}
```

You will need to do this for any modules you wrap, and in our case this also implies that your runtime must use exactly these two modules. We may look to revisit a wrapper module which does not depend on any specific module, but just one that has the traits, functions, and types expected.

#### Dispatchable Functions Must Be Public

Another critical detail which makes this solution work is that the dispatchable functions for the Contract module are marked `pub`, which means I can call them directly from my wrapper module. I actually had to [open a pull request](https://github.com/paritytech/substrate/pull/2399) to the Substrate repository to enable this.

If there is a module you would like to wrap which does not have their dispatchable functions marked as pub, you can try to make your own PR to update their module to do this. However, another possible option is to instead dispatch another call to their "private" function, which no matter what, is still accessible through a transaction.

Here is an example of what that might look like:

```rust
let result = contract::Call::<T>::update_schedule(schedule).dispatch(origin).is_ok();
```

I don't yet fully understand the ramifications of dispatching a call within another transaction (for example being charged two base transaction fees), but if you have no other options, I don't see why this would not technically work.

## Adding Sudo Contract

So I have already done the work for you to create the `sudo-contract` wrapper module. Now I want to share with you some of the nuances of adding it to your smart contract enabled runtime.

### Substrate Dependencies

I won't go into details about the challenges in creating an Substrate module as its own Rust library, but one thing you will need to be conscious of is the specific Substrate dependencies used by your runtime code.

In the `v1.0` branch of the `sudo-contract` module, I point all Substrate dependencies to the `v1.0` branch of Substrate. This means your runtime must ALSO have all of its substrate dependencies point to the `v1.0` branch too. If your runtime is pointing to a specific git commit or a different branch, you will either need to update your runtime code or fork my wrapper module and update it to use exactly the same dependency.

You will also need to be sure to add this module to your runtime's `std` feature, so that it will use `std` features when building the native binaries for your runtime.

More details can be found in README for the `sudo-contract` module and the HOWTO of the [`substrate-module-template`](https://github.com/shawntabrizi/substrate-module-template), which was used to create the `sudo-contract` module.

### Tricking the Polkadot UI

The next challenge we will overcome is how to trick the Polkadot UI into thinking our `sudo-contract` module, with the same public API, is the "real" Contract module of my chain.

The Polkadot UI is actually really simple when it comes to enabling and routing logic to module specific UI like the Contract module. All it does is check in the runtime metadata that the `name` of the module matches what it expects.

This metadata value is generated from the Rust dependency name chosen when importing the module into your project. So in the case of the SRML Contract module, you would normally import the module like this:

```rust
[dependencies.contract]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-contract'
branch = 'v1.0'
```

Which would give it `"name": "contract"` in the metadata, which is exactly what the UI expects. So, we would be able to trick the UI by taking advantage of this and importing our module with the `contract` dependency name, and renaming the SRML Contract module:

```rust
[dependencies.srml-contract]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-contract'
branch = 'v1.0'

[dependencies.contract]
default_features = false
git = 'https://github.com/shawntabrizi/sudo-contract.git'
package = 'sudo-contract'
branch = 'v1.0'
```

> **Note** that we imported our `sudo-contract` package from the `v1.0` branch, and our Substrate based depdencies are also coming from their `v1.0` branch, as described in the previous section.

After making this change and updating our `std` feature appropriately, we will also need to update our runtime's `lib.rs` file.

Any references to the `contract` dependency which is intended for `srml-contract` will need to be updated, like the trait implementations:

```rust
// This is the srml-contract Trait
impl srml_contract::Trait for Runtime {
	type Currency = Balances;
	type Call = Call;
	type Event = Event;
	type Gas = u64;
    // Note the updated names in these lines too!
	type DetermineContractAddress = srml_contract::SimpleAddressDeterminator<Runtime>;
	type ComputeDispatchFee = srml_contract::DefaultDispatchFeeComputor<Runtime>;
	type TrieIdGenerator = srml_contract::TrieIdFromParentCounter<Runtime>;
	type GasPayment = ();
}

// This is the sudo-contract Trait
impl contract::Trait for Runtime {}
```

With these changes, the Polkadot UI should think that the `sudo-contract` module is indeed the regular Contract module, and provide you with a great user experience for interacting with Smart Contracts, without any additional work from your side.

### Making SRML Contract "Un-Callable"

The `sudo-contract` module would be pretty useless if it was possible to still call the contract module directly, bypassing this authorization check we just added. However, the whole point of this project is to keep the original module around so we aren't forking things.

Fortunately, it seems that Substrate was designed to be so modular and customizable that this scenario is already supported! [From Gav](https://github.com/paritytech/substrate/pull/2399#issuecomment-487597233):

> You can introduce a module entry into the runtime without the `Call` functionality which will prevent it from being routed to in a transaction.

What he is saying here is that whereas we would normally import our SRML Contract module into the `construct_runtime!` macro like so:

```rust
Contract: srml_contract::{Module, Call, Storage, Config<T>, Event<T>},
```

We can simply omit the `Call` type, and it will make our module "un-callable". This does not affect any of the other basic functionalities of our runtime like the module storage, module events, and even genesis configuration.

Then, when adding our `sudo-contract` module, we _do_ include the `Call` type, but nothing else since our wrapper module does not have any storage or events of its own (but it could so don't think this is a limitation). Here is what our final `construct_runtime!` import would look like for these two modules:

```
Contract: srml_contract::{Module, Storage, Config<T>, Event<T>},
SudoContract: contract::{Module, Call},
```

## Testing Sudo Contract

