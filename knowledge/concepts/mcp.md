---
title: Model Context Protocol (MCP)
slug: mcp
kind: primitive
layer: api
summary: An open protocol for exposing tools and data to a model through a standard server interface, so any client can plug into any tool without bespoke glue. The USB-C port of the agent world.
edges:
  - { to: tool-use, type: used-with, why: "MCP is its own open standard; in the Claude API its servers surface to the model as tool-use calls." }
  - { to: messages-api, type: used-with, why: "Provider-neutral — it integrates with the Messages API via the MCP connector, but doesn't depend on it." }
sources: [model-context-protocol, claude-api-agent-primitives]
---
MCP is why an integration written once (GitHub, Slack, a database) works across Claude Code, the SDK, and the API. Learn the server/connector split and most "how do I give the agent X" questions answer themselves.
