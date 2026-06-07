---
title: Dynamic workflows (ultracode)
slug: dynamic-workflows
kind: primitive
layer: claude-code
summary: A JavaScript script that orchestrates subagents at scale — Claude writes the script for the task you describe and a runtime executes it in the background (loops, parallel stages, verify steps it can't drift from). Triggered by the keyword `ultracode`. Research preview.
edges:
  - { to: claude-code, type: part-of, why: "Workflows are a Claude Code orchestration capability." }
  - { to: cc-subagents, type: uses, why: "A workflow pipelines work across many subagents." }
sources: [dynamic-workflows-and-ultraplan, dynamic-workflow-patterns]
---
This is where determinism meets fan-out: the script decides what runs in parallel, what verifies, and what synthesizes, so scale doesn't mean chaos. Note: the trigger keyword is `ultracode` (the always-on form is `/effort ultracode`) — distinct from *ultraplan*, which is a separate cloud plan-mode feature, not this. Docs: https://code.claude.com/docs/en/workflows
