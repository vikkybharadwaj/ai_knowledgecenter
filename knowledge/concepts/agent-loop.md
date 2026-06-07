---
title: Gather → Act → Verify loop
slug: agent-loop
kind: concept
layer: foundations
summary: The single loop every agent runs — gather context, take an action (often a tool call), verify the result, repeat until done. Every layer above is just this loop wrapped at a higher level of abstraction.
edges:
  - { to: context-window, type: depends-on, why: "Each turn reads from and writes back into the context window." }
sources: [anatomy-of-an-agent-harness, agentic-ai-reference-architecture]
---
This is the physics of the whole stack. Whether it's a raw API call, the SDK, or Claude Code orchestrating subagents, the same gather→act→verify cycle is running — only the wrapper changes. Learn to see it everywhere and the stack stops looking like 40 unrelated features.
