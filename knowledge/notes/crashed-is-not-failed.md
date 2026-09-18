---
title: A test that crashed is not a test that failed
slug: crashed-is-not-failed
kind: concept
spine_layer: foundations
tags: [evals, reliability, observability]
connections:
  - { to: offline-vs-online-evals, type: builds-on, why: "That note introduces the rule 'validity gates every score'; this one is the full lesson: how a crashed run impersonates a bad model, and the four fixes." }
  - { to: one-run-is-a-sample, type: used-with, why: "The two checks a number must pass before it means anything: did we measure at all, and is the difference bigger than the noise." }
  - { to: completion-is-externalized, type: used-with, why: "Same idea one level up: the harness, not the thing being measured, must decide whether a run counts, and must say 'broken' out loud." }
  - { to: harness-engineering-discipline, type: part-of, why: "A preflight check and run-health labels are the feedback subsystem of the eval harness itself." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# A test that crashed is not a test that failed

## TL;DR
If a test breaks **before the AI even answers**, that's a broken test setup, not a bad answer. Label it
*broken*, give it **no score**, and never average it in with real results.

## The idea, simply
Two very different things can go wrong when an eval runs:

1. **The AI gave a bad answer.** That's a *quality* problem, and it's what evals exist to catch.
2. **The test itself broke** before the AI answered: the model name was retired, the API key expired, the
   service was down. That's an *infrastructure* problem.

The trap is that many eval systems record both the same way. A crashed test produces an empty answer, the
checks fail on the empty answer, and it's scored as a fail. **A broken setup ends up looking exactly like a
terrible AI.**

**Everyday analogy:** a student who didn't show up to the exam isn't a student who scored zero. Average the
no-shows in as zeros and the class average tells you nothing.

## Real example
For about three months, Tide's nightly eval reported **0% every night** (95 nights). It looked like the AI
had collapsed. In reality the eval config pinned a model name the Claude API had retired, so every test
crashed before the AI answered, and every crash was scored as a fail. Nothing alerted anyone, because "0%" *looks like data*, not like an error. It ran for 95 nights, until 2026-09-18. The trend chart showed a cliff that said *quality collapsed*, when the
truth was *we stopped measuring*. Production was fine the whole time, because it runs on a different cloud
(Amazon Bedrock) that hadn't retired that model.

## Mental model / why it matters
Every eval result carries **two answers**, in order: *did we measure anything?* and only then *how good was
it?* Mixing them up is how eval programmes die quietly: people stop trusting the dashboard, then stop
opening it. It's also a trust problem for anyone you report to. A fake 0% and a real 0% need opposite
responses (fix the plumbing vs fix the product).

## How to apply
- **Check before you spend.** Before running any tests, make one tiny call to confirm each model answers
  (a *preflight*). If it doesn't, stop and record **no score at all**.
- **Label a broken run as broken.** If most tests fail with the *same* error, the run is a setup failure,
  not a measurement.
- **Keep broken runs out of averages and trend lines.** They poison every number calculated over them.
- **Alert on setup failures, not on quality dips.** A red square in a dashboard nobody opens is not an alert.

> **Interview line:** "Every eval result needs two answers: *did we measure anything?* and *how good was it?*
> Mixing them up is how eval programs die quietly."

## Provenance & caveats
Checked on 2026-09-18 against the tide repo (worktree `evals-revival`, PR #234) by a separate fact-check pass:
- ✅ 95 back-to-back nightly runs at 0/81 (2026-06-16 → 2026-09-18). All 7,695 results failed with the same `404 not_found_error` for `claude-sonnet-4-20250514`. The last honest run, 2026-06-15, scored 40/81.
- ✅ All four fixes exist in code: `evals/preflight.ts` (a 1-token call per model; throws and writes no results), `evals/run_health.ts` (invalid if every test crashed, or ≥50% crashed with the same cause), `generate_dashboard.ts` (trend shows valid runs only, plus a harness-failure banner), and `failure_kind.ts` + `evals.yml` (opens an issue only for harness failures).
- ✅ Retired models fail and Bedrock runs its own schedule: platform.claude.com/docs "Model deprecations" (retrieved 2026-09-18).
- ⚠️ A tide code comment (`evals/config.ts:9-11`) still says "91 nights, around 2026-06-21". The data says 95 nights from 2026-06-16.

## Connections
- **builds-on [An offline eval is a controlled experiment](offline-vs-online-evals.md)**: that note states the validity rule; this is the full lesson behind it.
- **used-with [One run is a sample, not a measurement](one-run-is-a-sample.md)**: the second check a number must pass (is it bigger than the noise?).
- **used-with [Never let the agent declare its own victory](completion-is-externalized.md)**: the harness owns the verdict, including the verdict "this run doesn't count".
- **part-of [Harness engineering](harness-engineering-discipline.md)**: preflight and run-health labels are the eval harness's own feedback subsystem.
