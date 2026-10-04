---
title: Fix the failure in the layer it lives in — prompts for behaviour, tools and data for facts
slug: fix-the-layer-it-lives-in
kind: concept
spine_layer: patterns
tags: [evals, tool-use, prompts, debugging]
connections:
  - { to: harness-vs-context-engineering, type: builds-on, why: "Same principle, applied to evals: where a bug lives tells you which level to fix — and a prompt can't fix a tool." }
  - { to: error-analysis-on-traces, type: builds-on, why: "Grouping by first upstream cause is what tells you the layer." }
  - { to: tool-call-taxonomy, type: used-with, why: "Many 'model' failures are tool_result failures — the model faithfully repeated a wrong output." }
  - { to: frozen-replay, type: contrasts-with, why: "A layer below the prompt can't be proven on a replay; it needs a live re-run." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PRs #332, #333)", retrieved: 2026-10-04 }
date: 2026-10-04
depth: seedling
claude_specific: false
---

# Fix the failure in the layer it lives in — prompts for behaviour, tools and data for facts

## TL;DR
When an agent says something wrong, the tempting fix is a new prompt rule. But **a prompt can't reliably
out-argue a confidently wrong tool**. Trace the failure to its first upstream cause and fix it **there** —
the tool's output, the engine's math, the data, or the prompt. Rule of thumb: **prompt for behaviour and
judgment; tools and data for facts.**

## The idea, simply
For every failure, ask: *where did the wrong thing first enter?*
- **Prompt** — the model was never told how to behave (tone, when to ask, what to emphasise).
- **Tool** — the tool returned the wrong thing, or not enough of it.
- **Engine** — the calculation behind the tool is wrong.
- **Data** — the underlying records are wrong, duplicated or miscategorised.

Fix it in that layer. A prompt rule that contradicts a tool's output makes the model argue with its own
evidence, and it usually loses.

**Everyday analogy:** a GPS with an out-of-date map. You can tell the driver "ignore the GPS when it says to
turn into a lake", but it's better to update the map.

## Real example
On a day that was both payday and month end, the safe-to-spend engine looked ahead only one day, so "this
week" multiplied a one-day figure across days it couldn't see. After the tool's description was corrected,
the coach started **defending** the impossible number. A prompt sanity rule ("a window can never exceed cash
plus its income") was ignored in **5 of 5** cases. The fix that worked was in the **engine**.

Two more of the same shape: "pending and posted are one charge" was already a shared database filter, but
the agent's tools never applied it; and a tool that returned only the *next* paycheck made "what comes in
next month?" unanswerable until it returned the whole schedule.

## Mental model / why it matters
This is the harness-level insight applied to evals: **where a bug lives tells you which level to fix**. A
model is a reasoner over the evidence it's given. Feed it a wrong fact and it will reason correctly to a
wrong answer, and a prompt can only plead with it. Fixing facts at their source fixes every answer that
depends on them, including ones you haven't tested.

## How to apply (in practice / consulting)
- Tag every failure with its layer during error analysis. If a client's fixes are all prompt rules, look
  again.
- When a prompt rule keeps getting ignored, suspect the tool output it's fighting.
- Remember that layer fixes need **live** proof — a frozen replay still holds the old outputs.

## Provenance & caveats
Distilled 2026-10-04 from tide's landing draft `evals/lessons/kc-04-fix-the-layer-it-lives-in.md` (tide #334);
the engine and tool fixes shipped in tide #332 (safe-to-spend v5.6) and #333 (each charge once, full pay
schedule).
- ❓ The "5 of 5 ignored" figure is from the tide session's draft and wasn't independently recomputed here.

## Connections
- **builds-on [Harness vs Context vs Prompt Engineering](harness-vs-context-engineering.md)**: where a bug lives tells you which level to fix.
- **builds-on [Error analysis on traces](error-analysis-on-traces.md)**: first upstream cause names the layer.
- **used-with [Tool call, function call, MCP, skill](tool-call-taxonomy.md)**: many model failures are tool_result failures.
- **contrasts-with [Frozen replay](frozen-replay.md)**: layer fixes need live re-runs.
