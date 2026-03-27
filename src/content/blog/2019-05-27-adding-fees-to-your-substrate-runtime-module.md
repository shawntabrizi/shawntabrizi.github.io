---
title: Adding Fees to Your Substrate Runtime Module
date: 2019-05-27
authors: shawntabrizi
slug: /substrate/adding-fees-to-your-substrate-runtime-module/
categories:
  - Substrate
tags:
  - runtime
  - module
  - rust
  - fees
  - balance
  - ethereum
---

##### In this post, I will show you how you can easily add a fee for calling a function within your Substrate runtime module.

When using Substrate, you are afforded the flexibility to completely control the fee system within your runtime.

By default, a [`transaction_base_fee`](https://substrate.dev/rustdocs/v1.0/srml_balances/struct.Module.html#method.transaction_base_fee) is added to every transaction you make to your runtime. However, this blanket base fee does NOT take into account anything related to the complexity or storage used as a result of the transaction.

Substrate makes the following recommendation in the `Example` module:

> Ensure that calls into each of these [functions] execute in a time, memory and using storage space **proportional to any costs paid for by the caller** or otherwise the difficulty of forcing the call to happen.

Thus, if your runtime module exposes functions which are heavy in computation or storage needs, you should be sure to add some _additional_ fee on top of the base fee to ensure your blockchain is not attackable.

## A Simple Fee

There are a lot of complicated methods you can use for calculating fees for functions. You can take a look at the [Contract module](https://github.com/paritytech/substrate/tree/v1.0/srml/contract) for an example of that.

For this example, I will be showing you the most simple implementation of a fee which will be inline with the rest of your module code.

### Withdrawing From Balance

The first tool we will use is the [`withdraw` function](https://substrate.dev/rustdocs/v1.0/srml_support/traits/trait.Currency.html#tymethod.withdraw) provided by the `Currency` trait in the Balances module:

```rust
fn withdraw(
    who: &AccountId,
    value: Self::Balance,
    reason: WithdrawReason,
    liveness: ExistenceRequirement
) -> Result<Self::NegativeImbalance, &'static str>
```

> Removes some free balance from who account for reason if possible. If liveness is KeepAlive, then no less than ExistentialDeposit must be left remaining.
>
> This checks any locks, vesting, and liquidity requirements. If the removal is not possible, then it returns Err.

Withdraw is designed to be quite flexible. As you can see, it allows you to specify the reason for a withdrawal. In this case, we are taking a _fee_:

```rust
// use support::traits::WithdrawReason
WithdrawReason::Fee
```

It can even make sure that removing these funds will not kill an account. For our fee system, this second point will be particularly important since we do not want users to accidentally destroy their account paying for fees!

For this, we simply pass:

```rust
// use support::traits::ExistenceRequirement
ExistenceRequirement::KeepAlive
```

Now we can really safely charge fees to a user upfront and let the logic of the Balances module handle the rest. For ease of reusability, we will create an internal function which can be called within our module to charge a fee to a user:

```rust
impl<T: Trait> Module<T> {
  fn pay_fee(who: T::AccountId, amount: T::Balance) -> Result {
    let _ = <balances::Module<T> as Currency<_>>::withdraw(
      &who,
      amount,
      WithdrawReason::Fee,
      ExistenceRequirement::KeepAlive
    )?;

    Ok(())
  }
}
```

This function will either propagate an error from taking funds from the user, or will complete successfully and return `Ok(())`. We can then handle the error within our runtime.

#### Imbalance

One thing we glazed over at this point is the return type of the `withdraw` function:

```rust
-> Result<Self::NegativeImbalance, &'static str>
```

As you can see, it returns a `NegativeImbalance`, which is probably a type you have never seen before. Without going into _too_ much detail, the [Imbalance system](https://github.com/paritytech/substrate/pull/2048) within the Balances module is a way to ensure that the sum of all funds across all accounts is equal to the `TotalIssuance` managed by the Balances module.

So fortunately, this imbalances system [does all of the hard work for us!](https://stackoverflow.com/questions/56341343/is-handling-the-imbalance-type-mandatory-after-withdraw-or-deposit) All we need to do is ignore this return type and we can be happy that the `TotalIssuance` is updated and this value is actually burned.

### Charging a Fee

Now that we have created our `pay_fee` function, we need to call it within our runtime module. We will emulate a fixed fee system similar to the low level OPCODEs provided by Ethereum, where each function in our module can define some fixed cost to call the function.

This can be done easily by simply writing a function like so:

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    pub fn do_something(origin) -> Result
    {
      let who = ensure_signed(origin)?;
      let fee = 1337.into();

      Self::pay_fee(who, fee)?;

      // Do stuff after fee is paid successfully...

      Ok(())
    }

  }
}
```

This function checks whether or not `pay_fee` returns successfully, and if not, it propagates the error up and stops execution of the runtime function.

In the situation where a user is unable to `withdraw` funds, we will see the error message:

> Runtime: too few free funds in account

#### Converting Rust Primitives to Substrate Specific Types

You may notice that `pay_fee` and `withdraw` expect `fee` to be of type `T::Balance`.

Remember that Substrate is written to be **very** generic, so in the context of your runtime module, there are minimal assumptions about your blockchain's types.

For example, using this generic type system, you would be able to define one Substrate blockchain which uses `u64` for the `Balance` type, another which uses `u128`, and another which uses `u32`. Because we use this generic type system for all the core blockchain types, the same module can be used out of the box across all of these different blockchains!

But this flexibility also means you need to tell the Rust compiler what to do when trying to handle incompatible situations.

For example, what should the module do if we try to put a `u128` value into a `Balance` type which is represented as `u64`? Or if we try to convert that same balance to a `u32`?

Substrate [provides implementations](https://stackoverflow.com/questions/56081117/how-do-you-convert-between-substrate-specific-types-and-rust-primitive-types) of `From`/`TryFrom` and `Into`/`TryInto` to handle such scenarios. The only assumption being made here is that all values are at least a `u32`.

These traits guarantee that the underlying types implement functions which will attempt to convert between types if possible.

Thus, if we ever need to convert some `u32` value to a `Balance`, we can simply call:

```rust
let my_balance: T::Balance = my_u32.into();
```

In the situation you need to convert some larger value, you will need to handle the situation where the `Balance` type is not compatible with type to be converted:

```rust
pub fn u64_to_balance(input: u64) -> Option<T::Balance> {
    input.try_into().ok()
}
```

Note that this returns an `Option`, thus your subsequent runtime logic needs to decide what to do when the conversion fails and the returned value is `None`.

Substrate also provides a `saturated_into` function which will always succeed, but will coerce your value into the type you want through saturation if necessary:

```rust
pub fn u64_to_balance_saturated(input: u64) -> T::Balance {
    input.saturated_into()
}
```

However, it is very important that you be conscious when you do such things. From [Gav](https://twitter.com/gavofyork):

> `SaturatedConversion` (`saturated_into` and `saturated_from`) should not be used unless you know what you're doing, you've thought and considered all options and your use-case implies that saturation is fundamentally correct. The only time I imagine this is the case is deep in runtime arithmetic where you are logically certain it will not overflow, but can't provide a proof because it would depend on consistent pre-existing state.

Remember, as a runtime developer, Substrate provides you with numerous tools, but it is ultimately up to you to determine how to use them.

## A Minimal, Complete, Verifiable Example Module

If you want to try out this simple fee system on your own Substrate chain, you can simply add a module like this to your runtime:

```rust
use support::{decl_module, dispatch::Result,
  traits::{Currency, ExistenceRequirement, WithdrawReason}};
use system::ensure_signed;

// v1.0 branch
// use runtime_primitives::traits::As;

pub trait Trait: balances::Trait {}

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    pub fn do_something(origin) -> Result
    {
      let who = ensure_signed(origin)?;

      let fee = 1337.into();
      // v1.0 branch
      // let fee = T::Balance::sa(1337);

      Self::pay_fee(who, fee)?;

      // Do stuff after fee is paid successfully...

      Ok(())
    }

  }
}

impl<T: Trait> Module<T> {
  fn pay_fee(who: T::AccountId, amount: T::Balance) -> Result {
    let _ = <balances::Module<T> as Currency<_>>::withdraw(
      &who,
      amount,
      WithdrawReason::Fee,
      ExistenceRequirement::KeepAlive
    )?;

    Ok(())
  }
}
```

If we run a local node, we can interact with the module through the [Polkadot UI](https://polkadot.js.org/apps/):

![Image of Extrinsic Tab](/assets/images/substrate-fee-extrinsic.png)

We have funded the Bob account with 2000 units, and we are charging a fee of 1337. When we call our function the first time, everything works as expected, and the 1337 unit fee (in addition to the base transaction fee of 1 unit) is removed from the account.

![Image of Fee Success](/assets/images/substrate-fee-success.png)

However, when Bob does not have enough funds to make a second call, they will see a failure message:

![Image of Fee Failure](/assets/images/substrate-fee-fail.png)

> Note though that the 1 unit base transaction fee was still removed.

If we look at our local node terminal, we can see the reason why this transaction failed:

![Image of Fee Error](/assets/images/substrate-fee-error.png)

## Next Steps

As mentioned, this is a very minimal and simplistic implementation of a fee system. However, this should give you the tools necessary to build your own advance fee system. Here are some cool ideas:

- Create some authorization layer where certain users get lower fees than the average user.
- Allow fees to be paid using other tokens that your runtime manages.
- Have your fee be calculated based on any input from the user. For example, if you let the user store some `Vec<u8>`, you can charge them some linear cost based on the length of the data.

Do you have other ideas? Let me know!

As always, if you enjoy my content, take a quick look at my [donation page](https://shawntabrizi.com/donate/) to help support future work.
