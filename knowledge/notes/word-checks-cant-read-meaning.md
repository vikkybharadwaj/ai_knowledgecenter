---
title: Word checks can't read meaning (the spam-filter problem)
slug: word-checks-cant-read-meaning
kind: concept
spine_layer: foundations
tags: [evals, graders, llm-as-judge]
connections:
  - { to: three-kinds-of-grader, type: part-of, why: "Word checks are the first of the three grader kinds; this note is the deep dive on their blind spot." }
  - { to: one-run-is-a-sample, type: used-with, why: "A brittle word check turns harmless rewording between runs into pass/fail flips, which inflates the noise floor." }
  - { to: safety-alarm-false-alarms, type: used-with, why: "Safety gates built from word checks inherit this blind spot, at the one place where a false alarm blocks a release." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# Word checks can't read meaning (the spam-filter problem)

## TL;DR
A *word check* looks for exact words in the AI's answer, like "must include $2,340" or "must NOT say payday
loan". It's fast and free, but it sees **words**, not **meaning**, so it fails good answers all the time. Use
word checks for exact facts; use checks that understand meaning for everything else.

## The idea, simply
Word checks break in four common ways:

1. **Formatting.** The check wants `$2,200.00`; the AI writes `$2,200`. Right number, and the check fails it.
2. **Wording.** The check wants "bank app"; the AI writes "bank's app". Right advice, and the check fails it.
3. **Negation.** The check says "fail if the answer contains *anomaly*". The AI says "**no** anomalies found".
   The check can't see the "no".
4. **Dates.** The check wants "March 27"; the AI writes "2026-03-27". Same date, and the check fails it.

**Everyday analogy:** a spam filter that blocks every email containing the word "scam", including the email
from your bank that says "watch out for this scam".

## Real example
In Tide's eval suite, **84% of the automated code checks were word matches** (188 of 225). In **16 of 27**
failures in one run, a word check said "fail" while an AI judge that read the whole answer said "pass". Later
runs showed the same pattern. The AI said "you're **not**
bad with money", a kind reframe, and a rule failed it for containing "bad with money". The AI said "I'd
**steer you away from** payday loans", the safest possible reply, and a safety rule failed it for containing
"payday loans".

## Mental model / why it matters
A word check measures *phrasing*, not *quality*. So when the model gets better at phrasing (warmer, more
natural, more careful), a brittle suite reports it as a **regression**. The suite ends up punishing exactly
the improvements you're trying to make.

## How to apply
- **Keep word checks for things that must be exact:** a specific number (with tolerant formatting), or a
  banned phrase that's never OK in any context.
- **Check behaviour, not wording:** "did the AI look up the bills before answering?" (a tool-call check) is
  sturdier than "does the answer contain these words?"
- **Use an AI judge for meaning:** "did the coach *recommend* a payday loan?" is a question about meaning,
  not words.
- **Be tolerant with numbers and dates:** accept `$2,200` and `$2,200.00`; match dates in any format.

> **Interview line:** "String-matching checks measure phrasing, not quality. When the model improves its
> wording, a brittle suite reports it as a regression."

## Provenance & caveats
- ✅ 118 must-contain + 70 must-not-contain = 188 of 225 code checks (83.6%). Counting the AI judge, which runs on all 81 tests, word matches are 61% of all checks.
- ✅ 16 of 27 failures in run `2026-09-18T11-07`. Caveat: that run still used the live clock, so some of the 16 are date problems.
- ✅ The two quoted examples are real but come from later runs: "not bad with money" is `tone-006` (`T16-12`); "steer you away from payday loans" is `distress_resources-001` (`T18-01`). The four failure patterns all exist in the suite (`$2,200.00`, "bank app", "No anomalies flagged", `conf-003` failing on "2026-03-27").
All checked against the tide repo on 2026-09-18 by a separate fact-check pass.

## Connections
- **part-of [Three kinds of grader](three-kinds-of-grader.md)**: word checks are grader #1; this is their blind spot in depth.
- **used-with [One run is a sample](one-run-is-a-sample.md)**: brittle checks turn rewording into flips.
- **used-with [A safety alarm is only as good as its checks](safety-alarm-false-alarms.md)**: the same blind spot, at the highest-stakes gate.
