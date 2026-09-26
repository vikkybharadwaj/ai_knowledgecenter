---
title: Error analysis on real traces — read, note, group, count — is the most important activity in evals
slug: error-analysis-on-traces
kind: concept
spine_layer: foundations
tags: [evals, error-analysis, traces, failure-modes]
connections:
  - { to: dimensions-vs-slices, type: enables, why: "Error analysis produces the failure taxonomy; the MECE failure map is that taxonomy organized by stage." }
  - { to: whose-fault-is-the-failure, type: used-with, why: "Before counting a failure, decide if it's the AI's or the test's — the same discipline applied to failing tests." }
  - { to: two-kinds-of-eval-check, type: enables, why: "Each recurring failure mode becomes one evaluator: a code check if a rule can decide it, a judge if not." }
  - { to: humans-and-automation-in-evals, type: used-with, why: "This is the step you must not hand fully to automation — criteria emerge from reading traces." }
source: { url: "https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html", author: "Hamel Husain & Shreya Shankar", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Error analysis on real traces — read, note, group, count — is the most important activity in evals


## TL;DR
Don't start by writing metrics. Start by **reading ~100 real traces** and writing a plain note on what went
wrong in each (**open coding**), then **group the notes into under ~10 failure modes and count them**
(**axial coding**). Keep going until new traces stop revealing new failures (**saturation**). The counted
list — your **failure taxonomy** — tells you which evals to build first. Error analysis is to evals what
product discovery is to product.

## The idea, simply
**A trace** is the full record of one interaction: the user's input, the system prompt, everything the
system did in between (retrieval, tool calls, intermediate model calls), and the final output.

**Step 1 — pick the traces.** A random sample first, for coverage. Then add targeted ones:
- **outliers** — unusually long conversations, many retries, strange lengths;
- traces your **existing evals flag**;
- **stratified** samples across user types or features;
- if everything looks fine, **stress-test** with requests that push your prompt's rules.
Generic metrics can help here — not as grades, but as a way to sort traces into "worth a look".

**Step 2 — open coding: write notes.** One domain expert reads each trace and writes free-text notes on
whatever bothers them, plus pass/fail. Rules that keep it useful:
- Annotate **at least 30 traces yourself** before letting any AI suggest failures.
- Note only the **first upstream failure** — later errors are usually its consequences.
- Describe the problem from the **user's point of view**; don't diagnose the root cause yet.
- Start by annotating **failures only**.

**Step 3 — axial coding: group and count.** Read all the notes and cluster them into named failure modes —
aim for **fewer than 10**. Then count each. The counts decide where to invest. (An LLM can help cluster; a
human checks the result.)

**Step 4 — iterate to saturation.** After your first ~30, an agent can search the rest for likely instances
of the failures you've named; you accept or reject its suggestions. Aim for **at least 100 diverse traces**,
and keep going while you're still learning — stop when new traces don't add or change failure modes.

**Step 5 — turn the taxonomy into action.** For each failure mode: if it's a missing instruction, **fix
the prompt**. If it recurs and you'll iterate on it, build an evaluator — code check if a rule can decide
it, LLM judge if not.

**Why humans first?** Because of **criteria drift**: you don't know your criteria until you see failures.
The *Advanced evals* example: an agent would have caught an unaddressed sales objection automatically — but
only if someone had already written "objection handling" into its criteria, and nobody knew to until a human
read that trace.

**Everyday analogy:** a doctor's rounds. You don't order every test on every patient. You examine patients,
note what's wrong, notice that five of them have the same symptoms, and *then* decide what to test for.

## Mental model / why it matters
Every other eval step assumes you know **what** to measure. Error analysis is where that knowledge comes
from, which is why it's "the most important activity in evals". It's also the direct cure for vanity
dashboards: every eval you build traces back to a counted, real failure. Two numbers make it practical:
**30** traces before trusting any AI help, **100+** before trusting the taxonomy.

## How to apply (in practice / consulting)
- Budget the first week of any eval engagement for error analysis, not tooling.
- Build (or have a coding agent build) a **tiny custom review screen** showing each trace the way the user
  saw it, with the intermediate steps one click away. Removing friction from reading data pays back fast.
- Keep the note-taker constant: one benevolent dictator per product area.
- Present the result as a ranked, counted list of failure modes with an example of each. It's the most
  persuasive artifact in an eval project.

## Provenance & caveats
Sources (retrieved 2026-09-26): FAQ *Why is error analysis so important… and how is it performed?* (2025-06-27,
mod. 2026-09-01) — four steps, 30 traces, first failure, saturation, ~100 traces; Husain & Shankar,
*Building eval systems…* (Lenny's, 2025-09-09) — ~100 interactions, critiques, under 10 modes, counting;
*Advanced evals* (Lenny's, 2026-09-22, paywalled — visible part) — error discovery as product discovery,
criteria drift, annotation rules; FAQ *How do I surface problematic traces…?* and *How can I efficiently
sample…?* — sampling; Hamel Husain 2024 — remove friction from looking at data.
- ❓ Practitioner methodology; the 30 / 100 / "under 10" figures are the authors' heuristics.

## Connections
- **enables [Dimensions vs slices](dimensions-vs-slices.md)**: the taxonomy becomes the failure map.
- **used-with [Whose fault is the failure](whose-fault-is-the-failure.md)**: separate the AI's failures from the test's.
- **enables [Two kinds of eval check](two-kinds-of-eval-check.md)**: each recurring failure mode becomes one check.
- **used-with [Humans and automation in evals](humans-and-automation-in-evals.md)**: the step you keep human.
