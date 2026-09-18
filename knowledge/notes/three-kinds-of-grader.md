---
title: Three kinds of grader, and what each one can't see
slug: three-kinds-of-grader
kind: concept
spine_layer: patterns
tags: [evals, graders, llm-as-judge]
connections:
  - { to: word-checks-cant-read-meaning, type: builds-on, why: "Word checks are grader #1; this note sets them beside the other two and says when each is the right tool." }
  - { to: offline-vs-online-evals, type: builds-on, why: "Which grader works where follows from whether the right answer is known: the similarity score needs a reference, so it only works offline." }
  - { to: completion-is-externalized, type: used-with, why: "All three are checkers outside the agent. The verdict never comes from the model grading itself." }
  - { to: dynamic-workflow-patterns, type: used-with, why: "An AI judge is adversarial verification applied to answers: a separate model whose job is to find what's wrong." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# Three kinds of grader, and what each one can't see

## TL;DR
AI answers are usually graded three ways: **word checks**, an **AI judge with written rules**, and
**similarity to a perfect answer**. Each one is blind to something. Knowing what each grader *can't* see is how
you pick the right one, and how you read it when they disagree.

## The three graders, simply

| Grader | Asks | Good at | Can't see |
|---|---|---|---|
| **Word check** (code check) | "Does the answer contain / avoid these words? Did it use this tool?" | Exact facts; fast, free, never changes its mind | **Meaning.** "No anomalies found" looks like "anomaly" to it |
| **AI judge** (rubric judge, *LLM-as-judge*) | "Does this answer meet these written rules?" (pass/fail) | Tone, helpfulness, following instructions | **Anything it isn't shown**: often the data the AI looked up, and the ideal answer |
| **Similarity score** (reference / ground-truth judge) | "How close is this to the perfect answer a person wrote?" (1–5) | Whether the key point came through | Whether the perfect answer is **still correct**; answers that are good but *different* |

**Everyday analogy:** grading an essay three ways. A spell-checker (exact, dumb). A teacher with a marking guide
(understands, but only knows the guide). Comparing it against a model answer (catches missing points, but
penalises a different, equally good essay).

## What it means when they disagree
- **Word check fails, AI judge passes:** usually a brittle word check.
- **AI judge passes, similarity score is low:** the answer *sounds* right but misses the point. The judge often
  can't see the numbers, so it can't tell.
- **Similarity score is low, but the answer is actually right:** the "perfect answer" is out of date.

## Real example
In one Tide run, the AI judge passed **87.5%** of answers, while only **73%** passed every code check. There
were **20 cases** where the judge said "pass" but the similarity score said "misses the main point", and **zero**
the other way round. In that run the judge was clearly the lenient one. One likely reason: the judge is shown the
*names* of the tools the AI called, but never the data they returned, so it can't check whether the numbers are
right. (Later runs were more balanced, 3 cases each way, so read this as a warning sign rather than a law.)

## Mental model / why it matters
Every grader is a sensor with a blind spot. One sensor alone gives you a confident wrong reading. Several
sensors with *different* blind spots, whose disagreements you actually read, give you a picture. It's also the
bridge to production: the rubric judge grades against a *standard*, not an answer, so it's the one automated
grader that works on live traffic, where nobody knows the right answer.

## How to apply
- **Match the grader to the failure:** exact facts → word check (tolerant). Tone and helpfulness → AI judge.
  "Did the key insight come through?" → similarity.
- **Give the AI judge what it needs:** the whole conversation, and the data if it must judge accuracy.
- **Use a different model to judge than the one being judged** (Anthropic's eval guide recommends this).
- **Decide which graders count.** Often only word checks and the AI judge decide pass/fail, and the similarity
  score is tracked for information.
- **Check the judges themselves:** have a person grade a sample and compare. An unchecked judge is just another
  opinion.

> **Interview line:** "Every grader is blind to something. The skill is knowing each one's blind spot, and
> reading their disagreements as a signal instead of noise."

## Provenance & caveats
- ✅ Run `2026-09-18T11-07`: judge passed 70 of 80 (87.5%); 59 of 81 (72.8%) passed all code checks; 20 cases had judge pass with similarity ≤ 2, and 0 had judge fail with similarity ≥ 4.
- ✅ `judges/llm_judge.ts` shows the judge the criteria, history, user message, tool **names** and the answer, never the tool data or the reference answer. The similarity judge uses a 1–5 scale. Pass/fail = no crash + all code checks + judge pass; similarity is information only (`runner.ts`).
- ⚠️ Corrected from the draft: "zero the other way" held only in that run (later runs had 3 each way), and "the reason turned out to be" was softened to "one likely reason". That run also had stale dates.
- ✅ Grader types (code-graded, exact match, LLM-graded incl. Likert) and "use a different model to evaluate than the one that generated the output": platform.claude.com/docs "Define success criteria and build evaluations" (retrieved 2026-09-18).
All Tide figures checked against the tide repo on 2026-09-18 by a separate fact-check pass.

## Connections
- **builds-on [Word checks can't read meaning](word-checks-cant-read-meaning.md)**: grader #1 in depth.
- **builds-on [An offline eval is a controlled experiment](offline-vs-online-evals.md)**: the known-answer rule decides where each grader can run.
- **used-with [Never let the agent declare its own victory](completion-is-externalized.md)**: graders are the external checker.
- **used-with [Six dynamic-workflow patterns](dynamic-workflow-patterns.md)**: an AI judge is adversarial verification for answers.
