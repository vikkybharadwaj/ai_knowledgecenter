---
title: Model Context Protocol (MCP)
slug: mcp
kind: primitive
layer: api
summary: An open protocol for exposing tools and data to a model through a standard server interface, so any client can plug into any tool without bespoke glue. The USB-C port of the agent world.
edges:
  - { to: tool-use, type: uses, why: "MCP servers surface their capabilities to the model as tools." }
  - { to: messages-api, type: depends-on, why: "The API can connect to MCP servers to extend a single request's toolset." }
sources: [model-context-protocol, claude-api-agent-primitives]
---
MCP is why an integration written once (GitHub, Slack, a database) works across Claude Code, the SDK, and the API. Learn the server/connector split and most "how do I give the agent X" questions answer themselves.
