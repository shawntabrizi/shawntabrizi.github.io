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

One of the best things about Substrate is the ability to easily execute on your ideas when developing blockchain systems. I want to show you a question from the first Substrate Developer Conference (Sub0) that lead to me investigating how one might extend the functionality of a runtime module with a "wrapper module".

Before we can jump in though, you will need to know a little about how the Substrate Contract module works.

## Background

The [Contract module](https://substrate.dev/rustdocs/v1.0/srml_contract/index.html) is included in the Substrate Runtime Module Library (SRML) and provides your blockchain with the ability to execute Wasm smart contracts.

There is a two step process for deploying a smart contract using the Contract module:

1. Putting the WebAssembly smart contract code on the blockchain.
2. Creating an instance of a smart contract with a new Contract account.

This has a major advantage over existing smart contract platforms since you are able to create multiple instances of the same smart contract without needing to waste additional space with multiple instances of the contract code. For example, on Ethereum, each and every ERC-20 token uploads their own version of the ERC-20 contract. In Substrate, and with the Contracts module, a single ERC-20 Wasm smart contract can be uploaded, and many people can deploy their own tokens using customizable deployment parameters like initial balance, token name, etc...

## Permissioned Access

So now that you are familiar with how to deploy contracts using the Contract module, let's hear the question that was asked at Sub0:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-EJHu0u6hT8?start=6405&end=6573" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> Question: "Can you restrict which accounts can add code to the blockchain?"

> Sergei: "Maybe you can write another module which just wraps the smart contract module, and just does this additional check..."

While there are a few different ways you could approach solving this problem, it turns out [Sergei](https://github.com/pepyakin), as always, was absolutely correct about the best approach.

One _could_ copy the entire Contract module and make changes directly to the source code (as I had originally suggested), but that means that any future updates and improvement to the Contract module would need to get added back into your fork of the module manually. This is definitely not a recommended approach, and one that I believe most users will naturally avoid anyway.

Rather, creating a "wrapper module" which somehow applies itself on top of the existing SRML Contract module, but allows for additional logic to be added, would be the best here. It would create clear separation between the vanilla module and the changes made by the end user, and would allow for the module to automatically stay up to date with the latest changes to Substrate.

So how would we do this?

## Creating Sudo Contract

I have created a Substrate runtime module called [`sudo-contract`](https://github.com/shawntabrizi/sudo-contract) which, as suggested, wraps the SRML Contract module, and provides a simple example on how you might execute similar wrapper modules.

As the name implies, `sudo-contract` uses both the SRML Sudo module and the SRML Contract module to make it so that only the "Sudo key" can put contract code on the blockchain. We did not change any other logic though, so there are no limits on who can deploy or call an instance of this smart contract. This combination of authorization to `put_code`, with open access to `create` and `call` enables for some practical use cases.

For example, imagine a DeFi (decentralized finance) platform controlled by a trusted smart contract development team like [OpenZeppelin](https://github.com/OpenZeppelin). This team would be able to provide a number of standardized, audited, and safe contracts for their users like an ICO contract, ERC-20 Contract, Multi-Signature Contract, etc... Users of this platform can choose from any of the standard contracts provided by the authorized team, and make their own instance of it for their needs.

With `sudo-contract`, this team would be able to tell their users that all smart contracts on their blockchain have been created and audited by their team. Thus, users can feel safe that there is no malicious code, backdoors, or generally broken contracts when using this platform.

This could provide a safer, and more consistent experience to all parties trying to take part in a larger decentralized financial system. Hopefully, you can imagine that the same can be done for other classes of smart contracts too!

So now that you are convinced of the utility of such a module, let's show you how you can build it.

### Wrapping a Module

The `sudo-contract` module needs to provide all the same functionalities of the SRML Contract module, but have additional authorization checks around just one of the functions: `put_code`.

As Sergei suggested, the best way to approach this is to write a "wrapper module", which basically means a module which exposes the same extrinsic calls as the Contract module and forwards those calls to the real Contract module.

For example, the Contract module exposes 4 dispatchable functions:

* `update_schedule`
* `put_code`
* `create`
* `call`

> **Note:** We do not include special functions like `on_initialize`, `on_finalize`, `deposit_event`, etc... Only the ones which can be called via an extrinsic.

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

All I have done here is copy the function signature for the `create` function, and then passed those parameters to the real `<contract::Module<T>>::create` function. You would do the same thing with each function until you have essentially created a "wrapped" module!

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

Here, we simply call into the Sudo module's storage to retrieve who the current Sudo key is, and check that the sender matches that key. If that check fails, we never make the downstream call to the SRML Contract module to actually put the code on the chain. Instead the module will return a runtime error:

> Sender must be the Sudo key to put_code

and nothing will happen. It really is that easy!

### Other Details

I won't go into a line by line instruction of creating the module, but there a few details I want to call out so that even new runtime developers can understand how some things work.

#### Accessing Other Modules

In my wrapper module, I have dependencies on both the SRML Contract module and SRML Sudo module. You can see in my code, I reference both modules to either call their functions or to read their storage. I am able to do this because I have imported these dependencies in my module's `Cargo.toml` file, and I have inherited the modules' traits into my own:

```rust
pub trait Trait: contract::Trait + sudo::Trait {}
```

You will need to do this for any modules you wrap, and in our case this also implies that your runtime must use exactly these two modules.

We may look to revisit a wrapper module which does not depend on any specific module, but just one that has the traits, functions, and types expected. You could imagine this would be useful if another Contract module was released with alternative implementation details, but ultimately the same API. We would want our wrapper module to work for that module too!

#### Calling Private Dispatchable Functions

A critical detail which makes this solution work so "easily" is that the dispatchable functions for the Contract module are marked `pub`, which means I can call them directly from my wrapper module. However, this is not a requirement for making a wrapper module since all dispatchable functions are made explicitly public through the `Call` type. What this really means is that your module can always "dispatch" a transaction to another module's function!

Here is an example of what that might look like:

```rust
let result = contract::Call::<T>::update_schedule(schedule).dispatch(origin).is_ok();
```

This is exactly the same as calling the function directly, so no extra transactions will be recorded, no extra fees taken, etc...

## Adding Sudo Contract

So I have already done the work for you to create the `sudo-contract` wrapper module. Now I want to share with you some of the nuances of adding it to your smart contract enabled runtime.

> **Note:** If you want to add the `sudo-contract` module to your runtime, you should follow the [README](https://github.com/shawntabrizi/sudo-contract) included with the module, since the next couple of sections may leave out smaller details.

### Substrate Dependencies

I won't go into details about the challenges in creating a Substrate module as its own Rust library, but one thing you will need to be conscious of is the specific Substrate dependencies used by your runtime code.

In the `v1.0` branch of the `sudo-contract` module, I point all Substrate dependencies to the `v1.0` branch of Substrate. This means your runtime must **also** have all of its substrate dependencies point to the `v1.0` branch too. If your runtime is pointing to a specific git commit or a different branch, you will either need to update your runtime code or fork my wrapper module and update it to use exactly the same dependency.

You will also need to be sure to add this module to your runtime's `std` feature, so that it will use `std` features when building the native binaries for your runtime.

More details can be found in README for the `sudo-contract` module and the HOWTO of the [`substrate-module-template`](https://github.com/shawntabrizi/substrate-module-template), which was used to create the `sudo-contract` module.

### Tricking the Polkadot UI

The next challenge we will overcome is how to trick the Polkadot UI into thinking our `sudo-contract` module, with the same public API, is the "real" Contract module of my chain.

The Polkadot UI is actually really simple when it comes to enabling and routing logic to module specific UI like the Contract module. All it does is check in the runtime metadata that the `name` of the module matches what it expects.

This metadata value is generated from the Rust dependency name chosen when importing the module into your project. So in the case of the SRML Contract module, you would normally import the module like this:

```
[dependencies.contract]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-contract'
branch = 'v1.0'
```

Which would give it `"name": "contract"` in the metadata, which is exactly what the UI expects. So, we would be able to trick the UI by taking advantage of this and importing our module with the `contract` dependency name, and renaming the SRML Contract module:

```
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

So now that we have successfully added the `sudo-contract` module to our runtime, let's take a look at what happens when we use it.

I have a [`sudo-contract` branch](https://github.com/shawntabrizi/substrate-package/tree/sudo-contract) in the `substrate-package` which you can use to run this wrapper module yourself, or double check the steps [in this PR](https://github.com/shawntabrizi/substrate-package/commit/c0c1e4604db279c5940f528c378575fa2c5aaf7a) for adding it to your own runtime.

We build the Wasm runtime and the native binaries to start our node:

```bash
./scripts/build.sh
cargo build --release
./target/release/node-template purge-chain --dev
./target/release/node-template --dev
```

When we run the node, we can interact with it using the Polkadot UI. We can immediately see that the UI recognizes that we have the Contract module included in our runtime:

![Screenshot of the Polkadot UI with Contract Tab](/assets/images/sudo-contract-polkadot-ui.png)

If we dig a little deeper into the details, we can see that the extrinsics section uses our `sudo-contract` version of the Contract module functions:

![Screenshot of the Contract Extrinsics](/assets/images/sudo-contract-call.png)

> Notice that the comments with each function are the ones that we wrote in the wrapper module, and there are no other "contract" modules which can be called.

Finally, if we look at the chain state tab, we will see that the UI and our runtime still manages the full storage of the SRML Contract module and that our module has no storage itself:

![Screenshot of the Contract Extrinsics](/assets/images/sudo-contract-chain-state.png)

So really we have set up our runtime exactly as we want.

Let's now try to use the Contract UI to create a new contract on our blockchain!

### Putting Code On the Chain

If our `sudo-contract` module is really working, then only the Sudo key will be able to put new contracts onto the blockchain. Since we are running a `--dev` chain, Alice is set as the Sudo key at the genesis of our blockchain.

So let's first try to put a new smart contract with _another_ account. Let's fund Bob with enough units to deploy a contract, and try to upload the standard "flipper" contract. Here is what we will see in the UI:

![UI error message when Bob tries to upload contract](/assets/images/sudo-contract-ui-error.png)

When we look at our node terminal to see what "went wrong" we find:

![Terminal error message when Bob tries to upload contract](/assets/images/sudo-contract-terminal-error.png)

> "Runtime: Sender must be the Sudo key to put_code"

So our wrapper module is indeed gating access to the underlying SRML Contract module.

Now we will try with Alice:

![Success when Alice tries to upload contract](/assets/images/sudo-contract-ui-success.png)

A success! Note that the `CodeStored` event which is emitted comes from `srmlContract`, which means ultimately the SRML Contract module is doing all of the work here. Our wrapper module is only doing the minimal it needs to in order to gate access. After this point, Bob or any other user can now create an instance of this contract.

We have successfully extended the SRML Contract module without making any forks or direct changes!

## Next Steps

While this post touches on a number of nuanced details about how we use Substrate to enable this end to end scenario, the big picture idea here should still be quite simple. You have now learned one approach to extending other Substrate runtime modules, and the possibilities with this are endless.

Here are some ideas you could try to hack on:

* Wrapper for the SRML Contract module which keeps track of all contracts that are uploaded with some additional metadata.
* Wrapper for the SRML Balances module which adds a "pause" functionality to the blockchain, preventing calls to `transfer`.
* Wrapper to the SRML Contract module which adds the ability for the Sudo key to "update" the Wasm code of a contract. (This will hopefully be the topic of a future post).

Also, this implementation of `sudo-contract` is not perfect. If you wanted to improve it, consider adding any of the following:

* Adding module storage and some basic functions which allow you to control "privileged" accounts and remove the dependency on SRML Sudo.
* Abstract away direct dependency on the SRML Contract module, and have the module work for wrapping any module which exposes the same dispatchable functions.
* Add a second tier of authorization for `create` so that only some users can `put_code`, a larger (but still limited) set of users can `create`, but then all users can `call`.

I hope that someone uses the `sudo-contract` module in their production blockchain. If you do end up using it, please let me know!

As always, if you like the content I produce and want to help me keep doing it, take a look at my [donation page](https://shawntabrizi.com/donate/).
