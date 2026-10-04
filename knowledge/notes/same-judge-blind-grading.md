---
title: Same judge on both sides, blind to which side is which
slug: same-judge-blind-grading
kind: concept
spine_layer: patterns
tags: [evals, llm-as-judge, graders, regression]
connections:
  - { to: aligning-an-llm-judge, type: builds-on, why: "A certified judge is the precondition; this is how to use it fairly in a before/after comparison." }
  - { to: frozen-replay, type: used-with, why: "Replay freezes the world; this freezes the grader. Together, only the change differs." }
  - { to: execution-context-isolation, type: used-with, why: "Separate grader agents each get a fresh context with only the rubric and the conversation — no knowledge of the change." }
  - { to: humans-and-automation-in-evals, type: used-with, why: "The judges grade, but a human still reads every verdict that changed." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PRs #331, #334)", retrieved: 2026-10-04 }
date: 2026-10-04
depth: seedling
claude_specific: false
---

# Same judge on both sides, blind to which side is which

## TL;DR
A before/after comparison is only fair if the **same grader** scores both sides. If "before" was graded
partly by a human and partly by an AI judge, and "after" entirely by the judge, a difference can come from
the graders rather than the change. So **freeze the judge, re-grade "before" with it where needed, and keep
graders blind** to which side an answer came from.

## The technique
- **Freeze the judge** before the comparison — fingerprint its brief so it can't drift mid-experiment.
- **Re-grade the "before" answers** with that same judge wherever they were graded differently.
- **Blind the graders:** give them only the rubric and the conversation — never which side it came from or
  what the change was.
- **Use separate grader agents** (for example, one per batch of 25). Each pass stays focused, and none
  inherits the bias of whoever made the change.
- **A human still reads every verdict that changed.**

**Everyday analogy:** a blind taste test. The same judges taste both recipes, they don't know which is new,
and the chef who changed the recipe isn't on the panel.

## Real example
Round 1 mixed 20 owner grades with 80 judge grades. Before comparing, the frozen judge re-graded the 20
owner-graded answers — it agreed **20 of 20**, though partly in-sample — so both sides were the judge's.
Five blind grader agents scored the replays, and reading their changed verdicts caught **four places where
the new prompt rules overreached**.

## Mental model / why it matters
An experiment has two places noise can sneak in: the *world* and the *measurement*. Frozen replay pins the
world; this pins the measurement. Blindness matters because whoever made the change *wants* it to work —
humans and agents primed with "this is the improved version" grade more kindly. Fresh-context grader agents
are the cheap, structural way to remove that bias.

## How to apply (in practice / consulting)
- Never compare numbers produced by different graders. Re-grade one side first.
- Strip "before/after", "v2" and change descriptions from what graders see.
- Split grading across fresh agents in batches, then have a human read the diff of verdicts, not the totals.

## Provenance & caveats
Distilled 2026-10-04 from tide's landing draft `evals/lessons/kc-02-same-judge-blind-grading.md` (tide #334),
checked against tide `docs/evals-map.html`: the judge re-graded all 20 owner-graded answers, 20/20, "partly
in-sample".
- ⚠️ 20/20 is partly in-sample, so it shows consistency rather than certifying the judge; certification still needs a held-out set.

## Connections
- **builds-on [Aligning an LLM judge](aligning-an-llm-judge.md)**: certify it, then use it fairly.
- **used-with [Frozen replay](frozen-replay.md)**: freeze the world and the grader.
- **used-with [One shared context vs many isolated contexts](execution-context-isolation.md)**: fresh grader agents can't inherit bias.
- **used-with [Humans and automation in evals](humans-and-automation-in-evals.md)**: a human reads every changed verdict.
