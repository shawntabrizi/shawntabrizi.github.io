---
title: The Role of the Polkadot Treasury
date: 2024-07-08
authors: shawntabrizi
categories:
  - Polkadot
tags:
  - treasury
  - polkadot
---

##### This is a [repost from the Polkadot forum](https://forum.polkadot.network/t/is-the-treasury-polkadots-biggest-vc/9015), used to capture my thoughts on how Polkadot should manage spending in its treasury.

In my opinion, OpenGov and the Polkadot Treasury have been some of the most exciting experiments coming out of the entire Web3 movement so far.

The rules of these systems are relatively simple and well-defined:
- The Treasury perpetually grows through transaction fees and inflation.
- Spending of the treasury is determined by existing token holders.

However, the final outcome of this game is not simple or well-defined at all.

One thing is clear though: because the treasury is controlled by DOT token holders, voters are naturally incentivized to spend funds that improve the Polkadot Ecosystem and the DOT token value.

But beyond that, what is the role of the Polkadot Treasury?

## The Role of the Treasury

Compare the relationship between:

- Modern Societies
- Governments
- Public Treasuries

and

- The Blockchain Ecosystem
- Polkadot
- The Polkadot Treasury

Much of the advancement of modern society can be attributed to innovation created by free-market economics. The blockchain ecosystem operates under similar principles, where competition and the drive for profit lead to technological advancements and efficiencies. However, just as in modern societies, there are certain essential resources and services that are best provided as public goods.

**My view is that the Polkadot Treasury should primarily be used to support public goods in the Polkadot Ecosystem and should avoid speculative investments.**

### Support Public Goods

In modern societies, governments use their treasuries to fund public goods and services that benefit everyone, such as roads, public parks, education, and healthcare. These are things that the free market either cannot provide effectively or would provide only to those who can afford them, leading to inequality and inefficiency.

Similarly, in the Polkadot ecosystem, the Polkadot Treasury should be used to fund initiatives that provide broad, non-excludable benefits to the entire community.

These can include (but are not limited to):

- Development SDKs: Tools and libraries that make it easier for developers to build on Polkadot.
- Block Explorers: Platforms that allow users to explore blockchain data freely and easily.
- Client Libraries: Libraries in multiple programming languages that facilitate interaction with the Polkadot network.
- Public Nodes: Nodes that allow light clients and their users access to the network.
- Public Education: Initiatives that educate users and developers about the Polkadot ecosystem.

Just as public parks and roads benefit everyone in a community, public goods in the Polkadot ecosystem benefit all users and developers. Most importantly, these kinds of services have few sensible pathways to be funded except for a public treasury.

### Avoid Speculative Investments

I would also argue that treasury spending controlled by the public usually leads to poor speculative decision-making. Generally, voters lack the technical expertise needed to evaluate complex proposals and cannot easily gain insight into the inner workings of a business, resulting in decisions based on superficial understanding or emotional appeal.

Public votes (especially in the blockchain space) can also be swayed by "popular trends" and short-sighted results. This results in projects that attempt to bribe the treasury or decisions that compromise on the principles of what we are trying to achieve in the long term.

In contrast, VC funding usually yields higher quality results due to accountability and expertise. Investors put their own money and reputation at risk when backing a speculative project, and as a result, are incentivized to conduct thorough research and make informed decisions. VCs are also more capable of supporting teams directly and gaining transparency into the actions of a team. This is why free markets have generated great results.

If we could get VCs in the Polkadot Ecosystem interested in evaluating and supporting public goods efforts, that would be great! We have seen evidence of this happening, for example, Consensys in the Ethereum ecosystem. But generally speaking, we cannot expect that philanthropy and corporate sponsorships will be there when we need them, and thus the treasury must exist to provide access to resources to fund public goods.

### Flexibility and Experimentation

There are no hard-coded rules for treasury spending, nor would we want to introduce any. It is important in a decentralized system to keep low-level APIs unopinionated and allow for community influence to dictate the behavior of the system.

I am not against the idea of the treasury being used in other creative ways, especially when the cost/risk is relatively low or the experimentation value is high.

For example, we have recently seen a surge of various marketing efforts through the treasury. While I may not agree with many of the specific pathways and choices, I could see how marketing Polkadot to the world is a kind of public good for our ecosystem. Thus, perhaps treasury funding is the right place to fund marketing efforts.

There were also recent posts on having the treasury invest in Parachain projects. As I have already said, I don't think OpenGov can make great decisions on speculative investment opportunities, but that doesn't mean I would be against trying it out to see what happens. Especially if the pool of teams that qualify for funding would be limited.

However, I think that these kinds of speculative efforts should be the exception, not the norm. We can only establish a norm by discussing our collective belief on where the treasury should be spending and making clear pathways for projects that don't align with that vision.

## My Take on Other Funding Avenues

While at PBA Singapore 2024, we had the opportunity to hear from Web3 Foundation's Seraya from the Grants team talk about funding avenues in the Polkadot Ecosystem.

His presentation can be found here:

[Web3 Foundation Grants Presentation](https://docs.google.com/presentation/d/1klUCa1QonjVxV_yc4VWWo3I2aXwgELj8np1ZnfCzc8I/edit?usp=sharing)

Hopefully, a video link will be made available in the near future, and I will happily update this post to include that when it is.

His presentation covered many different avenues such as:

- Decentralized Futures Program
- W3F Grants Program
- Treasury Funding
- VC Funding (like through Polimec)

He spoke on the mechanics and practicalities of these funding avenues, but not much on which one to pick for your project or idea.

Here is my mental model on where I would expect certain projects to best fit in terms of getting their funding request approved:

![Funding Decision Tree](/assets/images/funding-decision-tree.png)

<details>

<summary>Mermaid Diagram Text</summary>

 ```mermaid
graph TD
    FP(Is your product for profit?)
    FP-->|No|PUBVAL
    FP-->|Yes|INVESTOR

    PUBVAL(Does your product provide clear/immediate public value?)
    PUBVAL-->|Yes|T[Treasury Funding]
    PUBVAL-->|No|LONGTERM

    LONGTERM(Does your product align with the vision of Web3?)
    LONGTERM-->|Yes|W3F[W3F Grants Program]
    LONGTERM-->|No|WHY[Why should we fund you?]

    ALIGN(Does your product align with the vision of Web3?)
    ALIGN-->|Yes|DFP[Decentralized Futures Program]
    ALIGN-->|No|WHY[Why should we fund you?]

    INVESTOR(Does the product have clear/existing investor value?)
    INVESTOR-->|No|ALIGN
    INVESTOR-->|Yes|VC[VC Funding]

    style T fill:#f9f,stroke:#333,stroke-width:4px;
    style W3F fill:#f96,stroke:#333,stroke-width:4px;
    style DFP fill:#6f9,stroke:#333,stroke-width:4px;
    style VC fill:#69f,stroke:#333,stroke-width:4px;
    style WHY fill:#f99,stroke:#333,stroke-width:4px;
```

</details>

Again, this is just my opinion, so I would be really happy to hear about other important funding avenues not included, and other people's take on the decision path to select that avenue.

## What do you think?

I would be interested to hear other people present their opinions.

- What is the role of the Polkadot Treasury?
- How should the treasury approach speculative investments?
- In what ways should we experiment with Treasury spending?
- What are other key funding avenues which were not mentioned and how should they be used?

Continue the conversation further in the [Polkadot Forum](https://forum.polkadot.network/t/is-the-treasury-polkadots-biggest-vc/9015).
