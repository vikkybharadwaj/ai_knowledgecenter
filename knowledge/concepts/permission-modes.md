---
title: Permission modes
slug: permission-modes
kind: primitive
layer: claude-code
summary: How much Claude Code can do without asking. Six modes — default (reads only), acceptEdits, plan, auto (preview), dontAsk (pre-approved tools only), and bypassPermissions (everything) — the dial you set to match trust against task risk.
edges:
  - { to: claude-code, type: part-of, why: "Permission modes are a Claude Code safety control." }
sources: [claude-code-architecture]
---
Turn the dial up for safe, repetitive work and down for anything irreversible. A denied action is feedback, not a wall — adjust the approach rather than retrying verbatim. Plan mode is itself one of these modes — read-and-propose with no edits.
