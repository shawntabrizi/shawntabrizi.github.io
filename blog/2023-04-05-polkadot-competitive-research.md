---
title: Polkadot Competitive Research Proposal
date: 2023-04-05
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - research
  - polkadot
---

## Goals

Look deeply into the technical abilities and developer experiences provided by other Blockchain and Web3 ecosystems, and bring back learnings, features, and facts to the Polkadot ecosystem.

## Funding Process

Listed below is a set of phases and deliverables for competitive research.

Each item can be funded and delivered separately, and further phases can be added on as needed.

A retainer (or bounty) should be allocated to show intent of funding future work.

Then, the expected output can be agreed upon:

- Which protocol(s)?
- What phases and deliverables?

An estimate will be generated:

- How much time (in days) is estimated to complete this work?
- What timeline should the work be completed by?
- What check-points (if any) can be used to check the progress of the work?

If everyone is satisfied with the work and output, more funding can be allocated and the process can repeat.

## Phases

### Research

Let's look to understand what other protocol teams are trying to build and provide to the Web3 ecosystem.

#### Work

- Determine the key product they are trying to create.
    - Where does it fit into the Web3 space?
    - What challenges are they trying to tackle?
- Identify the best video (or set of) that explains their technical product.
- Identify best source of documentation for technical implementation and design decisions.

#### Output

- Written report of the protocol
    - Their product space / mindshare
    - Key technical advantages / innovations
    - Technical disadvantages / tradeoffs

#### Example

- What are the different kinds of bridges, and their tradeoffs?
    - Compare protocols
    - Compare technical design
    - Compare strengths / weaknesses
    - Compare "unsolved problems"

### Benchmarks

Let's look at the raw performance of other protocols today.

#### Standard TPS

Use a base standard of measuring TPS:

- Transactions are non-killing transfers from unique existing accounts to new accounts.
- Optimistic improvements (like optimistic parallelization) are disabled.
- Investigation can look both at hypothetical limits and practical running limits.
    - Reusable and accessible hardware where possible.

#### Other Potential Benchmarks

- Sync Time
- Disk space per block
- Cross chain messaging benchmarks
- Non-standard TPS
    - Heavy TX Storage (contract execution)
    - Heavy TX Payload (remark)
    - Heavy TX Execution (ZK or similar)


#### Output

- Publicly available benchmark table with all statistics collected and compared.
- Reproduction steps written up and included with all benchmarks.

### Developer Experience

Let's look at how well they facilitate the new developer onboarding process.

#### Green Path

- Identify the best "weekend learning path" for the protocol. As in, the set of documentation, tutorials, videos, etc which can be accessed over a 3 day period to onboard users into their ecosystem.

#### MVP Product

- Create an MVP product on their ecosystem, and compare the complexity and customizability of the platform.
- Product Ideas:
    - Proof of Existence
    - Basic Art NFT
    - Name Service

- Product Extensibility Tests
    - Control / Manage Fees
    - Upgradability

### Feature Development

Let's identify and bring back high quality features to the Polkadot ecosystem.

#### Pallet Development

- Where it is identified as helpful, Substrate Runtime Pallets can be developed which encapsulate features of other protocols.
- For example:
    - Account Abstractions
    - NFT / Fungible Token behaviors
    - Games
    - On-Chain Faucets
    - On-Chain Governance
    - DAOs
    - Staking Systems
    - etc...

#### Client Optimizations

(questionable how well I would be able to do this alone, but certainly could work with people to make this happen)

- Where it is identified as helpful, improvements to Substrate Client SDK or the Polkadot Node can be developed which encapsulates the features of other protocols.
- For example:
    - Storage caching, optimizations
    - Syncing speed
    - Transaction queue
    - etc...

#### Protocol Porting

- Where it is identified as helpful, other protocols can be ported to usable Rust modules / libraries which can be used in the Substrate ecosystem.
- For example:
    - Messaging formats / protocols
    - Encoding schemes
    - Contract Virtual Machines
    - etc...

### Video / Media Content

Let's look to promote the information gained from this research to fuel better knowledge of Polkadot's advantages in the ecosystem.

#### Competitive Battlecard

- For each protocol researched, provide a competitive battlecard which allows someone in the Polkadot ecosystem to intelligently counter misinformation and shilling.
- Honest criticism of Polkadot where other protocols may be ahead, and suggestions / feedback on how to make up for lost ground.

#### YouTube Shorts

- Short form video content to get across main ideas and learnings from the competitive research.
- Working with other existing media outlets to help them create similar content for their video/audio/media.

#### Presentations

- Long form (30 min to 1 hour) presentations which specifically highlight Polkadot and other protocols

#### Articles / Documentation

- Long form written analysis of specific topics and information gained during the research process.
- Can be fitted for:
    - Technical Blogs
    - Marketing Pages
    - News Outlets (articles)
    - Technical / Developer Documentation
