---
title: Goal mode (/goal)
slug: goal-mode
kind: primitive
layer: claude-code
summary: In-session, condition-driven repetition. /goal sets a completion condition and keeps working across turns until it holds; after each turn a small fast model (Haiku by default) checks the condition and, if not met, starts another turn. The productized "ralph loop" — and a thin wrapper around a session-scoped prompt-based Stop hook.
edges:
  - { to: claude-code, type: part-of, why: "/goal is a Claude Code session command." }
  - { to: cc-hooks, type: depends-on, why: "It is literally a wrapper around a prompt-based Stop hook — it requires workspace trust and is disabled when hooks are off." }
  - { to: externalized-completion, type: uses, why: "A separate evaluator model decides 'done', not the agent doing the work — externalized completion baked into the product." }
  - { to: scheduled-tasks, type: alternative-to, why: "Both keep one session running; /goal advances when a condition holds, /loop when a clock elapses." }
sources: [automation-control-flow-spectrum, completion-is-externalized]
---
Reach for /goal for substantial work with a verifiable end state — "migrate every call site until tests pass," "split this file until each module is under budget." Write the condition as something Claude's own output can demonstrate (the evaluator reads the transcript; it doesn't run tools). Bound it with a turn/time clause and a budget, since like any loop it can run a long time.
