---
name: land
description: >-
  Land (ingest) a doc, article, blog, or URL into the AI Knowledge Center and CONNECT THE DOTS.
  Use whenever Vikram says "land this", "add this to the knowledge center", "ingest", "capture this
  article/doc", or pastes a URL/text to file away. Distills the source into an atomic note, places it
  on the Big-Picture spine, wires 2–5 typed connections to existing notes, updates the map, regenerates
  the graph index, and teaches where the new idea fits.
allowed-tools: Read, Write, Edit, WebFetch, WebSearch, Bash, Glob, Grep, Agent
---

# /land — ingest and connect a new piece of knowledge

The whole point of this knowledge center is **connecting the dots**: every new concept must be
force-fit into the single evolving mental-model map, never dropped into a silo. This skill is that
engine. Follow every step — the dot-connecting steps (4–6) are not optional.

## Input (auto-detect)
The argument may be any of:
- **a URL** → fetch it with WebFetch.
- **a file path** that exists → Read it.
- **pasted text / a topic** → use the argument text directly.
If nothing is given, ask what to land.

## Before you write — load the existing graph
1. `Glob knowledge/concepts/*.md` and skim the concept titles/`slug`/`layer` — these are the **graph
   nodes** the new note will attach to. Then `Glob knowledge/notes/*.md` and skim titles +
   `slug`/`tags`/`spine_layer` so you know what sources already exist. Read
   [`knowledge/maps/big-picture.md`](../../../knowledge/maps/big-picture.md) for the current spine and
   narrative. You can't connect dots you haven't seen.

## Steps
1. **Detect & read** the source (above).
2. **Distill into atomic note(s).** One idea per note, titled as a claim/concept. Write in *Vikram's
   voice*, **Claude-tech-stack–specific**, in his own words — distill, don't dump. If a source covers
   several ideas, prefer multiple atomic notes over one fat note. Each note body should include:
   - a **TL;DR**,
   - the substance (clear, greppable),
   - a **"Mental model / why it matters"** section (this is a learning vault — explain the *why*),
   - a **"How to apply (in practice / consulting)"** section (theory → real client use).
   **2.5. VERIFY BEFORE YOU WRITE (required — this is the source-of-truth gate).** This vault is
   Vikram's single source of truth; he will *not* go back to the official docs or the original article
   once something lands. So before committing claims to a note, run an **adversarial verification**
   pass against [`verification-rubric.md`](verification-rubric.md):
   - **Fact-check every Claude Code / Anthropic claim against the official docs** (`code.claude.com/docs`,
     `docs.claude.com`) — use the **claude-code-guide** agent (or the **claude-api** skill / WebFetch),
     **never** model memory. Articles use terms loosely and over-claim parity; assume nothing.
   - **Tag each claim's provenance** in the note: ✅ verified (cite the doc) · ⚠️ partial/nuance ·
     ❓ author's claim/unverified · ❌ corrected (and apply the fix). Map every loose term to the
     **official** one (e.g. "connectors" → MCP servers); mark non-Claude claims (Codex, etc.) as
     out-of-scope. Add a short **"Provenance & caveats"** section recording corrections + datestamp.
   - A note may not land with an unresolved ❌. (On a PR, the `knowledge-fact-checker` subagent reruns
     this same rubric on the diff — see the rubric's "How to run the check".)
3. **Place on the spine.** Assign `spine_layer` ∈ `foundations | api | agent-sdk | claude-code |
   patterns | products`. If it's a real-world build situation, set `kind: scenario` (else `concept`).
4. **CONNECT THE DOTS (required).** Identify **2–5** existing notes this relates to and add typed
   `connections` in frontmatter, each with a one-line `why`. Pick the *most specific* relationship:
   `builds-on · enables · alternative-to · used-with · part-of · contrasts-with · used-in`.
   Add a matching human-readable **## Connections** section at the bottom of the note. A `concept`
   note may **never** ship with zero connections — if you can't find one, you haven't understood it yet.
5. **Update the Big Picture.** In [`knowledge/maps/big-picture.md`](../../../knowledge/maps/big-picture.md):
   add a link to the new note under its spine-layer heading, and if the idea genuinely shifts the
   story, update the narrative. Refresh the table in [`knowledge/README.md`](../../../knowledge/README.md).
6. **Scenarios.** If the new concept suggests a concrete real-world use and no scenario note covers it,
   create/extend a `kind: scenario` note and link concepts into it with `used-in`.
7. **Wire into the CONCEPT map (the graph nodes).** The graph plots tech-stack **concepts** in
   `knowledge/concepts/`, not notes — notes are their *sources*. So:
   - **Attach the new note as a source** to the concept(s) it explains: add the note slug to that concept
     file's `sources:` list. Most lands only deepen an existing concept — this is the common case.
   - **Add a new concept node only when the stack genuinely gained a part** — a real primitive, system, or
     pattern that wasn't represented. Mirror the concept schema (summary, `kind`, `layer`, **strict
     dependency `edges`** of `runs-on · depends-on · part-of · uses` pointing to what it needs, and
     `sources`). Don't mint a concept for every article — that recreates the notes-as-nodes mistake.
8. **Regenerate the index.** Run `python3 scripts/build-index.py`. Confirm output shows **0 dropped
   edges** (notes) **and 0 dropped concept edges**, **no orphan concepts**, and no "sources pointing at
   unknown notes" warning. Fix any typo'd `to:`/`sources:` slug and re-run.
9. **Datestamp & log.** Use today's date. If you learned something non-obvious about *organizing* the
   vault, append a dated line to [`LEARNINGS.md`](../../../LEARNINGS.md) (newest at top).
10. **Teach it back (in the CLI).** Tell Vikram, in a few lines:
   *where it landed on the spine*, *which concept(s) it now backs (or the new concept it added and its
   dependencies)*, and *which gap/scenario it feeds*. This is the payoff — make the dot-connection visible.

## Note frontmatter (copy this shape exactly)
```yaml
---
title: <the idea as a claim/concept>
slug: <kebab-case-matching-filename>
kind: concept                 # concept | scenario
spine_layer: claude-code      # foundations | api | agent-sdk | claude-code | patterns | products
tags: [mcp, tool-use]         # broad axis: site grouping/filter
connections:                  # deep axis: ≥1 for concepts; most-specific type
  - { to: claude-code-architecture, type: used-with, why: "<one sentence>" }
source: { url: <or null>, author: <or null>, retrieved: 2026-06-04 }
date: 2026-06-04
depth: seedling               # seedling | budding | evergreen  (maturity, not a level)
claude_specific: true
---
```
The note filename is `knowledge/notes/<slug>.md`. Put any image next to it in the same folder.

## Guardrails
- **Verify before you write (Step 2.5).** Nothing becomes source-of-truth on an article's say-so —
  every Claude/Anthropic claim is checked against official docs and tagged for provenance. See
  [`verification-rubric.md`](verification-rubric.md). This is the anti-misinformation guard.
- A **validation hook** (`.claude/hooks/validate-note.sh`) blocks notes with missing frontmatter or
  zero connections — heed it; it's the anti-silo guard, not noise.
- **Don't paste full copyrighted text** — summarize and cite the `source`.
- **Don't pre-build empty maps** — `knowledge/maps/` indexes emerge only when a cluster earns one.
- **Keep it Claude-specific** unless the idea is a genuinely foundational cross-cutting model.
- The index is **derived** — never hand-edit `docs/assets/knowledge.js`; always re-run the script.
