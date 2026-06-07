---
title: Claude Agent SDK
slug: agent-sdk
kind: system
layer: agent-sdk
summary: A library that wraps the raw API loop into a framework — sessions, tools, hooks, subagents, and permissions — so you can build your own harness on the same engine Claude Code runs on. The "build it yourself" tier.
edges:
  - { to: messages-api, type: runs-on, why: "The SDK drives the Messages API loop for you." }
  - { to: tool-use, type: uses, why: "It manages the tool-call round trip as a first-class concept." }
  - { to: mcp, type: uses, why: "It connects to MCP servers to extend the agent's toolset." }
sources: [claude-agent-sdk]
---
Reach for the SDK when Claude Code is too opinionated but the raw API is too bare. It gives you the harness organs as composable parts instead of a finished product.
