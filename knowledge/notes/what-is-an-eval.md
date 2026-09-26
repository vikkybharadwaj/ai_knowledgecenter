---
title: An eval is a repeatable check of one behaviour — product evals, not benchmarks, are the ones you build
slug: what-is-an-eval
kind: concept
spine_layer: foundations
tags: [evals, reliability, mental-model]
connections:
  - { to: harness-engineering-discipline, type: builds-on, why: "Harness engineering says reliability is built outside the model; an eval is how you find out whether that building worked." }
  - { to: offline-vs-online-evals, type: enables, why: "Once you know what an eval is, the next question is where it runs — before launch on frozen data, or after on live traffic." }
  - { to: error-analysis-on-traces, type: used-with, why: "Evals only measure what you thought to check; error analysis is how you find out what to check." }
  - { to: completion-is-externalized, type: used-with, why: "Same principle one level up: the verdict on quality lives outside the model, in tests the team owns." }
source: { url: "https://hamel.dev/blog/posts/evals-faq/", author: "Hamel Husain & Shreya Shankar (+ Hamel Husain 2024; Aman Khan on Lenny's Newsletter)", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# An eval is a repeatable check of one behaviour — product evals, not benchmarks, are the ones you build

**Your question 1: what is an eval, and why do we need it?**

## TL;DR
An **eval** is the systematic measurement of quality: each one **checks one behaviour on relevant examples
and returns a score or a review**. It turns your judgment about what "good" looks like into a test the team
can re-run before every change. You need them because AI products are **easy to change but hard to
predict** — a prompt, model or code change can improve one behaviour while quietly breaking another, and
"it feels better" (a *vibe check*) can't tell you which.

## The idea, simply
There are two very different things people call "evals":

| | Model benchmarks | Product evals |
|---|---|---|
| Question | Which model is generally smarter? | Does **my** product do what I want? |
| Examples | GPQA, MMLU, Terminal-Bench | "Did it quote the right payday?", "Did it refuse investment advice?" |
| Useful for | Picking a model | Improving your product |

**Product evals are the ones you build.** A benchmark score says nothing about whether your app handles
your users' requests.

**Why they matter — the stall pattern.** Hamel's case study (Rechat's real-estate assistant, *Lucy*) is the
classic arc: fast progress from prompt tweaks, then a plateau. Every fix broke something else
(*whack-a-mole*), nobody could say whether things were actually better, and the prompt ballooned with edge
cases. The diagnosis: improving an AI product needs **three loops running together** —
1. **Evaluate** quality (tests),
2. **Debug** (logging and reading traces),
3. **Change behaviour** (prompts, fine-tuning).

Most teams only do #3. Without #1 and #2, you can't get past the demo.

**A bonus:** the failures your evals catch become *data* — examples for few-shot prompts, regression tests,
and even fine-tuning sets.

**Everyday analogy:** tasting the soup vs. following a recipe card with measurements. Tasting (a vibe check)
works for one cook on one night. The moment you have several cooks, or change an ingredient, you need the
card — or you'll never know which change made it worse.

## Mental model / why it matters
An eval is a **sensor you point at one behaviour**. The whole discipline follows from three consequences:
- One sensor per behaviour, so a failure tells you *what* broke (not "quality went down").
- Sensors only see what they're pointed at, so you need a way to find *what to point them at* — that's
  error analysis, the most important activity in evals.
- A sensor is itself a machine that can be wrong, so you check it before trusting it (see judge alignment).

## How to apply (in practice / consulting)
- When a client says "we have evals", ask: are they **benchmarks** or **product evals**? Generic scores
  ("helpfulness 4.2") are a warning sign.
- Ask which of the three loops they run. Teams stuck in prompt-tweaking are usually missing #1 and #2.
- Budget honestly: practitioners report spending **60–80% of development time** on error analysis and
  evaluation — mostly *looking at data*, not building automation.

## Provenance & caveats
Sources (retrieved 2026-09-26): Hamel Husain & Shreya Shankar, *AI Evals: Everything You Need to Know* (FAQ,
modified 2026-09-21) — definition, benchmarks vs product evals, 60–80% figure; Hamel Husain, *Your AI Product
Needs Evals* (2024-03-29) — the three loops and the Rechat/Lucy case; Husain & Shankar, *Advanced evals*
(Lenny's Newsletter, 2026-09-22, paywalled — visible part only) — "easy to change but hard to predict";
Aman Khan, *Beyond vibe checks* (Lenny's Newsletter, 2025-04-08, paywalled — visible part only).
- ❓ Practitioner methodology (Husain, Shankar, Khan) — cross-cutting guidance, not a vendor spec; captured as their position.
- ⚠️ The 60–80% time split is the authors' reported experience on their projects, not a measured industry figure.

## Connections
- **builds-on [Harness engineering](harness-engineering-discipline.md)**: evals are how you know the harness worked.
- **enables [Offline vs online evals](offline-vs-online-evals.md)**: the next question is where an eval runs.
- **used-with [Error analysis on traces](error-analysis-on-traces.md)**: how you find what to check.
- **used-with [Never let the agent declare its own victory](completion-is-externalized.md)**: the verdict lives outside the model.
