---
title: Evals — the running index
slug: evals
kind: map
spine: false
date: 2026-09-18
---

# Evals — the running index 🧪

> **The question this section answers:** *how do you know an AI product actually works?* Quality isn't a
> feeling; it's a measurement. But the measurement is a machine too, and it can break, drift and lie.
> Every lesson here was learned rebuilding a real eval system (the Tide money coach, tide PR #234,
> September 2026). Each one is **one idea, in plain words, with one real example**.
> The visual hub is `docs/concepts/evals.html`; this file is its running index.

## Where it sits on the spine
Evals live on **Foundations** and **Agent Patterns**. They're the measuring half of harness engineering:
[Harness engineering](../notes/harness-engineering-discipline.md) says reliability is built outside the
model, and evals are how you find out whether it worked. On the concept graph they back two nodes:
**Evals & Reliability** (the practice) and **LLM-as-judge** (the grader pattern, new with this section).

## Read in this order

### 1 · Set up a fair experiment
*An eval is a controlled experiment: the agent is real, the world is frozen.*
1. [An offline eval is a controlled experiment](../notes/offline-vs-online-evals.md) — test with frozen data before release, check real conversations after, and use the flywheel to turn real failures into new tests.
2. [Evals test judgment; unit tests test math](../notes/evals-test-judgment.md) — the three-link chain (right tool → right numbers → numbers used right), and why the last link is the one money apps forget.
3. [Freeze everything the model can see](../notes/freeze-everything-the-model-sees.md) — the data, the date, the whole conversation, the limits.
4. [Don't copy, derive](../notes/dont-copy-derive.md) — every copied fact is a scheduled silent failure.

### 2 · Make sure the number means something
*First "did we measure anything?", then "is this bigger than the noise?", and only then "how good was it?"*

5. [A test that crashed is not a test that failed](../notes/crashed-is-not-failed.md) — broken runs get labelled, not scored.
6. [One run is a sample, not a measurement](../notes/one-run-is-a-sample.md) — measure the noise floor before trusting a change.

### 3 · Grade the answer properly
*Every grader is blind to something.*

7. [Word checks can't read meaning](../notes/word-checks-cant-read-meaning.md) — the spam-filter problem.
8. [Three kinds of grader, and what each one can't see](../notes/three-kinds-of-grader.md) — word checks, an AI judge, similarity to a perfect answer.
9. [A safety alarm is only as good as its checks](../notes/safety-alarm-false-alarms.md) — a zero-tolerance gate built on bad checks blocks releases at random, and buries the real finding in the noise.

### 4 · Know what your tests don't cover
*A pass rate can only speak for the failures you thought to test.*

10. [Dimensions vs slices — how to build a failure map](../notes/dimensions-vs-slices.md) — dimensions are the *type* of mistake (what you grade); slices are the *situation* (how you cut the results). Build dimensions from the stages of an answer so every failure lands in exactly one place.
11. [Sort your tests onto the map before trusting the count](../notes/sort-before-you-count.md) — "81 tests" isn't coverage. Label every test, draw the grid, and read the piles, the gaps and the thin red lines. Re-sort before you re-grade.

## How the lessons connect (the big picture in one paragraph)
Freezing the world (1, 3) is what makes a right answer knowable, and copied facts (4) are how the frozen
world quietly unfreezes. A frozen world still gives noisy scores, because the model rewords every run (6),
and a crashed harness can impersonate a terrible model (5). So a score needs a validity check and a noise
floor before it means anything. Then grading: word checks see words, not meaning (7). The AI judge reads
meaning but only what it's shown, and the reference score only knows the perfect answer someone wrote (8).
The chain from data to answer (2) tells you *which* link each grader covers. And the highest-stakes place
all of this goes wrong is the safety gate (9). All of that grades the tests you happen to have, which is why
the last step is coverage: build a map of every way the AI can fail (10), then sort your tests onto it (11)
and read the empty squares. That closes the loop back to the start, because the gaps the map finds are the
next fixtures the flywheel should freeze.

## Next up (the backlog for this section)
- [x] ~~**Defining "complete" with a failure-mode map**~~: landed as [dimensions vs slices](../notes/dimensions-vs-slices.md) (Tide Stage 4c) and [sort before you count](../notes/sort-before-you-count.md) (step 4d part 1).
- [ ] **Auditing the answer keys**: how to tell "the AI failed" from "the test failed", and fix the keys (Tide Stage 4d, parts 2–3).
- [ ] **Calibrating an LLM judge against humans**: measuring judge–human agreement before trusting the judge.
- [ ] **Eval & observability tooling**: Langfuse / LangSmith / Braintrust / Arize, from the [consulting map](building-ai-stacks.md) backlog.
