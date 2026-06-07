---
title: Sandboxing
slug: sandboxing
kind: primitive
layer: claude-code
summary: Run the Bash tool inside a restricted sandbox with filesystem and network limits, so shell commands can't reach beyond what you allow. The enforcement substrate that makes higher autonomy safe.
edges:
  - { to: claude-code, type: part-of, why: "Sandboxing is a Claude Code execution-safety feature." }
  - { to: permission-modes, type: used-with, why: "Permission modes decide what's allowed; the sandbox enforces the blast radius when it runs." }
sources: []
---
Permissions answer "may the agent do this?"; the sandbox answers "and how much damage can it do if it does?" Together they let you grant more autonomy with a bounded blast radius. Docs: https://code.claude.com/docs/en/sandboxing
