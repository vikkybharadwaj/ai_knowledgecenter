---
title: Code checks before judges — for an agent, the trace is the answer key
slug: code-checks-before-judges
kind: concept
spine_layer: patterns
tags: [evals, graders, assertions, traces]
connections:
  - { to: code-check-best-practices, type: builds-on, why: "That note is how to write code checks; this is the agent-specific trick that makes them work without a hand-written answer key." }
  - { to: evals-test-judgment, type: builds-on, why: "That lesson proposed 'every figure must appear in the data'; this is it, built and calibrated." }
  - { to: aligning-an-llm-judge, type: used-with, why: "Calibrate the code check against the judge, and keep judges for what code can't decide." }
  - { to: error-analysis-on-traces, type: used-with, why: "The recorded trace that error analysis reads is also the answer key code checks compare against." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PR #334)", retrieved: 2026-10-04 }
date: 2026-10-04
depth: seedling
claude_specific: false
---

# Code checks before judges — for an agent, the trace is the answer key

## TL;DR
Anything with an objective answer should be a **code check**: free, instant, identical every time. Judges
are for judgment calls and must be certified first. The key idea for agents: **you don't need a hand-written
answer key — the recorded trace is the answer key.** Every figure in the answer must appear in the tool
outputs, or follow from them in one step.

## The idea, simply
**Figure grounding:** every money figure in the answer must either appear in the tool outputs or follow from
them in **one step** — a sum, a difference, a rounding, a list total. Two exceptions keep it fair:
- amounts **the user named** are theirs to quote back;
- **round advice figures** ("about $80 a week") aren't claims about the data.

**Calibrate it against the judge.** A code check can be confidently wrong too. Compare what it flags with
what the certified judge failed, and tune the rules until they agree.

**A typical set of agent code checks:** figure grounding, the right tool for the question, valid tool
names and arguments, loop sanity, currency format, no internal names leaked, tripwires for account numbers
and risky products, and a complete trace — run over every recorded run and in CI.

**Everyday analogy:** an auditor checking an expense report against the receipts. No one needs to know the
"right" total in advance; every number on the report must trace back to a receipt.

## Real example
The first version of Tide's figure check passed only **57%** of answers — mostly false alarms (sums of three
balances, the user's own "$240"). After calibration it flagged **14** answers, and the judge had failed **12**
of them, usually for the very figure flagged: a card total off by a dollar, or a purchase total that
double-counted a pending charge.

## Mental model / why it matters
Hand-written answer keys go stale the moment the data changes, which for an agent on live data is
constantly. The trace sidesteps that: it records exactly what the agent was *told*, so "did it say anything
it wasn't told?" becomes a mechanical check. That catches the most dangerous failure in a money app —
invented or mis-added figures — for free, on every run, and leaves the expensive judges for tone and
usefulness.

## How to apply (in practice / consulting)
- Record full traces (tool calls and outputs). That's the prerequisite.
- Write the grounding check first; it's usually the highest-value code check for a data-backed agent.
- Calibrate against a certified judge before trusting it: measure the overlap of flags and fails.
- Run it over every historical run as well as in CI, since it's free.

## Provenance & caveats
Distilled 2026-10-04 from tide's landing draft `evals/lessons/kc-05-code-checks-before-judges.md` (tide #334),
checked against tide `evals/LIFECYCLE.md` ("The first version passed 57% and was mostly false alarms") and
`docs/evals-map.html` ("flagged 14 answers; the judge had failed 12 of them").
- ⚠️ "$240" and "$80 a week" are illustrative figures from the draft, not account data.

## Connections
- **builds-on [Code-check best practices](code-check-best-practices.md)**: the agent-specific trick.
- **builds-on [Evals test judgment; unit tests test math](evals-test-judgment.md)**: the proposed grounding check, now built.
- **used-with [Aligning an LLM judge](aligning-an-llm-judge.md)**: calibrate against the judge; judges for judgment.
- **used-with [Error analysis on traces](error-analysis-on-traces.md)**: the trace is both the evidence and the answer key.
