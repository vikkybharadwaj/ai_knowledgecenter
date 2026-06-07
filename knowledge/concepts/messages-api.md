---
title: Messages API
slug: messages-api
kind: primitive
layer: api
summary: The Claude API endpoint that runs one turn of the loop — you send messages and tool definitions, the model replies with text or tool calls. The engine every harness above is ultimately calling.
edges:
  - { to: model-tiers, type: depends-on, why: "Each request names a model tier (Opus / Sonnet / Haiku) to run on." }
  - { to: context-window, type: depends-on, why: "The request is exactly what fills the model's context window." }
sources: [claude-api-agent-primitives]
---
Everything from the SDK up is a more ergonomic way to call this endpoint in a loop. Knowing its request/response shape demystifies what "an agent" actually is.
