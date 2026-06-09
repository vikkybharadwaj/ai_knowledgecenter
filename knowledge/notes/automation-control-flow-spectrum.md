---
title: "Keeping Claude working — the two axes behind /loop, /goal, hooks, routines & cron"
slug: automation-control-flow-spectrum
kind: concept
spine_layer: claude-code
tags: [automation, scheduling, loops, goal, hooks, routines, cron, claude-code]
connections:
  - { to: claude-code-routines, type: contrasts-with, why: "Routines are the cloud/unattended corner of the grid; /loop and /goal are the in-session corner — same 'repeat' idea, opposite infrastructure." }
  - { to: completion-is-externalized, type: builds-on, why: "/goal is condition-driven because a separate evaluator decides 'done' — externalized completion is what makes the condition axis trustworthy." }
  - { to: designing-loops-not-prompts, type: used-with, why: "These primitives are the scheduling/heartbeat block of loop engineering — the spectrum says which one to reach for." }
  - { to: loop-is-cron-plus-a-decision-maker, type: used-with, why: "That note defines what a loop IS; this one tells the concrete Claude Code primitives apart." }
source: { url: "https://code.claude.com/docs/en/scheduled-tasks", author: "code.claude.com/docs (/goal, /scheduled-tasks, /routines, /hooks), distilled in-house", retrieved: 2026-06-09 }
date: 2026-06-09
depth: budding
claude_specific: true
---

# Keeping Claude working — the two axes behind /loop, /goal, hooks, routines & cron

> **TL;DR.** `/loop`, `/goal`, hooks, routines, cron all "make Claude keep working," which is why they blur
> together. They stop blurring once you place each on **two axes**: (1) **WHERE it runs** — inside an *open
> session* you're driving, or *independently* of any session; and (2) **WHAT starts the next unit of work** —
> a **clock** (an interval elapses), a **condition** (a check passes), or an **event** (something happens).
> Every primitive is one cell in that grid, and the cell tells you when to reach for it.

## The grid

| | **Clock** (interval) | **Condition** (a check passes) | **Event** (something happens) |
|---|---|---|---|
| **In an open session** | **`/loop`** — re-run a prompt every N min | **`/goal`** — keep going until a small model confirms done; custom **Stop hook** | **Hooks** (PreToolUse, Stop, …); **Channels** (CI pushes a failure in) |
| **Independent of session** | **Cloud routines** (schedule); **Desktop scheduled tasks**; **OS cron**; GitHub Actions `schedule` | — | **Cloud routines** (GitHub event / API `/fire`) |

Two official framings sit inside this grid. **Three ways to keep one session running:** `/loop` (next turn
when an interval elapses), `/goal` (next turn when the previous one finishes, stop when a condition holds),
and a **Stop hook** (next turn after each turn, your script/prompt decides). **Three ways to schedule work
independent of a session:** **cloud routines** (Anthropic infra), **desktop scheduled tasks** (your machine),
and `/loop` (local, session open).

## The primitives, one line each
- **`/loop`** — a bundled skill that re-runs a prompt on an interval. You give an interval + prompt (fixed
  cron), a prompt only (Claude picks a 1-min-to-1-hour delay each iteration), or nothing (a built-in
  maintenance prompt, or your `loop.md`). It converts the interval to a cron expression via the
  **`CronCreate`/`CronList`/`CronDelete`** tools. **Session-scoped, local, 7-day expiry**, needs the session
  open. See [scheduled tasks](scheduled-tasks.md).
- **`/goal`** — set a completion condition; after each turn a **small fast model (Haiku by default)** checks
  whether it holds and, if not, runs another turn. It's a **wrapper around a session-scoped prompt-based Stop
  hook**. Condition-driven, not clock-driven. See [goal mode](goal-mode.md).
- **Hooks** — user-defined handlers (shell / HTTP / prompt) the harness fires **deterministically** at
  lifecycle events (`PreToolUse`, `Stop`, `SessionStart`, …). Event-driven, and the model *can't skip them*.
  See [hooks](cc-hooks.md).
- **Routines** — a saved config (prompt + repos + connectors) that runs **unattended on Anthropic's cloud**
  on a schedule, a GitHub event, or an API call. Persistent, laptop closed. See [routines](routines.md).
- **OS cron** — your operating system's scheduler firing a **fixed shell script** on a timer. No model, no
  decision in the body — the thing `/loop` is *named after* but is not.

## Why X, not Y (the questions this answers)
- **Why `/goal` when `/loop` exists?** Different trigger for the next turn. `/loop` is **clock-driven**
  ("check the deploy every 5 minutes"); `/goal` is **condition-driven** ("keep working until the auth tests
  pass and lint is clean"). Use `/loop` to *poll*; use `/goal` to *finish a task with a verifiable end state.*
- **Loops vs cron jobs?** `/loop` *uses* cron syntax (`CronCreate`) and so *feels* like cron — but **OS cron
  runs a fixed script**, while `/loop` runs a **model that decides** what to do each tick (see
  [a loop is cron plus a decision-maker](loop-is-cron-plus-a-decision-maker.md)). Also `/loop` fires *between
  turns of an open session* and **expires in 7 days**; OS cron runs system-wide forever.
- **Loops vs routines?** Same "repeat" idea, **different infrastructure.** `/loop` is **local and needs the
  session open**; a **routine runs in Anthropic's cloud, unattended, persistent** — and a routine run has **no
  permission prompts**, so scope its repos/connectors first.
- **Where does Boris's "close your laptop" tip land?** That's the move from the top row (in-session `/loop`,
  `/goal`) to the bottom row (cloud routines) of the grid.

## How to apply (in practice / consulting)
- **Diagnose with the two questions.** "Does it need my session open?" and "what should start the next run — a
  clock, a condition, or an event?" Those two answers pick the primitive every time.
- **Don't reach for a routine to poll a build** — that's a `/loop`. Don't reach for `/loop` for a nightly job
  that must run with your laptop shut — that's a routine. Don't use a clock at all when you mean "until done" —
  that's `/goal`.
- **Guardrails are non-negotiable on the condition/clock axes.** A `/goal` or fixed `/loop` can run a long
  time; cap iterations, detect no-progress, set a budget (see the economics in
  [loop is cron plus a decision-maker](loop-is-cron-plus-a-decision-maker.md)).

## Provenance
Distilled from official docs (`code.claude.com/docs/en/{scheduled-tasks,goal,routines,hooks}`), retrieved
2026-06-09, and cross-checked against the loops discourse the [Matt Van Horn article](loop-is-cron-plus-a-decision-maker.md)
synthesizes. `/goal` requires Claude Code v2.1.139+; scheduled tasks require v2.1.72+.

## Connections
- **contrasts-with [Claude Code Routines](claude-code-routines.md)** — cloud/unattended vs in-session local: the two opposite corners of the grid.
- **builds-on [Never let the agent declare its own victory](completion-is-externalized.md)** — `/goal`'s condition axis only works because a separate evaluator owns "done."
- **used-with [Loop engineering](designing-loops-not-prompts.md)** — these are the scheduling/heartbeat block of a loop; the spectrum says which to pick.
- **used-with [A loop is cron plus a decision-maker](loop-is-cron-plus-a-decision-maker.md)** — that note defines what a loop is; this one separates the concrete primitives.
