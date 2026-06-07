---
title: Evals & Reliability
slug: evals-reliability
kind: concept
layer: foundations
summary: Measuring whether the agent actually works — failure-mode analysis, fixtures, and graded runs — so improvements are real and regressions are caught. Reliability is engineered and measured, not hoped for.
edges:
  - { to: harness-engineering, type: depends-on, why: "You harden the harness against the failure modes evals expose." }
sources: [harness-engineering-discipline]
---
Without evals you are tuning prompts in the dark. They turn "it feels better" into a number, and they tell the harness which failure modes are worth a deterministic guard.
