---
title: Before you have users, generate scenarios from dimensions and tuples — not one big prompt
slug: synthetic-scenarios-before-launch
kind: concept
spine_layer: foundations
tags: [evals, synthetic-data, fixtures, coverage]
connections:
  - { to: dimensions-vs-slices, type: used-with, why: "Watch the word clash: these 'dimensions' are axes of INPUT variation (persona, task, clarity) — what the Tide lesson calls slices — not types of mistake." }
  - { to: error-analysis-on-traces, type: enables, why: "Synthetic traces are how you start error analysis before real traffic exists." }
  - { to: offline-vs-online-evals, type: part-of, why: "Synthetic scenarios are the frozen world of offline evals, manufactured on purpose — the flight-simulator principle." }
  - { to: production-to-eval-flywheel, type: contrasts-with, why: "Synthetic data can't tell you how common a failure is; only production traces can. Replace it with real users as soon as you have them." }
source: { url: "https://hamel.dev/blog/posts/evals-faq/", author: "Hamel Husain & Shreya Shankar (+ Hamel Husain 2024; Lenny's Newsletter)", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Before you have users, generate scenarios from dimensions and tuples — not one big prompt

**Your question 6: how do you generate test scenarios for an AI system that isn't in production yet?**

## TL;DR
You don't have to wait for users. List the **dimensions** your inputs vary along (who's asking, what they
want, how clearly), write **~20 combinations (tuples) by hand**, have an LLM generate more tuples, then turn
each tuple into a realistic message **in a separate prompt**. Run your system on them and do error analysis
on the results. But treat it as a bridge: synthetic data can't tell you **how common** a failure is, so
switch to real users as soon as you can.

## The idea, simply
**Why not just ask an LLM for "100 test questions"?** You get 100 near-identical, polite, well-formed
questions. Real users are messier. Structure is what buys diversity.

**Step 1 — define dimensions.** Each dimension is one way real requests differ. For a recipe app:
- *Dietary restriction:* vegan, gluten-free, none
- *Cuisine:* Italian, Asian, comfort food
- *Complexity:* simple request, multi-step, edge case

Pick dimensions where you **expect the product might fail**: task type, user persona, how clear the
request is.

**Step 2 — write ~20 tuples by hand.** A tuple picks one value per dimension:
*(vegan, Italian, multi-step)*. Doing the first batch yourself forces you to think about which combinations
matter.

**Step 3 — generate more tuples with an LLM**, seeded by yours.

**Step 4 — turn each tuple into natural language, in a separate prompt.** Keeping "choose the combination"
and "write the message" apart avoids repetitive phrasing. Generating each scenario with its **own model
call** also beats asking for many at once.

**Step 5 — run the system and review the traces**, exactly as you would with real users.

**Variations worth knowing**
- **RAG:** generate questions *backwards* from your documents — pull a key fact, ask an LLM to write the
  question it answers — to get query → correct-document pairs.
- **Educated guesses are enough to start.** Hamel's early advice: you can guess how users will use the
  product and write scoped tests per feature and scenario before launch.
- **Stress tests:** deliberately write requests that push against your prompt's own rules.

**The limits (don't skip these)**
- Synthetic data **can't tell you how often** a failure happens in production.
- It **misses domain detail** that real users bring.
- Best uses: getting error analysis started before traffic exists, and testing a **known rare failure**
  that seldom shows up in real data.

**Everyday analogy:** a flight simulator. You can script the engine fire you're worried about and practise
it on demand — but the simulator can't tell you how often engines actually catch fire. For that, you need
real flight records.

## Mental model / why it matters
Dimensions are a **coverage map for inputs**; the failure map is a **coverage map for mistakes**. You need
both. Note the word clash: here "dimensions" means axes of *input variation* — what the Tide lesson called
**slices** (situations, user jobs) — while that lesson's "dimensions" are *types of mistake*. Same word,
different axis. Rule of thumb: dimensions-of-input generate the tests; dimensions-of-failure grade them.

## How to apply (in practice / consulting)
- For a pre-launch client, run a 1-hour workshop to list 3–4 input dimensions and hand-write the first 20
  tuples with the domain expert. It doubles as requirements discovery.
- Generate a few hundred scenarios, review ~100 traces, and build evals only for failures that recur.
- Mark synthetic vs real in every trace, so nobody quotes a synthetic failure rate as a production one.
- Plan the handover: the day real traffic arrives, start sampling it.

## Provenance & caveats
Sources (retrieved 2026-09-26): FAQ *What is the best approach for generating synthetic data?* and *Are
there scenarios where synthetic data may not be reliable?* (dimensions, 20 hand-written tuples, two-step
generation, limits); Husain & Shankar, *Advanced evals* (Lenny's, 2026-09-22, paywalled — visible part:
failure-oriented dimensions, one model call per scenario, "get real users instead of relying on synthetic
data where possible"); FAQ *How do I surface problematic traces…?* (stress-testing prompt constraints); FAQ on
RAG (reverse query generation); Hamel Husain 2024 (educated guesses, LLM-generated test inputs).
- ❓ Practitioner methodology, not a vendor spec.

## Connections
- **used-with [Dimensions vs slices](dimensions-vs-slices.md)**: these dimensions are input axes — Tide's "slices".
- **enables [Error analysis on traces](error-analysis-on-traces.md)**: the way to start before real traffic.
- **part-of [Offline vs online evals](offline-vs-online-evals.md)**: manufactured frozen worlds.
- **contrasts-with [The production-to-eval flywheel](production-to-eval-flywheel.md)**: only production tells you frequency.
