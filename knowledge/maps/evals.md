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
> **19 lessons** learned the hard way rebuilding a real eval system (the Tide money coach,
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
system (September–October 2026), and were re-checked against Tide's latest approach on 2026-10-06. The whole
loop as prose: [the eval lifecycle](../notes/eval-lifecycle.md).*

### The foundation

- **M1 · [An eval is a sensor on one behaviour](../notes/what-is-an-eval.md)** — A repeatable check of one behaviour; build product evals, not benchmarks.
- L1 · [An offline eval is a controlled experiment — the agent is real, the world is frozen](../notes/offline-vs-online-evals.md) — freeze the world so only the agent changes — Tide moved from authored mocks to recordings of real runs.
- L2 · [Evals test judgment; unit tests test math](../notes/evals-test-judgment.md) — unit tests own the math, evals own the judgment.

### Find what to measure

**Step 1 · Write realistic questions from dimensions**
- **M2 · [Generate scenarios from dimensions, not one prompt](../notes/synthetic-scenarios-before-launch.md)** — Dimensions → tuples → questions, each phrased in its own prompt.
- L3 · [Dimensions vs slices — how to build a failure map](../notes/dimensions-vs-slices.md) — the seven steps Tide followed to build its failure map, red lines included.

**Step 2 · Run the real system on real data and record everything**
- **M3 · [Split the eval along the system's stages](../notes/evals-by-system-type.md)** — One call, RAG or agent: evaluate stage by stage; find the first thing that broke.
- L4 · [You can't evaluate what you can't see — instrument first](../notes/instrument-before-you-evaluate.md) — record every tool output before writing a single eval. *(October rebuild)*
- L5 · [Freeze everything the model can see — including the date and the conversation](../notes/freeze-everything-the-model-sees.md) — freeze every input: the data, the date, the conversation, the limits.
- L6 · [Don't copy, derive — two copies of one fact will drift apart](../notes/dont-copy-derive.md) — two copies of one fact drift apart; the app and the runner share one entry point.

### Grade and group

**Step 3 · A human grades first; a judge only after it agrees on held-out examples**
- **M4 · [A judge is a classifier — certify it](../notes/aligning-an-llm-judge.md)** — Owner's pass/fail + critique → train/dev/test → TPR and TNR.
- L7 · [Three kinds of grader, and what each one can't see](../notes/three-kinds-of-grader.md) — what each grader can't see — and why Tide retired the third.
- L8 · [A test that crashed is not a test that failed](../notes/crashed-is-not-failed.md) — a test that crashed isn't a test that failed; incomplete runs get "no score".
- L9 · [Measure the judge before you change it — hold the answers fixed, vary the judge](../notes/measure-the-judge-before-you-change-it.md) — hold the answers fixed, vary the judge. *(judge validation)*

**Step 4 · Group failures by their first upstream cause**
- **M5 · [Error analysis finds what to measure](../notes/error-analysis-on-traces.md)** — Read the traces, note the first failure, group into types, count.
- L10 · [When a test fails, find out whose fault it is before you fix anything](../notes/whose-fault-is-the-failure.md) — a failing test isn't evidence until you know whose fault it is.

### Fix and prove

**Step 5 · Fix the cause in the layer it lives in — prompt, tool, engine or data**
- L11 · [Fix the failure in the layer it lives in — prompts for behaviour, tools and data for facts](../notes/fix-the-layer-it-lives-in.md) — prompts for behaviour; tools and data for facts. *(October rebuild)*

**Step 6 · Prove each fix: frozen replays for prompts, live re-runs for tools; one blind judge on both sides**
- **M6 · [Every metric maps to a real failure](../notes/eval-metrics-by-system-type.md)** — Pass rate per real failure, plus recall@k/MRR, faithfulness, task success, step rates.
- L12 · [Frozen replay — prove a fix when the data won't sit still](../notes/frozen-replay.md) — record a live run, replay it under the change. *(October rebuild)*
- L13 · [Same judge on both sides, blind to which side is which](../notes/same-judge-blind-grading.md) — the same frozen judge on both sides, blind to which is which. *(October rebuild)*

**Step 7 · Read every changed verdict — a fix can overreach**
- L14 · [One run is a sample, not a measurement](../notes/one-run-is-a-sample.md) — identical runs give different answers; measure the noise first.
- L15 · [A fix can overreach — read every regression, not just the total](../notes/fixes-can-overreach.md) — read every regression, not just the total. *(October rebuild)*

### Automate

**Step 8 · Code checks for the objective, certified judges for judgment calls, a rate with a range**
- **M7 · [Rule or judgment picks the check](../notes/two-kinds-of-eval-check.md)** — Code check when a rule can decide; LLM judge when it takes judgment.
- **M8 · [Code checks test structure, state and behaviour](../notes/code-check-best-practices.md)** — Scoped per scenario, with pass and fail examples.
- L16 · [Word checks can't read meaning (the spam-filter problem)](../notes/word-checks-cant-read-meaning.md) — word matching fails good answers; keep word checks as flags.
- L17 · [A safety alarm is only as good as its checks](../notes/safety-alarm-false-alarms.md) — a zero-tolerance gate is only as good as its checks.
- L18 · [Code checks before judges — for an agent, the trace is the answer key](../notes/code-checks-before-judges.md) — for an agent, the trace is the answer key. *(October rebuild)*

### Then round again

- **M9 · [The suite is a flywheel, not a snapshot](../notes/production-to-eval-flywheel.md)** — New failures → new tests; retire tests that never fail.
- L19 · [Close each cycle with a fresh live round — it finds what your fixes broke](../notes/fresh-live-round.md) — replays prove each fix alone; a fresh live round finds what they broke together. *(October rebuild)*

### Across it all

- **M10 · [Humans set the standard; automation scales it](../notes/humans-and-automation-in-evals.md)** — Humans discover and decide; never outsource the judging.

## How it all connects
An eval is a sensor on one behaviour (M1), and the first job is a fair experiment: freeze the world so only
the agent changes (L1), and keep the math in unit tests (L2). **Find:** build a failure map and
generate scenarios from it (M2, L3); run the real system and record everything — instrumented,
frozen, never copied (M3, L4, L5, L6). **Grade:** a human grades first and a judge counts only once
certified (M4); every grader is blind to something (L7), a crashed test isn't a failed one (L8), and
you change a judge only by experiment (L9). Error analysis groups failures by first upstream cause (M5) — once you
know whose fault each is (L10). **Fix and prove:** fix the cause where it lives (L11), prove it on frozen
replays with one blind judge (M6, L12, L13), and read every regression (L14, L15). **Automate:** pick code
or judgment per check (M7), write code checks on structure and state (M8) — word checks can't read meaning (L16),
a gate is only as good as its checks (L17), and for an agent the trace is the answer key (L18). Then round
again: the suite is a flywheel (M9), and a fresh live round finds what the fixes broke (L19). Across it all,
humans set the standard and automation scales it (M10).

**One word clash to remember.** In synthetic data (M2) "dimensions" are axes of *input variation* — what
the Tide lesson (L3) calls **slices** — not types of mistake.

## Next up (the backlog for this section)
- [x] ~~**Defining "complete" with a failure-mode map**~~: landed as [dimensions vs slices](../notes/dimensions-vs-slices.md) (Tide Stage 4c–4d).
- [x] ~~**Auditing the answer keys**~~: landed as [whose fault is the failure](../notes/whose-fault-is-the-failure.md) (Tide Stage 4d parts 2–3).
- [ ] **Certifying the per-type judges on a held-out human set** (in flight): partly covered by [same judge, blind](../notes/same-judge-blind-grading.md); the held-out certification numbers are still to come.
- [x] ~~**Rewriting the checks**~~: the objective half landed as [code checks before judges](../notes/code-checks-before-judges.md) (trace-grounded code checks, tide #334). Still open: moving the release gate onto red lines.
- [ ] **Eval & observability tooling**: Langfuse / LangSmith / Braintrust / Arize, from the [consulting map](building-ai-stacks.md) backlog.
