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
> One loop, two kinds of note: **ten mental models** — how evals work, distilled from the best practitioner writing — and
> **17 lessons** learned the hard way rebuilding a real eval system (the Tide money coach,
> September 2026). Each note is **one idea, in plain words, with one real example**.
> The visual hub is `docs/concepts/evals.html`; this file is its running index.

## Where it sits on the spine
Evals live on **Foundations** and **Agent Patterns**. They're the measuring half of harness engineering:
[Harness engineering](../notes/harness-engineering-discipline.md) says reliability is built outside the
model, and evals are how you find out whether it worked. On the concept graph they back three nodes:
**Evals & Reliability** (the practice), **Error analysis** (how you find what to measure) and
**LLM-as-judge** (the grader pattern).

## The loop — one structure, one numbering (start here)
*The same structure and numbers as the hub page (`docs/concepts/evals.html`): each **mental model (M)** and each
**lesson (L)** has one home step in the eval loop, numbered in reading order. The models are distilled from Hamel
Husain & Shreya Shankar (evals FAQ + Lenny's Newsletter), Hamel's "Your AI Product Needs Evals", Parlance Labs'
automated-evals study and Aman Khan's PM guide; the lessons come from rebuilding the Tide money coach's eval
system (September–October 2026). The whole loop as prose: [the eval lifecycle](../notes/eval-lifecycle.md).*

### The foundation

- **M1 · [An eval is a sensor on one behaviour](../notes/what-is-an-eval.md)** — A repeatable check of one behaviour; build product evals, not benchmarks.
- L1 · [An offline eval is a controlled experiment — the agent is real, the world is frozen](../notes/offline-vs-online-evals.md) — test with frozen data before release; check real conversations after.
- L2 · [Evals test judgment; unit tests test math](../notes/evals-test-judgment.md) — unit tests own the math, evals own the judgment — the seam between them is where money apps get hurt.

### Find what to measure

**Step 1 · Write realistic questions from dimensions**
- **M2 · [Generate scenarios from dimensions, not one prompt](../notes/synthetic-scenarios-before-launch.md)** — Before launch: dimensions → hand-written tuples → LLM tuples → messages in a separate prompt.
- L3 · [Dimensions vs slices — how to build a failure map](../notes/dimensions-vs-slices.md) — dimensions are what you grade; slices are how you cut the results.
- L4 · [Sort your tests onto the map before trusting the count](../notes/sort-before-you-count.md) — test count isn't coverage. Sort every test onto the map.

**Step 2 · Run the real system on real data and record everything**
- **M3 · [Split the eval along the system's stages](../notes/evals-by-system-type.md)** — One call, RAG or agent: evaluate stage by stage; find the first thing that broke.
- L5 · [Freeze everything the model can see — including the date and the conversation](../notes/freeze-everything-the-model-sees.md) — freeze every input: the data, the date, the whole conversation, the limits.
- L6 · [Don't copy, derive — two copies of one fact will drift apart](../notes/dont-copy-derive.md) — two copies of one fact drift apart. Derive from one source.

### Grade and group

**Step 3 · A human grades first; a judge only after it agrees on held-out examples**
- **M4 · [A judge is a classifier — certify it](../notes/aligning-an-llm-judge.md)** — Expert pass/fail + critique → train/dev/test → TPR and TNR.
- L7 · [Three kinds of grader, and what each one can't see](../notes/three-kinds-of-grader.md) — word checks, an AI judge, similarity to a perfect answer: what each can't see.
- L8 · [A test that crashed is not a test that failed](../notes/crashed-is-not-failed.md) — a test that crashed isn't a test that failed.

**Step 4 · Group failures by their first upstream cause**
- **M5 · [Error analysis finds what to measure](../notes/error-analysis-on-traces.md)** — Read ~100 traces, note, group into under 10 failure modes, count.
- L9 · [When a test fails, find out whose fault it is before you fix anything](../notes/whose-fault-is-the-failure.md) — a failing test isn't evidence until you know whose fault it is.

### Fix and prove

**Step 5 · Fix the cause in the layer it lives in — prompt, tool, engine or data**
- L10 · [Fix the failure in the layer it lives in — prompts for behaviour, tools and data for facts](../notes/fix-the-layer-it-lives-in.md) — prompts for behaviour; tools and data for facts. *(October rebuild)*

**Step 6 · Prove each fix: frozen replays for prompts, live re-runs for tools; one blind judge on both sides**
- **M6 · [Every metric maps to a real failure](../notes/eval-metrics-by-system-type.md)** — Pass rate per real failure, plus recall@k/MRR, faithfulness, task success, step rates.
- L11 · [Frozen replay — prove a fix when the data won't sit still](../notes/frozen-replay.md) — record a live run, replay it under the change — only the change differs. *(October rebuild)*
- L12 · [Same judge on both sides, blind to which side is which](../notes/same-judge-blind-grading.md) — the same frozen judge on both sides, blind to which side is which. *(October rebuild)*

**Step 7 · Read every changed verdict — a fix can overreach**
- L13 · [One run is a sample, not a measurement](../notes/one-run-is-a-sample.md) — identical runs give different scores. Measure the noise first.
- L14 · [A fix can overreach — read every regression, not just the total](../notes/fixes-can-overreach.md) — the total can rise while new failures hide underneath. Read every regression. *(October rebuild)*

### Automate

**Step 8 · Code checks for the objective, certified judges for judgment calls, a rate with a range**
- **M7 · [Rule or judgment picks the check](../notes/two-kinds-of-eval-check.md)** — Code check when a rule can decide; LLM judge when it takes judgment.
- **M8 · [Code checks test structure, state and behaviour](../notes/code-check-best-practices.md)** — Scoped per scenario, with pass and fail examples.
- L15 · [Word checks can't read meaning (the spam-filter problem)](../notes/word-checks-cant-read-meaning.md) — word-matching checks fail good answers: the spam-filter problem.
- L16 · [A safety alarm is only as good as its checks](../notes/safety-alarm-false-alarms.md) — a zero-tolerance gate is only as good as its checks.
- L17 · [Code checks before judges — for an agent, the trace is the answer key](../notes/code-checks-before-judges.md) — for an agent, the trace is the answer key. *(October rebuild)*

### Then round again

- **M9 · [The suite is a flywheel, not a snapshot](../notes/production-to-eval-flywheel.md)** — New production failures → CI examples; retire tests that never fail.

### Across it all

- **M10 · [Humans set the standard; automation scales it](../notes/humans-and-automation-in-evals.md)** — Humans discover and decide; never outsource the judging.

## How it all connects
An eval is a sensor on one behaviour (M1), and the lessons' first job is to make it a fair experiment: freeze
the world (L1), and keep the math in unit tests while evals test judgment (L2). **Find:** generate scenarios
from dimensions (M2), map what your tests cover (L3, L4), and run the real system — frozen, never copied —
recording every step (M3, L5, L6). **Grade:** a human grades first and a judge is certified before it counts
(M4); every grader is blind to something (L7), and a crashed test isn't a failed one (L8). Error analysis
groups failures by first upstream cause (M5) — and a failing test is only evidence once you know whose fault it
is (L9). **Fix and prove:** fix each cause in the layer it lives in (L10), prove it on frozen replays with one
blind judge (M6, L11, L12), and read every regression, because runs are noisy and fixes overreach (L13, L14).
**Automate:** pick code or judgment per check (M7), write code checks on structure and state (M8) — word checks
can't read meaning (L15), a gate is only as good as its checks (L16), and for an agent the trace is the answer
key (L17). Then round again: the suite is a flywheel, not a snapshot (M9). Across it all, humans set the
standard and automation scales it (M10).

**One word clash to remember.** In synthetic data (M2) "dimensions" are axes of *input variation* — what the
Tide lesson (L3) calls **slices** — not types of mistake.

## Next up (the backlog for this section)
- [x] ~~**Defining "complete" with a failure-mode map**~~: landed as [dimensions vs slices](../notes/dimensions-vs-slices.md) (Tide Stage 4c) and [sort before you count](../notes/sort-before-you-count.md) (step 4d part 1).
- [x] ~~**Auditing the answer keys**~~: landed as [whose fault is the failure](../notes/whose-fault-is-the-failure.md) (Tide Stage 4d parts 2–3).
- [ ] **Certifying the per-type judges on a held-out human set** (in flight): partly covered by [same judge, blind](../notes/same-judge-blind-grading.md); the held-out certification numbers are still to come.
- [x] ~~**Rewriting the checks**~~: the objective half landed as [code checks before judges](../notes/code-checks-before-judges.md) (trace-grounded code checks, tide #334). Still open: moving the release gate onto red lines.
- [ ] **Eval & observability tooling**: Langfuse / LangSmith / Braintrust / Arize, from the [consulting map](building-ai-stacks.md) backlog.
