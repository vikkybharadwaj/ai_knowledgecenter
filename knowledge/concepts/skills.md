---
title: Skills
slug: skills
kind: primitive
layer: claude-code
summary: Packaged, model-invocable capabilities — a folder with instructions (and optional scripts) the agent loads when a task matches. Reusable expertise that auto-fires when relevant and can also be called as a slash command.
edges:
  - { to: claude-code, type: part-of, why: "Skills are a Claude Code extension mechanism." }
  - { to: claude-md, type: used-with, why: "Complement to CLAUDE.md — a skill's body loads only when used, vs CLAUDE.md which is always in context. Often you graduate a grown CLAUDE.md procedure into a skill." }
sources: [claude-code-architecture, tool-call-taxonomy]
---
A skill is how you teach the harness a repeatable procedure once and have it apply itself thereafter. The same definition both auto-fires and is invokable by name. Only `SKILL.md` is required, and a skill is independent of CLAUDE.md — reach for a skill when a section of CLAUDE.md has grown from a *fact* into a *procedure*.
