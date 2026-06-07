---
title: Execution-context isolation
slug: execution-isolation
kind: concept
layer: claude-code
summary: The choice between one shared context and many isolated ones — what actually forks when you spawn agents. Isolation buys parallelism and a clean slate; sharing buys continuity. Knowing which you have prevents whole classes of bugs.
edges:
  - { to: cc-subagents, type: uses, why: "Each subagent is a forked, isolated context." }
  - { to: worktrees, type: uses, why: "Worktrees isolate the filesystem the way subagents isolate context." }
sources: [execution-context-isolation]
---
A subagent does not see your conversation; a worktree does not see your uncommitted files unless you ask. Most "why didn't it know X" surprises trace back to a boundary you forgot you crossed.
