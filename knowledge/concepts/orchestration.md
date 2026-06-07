---
title: Multi-agent orchestration
slug: orchestration
kind: pattern
layer: patterns
summary: Coordinating many agents toward one outcome — fan-out for coverage, independent perspectives for confidence, and scale beyond a single context. Composing subagents into a reliable whole.
edges:
  - { to: cc-subagents, type: uses, why: "Orchestration is built out of subagent delegation." }
  - { to: execution-isolation, type: uses, why: "It relies on isolating each agent's context to parallelize safely." }
sources: [claude-code-multi-agent-development, dynamic-workflow-patterns]
---
The art is deciding what fans out, what verifies, and what synthesizes. More agents only help if the orchestration structure turns their output into a better answer, not just more noise.
