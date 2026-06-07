---
title: Checkpointing
slug: checkpointing
kind: primitive
layer: claude-code
summary: Rewind the file changes Claude made — undo back to a prior state when an edit goes wrong. The safety net that lets you run with looser permissions because a bad change is reversible.
edges:
  - { to: claude-code, type: part-of, why: "Checkpointing is a built-in Claude Code safety feature." }
  - { to: permission-modes, type: used-with, why: "Pairs with permission modes — looser autonomy is safer when edits are one rewind away." }
sources: []
---
Checkpointing changes the risk math: if you can rewind, you can let the agent move faster on edits and recover instantly when it overreaches. Docs: https://code.claude.com/docs/en/checkpointing
