---
title: Scenario — bootstrapping a company's AI stack from zero
slug: bootstrapping-company-ai-stack
kind: scenario
spine_layer: products
tags: [consulting, scenario, rollout, mcp, build-vs-buy, enterprise-stack, skills, hooks]
connections:
  - { to: claude-code-vs-build-your-own, type: used-in, why: "The four-altitude decision tree is the engine that decides what to buy, configure, and own for this client." }
  - { to: model-context-protocol, type: used-in, why: "Phase 2 of the rollout is wrapping the company's internal systems as MCP servers — the integration backbone." }
  - { to: agentic-ai-reference-architecture, type: used-in, why: "The nine-layer reference architecture is the target end-state the rollout converges toward." }
  - { to: claude-code-architecture, type: used-in, why: "Phase 1 gives the dev team Claude Code + shared skills/hooks/CLAUDE.md — the fastest first win." }
source: { url: null, author: "Vikram — consulting scenario; grounded in the 2026-06-05 landscape research", retrieved: 2026-06-05 }
date: 2026-06-05
depth: budding
claude_specific: true
---

# Scenario — bootstrapping a company's AI stack from zero

> *"A small/medium company reaches out: they have no idea how to get an AI stack going. Get their
> employees set up with the basic infrastructure to start building — with custom skills, hooks, MCPs
> for customer, business, and operational use cases."* — the canonical first engagement.

## TL;DR
You don't sell them "an AI." You install **layers and habits**: give people capable agents now, wire
those agents to the company's own data, codify conventions as shared skills/hooks/`CLAUDE.md`, then
build the few differentiated agents that are actually worth building. Most of it is **buy + configure**;
only the differentiated slice is **build**. The decision engine is [[claude-code-vs-build-your-own]].

## Phase 0 — Discovery (the questions that scope everything)
- **Who builds?** Ratio of developers to business users — decides Claude Code/SDK vs a bought
  low-code platform (Copilot Studio / Dust / Le Chat).
- **Where do you already live?** Cloud (AWS/GCP/Azure), model provider, primary language — pick the
  runtime that fits (Bedrock AgentCore / Vertex Agent Engine / Azure Foundry) instead of fighting it.
- **What data + systems?** The list of internal APIs/DBs/SaaS becomes your MCP-server backlog.
- **Regulatory posture?** PII/HIPAA/data-residency → on-prem/VPC options (Cohere North, self-host,
  in-cloud SDK auth via Bedrock/Vertex/Foundry).
- **Three use-case buckets** (sort every idea into these — they map to different altitudes):
  - **Operational** (internal productivity: coding, ops, support triage) → mostly *buy/use* (Claude Code for devs, enterprise chat for everyone).
  - **Business** (internal workflows over company data: reporting, knowledge, automation) → *configure* (Agent SDK / platform + internal MCP servers).
  - **Customer** (in-product, customer-facing agents) → *configure/own* (Agent SDK or own-the-loop, with guardrails + eval as non-negotiable).

## The rollout (each phase = one altitude of [[claude-code-vs-build-your-own]])
1. **Give people capable agents now (BUY/USE).** Devs → **Claude Code** (CLI; MCP-capable). Everyone
   else → an enterprise chat assistant (Claude / ChatGPT Enterprise / Copilot / Le Chat / Dust).
   Immediate productivity, zero build. *Win in week one.*
2. **Wire agents to company data (the integration backbone).** Wrap internal APIs/Lambda/DBs as
   **MCP servers** ([[model-context-protocol]]); AWS **AgentCore Gateway** is the managed "APIs/Lambda
   → MCP tools" path; discover via the **MCP Registry**. This is what turns generic chat into *your
   company's* assistant.
3. **Codify conventions as shared primitives.** A company-standard `CLAUDE.md`, a shared **skills**
   library (the team's repeatable procedures), and **hooks** as guardrails (the Tide pattern: a hook
   enforces the mechanically-checkable slice of a policy). Now every employee's agent inherits the
   same standards. See [[claude-code-architecture]].
4. **Build the differentiated agents (CONFIGURE/OWN).** Only the customer/business cases that a bought
   tool can't do well → the **Agent SDK** ([[claude-agent-sdk]]) or raw API, deployed on a managed
   runtime, embedded in the product. This is the small, high-value build slice — not the whole stack.
5. **Stand up the cross-cutting platform layers** as usage grows (the [[agentic-ai-reference-architecture]] in practice):
   - **Model gateway/router** — LiteLLM / OpenRouter / Portkey (one interface, fallbacks, cost control).
   - **Observability + eval** — Langfuse (OSS) / LangSmith / Braintrust / Arize (OpenTelemetry-based).
   - **Guardrails** — NeMo Guardrails / Guardrails AI (PII, jailbreak, topic, hallucination rails).
   - **Identity/policy** — AgentCore Identity (Cognito/Okta/Entra) + Cedar policy, or your IdP.

## Build-vs-buy, said plainly
- **Non-technical org / fast value** → *buy* a platform (Copilot Studio, Dust, Le Chat, North).
- **Technical org / differentiated need** → *configure* on a framework (Agent SDK / LangGraph / ADK /
  Agent Framework) over a managed runtime (AgentCore / Vertex Agent Engine / Anthropic Managed Agents).
- **Either way** → start at the highest altitude that works and descend only when forced.

## Mental model / why it matters
This is the **products layer** of the [[big-picture]] spine — where the theory becomes billable. The
engagement's real product isn't a model; it's **infrastructure + habits**: agents in hand, data
wired in via MCP, conventions encoded as skills/hooks, and a deliberate (small) build list. It's the
[[claude-code-vs-build-your-own]] decision tree, run across a whole org and sequenced into phases.

## How to apply (in practice / consulting)
- **Lead with Phase 1 + 2** — capable agents + internal MCP servers buy trust fast and are mostly
  configuration, not building.
- **Resist building in Phase 4 until Phases 1–3 are real.** Most "we need a custom AI" asks are
  solved by an MCP server + a skill, not a bespoke agent.
- **Make eval/guardrails a Phase-4 entry gate** for anything customer-facing — no eval, no ship.
- **Leave them self-sufficient:** the deliverable is a shared skills/hooks/`CLAUDE.md` repo their own
  people can extend — exactly the kind of self-organizing base this knowledge center models.

## Connections
- **used-in** → [Use Claude Code vs build your own](claude-code-vs-build-your-own.md) — the decision engine for the whole rollout.
- **used-in** → [Model Context Protocol](model-context-protocol.md) — Phase 2 integration backbone.
- **used-in** → [Agentic AI Reference Architecture](agentic-ai-reference-architecture.md) — the target end-state.
- **used-in** → [Claude Code Architecture](claude-code-architecture.md) — Phase 1 + the shared skills/hooks/CLAUDE.md.
