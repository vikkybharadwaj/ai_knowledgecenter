---
title: Two kinds of eval check — code when a rule can decide, an LLM judge when it takes judgment
slug: two-kinds-of-eval-check
kind: concept
spine_layer: foundations
tags: [evals, graders, llm-as-judge]
connections:
  - { to: three-kinds-of-grader, type: builds-on, why: "That note (from Tide) adds the third grader, similarity to a reference answer, and each grader's blind spot; this is the two-way split the sources lead with." }
  - { to: code-check-best-practices, type: enables, why: "Once a failure is classed as rule-decidable, that note says how to write the check well." }
  - { to: aligning-an-llm-judge, type: enables, why: "Once a failure is classed as needing judgment, that note says how to make the judge trustworthy." }
  - { to: offline-vs-online-evals, type: contrasts-with, why: "Code vs judge is WHO grades; offline vs online is WHEN and ON WHAT data. Two independent axes, often confused." }
source: { url: "https://www.lennysnewsletter.com/p/building-eval-systems-that-improve", author: "Hamel Husain & Shreya Shankar (Lenny's Newsletter)", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Two kinds of eval check — code when a rule can decide, an LLM judge when it takes judgment


## TL;DR
Every automated eval is one of two kinds, and **the failure decides which**:
- **Code-based check** — when a clear rule can say pass or fail ("is it valid JSON?", "did it call the
  cancel tool with this order id?"). Fast, cheap, deterministic.
- **LLM-as-judge** — when deciding needs judgment ("did it acknowledge the user's stress before the
  numbers?"). The only way to scale nuanced grading, but it costs more and must be checked against humans.

Humans sit above both: they **discover** the failures and **label** the ground truth that the judges are
checked against.

## The idea, simply
Ask one question of each failure mode: *could a short piece of code decide this, every time?*

| | Code-based check | LLM-as-judge |
|---|---|---|
| Use when | A rule can define success | It takes judgment |
| Examples | JSON parses; tool called with right args; exactly one DB record created; no raw IDs leaked | Tone, helpfulness, "did it address the objection?", faithfulness to sources |
| Cost | Cheap to build and run | Needs ~100–200 labelled examples per failure mode, plus upkeep |
| Behaviour | Deterministic | Probabilistic — must be validated |

**Default to code.** If a regex, schema check or execution test can catch it, that's almost always worth
it. Reach for a judge only for failures that keep coming back and resist simple rules.

**A third name you'll hear: human evals** — thumbs up/down in the product, or paid labellers. They're
closest to the user but sparse and noisy, so in this picture humans are the *source of truth* for the other
two rather than a third automated type.

**Everyday analogy:** a spell-checker and an editor. The spell-checker (code) is instant and never changes
its mind, but it can't tell you whether the paragraph is persuasive. The editor (judge) can — but you'd
better check the editor's taste against yours before letting them sign off alone.

## Mental model / why it matters
"Types of eval" gets confused because there are **two independent axes**:
- **Who grades** — code vs judge (this note).
- **When, and on what data** — offline on frozen test cases vs online on live traffic.

A judge can run offline or online; so can a code check. Keeping the axes apart stops the common mistake of
thinking "we have online evals" means "we have judges". Another two-way split from the FAQ — **model
benchmarks vs product evals** — is about *what* you're measuring, and lives in [what is an eval](what-is-an-eval.md).

## How to apply (in practice / consulting)
- Sort every failure mode from error analysis into *rule-decidable* or *needs judgment* before building
  anything.
- For each judge you propose, budget the labelled examples and maintenance — that cost is the real
  decision.
- If a failure is really a missing instruction ("wanted shorter answers but never said so"), **fix the
  prompt first**; don't build an evaluator for a spec you never wrote.

## Provenance & caveats
Sources (retrieved 2026-09-26): Husain & Shankar, *Building eval systems that improve your AI product*
(Lenny's, 2025-09-09; phase 3 paywalled) — the code vs judge split; FAQ entries *Should I build automated
evaluators for every failure mode?* and the evaluator cost hierarchy — the 100–200 examples figure; Aman
Khan, *Beyond vibe checks* — the three-way human / code / LLM framing.
- ✅ Anthropic's own eval guide groups grading the same way — code-graded, LLM-graded and human-graded — and prefers automated grading where possible (platform.claude.com/docs *Define success criteria and build evaluations*, retrieved 2026-09-26).
- ⚠️ "Two kinds" is my framing of the sources; Khan counts three (human, code, LLM). The FAQ's other "two types" (benchmarks vs product evals) is covered in [what is an eval](what-is-an-eval.md).
- ❓ The 100–200 examples per judge is the authors' rule of thumb.

## Connections
- **builds-on [Three kinds of grader](three-kinds-of-grader.md)**: adds the reference-similarity grader and the blind spots.
- **enables [Code-check best practices](code-check-best-practices.md)**: how to write the rule-decidable kind well.
- **enables [Aligning an LLM judge](aligning-an-llm-judge.md)**: how to make the judgment kind trustworthy.
- **contrasts-with [Offline vs online evals](offline-vs-online-evals.md)**: who grades vs when and on what data.
