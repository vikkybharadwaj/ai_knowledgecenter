---
title: Frozen replay
slug: frozen-replay
kind: pattern
layer: patterns
summary: Recording a live agent run — each question, its moment, and every tool call with its exact output — then re-asking the same questions under a changed prompt or model, with the clock pinned and every tool call answered from the recording. Only the change differs, so a before/after is a fair experiment.
edges:
  - { to: evals-reliability, type: part-of, why: "It's how the eval practice proves a fix when live data won't sit still." }
  - { to: tool-use, type: depends-on, why: "Replay works at the tool-call seam: recorded tool results answer the replayed tool calls." }
  - { to: llm-as-judge, type: used-with, why: "A frozen world needs a frozen, blind judge grading both sides." }
sources: [frozen-replay, same-judge-blind-grading, fix-the-layer-it-lives-in, eval-lifecycle]
---
Use it for prompt and model changes. It can't prove tool, data or engine fixes (the recording holds the old outputs) — those need a live re-run. Tool calls on replay match exactly, approximately (flagged), or go off-script (a clear error, never invented data).
