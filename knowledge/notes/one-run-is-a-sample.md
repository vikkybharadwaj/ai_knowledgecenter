---
title: One run is a sample, not a measurement
slug: one-run-is-a-sample
kind: concept
spine_layer: foundations
tags: [evals, reliability, statistics]
connections:
  - { to: offline-vs-online-evals, type: builds-on, why: "Freezing the world gives attribution only if you also know how much the score moves on its own; this adds the noise floor." }
  - { to: crashed-is-not-failed, type: used-with, why: "The two checks a number must pass before you trust it: validity first, then noise." }
  - { to: word-checks-cant-read-meaning, type: used-with, why: "Brittle word checks turn harmless rewording into pass/fail flips, which is where most of the noise comes from." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# One run is a sample, not a measurement

## TL;DR
Run the exact same tests twice and you'll get different results, because an AI never words its answer
exactly the same way twice. So **never judge from a single run.** Run several times, and look at each test's
pass *rate*.

## The idea, simply
Normal software gives the same output every time. AI doesn't: it words things a little differently on every
run. Newer Claude models don't even let you turn that down any more; they reject custom `temperature`
settings, the old "randomness" dial.

So one run's score is like **one coin flip**. If a change moves the score from 53 to 56, that might be real,
or it might be luck.

**The fix is to measure the noise first.** Run the unchanged tests a few times and count how many results
flip. That count is your *noise floor*. A change is only real if it moves results by more than that.

**Everyday analogy:** weighing yourself once after lunch and once before breakfast. The difference isn't
weight you gained; it's noise. You'd weigh yourself several days in a row before concluding anything.

## Real example
The same 81 Tide tests were run twice in a row with **nothing changed**. The scores were **52/81** and
**56/81**, and **14 tests (17%)** passed once and failed once. 47 always passed and 20 always failed. Earlier the same day, a real improvement had
been judged by comparing one run before with one run after: 54 vs 53, which looked like "no effect". That
comparison was pure noise. The real effect only showed up in the specific tests the change targeted, and in
the steadier similarity scores.

## Mental model / why it matters
A frozen world removes *outside* causes of change, but the model itself is still random. Freezing buys
attribution only once you know the size of that randomness. This is also why "the score went up 3 points"
is a weak claim in a client report, and "these 5 tests went from always failing to always passing" is a
strong one.

## How to apply
- Before trusting any comparison, **run the unchanged suite 2–3 times** and count the flips.
- Report a range, not a single number: "64–69%", not "67%".
- To prove a change helped, run **each side several times** and compare per-test pass rates, or show specific
  tests going from *always failing* to *always passing*.
- Start fixing with the tests that **always fail**. They're the steady signal. Tests that flip usually point
  to brittle checks.

> **Interview line:** "How do you know a change helped? First measure run-to-run variance on the unchanged
> system. A change is real only if it beats that noise floor."

## Provenance & caveats
- ✅ Two identical runs on 2026-09-18 (`T17-47`: 52/81, `T18-01`: 56/81); 14 of 81 flipped (17.3%). The earlier before/after pair was 54 vs 53 (`T11-07` vs `T16-12`), while similarity means moved 3.14 → 3.42. All checked against the tide repo results by a separate fact-check pass.
- ✅ Claude models released after Opus 4.6 reject any `temperature` other than 1.0 with a 400 error, and even `0.0` was never fully deterministic: platform.claude.com/docs Messages API reference + "Model deprecations" (retrieved 2026-09-18).
- ❓ "Run 2–3 times" is a practical rule of thumb, not a statistical guarantee. More runs give a tighter noise floor.

## Connections
- **builds-on [An offline eval is a controlled experiment](offline-vs-online-evals.md)**: freezing gives attribution only once you know the noise.
- **used-with [A test that crashed is not a test that failed](crashed-is-not-failed.md)**: validity first, then noise.
- **used-with [Word checks can't read meaning](word-checks-cant-read-meaning.md)**: brittle checks cause most of the flips.
