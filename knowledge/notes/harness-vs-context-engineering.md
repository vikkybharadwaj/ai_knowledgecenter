---
title: Harness vs Context vs Prompt Engineering
slug: harness-vs-context-engineering
kind: concept
spine_layer: foundations
tags: [prompting, context-engineering, harness, agents, cross-cutting]
connections:
  - { to: prompt-context-harness-engineering, type: builds-on, why: "Expands the original diagram into the canonical narrative model." }
  - { to: agentic-ai-reference-architecture, type: used-with, why: "The agentic reference architecture is the full production system view of this same loop." }
source: { url: null, author: "migrated canonical home (was a Tide visual doc)", retrieved: 2026-06-02 }
date: 2026-06-02
depth: evergreen
claude_specific: true
interactive: ../../docs/concepts/mental-model.html#harness
---

# Harness vs Context vs Prompt Engineering

> **Canonical home.** This content previously lived as a visual page in the Tide repo
> (`/tide/harness-vs-context-engineering.html`). It now lives here in the AI Knowledge
> Center, and is rendered interactively on the
> [mental-model page](../../docs/concepts/mental-model.html#harness) of the
> Claude Code Architecture site. See the Tide-removal checklist in `LEARNINGS.md`.

## TL;DR
Three nested levels of control over an LLM, each a bigger unit of work than the last.
**Prompt engineering** shapes one input. **Context engineering** manages what stays in
the window across steps. **Harness engineering** wraps the whole gather → act → verify
loop — and contains the other two inside it.

```
prompt  ⊂  context  ⊂  harness
(message)  (memory)   (machine)
```

## The three levels

### 1. Prompt engineering — *the message* (unit: one input)
Compose a single best input from five ingredients, send it, then refine the weakest
ingredient and repeat.
- **Role · Context · Instructions · Examples · Format**
- Loop: `compose → send → generate → refine the weakest ingredient`.

### 2. Context engineering — *the memory* (unit: what stays in the window, step by step)
You have a **finite context budget**. A *curator* selects, compresses, and drops material
so only what matters reaches the model each step.
- Inputs to curate: user query, system prompt, retrieved docs, tool outputs, memory, prior turns.
- Flow: `gather → curate (select/compress/drop) → feed → inference → step output`.
- After each step, **update the working set**: new outputs become context for the next step.

### 3. Harness engineering — *the machine* (unit: the whole loop)
The outer machine with three zones; prompt and context engineering **live inside its
Gather/Act steps**.
- **① GATHER** — context-engineering zone: curator + finite context window. Sources: user
  request, memory (CLAUDE.md, sessions), prior tool outputs, retrieved docs.
- **② ACT** — prompt-engineering zone: assemble one prompt → inference → branch to **tools**
  (exec, fetch, MCP) or **subagents** (specialists).
- **③ VERIFY** — a verifier (tests, LLM-as-judge) checks the result. Pass → final response.
  Fail → **retry: re-run gather → act → verify with updated context.**

## Why it matters — it tells you where a bug lives
- Bad single answer → fix the **prompt**.
- Model forgetting / drowning in irrelevant tokens → fix **context** (the curator).
- Agent does the right thing once but can't recover, loop, or self-check → fix the
  **harness** (verify + retry).

Maps directly onto Claude Code: CLAUDE.md + session = memory; the curated context window =
gather; tool/subagent calls = act; tests/judges = verify. This is the frame the whole
[Claude Code primitive set](claude-code-architecture.md) hangs off — every primitive is a
way to tune one zone of this loop.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **builds-on** → [Prompt vs Context vs Harness Engineering](prompt-context-harness-engineering.md) — the original diagram this narrative expands.
- **used-with** → [Agentic AI Reference Architecture](agentic-ai-reference-architecture.md) — the full production system view of this loop.
- see also → [Claude Code Architecture](claude-code-architecture.md) — every primitive maps onto this loop.
