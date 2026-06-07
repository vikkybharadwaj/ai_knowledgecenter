---
title: CLAUDE.md (progressive disclosure)
slug: claude-md
kind: primitive
layer: claude-code
summary: The project memory file Claude Code loads as standing context — instructions, conventions, and facts the agent should always know. Structured by progressive disclosure so it stays small and the agent pulls detail on demand.
edges:
  - { to: claude-code, type: part-of, why: "CLAUDE.md is Claude Code's built-in memory surface." }
  - { to: context-engineering, type: uses, why: "It is context engineering applied to a single durable file." }
sources: [progressive-disclosure-instructions, claude-code-architecture]
---
One giant instruction file fails — the agent drowns. The win is layering: a lean always-loaded core that points to deeper docs the agent reads only when relevant.
