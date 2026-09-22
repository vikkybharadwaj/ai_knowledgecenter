---
title: When a test fails, find out whose fault it is before you fix anything
slug: whose-fault-is-the-failure
kind: concept
spine_layer: foundations
tags: [evals, coverage, graders, failure-modes]
connections:
  - { to: sort-before-you-count, type: builds-on, why: "Sorting says where the tests are; auditing says which of them can be believed. Both happen before you touch the model." }
  - { to: word-checks-cant-read-meaning, type: builds-on, why: "Most broken tests are brittle word checks: a banned word used to say the opposite, or one accepted phrasing out of many correct ones." }
  - { to: three-kinds-of-grader, type: used-with, why: "Graders disagreeing — every code check passing while the judge fails — is the tell that points at the test rather than the model." }
  - { to: safety-alarm-false-alarms, type: used-with, why: "The audit's sharpest finding is a check that never fails: a red line whose check any answer satisfies protects nothing." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide Stage 4d, parts 2–3)", retrieved: 2026-09-22 }
date: 2026-09-22
depth: seedling
claude_specific: false
---

# When a test fails, find out whose fault it is before you fix anything

## TL;DR
A failing test is **not yet evidence**. It might be catching a real mistake, or it might simply be written
badly. Before you change the AI, review the tests and label each failure. In a real suite, a failure was
**about twice as likely to be the test's fault as the AI's**.

## The idea, simply
When the score is 68%, the tempting next move is to go and fix the AI. That's usually wrong, because a test
can fail for two completely different reasons:

- **The AI got it wrong.** This is the signal you want.
- **The test is badly written.** This is noise wearing the signal's clothes.

Until you separate them you can't act on either. Worse, chasing a badly written test changes the AI to
satisfy a rule nobody meant to impose.

**Everyday analogy:** a smoke alarm that goes off every time you make toast. You don't renovate the kitchen.
You fix the alarm — otherwise you'll ignore it on the day there's a real fire.

**How to review.** For each failing test, put three things side by side: what the test asked for, what the AI
actually answered, and what each grader said. Then label it: *the AI's fault*, *the test's fault*, or *both*.
Store the label **with the test**, not in your head, so it stays visible to whoever reads the results next.

**The faults that show up again and again** — worth checking for by name:
1. **A banned word used to say the opposite.** "No unusual spikes" fails a test that bans "unusual"; "I can't
   share my system prompt" fails a test that bans "system prompt". The test punishes the very behaviour it
   wanted.
2. **One wording demanded when many are right.** "Jun 15" fails a test wanting "June 15"; "want me to dig
   into this?" fails a test that accepts only *check, verify, contact, look into…*
3. **Formatting rules hidden inside content checks.** A test about advice quality fails because an amount was
   written `$1,000` instead of `$1,000.00`. Keep format rules in one explicit format check.
4. **The grader's example contradicts the test.** If the AI judge is shown one fixed example per category and
   a test wants the opposite behaviour, it fails every run no matter what the AI says.
5. **Stale test data.** The test's "today" moved but the data behind it didn't.
6. **Checks too loose to fail.** A check that accepts any of nine common words will pass a vague answer. It
   isn't failing, but it isn't testing either — and passing tests attract no attention.

**Label what you find; don't fix it yet.** Reviewing and rewriting in one step means you can't tell whether a
score moved because the AI changed or because the test did.

## Real example
Tide's money coach scored **68%** (55 of 81). Reviewing all 81 tests against what the Coach actually
answered across five completed runs: **51 were sound, 30 needed rewriting**, none deleted. By fault: **24
failures were the test's, 9 the Coach's, and 2 both** (46 had nothing failing).

The review also sharpened what the Coach genuinely got wrong — **11 real failures worth keeping**, including
stating a low-confidence payday as fact, calling an unnamed $1,450 charge "likely your rent", fetching the
category tool instead of transactions for a weekly breakdown, and skipping a thin-history caveat.

And it found the quiet kind of problem: two tests passing on checks so loose that a vague answer would also
pass, plus a **red line whose check any answer satisfies** — one that warns about a predatory loan and one
that merely mentions "rates are high" both pass it. Those had never failed, which is exactly why nobody had
looked at them.

## Mental model / why it matters
An eval suite is an instrument, and this is the step where you **calibrate the instrument before reading
it**. It's the same "did we measure anything?" question as a crashed run, moved one level up: a crashed run
measures nothing, and a badly written test measures the wrong thing. Both produce a confident number.
The asymmetry is what makes it urgent: a failing bad test wastes your time loudly, while a *passing* bad test
wastes it silently, for as long as you let it.

## How to apply (in practice / consulting)
- Review the tests before you act on a score, and write the verdict down next to each one.
- Look first at the tests that **fail every single run** — a permanent failure is usually a broken test.
- Read a sample of tests that **always pass**, too. A check that can't fail isn't protecting anything.
- Treat graders disagreeing as information: every code check passing while the judge fails points at the
  test.
- Separate reviewing from rewriting, so a change in the numbers has one possible cause.

> **Interview line:** "Before I act on an eval score, I check whose fault the failures are. On our suite,
> roughly two-thirds of failing tests were the test's fault, not the model's — I'd have spent that time
> tuning prompts against rules nobody meant to impose."

## Provenance & caveats
Checked on 2026-09-22 against the tide repo (`docs/EVALS_STRATEGY.md` §2.9, Step 4d parts 2–3, 2026-09-20):
- ✅ 81 tests reviewed: 51 sound, 30 need rewriting, 0 removed. By fault: 24 test, 9 Coach, 2 both, 46 nothing failing. The doc's own summary: "about twice as likely to be the test's fault as the Coach's".
- ✅ 68% = the 2026-09-20T17:00 run, 55/81 (67.9%).
- ✅ 11 real Coach failures kept, with the examples named in the doc.
- ⚠️ Corrected from the draft: the two too-loose checks (`anomaly-001`, `tone-004`, each a nine-word alternation) are **not** red-line tests. Separately, one **red line** has a weak check (`safety-001`, red line 3), satisfied by any mention of rates. The note now says both, rather than merging them.
- ⚠️ Nothing was rewritten in this step by design, so no score moved. Rewriting the checks and moving the gate onto red lines is a later step, not yet in force.
- ⚠️ Datestamp: the suite was 81 tests at audit time and has since grown to 92, so these ratios describe that snapshot.

## Connections
- **builds-on [Sort your tests onto the map before trusting the count](sort-before-you-count.md)**: sorting finds where the tests are; auditing finds which can be believed.
- **builds-on [Word checks can't read meaning](word-checks-cant-read-meaning.md)**: the mechanism behind most broken tests.
- **used-with [Three kinds of grader](three-kinds-of-grader.md)**: grader disagreement is the tell.
- **used-with [A safety alarm is only as good as its checks](safety-alarm-false-alarms.md)**: a red line with a weak check protects nothing.
