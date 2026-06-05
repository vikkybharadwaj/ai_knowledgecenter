---
title: Building & advising on AI stacks — the consulting map
slug: building-ai-stacks
kind: map
spine: false
date: 2026-06-05
---

# Building & advising on AI stacks 🏗️

> **This is the "products & consulting" Map of Content — the section to keep evolving.**
> It answers the question that kicked it off: *"Claude Code is itself a harness — so when do I
> just use it, and when do I build my own? And how do I help a company with no AI stack get
> their people building?"* Read it top-to-bottom to go broad; click any note to go deep.
>
> It hangs off the [Big Picture spine](big-picture.md) at the **Agent SDK → Patterns → Products**
> layers, and deliberately fills the two gaps that spine flagged as empty.

## The one idea
**"Build your own harness" is almost never "write an agent loop from scratch."** It's choosing an
**altitude** of the *same engine* and configuring primitives you already know (skills, hooks, MCP,
subagents, `CLAUDE.md`). Everything you learned using Claude Code transfers directly — Claude Code is
one harness; the [Agent SDK](../notes/claude-agent-sdk.md) lets you build others on the same machinery.

## The four altitudes (the decision in one picture)
```
BUY a finished product   ── Copilot Studio · Dust · Le Chat · (Claude Code, for devs)   ← fastest, least control
USE the finished harness ── Claude Code CLI · Managed Agents                            ← technical/internal work
CONFIGURE a harness      ── Claude Agent SDK (· LangGraph · OpenAI Agents SDK · ADK …)   ← your product, managed loop
OWN the loop             ── raw Claude API tool-use loop                                ← max control, the baseline
```
👉 The full decision tree + the two canonical framings (*Building Effective Agents*, *12-Factor
Agents*) live in **[Use Claude Code vs build your own](../notes/claude-code-vs-build-your-own.md)** — the
centerpiece note. The reframe: *match each use case to the lowest altitude that solves it; a real org
runs several altitudes at once.*

## The notes in this cluster (the spine, bottom→top)
- ⚙️ **api** — [The Claude API agent primitives](../notes/claude-api-agent-primitives.md) — the engine: tool-use loop, MCP connector, caching, batch, computer use. *Start here; an agent is ~20 lines.*
- 🛠️ **agent-sdk** — [The Claude Agent SDK](../notes/claude-agent-sdk.md) — build your own harness on the same engine as Claude Code: hooks, subagents, MCP, sessions, headless/CI, Bedrock/Vertex/Foundry auth.
- 🧩 **patterns** — [Use Claude Code vs build your own](../notes/claude-code-vs-build-your-own.md) — **the four-altitude decision tree** (the dot that connects the rest).
- 🚀 **products** — [Scenario: bootstrapping a company's AI stack from zero](../notes/bootstrapping-company-ai-stack.md) — discovery questions + the phased rollout (buy → wire MCP → codify skills/hooks → build the differentiated slice).

## The engagement arc (how the scenario uses the notes)
```
Phase 0  Discovery          → sort every idea into operational / business / customer use cases
Phase 1  BUY/USE            → Claude Code for devs + enterprise chat for everyone (week-one win)
Phase 2  Wire data          → internal systems as MCP servers (the integration backbone)
Phase 3  Codify             → shared CLAUDE.md + skills library + hooks-as-guardrails
Phase 4  BUILD (small)      → Agent SDK / own-the-loop for the few differentiated agents
Phase 5  Platform layers    → gateway · observability+eval · guardrails · identity/policy
```

## Gaps to fill next (this map's "what to learn" list)
*Gaps are features — the visible backlog for this cluster.*
- [ ] **Agent-framework landscape note** — LangGraph · OpenAI Agents SDK/Responses/AgentKit · Google ADK + A2A · Microsoft Agent Framework · CrewAI · Bedrock AgentCore · Vertex Agent Engine (when to pick each).
- [ ] **MCP for the enterprise** — exposing internal systems as servers, the official Registry, AgentCore Gateway, Streamable HTTP transport.
- [ ] **Eval & observability layer** — Langfuse / LangSmith / Braintrust / Arize; why "no eval, no ship" for customer-facing agents.
- [ ] **Guardrails layer** — NeMo Guardrails / Guardrails AI; PII/jailbreak/topic/hallucination rails.
- [ ] **A2A vs MCP** — agent-to-agent vs agent-to-tool; the two-protocol interop layer.
- [ ] **A concrete client scenario** — take one real customer use case end-to-end through the four altitudes.

## How this map evolves
Land new sources with **`/land`** — it files an atomic note, places it on the spine, wires typed
connections, and (when it earns a spot) links it here. Tick a gap above as each note lands. Keep the
four-altitude picture and the engagement arc current; everything else accretes around them.
