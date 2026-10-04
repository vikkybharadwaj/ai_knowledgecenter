---
title: Frozen replay — prove a fix when the data won't sit still
slug: frozen-replay
kind: concept
spine_layer: patterns
tags: [evals, tool-use, traces, regression]
connections:
  - { to: offline-vs-online-evals, type: builds-on, why: "It's the controlled-experiment idea applied to proving a fix: freeze the world a LIVE run actually saw, so only your change differs." }
  - { to: freeze-everything-the-model-sees, type: builds-on, why: "Same rule — tool outputs AND the clock must come from the recording, not the environment." }
  - { to: tool-call-taxonomy, type: used-with, why: "Replay works at the tool_use/tool_result seam: each recorded tool_result answers the replayed tool_use." }
  - { to: same-judge-blind-grading, type: used-with, why: "A frozen world on both sides needs a frozen, blind grader on both sides too." }
  - { to: fix-the-layer-it-lives-in, type: contrasts-with, why: "Replays can't prove tool, data or engine fixes — the recording holds the old outputs. Those need live re-runs." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PRs #331, #334)", retrieved: 2026-10-04 }
date: 2026-10-04
depth: seedling
claude_specific: false
---

# Frozen replay — prove a fix when the data won't sit still

## TL;DR
An agent that reads live data gives a different answer tomorrow for **two reasons at once**: your change,
and the world changing (a paycheck lands, a bill posts). A live before/after can't tell them apart. So
**record** a live run — each question, the moment it was asked, and every tool call with its exact output —
then **replay** it under the new prompt or model, with the clock pinned to the recording and every tool
call answered from the recording. Now only your change differs.

## The idea, simply
**Matching tool calls on replay**
- **Exact** — same tool, same arguments → return the recorded output.
- **Approximate** — same tool, different arguments → return the recorded output, but flag it.
- **Off-script** — a call that was never recorded → a clear error. **Never invent data.**

Count them: scenarios with off-script calls are less-clean comparisons.

**When to use it, and when not**
- ✅ **Prompt and model changes**, including a model upgrade.
- ❌ **Tool, data or engine fixes** — the recording holds the *old* outputs, so the fix is invisible. Prove
  those with a **live re-run**.
- ⚠️ The model is still random — in Tide, about **29% of identical inputs** gave a different answer — so read
  *why* each verdict changed, and add repeats before claiming small gains.

**Everyday analogy:** a flight-data recorder you can re-fly. You replay the exact weather and instrument
readings from a real flight, swap in a new autopilot setting, and see what it would have done differently.
But you can't use the old recording to test a repaired engine — that needs a new flight.

## Real example
The recording froze questions like "can I afford a $90 dinner tonight?" (illustrative figures), the moment
each was asked, and the spending tool's output. Three prompt iterations replayed against it moved passes
**47 → 52 → 56** of 100, and **57** counting a targeted re-run. A category-data fix shipped after the
recording couldn't show up in any replay, so it was proven live instead.

## Mental model / why it matters
Replay turns a noisy *field test* into a controlled *experiment*. It's the offline-eval idea (freeze the
world) with one twist: the frozen world isn't authored by hand — it's **captured from a real run**, so it's
realistic by construction. Its limit is just as important: it freezes the world *outside* the model, so it
can only test changes *inside* the model's instructions.

## How to apply (in practice / consulting)
- Log tool calls with their exact arguments and outputs, plus a timestamp, from day one. That's the raw
  material for replay.
- Before comparing, classify the change: prompt or model → replay; tool, data or engine → live re-run.
- Report the exact / approximate / off-script counts next to any replay result.

## Provenance & caveats
Distilled 2026-10-04 from tide's landing draft `evals/lessons/kc-01-frozen-replay.md` (tide #334), checked
against tide `evals/LIFECYCLE.md` and PR #331:
- ✅ Iteration 1 reached 52; the last full replay reached 56/100, and 57 counting the targeted re-run.
- ✅ "About 29% of identical inputs give a different answer" (LIFECYCLE.md); the draft rounded it to ~30%.
- ⚠️ The $90 dinner is an illustrative figure, not real account data.

## Connections
- **builds-on [Offline vs online evals](offline-vs-online-evals.md)**: a frozen world, captured from a live run.
- **builds-on [Freeze everything the model can see](freeze-everything-the-model-sees.md)**: tools and the clock both come from the recording.
- **used-with [Tool call, function call, MCP, skill](tool-call-taxonomy.md)**: recorded tool_results answer replayed tool_uses.
- **used-with [Same judge on both sides, blind](same-judge-blind-grading.md)**: a frozen grader to match the frozen world.
- **contrasts-with [Fix the failure in the layer it lives in](fix-the-layer-it-lives-in.md)**: tool and engine fixes need live re-runs.
