---
title: CLAUDE.md (progressive disclosure)
slug: claude-md
kind: primitive
layer: claude-code
summary: The project memory file Claude Code loads as standing context — instructions, conventions, and facts the agent should always know. It loads in full every session, so you keep it lean (~200-line target) and offload depth to path-scoped rules and skills that load on demand.
edges:
  - { to: claude-code, type: part-of, why: "CLAUDE.md is Claude Code's built-in memory surface." }
  - { to: context-engineering, type: uses, why: "It is context engineering applied to a single durable file." }
sources: [progressive-disclosure-instructions, claude-code-architecture]
---
A common misread: CLAUDE.md is **not** progressively disclosed — it (and its imports) load in full at launch regardless of length. Smallness is a discipline, not a mechanism: keep the core lean and push detail into `.claude/rules/` (path-scoped instruction files) and skills (load only when used). Auto-memory then saves cross-session learnings so the file doesn't have to carry everything.
