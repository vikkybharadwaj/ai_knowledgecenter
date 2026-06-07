---
title: Externalized completion
slug: externalized-completion
kind: pattern
layer: patterns
summary: Never let the agent declare its own victory — push the definition of "done" into the harness as a test, a check, or a gate. The single most reliability-defining move in agent design.
edges:
  - { to: harness-engineering, type: depends-on, why: "Completion lives in the deterministic harness, not the weights." }
sources: [completion-is-externalized]
---
An agent that decides it's finished will declare success on incomplete work. Make "done" something the world confirms — a green test, a satisfied condition — and the whole system gets trustworthy.
