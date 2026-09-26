---
title: The metrics that matter for each system shape — and why generic scores don't
slug: eval-metrics-by-system-type
kind: concept
spine_layer: patterns
tags: [evals, rag, agents, metrics]
connections:
  - { to: evals-by-system-type, type: builds-on, why: "That note is the approach per system shape; this one is the scoreboard for each." }
  - { to: aligning-an-llm-judge, type: used-with, why: "Every judge-based metric here is only as good as the judge's measured TPR/TNR." }
  - { to: one-run-is-a-sample, type: used-with, why: "A metric is a sample, not a truth: track ranges and confidence intervals, not single numbers." }
  - { to: word-checks-cant-read-meaning, type: used-with, why: "Generic string/similarity metrics share the word-check blind spot: they measure surface overlap, not whether the answer is right." }
source: { url: "https://hamel.dev/blog/posts/evals-faq/how-should-i-approach-evaluating-my-rag-system.html", author: "Hamel Husain & Shreya Shankar", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# The metrics that matter for each system shape — and why generic scores don't

**Your question 4: what are the key metrics for each approach in question 3?**

## TL;DR
The best metric is almost always **the pass rate of a specific, binary check for a failure mode you actually
saw**. On top of that, each system shape has a few standard numbers: **search metrics** for RAG retrieval,
**faithfulness/relevance** for RAG answers, and **task success + step-level rates** for agents. Beware
generic "quality" scores — good numbers on them don't mean your product works.

## The metrics, by shape

**Any system (the base layer)**
- **Pass rate per failure mode** — each check is binary (pass/fail), so the metric is "% of relevant cases
  that pass". Track them separately; don't blend them into one number.
- **For each LLM judge: TPR and TNR** — how many real failures it catches, and how many good answers it
  correctly lets through (see judge alignment). Not "accuracy".
- Want gradual progress? Use **several binary sub-checks** ("4 of 5 expected facts included") instead of a
  1–5 score.

**RAG — retrieval** (a search problem; pick by use case)
- **Recall@k** — of all the relevant documents, how many made the top *k*? (Did the answer's source come
  back at all?)
- **Precision@k** — of the top *k* retrieved, how many are relevant? (How much noise are we feeding the
  model?)
- **MRR (mean reciprocal rank)** — how high did the *first* relevant document rank? (Matters when only the
  top result gets used.)

**RAG — generation** (judged, after error analysis)
- **Context relevance (C|Q)** — is the retrieved context relevant to the question?
- **Faithfulness / groundedness (A|C)** — does the answer stay within the context, or make things up?
- **Answer relevance (A|Q)** — does the answer actually address the question?

**Agents and multi-step workflows**
- **End-to-end task success rate** — did it achieve the user's goal, per task type?
- **Step-level rates** — correct tool choice; complete, well-formed parameters; correct error handling;
  context retained; goal checkpoints reached.
- **Efficiency (process metrics)** — steps, seconds and tokens per task. These are deterministic, so
  failures here are the easiest to debug.
- **Outcome metrics** — completeness, accuracy and formatting of the final result.
- **Transition failure matrix counts** — failures per (last good state → first failure) cell.

**In production:** track **confidence intervals**, and investigate when the **lower bound** crosses your
threshold — not when a single reading dips.

## Why generic scores mislead
Off-the-shelf metrics — "helpfulness", "coherence", ROUGE, BERTScore, cosine similarity to a reference —
measure abstract qualities that may not matter for your product. They create **false confidence**. The
exception: experienced teams use them as *exploration signals* to surface interesting traces for a human to
read, not as quality gates. Similarity metrics do have a real job in **retrieval** (is this document
semantically close to the query?) — just not as a grade for the final answer.

**Everyday analogy:** a restaurant judged by "average plate weight". It's a number, it's easy to measure, and
it tells you nothing about whether the food is good. Measure the things that actually go wrong: cold food,
wrong order, missing allergy note.

## Mental model / why it matters
A metric is only meaningful if you can say **which failure it catches and what you'd change if it moved**.
That's why the base layer is "one binary check per observed failure": every number traces back to a real
problem. The standard RAG and agent metrics earn their place because they each isolate one stage of the
system — recall@k is the retrieval stage, faithfulness is the generation stage, tool-choice accuracy is
one agent step.

## How to apply (in practice / consulting)
- For any dashboard a client shows you, ask of each number: *which failure does this catch, and what would
  we do if it dropped?* Numbers without an answer are vanity metrics.
- For RAG, start with recall@k — it's the cheapest to compute and the most common root cause.
- For agents, report task success by workflow, and step-level rates only for the workflows that fail.
- Never ship one blended "quality score". Keep failure modes separate so a regression is legible.

## Provenance & caveats
Sources (retrieved 2026-09-26): FAQ pages on RAG, agentic workflows and multi-step workflows; FAQ answers
on binary vs Likert, combining evals into one metric, ready-to-use metrics and similarity metrics; FAQ *How
are evaluations used differently in CI/CD vs monitoring production?* (confidence intervals); Husain & Shankar
on Lenny's (recall@k, precision@k, faithfulness, answer relevance, TPR/TNR).
- ❓ Practitioner methodology, not a vendor spec.
- ⚠️ **Tension with Anthropic's own guide:** platform.claude.com/docs *Define success criteria and build evaluations* (retrieved 2026-09-26) shows cosine similarity and ROUGE-L as example graders. The FAQ calls such similarity metrics "not useful" for most LLM outputs. Reconcile: they suit narrow, reference-heavy tasks (e.g. summaries against a known text, retrieval), and fail as a general quality gate.

## Connections
- **builds-on [Evaluate by system shape](evals-by-system-type.md)**: the approach behind these numbers.
- **used-with [Aligning an LLM judge](aligning-an-llm-judge.md)**: judge metrics need measured TPR/TNR.
- **used-with [One run is a sample](one-run-is-a-sample.md)**: read metrics as ranges, not points.
- **used-with [Word checks can't read meaning](word-checks-cant-read-meaning.md)**: surface-overlap metrics share the blind spot.
