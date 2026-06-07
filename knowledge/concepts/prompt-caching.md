---
title: Prompt Caching
slug: prompt-caching
kind: primitive
layer: api
summary: Reusing the model's processed prefix across calls so repeated context (system prompt, tools, large files) isn't re-billed and re-processed each turn. The main lever for making long agent loops fast and cheap.
edges:
  - { to: messages-api, type: part-of, why: "Caching is a feature of the Messages API request." }
  - { to: context-window, type: depends-on, why: "It caches a stable prefix of the context window." }
sources: [claude-api-agent-primitives]
---
The 5-minute cache TTL is why long-running loops keep their prefix warm and why sleeping past it costs more. A lot of agent cost optimization is really cache-hit optimization.
