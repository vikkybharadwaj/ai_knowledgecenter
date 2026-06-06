---
title: Six dynamic-workflow patterns and the three failure modes they fix
slug: dynamic-workflow-patterns
kind: concept
spine_layer: patterns
tags: [claude-code, workflows, orchestration, patterns, subagents, verification]
connections:
  - { to: dynamic-workflows-and-ultraplan, type: builds-on, why: "These are the named, reusable shapes you script on top of the raw agent()/parallel()/pipeline() primitives." }
  - { to: execution-context-isolation, type: used-with, why: "Every pattern works by fanning the main window into isolated subagent contexts — the unit this concept describes." }
  - { to: anatomy-of-an-agent-harness, type: builds-on, why: "Adversarial verification and loop-until-done are the harness's 'verification' and 'loop' organs, externalised across agents." }
  - { to: agentic-ai-reference-architecture, type: used-in, why: "These orchestration patterns are how the reference architecture's agent layer actually gets composed in Claude Code." }
source: { url: "https://movez.substack.com/p/master-dynamic-workflows-in-claude", author: "0xMovez AI", retrieved: 2026-06-05 }
date: 2026-06-05
depth: budding
claude_specific: true
---

# Six dynamic-workflow patterns and the three failure modes they fix

> Companion to [Dynamic Workflows & the Ultraplan loop](dynamic-workflows-and-ultraplan.md):
> that note explains the `agent()` / `parallel()` / `pipeline()` *primitives*; this one names
> the reusable *shapes* you build out of them, and the failure modes that justify the cost.

## TL;DR
A dynamic workflow is Claude writing a **JavaScript harness that spawns isolated subagents**.
You reach for one to beat three failure modes a single long context falls into, and you
structure it with one of **six recurring patterns**. The patterns are the vocabulary; the
failure modes are the *why*.

## The three failure modes (the "why fan out at all")
A single agent grinding through one growing context drifts in three predictable ways:
1. **Agentic laziness** — it declares done before the task actually is; coverage silently caps.
2. **Self-preferential bias** — asked to check its own work, it rates its own output highly.
3. **Goal drift** — across many turns it loses fidelity to the original objective.

Forking work into focused, isolated subagents attacks all three: each child has a *narrow*
objective (less room to be lazy), a **separate** verifier can't be biased toward an output it
didn't write, and a short single-purpose context can't drift far.

## The six patterns
1. **Classify-and-act** — first agent *routes* the work by type, downstream agents handle each
   class. (The orchestration version of prompt routing.)
2. **Fan-out-and-synthesize** — split a task across N agents working independently, then merge
   their results into one answer. The bread-and-butter `parallel()` shape.
3. **Adversarial verification** — a *separate* agent (or panel) is tasked to **refute** each
   finding. Directly kills self-preferential bias — the verifier has no stake in the claim.
4. **Generate-and-filter** — produce several candidate ideas/solutions, then filter/test down to
   the survivors. Breadth first, judgement second.
5. **Tournament** — pairwise-compare candidates bracket-style to surface the best. Use when "best
   of many" needs better than a single global score.
6. **Loop-until-done** — keep spawning workers until an explicit completion criterion is met
   (e.g. K consecutive rounds find nothing new). The antidote to laziness — *you* define "done,"
   not the model's mood.

## Practical levers the article calls out
- **Explicit token budgets** — scale fan-out depth/agent count to a stated budget instead of
  letting it run unbounded.
- **A hard-completion `/goal`** — bind the loop to a real done-condition so it can't quit early.
- **`/loop`** for recurring workflows; save a proven workflow as a reusable **Skill**.
- **Quarantine pattern** — run untrusted/external content through an isolated agent so a prompt
  injection can't reach the main context.

## Mental model / why it matters
Map each pattern to a failure mode and the catalog stops being a list to memorise:
*loop-until-done* ⟂ laziness, *adversarial verification* ⟂ self-preference, *classify-and-act* /
explicit budgets ⟂ drift. The deeper point from the sibling note still governs: **fan-out helps
*independent* work and fights *interdependent* work** — if the value is in the relationships
between items (a coherent graph), keep it in one head; if it's in the items, fan out.

## How to apply (in practice / consulting)
- **Audit / review engagements:** fan-out-and-synthesize finders → **adversarial verification**
  before anything is reported. Never let the finder grade its own findings to a client.
- **Vendor / design selection:** generate-and-filter, or a **tournament** when the field is wide
  and a single rubric score won't separate the top two.
- **Exhaustive sweeps ("find *all* the X"):** loop-until-done with a "K dry rounds" stop, and
  **log what was dropped** — silent caps read as "we covered everything" when you didn't.
- **Handling untrusted input:** default to the **quarantine** pattern; it's a cheap guardrail
  against injection in any client-facing automation.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **builds-on** → [Dynamic Workflows & the Ultraplan loop](dynamic-workflows-and-ultraplan.md) — the named shapes on top of the raw primitives.
- **used-with** → [One shared context vs. many isolated contexts](execution-context-isolation.md) — every pattern forks the main window into isolated subagents.
- **builds-on** → [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md) — verification and loop organs, externalised across agents.
- **used-in** → [Agentic AI Reference Architecture](agentic-ai-reference-architecture.md) — how the agent layer gets composed in practice.
