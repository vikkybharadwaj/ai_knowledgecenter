---
title: The agent must never declare its own victory — externalize "done" into the harness
slug: completion-is-externalized
kind: concept
spine_layer: patterns
tags: [verification, e2e-testing, observability, feature-list, scope-control]
connections:
  - { to: harness-engineering-discipline, type: part-of, why: "This is the Feedback subsystem made rigorous — the harness, not the agent, owns the completion signal." }
  - { to: dynamic-workflow-patterns, type: builds-on, why: "Separating worker from checker is adversarial verification and generate-and-filter applied to the 'done' decision." }
  - { to: anatomy-of-an-agent-harness, type: used-with, why: "Operationalizes the verification organ — three layers, E2E, and runtime observability feeding the loop." }
  - { to: repository-as-system-of-record, type: used-with, why: "The feature-list state machine and its passing/blocked states are durable repo files the next session trusts." }
source: { url: "https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-09-why-agents-declare-victory-too-early/", author: "Walking Labs (Learn Harness Engineering)", retrieved: 2026-06-07 }
date: 2026-06-07
depth: budding
claude_specific: true
---

# The agent must never declare its own victory — externalize "done" into the harness

**TL;DR** — Agents are *systematically overconfident*: they judge completion locally (clean syntax,
green unit tests) while correctness is global. Asked to grade their own work, they grade generously.
So the single most important harness rule is: **completion judgment is not made by the agent itself.**
The harness owns "done" — through a feature-list state machine, layered/end-to-end verification, hard
scope limits, and runtime observability that turns vague failure into specific feedback.

## Why agents quit too early
- **Confidence-calibration bias** — self-assessed completion exceeds actual accuracy.
- **Unit tests enable the trap** — they isolate and mock, masking interface mismatches, state-
  propagation errors, resource leaks, and environment-dependent failures.
- **Self-evaluation bias** — a model grading itself is lenient. (Anthropic: a bare agent's game editor
  failed functionally; the same model with separate planner/generator/evaluator roles succeeded.)

## Four harness mechanisms that take "done" out of the agent's hands
1. **Feature lists as primitives, not docs.** Each feature = **Behavior + Verification + State**,
   running a four-state machine `not_started → active → blocked | passing`, where *only a passing
   verification command* triggers `passing`. The scheduler, verifier, handoff reporter, and progress
   tracker all read it — "un-bypassable, like a DB constraint vs. an app-layer check." Framing:
   *unresolved features are pressure; zero pressure = project complete.*
2. **Three-layer verification.** Syntax/static → runtime behavior (tests, startup, critical paths) →
   system-level (E2E/integration). Each must pass *in order*; no refactoring until core function
   verifies (stops boundary-shifting).
3. **End-to-end > unit.** Only E2E exercises real boundaries — the Electron renderer/preload/service
   each pass units yet five defects appear only end-to-end. Knowing work faces integration validation
   *changes how the agent codes*: from isolated functions to "how does this connect upstream?"
4. **Observability inside the harness.** The *harness* (not agent self-logging) collects runtime
   signals — agents don't know what signals they'll need, and ad-hoc logs aren't analyzable. Two
   layers: **runtime** (logs/traces/health = "what did the system do") and **process** (plans, sprint
   contracts, evaluator rubrics = "why should this change be accepted"). A rubric line like *"contrast
   2.1:1 vs required 4.5:1"* converts blind retries into actionable fixes — one case cut a task from
   45→15 min at identical model capability.

Plus a scope guard: **WIP = 1.** Agents overreach (expand scope) and under-finish; attention splits
C/k across k tasks until nothing completes, and lines-of-code is *weakly negatively* correlated with
completion. Allow one active task, define completion as executable evidence ("`curl` returns 201"),
and block new activations while verified-completion < 1.0. *"Do less but finish" beats "do more,
half-done"* (+37% completion).

## Mental model / why it matters
The unifying move is **separating the worker from the checker** and giving the checker the only key to
the "done" door. The agent generates; an independent gate — a verification command, an E2E run, an
evaluator rubric, a state machine — decides. "Code review shows what was *written*; runtime tracing
shows what actually *ran* — you need both." This is also why "convert written rules into running
checks": a constraint in prose is a suggestion, a constraint as a lint rule or CI gate is a law. (This
vault's own `validate-note.sh` hook is the pattern in miniature — it *blocks* a malformed note rather
than trusting the author to comply.)

## How to apply (in practice / consulting)
- **Install a done-gate.** The first reliability fix in any engagement: define completion as an
  executable command per task and forbid self-declared completion — make a passing command the only
  transition to `passing`.
- **Promote E2E for cross-component changes** and turn recurring review comments into automated checks;
  it shifts the agent's coding style toward integration-awareness for free.
- **Bake observability into the harness, not the prompt.** Standard traces (OpenTelemetry, session →
  task → verify spans) + evaluator rubrics give the agent specific, self-correcting feedback instead
  of "might be a timing issue."

## Connections
- **Part of [[harness-engineering-discipline]]** — the Feedback subsystem made rigorous; the harness,
  not the model, holds the completion signal.
- **Builds on [[dynamic-workflow-patterns]]** — worker-vs-checker separation is adversarial
  verification and generate-and-filter applied to the "done" decision; planner/generator/evaluator is
  the orchestrator shape.
- **Used with [[anatomy-of-an-agent-harness]]** — operationalizes the verification organ (three
  layers, E2E, runtime + process observability feeding the loop).
- **Used with [[repository-as-system-of-record]]** — the feature-list state machine and its
  `passing`/`blocked` states are durable repo files the next session trusts as ground truth.
