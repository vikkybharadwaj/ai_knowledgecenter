---
title: Sort your tests onto the map before trusting the count
slug: sort-before-you-count
kind: concept
spine_layer: foundations
tags: [evals, coverage, failure-modes]
connections:
  - { to: dimensions-vs-slices, type: builds-on, why: "That note builds the map; this one is the map put to use — every existing test gets a square, and the empty squares become the backlog." }
  - { to: dont-copy-derive, type: used-with, why: "The labels live inside each test and the dashboard reads them, so there's no second copy of the coverage table to drift." }
  - { to: one-run-is-a-sample, type: used-with, why: "Both are about refusing to read a single number as the truth: one is about noise over time, this one about what the number covers." }
  - { to: offline-vs-online-evals, type: used-with, why: "Re-sorting before re-grading is the controlled-experiment rule applied to the suite itself: change the grouping or the grading, never both at once." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide Stage 4d)", retrieved: 2026-09-20 }
date: 2026-09-20
depth: seedling
claude_specific: false
---

# Sort your tests onto the map before trusting the count

## TL;DR
The number of tests tells you almost nothing about coverage. To know what your tests actually cover, **put
every test into its square on the failure map**. The empty squares and the overloaded ones only show up once
you've done that. And when you change how results are *grouped*, don't change how they're *graded* at the
same time.

## The idea, simply
"We have 81 tests" sounds thorough, but it's only a count. Coverage is a question of *where* those tests are.

**Everyday analogy:** a library with 81 books sounds well stocked. Then you shelve them and find 35
cookbooks, one dictionary and no atlas. The count was fine; the collection wasn't.

How to do it:
1. **Give every test two labels:** its dimension (the type of mistake it's built to catch) and its slice (the
   user's job). If it guards a red line, label that too. When a test could fit two dimensions, use the rule
   from the map: file it under the **first stage where the answer would go wrong**.
2. **Store the labels in the test itself**, not in a spreadsheet beside it. Then the dashboard reads them, a
   new test can't be forgotten, and there's only one copy to keep right.
3. **Make the labels required.** The test runner should refuse to run a test with a missing or unknown label.
   A rule the system enforces beats a rule people have to remember.
4. **Draw the grid** (jobs × dimensions) and read it three ways:
   - **Overloaded squares:** easy-to-write tests pile up in one place.
   - **Empty rows or columns:** whole jobs or mistake types with no tests at all.
   - **Red lines with one test or none:** "must never happen" failures deserve more than a single test.
5. **Write down the close calls** and have the product owner check them. Sorting is judgment, and the rules
   you settle on ("inventing a number is an accuracy failure, not a confidence failure") become part of the
   map.

**Why keep the grades unchanged at first:** if you re-sort the tests *and* rewrite the checks in one step, a
new score could come from either change and you can't tell which. Re-sort first, so the pass/fail results are
identical and only the grouping moves. Rewrite the checks afterwards, as a separate step. It's the
controlled-experiment rule turned on the suite itself: change one variable at a time.

## Real example
Tide's money coach had 81 tests. Sorting them onto the new map showed:
- **Lopsided:** "accurate facts" held **35 of the 81**, while "understands the question" and "fetches the
  right data" had **one test each**, because the old categories had no place for them.
- **A missing job:** **no** test covered "learn a money concept", and only **two** covered "follow up on
  past advice".
- **Thin red lines:** "shares anyone else's financial information", "pushes a purchase under pressure" and
  "misses a shortfall warning" rested on **a single test each**, and nothing tested legal advice
  specifically.

Past runs didn't need re-running. Because each result carries its test's id, the dashboard can look up the
new labels and regroup old results.

## Mental model / why it matters
A test count is a measure of *effort*; the grid is a measure of *coverage*. They come apart because tests get
written where they're easy to write, not where the risk is. Sorting is cheap (it's labelling, not new tests),
it's reversible, and it turns "write more tests" into a ranked list: the empty squares, then the thin red
lines, then the piles you could trim. It also gives you an honest answer to the one question a stakeholder
always asks: *what don't we test?*

## How to apply (in practice / consulting)
- Before adding tests, sort the ones you have. The grid tells you what to write next.
- Put the labels inside each test and have the runner check them.
- Read the grid for piles, gaps and thin red lines, not just for totals.
- Keep a short list of close calls and the rule used for each.
- Change the grouping and the grading in separate steps, so you always know which one moved the numbers.

> **Interview line:** "Test count isn't coverage. I tag every test with the mistake type and the user job,
> draw the grid, and look for empty squares and thin red lines. And I re-sort before I re-grade, so I always
> know which change moved the numbers."

## Provenance & caveats
Checked on 2026-09-20 against the tide repo by a separate fact-check pass (tide PR #247 shipped the labels + dashboard):
- ✅ 81 fixtures. Sorted onto the map: accurate_facts 35, useful_timely 19, safety 10, honest_confidence 8, tone_style 7, fetches_right_data 1, understands_question 1.
- ✅ Jobs: `learn_concept` 0, `follow_up` 2 (the largest is "what's coming" at 24).
- ✅ Thin red lines: "shares anyone else's financial information", "pushes a purchase under pressure" and "misses a shortfall warning" have one fixture each. Legal advice has no fixture of its own (the two tests on that red line are about investment advice; tax appears only inside a prompt-injection test).
- ✅ Labels live in the fixture files and the runner hard-validates them: `evals/scripts/run_suite.ts` throws before any API call if a `map_dimension`/`job`/`red_line` is missing or unknown, and writes no results file.
- ✅ Past runs were not re-run: the dashboard resolves each result's fixture id to its current labels (`evals/scripts/generate_dashboard.ts`).
- ⚠️ Still to come in Tide (so don't read them as done): moving grading and the gate off the legacy dimensions, and rewriting the word checks into intent-based judge questions.

## Connections
- **builds-on [Dimensions vs slices](dimensions-vs-slices.md)**: this is that map put to use.
- **used-with [Don't copy, derive](dont-copy-derive.md)**: labels live in the test; the dashboard derives the grid.
- **used-with [One run is a sample](one-run-is-a-sample.md)**: two different ways a single number misleads.
- **used-with [An offline eval is a controlled experiment](offline-vs-online-evals.md)**: change one variable at a time, including when you change the suite.
