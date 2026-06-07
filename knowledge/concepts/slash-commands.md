---
title: Slash commands
slug: slash-commands
kind: primitive
layer: claude-code
summary: Named, user-triggered actions typed as /command — the explicit, deliberate counterpart to auto-firing skills. The right home for side-effecting rituals like deploy or ship that should only run when you ask.
edges:
  - { to: claude-code, type: part-of, why: "Slash commands are a Claude Code invocation surface." }
sources: [claude-code-architecture]
---
Rule of thumb: a reusable capability is a skill (it auto-fires and is invokable); a deliberate, side-effecting ritual is a command (it only runs on demand). One system, no duplication.
