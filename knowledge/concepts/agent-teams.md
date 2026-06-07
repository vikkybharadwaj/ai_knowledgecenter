---
title: Agent teams
slug: agent-teams
kind: primitive
layer: claude-code
summary: Multiple independent Claude Code sessions that coordinate — they message each other and share a task list, rather than a parent spawning workers that only report back. The "peers collaborating" model, distinct from subagents.
edges:
  - { to: claude-code, type: part-of, why: "Agent teams are a Claude Code coordination feature." }
  - { to: cc-subagents, type: alternative-to, why: "Subagents fork from one session and report back; agent teams are independent sessions that coordinate as peers." }
  - { to: execution-isolation, type: uses, why: "Each team member runs in its own independent context." }
sources: []
---
Reach for subagents when you want delegation (fan out, collect results); reach for agent teams when you want collaboration (independent sessions working a shared task list and talking to each other). Docs: https://code.claude.com/docs/en/agent-teams
