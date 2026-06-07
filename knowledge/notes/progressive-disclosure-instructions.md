---
title: One giant instruction file fails — structure CLAUDE.md by progressive disclosure
slug: progressive-disclosure-instructions
kind: concept
spine_layer: claude-code
tags: [claude-md, context-engineering, instructions, harness]
connections:
  - { to: repository-as-system-of-record, type: builds-on, why: "The repo holds the instructions; this is how to shape those files so the landing page stays small and findable." }
  - { to: harness-engineering-discipline, type: part-of, why: "It's the design discipline for the Instructions subsystem of the five-subsystem harness." }
  - { to: claude-code-architecture, type: used-with, why: "Directly governs how to write the CLAUDE.md every Claude Code session loads." }
  - { to: prompt-context-harness-engineering, type: builds-on, why: "A 600-line instruction file is a context-engineering failure — it crowds out the code and tool output the model actually needs." }
source: { url: "https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-04-why-one-giant-instruction-file-fails/", author: "Walking Labs (Learn Harness Engineering)", retrieved: 2026-06-07 }
date: 2026-06-07
depth: budding
claude_specific: true
---

# One giant instruction file fails — structure CLAUDE.md by progressive disclosure

**TL;DR** — Every mistake tempts you to "add a rule," so `CLAUDE.md`/`AGENTS.md` only grows. A 600-line
instruction file (~10–20K tokens) crowds out the code, tool output, and history the model needs,
**and** buries your real constraints where the model won't read them. The fix is **progressive
disclosure**: a small always-loaded entry file that links to detailed topic docs the agent pulls
*on demand*.

## The four failure mechanisms of a bloated file
1. **Context-budget exhaustion** — 10–20K tokens of standing instructions leaves too little room for
   the actual task on anything complex.
2. **Lost-in-the-middle** (Liu et al., 2023) — LLMs attend strongly to a document's start and end and
   weakly to the middle; a hard constraint at line 300 of 600 has a high chance of being ignored.
3. **Indistinguishable priority** — a red-line ("never use `eval()`"), a style preference, and a
   historical war-story all look identical, so the agent can't tell rules from suggestions.
4. **Instruction decay** — files only grow; deletion *feels* risky and addition *feels* free, so the
   signal-to-noise ratio rots over time.

## The architecture: overview now, detail on demand
- **Entry file** (`CLAUDE.md`/`AGENTS.md`, 50–200 lines): 1–2 sentence overview, quick-start commands,
  **≤15 non-negotiable global constraints**, and links to topic docs *with their applicability conditions.*
- **Topic docs** (`docs/`, 50–150 lines each): API patterns, DB rules, testing standards, security
  policy — loaded only when the task touches them.
- **Code-embedded info**: types, interface comments, config explanations — naturally visible while
  reading code, so no duplication in the instruction file.

**Rule of hygiene:** every instruction should record its *origin*, its *applicability condition*, and
its *removal criteria* — otherwise you can't safely shrink the file later.

## Mental model / why it matters
An instruction file isn't a junk drawer; it's a **routing table**. The entry file's job is to be
small enough to always fit and ordered so the red-lines sit at the extremes (start/end) where
attention is highest — then *route* to depth on demand. The lecture's team went from 45%→72% task
success and 60%→95% security-constraint compliance just by refactoring one fat file into entry +
topic docs. Note the second number: compliance rose because the constraints became *findable*, not
because there were more of them. More text ≠ more control; **placement and structure are the control.**

## How to apply (in practice / consulting)
- **Cap and split.** When a client's `CLAUDE.md` passes ~200 lines, that's the signal to extract topic
  docs and leave ≤15 hard constraints in the entry file. Put the red-lines at top and bottom.
- **Tag every rule with a removal criterion.** It's the only thing that lets the file shrink instead
  of only grow — directly attacks instruction decay.
- **Lean on Claude Code's own progressive disclosure.** Nested `CLAUDE.md` files, `@import`s, and
  skills that load only when triggered are the native expression of this pattern — wire detail behind
  triggers rather than front-loading it into the always-on context.

## Connections
- **Builds on [[repository-as-system-of-record]]** — the repo is where instructions live; this is how
  to shape them so the always-loaded landing page stays small and the detail stays findable.
- **Part of [[harness-engineering-discipline]]** — the design discipline for the harness's
  Instructions subsystem.
- **Used with [[claude-code-architecture]]** — governs how to author the `CLAUDE.md` every session loads.
- **Builds on [[prompt-context-harness-engineering]]** — a 600-line instruction file is a
  context-engineering failure: standing tokens crowding out the working set.
