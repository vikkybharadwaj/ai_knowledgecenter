---
title: One shared context vs. many isolated contexts — what actually forks in Claude Code
slug: execution-context-isolation
kind: concept
spine_layer: claude-code
tags: [claude-code, subagents, context, modes, permissions, orchestration]
connections:
  - { to: harness-vs-context-engineering, type: builds-on, why: "Context is the scarce resource; forking it into fresh windows is the core move every agent/workflow makes." }
  - { to: claude-code-architecture, type: part-of, why: "This is the 'how work is coordinated' axis of the field guide, made concrete: modes stay in one window, agents fork new ones." }
  - { to: dynamic-workflows-and-ultraplan, type: enables, why: "A workflow's whole value is forking the main window into N isolated child contexts — this note explains the unit it forks." }
  - { to: claude-code-multi-agent-development, type: used-with, why: "Subagents, agent teams and the agent view are all ways of running work in separate contexts that report back a summary." }
source: { url: "https://movez.substack.com/p/master-dynamic-workflows-in-claude", author: "0xMovez AI + worked out in-session against CLI 2.1.165", retrieved: 2026-06-05 }
date: 2026-06-05
depth: budding
claude_specific: true
---

# One shared context vs. many isolated contexts

> **Why this note exists.** The single most clarifying question when reasoning about Claude
> Code behaviour is: *does this run in the one shared context window, or does it fork a fresh
> one?* Almost every "wait, which is which?" confusion dissolves once you sort each feature
> into one of those two buckets.

## TL;DR
The **default Claude Code harness plans AND executes in ONE shared context window** — your
messages, its reasoning, every tool call and tool result pile into a single growing
conversation. The escape hatch is **forking a fresh context**: anything that is an *agent*
(subagent) runs in its **own isolated window** and returns only a summary. The rule that
resolves all the confusion: **modes** stay in the one window; **agents** fork new ones.

## The two buckets

| Bucket | What runs there | Context |
|---|---|---|
| **Modes** | The main loop, under different rules of engagement | **Same** shared window |
| **Agents** | Subagents the main loop spawns | **Own** isolated window; only a result returns |

### Modes — same window, different rules
A mode changes *how* the one main loop behaves, not *where* it runs. On CLI **2.1.165** the
six permission modes (verified via `claude --permission-mode`) are:

- **`default`** — asks before edits / risky commands.
- **`plan`** — investigates read-only, drafts a plan, waits for approval, *then* executes — **all in the same window**.
- **`acceptEdits`** — applies edits without prompting each one.
- **`bypassPermissions`** — skips all permission checks (the "yolo" mode).
- **`auto`** — a classifier decides per-action what's safe to run vs. ask (`claude auto-mode` inspects it).
- **`dontAsk`** — proceeds without asking but stays inside configured allow rules.

### Agents — fork a fresh window
Anything described as an *agent* gets its **own** context, does focused work, and hands back
only its final result (not its intermediate reasoning). Built-in subagent types include
**general-purpose**, **Explore** (read-only fan-out search — returns conclusions, not file
dumps), the **Plan** agent (architect that returns a plan), **claude**, and
**claude-code-guide**.

## The trap: "Plan" means two different things
- **Plan *mode*** = the approve-then-execute flow → **same** window.
- **Plan *agent*** = a subagent type that designs a plan → **separate** window.

Same word, unrelated mechanisms. This is the #1 source of "but you just said…" confusion.

## Where skills sit (the hybrid)
A **skill** runs *inline in the main context* — its instructions load into the one shared
window. But a skill can itself **fan out** to isolated subagents. `deep-research` is the
clean example: the *orchestration* (deciding scope, assembling the report) lives in the main
window, while the *heavy lifting* (many searches, fetches, adversarial verification) happens
in **separate** subagent contexts, and only distilled results flow back.

So the full hierarchy of "does it fork?":
- **Mode** → no (same window).
- **Skill** → no by default (inline), but *may* spawn agents that do.
- **Agent / subagent / workflow** → yes (fresh isolated window per agent).

## Mental model / why it matters
Context is the scarce resource (see [harness vs context](harness-vs-context-engineering.md)) —
one window has finite room and degrades as it fills (laziness, drift, self-preference creep in
on long single contexts). **Forking context is the lever** against all three: push a noisy
side-quest into an Explore agent and the main window keeps the *finding*, not the 40 files it
read. Knowing which bucket a feature is in tells you (a) whether its work pollutes your main
context, and (b) whether you'll get reasoning back or just a summary.

## How to apply (in practice / consulting)
- **Keep the main window clean.** Offload broad search/log-trawling to **Explore** or a
  subagent; you keep the conclusion, not the dump.
- **Don't expect a mode to isolate.** Plan *mode* won't stop a long investigation from bloating
  your context — for that you need an *agent*.
- **Pick the permission mode to the trust level**, not the task: `plan` for client-facing
  think-before-touch, `acceptEdits`/`auto` for trusted sandboxes, `bypassPermissions` only in
  isolated no-internet sandboxes.
- **Explain the "summary returns" contract to clients:** a subagent's reasoning is *gone* once
  it reports back — if you need the audit trail, capture it inside the agent or use a workflow
  with structured returns.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **builds-on** → [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md) — context is the scarce resource; forking it is the move.
- **part-of** → [Claude Code Architecture](claude-code-architecture.md) — the "how work is coordinated" axis, made concrete.
- **enables** → [Dynamic Workflows & the Ultraplan loop](dynamic-workflows-and-ultraplan.md) — a workflow forks the main window N-fold.
- **used-with** → [Claude Code — Multi-Agent Development](claude-code-multi-agent-development.md) — subagents / teams / agent view all run in separate contexts.
