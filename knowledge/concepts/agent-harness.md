---
title: Agent Harness (the six organs)
slug: agent-harness
kind: concept
layer: foundations
summary: The anatomy of any working agent — the model, tools, a control loop, memory, a verifier, and a way to declare done. Name the six organs and you can dissect Claude Code, the SDK, or any framework the same way.
edges:
  - { to: agent-loop, type: runs-on, why: "The harness is the machinery that drives the gather→act→verify loop." }
  - { to: context-window, type: depends-on, why: "Memory and tool results all flow through the window." }
sources: [anatomy-of-an-agent-harness, harness-engineering-discipline]
---
Every higher layer is a specific, opinionated harness. Claude Code is a harness; the Agent SDK lets you build one; the API gives you the organs as raw callables.
