---
title: Workflow runs are journaled — resume replays finished agents from cache, so orchestration is durable, not just parallel
slug: workflow-journal-resume
kind: concept
spine_layer: claude-code
tags: [claude-code, workflows, orchestration, reliability, resume]
connections:
  - { to: dynamic-workflows-and-ultraplan, type: builds-on, why: "The journal records the results of the agent()/parallel()/pipeline() primitives that note explains — resume is a property of those calls." }
  - { to: dynamic-workflow-patterns, type: used-with, why: "Durability is the seventh, unlisted reason to script a workflow: every fan-out shape becomes restartable mid-run instead of all-or-nothing." }
  - { to: execution-context-isolation, type: builds-on, why: "Replay-from-cache is only valid because each agent is an isolated context whose (prompt, opts) fully determine its work — shared mutable context would make cached results stale." }
  - { to: worktree-base-ref-fresh-vs-head, type: used-with, why: "The journal preserves compute; the worktree preserves file state. A resumed run recovers both halves of a partially-finished change." }
source: { url: null, author: null, retrieved: 2026-06-10 }
date: 2026-06-10
depth: seedling
claude_specific: true
---

# Workflow runs are journaled — resume replays finished agents from cache, so orchestration is durable, not just parallel

## TL;DR
Every `agent()` call in a dynamic workflow is journaled with its `(prompt, opts)` pair and
result. Relaunching with `Workflow({scriptPath, resumeFromRunId})` replays the **longest
unchanged prefix** of calls from that journal instantly and runs only the edited/new/failed
calls live. Same script + same args = 100% cache hit. That makes a scripted workflow
**durable** in a way N ad-hoc `Agent` calls never are — and durability, not parallelism, is
the decisive argument for scripting the orchestration when the work is destructive or
expensive to redo.

## The lived example (Tide, 2026-06-10 — how to recollect this)
Removing Tide's Progress/challenges tab end-to-end (mobile UI, backend, 5 DB tables, AI
prompt, evals, docs) ran as a 4-agents-in-`parallel()` + verify workflow. Mid-run, the
**monthly spend limit hit**: the mobile agent had finished its removal; the backend, docs,
AI/evals, and verify agents all died.

One call fixed it after credits were enabled:

```
Workflow({ scriptPath: <same script>, resumeFromRunId: "wf_0d5bb96d-f7d" })
```

- The completed **mobile agent replayed from the journal cache** — zero tokens, instant,
  and its structured report flowed into the verify agent's prompt exactly as designed.
- Only the four dead agents re-ran. The re-run backend agent even found the worktree
  already partially edited (file state had survived alongside the journal), verified those
  edits with grep instead of redoing them, and created only the missing drop migration.
- Net cost of the crash: **nothing structural**. The run finished green (65/65 tests) and
  shipped as tide PR #180.

Had the same task been four ad-hoc `Agent` tool calls, the crash would have left an
untracked half-edited tree and a manual archaeology session: which agent finished? which
files are half-done? Re-prompting from memory risks double-edits on a *destructive* change.

## Why it works (the mechanism, and what it forbids)
Replay is only sound because a workflow script is **deterministic**: each `agent()` result
is fully keyed by its `(prompt, opts)`. This is exactly why `Date.now()`, `Math.random()`,
and argless `new Date()` are banned inside workflow scripts — a prompt that embedded a
timestamp would never match its journal entry, silently breaking the cache. (Pass
timestamps in via `args`; stamp results after the run returns.) Two complementary stores do
the recovery: the **journal** preserves compute (agent results), the **git worktree**
preserves file state (edits already on disk). Resume reunites them.

## Mental model
This is **checkpointing for compute**. Claude Code's file checkpointing lets you rewind bad
edits; the workflow journal lets you *fast-forward past good work*. Same risk-math shift:
once partial progress is recoverable, mid-run failures (rate limits, spend caps, a killed
session, an edited script) stop being catastrophic, so you can take on bigger, more
destructive multi-surface tasks in one orchestrated run. It's the same idea as Temporal/
durable-execution engines in distributed systems — event-source the step results, replay on
restart — built into the harness.

## How to apply (in practice / consulting)
- **Default destructive multi-surface work to one scripted workflow**, not N ad-hoc agents
  — migrations, feature removals, repo-wide rewrites. The journal is the rollback-free
  safety story you can give a client: "if anything dies mid-run, we resume, we don't redo."
- **Iterate on workflows cheaply**: edit the persisted script file and resume — every
  agent *before* your edit returns from cache, so debugging stage 3 doesn't re-bill stages
  1–2. (Prefix rule: the first changed call and everything after it re-runs.)
- **Keep prompts deterministic** (no timestamps/randomness inline; thread them through
  `args`) or you silently forfeit the cache.
- **Make removal agents idempotent-aware**: instruct them to verify-before-redo (grep what
  already happened in the worktree), so a resumed run converges instead of double-editing.

## Connections
*Typed links — mirrored from the `connections:` frontmatter above.*
- **builds-on** → [Dynamic Workflows & the Ultraplan loop](dynamic-workflows-and-ultraplan.md) — the journal records the results of the primitives that note explains.
- **used-with** → [Six dynamic-workflow patterns](dynamic-workflow-patterns.md) — durability is the unlisted seventh reason to script the fan-out: every shape becomes restartable.
- **builds-on** → [One shared context vs. many isolated contexts](execution-context-isolation.md) — replay is only valid because each agent's (prompt, opts) fully determine its work.
- **used-with** → [Worktree base ref: fresh vs head](worktree-base-ref-fresh-vs-head.md) — journal preserves compute, worktree preserves file state; resume reunites both.
