---
title: Harness engineering — reliability lives outside the model weights
slug: harness-engineering-discipline
kind: concept
spine_layer: foundations
tags: [harness, reliability, agent-architecture, evals]
connections:
  - { to: anatomy-of-an-agent-harness, type: builds-on, why: "Anatomy names the six organs; this note supplies the why and the five-subsystem audit that says which organ to invest in first." }
  - { to: prompt-context-harness-engineering, type: contrasts-with, why: "Reliability is won at the harness level, not the prompt level — the same model swings 20%→100% with the prompt untouched." }
  - { to: harness-vs-context-engineering, type: used-with, why: "Same three-level model; this adds the empirical 'controlled exclusion test' for proving which level a failure lives on." }
  - { to: claude-code-vs-build-your-own, type: used-with, why: "Deciding whether to buy/use/configure/own is really a decision about how much harness you must build yourself." }
source: { url: "https://walkinglabs.github.io/learn-harness-engineering/en/", author: "Walking Labs (Learn Harness Engineering)", retrieved: 2026-06-07 }
date: 2026-06-07
depth: budding
claude_specific: true
---

# Harness engineering — reliability lives outside the model weights

**TL;DR** — A capable model is necessary but not sufficient. Top coding agents post 50–60% on
benchmarks yet do *worse* on real tasks, because real tasks come with vague specs, missing context,
no verification, and no cross-session memory. The fix is almost never a bigger model — it's a better
**harness**: *everything in the engineering infrastructure outside the model weights*. Harness
engineering is the discipline of building that infrastructure so a fixed model actually realizes its
capability.

## The capability ≠ reliability gap
Anthropic's own controlled experiment is the cleanest proof: the *same* Opus 4.5 model failed to
build a game editor on its own, and succeeded once wrapped in a planner→generator→evaluator
three-agent architecture. The weights never changed; the environment did. So a failure is rarely a
"the model can't" problem — it's a **harness-induced failure**, and harness defects are fixable by you.

### The five failure modes (attribute every failure to one)
1. **Vague requirements** — implicit conventions were never written down, so the agent guesses.
2. **Incomplete environment** — context burned fixing deps instead of doing the task.
3. **No verification** — the agent declares done on syntax/unit-test signal ("context anxiety").
4. **Missing task definition** — no explicit, executable success criteria.
5. **Cross-session state loss** — every session restarts from zero.

The diagnostic mindset: pin each failure to one of these layers, fix *that* layer, and never fail
that way again.

## What a harness actually is — the five subsystems
A harness is not a prompt file. It's five subsystems, each closing one failure mode:

| Subsystem | Concretely | Closes |
|---|---|---|
| **Instructions** | `CLAUDE.md`/`AGENTS.md` (~100 lines): overview, run commands, hard constraints, doc links | vague requirements |
| **Tools** | enough shell/package access, least-privilege not security-first | overreach on setup |
| **Environment** | self-describing runtime — lockfiles, `.nvmrc`, reproducible containers | incomplete setup |
| **State** | progress files read at session start, updated at session end | cross-session loss |
| **Feedback** | the verification commands (test/lint/typecheck/build) listed explicitly | premature "done" |

**"The repo IS the spec."** Everything the agent needs must live in the repository as structured
files — see [[repository-as-system-of-record]].

## Mental model / why it matters
The headline number isn't a model benchmark — it's the **controlled-exclusion curve**. A real team
drove the *same* model from **20% → 60% → 80% → 80–100%** task success purely by adding harness
subsystems one at a time. That gives you both a method and a budgeting tool: remove a subsystem,
measure the drop, and you've quantified its ROI. Empirically the **Feedback** subsystem (just listing
the verify commands) is the highest ROI for the lowest spend. This reframes "make the agent better"
from *prompt-whispering* into *infrastructure engineering* — the part you can actually version,
test, and improve.

## How to apply (in practice / consulting)
- **Lead with the curve, not the model.** When a client blames the model, run a controlled-exclusion
  test: add `CLAUDE.md`, then verify-commands, then a `PROGRESS.md`, and chart the success rate. It
  reframes the spend from "wait for GPT-N+1" to "build the harness you already can."
- **Audit by subsystem.** Score a codebase on all five (Instructions/Tools/Environment/State/Feedback);
  the empty column is the next sprint. Cheapest win is usually Feedback.
- **Treat the harness as the deliverable.** In an engagement, the durable asset you hand over isn't a
  clever prompt — it's the five-subsystem scaffold that makes *their* future agents reliable.

## Connections
- **Builds on [[anatomy-of-an-agent-harness]]** — that note dissects the harness into six organs
  (loop, context, tools, memory, verification, delegation); this one gives the *why* and a
  five-subsystem audit for deciding which organ to fund first.
- **Contrasts with [[prompt-context-harness-engineering]]** — the whole thesis is that reliability is
  a *harness*-level property, not a prompt-level one; the 20%→100% swing happens with the prompt fixed.
- **Used with [[harness-vs-context-engineering]]** — same nested model; this adds the empirical
  controlled-exclusion test for locating which level a bug lives on.
- **Used with [[claude-code-vs-build-your-own]]** — the buy→use→configure→own ladder is really a
  choice of how much harness you assemble yourself vs. inherit.
- Anchors a cluster: [[repository-as-system-of-record]] (State+Instructions made concrete),
  [[progressive-disclosure-instructions]] (the Instructions subsystem), and
  [[completion-is-externalized]] (the Feedback subsystem).
