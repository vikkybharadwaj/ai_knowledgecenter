---
title: A fix can overreach — read every regression, not just the total
slug: fixes-can-overreach
kind: concept
spine_layer: foundations
tags: [evals, prompts, regression]
connections:
  - { to: prompt-context-harness-engineering, type: used-with, why: "Every prompt rule has a blast radius: a rule written for one failure fires in places nobody pictured." }
  - { to: error-analysis-on-traces, type: builds-on, why: "Reading each Pass→Fail is error analysis on the regressions a fix created." }
  - { to: frozen-replay, type: used-with, why: "Replay the whole set after each fix, so a rising total can't hide new failures." }
  - { to: one-run-is-a-sample, type: used-with, why: "A total is a sample that hides its composition; read why verdicts moved, not just the sum." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PR #331)", retrieved: 2026-10-04 }
date: 2026-10-04
depth: seedling
claude_specific: false
---

# A fix can overreach — read every regression, not just the total

## TL;DR
Every rule you add to a prompt has a **blast radius**: written for one failure, it fires in places nobody
pictured. The pass total can rise while new failures appear underneath it. So after each fix, **re-run the
whole set, list every case that went Pass → Fail, and read why**.

## The technique
1. After each fix, re-run (or replay) the **whole** set, not just the cases you were fixing.
2. List every **Pass → Fail** case.
3. Read the reason for each. Tighten the rule's wording until every regression is understood.
4. Prove narrow wording changes on just the scenarios they can touch (a targeted replay).

**Everyday analogy:** a new medicine that cures the headache and upsets the stomach. "Headaches down 40%" is
real, but you still read the side-effect reports before prescribing it to everyone.

## Real example
One iteration added four rules: *ask when the question is ambiguous*, *a statement balance isn't debt*,
*offer crisis resources*, *name uncovered card payments*. The total rose **47 → 52** — but four previous
passes broke:
- a clear "I'm stressed about my card bills" got a question back instead of the amounts;
- balances were described as "not necessarily debt";
- a crisis line was offered for "I need $500 by Friday";
- only two of three card payments were named.

Tightening those four took it to **56**. The next replay surfaced two more side effects (credit-card
borrowing offered as a "safer route", a crisis reply with no figures), fixed on a targeted replay.

## Mental model / why it matters
A pass total is a **net** number: improvements minus regressions. A rising net can hide a new failure that
matters more than all the gains — like a crisis line offered to someone who just needs a budget. Reading the
diff of verdicts, not the total, is what keeps a prompt from slowly turning into a pile of over-broad rules.

## How to apply (in practice / consulting)
- Report every prompt change as **"+X fixed, −Y regressed"**, never just the new total.
- Write rules as narrowly as possible, and test narrow rules only on the scenarios they can affect.
- Keep a list of rules and the failure each was written for; when a rule overreaches, you know what it was
  protecting.

## Provenance & caveats
Distilled 2026-10-04 from tide's landing draft `evals/lessons/kc-03-fixes-can-overreach.md` (tide #334),
checked against tide `evals/LIFECYCLE.md` (iteration 1 → 52) and PR #331 (final 56, 57 targeted).
- ⚠️ "$500 by Friday" is the user's own illustrative request, not account data.
- ⚠️ The draft placed this on the Claude API layer; it's filed under Foundations here, alongside prompt engineering.

## Connections
- **used-with [Prompt vs Context vs Harness Engineering](prompt-context-harness-engineering.md)**: prompt rules have a blast radius.
- **builds-on [Error analysis on traces](error-analysis-on-traces.md)**: error analysis on the regressions.
- **used-with [Frozen replay](frozen-replay.md)**: replay the whole set after each fix.
- **used-with [One run is a sample](one-run-is-a-sample.md)**: read the composition, not the sum.
