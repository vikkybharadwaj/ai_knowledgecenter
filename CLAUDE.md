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
   comparison matrix, decision guide, and primitives, plus the **concept dependency graph**
   (`docs/concepts/graph.html`). **The graph plots tech-stack CONCEPTS, not notes** — the primitives,
   systems, and patterns of the Claude stack (Tool Use, MCP, Subagents, Worktrees, Orchestration…) wired
   by **strict dependency** edges (`runs-on · depends-on · part-of · uses`, arrows point to what a thing
   needs) so you can learn the stack visually, bottom-up the spine. Concepts live in `knowledge/concepts/`;
   the **atomic notes are their SOURCES** — distilled article content each concept links to for depth.
   This is the open-ended half.
2. **CCA-F Exam Prep** — the exam hub at `docs/concepts/exam.html` (about the exam → `practice.html` quiz →
   `scenarios.html`) + its markdown companions in `exam-prep/`. Preserve it; don't reorganize it.

## Structure
- `knowledge/concepts/<slug>.md` — **flat pool of tech-stack CONCEPTS** (the graph nodes): one primitive/
  system/pattern each, with a summary, strict dependency `edges`, and `sources` (note slugs). These are
  what the graph renders.
- `knowledge/notes/<slug>.md` — **flat pool** of atomic SOURCE notes (one distilled idea each). No topic
  folders, no levels. Notes back concepts; they are no longer the graph's nodes.
- `knowledge/maps/big-picture.md` — the **spine + narrative synthesis** (the dot-connecting map). Keep it current.
- `knowledge/maps/<topic>.md` — emergent Maps of Content; create one **only when a cluster earns it**.
- `knowledge/README.md` — the **Home Note** (dashboard/entry). Hand-curated.
- `exam-prep/` — markdown companions for the Exam view.
- `docs/` — the site. `docs/assets/knowledge.js` is **generated** — never hand-edit it.
- `.claude/skills/land/` — the `/land` ingestion skill. `.claude/hooks/validate-note.sh` — the note guard.
- `scripts/build-index.py` — regenerates the graph data from **concept + note** frontmatter.

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

## Concept schema (every concept — the graph nodes)
```yaml
---
title: Tool Use
slug: tool-use                # kebab = filename
kind: primitive               # primitive | system | pattern | concept
layer: api                    # foundations | api | agent-sdk | claude-code | patterns | products
summary: <one line, 2-4 sentences — the explainer shown in the reader>
edges:                        # strict dependencies to OTHER concepts (>=1; arrows point to what it NEEDS)
  - { to: messages-api, type: runs-on, why: "<one sentence>" }
sources: [claude-api-agent-primitives]   # note slugs that go deeper (may be empty)
---
<optional short body — appended under the summary in the reader>
```
Edge types — two families. **Dependency** (solid, directional, points to what a thing needs):
`runs-on · depends-on · part-of · uses`. **Relation** (dashed, non-directional, a sibling/complement —
not a dependency): `used-with · alternative-to`. Prefer a dependency type; use a relation only when the
link genuinely isn't a dependency (e.g. Agent teams *alternative-to* Subagents; Skills *used-with* CLAUDE.md).

## How to add knowledge
- Prefer the **`/land`** skill — it distills a source into an atomic **note**, then **attaches that note
  to the concept(s) it explains** (and adds a new concept node only when the stack genuinely gained a part).
  It updates the map, regenerates the index, and teaches where the idea fits. (See `.claude/skills/land/SKILL.md`.)
- After any concept/note change, **`python3 scripts/build-index.py`** to refresh the graph. Confirm
  **0 dropped concept edges** and **no orphan concepts**, and that every `sources` slug resolves to a real note.
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
