---
title: Plan mode
slug: plan-mode
kind: primitive
layer: claude-code
summary: A read-only phase where Claude Code explores and proposes an approach for your approval before touching anything. The guardrail that turns "it changed 40 files I didn't expect" into a reviewable plan first.
edges:
  - { to: claude-code, type: part-of, why: "Plan mode is a built-in Claude Code workflow state." }
sources: [dynamic-workflows-and-ultraplan, claude-code-architecture]
---
Use it for anything non-trivial: explore, get sign-off on the plan, then implement. It is the cheapest way to catch a wrong mental model before code is written.
