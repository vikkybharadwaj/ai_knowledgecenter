---
title: Claude Code (the harness)
slug: claude-code
kind: system
layer: claude-code
summary: Anthropic's finished agent harness for software work — a polished, opinionated bundle of tools, memory, subagents, and permissions built on the Agent SDK. The "use it as-is" tier of the stack.
edges:
  - { to: agent-sdk, type: runs-on, why: "Claude Code is built on the same engine the SDK exposes." }
sources: [claude-code-architecture]
---
Everything below in this lane — CLAUDE.md, skills, subagents, worktrees, hooks — is a primitive Claude Code ships. Learn them as the standard parts catalogue of a production agent.
