---
title: Microsoft Identities on the Ethereum Blockchain
date: 2018-06-30T22:08:30-08:00
authors: shawntabrizi
layout: post
slug: /aad/microsoft-identities-on-the-ethereum-blockchain/
categories:
  - AAD
  - Ethereum
tags:
  - azure active directory
  - blockchain
  - ethereum
  - identity
  - microsoft
github: Microsoft-Identities-on-the-Ethereum-Blockchain
---

My favorite time of the year at Microsoft is the "OneWeek" Hackathon.

![Hackathon Image](/assets/images/img_5b386bd8dab8a.png)

It's a time of the year where you can work with some of the most talented engineers around to solve problems that you all agree are awesome.

I have lead a [different](https://shawntabrizi.com/metime/) [project](https://shawntabrizi.com/Skill-Finder/) every year, some of which have been hinted to in my [previous blog posts.](https://shawntabrizi.com/code/scraping-linkedin-topics-skills-data/)

This year will be no different.

## Hypothesis: Microsoft's identity system has value which can be transferred to the Ethereum blockchain

One of the amazing things about identities on Ethereum is that they are free, anonymous, and simple to create. However this also makes them pretty useless when trying to gate access to decentralized applications. There are solutions to combat this problem if you to build a reputation or token staking system around your application, but this usually involves a new identity to undergo significant onboarding before their identity becomes valuable. What if instead of completely recreating new identities, we could bootstrap them using our existing, modern identities?

There is value in Microsoft Identities. I don't mean specifically "Microsoft.com accounts", I mean the identity system that is built by Microsoft, and is used by [85% of the Fortune 500](https://shawntabrizi.com/aad/does-company-x-have-an-azure-active-directory-tenant/). If a user has an account in the Adobe company tenant, then we can pretty confidently say the following:

- That user is an employee of Adobe
- That user's identity is managed by a Company Administrator at Adobe
- That user's information first name, last name, phone number, etc. is relatively accurate
- and more...

This is actually the very information which powers Microsoft cloud services like Azure, Office 365, and the larger Microsoft Graph ecosystem. It is the same information that millions of apps use to build authentication and single-sign. There is trust because Microsoft has spent the time and energy to build a system with rigorous role based access control (RBAC), and companies have spent their time and energy populating these systems with data which powers their companies.

My hypothesis is that there is value in these Microsoft identities, simply for existing. Not all of them are equally valuable, but for large companies who methodically manage and control that information, the value is actually quite high. The question is then: "How can we migrate this value onto Ethereum?"

## Building an attestation service

Decentralized identity systems being developed on Ethereum are attempting to solve a number of critically important problems, however they are not attempting to replace all forms of centralization. There will always be some amount of centralization involved with adding claims or attestations to an identity. For example, if you want to prove that you are a US citizen, you will need to go to your state's DMV to get an ID card.

In this case, we are interested in employment, and if you want to prove that your are an employee of a certain company, you will need to prove that you are registered within their internal systems. Imagine a middle tier service that accepts a valid authentication token, and associates that with an Ethereum address that the user provides. Then, if you can then make these proofs easily accessible, you then unlock a number of possibilities for dApps to take advantage of that information. Imagine the following user stories:

- An Ethereum address may want to prove who they are (Name, Company, Role, etc…). They could do this by logging into their corporate Azure Active Directory, and store those claims on the blockchain tied to their account.
- Imagine Microsoft (or another company) wants to build a “Kudos” currency which can be used to thank other Microsoft Employees when they do nice things for one another. However, it should only be used between Microsoft employees. Using this identity claim, a smart contract which runs this cryptocurrency could verify that only Microsoft employees are the senders and recipients of the currency.
- Imagine Microsoft (or another company) wants to build a decentralized market similar to SellBuy (a Microsoft internal alias for selling items) using the Ethereum blockchain. Similar to the other stories, this decentralized market should only allow people from Microsoft, or other trusted companies to join and list their products on the marketplace. So, the dApp uses these Microsoft Identity claims to gate access to the marketplace.
- Imagine a decentralized application like [Blind](https://www.teamblind.com/), where users from different companies can anonymously chat within their own personal and shared forums. On Ethereum, an app like this can be completely censorship free and immutable, a problem that is present with the current Blind app. To ensure that these anonymous users have the right company identifier, we would use the claims about their accounts stored on the blockchain.

## The plan

![High level architecture](/assets/images/img_5b527aea81ca1.png)

The plan for the hackathon is actually relatively simple, mostly because we will be executing a proof of concept versus a battle tested, production ready design. Let's dive deeper into the pieces of the puzzle:

### Web Front End

The sign up process:

- The user goes to our web front end, and iniates a Microsoft identity login flow
- This results in an app + user access token for our middle tier resource, signed by Microsoft's identity provider
- The user then signs this access token with their Ethereum private key
- The web front end then sends a payload to the middle tier service with the access token and the signature for that payload

### Middle Tier Service

Registering the user:

- The middle tier service will recieve a "doubly signed" message, where the entire JWT is signed by the Ethereum address, and the contents of the JWT are signed by Microsoft
- It will verify that the token's resource is for the middle tier
- It will verify that the token was signed by Microsoft
- It will verify that the payload has been signed by the Ethereum account
- It will parse out specific claims about the user that it wants to store on the blockchain (MVP is Tenant ID)
- It will generate a transaction to our back end smart contract to store this data on Ethereum

### Back End Identity Contract

Storing the identity information:

- The back end identity contract will be owned by the middle tier service
- It will define an extensible user object
- It will have a mapping between Ethereum accounts and that user object
- It will expose a getter function for other contracts to access that data

### CorpCoin Contract

Testing our identity system:

- The CorpCoin contract will be a basic ERC20 token
- It will have a requirement that users have to be from a certain company/tenant to interact with the coin
- It will interact with our back end identity contract to verify the user's company/tenant
- It will issue coins to users who have not been issued coins in the past to bootstrap the 'economy'

## More to come!

That is all I am ready to share for now, but note that this is just a very high level overview. There are so many intricacies and details to think about when solving this problem. Here are just a few:

- How can we automatically remove claims of a user once their off-chain identity has been deleted or removed from a particular group/claim?
- How can we store identity claims on the blockchain such that it does not expose sensitive information about the user to people who they do not want to share it with?
- What default claims should we be storing, and how can we allow users to extend those claims for their own needs?
- How could we decentralize the middle tier service which verifies the user’s Microsoft Identity, to increase trust that the claims stored on the blockchain are real?

## Watch this video to learn more!

<iframe src="https://www.youtube.com/embed/Wg6kg2mLA3k" width="720px" height="480px"></iframe>
