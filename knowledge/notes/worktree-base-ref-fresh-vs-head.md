---
title: worktree.baseRef — fresh vs head decides what an agent's worktree branches from
slug: worktree-base-ref-fresh-vs-head
kind: concept
spine_layer: claude-code
tags: [claude-code, worktrees, subagents, isolation, config, git]
connections:
  - { to: claude-code-multi-agent-development, type: used-with, why: "This is the config knob behind the worktree method — it decides whether each isolated worktree starts from published code or your live HEAD." }
  - { to: execution-context-isolation, type: builds-on, why: "Forking is the isolation lever; baseRef sets *which state* the forked worktree forks FROM — clean remote vs. your WIP." }
  - { to: claude-code-architecture, type: part-of, why: "A 'coordinate work' setting in the field guide — it tunes the git substrate that worktree-based parallelism runs on." }
source: { url: null, author: "Claude Code settings (worktree.baseRef)", retrieved: 2026-06-05 }
date: 2026-06-05
depth: seedling
claude_specific: true
---

# worktree.baseRef — `fresh` vs `head`

> **The one question this setting answers:** when Claude Code spins up a new worktree for a
> subagent, *what code does that agent start from* — the clean published branch, or your
> messy in-progress HEAD?

## TL;DR
`worktree.baseRef` controls the base ref new worktrees branch from when subagents/worktrees are
created. **`fresh` (the default)** branches from clean, **published** code — your uncommitted and
unpushed work is invisible to the agent. **`head`** branches from your current **HEAD**, so the
agent sees your in-progress feature branch, including uncommitted/unpushed changes. Default to
`fresh` for safety and reproducibility; switch to `head` only when an agent genuinely needs to
operate on work you haven't pushed yet.

## The two values

| | `fresh` (default) | `head` |
|---|---|---|
| **Branches from** | Clean, published code (remote/base branch) | Your current HEAD |
| **Sees your WIP?** | No — uncommitted & unpushed work is excluded | Yes — includes uncommitted / unpushed changes |
| **Best when** | You want isolation, reproducibility, a clean separation between your WIP and what agents see | The agent must build on your in-progress feature branch / live state |

**Choose `fresh` if:** you want subagents and worktrees working on clean published code; you're
worried unpushed commits could leak into isolation or hurt reproducibility; you want a hard wall
between your WIP and what agents see.

**Choose `head` if:** you need subagents to operate on your in-progress feature branches; you want
worktrees to include uncommitted or unpushed work; you're actively developing and want agents to
see your current state.

## Mental model / why it matters
Worktree-based parallelism is the *isolation* lever — each agent gets its own copy of the repo so
parallel work doesn't collide (see [execution-context-isolation](execution-context-isolation.md) for
*context* isolation, this is its *filesystem/git* sibling). `baseRef` answers the second-order
question that isolation alone doesn't: **isolation *from what state*?** `fresh` makes the fork a
clean-room — every agent starts from the same known-good published baseline, so results are
reproducible and your local mess can't contaminate them. `head` trades that clean room for
*currency* — the agent inherits exactly where you are right now, WIP and all. It's the same trade
the multi-agent gotchas warn about (#3 `.env` files don't auto-carry, #5 clean up worktrees): a
worktree is a *partial snapshot*, and `baseRef` is the dial for how much of your live state it
snapshots.

## How to apply (in practice / consulting)
- **Leave it on `fresh` by default.** For most parallel/feature work, agents should build on
  published code — it keeps runs reproducible and isolates your half-finished work.
- **Flip to `head` deliberately, not habitually.** Use it when you're mid-feature and want an agent
  to extend *this* branch (e.g. "write tests for the function I just wrote but haven't committed").
  Then consider flipping back.
- **Tell clients the reproducibility story.** `fresh` means "every agent saw the same committed
  baseline" — that's the answer when someone asks *why did two agents diverge?* On `head`, divergence
  can come from your moving local state, which is harder to audit.
- **Pair the choice with the worktree hygiene rules:** unpushed work + `head` means agents depend on
  state that lives only on your machine — commit/push if you need that work to survive.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **used-with** → [Claude Code — Multi-Agent Development](claude-code-multi-agent-development.md) — the config knob behind the worktree method.
- **builds-on** → [One shared context vs. many isolated contexts](execution-context-isolation.md) — forking is the lever; `baseRef` sets *which state* you fork from.
- **part-of** → [Claude Code Architecture](claude-code-architecture.md) — a "coordinate work" setting that tunes the git substrate under worktree parallelism.
