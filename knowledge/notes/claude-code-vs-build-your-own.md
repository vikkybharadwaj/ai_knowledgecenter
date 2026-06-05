---
title: Use Claude Code vs build your own harness — the four-altitude decision
slug: claude-code-vs-build-your-own
kind: concept
spine_layer: patterns
tags: [decision-framework, harness, agent-sdk, build-vs-buy, consulting, frameworks]
connections:
  - { to: anatomy-of-an-agent-harness, type: builds-on, why: "Operationalizes the harness's 'thickness' and 'single-vs-multi-agent' decisions into a concrete buy/build/own-the-loop choice." }
  - { to: claude-agent-sdk, type: used-with, why: "The SDK is the 'configure a harness' rung — the answer when a finished product is too rigid but the raw loop is too much." }
  - { to: claude-code-architecture, type: used-with, why: "Claude Code (the CLI) is the 'use the finished harness' rung — the default for technical/internal work." }
  - { to: agentic-ai-reference-architecture, type: used-with, why: "The choice feeds the production layers — whichever rung you pick still needs the nine-layer architecture around it." }
source: { url: "https://www.anthropic.com/engineering/building-effective-agents", author: "Anthropic — Building Effective Agents; 12-Factor Agents (HumanLayer/Dex)", retrieved: 2026-06-05 }
date: 2026-06-05
depth: evergreen
claude_specific: true
---

# Use Claude Code vs build your own harness — the four-altitude decision

## TL;DR
"Should I keep using Claude Code or build my own harness?" is a **false binary**. There are **four
altitudes** of the same engine, and the right answer for a real org is usually **several at once, in
layers**. The skill is matching each *use case* to the *lowest altitude that solves it* — not picking
one tool for everything. Crucially: **nothing you learned about Claude Code is wasted** — skills,
hooks, MCP, subagents, `CLAUDE.md` are the primitives at *every* altitude.

## The four altitudes (same engine, rising abstraction)
```
BUY a finished product   ── Copilot Studio · Dust · Le Chat · (Claude Code, for devs)
   ▲ fastest time-to-value, least control, non-developers
USE the finished harness ── Claude Code CLI / Managed Agents
   ▲ great for technical + internal + interactive work, zero build
CONFIGURE a harness      ── Claude Agent SDK  (or LangGraph / OpenAI Agents SDK / Google ADK / MS Agent Framework)
   ▲ your product/UX, managed loop, you own tools+policy
OWN the loop             ── raw Claude API tool-use loop  (claude-api-agent-primitives)
   ▲ maximum control, you write the orchestration; the baseline everything else must beat
```
Each rung trades **control for leverage**. Lower = more control, more code. Higher = faster, less
control. (See [[claude-agent-sdk]] for the middle rungs and [[claude-api-agent-primitives]] for the floor.)

## The decision tree
1. **Are the steps predictable?** → it's a *workflow*, not an agent — write deterministic code with
   LLM steps inside it. (Anthropic: don't reach for an autonomous agent when a fixed path works.)
2. **Is the user a developer doing technical/internal work?** → **use Claude Code** (the CLI). Don't
   build anything. This is the default and it's already what you do every day.
3. **Do you need a custom product surface** (branded UI, non-dev end users, embedded in your app,
   customer-facing)? → **configure a harness on the Agent SDK** — same primitives, your interface.
4. **Did you hit the framework's ceiling** (need full control of prompts/context/control-flow, or the
   abstraction is obscuring your bug)? → **drop to the raw API and own the loop.**
5. **Is fast time-to-value over company data for business users the goal?** → **buy a platform**
   (Copilot Studio / Dust / Le Chat / Cohere North) rather than build.

## The two canonical framings (read these)
- **Anthropic — *Building Effective Agents*:** "the most successful implementations weren't using
  complex frameworks… they were building with simple, composable patterns." **Start with the API
  directly**; add complexity only when a simpler system *demonstrably* underperforms; agents add
  latency + cost and need sandboxing/guardrails; prioritize transparency of planning steps.
- **12-Factor Agents (HumanLayer/Dex):** production agents are "**mostly just software**" with LLM
  steps strategically placed. Builders "hit an **80% quality ceiling** with frameworks, then must
  reverse-engineer to proceed." Advocates **selective, principle-based** adoption — own your prompts,
  own your context window, own your control flow — over wholesale framework lock-in.

## The non-Anthropic options (so you can advise vendor-neutrally) — datestamped 2026-06
At the "configure a harness" rung, the Agent SDK competes with: **LangGraph** (stateful/resumable
graph runtime + LangSmith tracing), **OpenAI Agents SDK + Responses API + AgentKit**, **Google ADK**
(polyglot, + A2A + Vertex Agent Engine), **Microsoft Agent Framework** (the merged successor to
AutoGen + Semantic Kernel, .NET/Python), **CrewAI** (role-based multi-agent), and framework-agnostic
managed runtimes like **AWS Bedrock AgentCore** and **Vertex Agent Engine**. Pick by where the org
already lives (cloud, model provider, language) — not by hype.

## Mental model / why it matters
This note is the **patterns-layer** hinge of the [[big-picture]] spine: it converts the abstract
"[[anatomy-of-an-agent-harness|harness thickness]]" decision into a checklist an architect can run in
a meeting. The reframe that ends the anxiety: **"build my own harness" almost never means writing an
agent loop from scratch — it means choosing which altitude, and configuring the primitives you
already know.** Bet *thin* (Anthropic's stance: as models improve, harness complexity should shrink),
verify aggressively, and only descend an altitude when the one above provably can't do the job.

## How to apply (in practice / consulting)
- **Run the decision tree per use case, not per company.** A client typically lands on *Claude Code
  for devs + a bought platform for business users + a few Agent-SDK builds for differentiated
  workflows* — all three, layered. This is the spine of [[bootstrapping-company-ai-stack]].
- **Default to the highest altitude that works**, then justify every descent in writing (control you
  need, ceiling you hit). It keeps you honest and the system maintainable.
- **Make the API loop your baseline benchmark:** if a framework isn't beating ~20 lines of tool-use
  loop on *your* task, don't adopt it yet.

## Connections
- **builds-on** → [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md) — turns "thickness/single-vs-multi" into a buy/build choice.
- **used-with** → [Claude Agent SDK](claude-agent-sdk.md) — the "configure a harness" rung.
- **used-with** → [Claude Code Architecture](claude-code-architecture.md) — the "use the finished harness" rung.
- **used-with** → [Agentic AI Reference Architecture](agentic-ai-reference-architecture.md) — the production layers any rung still needs.
