---
title: Evaluate by system shape — one call, RAG, or agent — and find the first thing that broke
slug: evals-by-system-type
kind: concept
spine_layer: patterns
tags: [evals, rag, agents, tool-use]
connections:
  - { to: eval-metrics-by-system-type, type: enables, why: "This note is the approach for each system shape; that one lists the numbers you track for each." }
  - { to: evals-test-judgment, type: builds-on, why: "The three-link chain (pick tool → get numbers → use them) is a small agent; step-level diagnostics generalize it." }
  - { to: anatomy-of-an-agent-harness, type: used-with, why: "Step-level agent evals check the harness organs one by one: tool choice, parameters, error handling, memory." }
  - { to: tool-call-taxonomy, type: used-with, why: "Agent tool calls are tested as four separate checks — name, arguments, result, resulting state — at the tool_use/tool_result seam." }
source: { url: "https://hamel.dev/blog/posts/evals-faq/", author: "Hamel Husain & Shreya Shankar", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Evaluate by system shape — one call, RAG, or agent — and find the first thing that broke


## TL;DR
The more moving parts, the more you **split the evaluation along the parts** — and the more it matters to
find the **first** step that went wrong, because errors cascade downstream.
- **Basic (one model call):** error analysis → a code check or judge per failure mode.
- **RAG:** evaluate **retrieval first**, then generation — a perfect writer can't fix missing sources.
- **Agent / multi-step:** first **end-to-end task success** (black box), then **step-level diagnostics**
  for the workflows that fail most, using a **transition failure matrix**.

## The idea, simply
**1. Basic LLM app (one call, maybe a template).** The whole thing is one step, so the flow is the standard
one: read traces, name the failure modes, and write a code check or a validated judge for each recurring
one.

**2. RAG (retrieve, then generate).** Two components, two problems:
- **Retrieval is a search problem** → use classic search metrics (did the right documents come back, near
  the top?). Evaluate it **first**: if the right information isn't retrieved, the generator has no chance.
  You can build the test set without hand-labelling by working **backwards**: pull key facts from your
  documents and ask an LLM to write questions those facts answer — that gives query → correct-document pairs.
- **Generation** is judged on three relationships: is the retrieved context relevant to the question
  (**C|Q**), does the answer stick to the context (**A|C**, faithfulness), and does the answer address the
  question (**A|Q**). Use error analysis and validated judges — "don't just use prompts off the shelf".

**3. Agents and multi-step workflows.** Two phases:
- **End-to-end first.** Treat the agent as a black box: did it achieve the user's goal? Define precise
  success criteria per task. During error analysis, note the **first upstream failure** only.
- **Then step-level diagnostics**, for the workflows that fail most: tool choice, parameter extraction,
  error handling (empty results, API errors), context retention (did it forget an earlier constraint?),
  efficiency (steps, seconds, tokens), and goal checkpoints in long workflows. Test each tool call as
  **four separate checks**: tool name, arguments, result, and resulting state — and remember a valid call
  can still be wrong if it wasn't authorised.
- **Transition failure matrix:** a grid of *last successful state* × *where the first failure happened*.
  The hot cells show where the pipeline breaks most, so you debug there first.

**Multi-turn chat** is a cousin of the agent case: grade the whole session pass/fail first, then try to
**reproduce the failure in a single turn** — the simplest repro that still fails.

**Everyday analogy:** a car that won't start. For a bicycle (one part) you just look. For a car you check the
battery before the starter before the engine — each stage depends on the one before, so you find the first
dead part, not the last symptom.

## Mental model / why it matters
The unifying idea is **locate before you fix**. Each extra stage multiplies the ways an answer can go wrong,
and a failure at stage 1 shows up as a symptom at stage 5. So the evaluation mirrors the architecture: one
check per stage, run in dependency order, and the "first upstream failure" rule tells you where to spend
effort. It's the same instinct as the MECE failure map — file each failure under the first stage where it
went wrong.

## How to apply (in practice / consulting)
- Draw the client's system as stages before designing any eval. The eval plan follows the drawing.
- For RAG, build the retrieval test set backwards from their documents on day one — it's cheap and
  isolates the most common root cause.
- For agents, don't start with step-level metrics. Get task success first, then instrument only the
  workflows that fail often.
- Log **everything** in a multi-step trace — model calls, tool calls, human approvals, database writes —
  or you can't do stage-level analysis at all.

## Provenance & caveats
Sources (retrieved 2026-09-26): FAQ pages *How should I approach evaluating my RAG system?* (2025-06-10,
mod. 2026-09-01), *How do I evaluate agentic workflows?* (2025-06-29, mod. 2026-09-01), *How do I evaluate
complex multi-step workflows?* (2025-07-27); Husain & Shankar on Lenny's (multi-turn: reproduce in a single
turn; RAG: retriever first).
- ❓ Practitioner methodology, not a vendor spec.
- ⚠️ The C|Q / A|C / A|Q framing is the FAQ's shorthand for the three relevance relationships; other sources call A|C "faithfulness" or "groundedness".

## Connections
- **enables [Metrics by system type](eval-metrics-by-system-type.md)**: the numbers for each shape.
- **builds-on [Evals test judgment; unit tests test math](evals-test-judgment.md)**: the three-link chain is a tiny agent.
- **used-with [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md)**: step checks map onto harness organs.
- **used-with [Tool call, function call, MCP, skill](tool-call-taxonomy.md)**: test name, args, result and state separately.
