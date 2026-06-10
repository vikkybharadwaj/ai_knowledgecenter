---
title: "Containment vs discrimination — two ways to organize the stack, for two different questions"
slug: containment-vs-discrimination
kind: concept
spine_layer: patterns
tags: [mental-model, organization, claude-code, learning]
connections:
  - { to: automation-control-flow-spectrum, type: used-with, why: "That where×trigger grid IS the discrimination view of the keep-working family; this lens names why a grid (siblings), not a ladder (levels), is the right shape for choosing." }
  - { to: prompt-context-harness-engineering, type: used-with, why: "prompt ⊂ context ⊂ harness ⊂ loop is the containment view; this lens explains it answers 'what's inside what,' which is a different question than 'which do I pick.'" }
  - { to: designing-loops-not-prompts, type: builds-on, why: "Resolves where loop engineering sits: the ④ containment ring for understanding, AND a discrimination grid for deciding — placement and content answer different questions." }
  - { to: tool-call-taxonomy, type: used-with, why: "Same disambiguation move at a smaller scale — the docs separate a confusable family by question, not by stacking it into levels." }
source: { url: "https://code.claude.com/docs/en/agents", author: "code.claude.com/docs (/agents, /workflows, /scheduled-tasks, /routines), distilled in-house", retrieved: 2026-06-09 }
date: 2026-06-09
depth: budding
claude_specific: true
---

# Containment vs discrimination — two ways to organize the stack, for two different questions

> **TL;DR.** When a Claude Code family blurs together (the coordination primitives; the "keep Claude working"
> primitives), you can organize it two ways, and they are **not rivals — they answer different questions.**
> **Containment** answers *"what runs inside what"* (a nesting ladder, good for **understanding**).
> **Discrimination** answers *"which one do I reach for"* (a sibling table split on axes, good for **deciding**).
> Confusing the two is what makes "is this a level or a cousin?" feel ambiguous.

## The two lenses
- **Containment (nesting / a ladder).** `prompt ⊂ context ⊂ harness ⊂ loop`, or worktrees nesting *under* a
  coordination approach. It states a true *is-inside* relationship: a loop re-runs harness passes; a routine
  *"runs a session on a schedule"* (a trigger wrapped **around** a whole session). Use it to **see the stack**.
- **Discrimination (a sibling table / a grid).** `/loop` vs `/goal` vs a routine; subagents vs agent view vs
  teams vs workflows. These are **alternatives you pick between**, not a stack you climb. Use it to **make the
  choice** at the moment you have to.

## What the official docs actually do
The docs lean **discrimination**, and they fence the two families apart:
- The [agents page](https://code.claude.com/docs/en/agents) compares the coordination primitives with three
  **questions** ("who coordinates? do workers talk? same files?") — siblings, not a ladder — and then
  explicitly says the keep-working features "solve **a different problem** than splitting work across agents."
- The [scheduled-tasks page](https://code.claude.com/docs/en/scheduled-tasks) organizes `/loop` / routines /
  desktop tasks with a **"Compare scheduling options" table** whose spine row is *"Requires open session."*

So the docs almost never draw a nesting ladder — they draw **pick-between tables**, because a reader's real
question at the point of use is "which one?", and those are alternatives.

## The reconciliation (the move worth keeping)
A blurry family usually needs **both lenses at once** — applied to different jobs:
1. **Place it by containment.** On the mental-model page, loop engineering is the ④ outermost ring (`… ⊂ loop`)
   — that placement is containment-correct and matches the docs' "a routine wraps a session" language.
2. **Fill it by discrimination.** Inside that section, render the where×trigger grid, because that is how you
   actually choose — and it's the exact shape the docs use.

The tell that you need both: the keep-working family **straddles the session boundary** — `/loop`·`/goal`·hooks
drive turns *inside* a session, routines·cron·Actions fire a whole session from *outside*. A single clean
"level" can't hold that; a grid with a "where it runs" axis can. (See [the where×trigger grid](automation-control-flow-spectrum.md).)

## How to apply (in practice / consulting)
- **When a family confuses a client, ask which question they're asking.** "How does this fit together?" →
  draw the containment ladder. "Which do I use here?" → draw the discrimination table. Answering the wrong one
  is why explanations land flat.
- **Don't force a ladder.** If the members straddle a boundary (in-session vs unattended; local vs cloud), a
  level is the wrong primitive — reach for a grid with that boundary as an axis.
- **Mirror the source's shape.** Anthropic's docs teach these as pick-between tables; matching that shape keeps
  derived material (slides, internal wikis) consistent with what a client will later read upstream.

## Connections
- **used-with [Keeping Claude working — the two axes](automation-control-flow-spectrum.md)** — that grid is the discrimination view this lens names and justifies.
- **used-with [Prompt ⊂ Context ⊂ Harness engineering](prompt-context-harness-engineering.md)** — the containment ladder; this lens says what question it answers.
- **builds-on [Design loops, not prompts](designing-loops-not-prompts.md)** — placement (containment) vs content (discrimination) resolves where loop engineering sits.
- **used-with [The tool-call taxonomy](tool-call-taxonomy.md)** — same separate-by-question move on a smaller confusable family.
