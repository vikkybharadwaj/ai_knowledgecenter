---
title: The Big Picture — how the Claude stack fits together
slug: big-picture
kind: map
spine: true
date: 2026-06-04
---

# The Big Picture 🧠

> **This is the spine of the whole knowledge center.** Every concept hangs off one
> layer below. When you land a new doc/article/feature, it gets placed here — so the map
> grows into a single connected brain instead of a pile of isolated notes.
> Read this top-to-bottom to *go broad*; click into any note to *go deep*.

> 🗺️ **Two things live on this spine, and they are not the same.** The interactive
> [concept graph](../../docs/concepts/graph.html) plots **tech-stack concepts** — the
> primitives, systems, and patterns of the Claude stack (Tool Use, MCP, Subagents,
> Worktrees, Orchestration…) — wired by **dependency** edges (solid: *runs-on, depends-on, part-of, uses*;
> arrows point to what a thing needs) and **relation** edges (dashed: *used-with, alternative-to*), so you
> can read the stack bottom-up and learn how it fits.
> The **source notes** listed below are the distilled articles that *back* those concepts —
> the content you read to go deep. Concepts are the map; notes are the territory. The graph
> is generated from `knowledge/concepts/*.md`; the notes live in `knowledge/notes/*.md`.

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
- [The Anatomy of an Agent Harness](../notes/anatomy-of-an-agent-harness.md) — dissects the "harness" level into its six organs (loop, context, tools, memory, verification, delegation).
- [Harness engineering — reliability lives outside the model weights](../notes/harness-engineering-discipline.md) — the discipline: capable models still fail; the *same* model swings 20%→100% as you add the five harness subsystems (instructions, tools, environment, state, feedback).

### 🔌 Claude API — *the engine*
The raw capabilities a request can use.
- [The Claude API agent primitives](../notes/claude-api-agent-primitives.md) — the tool-use loop, MCP connector, prompt caching, batch, computer use; *an agent is ~20 lines.*

### 🛠️ Agent SDK — *the framework*
Building your own agents on top of the loop.
- [The Claude Agent SDK](../notes/claude-agent-sdk.md) — the same engine as Claude Code, as a library: hooks, subagents, MCP, sessions, headless/CI, Bedrock/Vertex/Foundry auth.

### 🧭 Claude Code primitives — *the toolbox*
The named features that tune one zone of the loop.
- [Claude Code Architecture — field guide](../notes/claude-code-architecture.md) — the one model that slots every primitive into place.
- [Model Context Protocol (MCP)](../notes/model-context-protocol.md) — how the model *reaches* external tools/data.
- [Claude Code — Multi-Agent Development](../notes/claude-code-multi-agent-development.md) — worktrees / agent teams / subagents.
- [Dynamic Workflows & the Ultraplan loop](../notes/dynamic-workflows-and-ultraplan.md) — scripting fan-out across many agents.
- [One shared context vs. many isolated contexts](../notes/execution-context-isolation.md) — what actually forks: *modes* stay in one window, *agents* fork fresh ones (+ the six permission modes).
- [worktree.baseRef — fresh vs head](../notes/worktree-base-ref-fresh-vs-head.md) — the git dial under worktree parallelism: branch agents from clean published code (`fresh`) or your live WIP HEAD (`head`).
- [Claude Code Routines — unattended cloud automation](../notes/claude-code-routines.md) — the saved config that runs *itself* on Anthropic's cloud on a schedule / GitHub event / API call (the "operate it for me" primitive).
- [One giant instruction file fails — progressive disclosure](../notes/progressive-disclosure-instructions.md) — why a 600-line `CLAUDE.md` rots (lost-in-the-middle, budget exhaustion) and the entry-file + topic-docs + code-embedded structure that fixes it.

### 🧩 Agent patterns — *how you compose*
Reusable shapes for putting primitives together.
- [Agentic AI Reference Architecture](../notes/agentic-ai-reference-architecture.md) — the nine-layer production blueprint; what separates a prototype from a real system.
- [Use Claude Code vs build your own](../notes/claude-code-vs-build-your-own.md) — the four-altitude decision tree (buy → use → configure → own the loop).
- [Six dynamic-workflow patterns & the three failure modes they fix](../notes/dynamic-workflow-patterns.md) — classify-and-act, fan-out-and-synthesize, adversarial verification, generate-and-filter, tournament, loop-until-done.
- [The repository is the agent's only durable memory](../notes/repository-as-system-of-record.md) — "info not in the repo doesn't exist for the agent"; ACID state files (`AGENTS.md`/`PROGRESS.md`/`DECISIONS.md`), the fresh-session test, and rebuild-cost as the metric.
- [Never let the agent declare its own victory](../notes/completion-is-externalized.md) — externalize "done": feature-list state machines, three-layer/E2E verification, WIP=1 scope control, and observability inside the harness.

### 🚀 Products & consulting — *what you ship*
Real-world scenarios that pull concepts together for a client outcome.
- [Scenario: bootstrapping a company's AI stack from zero](../notes/bootstrapping-company-ai-stack.md) — discovery questions + phased rollout (buy → wire MCP → codify skills/hooks → build the differentiated slice).

> 🏗️ These last three notes form a cluster with its own Map of Content —
> **[Building & advising on AI stacks](building-ai-stacks.md)** — the evolving consulting section.

## The narrative (how it all connects)
At the bottom, **foundations** say there are only three things to steer — the prompt (one
message), the context (what stays in the window), and the harness (the whole loop). The
**Claude API** turns that loop into callable capabilities; the **Agent SDK** wraps those into
a framework for building agents; **Claude Code** is the most-polished agent built on it,
exposing the loop as nameable **primitives** you can mix. Those primitives **compose into
patterns** (routing, orchestration, the reference architecture), and patterns **ship as
products** — which, for the consulting goal, means helping a client pick the *smallest* set of
primitives that solves their problem. That "smallest set" choice now has its own pattern — the
**[four-altitude decision](../notes/claude-code-vs-build-your-own.md)** (buy → use Claude Code →
configure the Agent SDK → own the raw API loop) — and its own products-layer scenario,
[bootstrapping a company's AI stack](../notes/bootstrapping-company-ai-stack.md). Together they're
the [Building & advising on AI stacks](building-ai-stacks.md) map.

Read the layers as a debugging ladder too: *bad single answer* → Foundations (prompt). *Model
forgetting* → Foundations (context). *Can't recover / loop / self-check* → Foundations (harness)
**or** the right Claude Code primitive (a hook, a subagent, a workflow). The spine tells you
which floor to get off on.

## How this map evolves
The `/land` skill updates this file every time you add a concept: it assigns the note a
`spine_layer`, drops a link under the right heading here, and — when a new idea genuinely shifts
the story — rewrites the narrative. **Gaps are features:** every layer now has at least one note —
the remaining "what to learn next" list lives as the explicit backlog at the bottom of the
[Building & advising on AI stacks](building-ai-stacks.md) map (the framework landscape, eval, and
guardrails notes).
