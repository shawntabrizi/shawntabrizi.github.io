---
title: A Better Treasury System
date: 2022-09-04
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - treasury
  - polkadot
---

##### This is a [repost from the Polkadot forum](https://forum.polkadot.network/t/a-better-treasury-system/291), where I propose a vision for a better on-chian treasury for the Polkadot DAO.

This post will dump various ideas of mine on how we can improve the treasury system of Polkadot, both on and off chain.

As a Council member on Kusama and Polkadot since the genesis election, I have reviewed, accepted, and even denied many treasury spends, and throughout my experience, I have formed opinions on what I like, and what I think can be improved.

## Why Care

I will be very brief here, but I think it is worthwhile to convince those of you reading this post why a focus on Polkadot's treasury system is important.

Ultimately, the Polkadot treasury is the one way that the Polkadot network can reach its hand out into the real world, and make things happen. The treasury is quite a unique feature of Polkadot compared to the last generation of chains.

If we can make sure that the treasury is easy to access for the Polkadot community, it will ensure that we will be able to fund and support growth and development of our ecosystem.

### Treasury Today

The Polkadot treasury can be simplified to two main parts:

 - The Pot - The funds available to the treasury, funded by a portion of the fees on the network.
 - Spending Logic - Ways for the treasury to transfer funds from the pot to end users.

The treasury is currently has 3 spending methods:

* Tips - Easy process to spend small amounts of treasury funds. Low overhead, relatively hard to abuse.
* Proposals - A more laborious process to spend large amounts of treasury funds immediately and to a specific account.
* Bounties - The most complex treasury process, which involves multiple actors to coordinate the spending of funds for projects which are agreed upon in advance, but the recipient of the funds may not be known at the time of creation. (this is maybe a bad summary, but yeah, you can [read more about it](https://wiki.polkadot.network/docs/learn-treasury#bounties-spending).)

## Improving Proposals (Treasury V2)

Proposals were designed to be very simple, but I think that some additional complexity can greatly improve the end to end experience of creating and approving large treasury spends.

### Proposal Phases

Currently, if a team opens a proposal for a treasury spend, if accepted, all of those funds are transferred to the team immediately. This is true for small projects, but also large, multi-year projects.

I have been concerned in the past that unknown teams come to the treasury and ask for a lot of money, for a huge project, and we have no idea how to evaluate if the team will actually deliver that project. We may ask the team to reduce the size of their ask, but then a team may be worried that the treasury will not commit to continuing the project once they get started.

Ultimately the proposal system right now is not actually good for allocating funds for really large projects.

I suggest we introduce some simple phases to each treasury proposal, and have teams ask to allocate funds to each specific phase:

1. Starting Spend
2. Reoccurring Spend
3. Final Spend

For the sake of example, I will take the role of a team lead who wants to ask for 100,000 DOT to build a new mobile wallet for Polkadot, and then use this role in the sections below.

#### Starting Spend

When a team asks for treasury funds, usually they will need some cash up front to get started with the project. This is what the **Starting Spend** can be used for.

Proposals today are basically ALL starting spend. Without having done any work, I would have asked for 100,000 DOT up front, and basically it would have been very hard to get my proposal approved.

In this case, I know I only need 10,000 DOT to get started on this project, and so I only ask for that amount as my Starting spend.

The treasury has less risk at loosing funds to people that do not deliver, and the proposer can still get the up-front capital they need to begin execution of their project.

#### Reoccurring Spend

Building a large project may take multiple months or even years. The reoccurring spend is the amount of funds the proposer will need on some reoccurring time scale to keep the project going.

For my example, I expect the project to take around 10 months, and I expect my monthly costs to amount to 5,000 DOT.

In this case, this reoccurring spend logic will be baked into the proposal, and if approved, every month, I can pull from the treasury funds my 5,000 DOT.

In order to get my next months funds, I must also submit a proof of the work done in the last month. This proof does not need to (and cannot really) be verified on chain. Instead, the team puts the data out there, and any user in the Polkadot ecosystem can read the update, and check for themselves the work being done is high quality and worthy of the monthly payments. As you can probably guess, later down we will describe a process where the updates are NOT high quality, and the governance system of Polakdot can end a proposal early, returning any unspent funds back to the treasury.

But generally, this process should be minimal and efficient for the proposing teams. Just provide proof that you have been doing what you said you would, and you can automatically pull out the funds you need to keep building month to month.

#### Final Spend

Finally, at the end of the project, the development team can potentially get a reward for their hard work done. It could be that the funds requested above were just enough to keep them afloat, but we should reward good contributors to our ecosystem with a profit for their work and hard time.

In this case, I have spent a total of 60,000 DOT for the 10 months of work and the starting spend, and thus my final reward will be 40,000 DOT for a job well done.

This will be a slightly delayed payment, where the proposer can again submit evidence that their work was completed successfully, and the public is given a period of time to review that work, and verify that the initial proposal was indeed satisfied by the work done.

If no one objects to the final spend, the my imaginary team walks away with 40,000 DOT profit on a job well done.

#### How Phases Effect Proposals

Now lets look at other ways this proposal could have gone, when a team asks for DOT.

1. Only Ask for Starting Spend

   This is exactly how we treat proposals today, and should be backwards compatible if there are UI/UX already developed to optimize this.

1. Only Ask for Reoccurring Spend

   In this scenario, I do not ask for any starting spend or final spend reward to execute my proposal. Instead, I simply ask that over the course of 10 months, I get a 10,000 DOT payment each month for the work done.

   This might make sense for projects where the treasury is already comfortable with the delivery of a team, and does not feel the need to keep the "DOT profits" from the team until the final spend.

   This looks very similar to "child bounties" which exist today on Polkadot.

1. Only Starting Spend and Ending Spend

   This might make sense for projects which are short in their timeline, thus the overhead of doing regular updates for the reoccurring spend would rather just be moved to the final spend.


1. Only Ending Spend

   If implemented cleverly, this can look very similar to the regular bounties system which exists today for the treasury, and potentially could replace it.

1. Etc...


As you can see, based on the amount of money, the kind of proposal, the trust we have in the proposer, etc... these phases can be tuned to spend the same amount of DOT, but over a different schedule, which allows the public to audit and keep track of the work done.

Additionally, we could potentially simplify UI/UX by combining the behaviors of bounties and proposals under a single unified process.

#### Other Ideas for Phases

There are a million other features and nice to haves which can be added to a phase based treasury spend, and will probably need to be in the final implementation:

- Allowing post-approval adjustments of things like reoccurring spend and final spend amount.
- Giving only a fraction of the Final Spend if the final product is "okay", but not great.
- Ways to extend the reoccurring spend time period
- Ways to pause reoccurring spend, to allow for closer public audit
- Ways to update where the spends go
- Users placing bonds against asking for funds or stopping a spend from happening
- etc...

## Improving Funds

In the example above, we talked about a 10 month project, which is asking for 100,000 DOT. But practically speaking, most of us still live in a world where we need fiat to live and pay people for work.

It could be in a bull market, the 100,000 DOT over 10 months could grow a lot in USD value. However, in bear markets, it could be that your estimated monthly payments are not actually enough to keep the project going.

One way or another, I feel the treasury needs to bring some sense of a stable coin to the system.

We could:

* Have the Polkadot treasury hold and distribute a stable coin.
* Record information about the expected DOT value on chain when a proposal is proposed and passed.
* Use ideas like "gilt".
* other ideas?

## Reputation

This is more of an offchain recommendation, but I do not find that any UIs today do a good job at representing the history of users who ask for funding from the treasury.

Similarly I don't think we do a good job at making recommendations for new applicants on the size of proposals that the treasury would be comfortable to give out on a first try.

I don't have any specific ideas here, just rough ideas.

For example, imagine the following table:

| # of Proposals Successfully Delivered | $ of Funds for Next Proposal |
|-----|------------|
|  0  | $10,000    |
|  1  | $50,000    |
|  2  | $100,000   |
|  3  | $500,000   |
|  4  | $1,000,000 |
| ... | ...        |

I would when users as for a proposal, I should not need to hunt for their history to see if they have delivered on time, that they are asking for an amount appropriate to what they have delivered in the past, etc... It should be a part of the process that this information is presented to everyone, that users will want to build up their reputation, and that they know what is reasonable to get their proposal approved.

## Follow Up + Impact

This is one of the problems that I think will be solved mostly by Proposal Phases and Reputation, but I want to call it out here as a weak point of the current treasury system.

I have reviewed and approved many different proposals on both the Polkadot and Kusama, however, I find it very hard to track or follow the specific impact of those treasury spends.

I think there is a lot of meta things we can do to improve this kind of stuff.

For example:

- Add a logo at the top/bottom of applications and websites with things like "Funded by the Polkadot Treasury"
- At certain funding amounts, expect / require teams to create videos highlighting their work.
    - Tie those videos on-chain or off-chain to the proposals themselves, and the reputation of the proposers.
- Require teams to describe expected impact on the ecosystem, and measure those goals.
- etc...

## Decentralizing Data

At the moment, there is no metadata about treasury spends on-chain. If you want to learn what a proposal, bounty, or tip is trying to do, you need to visit a third party website like Polkassembly to get that data. (tips have a small amount of data, but not that good)

I think we should look to add decentralized forms of the treasury spend metadata on-chain. So, adding some new fields to store and update some IPFS hash, which then links to the actual proposal metadata. This would allow anyone to build their own version of a treasury application, and allow us to iterate much more quickly on providing high quality user experiences.

Ideally, we could do the same thing here with the conversation around treasury spends too, but I am not sure what exactly that would look like.

## Metrics

I think the general consensus is that the treasury does not spend enough of its funds, but I have still yet to find a place which really paints a clear picture of what is happening with the treasury funds at a high level:

- Which team(s) has been allocated the most overall funds?
- Which teams have had the most proposals approved?
- What was the most expensive proposal approved?
- What is the ratio of approved to denied proposals?
- What percentage of the treasury is spent between spending periods?
- What categories have had the most treasury spending?
    - Wallets
    - Defi
    - Identity
    - Privacy
    - Block Explorers
    - RPC Nodes
    - etc...
- How much is being burnt from the treasury, and what would that look like at different spending amounts?

Once we know at a high level what is happening with the treasury, we can start to give direction and planning to it too. While I am sure that many people are very excited about funding defi projects, my guess is these kinds of proposals are over-represented compared to privacy and identity projects, which is probably a much more compelling use case of Polkadot.

## UI / UX Ideas

I want to write down more concrete ideas for UI/UX which I think can be worked on in the near future and have positive impact into the involvement of users into our democracy system.

I am not a UX guy, so here are some very rough mocks:

![Tinder Gov 1](/assets/images/tinder-gov-1.jpeg)

![Tinder Gov 2](/assets/images/tinder-gov-2.jpeg)

The goal is to make a **proactive** and **simple to use** application for people to vote with.

- Users can be notified on their mobile / desktop when new proposals are available to vote on.
- Users are presented with a card containing all the relevant information users need to make their decision.
- Voting can be as easy as swiping left or right to the card.
- Users can go through all proposals and make their decisions.
- At the end, a summary page is shown to the user, and a single batch transaction is submitted for all of the votes.

I think something like this could greatly increase voter participation. We would probably need custom cards for different kinds of proposals like:

- Runtime Upgrades
- Treasury Spends (tips, proposals, etc...)
- Fellowship / Society
- Configuration changes (staking, parachains, etc...)
- General extrinsics which do not match a category above

Beyond this, I think we need to create a "dashboard" for governance similar to the successful [Staking Dashboard](https://staking.polkadot.network/#/overview).

The main features I would want to see in the dashboard is individual / group profiles, and a simple to use proposal creation form. It is possible we would want to build these functionalities on top of an existing platform like [Polkassembly](https://polkadot.polkassembly.io/).

For profiles, we will need a history of treasury spends in the past so that we can do the reputation and follow up / impact ideas I originally posted.

- There should be a process for organizations to easily create a multisig with the individual users
- Organization profiles should list the users of that multisig
- All profiles should have a list of previous proposals they submitted, whether they passed, and any details on the impact of those proposals.
- Any other details which allows organizations and individuals to build up a **reputation** which can help sway the vote of people one way or another.

Finally, the current method for people to create proposals is to fill out a word document, but I think this process can be made much more streamlined and easy with a web form to fill out.

![Create Proposal](/assets/images/create-proposal.png)

Compare that to this: https://docs.google.com/document/d/1-b_DQXHVyRuAoYubCtL9dk0R6a_ev7xbwYMV518ONpo/edit

In this case, the UI can do a few things:

- Give users a template expected for filling out treasury proposals.
- Detect organizations, and make suggestions based on that.
    - For example, if the beneficiary has no identity, we can suggest that the user creates an on-chain identity for the account.
    - If the beneficiary has little or no reputation, we can put a warning if the user is asking for too mach funds. Otherwise, we can suggest to the user an upper limit based on their history and reputation.
- We can submit the proposal into a public review draft, which is handled off-chain, and allows people to get fast feedback before officially making the submission on-chain.
- The entire proposal can be turned into a well defined format, and uploaded to the chain using the preimage pallet and on-chain metadata. See https://github.com/paritytech/substrate/pull/12568

As always, these are just ideas, probably a lot has been built already, and some people with better design tastes than me can make these things a reality.

Continue the discussion on the [Polkadot Forum](https://forum.polkadot.network/t/a-better-treasury-system/291);
