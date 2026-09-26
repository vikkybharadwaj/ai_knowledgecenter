---
title: Align an LLM judge like a classifier — expert labels, three splits, and TPR/TNR, not accuracy
slug: aligning-an-llm-judge
kind: concept
spine_layer: patterns
tags: [evals, llm-as-judge, graders, ground-truth]
connections:
  - { to: three-kinds-of-grader, type: builds-on, why: "That note says the judge is blind to anything it isn't shown; this one is how to measure and fix how often it's wrong." }
  - { to: two-kinds-of-eval-check, type: part-of, why: "The judge is the second kind of check; this is the procedure that makes it trustworthy." }
  - { to: whose-fault-is-the-failure, type: used-with, why: "Tide found a shared few-shot example contradicting a test so the judge failed it every run — exactly the misalignment this procedure catches." }
  - { to: humans-and-automation-in-evals, type: used-with, why: "Ground truth is the human half; the aligned judge is the automated half that scales it." }
source: { url: "https://www.lennysnewsletter.com/p/building-eval-systems-that-improve", author: "Hamel Husain & Shreya Shankar (Lenny's Newsletter; + evals FAQ)", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Align an LLM judge like a classifier — expert labels, three splits, and TPR/TNR, not accuracy

**Your question 5: how do you align an LLM judge, and how does ground truth help?**

## TL;DR
An LLM judge is a **classifier** — it sorts answers into pass and fail — so treat it like one. Get **ground
truth** from one domain expert (a pass/fail verdict **plus a written critique** per example), split those
labels into **train / dev / test**, tune the judge on dev, and measure it once on the untouched test set
using **TPR and TNR** (not accuracy). Ground truth is what turns "the judge seems fine" into "the judge
catches 85% of failures and wrongly flags 4% of good answers".

## The idea, simply
**Step 1 — ground truth from one expert.** Pick a single domain expert (the *benevolent dictator*) to be
the final word on quality — one voice avoids endless disagreements between annotators. For each example
they give:
- a **binary verdict** — pass or fail (not 1–5: nobody agrees on what separates a 3 from a 4), and
- a **critique** detailed enough that a brand-new employee would understand why.

**Step 2 — one judge per failure mode.** The most common mistake is asking one judge to catch many kinds
of error at once. Build a separate, narrow judge for each failure mode.

**Step 3 — split the labels three ways:**

| Split | Share | Used for |
|---|---|---|
| **Train** | ~10–20% | A few clear examples (with critiques) placed **in the judge's prompt** |
| **Dev** | ~40–45% | Run the judge, compare to the labels, read the disagreements, improve the prompt; repeat |
| **Test** | ~40–45% | Untouched until you're done — one final, unbiased measurement |

If the test score is much worse than dev, you **overfit** the prompt to dev: rethink the instructions and
start again with a fresh test set.

**Step 4 — measure with two rates, not one.**
- **TPR (true positive rate)** — of the answers that *should fail*, how many did the judge catch?
- **TNR (true negative rate)** — of the answers that *should pass*, how many did the judge pass?
Accuracy hides problems: if 95% of answers are good, a judge that passes everything is "95% accurate" and
catches nothing. Pick acceptable levels by consequence — catching more failures usually costs more false
alarms, and when failures are rare even a small false-alarm rate floods your review queue.

**Step 5 — use the known error rates.** Once you know how often the judge is wrong, you can statistically
**correct its raw score** to estimate the system's true failure rate.

**Can't get it to agree?** Read a few disagreements by hand before reaching for automated prompt tuning.
Usually the judge is catching too many things at once, or missing context it needs.

**Everyday analogy:** hiring a new grader for exam papers. You don't hand them the stack and hope. You show
them a few marked papers (train), have them mark a practice batch and discuss where you differ (dev), then
check them on a batch neither of you has discussed (test). And you track both "missed a wrong answer" and
"marked a right answer wrong", because those cost different things.

## Mental model / why it matters
Ground truth does **three jobs**: it *teaches* the judge (train), *steers* the prompt (dev), and *certifies*
it (test). Without it, a judge is just another opinion — and an unmeasured opinion inside a dashboard is
worse than none, because people trust the number. This is also why binary labels matter: TPR and TNR only
exist when the verdict is pass/fail.

## How to apply (in practice / consulting)
- Name the benevolent dictator on day one. If nobody can own "what good looks like", no judge will be
  trustworthy.
- Budget roughly **100–200 labelled examples per judge**, and weekly upkeep.
- Report every judge as "TPR x%, TNR y% on n held-out examples". Refuse to ship a judge without it.
- Use a **different model** to judge than the one that produced the answer.

## Provenance & caveats
Sources (retrieved 2026-09-26): Husain & Shankar, *Building eval systems that improve your AI product*
(Lenny's, 2025-09-09) — expert pass/fail + critique, the 10–20 / 40–45 / 40–45 split, TPR/TNR over accuracy,
score correction; FAQ *How do I know if I can trust my automated eval?* (2026-09-19) — splits, overfitting;
FAQ *What should I do when I can't get my LLM judge to agree…?* and *Why binary instead of 1–5?*; Hamel
Husain 2024 — raw agreement misleads on imbalanced data.
- ✅ "Use a different model to evaluate than the model used to generate the evaluated output" — Anthropic's eval guide, platform.claude.com/docs *Define success criteria and build evaluations* (retrieved 2026-09-26).
- ⚠️ The score-correction formula isn't given in the visible sources; captured as the principle only.
- ❓ Split percentages and the 100–200 examples figure are the authors' recommendations.

## Connections
- **builds-on [Three kinds of grader](three-kinds-of-grader.md)**: from "the judge has blind spots" to "measure them".
- **part-of [Two kinds of eval check](two-kinds-of-eval-check.md)**: this is how the judgment kind earns trust.
- **used-with [Whose fault is the failure](whose-fault-is-the-failure.md)**: a misleading few-shot example is misalignment in the wild.
- **used-with [Humans and automation in evals](humans-and-automation-in-evals.md)**: ground truth is the human half.
