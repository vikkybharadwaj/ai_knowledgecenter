---
title: Worktrees (worktree.baseRef)
slug: worktrees
kind: primitive
layer: claude-code
summary: Giving an agent its own isolated git worktree so parallel agents edit code without colliding. The baseRef setting (fresh vs head) decides whether that worktree branches from origin or your current HEAD.
edges:
  - { to: claude-code, type: part-of, why: "Worktree isolation is a Claude Code execution feature." }
  - { to: cc-subagents, type: uses, why: "Worktrees are how multiple subagents mutate files in parallel safely." }
sources: [worktree-base-ref-fresh-vs-head, claude-code-multi-agent-development]
---
fresh branches from origin/main for a clean base; head branches from your local work so the agent sees uncommitted changes. Pick wrong and the agent either misses your context or inherits your mess.
