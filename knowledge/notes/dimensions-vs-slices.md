---
title: Dimensions vs slices — how to build a failure map
slug: dimensions-vs-slices
kind: concept
spine_layer: foundations
tags: [evals, coverage, failure-modes]
connections:
  - { to: whose-fault-is-the-failure, type: enables, why: "Once every test has a place on the map, the next question is whether each failing test can be believed." }
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

These are the steps Tide actually followed, in order.

**Step 1: start from the product, not the tests.** Three sources, never your existing tests (that's circular:
it can only confirm what you already have):
- the **jobs** people bring to the AI ("can I afford this?", "where did my money go?", "I'm stressed"), ranked
  by how often they're asked × how much it hurts to get them wrong (an estimate until real usage exists);
- the AI's **own instructions** — every rule is a promise, and every promise can be broken;
- **failures you've actually seen**.

**Step 2: find the stages every answer goes through.** For an assistant that looks things up:

> understand the question → fetch the right data → get the facts right → be honest about certainty →
> say what matters → say it well → stay safe

File each failure under the **first stage where it went wrong**. Every failure lands in exactly one place (no
overlaps) and every answer passes through all the stages (no gaps) — **MECE**: mutually exclusive,
collectively exhaustive. Where two stages touch, write a **boundary rule** (Tide's: a wrong or unsupported
fact *from the data* is "accurate facts"; right facts with the wrong emphasis or a missing point is
"useful and timely").

**Step 3: give every test two labels.** Its **dimension** (the stage — what you score) and its **job** (the
slice — how you cut results and check coverage). Together they form a grid: scores by dimension answer
*"what kind of mistakes does the AI make?"*; the grid by job answers *"where are my tests thin?"*

**Step 4: pick the right grader for each stage.** A code check on *which* lookup was made and *with which
inputs* for "fetches the right data"; "every figure must appear in the fetched data" for "accurate facts";
a judge shown the data's confidence fields for "honest confidence"; judges for usefulness and tone, with
code checks for hard format rules; a judge that asks about **intent** ("did it *recommend*…?") for safety.

**Step 5: decide how strict to be.** Three levels: 🔴 **must never happen**, 🟠 serious, 🟢 quality.
- The 🔴 ones are **red lines**. They are *not* a third axis: each is a failure at some stage that no
  otherwise-good answer excuses. Take them from the AI's own non-negotiable rules, plus explicit product
  decisions.
- The gate is **"any red-line test fails"**, not "the safety score dropped" — red lines span several stages.
- A red-line failure blocks a release **only once a person confirms it's real**, until the checks behind it
  are proven (false alarms are common).
- Set the 🟠/🟢 pass-rate bars only **after** a multi-run baseline, because one run is noise.

**Step 6: test the map against real failures.** Every real mistake should land in exactly one square — if one
fits two, sharpen a boundary; if one fits none, the map is missing something. And **separate "the AI
failed" from "the test failed" before counting anything.**

**Step 7: use the grid to generate the tests.** Combine job × stage (× persona × single- or multi-turn) into
scenarios, so coverage comes from the grid rather than whatever questions come to mind — and make sure
**every red line gets several tests**.

**Inherited a suite instead?** Sort every existing test onto the grid before writing new ones: put the labels
*inside* each test, have the runner refuse a test with a missing label, then read the grid three ways —
**piles** (easy tests heaped in one square), **gaps** (whole jobs or stages with no tests) and **thin red lines**
(a must-never-happen with one test or none). Tide's old suite: "accurate facts" held 35 of 81 tests, two stages
had one test each, one job had none, and three red lines rested on a single test. And **re-sort before you
re-grade** — change the grouping and the grading in separate steps, so you know which one moved the numbers.

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

The redesign (September 2026): **7 dimensions** (one per stage), **10 job tags**, and **10 red lines** —
seven restate rules the coach's own instructions call non-negotiable (never make up a money number, never
push a purchase under pressure, never encourage payday loans…) and three were added by product decision
(missing crisis help, a false all-clear on a shortfall, a guessed payday stated as fact). They span four
stages, which is why the gate is "any red-line test fails". Checking the map against real failures: of the
12 failures examined, 5 were the test's fault (a picky word check, a frozen-date bug, a misleading example
shown to the judge), not the AI's.

Then (October 2026) the map became the **generator**: the rebuilt suite's **100 real-data scenarios** were
built from job × stage × persona × shape, and **32 of them probe a red line** — every red line now has 2–5
tests, where the old suite had several with only one. In round 1, 10 of those 32 failed; under the rule, a person
must confirm each one before it can block a release.

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
- ✅ (updated 2026-10-06, tide main `a3ed538`) **Red lines are live in the rebuilt suite:** `evals/taxonomy.ts` defines the 10 (and says a failed red-line test "blocks a release once a person confirms the failure is real"); `evals/scenarios/round-1.json` tags 32 of 100 scenarios with one (each red line 2–5); `evals/labels/round-1.json` records 10 of those 32 as failing. Red line sources (7 from the prompt's non-negotiables, 3 by PM decision) and the four-stage span are from `docs/EVALS_STRATEGY.md` §2.5; the boundary rule from §2.1; per-stage graders from §2.3; strictness levels from §2.4; scenario dimensions from `evals/scenarios/build_round1.py` and `evals/LIFECYCLE.md` (Phase 1, PR #317).
- ⚠️ No automatic release gate runs yet: switching on the scheduled suite and certifying the per-type judges are on tide's backlog (F4.6–F4.12). On the archived scripted suite, the gate stayed keyed to the legacy `safety` dimension and was never moved onto red lines.
- ❌ Corrected from the draft: the "$847 invented charge" is the strategy doc's *hypothetical* illustration. The real $847 is a genuine anomaly the Coach is supposed to flag (`anomaly-001`); the observed fabrication failures are `anomaly-002`/`anomaly-006`.
- ⚠️ "About half the failures were the test's fault" is the repo's own wording; the concrete figure behind it is 5 of 12 examined (≈42%).
- ⚠️ "Lost track of the conversation" had no dimension at all; "fetches the right data" had none *of its own* (folded into accuracy).
- ✅ (2026-10-06) Absorbed the former lesson *sort before you count*: inherited-suite sorting, labels in the test, piles/gaps/thin red lines, 35 of 81 (tide PR #247).

## Connections
- **enables [When a test fails, find out whose fault it is](whose-fault-is-the-failure.md)**: placed on the map, then audited.
- **builds-on [Evals test judgment; unit tests test math](evals-test-judgment.md)**: the stages generalize the three-link chain.
- **used-with [Three kinds of grader](three-kinds-of-grader.md)**: a dimension is only real if a grader can see it.
- **used-with [A safety alarm is only as good as its checks](safety-alarm-false-alarms.md)**: red lines are the zero-tolerance squares.
