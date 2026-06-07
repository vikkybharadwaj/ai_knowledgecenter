---
title: Routines (cloud automation)
slug: routines
kind: primitive
layer: claude-code
summary: Scheduled, unattended Claude Code runs in the cloud — a cron for agents that wake on a timetable to do work and report back. How agent capability extends past the moment you're at the keyboard.
edges:
  - { to: claude-code, type: runs-on, why: "A routine is a Claude Code session triggered on a schedule." }
  - { to: dynamic-workflows, type: uses, why: "Routines typically run a workflow unattended." }
sources: [claude-code-routines]
---
Routines turn "do this every morning" into infrastructure. The same harness you drive interactively can run itself on a schedule and surface results when something needs you.
