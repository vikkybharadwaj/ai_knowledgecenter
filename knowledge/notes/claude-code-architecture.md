---
title: Claude Code Architecture — field guide to the primitives
slug: claude-code-architecture
kind: concept
spine_layer: claude-code
tags: [claude-code, agents, harness, skills, hooks, mcp, workflows, architecture]
connections:
  - { to: harness-vs-context-engineering, type: builds-on, why: "Every Claude Code primitive exists to tune one zone of the gather→act→verify loop." }
  - { to: model-context-protocol, type: used-with, why: "MCP is one of the nine primitives — the model's reach into external tools." }
  - { to: claude-code-multi-agent-development, type: used-with, why: "Subagents, agent teams and worktrees are the 'coordinate work' primitives." }
  - { to: dynamic-workflows-and-ultraplan, type: used-with, why: "Dynamic workflows are the script-orchestrates-many-agents primitive." }
  - { to: claude-code-routines, type: used-with, why: "Routines are the unattended cloud 'operate' primitive — a saved config a trigger runs on Anthropic's cloud." }
source: { url: "https://code.claude.com/docs", author: "code.claude.com/docs, distilled in-house", retrieved: 2026-06-02 }
date: 2026-06-02
depth: evergreen
claude_specific: true
interactive: ../../docs/concepts/index.html
---

# Claude Code Architecture — field guide

The markdown companion to the interactive site at
[`/docs/concepts/`](../../docs/concepts/index.html).
This is the distilled, greppable version; the site is the clickable one.

## The one idea
Claude Code is a **harness** wrapped around a model. Every named feature exists to
control **one of four things**:

1. **What the model knows** — soft context & instructions (CLAUDE.md, rules files, skills, output styles, effort). *Model-mediated: it may comply.*
2. **What the model can reach** — tools & external systems (built-in tools, MCP servers).
3. **What is guaranteed** — deterministic enforcement (hooks, permission rules, managed policies). *Client-enforced regardless of the model.*
4. **How work is coordinated** — single-thread → fleet (subagents, agent view, agent teams, dynamic workflows, worktrees).

## The two axes
- **Soft vs Hard.** Does the model *choose* to follow it (CLAUDE.md, skills) or does the
  client *enforce* it no matter what (hooks, policies)? Soft text can never be a guardrail.
- **Who holds the plan.** You in one prompt → the model in one session → the model
  delegating (subagents) → you supervising many (agent view) → a lead coordinating peers
  (agent teams) → a script (dynamic workflows). Further right = more parallel, less watched.

## How it nests
```
managed policies            ← hard ceiling over everything (org governance)
└── harness (one session)   ← Gather → Act → Verify loop
    ├── memory / CLAUDE.md   ← soft context in Gather
    ├── skills               ← procedures pulled into Act on demand
    ├── MCP servers          ← extra tools available in Act
    ├── hooks                ← deterministic code at lifecycle events
    └── subagents            ← delegated workers (own context, summary returns)
  ...when one session isn't enough:
    agent view  = you supervising MANY sessions
    agent teams = a LEAD coordinating PEER sessions that message each other
    workflows   = a SCRIPT spawning dozens–hundreds of subagents
    worktrees   = git isolation UNDER all of the above
```

## The ten primitives (one line each)
| Primitive | One line | Enforcement |
|---|---|---|
| **Conventions** (CLAUDE.md / rules files) | Soft markdown guidance read every session | Soft |
| **Policies** (managed settings + permission rules) | Client-enforced governance; can't be overridden | **Hard** |
| **Hooks** | Your code, run on lifecycle events | **Hard** |
| **Skills** | Reusable procedures loaded on demand (what "a routine" usually means) | Soft |
| **MCP** | Protocol giving the model new tools & data | Tools model-invoked |
| **Subagents** | Delegated worker; only a summary returns | Soft |
| **Agent teams** | Lead + peer sessions that message each other | Soft |
| **Dynamic workflows** | A script Claude writes that orchestrates many agents | Soft |
| **Worktrees + Agent view** | Git isolation + a dashboard to supervise many sessions | Soft |
| **Routines** | Saved config run unattended on Anthropic's cloud on a trigger (schedule / GitHub / API) | Soft (reach hard-bounded) |

## When to reach for each (free-form, not a ladder)
There's no fixed order to learn these — go broad or deep as a real need appears. The one piece
of sequencing advice that holds: **start with CLAUDE.md and add each primitive only when a concrete
trigger shows up** (see the trigger ladder on the site's Decide page).
- *Drive one session well:* CLAUDE.md / memory, slash commands, the Explore→Plan→Code→Commit loop.
- *Extend a session:* skills, MCP, hooks, subagents.
- *Orchestrate at scale & govern:* agent teams, dynamic workflows, worktrees + agent view, plugins, policies.
- *Operate unattended:* routines — a saved config the cloud runs on a schedule / GitHub event / API call.

## Terminology corrections (common confusions)
- **Conventions ≠ Policies.** CLAUDE.md is *soft* guidance; managed settings are *hard*,
  client-enforced. Not synonyms.
- **"Routines" now names two different things.** *Colloquially*, a saved procedure you call "a
  routine" → a *skill* (orchestration → *dynamic workflow*; default voice/format → *output style*).
  *Officially*, [Routines](claude-code-routines.md) is a real feature: a saved config run unattended
  on Anthropic's cloud on a schedule / GitHub event / API call — not a saved procedure.
- **Rules ≠ Hooks.** Three things wear "rule": *hooks* (code that runs), *permission rules*
  (allow/ask/deny config), and `.claude/rules/*.md` (soft memory). Only a hook executes code.

## When to use what (fast)
- A *fact* always needed → CLAUDE.md. A *procedure* sometimes → skill. A *guardrail* → hook/permission rule.
- *Reach* an external system → MCP. *Offload* a noisy side task → subagent.
- Peers that must *talk* → agent team. *Massive fan-out* + cross-check → dynamic workflow.
- Many *independent* sessions you supervise → agent view (+ worktrees to isolate files).

## Sources
- [Features overview / trigger ladder](https://code.claude.com/docs/en/features-overview)
- [Run agents in parallel](https://code.claude.com/docs/en/agents) · [Dynamic workflows](https://code.claude.com/docs/en/workflows)
- [Subagents](https://code.claude.com/docs/en/sub-agents) · [Agent teams](https://code.claude.com/docs/en/agent-teams) · [Agent view](https://code.claude.com/docs/en/agent-view) · [Worktrees](https://code.claude.com/docs/en/worktrees)
- [Skills](https://code.claude.com/docs/en/skills) · [MCP](https://code.claude.com/docs/en/mcp) · [Hooks](https://code.claude.com/docs/en/hooks) · [Memory](https://code.claude.com/docs/en/memory) · [Settings](https://code.claude.com/docs/en/settings)
- [Dynamic workflows announcement](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code) · [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **builds-on** → [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md) — the loop every primitive plugs into.
- **used-with** → [Model Context Protocol](model-context-protocol.md) — the model's reach into external tools.
- **used-with** → [Claude Code — Multi-Agent Development](claude-code-multi-agent-development.md) — the "coordinate work" primitives.
- **used-with** → [Dynamic Workflows & the Ultraplan loop](dynamic-workflows-and-ultraplan.md) — script-orchestrates-many-agents.
- **used-with** → [Claude Code Routines](claude-code-routines.md) — the unattended cloud "operate" primitive.
