---
title: Evals test judgment; unit tests test math
slug: evals-test-judgment
kind: concept
spine_layer: foundations
tags: [evals, unit-tests, grounding, tool-use]
connections:
  - { to: offline-vs-online-evals, type: builds-on, why: "Mocked tool data is what separates the two layers: the eval assumes the math is right and asks only how the agent handles it." }
  - { to: tool-call-taxonomy, type: used-with, why: "Link 1 of the chain is the tool_use block (which tool, what input); link 3 is what the model does with the tool_result." }
  - { to: three-kinds-of-grader, type: used-with, why: "Tells you which grader can check which link. The one that matters most, 'did it use the right numbers?', needs the data in front of the grader." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval system (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# Evals test judgment; unit tests test math

## TL;DR
An AI product has two layers: **code that computes numbers**, and **an AI that decides what to do with them and
explains them**. Test the numbers with normal software tests. Test the AI's judgment with evals. Then make sure
the link *between* them, "did the AI use the right numbers?", is tested too, because it's the easiest one to
miss.

## The idea, simply
Think of every AI answer about data as a chain of three links:

1. **Did the AI pick the right tool, and ask it the right thing?** (e.g. "look up upcoming bills for this month")
2. **Did the tool return the right numbers?** (the code's math)
3. **Did the AI use those numbers correctly in its answer?** (this is called *grounding*)

- **Link 2** is ordinary code, so ordinary software tests (*unit tests*: exact inputs, exact expected outputs)
  check it best.
- **Links 1 and 3** are AI judgment, so they need evals.

In an eval the tools usually return *pretend* data. That's deliberate: it separates "is the math right?" (not
the eval's job) from "does the AI handle the numbers well?" (the eval's job).

| | Deterministic layer (data, arithmetic) | Agent layer (judgment, communication) |
|---|---|---|
| Example | Bank data → a service computes "safe to spend: $127.50" | Picks tools, interprets the result, explains it to a stressed person |
| Nature | Same input → same output | Probabilistic |
| Tested by | **Unit tests** | **Evals** |

**Everyday analogy:** a calculator and an accountant. You test the calculator by checking its sums. You test the
accountant by checking whether they typed the right figures in and explained them properly.

## Real example
Tide's eval suite checked link 1 only partly (that a tool was *called*, by name, not what it was asked for) and
barely checked link 3. A few word checks looked for an exact number, and they broke on formatting. The AI judge
wasn't shown the data, so it couldn't check numbers at all. So the most important question for a money app,
*"did the AI tell the user the right number?"*, was the least tested thing in the suite.

## Mental model / why it matters
Evals and unit tests aren't competitors; they own different links of one chain. The dangerous place is the
**seam** between them. Each side assumes the other covers it, so nobody does. In a money app that seam is where
users get hurt: a correct calculation, quoted wrong.

## How to apply
- Keep the number-crunching code covered by unit tests. Don't expect evals to catch math bugs.
- Add evals for link 1: the right tool, *asked for the right thing* (e.g. the right date range).
- Add evals for link 3, and make them strong. For example: **every dollar amount the AI says must appear in the
  data it looked up.** That one check catches made-up numbers.

> **Interview line:** "Evals and unit tests aren't competitors. Unit tests own the arithmetic, evals own the
> judgment, and the seam between them, grounding, is where money apps get hurt."

## Provenance & caveats
- ✅ The tool check compares tool **names** only; the input is never checked (`evals/judges/code_checks.ts`).
- ✅ The AI judge sees tool names, never tool data (`evals/judges/llm_judge.ts`).
- ❓ "Every dollar amount must appear in the tool data" is a proposed check, not yet built in Tide.
Checked against the tide repo on 2026-09-18 by a separate fact-check pass.

## Connections
- **builds-on [An offline eval is a controlled experiment](offline-vs-online-evals.md)**: pretend data is what separates the layers.
- **used-with [Tool call, function call, MCP, skill](tool-call-taxonomy.md)**: link 1 is the `tool_use`, link 3 is what happens after the `tool_result`.
- **used-with [Three kinds of grader](three-kinds-of-grader.md)**: which grader can check which link.
