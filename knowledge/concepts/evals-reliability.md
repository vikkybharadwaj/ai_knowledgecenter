---
title: Evals & Reliability
slug: evals-reliability
kind: concept
layer: foundations
summary: Measuring whether the agent actually works — failure-mode analysis, fixtures, and graded runs — so improvements are real and regressions are caught. Reliability is engineered and measured, not hoped for.
edges:
  - { to: harness-engineering, type: depends-on, why: "You harden the harness against the failure modes evals expose." }
sources: [harness-engineering-discipline, offline-vs-online-evals, evals-test-judgment, freeze-everything-the-model-sees, dont-copy-derive, crashed-is-not-failed, one-run-is-a-sample, word-checks-cant-read-meaning, three-kinds-of-grader, safety-alarm-false-alarms, dimensions-vs-slices, sort-before-you-count]
---
Without evals you are tuning prompts in the dark. They turn "it feels better" into a number, and they tell the harness which failure modes are worth a deterministic guard. Two halves make it work: **offline** evals run the real agent against a frozen world (known answers, catch regressions), and **online** evals grade sampled production traffic against a rubric. A flywheel turns flagged production failures into new frozen fixtures. Before any score counts, check that the run measured something and that the change beats run-to-run noise. The whole track is the [Evals map](../maps/evals.md).
