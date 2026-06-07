---
title: Tool Use
slug: tool-use
kind: primitive
layer: api
summary: The mechanism that lets the model call functions you define — it emits a structured tool call, your code runs it, you feed the result back. This is the "act" step of the loop made concrete.
edges:
  - { to: messages-api, type: runs-on, why: "Tool calls ride the Messages API request/response cycle." }
sources: [claude-api-agent-primitives, claude-code-architecture]
---
Every capability an agent has — reading files, running code, searching — is a tool. Master this one primitive and most of the stack is just bigger and bigger libraries of tools.
