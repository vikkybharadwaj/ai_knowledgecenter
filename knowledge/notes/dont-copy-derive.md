---
title: Don't copy, derive — two copies of one fact will drift apart
slug: dont-copy-derive
kind: concept
spine_layer: foundations
tags: [evals, reliability, single-source-of-truth]
connections:
  - { to: freeze-everything-the-model-sees, type: used-with, why: "Most leaks into a 'frozen' eval were copies that drifted: a model name, an answer-length limit, a live date." }
  - { to: repository-as-system-of-record, type: builds-on, why: "Same principle, applied inside the repo: one authoritative place for each fact, everything else reads from it." }
  - { to: harness-engineering-discipline, type: used-with, why: "Importing production's prompt and tools into the eval harness removes a whole class of drift by construction." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# Don't copy, derive — two copies of one fact will drift apart

## TL;DR
Whenever the same fact is stored in two places (a model name, a limit, a count and the list it counts), one
copy eventually changes and the other doesn't. **Keep one source and derive everything else from it.** If two
copies really must exist, make the difference visible and check it automatically.

## The idea, simply
Eval systems copy facts from the real app all the time: which model it uses, how long answers can be, what the
data looks like. Each copy is a small promise to keep two things in sync by hand, and those promises break
quietly.

**Everyday analogy:** writing your address on two forms. You move house, update one form, forget the other, and
your mail goes missing for months before anyone notices.

## Real examples (all from one eval system, all the same bug)

| Fact | The copy that went stale |
|---|---|
| Which AI model to use | The eval's copy of the model name was retired; the real app's copy kept working. Tests crashed for 3 months. |
| How long answers may be | Tests allowed shorter answers than the real app, so long answers were cut off. |
| The date | The test data was frozen mostly in June; the "today" line read the live clock. |
| A count and its list | A public page said "30 tests" in a badge but showed only 8 cards (one for a test that no longer existed). Someone updated the badge, not the list. |

The fix Tide shipped for the prompt and tools is the model to copy: the eval runner **imports** the production
system prompt and tool definitions instead of keeping its own version, so those two can't drift any more.

## Mental model / why it matters
A copy isn't data; it's a **scheduled silent failure**. You don't know when it'll fire, only that it will, and
it fails without an error, because both copies still look valid. The cure isn't more discipline. It's removing
the *ability* for the two to disagree.

## How to apply
- **Import, don't retype.** If the app defines something, have the tests read it from the same place.
- **When a copy is unavoidable,** label it as a mirror of the original and check it automatically (for example,
  confirm the model answers before every run).
- **Generate docs from data.** A test list on a web page should be built from the test files, never typed by
  hand.
- **Give every doc an owner rule.** If a folder changes, something should remind you which doc to update.

> **Interview line:** "Every hardcoded copy of a production value in your eval harness is a scheduled silent
> failure. The fix is to remove the ability for the two to disagree."

## Provenance & caveats
Checked on 2026-09-18 against the tide repo by a separate fact-check pass:
- ✅ The eval config had `COACH_MODEL = 'claude-sonnet-4-20250514' // same as production`. Production used the Bedrock profile `us.anthropic.claude-sonnet-4-20250514-v1:0`, which kept serving.
- ✅ Answer limits: eval 1,024 vs production 4,096 tokens (fixed in `ddfed05`).
- ✅ Frozen dates: 59 June, 19 March, 2 April, 1 February, hence "mostly June".
- ✅ `docs/evals-map.html` (at `7737094`) showed a "30 FIXTURES" badge and 8 cards, one of them for the deleted `proj-acc-007`. Generating the list from the fixture files is planned (Tide Stage 5), not yet shipped.
- ✅ Prompt and tools are imported from production (`evals/runner.ts` imports `buildCoachSystemPrompt` and `coachToolConfig`).

## Connections
- **used-with [Freeze everything the model can see](freeze-everything-the-model-sees.md)**: most leaks were drifted copies.
- **builds-on [The repository is the agent's only durable memory](repository-as-system-of-record.md)**: one authoritative place per fact.
- **used-with [Harness engineering](harness-engineering-discipline.md)**: import-from-production removes drift by construction.
