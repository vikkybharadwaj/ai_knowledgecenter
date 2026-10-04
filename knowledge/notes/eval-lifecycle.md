---
title: The eval lifecycle, end to end — eight steps in a loop
slug: eval-lifecycle
kind: concept
spine_layer: patterns
tags: [evals, lifecycle, error-analysis]
connections:
  - { to: what-is-an-eval, type: builds-on, why: "An eval is one sensor; the lifecycle is how sensors get found, built, trusted and kept current." }
  - { to: error-analysis-on-traces, type: used-with, why: "Steps 3–4 (grade, then group by first upstream cause) are error analysis." }
  - { to: frozen-replay, type: used-with, why: "Step 6 proves prompt and model fixes on frozen replays." }
  - { to: production-to-eval-flywheel, type: used-with, why: "Step 8 hands over to the flywheel, which loops back to step 1." }
source: { url: null, author: "Vik — distilled in-house from the Tide Coach evals rebuild (tide PRs #329–#334)", retrieved: 2026-10-04 }
date: 2026-10-04
depth: seedling
claude_specific: false
---

# The eval lifecycle, end to end — eight steps in a loop

## TL;DR
Evals are a loop, not a test suite you write once. **Write realistic questions → run the real system and
record everything → a human grades first → group failures by their first upstream cause → fix each cause
in the layer it lives in → prove each fix fairly → read every verdict that changed → automate what's
objective.** Then go round again.

## The eight steps
1. **Write realistic questions from dimensions** — who's asking, which job they want done, which step of a
   good answer the question strains, how it's phrased.
2. **Run the real system on real data and record everything** — every model call and every tool output, so
   a failure can be traced to where it started (and replayed later).
3. **A human grades first** — pass/fail plus the first upstream failure. An AI judge may grade the rest only
   after it agrees with the human on examples it wasn't tuned on.
4. **Group failures by first upstream cause** (axial coding). Most turn out to be the system's fault — a
   prompt that never said, a tool that returned the wrong thing — not the model's reasoning.
5. **Fix the cause in the layer it lives in** — prompt, tool, engine or data.
6. **Prove each fix** — frozen replays for prompt and model changes; live re-runs for tool and engine
   changes; the same frozen judge on both sides, blind to which is which.
7. **Read every changed verdict, refine, repeat** — a fix can overreach.
8. **Automate** — code checks for everything objective; per-type judges, certified on a held-out human test
   set, for the judgment calls; report a bias-corrected rate with a range.

**Everyday analogy:** a hospital's quality loop. Collect cases, have a senior doctor review them, find the
root cause of each bad outcome, fix the process (not just the one patient), check the fix actually helped
without harming anything else — then make the routine checks automatic.

## Real example
Tide's money coach, round 1: **47 of 100** scenarios passed. Grouping the 53 failures by first upstream
cause found **45 were prompt, tool, engine or data problems**, not model reasoning. Three prompt iterations
proven on frozen replays took it to **56** on the last full replay (**57** counting a targeted re-run); an
engine fix and tool fixes were proven on live re-runs; a fresh live run of all 100 then measured everything
together.

## Mental model / why it matters
The ten mental models say what each part *is*; the lifecycle says what order you do them in, and adds the
step most teams skip — **steps 5–7, fixing and proving**. Without them, evals measure but never improve the
product. With them, every number has a cause, every fix has proof, and every regression gets read.

## How to apply (in practice / consulting)
- Use the eight steps as the project plan for an eval engagement; each step has a clear output (question
  set, traces, graded sample, failure taxonomy, fixes, proofs, regressions read, automated suite).
- Record traces from day one — steps 4 and 6 are impossible without them.
- Track where each fix lives (prompt / tool / engine / data). If everything is a prompt fix, look again.

## Provenance & caveats
Distilled 2026-10-04 from the tide session's landing draft `evals/lessons/kc-00-lifecycle.md` (tide #334),
checked against tide `evals/LIFECYCLE.md` and the round-1 records:
- ✅ Round 1: 47 of 100 passed; 45 of 53 failures were prompt, tool, engine or data problems; replays reached 56/100 on the last full replay and 57 counting the targeted re-run (tide PR #331).
- ❓ Practitioner method (shaped by Husain & Shankar's approach), applied to one product.

## Connections
- **builds-on [What is an eval](what-is-an-eval.md)**: from one sensor to the whole loop.
- **used-with [Error analysis on traces](error-analysis-on-traces.md)**: steps 3–4.
- **used-with [Frozen replay](frozen-replay.md)**: step 6.
- **used-with [The production-to-eval flywheel](production-to-eval-flywheel.md)**: step 8 loops back to step 1.
