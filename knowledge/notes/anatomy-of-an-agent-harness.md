---
title: The Anatomy of an Agent Harness
slug: anatomy-of-an-agent-harness
kind: concept
spine_layer: foundations
tags: [harness, agents, orchestration, memory, context-engineering, tool-use]
connections:
  - { to: harness-vs-context-engineering, type: builds-on, why: "The harness is the 'machine' level of that model; this note dissects the machine into its organs." }
  - { to: claude-code-architecture, type: used-with, why: "Claude Code is a concrete, well-instrumented harness — its primitives map onto these organs." }
  - { to: agentic-ai-reference-architecture, type: used-with, why: "The nine-layer reference architecture is the production-grade view of the same anatomy." }
  - { to: model-context-protocol, type: used-with, why: "Tools are one organ of the harness; MCP is how Claude exposes them to the loop." }
source: { url: "https://x.com/i/article/2040732084843782144", author: "Akshay Pachaar (@akshay_pachaar), Daily Dose of DS", retrieved: 2026-06-04 }
date: 2026-06-04
depth: budding
claude_specific: true
---

# The Anatomy of an Agent Harness

> **Source note.** From Akshay Pachaar's X article *"The Anatomy of an Agent Harness"* (2026-04-06) —
> "a deep dive into what Anthropic, OpenAI, Perplexity and LangChain are actually building… the
> orchestration loop, tools, memory, context management, and everything else that transforms an LLM
> into an agent." The full article is gated (X article, not fetchable), so this note is **my own
> synthesis on the topic, anchored to that stated scope and to Claude Code** — not a faithful summary
> of Akshay's specific framing. Deepen it if/when the full text is available.

## TL;DR
An **agent harness** is the engineering scaffold wrapped around a language model that turns a single
LLM call into a goal-seeking agent. Every serious agent lab (Anthropic, OpenAI, Perplexity, LangChain)
is building the *same set of organs* around the model — they just name them differently. Knowing the
anatomy means that when an agent misbehaves, you can point at the **organ** that's failing instead of
flailing at the prompt.

## The organs of a harness
The model is the engine. The harness is everything else:

1. **The orchestration loop** — the beating heart: `gather → act → verify → (retry)`. It decides what
   to do next, calls the model, runs the chosen action, checks the result, and loops until done. This
   is the [gather→act→verify loop](harness-vs-context-engineering.md) made operational.
2. **Context management** — the *curator* that decides what enters the finite context window each step:
   selecting, compressing, and dropping (Claude calls the automatic version **compaction**). Bad context
   management is why long agents "forget" or drown in irrelevant tokens.
3. **Tools & tool-use** — the agent's hands: code execution, web fetch, file edits, external systems.
   In the Claude stack these arrive as built-in tools and [MCP](model-context-protocol.md) servers.
4. **Memory** — what persists *across* steps and sessions: short-term (the running context), session
   state, and durable memory (Claude Code's `CLAUDE.md` / memory tool). Distinct from context management:
   memory is *what's stored*; context management is *what's loaded right now*.
5. **Verification & guardrails** — the immune system: tests, LLM-as-judge, permission rules, and
   deterministic **hooks** that run regardless of what the model decides. This is what makes an agent
   *recoverable* rather than confidently wrong.
6. **Delegation / orchestration of sub-agents** — when one context isn't enough: spawning subagents,
   agent teams, or [dynamic workflows](dynamic-workflows-and-ultraplan.md) and merging their results.

## Mental model / why it matters
The big insight is **convergence**: the frameworks differ on surface API, but underneath they're all
assembling the same six organs around a model. So "which framework?" matters far less than "does my
agent have a healthy version of each organ?" And it gives you a **debugging map** — an extension of
*where a bug lives*:
- Wrong single answer → the **prompt** (inside *act*).
- Forgetting / token bloat → **context management**.
- Can't reach a system → a missing **tool**.
- Does it once but can't recover or self-check → the **loop** + **verification**.
- Falls over at scale → **delegation**.

## How to apply (in practice / consulting)
This is a ready-made **audit checklist** for any agent you build or review for a client: walk the six
organs and ask "is this present, and is it healthy?" Most prototypes have organs 1–3 (a loop, tools,
some context) and skip 4–6 (durable memory, verification, delegation) — which is exactly why they demo
well and fail in production. The Claude stack's advantage for clients is that it ships most of these
organs as named primitives, so you're *configuring* a harness rather than hand-rolling one — point a
client at Claude Code first, and only reach for a custom harness when an organ genuinely doesn't fit.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **builds-on** → [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md) — this dissects the "machine" level into organs.
- **used-with** → [Claude Code Architecture](claude-code-architecture.md) — Claude Code is a concrete harness; its primitives are these organs.
- **used-with** → [Agentic AI Reference Architecture](agentic-ai-reference-architecture.md) — the production-grade view of the same anatomy.
- **used-with** → [Model Context Protocol](model-context-protocol.md) — the "tools" organ, standardized for Claude.
