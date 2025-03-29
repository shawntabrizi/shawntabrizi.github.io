---
title: Tips for New FRAME Developers
date: 2023-08-09
authors: shawntabrizi
categories:
  - Substrate
tags:
  - frame
  - pba
---

At the Polkadot Blockchain Academy, we both teach students how to build a custom blockchain using the Polkadot SDK, Substrate, and FRAME, and have them complete a project using that knowledge.

This post is a retrospective for that assignment meant for the students to continue to learn and improve their FRAME skills after the academy.

Sharing it here, since I believe it could help anyone getting started with FRAME development.

## FRAME Assignment Retrospective

Congratulations everyone for completing the academy.

I truly understand that this is one of the most challenging 5-week courses on the planet. I hope that everyone walks away from it with a sense of pride in what they've learned and how they've grown.

I wanted to spend a little bit of time recapping some of the things I saw in the FRAME Assignment which can help round out your learnings and allow you to continue to grow as a future Substrate developer.

## Documentation

I think students lost the most number of "easy" points by not valuing documenting their code or spending extra time on their README.

When I was grading your projects, I was very much relying on documentation to express **intention** and **design**. Students who made a mistake, but documented their intention accurately on average got more points than students who made a mistake and wrote nothing.

Many students took the opportunity to design unique and interesting pallets but did not adequately document expected behaviors, how functions work, or the assumptions made for the state machine.

I reviewed your projects as if I was doing a code review for a peer in the ecosystem. If you had public functions, pallet configurations, public types, etc... I expected them to be documented. Even internal logic within your extrinsics, it is helpful to describe what your intended logic will be in words, and then to see the code doing that, else how can I differentiate design from  potential error? I understand time is limited, but these kinds of docs can be written as you are writing the code!

For the README, students on average didn't really seem to "own" their project. Students who got full points made up stories on how their pallet was going to be used. Described in detail the mechanics of their system. Really spent time to think about how these "simple projects" could be enhanced to real production ready systems.

These kinds of READMEs allowed me to understand your comprehension of not just coding FRAME, but actually tying together the things you learned earlier in Cryptography, Game Theory, Economics, and Blockchain.

## Rust-isms

Fortunately, Rust doesn't really let you make outright mistakes. It seemed like everyone got their code compiling which is a good sign that everyone is over the hump. However, many students put a lot of non-ergonomic Rust code into their Pallets, which can vary from very wrong to "not as pretty".

### Dealing with Results and Options

Most everyone could easily up their game by becoming more familiar with and practicing rust-ic ways to handle Results and Options.

Try to be fluent with:

- `ok_or`
- `map_err(|e| ...)`
- `?`
- `if let Some(var) = an_option { ... }`
- etc...


### Never Panic

We said it many times in class, yet it still showed up in some projects. Some people used `.unwrap()` where there were no guarantee that it would be safe, and that is the worst case situation.

However, other students wrote code which contained `.unwrap()` or `.expect()` where it was checked to be safe, but still, this is not the best practice! Rust has all of the syntax needed so that **you never need to unwrap or expect ever!**.

For example, I saw many times:

```rust
let my_value = MyValue::<T>::get();
ensure!(my_value.is_some(), Error);
let value = my_value.expect("we checked above qed");
```

I want to be clear, this is _safe_, but would never pass a code review!

You saw in class many times the more ergonomic and Rust-ic way to handle this:

```rust
let value = MyValue::<T>::get().ok_or(Error)?;
```

That's it!

You should physically fight yourself to ever include an `unwrap` or `expect` inside of your Rust code. There is likely ALWAYS a better way to handle it, and especially since FRAME now can return an error at any time, you always should.

### Helper Functions

Students with the cleanest code often took advantage of many helper functions which had very clean inputs, outputs, and assumptions. I saw many students write the same blocks of code over and over, and ideally that should tickle your brain to turn this into a helper function!

This is doubly true for the Pallet Tests which seemed like a prime place to create simple helpers to setup your pallet into certain states so you can quickly execute tests.

I promise that this kind of thinking will actually save you time, as you refactor, improve, or fix bugs in your code. It is better to have shared logic which can be edited, rather than having to hunt down every copy and paste of a certain piece of logic.

### Object Oriented Design

A lot of the better Pallets took advantage of well defined objects and apis to make their systems more consistent.

Some ideas for each of the projects:

- DEX: create a struct which manages asset pairs, with their balances, and always sorts them. Have your internal functions input that single object, and perform logic over that, rather than dealing with 4 uncoupled variables.
- Voting: create a struct which represents the proposal, and apis which allow updating the ayes / nays, getting the result, getting the end block etc...
- DPoS: create a struct which represents a delegator, and apis to manage their frozen balance, who they are delegating to, and so on...

Avoid tuples where possible! It is almost always better to deal with structs with well defined fields. Imagine reading this code:

```rust
if (user_1.0 < user_2.0) { ...}
```

vs

```rust
if (user_1.balance < user_2.balance) { ... }
```

Again, my recommendation is to just quickly jump into creating structs and other objects, as they are usually very easy to update and maintain. Wait until you need to change a tuple, and see how long it takes to refactor that :)

## FRAME-isms

FRAME is a huge library with pretty crazy APIs. There was no expectation that anyone would walk away from the academy being able to be a FRAME expert, so here are some things which you can take away to continue your development.

### Common Unsafe Math

Students still got caught doing unsafe math in their Runtime. While `checked_add` and `checked_sub` doesn't necessarily lead to pretty code, it is nearly free and you should always use it.

I saw a few times the pattern of:

```rust
fn create_proposal(origin, proposal_length: BlockNumber, ...) {
    let current_block = frame_system::Pallet::<T>::block_number();
    let end_block = current_block + proposal_length;
    // ...
}
```

Obviously this is ripe for any user to input a huge proposal length, and cause an overflow in your addition. You must be EXTRA careful when you are doing math or any kind of operation with data being inputted by the user. Remember that you must treat every extrinsic as an attack on your system, and code like the above would be bad.

On the flip side, some students were using `saturating` math, which is better than unsafe math, but probably not what you want to use in general. When you use saturating math, you prefer executing code and completing successfully rather than bubbling up error conditions. I think this is normally not what you should prioritize. Instead, just fail fast.

Thankfully, Substrate harnesses the power of on-chain governance and runtime upgrades. If your pallet were to get stuck because of some checked math, it is always something that can be repaired later. It is better than having some silent error / saturation occur and then trying to repair it later when the damage is already done.

### Using FRAME Types

I saw a lot of students struggle to deal with manipulating the various FRAME types. Most commonly the Balance and BlockNumber type. As you have learned, these types are not concrete in your Pallet, and so you need to figure out ways to work with them.

The most common thing you **should** do is just use the same types together! For example, if you want to calculate some math using the current block number, you should use the `BlockNumber` type for all your variables! The same is true for all the FRAME types!

This means configuring your config with the right type:

```rust
type ProposalLengthLimit: Get<BlockNumberFor<T>>;
```

Using the right type for input parameters:

```rust
// if you want to use vote_weight^2 = balance
// then vote_weight should be the balance type
fn my_function(origin, vote_weight: BalanceOf<T>) {
    let balance_to_freeze = vote_weight.checked_mul(vote_weight)?;
    // ...
}
```

And the right types for storage:
```rust
// using the same example as above
struct UserVote<T: Config> {
    weight: BalanceOf<T>,
    aye: bool,
}
```

etc...

A lot of students were using `u32` concretely in their runtime, and then constantly converting it to the FRAME type. The compiler will allow this, but a code review will not. Become comfortable with referencing numbers and other FRAME types as their generic self.

### Origin Checks

For some reason, a lot of students were using `ensure_signed_or_root` in their code. I don't remember teaching this explicitly, but somehow it seemed to get passed around. This origin check is perfectly fine to use, and many of you handled it correctly for functions where you wanted to allow root direct access to do something, or a user to do something for themselves. A common use case was de-registration, where Root could deregister any user they want, and a user could choose to deregister themselves.

However, this origin check also showed up in places where the signed origin WAS NOT CHECKED AT ALL! This is super bad! People had mint functions or other low level calls where they mistakenly allowed any user to call that function and potentially mess up their blockchain.

If you want to use this origin check, it should look something like this:

```rust
if let Some(who) = ensure_signed_or_root(origin)? {
    // handle the case where signed origin is here
    // you have access to `who`
} else {
    // handle case where root called
}
```

Here we can see that `?` will return an error if the origin is not `Signed` or `Root`. Otherwise, the function will return `Some(account)` if it is `Signed` and `None` if it is `Root`.

I saw others handle this a lot less ergonomically, when it can be this simple.

### Pallet Design Patterns

Arguably, all of these design patterns are opinions that intelligent and well-informed developers can choose to follow or not. If you do not directly agree with some of these comments, I will respect your choice to have your own opinions, but I think it is worth considering these as "best practices" in the Substrate ecosystem.

#### Try to avoid loops

Where possible, try to avoid loops in your runtime, as this kind of code is harder to benchmark, and may actually make your blockchian less efficient.

Imagine the scenario where a user wants to unlock their funds across multiple expired votes. The initial urge is to create a function called `fn unlock_all_votes(who)`, which inside would check:
- each vote the user had
- if that proposal was expired / completed
- free up their balance

Instead it is better to have users unlock votes one by one, and use things like `Utility.batch` to unlock multiple things at once.

#### Fail Early and Fail Fast

Thankfully, everyone seemed to be good at checking their inputs and state before executing any extrinsic. The checks are super important to keep your state machine functioning as expected. However, order of the checks matter too!

For example, I saw a lot of:

```rust
ensure!(SomeStorage::<T>::contains_key(), Error);
ensure!(param.len() < T::MaxLenInput::get(), Error);
// you should flip these two ensure statements for better efficiency!
```

In this case, you are always reading storage to do some check first, whereas you could simply check the length of some input which is MUCH CHEAPER, and would allow you to return an error fast.

#### Do not try to compensate for the user / state

It is not the primary goal of your runtime code to be "user friendly".  Your primary goal is to create safe, fast, and efficient code for your blockchain network.

Many users want to make their code super ergonomic for end users.

- "Did you send me malformed data?"
    - "I'll try to fix that for you!"
- "Did you want to de-register a user where they have a lot of state?"
    - "Let me clean that up for you!"
- "Did you want to remove some item in a list?
    - "Let me find that for you!"

But almost all of these are always wrong. Here is how you should be writing your code:

- "Did you send me malformed data?"
    - ERROR! Try again with good data please.
- "Did you want to de-register a user where they have a lot of state?"
    - ERROR! Please clean up the data related to your account before you call this function!
- "Did you want to remove some item in a list?
    - You MUST provide me with the index or location of that data before you can call this function, and if the location is wrong... ERROR!

Remember that users can "freely" observe and analyze the data on your chain. They can freely calculate hashes, or any complex logic. When they do so, they do it only the one time locally. When your runtime does these kinds of calculations or database searches, it does it for every node on your network! Your computation time is already extremely limited, there is no reason you should be doing extra work on behalf of your users!

### Test Coverage

Overall, tests were very strong across the whole academy. If you are in doubt if you have written the right tests, do the following:

- write a test which does the greenfield scenario for each extrinsic
- write a test which tests each extrinsic for EACH error that can occur
- write a test which involves multiple users interacting with your system at the same time
- write a full end to end test which tests the whole thing works as you expect

Remember that simply checking your extrinsic passes `assert_ok!` is not enough. Think about an extrinsic which only does:

```rust
// this will always pass `assert_ok!`
fn my_extrinsic(origin) -> DispatchResult {
    Ok(())
}
```

You should always be checking the STATE of your blockchain to ensure that the state machine is running as expected. THis might be the votes in your storage, the balance of users / pools, the frozen balance of your delegators, etc... Just because the code compiles and runs, does not mean it is correct :)

## Anything else?

Was there any feedback I gave to you that I missed here? Leave a comment and I will write about it!

I hope you all have a lovely rest of the summer, and I hope to build the future of Polkadot along side each and every one of you.
