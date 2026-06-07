---
title: Permission modes
slug: permission-modes
kind: primitive
layer: claude-code
summary: How much Claude Code can do without asking — from prompt-on-everything to accept-edits to full autonomy. The dial you set to match trust against task risk.
edges:
  - { to: claude-code, type: part-of, why: "Permission modes are a Claude Code safety control." }
  - { to: sdk-permissions, type: runs-on, why: "They surface the SDK's permission/auth model in the product." }
sources: [claude-code-architecture]
---
Turn the dial up for safe, repetitive work and down for anything irreversible. A denied action is feedback, not a wall — adjust the approach rather than retrying verbatim.
