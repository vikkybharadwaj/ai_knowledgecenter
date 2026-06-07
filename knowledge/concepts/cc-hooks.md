---
title: Hooks (Claude Code)
slug: cc-hooks
kind: primitive
layer: claude-code
summary: User-defined handlers — shell commands, HTTP endpoints, or LLM prompts — that Claude Code fires automatically at lifecycle points (before a tool call, after an edit, on stop). How you enforce policy (format, lint, block a path) the agent can't skip, because it isn't the model's choice.
edges:
  - { to: claude-code, type: part-of, why: "Hooks are a Claude Code automation surface configured in settings." }
sources: [claude-code-architecture]
---
If you find yourself reminding the agent to do the same thing every time, that thing belongs in a hook. The harness executes it; the model can't forget it.
