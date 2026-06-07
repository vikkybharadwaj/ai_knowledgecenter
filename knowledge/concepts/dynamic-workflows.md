---
title: Dynamic Workflows / Ultraplan
slug: dynamic-workflows
kind: primitive
layer: claude-code
summary: Scripted orchestration that fans work across many subagents deterministically — loops, parallel stages, and verify steps the model can't drift from. The control plane for comprehensive, large-scale agent work.
edges:
  - { to: claude-code, type: part-of, why: "Workflows are a Claude Code orchestration capability." }
  - { to: cc-subagents, type: uses, why: "A workflow pipelines work across many subagents." }
  - { to: plan-mode, type: uses, why: "The ultraplan loop plans before fanning out execution." }
sources: [dynamic-workflows-and-ultraplan, dynamic-workflow-patterns]
---
This is where determinism meets fan-out: the script decides what runs in parallel, what verifies, and what synthesizes, so scale doesn't mean chaos.
