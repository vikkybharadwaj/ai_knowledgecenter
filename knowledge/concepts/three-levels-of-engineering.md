---
title: Three levels — prompt · context · harness
slug: three-levels-of-engineering
kind: concept
layer: foundations
summary: The mental model that splits agent work into three levers — the prompt (what you say), the context (what the model can see), and the harness (the code around the model). Knowing which lever a problem lives on tells you where to fix it.
edges:
  - { to: agent-loop, type: depends-on, why: "All three levers tune the same gather→act→verify loop." }
sources: [prompt-context-harness-engineering, harness-vs-context-engineering]
---
This is the debugging ladder for the entire stack: a flaky output is usually a prompt problem, a wrong-facts problem is usually context, and a reliability problem is almost always the harness. Most teams over-invest in prompts and under-invest in the harness.
