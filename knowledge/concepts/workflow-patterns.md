---
title: Dynamic-workflow patterns (the six)
slug: workflow-patterns
kind: pattern
layer: patterns
summary: The named, reusable shapes of agent orchestration — pipeline, parallel fan-out, loop-until-dry, judge panel, and friends — each fixing a specific failure mode. A vocabulary for composing reliable multi-agent work.
edges:
  - { to: dynamic-workflows, type: uses, why: "The patterns are implemented on the dynamic-workflow engine." }
  - { to: orchestration, type: uses, why: "Each pattern is a specific orchestration structure." }
sources: [dynamic-workflow-patterns, dynamic-workflows-and-ultraplan]
---
Don't reinvent orchestration each time — reach for the pattern that matches the failure you're trying to prevent (coverage, confidence, or scale). They compose into bigger harnesses.
