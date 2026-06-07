---
title: Subagents / Task (Claude Code)
slug: cc-subagents
kind: primitive
layer: claude-code
summary: Claude Code's way of delegating a scoped job to a fresh agent with its own context — used for parallel search, isolated edits, and review. The concrete handle you use to fan work out and keep your main context clean.
edges:
  - { to: claude-code, type: part-of, why: "Subagents are a core Claude Code primitive." }
  - { to: sdk-subagents, type: runs-on, why: "They are the SDK subagent capability surfaced in the product." }
sources: [claude-code-multi-agent-development, execution-context-isolation]
---
Delegate the noisy work — broad greps, log trawls — to a subagent and keep only its findings. This is how a single session takes on tasks too big for one context.
