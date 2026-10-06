---
title: Close each cycle with a fresh live round — it finds what your fixes broke
slug: fresh-live-round
kind: concept
spine_layer: patterns
tags: [evals, regression, error-analysis, flywheel]
connections:
  - { to: fixes-can-overreach, type: builds-on, why: "Replays catch one fix's side effects; only a fresh round catches what all the fixes do together." }
  - { to: frozen-replay, type: contrasts-with, why: "Replays prove each fix in isolation on old data; the fresh round re-tests everything at once on today's real data." }
  - { to: error-analysis-on-traces, type: used-with, why: "The fresh round is a saturation check: file every failure under an existing type, or mark it NEW." }
  - { to: production-to-eval-flywheel, type: part-of, why: "It's the turn of the flywheel that closes one cycle and seeds the next." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PR #334)", retrieved: 2026-10-06 }
date: 2026-10-06
depth: seedling
claude_specific: false
---

# Close each cycle with a fresh live round — it finds what your fixes broke

## TL;DR
Frozen replays prove each fix on its own. But fixes interact, and the world has moved on. So close every
cycle with a **fresh live run of the whole set**, graded blind, and file each failure under an existing
failure type — or mark it **NEW**. New types are the failures your fixes created.

## The idea, simply
1. After all the fixes, run **every scenario again, live**, on today's data.
2. Grade blind, with the same judge.
3. For every failure, ask: *is this an existing type, or something new?*
4. Check the types you fixed at the source: they should be at zero.
5. Treat each **new** type as the start of the next cycle.

**Everyday analogy:** after a renovation, you walk through the whole house — not just the rooms you touched.
The new kitchen works, but now the hallway light trips the breaker.

## Real example
Tide's round 2, after every fix: **54 of 100** passed, up from 47. Underneath the net gain, 22 answers went
fail → pass and 15 went pass → fail. Four failure types fixed at the source dropped to **zero**. But **two new
types appeared**, both created by the fixes: the Coach leaking notes to itself ("wait, that response was for a
different scenario"), and over-caution — subtracting a card payment the safe-to-spend window already held back,
a side effect of a new card rule combined with an engine change. A code check caught a third: internal field
names leaking into answers, because a new rule quoted them. Grading also found a product bug: one paycheck
counted twice by the income detector.

## Mental model / why it matters
Replays answer *"did this fix work?"* The fresh round answers *"is the system better now?"* — a different
question, because fixes interact and data changes. It's also a saturation check: if a fresh round finds no new
types, your failure map is complete for now; if it finds some, the next cycle has its agenda.

## How to apply (in practice / consulting)
- Budget a fresh full live round at the end of every improvement cycle, not just targeted re-runs.
- Report it as "fail → pass" and "pass → fail", plus new types, never only the total.
- Run the free code checks over the fresh round too; they catch regressions the judge doesn't look for.

## Provenance & caveats
From tide `evals/LIFECYCLE.md` phase 4c at `a3ed538` (round 2, 2026-10-04): 54/100 vs 47; 22 F→P, 15 P→F;
types 1, 3, 4 and 14 at zero; new types 15 and 16; the field-name leak caught by a code check; the
double-counted paycheck fixed as safe-to-spend v5.7. Real amounts withheld per tide's privacy rule.

## Connections
- **builds-on [A fix can overreach](fixes-can-overreach.md)**: from one fix's side effects to all of them together.
- **contrasts-with [Frozen replay](frozen-replay.md)**: isolated proof vs the whole system today.
- **used-with [Error analysis on traces](error-analysis-on-traces.md)**: existing type, or NEW?
- **part-of [The production-to-eval flywheel](production-to-eval-flywheel.md)**: the turn that closes a cycle.
