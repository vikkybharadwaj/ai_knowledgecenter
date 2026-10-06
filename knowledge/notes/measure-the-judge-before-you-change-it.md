---
title: Measure the judge before you change it — hold the answers fixed, vary the judge
slug: measure-the-judge-before-you-change-it
kind: concept
spine_layer: patterns
tags: [evals, llm-as-judge, graders]
connections:
  - { to: aligning-an-llm-judge, type: builds-on, why: "Alignment says to measure the judge against human labels; this is how to run controlled experiments on it." }
  - { to: frozen-replay, type: used-with, why: "Same trick on the other side: replay freezes the inputs to test the agent; this freezes the answers to test the judge." }
  - { to: one-run-is-a-sample, type: used-with, why: "A judge is random too — re-running the same prompt on the same answers moved its score, so every variant needs repeats." }
  - { to: three-kinds-of-grader, type: used-with, why: "Every grader is blind to something; this is how you find out what, before you trust a change to it." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach evals (tide strategy doc §2.10)", retrieved: 2026-10-06 }
date: 2026-10-06
depth: seedling
claude_specific: false
---

# Measure the judge before you change it — hold the answers fixed, vary the judge

## TL;DR
To improve an AI judge, **freeze the answers and change only the judge**. Grade a set of recorded answers by
hand, then re-grade those same answers under each judge variant, **several times each**, and compare against
your grades. Any difference is the judge's. Tide's surprise: the one change that improved both catching
problems *and* avoiding false alarms was **removing context** — the judge's shared examples.

## The idea, simply
1. **Grade a set of recorded answers yourself**, over-sampling the cases where the judge and the rule checks
   disagree (that's where the judge is most likely wrong).
2. **Hold the answers constant.** Re-grade them under each judge prompt you want to try.
3. **Run every variant several times.** The judge isn't deterministic: re-running the *current* prompt moved the
   score by one or two items.
4. **Compare two numbers, not one:** real problems caught, and false alarms on good answers.

**Everyday analogy:** calibrating a bathroom scale. You weigh the same known weights again and again, and only
change the scale's settings between tries. If you also changed the weights, you'd learn nothing.

## Real example
34 recorded answers, graded by hand; every variant run three times:

| Judge prompt | Agreed with the human | Real problems caught | False alarms |
|---|---|---|---|
| As it ran before | 27–29 of 34 | 5–6 of 9 | 2–3 of 25 |
| **Without its shared examples** | **29–30 of 34** | **7 of 9** | **2–3 of 25** |
| Shown the account data | 26–28 of 34 | 6–7 of 9 | 4–5 of 25 |
| Must quote evidence for every clause | 21–22 of 34 | 8–9 of 9 | 12 of 25 |

**Why removing context helped:** the shared pass/fail examples anchored the judge to one shape of answer. A test
whose criteria asked for the opposite — state a known payday plainly instead of hedging — failed every run,
because the confident answer looked like the shared FAIL example. **A prompt that contradicts its own examples
loses to the examples.**

**Why "quote the evidence" over-fired:** the criteria mixed what's *required* with what's merely nice ("ideally
it also…"), and a strict reader treated every clause as mandatory. The fix is in the criteria: separate what a
criterion requires from what it rewards.

## Mental model / why it matters
A judge is an instrument, and you change an instrument the way you'd run any experiment: one variable at a time,
on fixed inputs, with repeats. Otherwise a "better" judge is just a different mood on different answers. And the
most valuable result is often negative: context that seems helpful (examples, more data) can bias the judge.

## How to apply (in practice / consulting)
- Keep a small hand-graded set of recorded answers as the judge's test bench.
- Report every judge change as "caught X of Y real problems, raised Z false alarms" across repeats.
- Prefer per-test criteria over shared examples, and split required from nice-to-have in every criterion.

## Provenance & caveats
From tide `docs/EVALS_STRATEGY.md` §2.10 at `a3ed538` (judge validation, 2026-09-20, on the archived scripted
suite): 34 hand-graded answers, `npm run judge:experiment`, three passes per variant, the table above, the
adopted change and the two rejected variants. The rebuilt suite's per-type judges are still to be certified on
held-out owner labels (tide backlog F4.7).

## Connections
- **builds-on [Aligning an LLM judge](aligning-an-llm-judge.md)**: from "measure it" to "experiment on it".
- **used-with [Frozen replay](frozen-replay.md)**: freeze the inputs, vary one thing.
- **used-with [One run is a sample](one-run-is-a-sample.md)**: the judge needs repeats too.
- **used-with [Three kinds of grader](three-kinds-of-grader.md)**: find each grader's blind spot before trusting it.
