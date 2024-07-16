---
title: 9 Ideas for the Decentralized Future of Polkadot
date: 2023-11-20
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - web3foundation
  - polkadot
---

##### This is a [repost from the Polkadot forum](https://forum.polkadot.network/t/9-ideas-for-the-decentralized-future-of-polkadot/4731), responding to the announcement of the Web3 Foundation's Decentralized Futures Program.

The Web3 Foundation just announced their [Decentralized Futures](https://futures.web3.foundation/) program for the Polkadot Network.

In their site, they describe 9 areas which are of key importance for these funds and for development to occur in order to support and grow the Polkadot ecosystem.

![Decentralized Future Program](/assets/images/decentralized-futures-program.png)

I wanted to present an idea for each area that I would love to see funded by this initiative.

Indeed, I would like to directly contribute to one or more of these ideas if I can find the right people to work along side with.

Obviously each of these ideas needs more time spent to flesh out the specifics, but hopefully these ideas are both concise enough to allow people to read them all, but detailed enough for people to understand the underlying philosophy and goal behind the project.

Finally, I apologize, but many of these ideas have been brewing for a while (as you will see below, I have linked to some previous writing when applicable), but this post was written fast and off the top of my head. Hopefully feedback can allow me to edit and refine the ideas further.

Find a chatgpt summary of this post here: https://forum.polkadot.network/t/9-ideas-for-the-future-of-polkadot/4731/2?u=shawntabrizi

## Technology

In the technology section, the Web3 Foundation identified the following areas: Developer Experience, Growth, and Interoperability. Here is an idea for each of these areas.

### Developer Experience: An Alternative to FRAME

Substrate has always positioned itself as being flexible to the needs of the developer. From its inception, they have always described at least 3 ways to approach the SDK:

![Substrate Dev Time vs Complexity](/assets/images/substrate-dev-time-vs-complexity.png)

It is obvious to someone who is an expert in FRAME how flexible and modular it is, and how it really can be used to develop fully customized systems.

However, to many just entering the ecosystem, FRAME itself can be quite complex to use, and especially to use correctly and safely.

I would argue that of the 3 options presented in Substrate, nearly no one builds by modifying core, and nearly no one builds by simply configuring the genesis of the node template. Entirely everyone builds using FRAME, but then the goal of flexibility in Substrate is lost due to the fact that there is only a single product to satisfy the needs of everyone.

With this in mind, I think there should exist a product between building with the Node Template and FRAME. A framework which is more simple, stupid-easy, safe, standard, satisfying, and so-on....

Perhaps a framework like: "Here is Substrate's Super Simple Safe ... STF SDK", aka "Hissss..." 🐍 (not really important what the name is, but i have had this one in mind for a while)

The core ideas:

- Less configurable... but works out of the box.
    - You do not get to customize every single type in your runtime... but then you also don't need to worry about or eat the costs of having every type be generic in your runtime too.
- Providing all the primitives you expect, exported as a single system.
    - For example not feeling that you have a System Module, Balances Module, Utility Modules, XCM Modules, Consensus Modules, etc which all need to work with what you are building. It is all packaged with standards already accepted in the wider blockchain ecosystem, and you build against that.
- Targeted toward simplifying specific ecosystem objectives, like cross chain transfers, defi, multi-token systems, smart contracts, etc...
    - Lets build the framework not to maximize flexibility, but to be the best at the goals which the current crypto ecosystem are focused on.
- Compatibility with the chains using FRAME.
- Ideally, well developed user stories allowing people to transition from FRAME to Hiss and Hiss to FRAME.

In summary, FRAME was the correct decision for frameworks to provide to the Polkadot ecosystem. It is designed to be maximally flexible. But now that it exists, we should start to look at lowering the barrier of entry for developers who want a more simple product, just like what was promised with developing with just the Node Template.

I think it is time for Polkadot to start getting alternative runtime SDKs.

### Growth: FRAME + ink! (The Merge)

What if you only needed to learn a single language to join any part of the Polkadot ecosystem? What if you wanted to build a smart contract, an on-demand parachain, or a dedicated parachain, that you could take the exact same codebase, and use it to launch all three when the time and conditions are right?

![Pathway for a developer](/assets/images/the-merge.jpeg)

That is the main vision behind a merge of FRAME and ink!. My belief is that runtime development is a complete superset of smart contract development. For historical reasons, both of these frameworks were built separately, but also found their way to converge over time. The shift from FRAME v1 to FRAME v2 was actually due to ink! and how they masterfully used attribute macros to build a much better Rust eDSL. However, simple syntax (like declaring calls, storage, events, errors) which could be standardized across the two languages are not, and as such, users feel that they need to learn two languages, not one.

The steps between tinkering with Polkadot and launching a parachain is just too massive at the moment. There is really no middle ground or story for a single individual to launch something like a parachain without a large team and a lot of funds.

Instead, we can market the first step toward building a parachain is building a contract with ink! and deploying it to an existing parachain. Then, since in our world, ink! and runtime development use the same language, successful products can simply turn their contract into a more performant on-demand parachain. Finally, if their on-demand parachain is demanding so much blockspace, they can obtain a dedicated slot, potentially with all the same codebase.

Of course, if you are developing code for the runtime, you get access to more APIs and more low level access to your blockchain, but the main idea should be that through your development process in the Polkadot ecosystem, you are only writing new code, not rewriting existing code.

In this story, users have a really comprehensive story from tinkering as an individual, to launching parachains on Polkadot, exactly the kind of growth we need in our ecosystem.

Most of the ideas around the merge I had were initially documented here: [The Merge of ink! and FRAME](./2022-08-11-the-merge-of-ink-and-frame.md).

Perhaps the goal would not be to merge FRAME into ink!, but maybe Hiss (suggested above), could be that extension of ink! to provide this end to end story.

### Interoperability: Reading State Across Parachains

Among the 9 ideas in this write up, this is the one with the least amount of concrete thought. However, the basic idea is this:

A huge downside of multi-chain interoperability is coordinating the state of chains as a part of constructing cross-chain messages. With monolithic chains like ethereum it is easy and completely synchronous to inspect the state of any contract or application in the system.

In Polkadot, XCM is already an extremely expensive protocol relative to basic runtime functions, but it almost entirely removes state reading and reporting from the protocol because it is a bad practice.

As of today, I do not believe there exists a set of tools which standardizes how two parachains who want to communicate to each other with XCM should synchronize their state and trigger their logic based on changes from the other chain.

It seems some kind of offchain worker with light client proofs could be used to solve this problem, but likely this is not a trivial tool to create, and it certainly should be one which is standardized across our ecosystem.

I think such tools are the catalyst needed for us to create oracle chains, which report up to date prices of other cryptocurrencies, which is a fundamental primitive for many defi tools. Hopefully in the future, these tools are also used to bring data from robust identity chains to the rest of our ecosystem.

As much as it is important to have protocols which allow us to describe moving an asset from one chain to another, I think for us to unlock the full potential of interoperability in Polkadot, we need to start also thinking about how we can let chains focus on generating high quality data, and making it dead simple and cheap for other chains to access that data when they need it.

## Development Ecosystem

In the Development Ecosystem section, the Web3 Foundation identified the following areas: Development Services, High Value Partners, and Enterprise. Here is an idea for each of these areas.

### Development Services: Interactive and Meaningful Tutorials

At the ground level, we need to continue to develop new ways to teach others to build with the Polkadot SDK, and actually have them use that information to launch meaningful products.

What do we want to see more of in our ecosystem?

- More defi products
- More cross chain interactions
- NFTs
- Games

One of the best ways to achieve this is to have tutorials which show the creation of _working_ systems, which build these kind of products from zero to one hundred, with room to customize where needed.

The Polkadot developer community has always been good at producing high quality code, but not so good at educating others to be high quality coders. For this, we need to throw money and incentives at the problem.

- create and maintain a number of high quality tutorials
    - these should be written by the experts, not having people who themselves are learning trying to teach others. I often think we are plauged with blind leading the blind.
    - target developers who need "a break" from coding. As a developer, I can speak to the fact that after large projects, having the ability to transition to create tutorials or other documentation is a nice escape from development.
    - treat this kind of work and maintenance as important as writing core code. That includes rewarding high quality authors and maintainers similar to core contributors
    - create frameworks and tools which make tutorial creation minimal effort for core knowledge holders
        - Use real rust projects, git, basic markdown, VS Code editor, and other familiar tools as the basis for creating and expressing tutorials.
        - On-hand writers to help shape "raw" content into expressive stories.
        - On-hand graphic/web artists to turn tutorials into something visually appealing and unique in story.
- each tutorial should result in a product ready working products that we would like to see exist in our ecosystem
    - There is no value in a tutorial which teaches users to install the "name-pallet" into their chain. Or a tutorial which has users use unbounded vectors, inefficient storage structures, or other anti-practices. Tutorials should result in something useful and to be used.
    - A simple practice to achieve this could be to specifically write tutorials on creating the pallets found in Polkadot itself. However, this is also probably not the right formula.
- tutorials should capture the whole scope of learning, from substrate specific rust, to pallet development, to parachain / solo-chain deployment, to upgrades, migrations, and other long term maintenance.
- tutorials should be gamified and fun for the author. We should look to create full end to end experiences that users can pick up and put down on their free time, and on-chain rewards like NFTs when users complete some tutorial.

Some of these efforts are already in progress in different forms, but in my opinion the vision, incentives, and people working on this have never quite been the right mix for success. With the decentralized futures program and the right people, perhaps this can change.

I am working on some of this stuff already as a part of my efforts in the academy, with the web3 foundation education team, and personal education initiatives I am doing locally to my home. Hopefully we will see a revival of substrate kitties soon.


### High Value Partners: Community Auditors and Audits

Audits are key to the survival and trust developed for ecosystems. However, for many development teams, audits are very expensive, and for many potential audit teams, they do not have access to the information or resources needed to be experts in our ecosystem, and actually provide proper audits.

For this, we need to combine two different initiatives into a single story:

- An education path for successful audit teams outside of Polkadot to become expert Polkadot auditors.
- A path toward free/subsidized audits from these teams for our ecosystem.

This starts with funding and education. We need to draw in audit teams by paying them to complete an audit in our ecosystem, but targeted also as a learning experience for them. Perhaps in this situation, they will act always as a secondary audit for a primary auditor. These audit teams would be guaranteed some funding for their time (paid for by treasury / decentralization funding), and they would see a large queue of teams who are looking for audits for their work, meaning much more work in the future.

There should be a process for teams to submit a request for audit, and some community / technical feedback allowing prioritization and subsidization of those requests. Also some tracking to see how much support teams have received in total, and the history and knowledge of the audit teams.

In many ways, this reminds me of existing systems in our world like court assigned lawyers for defendants that cannot afford legal representation, or government contract requests which are placed in public, and allowing different parties to bid on fulfilling those requests.

In the end, any level of respectable auditing will have long term impact in our ecosystem. We can draw in and even create more high valued partners by ensuring our products are not as likely to be attacked or have erroneous bugs.

### Enterprise: Competitive Research

In the spirit of attracting existing successful Web2 companies into the Polkadot ecosystem, we need to make it obvious to them that Polkadot is the correct choice among competitors and peers.

The truth is that many of the most successful blockchain ecosystems got that way off of narrative manipulation and marketing, and not actually working or philisophically aligned technology.

Beyond that, other teams have found a product market fit which seems to still elude the Polkadot ecosystem. Such problems are cyclic. Without users you don't draw in new products. Without new products, you don't draw in users.

Of course improving our own product is absolutely the best first step to remedy this problem, and plenty of that is already happening in Polkadot. But what I suggest here is different in that we should also be more on the offensive and call out fact from fiction.

A lot of this proposal has already been written down here: [Polkadot Competitive Research Proposal](./2023-04-05-polkadot-competitive-research.md)

I think there are two key outcomes which come from competitive research:

- calling out narratives and stories which are false in other ecosystems, many of which were pioneered by Polkadot
    - Does a chain claim to achieve 1 Million TPS? What does that even mean? How would this actually compare to other protocols, and not some hand crafted benchmark.
    - "Instant finality" sounds cool, but is it really?
    - Other chains claim to have "forkless upgrades" or "shared security", is that actually true?
    - Modular blockchains are the future, but where in the stack is modularity a benefit, and where is it actually a poor design decision?
- learning from our competitors to better shape our product
    - Polkadot as a culture seems very deep into our own research and ideas. Many of the most successful teams have used ideas and standards from other protocols to accelerate the development of their products.
    - What products can we create which directly compete with what enterprises and users find exciting in other ecosystems.
    - how can we create more directly comparible products, and prove that our technology stack is actually better. For example, growing Polkadot SDK into a platform for developing the best L2s, in competition with arbitrum and optimism, as well as parachains.

Unfortunately, existing parties have not seemed as interested in directly funding this work, however the decentralized futures program may be the way to get such an effort going.

## Community

In the Community section, the Web3 Foundation identified the following areas: On-Chain Governance, Decentralized Marketing, Events. Here is an idea for each of these areas.

### On-Chain Governance: Treasury Proposal Templates

Open gov has been an interesting experiment so far. From my observations, the blockchain level APIs and mechanisms which exist are pretty good, but the community is WRONG in trying to interface directly with it.

Even the existing UIs today like Polkassembly and Subsquare seem to be just wrappers on top of low level blockchain APIs, and not themselves an app which is expected to be used first and foremost by casual builders and new faces in our ecosystem.

A lot of this idea is already written down in this thread: https://forum.polkadot.network/t/a-better-treasury-system/291

But at a high level, I imagine that we use our social standards to push forward behaviors beyond the rules of the blockchain.

As an initial MVP, I would expect that we try to standardize the following:

- An online form that users can fill out easily to describe the funding they want. Not a word doc to fill out, but actual web based UX, that can modify itself and help users through the process.
    - These could even be different depending on the track.
- Publishing to the public FIRST, before posting anything on chain. The discussion of proposals should happen far before anything shows up on chain. Is it possible to design systems where the outcome of proposals are known before they are posted on chain? Or as close to this as possible.
- Gamification of treasury spending. No one wants grifters or others to take advantage of the treasury funds. No one goes to an investor and asks for millions of dollars without any evidence of previous work done successfully. We should guide people through a tier system, where their first proposal is small in scope, and small in cost. Perhaps even just paying users to make a more formal roadmap for large ideas. Then, as users successfully complete proposals, their ability to ask for more increases, up to the point where they are getting large funds and large projects that we expect to support well established teams.
- From gamification, we will also be able to establish off-chain reputation sysytems. We should have a hub which is centered around individual contributors and teams. When someone asks for funds, it should be easy to see what things they have delivered in the past, and how well those products have been received by the ecosystem. You would never buy a product online from a seller with no reputation. Why would you give a stranger money to build something with no background information?
- The proposal process does not end when the vote passes. There should be entire hubs and discussion areas for each proposal. Imagine forums where users can query the builders on progress, provide feedback, and even hold builders accountable for the funds they received. This is all in the hopes of finding teams which don't just market and sell their idea well, but also execute well and show effort to be integrated in our community.

Of course all of these things are not rules established on chain. Anyone could make a proposal directly on chain asking for any amount of funds. But we as a community can direct users to our socially accepted process, and encourage users to show their good intentions by having them grow in our community, not just ask for millions of dollars from out of nowhere.

In this context, I think there is nothing wrong with having more "centralized" thinking and processes around the treasury, knowing that this often provides more efficient processes to finding high quality teams and output. Most importantly, it does not compromise the decentralized nature of the underlying protocol.

### Decentralized Marketing: Modular Marketing Materials

People who are reading this post are probably in the top 1% of the top 1% of people following the Polkadot ecosystem. So let me ask you:

> If you had to make a presentation to describe and sell Polkadot to the world, how would you get started? What resources would you use?

As someone who has given countless presentations, I feel that no such resources exist, and in fact I am making most of my content from scratch. From the presentations I create, I see many people in the ecosystem asking for links to the presentation, and I have seen my images, words, and even ideas show up in twitter threads, blog posts, other presentations, and more.

When thinking about decentralized marketing, this is the kind of things we need. Not create bigger megaphones to blast out our ideas, but create reusable scripts that can be spread by smaller voices, and customized to the needs of the communities being reached out to.

With this in mind, I envision a marketing oriented resource website, providing content in multiple forms about many different key topics in our space.

For example, imagine that each topic had the following formats available:

- One sentence summary.
- One paragraph summary.
- One essay summary.
- One (or more) image(s).
- One powerpoint slide.
- One Twitter post.
- One Twitter thread.
- One (or more) competitive comparisons.
- etc...

Then imagine we had this for all the key topics and differentiators in the Polkadot ecosystem, now and in the future:

- Open Gov
- Data Availability
- Execution Sharding
- Treasury
- XCM
- FRAME
- Polkadot SDK
- Forkless Upgrades
- etc...

These words could be copied, could be mutated, or could just be read by others. But the resources themselves are high quality and coming from and reviewed by the experts in the field. Providing ammunition to everyone who has access to the internet and a belief in what we are building.

Beyond that, I imagine that we provide many additional resources to make content development in Polkadot easier.

- Access to graphics and themes which can be used throughout the ecosystem:
    - multiple visuals of the DOT token
    - multiple versions of the polkadot logo
    - multiple themes (for example, most recently the spacemen theme)
    - generators for custom parachain / xcm visuals
    - the best image representations of slogans and philosphies of Polkadot
- More competitive research, and specific talking points to counter false narratives.
- Reusable, short video clips with subtitles from various presentations, meetups, interviews.
- Photos of our vibrant ecosystem, people, companies, meetings, development, workshops, etc...
- And so much more.

All content would be completely open source, zero copyright, and free for the public to use as they see fit.

I think we if had to be critical of marketing efforts in the space, it was that we had people who did not have the right ammunition to effectively spread the winning messages in this space. If we want to truly adopt decentralized marketing, we need to give everyone a powerful voice with easy access to persuasive data and messaging.

### Events: Familiar Faces Fund

When I think about the future of decentralized events in Polkadot, I worry that we won't properly curate the voices which are used to represent our mission and direction. It seems that large events like Web3 Summit, Polkadot Decoded, and Sub0 are some of the only places where our public gets an insight into what we are building and where we are going.

As Polkadot becomes more decentralized, it will not be as easy for individual catalysts and leaders to be able to travel and represent their work. Having the right people at our events and shaping the narrative around Polkadot is just as important as having the right developers architecting our codebase.

Having seen how these kinds of large events are prepared behind the scenes, I know that we make the agenda based on those who request to present, not by actually reaching out and curating a story that we want to tell. I don't think this is the right way to get the best representation for Polkadot.

We have to remember many of our best speakers and representatives are already over their head in work. Without such a support program, these speakers would need to coordinate and pay for all this travel at their own cost. This usually only makes financial sense for leaders who want to shill their product, and this does not lead to the kind of content that is best for the whole ecosystem. For those looking to the treasury to support this, the overhead is currently massive, and the politics at the time are a large deterrent to open that can of worms.

We can achieve the desired outcome using a team and set of funds support key speakers. We need to figure out with them how we can make these events more accessible to them, and the best use of their time.

Simple things like managing hotel reservations, flight tickets, and other basic administration, to more complex things like shaping a narrative of what we want the public to see and hear from Polkadot, and finding the right people to present those parts of the story.

And we should think even beyond just the Polkadot ecosystem, ensuring that we have proper representation at large multi-ecosystem events like EthCC, EthDenver, Devcon, Devconnect, etc...

If we do our job well in this context, we can create famous and recognizable faces outside of just Parity and the original Polkadot Founders who represent our mission and contributions to this ecosystem, and whom other look to for direction and inspiration.

So really, I would like to see:

- changing the direction from selecting representation from among those who ask to present, to reaching out to key presenters and asking them to present at key events
    - ultimately making things more proactive from the events side, and pushing work onto event coordinators and off of the presenters where possible
- supporting those presenters to be at those events: funds and basic administrative help for their travel
- collaborative narration: taking advantage of these key speakers, and forming ahead of time a set of presentations which capture the key takeaways we want the audience to know about Polkadot.
    - We should never have two presenters talk about the same topic.
    - We should never have two presenters contradict the messaging between their talks.

For something like this to exist, we need funding and a small group of individuals who can help shape this and make it happen.
