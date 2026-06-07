---
title: MCP servers (Claude Code)
slug: cc-mcp-servers
kind: primitive
layer: claude-code
summary: External tool/data integrations connected to Claude Code over MCP — GitHub, databases, design tools, internal APIs. How you give the harness capabilities Anthropic didn't ship.
edges:
  - { to: claude-code, type: part-of, why: "MCP servers plug into Claude Code's tool surface." }
  - { to: mcp, type: uses, why: "They speak the Model Context Protocol to expose tools to the model." }
sources: [model-context-protocol, claude-code-architecture]
---
When the agent can't do something, the answer is usually "connect an MCP server," not "write a custom tool from scratch." Integrations written once travel across the whole stack.
