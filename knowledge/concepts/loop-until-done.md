---
title: Loop-until-done
slug: loop-until-done
kind: pattern
layer: patterns
summary: Keep working until an external condition is met — tests pass, K rounds find nothing new, a count is reached — instead of stopping when the model feels finished. The pattern that catches the long tail simple counters miss.
edges:
  - { to: workflow-patterns, type: part-of, why: "It's one of the core dynamic-workflow patterns." }
  - { to: externalized-completion, type: depends-on, why: "The loop's exit condition lives outside the model." }
sources: [dynamic-workflow-patterns, completion-is-externalized]
---
For unknown-size discovery (bugs, edge cases), loop until consecutive rounds come up empty. The exit gate must be a real signal — a passing test, a dry round — not the agent's say-so.
