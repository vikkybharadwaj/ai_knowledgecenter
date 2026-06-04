---
title: The Anatomy of an Agent Harness
slug: anatomy-of-an-agent-harness
kind: concept
spine_layer: foundations
tags: [harness, agents, orchestration, memory, context-engineering, tool-use, verification]
connections:
  - { to: harness-vs-context-engineering, type: builds-on, why: "The article's prompt ⊂ context ⊂ harness framing is exactly this note; it then dissects the harness level into components." }
  - { to: claude-code-architecture, type: used-with, why: "Claude Code/Agent SDK is the canonical thin harness — most of the 12 components map onto its primitives." }
  - { to: agentic-ai-reference-architecture, type: used-with, why: "The nine-layer reference architecture is the production-grade view of the same 12 components." }
  - { to: model-context-protocol, type: used-with, why: "Tools (component 2) are exposed to the harness via MCP." }
  - { to: dynamic-workflows-and-ultraplan, type: used-with, why: "Subagent orchestration (component 11) — Fork/Teammate/Worktree — is the scripted-fan-out idea workflows generalize." }
source: { url: "https://x.com/akshay_pachaar/status/2041146899319971922", author: "Akshay Pachaar (@akshay_pachaar), Daily Dose of DS", retrieved: 2026-06-04 }
date: 2026-06-04
depth: evergreen
claude_specific: true
---

# The Anatomy of an Agent Harness

> Distilled from Akshay Pachaar's X article *"The Anatomy of an Agent Harness"* (2026-04-06) — a
> synthesis across Anthropic, OpenAI, Perplexity, and LangChain.

## TL;DR
The **agent harness** is the complete software infrastructure wrapping an LLM — orchestration loop,
tools, memory, context management, state, error handling, guardrails — that turns a stateless model
into a capable agent. The provocative, well-evidenced claim: **the harness, not the model, usually
decides whether an agent works.** "If you're not the model, you're the harness" (Vivek Trivedy,
LangChain).

## The core argument
> *"The problem isn't your model. It's everything around your model."*

- **The harness is the product.** LangChain changed **only the infrastructure** around their LLM (same
  model, same weights) and jumped from outside the top 30 to **rank 5 on TerminalBench 2.0** — a 20+
  position move from harness design alone. A separate project hit 76.4% by having an LLM *optimize the
  harness itself*, beating hand-designed systems.
- **Agent vs harness.** The "agent" is the *emergent behavior* (goal-directed, tool-using,
  self-correcting). The harness is the *machinery* producing it. "I built an agent" really means "I
  built a harness and pointed it at a model." Anthropic literally calls the Agent SDK *"the agent
  harness that powers Claude Code."*
- **The computer analogy** (Beren Millidge): a raw LLM is a **CPU** with no RAM/disk/IO. The context
  window is **RAM** (fast, limited); external DBs are **disk** (large, slow); tools are **device
  drivers**; the harness is the **operating system**. We've reinvented the Von Neumann architecture.
- **Three nested levels** (this is [[harness-vs-context-engineering]]): *prompt* engineering crafts the
  instruction → *context* engineering manages what the model sees and when → *harness* engineering
  encompasses both plus tool orchestration, state, error recovery, verification, safety, and lifecycle.

## The 12 components of a production harness
Akshay frames the harness as a twelve-part anatomy; the eleven he walks through in detail:

1. **Orchestration loop** — the heartbeat: the Thought→Action→Observation (ReAct) cycle. Anthropic
   calls their runtime a *"dumb loop"* — all intelligence lives in the model; the harness just manages turns.
2. **Tools** — the agent's hands: schemas injected into context; registration, validation, sandboxed
   execution, result formatting. Claude Code ships six categories (file, search, exec, web, code-intel, subagent).
3. **Memory** — multi-timescale. Claude Code's three-tier hierarchy: a ~150-char always-loaded index →
   detailed topic files on demand → raw transcripts via search. Key rule: **treat memory as a *hint*,
   verify against real state before acting.** (CLAUDE.md / MEMORY.md.)
4. **Context management** — where agents fail silently. **Context rot**: performance drops 30%+ when key
   content lands mid-window ("Lost in the Middle"). Fixes: **compaction**, observation masking,
   just-in-time retrieval (grep/glob over loading whole files), subagent delegation. Goal: *the smallest
   set of high-signal tokens.*
5. **Prompt construction** — hierarchical assembly: system prompt + tool defs + memory + history + user msg, by priority.
6. **Output parsing** — native tool-calling (structured `tool_calls`, not free-text). Tool calls → execute & loop; none → final answer.
7. **State management** — checkpoints & resume. Claude Code's twist: **git commits as checkpoints** + progress files as scratchpads.
8. **Error handling** — errors compound: 10 steps at 99% each ≈ **90% end-to-end**. Classify transient /
   LLM-recoverable / user-fixable / unexpected; return tool errors *into* the loop so the model self-corrects.
9. **Guardrails & safety** — Anthropic separates *permission* from *reasoning*: the model decides what to
   attempt; the tool system decides what's allowed (~40 independently gated capabilities, staged confirmation).
10. **Verification loops** — what separates demos from production: rules-based (tests/linters), visual
    (screenshots), LLM-as-judge. Boris Cherny: a way to verify its own work improves quality **2–3×**.
11. **Subagent orchestration** — Claude Code's three models: **Fork** (identical context copy),
    **Teammate** (separate pane, file-mailbox), **Worktree** (isolated git branch per agent).

**The loop in motion:** assemble → infer → classify output → execute tools (read-only concurrent,
mutating serial) → package results → update/compact context → repeat, until a layered termination
condition fires. For tasks spanning *many* context windows, the **"Ralph Loop"** uses the filesystem
(git logs + progress files) for continuity across sessions.

## The strategic layer
- **Scaffolding is temporary.** As models improve, harness complexity should *decrease* — Manus was
  rebuilt 5× in 6 months, each time removing complexity. **Co-evolution:** models are now post-trained
  *with* their harness, so swapping tool implementations can degrade performance.
- **The future-proofing test:** if performance scales up with better models *without adding harness
  complexity*, the design is sound.
- **Seven decisions every harness makes:** single vs multi-agent (max a single agent first; split only
  past ~10 overlapping tools) · ReAct vs plan-and-execute · context strategy · verification design
  (Fowler's *guides* vs *sensors*) · permission architecture · **tool scoping** (Vercel cut 80% of v0's
  tools and got *better* results) · **harness thickness** (Anthropic bets thin + model improvement, and
  deletes planning steps as models internalize them).

## Mental model / why it matters
This is the **expansion of the harness layer** of [[harness-vs-context-engineering]] into a concrete,
twelve-organ checklist — and it reframes the debugging map: *when an agent fails, don't blame the model,
look at the harness.* The deeper lesson for an architect: **harness design is where the differentiated
engineering lives** — two products on the *same model* can be 20 ranks apart purely on harness quality.

## How to apply (in practice / consulting)
- **Audit checklist:** walk a client's agent through the 12 components — most prototypes have 1–6 and skip
  memory, state, error handling, verification, and orchestration, which is exactly why they demo well and
  fail in production.
- **Architecture conversation:** the seven decisions are a ready-made discovery framework for a client engagement.
- **Claude-stack advantage:** the Agent SDK / Claude Code ships most of these organs as primitives — you
  *configure* a harness instead of hand-rolling one. Bet **thin**, lean on verification (2–3× quality),
  and scope tools aggressively.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **builds-on** → [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md) — this dissects the harness level into components.
- **used-with** → [Claude Code Architecture](claude-code-architecture.md) — the canonical thin harness; primitives = organs.
- **used-with** → [Agentic AI Reference Architecture](agentic-ai-reference-architecture.md) — the production view of the same anatomy.
- **used-with** → [Model Context Protocol](model-context-protocol.md) — the "tools" organ (component 2).
- **used-with** → [Dynamic Workflows & the Ultraplan loop](dynamic-workflows-and-ultraplan.md) — subagent orchestration (component 11), scripted.
