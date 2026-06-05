---
title: The Claude Agent SDK — build your own harness on the same engine as Claude Code
slug: claude-agent-sdk
kind: concept
spine_layer: agent-sdk
tags: [agent-sdk, claude-code, hooks, subagents, mcp, sessions, headless]
connections:
  - { to: claude-api-agent-primitives, type: builds-on, why: "The SDK wraps the raw Messages API tool-use loop into a managed agent loop so you don't hand-roll it." }
  - { to: claude-code-architecture, type: enables, why: "Anthropic calls the Agent SDK 'the agent harness that powers Claude Code' — the CLI is the SDK's most-polished consumer." }
  - { to: model-context-protocol, type: used-with, why: "The SDK connects external systems via mcp_servers config (stdio or remote)." }
  - { to: anatomy-of-an-agent-harness, type: builds-on, why: "The SDK ships most of the 12 harness organs as configurable primitives instead of code you write." }
source: { url: "https://code.claude.com/docs/en/agent-sdk/overview", author: "Anthropic — Claude Agent SDK overview", retrieved: 2026-06-05 }
date: 2026-06-05
depth: budding
claude_specific: true
---

# The Claude Agent SDK — build your own harness on the same engine as Claude Code

## TL;DR
The **Claude Agent SDK** (Python + TypeScript) gives you *"the same tools, agent loop, and context
management that power Claude Code"* — as a library you embed in your own app. It's the answer to
"do I have to build my own harness?": **mostly no — you configure one.** Renamed from "Claude Code
SDK" in 2025 when Anthropic generalized it beyond coding. This is the missing middle between
hand-rolling the [[claude-api-agent-primitives|raw API loop]] and using the finished
[[claude-code-architecture|Claude Code CLI]].

## What it gives you (the primitives you already know — now programmatic)
Everything you learned as Claude Code "features" is an SDK API surface:
- **Built-in tools** — Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch, Monitor, AskUserQuestion.
- **Hooks** — `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, … to validate / log / block / transform. (Same hooks as your Tide guardrails.)
- **Subagents** — define specialized agents (`AgentDefinition`) invoked via the `Agent` tool; messages carry `parent_tool_use_id` for attribution. See [[claude-code-multi-agent-development]].
- **MCP** — connect external systems via `mcp_servers` (stdio command or remote) — [[model-context-protocol]].
- **Permissions** — `allowed_tools` pre-approves; `permission_mode` (e.g. `acceptEdits`); plus interactive approval flows.
- **Sessions** — context persists; capture `session_id` from the `init` message, then `resume` or fork. Session state is JSONL on your filesystem.
- **Filesystem config** — loads `.claude/` + `~/.claude/`: **Skills** (`SKILL.md`), Commands, **Memory (`CLAUDE.md`)**, Plugins. `setting_sources` controls what loads.

## Install / run / deploy (datestamped 2026-06)
- **Python:** `pip install claude-agent-sdk` (Python ≥3.10). **TypeScript:** `npm install
  @anthropic-ai/claude-agent-sdk` (bundles a native Claude Code binary as an optional dep — no
  separate install).
- **CLI vs SDK vs raw API:** same capabilities, different interface. Anthropic's own split —
  **CLI** for interactive dev / one-off tasks; **SDK** for CI/CD, custom apps, production automation;
  the **Client SDK / raw API** when you must own the loop. Headless path: `claude -p` (print mode).
- **Managed Agents** — a hosted REST option where Anthropic runs the agent loop *and* a per-session
  sandbox, for when you don't want to operate session/sandbox infra yourself.
- **Auth for production:** API key, or Amazon Bedrock (`CLAUDE_CODE_USE_BEDROCK=1`), Google Vertex
  (`..._VERTEX=1`), Azure AI Foundry (`..._FOUNDRY=1`).
- **Watch-outs:** as of **2026-06-15**, Agent SDK + `claude -p` usage on subscription plans draws
  from a separate monthly **"Agent SDK credit"** (budget for it). Branding rules forbid partners
  calling their product "Claude Code."

## Mental model / why it matters
This is the **agent-sdk layer** of the [[big-picture]] spine — the framework that turns the
[[claude-api-agent-primitives|engine]] into a configurable harness. The big unlock for the consulting
goal: **Claude Code is not the only thing you can build with the machinery behind Claude Code.** Same
loop, your product, your UX, your tools — non-developer end users, a branded chat surface, a CI job,
a customer-facing agent. The skills/hooks/MCP/subagent concepts transfer 1:1; you're swapping the
*interface*, not relearning the *primitives*.

## How to apply (in practice / consulting)
- **The "graduation path":** prototype on the [[claude-api-agent-primitives|raw API]] → adopt the
  Agent SDK when you need managed sessions/permissions/hooks → keep Claude Code (the CLI) for the dev
  team in parallel. See the decision tree in [[claude-code-vs-build-your-own]].
- **Embed, don't rebuild:** when a client needs an internal "agent over our systems," the SDK + their
  MCP servers gets there without a bespoke orchestration layer.
- **Deploy near the model:** Bedrock/Vertex/Foundry auth lets a regulated client run the SDK inside
  their existing cloud + compliance boundary.

## Connections
- **builds-on** → [Claude API agent primitives](claude-api-agent-primitives.md) — wraps the raw tool-use loop.
- **enables** → [Claude Code Architecture](claude-code-architecture.md) — the SDK is the harness that powers Claude Code.
- **used-with** → [Model Context Protocol](model-context-protocol.md) — external systems via `mcp_servers`.
- **builds-on** → [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md) — ships the 12 organs as primitives.
