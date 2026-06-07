---
title: Agentic AI reference architecture
slug: reference-architecture
kind: pattern
layer: patterns
summary: The production-system view of an agent — how routing, orchestration, memory, and verification fit together into something you'd actually ship. The blueprint that turns primitives into a system.
edges:
  - { to: orchestration, type: uses, why: "Orchestration is the reference architecture's execution core." }
  - { to: repo-as-record, type: uses, why: "The repository is its durable memory and system of record." }
sources: [agentic-ai-reference-architecture]
---
This is the same gather→act→verify loop zoomed out to a whole product. Use it as the checklist for what a real deployment needs beyond a clever prompt.
