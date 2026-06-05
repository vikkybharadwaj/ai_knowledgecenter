# AI Knowledge Center — working instructions

This repo is a **personal, self-organizing knowledge base for the Claude tech stack**. It is NOT an
application — no app to run, no build, no tests. Your job is to help **capture, distill, and — above
all — CONNECT** knowledge into one evolving mental-model map, and to keep the two public views clean.

## The one rule: connect the dots
This base exists to fight knowledge silos. **Every note must be wired into the bigger picture** — typed
connections to its neighbours and a place on the spine. A note that connects to nothing is a failure,
not a draft. Structure **emerges** from those connections; it is never imposed up front.

## The two views
1. **Concepts** — the single learning view at `docs/concepts/`. Holds the Claude Code mental model,
   comparison matrix, decision guide, and primitive deep-dives, plus the self-organizing **concept graph**
   of atomic notes (`docs/concepts/graph.html`, generated from `knowledge/notes/`). This is the open-ended half.
2. **CCA-F Exam Prep** — the exam hub at `docs/concepts/exam.html` (about the exam → `practice.html` quiz →
   `scenarios.html`) + its markdown companions in `exam-prep/`. Preserve it; don't reorganize it.

## Structure
- `knowledge/notes/<slug>.md` — **flat pool** of atomic notes (one idea each). No topic folders, no levels.
- `knowledge/maps/big-picture.md` — the **spine + narrative synthesis** (the dot-connecting map). Keep it current.
- `knowledge/maps/<topic>.md` — emergent Maps of Content; create one **only when a cluster earns it**.
- `knowledge/README.md` — the **Home Note** (dashboard/entry). Hand-curated.
- `exam-prep/` — markdown companions for the Exam view.
- `docs/` — the site. `docs/assets/knowledge.js` is **generated** — never hand-edit it.
- `.claude/skills/land/` — the `/land` ingestion skill. `.claude/hooks/validate-note.sh` — the note guard.
- `scripts/build-index.py` — regenerates the graph data from note frontmatter.

## Note schema (every note)
```yaml
---
title: <idea as a claim/concept>
slug: <kebab = filename>
kind: concept                 # concept | scenario
spine_layer: claude-code      # foundations | api | agent-sdk | claude-code | patterns | products
tags: [mcp, tool-use]         # broad axis (site grouping)
connections:                  # deep axis: >=1 for concepts; most-specific type + a why
  - { to: <slug>, type: used-with, why: "<one sentence>" }
source: { url: <or null>, author: <or null>, retrieved: YYYY-MM-DD }
date: YYYY-MM-DD
depth: seedling               # seedling | budding | evergreen (maturity, not a level)
claude_specific: true
---
```
Connection types: `builds-on · enables · alternative-to · used-with · part-of · contrasts-with · used-in`.
Each note also carries a human-readable `## Connections` section mirroring the frontmatter.

## How to add knowledge
- Prefer the **`/land`** skill — it distills, files, connects, updates the map, regenerates the index,
  and teaches where the idea fits. (See `.claude/skills/land/SKILL.md`.)
- After any note change, **`python3 scripts/build-index.py`** to refresh the graph. Confirm **0 dropped
  edges** and **no orphans**.
- The validation hook will block a note with missing frontmatter or zero connections — heed it.

## Conventions
- **Atomic & in your own words.** One idea per note; explain the *why* and *how to apply (consulting)*.
- **Claude-specific.** Keep content tied to the Claude/Anthropic stack unless it's a genuinely
  foundational cross-cutting model.
- **Connect, don't dump.** 2–5 typed connections per note, each with a one-line reason.
- **Datestamp** anything with a shelf life (models, prices, previews). **Cite** sources; never paste
  full copyrighted text.
- **Don't pre-build empty maps or folders.** Indexes emerge from accumulated notes.

## LEARNINGS loop
When you discover something non-obvious about *organizing* this vault (a tool quirk, a better structure,
a correction), append a dated line to the top of `LEARNINGS.md` — don't wait to be asked.

## Workflow
- Independent git history. Conventional commits: `docs:`, `chore:`, `feat:`, `fix:`. Branch before
  committing on `main`.
- The site is published via GitHub Pages from `/docs`. No typecheck/lint/tests — the bar is: clear,
  correct, **connected**, and well-indexed.

## Out of scope
- No secrets/API keys or employer-confidential material. No full-article copies — summarize + link.
