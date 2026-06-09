---
title: Loop Engineering
slug: loop-engineering
kind: pattern
layer: patterns
summary: Stop prompting the agent turn-by-turn; design a system that finds the work, hands it out, checks it, records what's done, and decides the next thing — then let it poke the agent instead of you. It's the harness put on a timer that feeds itself, built from five Claude Code blocks (scheduling, worktrees, skills, plugins+MCP, subagents) plus an on-disk memory. A 2026 practice/preview, not a settled standard.
edges:
  - { to: harness-engineering, type: depends-on, why: "A loop is the agent harness put on a timer that spawns helpers and feeds itself — it sits one floor above." }
  - { to: repo-as-record, type: depends-on, why: "The loop's memory must live on disk/in the repo because the model forgets everything between runs." }
  - { to: externalized-completion, type: depends-on, why: "An unattended loop is only trustworthy if 'done' is externally verified — what /goal's separate Haiku evaluator does." }
  - { to: cc-subagents, type: uses, why: "Splits the maker from the checker so a verifier the loop trusts decides 'done'." }
  - { to: worktrees, type: uses, why: "Isolates parallel agents so concurrent runs don't collide on the same files." }
  - { to: skills, type: uses, why: "Writes project intent down once so the loop doesn't re-derive it from zero every cycle." }
  - { to: cc-mcp-servers, type: uses, why: "MCP servers (the source's 'connectors') let the loop act in real tools — open PRs, update tickets, post to Slack." }
  - { to: cc-hooks, type: uses, why: "Lifecycle hooks plus /loop and /goal give the loop its scheduled heartbeat." }
sources: [designing-loops-not-prompts]
---
The leverage point moved: the highest-value thing is now designing the loop, not writing each turn. The same five pieces ship in both Claude Code and Codex, so the shape outlives any one tool. But the loop changes the work, it doesn't delete you from it — verification, comprehension debt, and cognitive surrender all get *sharper* as the loop improves. Build the loop; stay the engineer.
