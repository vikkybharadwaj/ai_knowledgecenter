---
title: Dynamic Workflows & the "Ultraplan" loop
slug: dynamic-workflows-and-ultraplan
kind: concept
spine_layer: claude-code
tags: [claude-code, workflows, subagents, orchestration, planning, meta]
connections:
  - { to: claude-code-architecture, type: part-of, why: "Dynamic workflows are one of the orchestration primitives in the field guide." }
  - { to: claude-code-multi-agent-development, type: used-with, why: "A workflow scripts fan-out over subagents / parallel agents — the deterministic cousin of agent teams." }
  - { to: harness-vs-context-engineering, type: builds-on, why: "A workflow is a scripted harness wrapping many sub-harnesses; each agent runs its own gather→act→verify loop." }
source: { url: "https://claude.com/blog/introducing-dynamic-workflows-in-claude-code", author: "distilled in-house from the AI Knowledge Center revamp session", retrieved: 2026-06-04 }
date: 2026-06-04
depth: evergreen
claude_specific: true
---

# Dynamic Workflows & the "Ultraplan" loop

> **Why this note exists.** It captures the exact technique used to *build* this knowledge
> center, so the method itself becomes reusable reference material — dog-fooding the
> dot-connecting model.

> ⚠️ **Naming note (2026-06-07).** "Ultraplan" here is *my own term* for the research→synthesis→plan-gate→execute
> meta-loop — coined before Claude Code shipped features with overlapping names. In the official docs these are now
> two distinct things: **dynamic workflows** are triggered by the keyword **`ultracode`** (not "ultraplan"), and
> **ultraplan** is a *separate cloud* feature that hands a planning task to a Claude Code-on-the-web session in plan
> mode. The concept graph uses the docs' meaning; this note keeps my original loop terminology.

## TL;DR
A **dynamic workflow** is a deterministic JavaScript script that fans work out across many
subagents and collects their results — you use it when a task splits into independent
sub-questions you want answered *concurrently* and *verifiably*. **"Ultraplan"** is the larger
loop that wraps a workflow in disciplined planning: **fan-out research → transparent synthesis →
plan-mode gate → execute**. The workflow gives you breadth and parallelism; the plan gate makes
sure you think before you touch.

## The mental model
A single agent in one context is a straight line: it reasons, acts, verifies, repeats — all
sequentially, all competing for one finite context window. A workflow turns that line into a
**tree**: the orchestrator spawns N child agents, each with its *own* fresh context, and merges
what comes back. So a workflow is best understood as a **scripted harness over many
sub-harnesses** — which is why it [builds-on](harness-vs-context-engineering.md) the
gather→act→verify loop: every child runs that loop independently.

## `parallel()` vs `pipeline()` — the core decision
- **`parallel()` is a barrier:** launch all thunks, *wait for every one*, then continue. Use it
  when you need **all** results together before the next step (e.g. synthesize one design from four
  independent research streams — you can't synthesize until all four land).
- **`pipeline()` has no barrier:** each item flows through all stages independently; item A can be
  in stage 3 while item B is still in stage 1. Use it when each item's stages are independent of
  the other items. Wall-clock = slowest single chain, not sum-of-slowest-per-stage.
- **Default to `pipeline()`.** Reach for `parallel()` only when a stage genuinely needs cross-item
  context (dedup across all findings, early-exit on zero, "compare against the others").

## Structured returns beat prose
Give each agent a **JSON schema** so it returns validated data, not text you have to parse. The
orchestrator then reasons over clean objects. Validation happens at the tool layer, so the agent
retries until the shape is right.

## When an extra agent *won't* change the answer (just as important)
Fan-out shines for **independent** work. It *fights you* for **interdependent** work. Example from
this very build: wiring typed connections across six notes is a *graph* problem — the edges must be
globally coherent. Blind parallel agents would each propose links in isolation, then you'd burn
effort reconciling contradictions. One reasoner holding the whole picture wins. **Knowing when not
to fan out is part of the skill.** A good heuristic: *is the value in the items, or in the
relationships between them?* Items → fan out. Relationships → keep it in one head.

## The Ultraplan loop (what produced this repo)
1. **Recon** — read the actual material first; ground the plan in reality, not assumptions.
2. **Fan-out research** — a `parallel()` workflow of focused researchers (here: self-organizing PKM,
   ingestion mechanics, Claude Code skills/hooks, exam scope), each returning a structured schema.
3. **Transparent synthesis** — *you* (the orchestrator) merge the findings in the open, so the human
   sees the reasoning and the research actually changes the design.
4. **Plan-mode gate** — write the plan, get explicit approval before any edit. Think before touch.
5. **Execute** — and narrate the non-obvious technique choices so they become learnable.

## How to apply (in practice / consulting)
- **Audits & research** ("review this codebase", "compare these 5 vendors"): `parallel()` finders →
  adversarial verify → synthesis. Independent angles, merged once.
- **Migrations & sweeps** ("apply this change across 40 files"): `pipeline()`, one item per chain,
  `isolation: 'worktree'` if agents mutate files concurrently.
- **Client-facing decisions:** always wrap fan-out in the plan gate — clients approve the plan, not
  the diff. Show the synthesis so the recommendation is legible, not a black box.
- **Cost discipline:** a workflow can spawn dozens of agents. Scope it to what the task needs, and
  skip agents that won't change the answer.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **part-of** → [Claude Code Architecture](claude-code-architecture.md) — one of the orchestration primitives.
- **used-with** → [Claude Code — Multi-Agent Development](claude-code-multi-agent-development.md) — the deterministic cousin of agent teams / parallel subagents.
- **builds-on** → [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md) — a workflow is a scripted harness over many sub-harnesses.
