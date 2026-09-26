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
> Two halves: **ten mental models** — how evals work, distilled from the best practitioner writing — and
> **12 lessons** learned the hard way rebuilding a real eval system (the Tide money coach,
> September 2026). Each note is **one idea, in plain words, with one real example**.
> The visual hub is `docs/concepts/evals.html`; this file is its running index.

## Where it sits on the spine
Evals live on **Foundations** and **Agent Patterns**. They're the measuring half of harness engineering:
[Harness engineering](../notes/harness-engineering-discipline.md) says reliability is built outside the
model, and evals are how you find out whether it worked. On the concept graph they back three nodes:
**Evals & Reliability** (the practice), **Error analysis** (how you find what to measure) and
**LLM-as-judge** (the grader pattern).

## Ten mental models for evals (start here)
*Distilled from Hamel Husain & Shreya Shankar (evals FAQ + Lenny's Newsletter), Hamel's "Your AI Product Needs
Evals", Parlance Labs' automated-evals study and Aman Khan's PM guide (landed 2026-09-26). Each model is one
note; the Tide lessons below are the same ideas learned the hard way on a real product.*

| # | Mental model | In one line | Note |
|---|---|---|---|
| 1 | An eval is a sensor on one behaviour | A repeatable check of one behaviour; build product evals, not benchmarks | [What is an eval](../notes/what-is-an-eval.md) |
| 2 | Generate scenarios from dimensions, not one prompt | Before launch: dimensions → hand-written tuples → LLM tuples → messages in a separate prompt | [Synthetic scenarios before launch](../notes/synthetic-scenarios-before-launch.md) |
| 3 | Error analysis finds what to measure | After launch: read ~100 traces, note, group into under 10 failure modes, count | [Error analysis on traces](../notes/error-analysis-on-traces.md) |
| 4 | Rule or judgment picks the check | Code check when a rule can decide; LLM judge when it takes judgment | [Two kinds of eval check](../notes/two-kinds-of-eval-check.md) |
| 5 | Code checks test structure, state and behaviour | Scoped per scenario, with pass and fail examples | [Code-check best practices](../notes/code-check-best-practices.md) |
| 6 | A judge is a classifier — certify it | Expert pass/fail + critique → train/dev/test → TPR and TNR | [Aligning an LLM judge](../notes/aligning-an-llm-judge.md) |
| 7 | Split the eval along the system's stages | One call, RAG or agent: evaluate stage by stage; find the first thing that broke | [Evaluate by system shape](../notes/evals-by-system-type.md) |
| 8 | Every metric maps to a real failure | Pass rate per real failure, plus recall@k/MRR, faithfulness, task success, step rates | [Metrics by system shape](../notes/eval-metrics-by-system-type.md) |
| 9 | The suite is a flywheel, not a snapshot | New production failures → CI examples; retire tests that never fail | [The production-to-eval flywheel](../notes/production-to-eval-flywheel.md) |
| 10 | Humans set the standard; automation scales it | Humans discover and decide; never outsource the judging | [Humans and automation](../notes/humans-and-automation-in-evals.md) |

**How the ten connect.** They follow the life of an eval. An eval is a sensor on one behaviour (1). You
find what to point sensors at with generated scenarios before launch (2) and error analysis on real traces
after (3). Each failure mode becomes one check (4): a code check if a rule can decide it (5), an LLM judge if
it takes judgment — certified against expert labels with TPR and TNR (6). The system's shape decides how you
split the checks (7), and every number you watch maps back to a real failure (8). The flywheel keeps the
suite tied to what production is doing (9), and across it all, humans set the standard while automation
scales it (10).

**Where the Tide lessons meet the articles.** Error analysis (3) is what produced Tide's failure map
([dimensions vs slices](../notes/dimensions-vs-slices.md)) and test audit ([whose fault is the
failure](../notes/whose-fault-is-the-failure.md)). The judge-certification procedure (6) would have caught Tide's
shared few-shot example contradicting a test. And beware one word clash: in synthetic data (2) "dimensions"
are axes of *input variation* — what the Tide lesson calls **slices** — not types of mistake.

## The Tide lessons — read in this order

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
12. [When a test fails, find out whose fault it is before you fix anything](../notes/whose-fault-is-the-failure.md) — a failing test isn't evidence until you know whose fault it is. In a real suite 24 failures were the test's and 9 the AI's; the quiet ones are the checks that can't fail.

## How the lessons connect (the big picture in one paragraph)
Freezing the world (1, 3) is what makes a right answer knowable, and copied facts (4) are how the frozen
world quietly unfreezes. A frozen world still gives noisy scores, because the model rewords every run (6),
and a crashed harness can impersonate a terrible model (5). So a score needs a validity check and a noise
floor before it means anything. Then grading: word checks see words, not meaning (7). The AI judge reads
meaning but only what it's shown, and the reference score only knows the perfect answer someone wrote (8).
The chain from data to answer (2) tells you *which* link each grader covers. And the highest-stakes place
all of this goes wrong is the safety gate (9). All of that grades the tests you happen to have, which is why
the last step is coverage: build a map of every way the AI can fail (10), then sort your tests onto it (11)
and read the empty squares, then audit the tests themselves (12) — because a failing test is only evidence once you know whose fault it is. That closes the loop back to the start, because the gaps the map finds are the next fixtures the flywheel should freeze.

## Next up (the backlog for this section)
- [x] ~~**Defining "complete" with a failure-mode map**~~: landed as [dimensions vs slices](../notes/dimensions-vs-slices.md) (Tide Stage 4c) and [sort before you count](../notes/sort-before-you-count.md) (step 4d part 1).
- [x] ~~**Auditing the answer keys**~~: landed as [whose fault is the failure](../notes/whose-fault-is-the-failure.md) (Tide Stage 4d parts 2–3).
- [ ] **Validating the judges against human grades** (Tide Stage 4e, in flight): judge–human agreement, and what removing the shared few-shot examples did to it.
- [ ] **Rewriting the checks** (Stage 4f): turning brittle word checks into intent questions, and moving the release gate onto red lines.
- [ ] **Eval & observability tooling**: Langfuse / LangSmith / Braintrust / Arize, from the [consulting map](building-ai-stacks.md) backlog.
