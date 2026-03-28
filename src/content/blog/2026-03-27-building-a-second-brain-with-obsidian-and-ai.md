---
title: Building a Second Brain with Obsidian and AI
date: 2026-03-27
tags:
  - personal
  - tutorial
---

> This post was written with the assistance of AI.

## The Spark

When Claude 4.5 Opus dropped, something clicked. I'd been using AI tools for a while — mostly for writing scripts and answering questions — but the results were always mediocre. Useful, not transformative.

Claude Code changed that. An AI agent that could directly use tools on my computer, read and write files, search through projects, run commands — that was a different thing entirely. I started playing with it in December 2025, and by January I was on vacation with free time to really explore what was possible.

The insight I kept coming back to: AI tooling is going to continue evolving rapidly. New models, new agents, new frameworks — they'll keep coming. What I needed wasn't to master any one tool. I needed a **digital twin** — a persistent, portable knowledge base that I could bring with me to any new agent, so it could immediately serve me with full context about who I am and what I care about. No more starting from zero with every new conversation.

## The Architecture

I was already familiar with Obsidian, and we know that AI agents work naturally with markdown. It made sense to combine the two: an Obsidian vault, version-controlled with git, encrypted with git-crypt, and designed for AI agents to read and write.

The vault is organized by type of information:

```
brain/
├── _system/       # Agent context: identity, goals, conventions
├── daily/         # Daily notes (one per day)
├── journal/       # Weekly and monthly reviews
├── projects/      # Active project notes
├── research/      # Research on topics I'm exploring
├── people/        # Contacts and relationship notes
├── references/    # Clipped articles and bookmarks
├── memory/        # Long-lived agent knowledge
└── archive/       # Completed or inactive material
```

The `_system/` directory is the key innovation. It contains files that give any AI agent immediate context:

- **My profile** — who I am, what I do
- **Active goals** — what I'm currently focused on, with deadlines
- **Agent identity** — behavioral guidelines (be direct, take action, hold me accountable)
- **Conventions** — formatting rules so everything stays consistent

When a new conversation starts, the agent reads these files first. It doesn't start from zero — it knows my priorities, my style, and my constraints.

## Ingestion: Bringing My Life Into the Vault

The vault itself is only as useful as the information in it. So a big part of the work has been setting up **ingestion channels** — automated pipelines that pull my data from various services into local storage where agents can access it.

So far I have automated backups for email and chat history, with photo migration in progress. The goal is to eventually ingest health records, financial data, location history, media consumption — a comprehensive local archive of my digital life.

This is the "digital twin" idea in practice. The more data that's locally accessible, the more useful any AI agent becomes when pointed at it.

## Agents Everywhere

I've been experimenting with multiple AI agent setups that all point at the same brain vault. Some run on my home server, some on a VPS, some through Claude Code on my laptop. They connect through different interfaces — Telegram bots, CLI, direct file access.

The agents are set up to aggressively archive content and relevant information into the brain. Even if something won't be accessed again right away, it could provide value in the future when a different agent or a different question surfaces it.

## The Fully Local Dream

Here's what I believe: a totally self-hosted archive of my life will enable me to take advantage of AI agents better than anything else. The person with the most complete, most organized, most accessible personal knowledge base will get the most out of whatever the next generation of AI brings.

We're not there yet. Local models aren't as capable as cloud ones, and the tooling for fully local AI agents is still maturing. But the trajectory is clear, and the vault is ready for when local models catch up. Everything is markdown, everything is local, everything is encrypted. No vendor lock-in, no cloud dependency for the data itself.

## What It's Actually Good For

Beyond the grand vision, the brain has already become practically useful in my daily life:

- **Spending patterns** — agents can analyze my financial data and surface trends I wouldn't notice
- **Recommendations** — with my media consumption history in the vault, agents give much better show and movie recommendations
- **Shopping and cooking** — meal planning and grocery lists that actually account for what I have and what I like
- **Task tracking** — a single place for todos that agents can help prioritize and remind me about
- **Research synthesis** — connecting information across notes I wrote weeks or months apart

The compound effect is real. Every note, every daily log, every piece of ingested data becomes searchable context for future conversations. The vault gets more useful over time.

## The Ecosystem

I'm not the only one exploring this space. There's a growing community of people building personal knowledge bases designed for AI agents. The challenge is that it's hard to use other people's open source tools for something this sensitive — a vault containing your entire digital life is a ripe target for attacks. I'm hopeful that something will emerge as a standard, secure foundation for this kind of system.

For now, keeping it simple — markdown files, git, encryption — feels like the right bet. The tools will evolve, but the data format won't need to change.

## Getting Started

If this interests you, the minimum viable version is simpler than you'd think:

1. Create a git repo with a few folders: `daily/`, `projects/`, `research/`
2. Add a `CLAUDE.md` (or equivalent) that describes the structure and how you want AI to interact with it
3. Create a `_system/` directory with your goals and conventions
4. Start writing daily notes
5. Point an AI agent at the repo and start collaborating

You don't need encryption on day one. You don't need ingestion pipelines. Start with a daily note and a project note, and let the system grow from there.
