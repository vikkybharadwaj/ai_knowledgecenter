---
title: Dimensions vs slices — how to build a failure map
slug: dimensions-vs-slices
kind: concept
spine_layer: foundations
tags: [evals, coverage, failure-modes]
connections:
  - { to: sort-before-you-count, type: enables, why: "The map is the thing you sort tests onto; without it, 'coverage' has no coordinates and a test count is all you have." }
  - { to: evals-test-judgment, type: builds-on, why: "The stages an answer passes through are that note's three-link chain generalized: pick the tool, fetch the data, use the numbers, then say it well." }
  - { to: three-kinds-of-grader, type: used-with, why: "A dimension is only real if some grader can see it — accuracy needs the data in front of the grader, tone needs a judge." }
  - { to: safety-alarm-false-alarms, type: used-with, why: "Red lines are the map's zero-tolerance squares, so they inherit that note's warning: validate the checks before letting them block a release." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide Stage 4c)", retrieved: 2026-09-20 }
date: 2026-09-20
depth: seedling
claude_specific: false
---

# Dimensions vs slices — how to build a failure map

## TL;DR
To know whether your tests are **complete**, you need a map of every way the AI can fail. Build it from two
separate things:
- **Dimensions** — the *type* of mistake. These are what you grade.
- **Slices** — the *situation* it happened in (the user's job). These are how you cut the results.

Keep them apart. Mixing the two is the most common way an eval design goes wrong.

## The idea, simply
A pass rate can only tell you about failures you thought to test. So before trusting any score, you need to
know what "complete" means: **every way the AI can fail.**

**Step 1: start from the product, not the tests.** List the jobs people bring to the AI ("can I afford
this?", "where did my money go?", "I'm stressed"). Read the AI's own instructions: every rule is a promise,
and every promise can be broken. Add failures you've actually seen. Never build the map from your existing
tests, because that's circular: it can only confirm what you already have.

**Step 2: find the stages every answer goes through.** For an assistant that looks things up:

> understand the question → fetch the right data → get the facts right → be honest about certainty →
> say what matters → say it well → stay safe

File each failure under the **first stage where it went wrong**. Now every failure lands in exactly one
place (no overlaps), and every answer passes through all the stages (no gaps). In consulting language
that's **MECE**: mutually exclusive, collectively exhaustive.

**Step 3: use the stages as dimensions and the jobs as slices.** Each test gets two labels, such as
*"accurate facts"* + *"job: spot something unusual"*. Together they form a grid:
- **Scores by dimension** answer *"what kind of mistakes does the AI make?"*
- **The grid by job** answers *"where are my tests thin?"* Empty squares are blind spots.

**Step 4: decide how strict to be.** Some failures must never happen (*red lines*): the target is that a
single one blocks a release. Others must be rare, or just good enough. That's a product decision, not an
engineering one — and see the caveat below about earning that gate before switching it on.

**Step 5: test the map against real failures.** Every real mistake should land in exactly one square. If one
fits two, sharpen a boundary. If one fits none, the map is missing something.

**Everyday analogy:** sorting a closet. "Shirts, pants, shoes" is one kind of category. Adding "blue things"
mixes in a second kind, and now a blue shirt belongs in two places. Sort by *type*, then use *colour* as a
label you can filter by.

## Real example
Tide's money coach had 7 eval dimensions. Five were types of mistake (accuracy, confidence, tone, safety,
usefulness), but two were really *jobs*: "warnings" and "unusual spending". So a fabricated unusual charge
would count as both an unusual-spending failure *and* an accuracy failure, and neither score meant anything
on its own. Meanwhile "lost track of the conversation" had no dimension at all and "looked up the wrong
data" had no dimension of its own (it was folded into accuracy) — which is exactly where real bugs were
hiding.

The redesign: **7 dimensions** (one per stage), **10 job tags**, and **10 red lines**. Checking the map
against real failures also surfaced a rule worth keeping: **separate "the AI failed" from "the test failed"
before counting anything.** Of the 12 failures examined, 5 were the test's fault (a picky word check, a
frozen-date bug, a misleading example shown to the judge), not the AI's.

## Mental model / why it matters
A dimension is an **axis you grade on**; a slice is a **filter you read results through**. One test has one
dimension and one or more slices. If you let a job become a dimension, failures start counting twice, the
per-dimension scores stop meaning anything, and you can't tell whether "unusual spending: 60%" is a *skill*
problem or a *situation* problem. The stages trick is what makes the dimensions MECE, because an answer
really does pass through them in order, so "the first stage that went wrong" is always well defined.

## How to apply (in practice / consulting)
- Write down the AI's jobs and read its instructions **before** looking at your tests.
- Pick one axis for dimensions (types of mistake). Put everything else (jobs, user types, languages) in tags.
- Draw the grid and look for empty squares. Those are where to add tests next.
- Mark the red lines, then make sure the checks behind them are trustworthy before letting them block
  anything.
- Re-rank the jobs once you have real usage data, so the map follows the product rather than your guesses.

> **Interview line:** "Dimensions are what you grade; slices are how you cut the results. Build dimensions
> from the stages of an answer so each failure lands in exactly one place, and use user jobs as slices to
> find coverage gaps."

## Provenance & caveats
Checked on 2026-09-20 against the tide repo by a separate fact-check pass (tide PRs #241 design doc, #242 public map):
- ✅ The old suite had 7 dimensions, two of which were jobs (`alert_precision`, `anomaly_quality`) — `evals/types.ts`, `docs/EVALS_STRATEGY.md §2`.
- ✅ The redesign is 7 stage dimensions, 10 jobs, 10 red lines, and it is **shipped as a design doc, a public page and labels on all 81 fixtures**.
- ⚠️ **Not yet in force:** grading and the release gate still run off the legacy `safety` dimension (`evals/config.ts`, `safety_max_failures: 0`). "One red-line failure blocks the release" is the target design, not current behaviour, and human review is required before a red-line failure blocks anything.
- ❌ Corrected from the draft: the "$847 invented charge" is the strategy doc's *hypothetical* illustration. The real $847 is a genuine anomaly the Coach is supposed to flag (`anomaly-001`); the observed fabrication failures are `anomaly-002`/`anomaly-006`.
- ⚠️ "About half the failures were the test's fault" is the repo's own wording; the concrete figure behind it is 5 of 12 examined (≈42%).
- ⚠️ "Lost track of the conversation" had no dimension at all; "fetches the right data" had none *of its own* (folded into accuracy).

## Connections
- **enables [Sort your tests onto the map before trusting the count](sort-before-you-count.md)**: the map gives coverage its coordinates.
- **builds-on [Evals test judgment; unit tests test math](evals-test-judgment.md)**: the stages generalize the three-link chain.
- **used-with [Three kinds of grader](three-kinds-of-grader.md)**: a dimension is only real if a grader can see it.
- **used-with [A safety alarm is only as good as its checks](safety-alarm-false-alarms.md)**: red lines are the zero-tolerance squares.
