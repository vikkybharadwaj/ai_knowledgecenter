---
title: The Claude API agent primitives — the engine the harness runs on
slug: claude-api-agent-primitives
kind: concept
spine_layer: api
tags: [claude-api, tool-use, mcp, prompt-caching, batch, agents, foundations]
connections:
  - { to: claude-agent-sdk, type: enables, why: "The SDK automates the raw tool-use loop these primitives expose — same engine, less boilerplate." }
  - { to: model-context-protocol, type: used-with, why: "The Messages API MCP connector lets a raw API call reach external MCP tools without any framework." }
  - { to: anatomy-of-an-agent-harness, type: used-with, why: "These primitives are the API-level implementation of the harness's tools / orchestration-loop organs." }
source: { url: "https://www.anthropic.com/engineering/building-effective-agents", author: "Anthropic — Building Effective Agents; Messages API + MCP docs", retrieved: 2026-06-05 }
date: 2026-06-05
depth: budding
claude_specific: true
---

# The Claude API agent primitives — the engine the harness runs on

## TL;DR
Below every harness is the **raw Claude API**: the Messages API plus a handful of capabilities you
can call with no framework at all. The agent "loop" is literally **`while response.stop_reason ===
"tool_use": run the tool, feed the result back`**. Anthropic's own guidance: *start here* — "many
patterns can be implemented in a few lines of code." Everything above this layer (Agent SDK, Claude
Code) is convenience wrapped around these primitives.

## The primitives
- **Tool use (function calling).** You declare tools as JSON schemas in the request. The model
  replies with `stop_reason: "tool_use"` and a structured tool call; *you* execute it and append the
  result as a `tool_result` message, then call again. That hand-rolled loop **is** an agent. This is
  the single most important primitive — it's the seam where the model reaches the world.
- **MCP connector.** The Messages API can connect to **remote MCP servers** directly, so a bare API
  call gets tools without you writing per-tool schemas — see [[model-context-protocol]]. (Anthropic's
  `build-with-claude/mcp` page now redirects to modelcontextprotocol.io.)
- **Prompt caching.** Mark stable prefixes (system prompt, tool defs, long context) as cacheable to
  cut cost/latency on repeated calls — essential once an agent loops many turns over the same context.
- **Batch API.** Submit large async jobs (classification, extraction, evals) at lower cost when you
  don't need an interactive turn.
- **Computer use.** A built-in `computer` tool for screen control (screenshots + mouse/keyboard) —
  the primitive behind "the agent drives a GUI."
- **Extended thinking, 1M context, citations, files** — request-level capabilities the loop can opt
  into. Datestamp these; they move (see [[claude-agent-sdk]] for the SDK that surfaces them).

## Mental model / why it matters
This is the **engine layer** of the [[big-picture]] spine — the floor with the fewest abstractions
and the most control. The takeaway that dissolves a lot of "which framework?" anxiety: **an agent is
not a product you buy, it's a loop you can write in ~20 lines.** A framework is worth adopting only
when it earns its abstraction back; if you can't see your own prompts and tool results, you can't
debug the agent. Owning the loop at this layer is the *baseline* against which every higher layer
(SDK, Claude Code, LangGraph, …) should justify itself.

## How to apply (in practice / consulting)
- **Prototype on the raw API first** to learn a client's problem shape before committing to any
  framework — cheap, transparent, throwaway.
- **Reach for prompt caching early** on any looping agent; it's the biggest single cost lever and is
  invisible at the framework layer if you don't know it exists.
- **Use "can I express this as a few-line tool-use loop?" as a litmus test**: if yes, a heavyweight
  agent framework is probably premature — see [[claude-code-vs-build-your-own]].

## Connections
- **enables** → [Claude Agent SDK](claude-agent-sdk.md) — the SDK automates this exact loop.
- **used-with** → [Model Context Protocol](model-context-protocol.md) — the MCP connector lives here.
- **used-with** → [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md) — these are the API-level harness organs.
