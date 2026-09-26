---
title: Humans discover and decide; automation scales and watches — combine them, never outsource the judging
slug: humans-and-automation-in-evals
kind: concept
spine_layer: foundations
tags: [evals, llm-as-judge, human-review, guardrails]
connections:
  - { to: error-analysis-on-traces, type: builds-on, why: "Error analysis is the human-owned core; this note is how automation wraps around it without replacing it." }
  - { to: aligning-an-llm-judge, type: used-with, why: "The bridge between the two halves: human labels certify the judge, the judge scales the human's taste." }
  - { to: completion-is-externalized, type: used-with, why: "Same maker/checker split: automated checkers are useful, but the final standard is set outside them — by a person." }
  - { to: safety-alarm-false-alarms, type: used-with, why: "Automated flaggers add noise; a human reviewing each alarm is what keeps a gate trusted." }
source: { url: "https://parlance-labs.com/blog/posts/auto-evals/index.html", author: "Antaripa Saha & Hamel Husain (+ Husain & Shankar FAQ and Lenny's)", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Humans discover and decide; automation scales and watches — combine them, never outsource the judging

**Your question 9: how do you combine automated evals with human evals?**

## TL;DR
Split the work by what each is good at. **Humans** (one domain expert) **discover** the failure modes,
**set** the standard, and **label** the ground truth. **Automation** **scales** it: code checks and
validated judges run on every change and on live traffic, and AI assistants speed up annotation. The link
between them is **measured agreement**. The rule: stay in the loop — automated eval agents reliably miss
answers that *look* correct but make for a poor experience.

## The idea, simply
**Who does what**

| Humans (the benevolent dictator) | Automation |
|---|---|
| Read traces and name failure modes (error analysis) | Code checks on every change (CI) |
| Write the pass/fail + critique ground truth | LLM judges, **validated** against that ground truth |
| Review what the judges flag; accept or reject AI suggestions | Sample and score production traffic; flag outliers |
| Decide what "good" means as the product changes | Cluster notes, pre-annotate traces, search for known failure modes |

**The handoff pattern (active learning).** Start with a diverse sample. Annotate at least ~30 yourself.
When you find a failure, look at a few more before you decide you understand it. Then let an AI annotate
the rest while you **accept or reject** each suggestion. You stay the judge; the AI makes judging fast.

**What the evidence says.** The Parlance study pitted automated eval agents and coding agents against 100
real traces a domain expert had labelled (39 failures). The best found most of them, and some found real
issues the human had missed — but **every one missed the same class**: answers that "looked correct" but fell
short as an experience (a sales objection left unaddressed, markdown showing up as stray characters in an
SMS, a voice agent interrupting callers, a missed human-handoff rule). They also added noise by flagging
good answers.

**Guardrails vs evaluators — the other combination**
- **Guardrails** run **inline**, before the user sees the answer: fast, deterministic, simple (regexes,
  block-lists, schema validators, small classifiers) for clear, high-impact failures — PII leaks,
  profanity, malformed JSON.
- **Evaluators** run **after**, asynchronously or in batch, and can be heavier (LLM judges) — for nuanced
  qualities like correctness or completeness.
- An evaluator can act as a guardrail only where latency and reliability allow — e.g. a cascade that runs
  it only on borderline cases.

**Everyday analogy:** a newspaper. Spell-check and the style checker run on every article automatically;
junior sub-editors catch most problems; but the editor still reads the front page, because "technically
correct but misses the story" is exactly what the checkers can't see.

## Mental model / why it matters
Automation is a **multiplier on a human standard**, not a substitute for one. If nobody has decided what
good looks like, the automation multiplies noise. That's also why outsourcing error analysis is "usually a
big mistake": the product intuition you'd be outsourcing *is* the eval.

**A real tension worth holding.** Anthropic's own eval guide advises "prioritize volume over quality": more
questions with slightly lower-signal automated grading beat fewer hand-graded ones. Hamel and Shreya say
look at the data yourself first. These fit together **in sequence**: humans first, to discover the criteria
(where volume doesn't help); then automation at volume, to regression-test criteria you already trust.

## How to apply (in practice / consulting)
- Name the human owner of quality before buying an eval platform.
- Use AI to **accelerate** annotation (clustering, pre-labels, search), always with human accept/reject.
- Put deterministic guardrails inline for the few catastrophic failures; run everything else as async
  evaluators.
- Re-check every judge against fresh human labels periodically, since trust decays as the product changes.

## Provenance & caveats
Sources (retrieved 2026-09-26): Saha & Husain, *Do Automated Evals Work?* (Parlance Labs, 2026-07-11) —
the 100-trace / 39-failure study, the missed "looked correct" class, stay in the loop; Husain & Shankar,
*Advanced evals* (Lenny's, 2026-09-22, paywalled — visible part) — agents miss issues needing product
judgment, add noise, find things humans miss, active-learning workflow; FAQ — benevolent dictator,
outsourcing, *What's the difference between guardrails & evaluators?* (2025-06-29).
- ✅ Anthropic's eval guide: "More questions with slightly lower signal automated grading is better than fewer questions with high-quality human hand-graded evals" (platform.claude.com/docs *Define success criteria and build evaluations*, retrieved 2026-09-26). Recorded as a tension with the "look at your data" position, reconciled above as a sequence — **my reconciliation, not either source's**.
- ❓ Study results are the authors' single study on one product (apartment leasing); vendor tool names and scores (Braintrust Loop, Arize AX, LangSmith, coding agents including Claude Code) are out of scope here and not re-verified.

## Connections
- **builds-on [Error analysis on traces](error-analysis-on-traces.md)**: the human-owned core.
- **used-with [Aligning an LLM judge](aligning-an-llm-judge.md)**: measured agreement links the halves.
- **used-with [Never let the agent declare its own victory](completion-is-externalized.md)**: the standard lives outside the checkers.
- **used-with [A safety alarm is only as good as its checks](safety-alarm-false-alarms.md)**: humans keep alarms trusted.
