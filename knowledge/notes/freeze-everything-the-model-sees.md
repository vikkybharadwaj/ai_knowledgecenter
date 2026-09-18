---
title: Freeze everything the model can see — including the date and the conversation
slug: freeze-everything-the-model-sees
kind: concept
spine_layer: foundations
tags: [evals, fixtures, context-engineering]
connections:
  - { to: offline-vs-online-evals, type: builds-on, why: "That note defines the eval as a controlled experiment; this one lists every input that has to be frozen for the experiment to stay controlled." }
  - { to: dont-copy-derive, type: used-with, why: "Leaks usually come from copies: a limit copied from production that drifted, or a date read live instead of from the test." }
  - { to: tool-call-taxonomy, type: used-with, why: "Tool results are the obvious frozen input: the fixture answers every tool_use with a canned tool_result." }
  - { to: harness-vs-context-engineering, type: used-with, why: "'Everything the model can see' is the context window. Freezing an eval is context engineering done for repeatability instead of accuracy." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# Freeze everything the model can see — including the date and the conversation

## TL;DR
An eval is a controlled experiment, so **everything** the AI can see must come from the test itself: the
pretend data, **today's date**, the **whole conversation**, and the **same limits as the real app**. If
anything leaks in from the outside world, scores change for reasons that have nothing to do with the AI.

## The idea, simply
The point of testing with pretend data (a *fixture*: one prepared test case) is that nothing changes between
runs except the AI. Then, if the score moves, you know why.

It's easy to freeze the obvious thing, the pretend account data, and forget the quieter inputs:

- **The date.** If the system prompt says "Today is…" using the real clock, a test written in June but run in
  September tells the AI it's September while its data says June.
- **The conversation.** If a test has several messages but only the last one is sent, the AI is asked "can you
  break *that* down?" without ever seeing what "that" was.
- **The limits.** If the test allows shorter answers than the real app, long answers get cut off mid-sentence
  and look like failures.

**Everyday analogy:** a science experiment where you control the temperature but not the time of day. If
sunlight changes the result, you'll blame the wrong thing.

## Real example
One Tide test (`proj-acc-002`) was written for a world where "today" was 24 March and payday was **27 March**.
The runner stamped the prompt with the real date, 18 September. So the AI said, correctly, "that payday looks
like it's in the past", and the similarity grader scored it **1 out of 5**, a fail, for reasoning *better* than
the test expected. After each test got its own required frozen date, the same test scored **4 out of 5** and
passed.

Another test (`proj-acc-008`) asked "can you break that down by week?" The runner never sent the earlier message
about spending, so the AI sensibly asked "break *what* down?" and was marked as failing. The fix sends the whole
history to the AI and to both judges. Note that the test **still fails** afterwards, now because the AI picks the
wrong tool. Freezing the inputs doesn't make a test pass; it makes the failure *honest*.

And the limits: the eval allowed answers of 1,024 tokens while the real app allows 4,096, so long answers were
cut off and recorded as crashes.

## Mental model / why it matters
The model's whole world is its context window. In production you curate that window for *accuracy*; in an
eval you also freeze it for *repeatability*. Anything in the window that isn't set by the test is an
uncontrolled variable, and it will eventually move.

## How to apply
- List every input the AI sees: data, date/time, conversation, user profile, settings, limits. Ask of each
  one: *does it come from the test, or from the outside world?*
- Give every test its own "today" and make it **required**, so a new test can't forget it.
- Send the whole conversation, to the AI **and** to the AI judges.
- Match the real app's limits (answer length, model, settings) by importing them, not retyping them.

> **Interview line:** "An eval is only a controlled experiment if every input the model observes comes from
> the fixture. Tool data is the obvious one. The clock is the one people forget."

## Provenance & caveats
Checked on 2026-09-18 against the tide repo (PR #234) by a separate fact-check pass:
- ✅ Per-test frozen dates are implemented and **required**: commit `45e40fe` (merged in #234). `evals/runner.ts` throws if a test has no date, and all 81 tests have one. `proj-acc-002` went from similarity 1 → 4, fail → pass (runs `2026-09-18T11-07` vs `T16-12`).
- ✅ Conversation history now reaches the AI (`runner.ts`) and both judges (`judges/transcript.ts`). `proj-acc-008` still fails after the fix (it calls `get_spending_by_category` instead of `query_transactions`).
- ✅ Limits: the eval used `max_tokens: 1024` against production's `maxTokens: 4096` (`bedrock_service.ts:182`). Fixed in `ddfed05`.
- ❌ Corrected from the draft: it said the stale payday was in *June* and merged two tests into one story. The 1/5 → 4/5 case was a **March 27** payday. (The June 22 case, `payday_anchors-004`, only moved 2 → 3.)

## Connections
- **builds-on [An offline eval is a controlled experiment](offline-vs-online-evals.md)**: this is the checklist that keeps the experiment controlled.
- **used-with [Don't copy, derive](dont-copy-derive.md)**: most leaks are copies that drifted.
- **used-with [Tool call, function call, MCP, skill](tool-call-taxonomy.md)**: the `tool_result` is the most obvious frozen input.
- **used-with [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md)**: freezing an eval is context engineering for repeatability.
