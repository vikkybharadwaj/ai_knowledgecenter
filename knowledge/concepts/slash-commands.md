---
title: Slash commands
slug: slash-commands
kind: primitive
layer: claude-code
summary: The /command invoke surface. Custom commands have been merged into skills — `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. A skill that should only run when you ask sets `disable-model-invocation: true`.
edges:
  - { to: skills, type: part-of, why: "Slash commands are how you invoke a skill (or a built-in) by name; custom commands are now skills under the hood." }
sources: [claude-code-architecture]
---
Rule of thumb lives inside skills now: a capability that should auto-fire *and* be invokable is a normal skill; a deliberate, side-effecting ritual (deploy, ship) sets `disable-model-invocation: true` so only `/name` runs it. One system, no duplication.
