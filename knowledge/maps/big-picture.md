---
title: The Big Picture — how the Claude stack fits together
slug: big-picture
kind: map
spine: true
date: 2026-06-04
---

# The Big Picture 🧠

> **This is the spine of the whole knowledge center.** Every concept note hangs off one
> layer below. When you land a new doc/article/feature, it gets placed here — so the map
> grows into a single connected brain instead of a pile of isolated notes.
> Read this top-to-bottom to *go broad*; click into any note to *go deep*.

## The spine (one stack, bottom powers top)

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTS & CONSULTING   real builds, client scenarios       │  ← what you ship
│        ▲  ship as                                            │
│  AGENT PATTERNS          chaining, routing, orchestrator-…   │  ← how you compose
│        ▲  compose into                                       │
│  CLAUDE CODE PRIMITIVES  skills, hooks, MCP, subagents, …    │  ← the toolbox
│        ▲  packaged as                                        │
│  AGENT SDK               build your own agents on the loop   │  ← the framework
│        ▲  exposes                                            │
│  CLAUDE API              tool use, caching, thinking, batch  │  ← the engine
│        ▲  runs on                                            │
│  FOUNDATIONS             prompt ⊂ context ⊂ harness          │  ← the physics
└─────────────────────────────────────────────────────────────┘
```

Each layer is a **lens on the same gather→act→verify loop**, zoomed out one level. A bug or a
design decision always lives on *some* layer — naming the layer is half the battle.

## What lives on each layer right now

### ⚛️ Foundations — *the physics of steering an LLM*
The mental models everything else obeys.
- [Prompt vs Context vs Harness Engineering](../notes/prompt-context-harness-engineering.md) — the three nested levels of control.
- [Harness vs Context vs Prompt Engineering](../notes/harness-vs-context-engineering.md) — canonical narrative of the same model; *where a bug lives tells you which level to fix.*

### 🔌 Claude API — *the engine*
The raw capabilities a request can use. **(No notes yet — a gap to fill:** tool use, prompt
caching, extended thinking, batch, citations, files, 1M context.)

### 🛠️ Agent SDK — *the framework*
Building your own agents on top of the loop. **(No notes yet — a gap to fill:** sessions,
in-process MCP, the `claude_code` preset, observability.)

### 🧭 Claude Code primitives — *the toolbox*
The named features that tune one zone of the loop.
- [Claude Code Architecture — field guide](../notes/claude-code-architecture.md) — the one model that slots every primitive into place.
- [Model Context Protocol (MCP)](../notes/model-context-protocol.md) — how the model *reaches* external tools/data.
- [Claude Code — Multi-Agent Development](../notes/claude-code-multi-agent-development.md) — worktrees / agent teams / subagents.
- [Dynamic Workflows & the Ultraplan loop](../notes/dynamic-workflows-and-ultraplan.md) — scripting fan-out across many agents.

### 🧩 Agent patterns — *how you compose*
Reusable shapes for putting primitives together.
- [Agentic AI Reference Architecture](../notes/agentic-ai-reference-architecture.md) — the nine-layer production blueprint; what separates a prototype from a real system.

### 🚀 Products & consulting — *what you ship*
Real-world scenarios that pull concepts together for a client outcome. **(No scenario notes
yet — this is where theory becomes billable.)**

## The narrative (how it all connects)
At the bottom, **foundations** say there are only three things to steer — the prompt (one
message), the context (what stays in the window), and the harness (the whole loop). The
**Claude API** turns that loop into callable capabilities; the **Agent SDK** wraps those into
a framework for building agents; **Claude Code** is the most-polished agent built on it,
exposing the loop as nameable **primitives** you can mix. Those primitives **compose into
patterns** (routing, orchestration, the reference architecture), and patterns **ship as
products** — which, for the consulting goal, means helping a client pick the *smallest* set of
primitives that solves their problem.

Read the layers as a debugging ladder too: *bad single answer* → Foundations (prompt). *Model
forgetting* → Foundations (context). *Can't recover / loop / self-check* → Foundations (harness)
**or** the right Claude Code primitive (a hook, a subagent, a workflow). The spine tells you
which floor to get off on.

## How this map evolves
The `/land` skill updates this file every time you add a concept: it assigns the note a
`spine_layer`, drops a link under the right heading here, and — when a new idea genuinely shifts
the story — rewrites the narrative. **Gaps are features:** the empty layers above are your
visible "what to learn next" list on the road to CCA-F.
