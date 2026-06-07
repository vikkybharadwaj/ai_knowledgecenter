---
title: Context Engineering
slug: context-engineering
kind: concept
layer: foundations
summary: Curating what the model can see at the moment it acts — the right files, tool results, memory, and retrieved facts, and nothing that wastes the window. The second lever, and where most accuracy problems actually live.
edges:
  - { to: three-levels-of-engineering, type: part-of, why: "The second of the three levers." }
  - { to: context-window, type: depends-on, why: "It is the discipline of spending the context window well." }
sources: [harness-vs-context-engineering, prompt-context-harness-engineering]
---
CLAUDE.md structure, retrieval, and the repository-as-record pattern are all context engineering in practice. If the model is confidently wrong, suspect the context before the prompt.
