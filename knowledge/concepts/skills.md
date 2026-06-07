---
title: Skills
slug: skills
kind: primitive
layer: claude-code
summary: Packaged, model-invocable capabilities — a folder with instructions (and optional scripts) the agent loads when a task matches. Reusable expertise that auto-fires when relevant and can also be called as a slash command.
edges:
  - { to: claude-code, type: part-of, why: "Skills are a Claude Code extension mechanism." }
  - { to: claude-md, type: depends-on, why: "Skills extend the same progressive-disclosure idea — load detail only when needed." }
sources: [claude-code-architecture]
---
A skill is how you teach the harness a repeatable procedure once and have it apply itself thereafter. The same definition both auto-fires and is invokable by name.
