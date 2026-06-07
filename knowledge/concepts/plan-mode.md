---
title: Plan mode
slug: plan-mode
kind: primitive
layer: claude-code
summary: A read-only phase where Claude Code explores and proposes an approach for your approval before touching anything. The guardrail that turns "it changed 40 files I didn't expect" into a reviewable plan first.
edges:
  - { to: permission-modes, type: part-of, why: "Plan mode is one of Claude Code's permission modes — read-and-propose with no edits." }
sources: [dynamic-workflows-and-ultraplan, claude-code-architecture]
---
Use it for anything non-trivial: explore, get sign-off on the plan, then implement. It is the cheapest way to catch a wrong mental model before code is written.
