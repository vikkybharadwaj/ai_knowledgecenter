---
title: "Tool call, function call, MCP, skill — one containment model"
slug: tool-call-taxonomy
kind: concept
spine_layer: api
tags: [tool-use, mcp, skills, function-calling, api, claude-code]
connections:
  - { to: claude-api-agent-primitives, type: builds-on, why: "Tool use is the API primitive everything here specializes — this note draws the containment boundaries around it." }
  - { to: model-context-protocol, type: used-with, why: "An MCP server tool surfaces to the model as an ordinary tool-use call — MCP is a special case inside the boundary, not a different mechanism." }
  - { to: claude-code-architecture, type: used-with, why: "In Claude Code a skill invocation is itself a Skill tool call, so the same containment model explains the harness's own surfaces." }
source: { url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", author: "platform.claude.com/docs + code.claude.com/docs, distilled in-house", retrieved: 2026-06-09 }
date: 2026-06-09
depth: budding
claude_specific: true
---

# Tool call, function call, MCP, skill — one containment model

> **TL;DR.** "Tool call," "function call," "MCP call," and "invoking a skill" feel like four different things;
> they're mostly **one mechanism with a few specializations.** **Tool use** is the umbrella API capability. A
> **tool call** is one instance of it: the model emits a `tool_use` block, your code (or Anthropic's) runs it,
> you return a `tool_result`. **"Function call" is the same thing under an older name** (OpenAI's term;
> Anthropic says "tool use"). An **MCP** server tool *is* an ordinary tool call — same JSON, routed through
> the MCP client. And in Claude Code, **invoking a skill is itself a `Skill` tool call** — even though a skill
> is a knowledge package, not an external function. So: *yes, calling an MCP is a tool call; yes, invoking a
> skill is a tool call; "function call" ≈ "tool call."*

## The containment model
```
TOOL USE  (the Claude API capability: you pass a `tools` array; the model may call them)
│
└── TOOL CALL  (one instance: model emits `tool_use` { name, id, input } → you return `tool_result`)
      ├── client tool   — your code runs it (Bash, Read, Edit, a custom function)
      ├── server tool    — Anthropic runs it for you (web_search, code_execution, web_fetch)
      ├── MCP tool call  — a tool exposed by an MCP server; same `tool_use` JSON, routed via the MCP client
      └── Skill tool call (Claude Code) — the model calls the `Skill` tool to load a SKILL.md into context

  "function call"  = legacy / OpenAI synonym for "tool call" — same idea, different vocabulary
```

## Term by term
- **Tool use** — the *mechanism*. You send messages plus a `tools` array (name, description, JSON schema). On
  `tool_choice: auto` the model decides whether to call a tool or answer directly. This is the "act" step of
  the agent loop made concrete. See [tool use](tool-use.md).
- **Tool call** — the *instance*. Response comes back with `stop_reason: "tool_use"` and one or more
  `tool_use` blocks; you execute and reply with matching `tool_result` blocks; repeat until the model stops
  calling tools. **Client tools** your code runs; **server tools** Anthropic runs for you.
- **Function call** — **the same concept, older word.** OpenAI shipped "function calling"; Anthropic chose
  "tool use" because a tool can be a function, an API, an integration, or a server-side capability — not just
  a local function. When someone says "function call," read "tool call."
- **MCP call** — **a tool call, full stop.** An [MCP](mcp.md) server advertises its tools via `tools/list`;
  Claude Code surfaces them in the *same tool namespace* as built-ins; calling one emits the *same*
  `tool_use` block and gets routed to the server. MCP is a *protocol for supplying tools*, not a separate
  calling mechanism. (MCP also exposes prompts → slash commands and resources → `@mentions`, which are *not*
  tool calls.)
- **Skill invocation** — in Claude Code, **a `Skill` tool call.** The model (or you, via `/name`) calls the
  `Skill` tool, which loads the rendered `SKILL.md` into the conversation. Permission rules like
  `Skill(deploy *)` and `disable-model-invocation: true` govern it exactly like any other tool. The nuance:
  **a skill invocation is a tool call, but a skill is not a tool** — it's a knowledge/procedure package that
  the `Skill` tool *loads*, after which the model does the work (often by making more tool calls).

## The one-sentence answers
- **Calling an MCP — is that a tool call?** **Yes** — identical `tool_use` shape, just routed to a server.
- **Invoking a skill — is that a tool call?** **Yes**, it's a `Skill` tool call; but the skill itself is
  instructions, not an external function.
- **Tool call vs function call?** **Synonyms.** Anthropic standardized on "tool use"; "function calling" is
  the OpenAI-era name for the same thing.

## How to apply (in practice / consulting)
- **Stop drawing four boxes.** When a client's team argues "should this be a tool, an MCP, or a skill," the
  clarifying move is: MCP and skills both *bottom out in tool calls* — the real questions are *where the
  capability lives* (your code = tool; an external system = MCP) and *whether it's a function or knowledge*
  (function = tool; procedure = skill).
- **Permissioning is uniform.** Because skills and MCP both run *through* tool calls, you gate them with the
  same permission-rule surface — useful when scoping what an unattended loop or routine is allowed to do.

## Provenance
Distilled from `platform.claude.com/docs` (tool use) and `code.claude.com/docs` (MCP, skills), retrieved
2026-06-09. The "function calling → tool use" terminology mapping is the documented Anthropic convention; the
"skill invocation = `Skill` tool call" framing follows the Claude Code permission model (`Skill(...)` rules).

## Connections
- **builds-on [Claude API agent primitives](claude-api-agent-primitives.md)** — tool use is the primitive everything here specializes.
- **used-with [Model Context Protocol](model-context-protocol.md)** — an MCP tool call is an ordinary tool call routed to a server, not a separate mechanism.
- **used-with [Claude Code — field guide](claude-code-architecture.md)** — a skill invocation is itself a `Skill` tool call, so the model explains the harness's surfaces too.
