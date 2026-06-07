---
title: Adversarial verification
slug: adversarial-verification
kind: pattern
layer: patterns
summary: Spawning independent skeptics whose job is to refute a finding, and keeping it only if it survives. The pattern that stops plausible-but-wrong results from passing as true.
edges:
  - { to: workflow-patterns, type: part-of, why: "It's one of the core dynamic-workflow patterns." }
  - { to: externalized-completion, type: depends-on, why: "Verification is how 'done' gets decided by something other than the agent itself." }
sources: [dynamic-workflow-patterns, completion-is-externalized]
---
A single agent grading its own work is unreliable. Give the check to fresh agents prompted to break the claim, and require a majority to fail it before you trust it.
