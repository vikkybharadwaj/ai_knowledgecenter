---
title: You can't evaluate what you can't see — instrument first
slug: instrument-before-you-evaluate
kind: concept
spine_layer: patterns
tags: [evals, traces, observability, tool-use]
connections:
  - { to: error-analysis-on-traces, type: enables, why: "Error analysis reads traces; a trace that drops the tool outputs hides the most common root cause." }
  - { to: frozen-replay, type: enables, why: "The recorded tool outputs are exactly what a replay serves back, so instrumenting is what makes fixes provable." }
  - { to: anatomy-of-an-agent-harness, type: used-with, why: "Instrumentation is the harness watching itself: one span per loop turn, model call and tool call." }
  - { to: offline-vs-online-evals, type: builds-on, why: "Mocked fixtures needed no tracing because the data was invented; testing the real agent on real data does." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PRs #314, #316)", retrieved: 2026-10-06 }
date: 2026-10-06
depth: seedling
claude_specific: false
---

# You can't evaluate what you can't see — instrument first

## TL;DR
Before writing a single eval, make every answer **fully visible**: the question, every model call, and every
tool call **with its full output**. Error analysis, root-causing and proving fixes all depend on that record.
Tide's rebuild began here, as phase 0, because the old evals faked every tool result and production recorded
no tool outputs at all.

## The idea, simply
Each turn of the agent becomes a small tree of records (*spans*):
- one for the **turn** (the agent's whole answer);
- one per **model call**;
- one per **tool call**, holding the tool's **full output**.

Send that tree somewhere you can search and annotate it (Tide uses an observability platform built on the
open OpenTelemetry/OpenInference standard). Three practical rules:
- **Mask before you send.** Mask names, emails and long digit runs, but keep amounts, dates and merchants,
  or the traces are useless for checking facts.
- **Limit whose content is exported** (Tide: only the owner's test account).
- **Don't trust auto-instrumentation blindly.** It missed the streaming tool calls Tide uses, so the spans are
  written by hand.

**Everyday analogy:** a car's diagnostic port. Without it, a mechanic can only listen to the noise and guess.
With it, they read exactly which sensor reported what, and when.

## Real example
Tide's Coach emits one span tree per turn. The first mistake caught: the tracing switched itself on during the
test suite and leaked four test traces; it was fixed to stay off in tests and the traces were deleted. The
payoff: when round 1 failed 53 of 100 answers, the recorded tool outputs showed that **45 of the 53** came from
the prompt, a tool, the engine or the data — something no transcript of the answer alone could have shown.

## Mental model / why it matters
An answer is the *last* step of a chain. Without the tool outputs you can see *that* it's wrong, but not
*where* it went wrong — and for an agent, "where" is usually upstream of the model. Instrumentation turns
"the AI said something wrong" into "the tool returned the wrong window, and the AI repeated it".

## How to apply (in practice / consulting)
- Make tracing the first deliverable of any eval engagement.
- Check that tool **outputs** (not just tool names) are captured; that's the field teams forget.
- Decide the masking policy with the client up front, and test that tracing stays off in test runs.

## Provenance & caveats
From tide `evals/LIFECYCLE.md` phase 0 and `docs/EVALS_STRATEGY.md` §7 at `a3ed538` (2026-10-06): span
types, key- and value-based masking, the allowlisted user, manual spans because auto-instrumentation missed
Bedrock `ConverseStream` tools, the four leaked test traces (#316), and 45 of 53 system-side failures (phase 4).
- ❓ Tool and vendor names (Arize AX, OpenInference) are Tide's choices, not recommendations.

## Connections
- **enables [Error analysis on traces](error-analysis-on-traces.md)**: you can't code what you can't see.
- **enables [Frozen replay](frozen-replay.md)**: the recorded outputs are what a replay serves.
- **used-with [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md)**: the harness watching itself.
- **builds-on [Offline vs online evals](offline-vs-online-evals.md)**: real data needs real tracing.
