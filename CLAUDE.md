# AI Knowledge Center — working instructions

This repo is a **personal knowledge base for building AI products**. It is NOT an
application — there is no app to run, no server, no build. Your job here is to help
**capture, distill, organize, and retrieve knowledge**, and to keep reusable assets
clean enough to drop into other repos.

## What this repo is for
- Accumulating AI-product knowledge over time (articles, lessons, patterns).
- Producing **portable** assets (prompts, snippets, configs, templates) that get
  copied into other AI product repos (e.g. Tide).
- Being a fast, well-indexed reference — findability matters more than volume.

## Structure (see README.md for the full map)
- `knowledge/<NN-topic>/` — distilled reference, in plain language, by topic.
- `articles/` — one file per external source; use `articles/_TEMPLATE.md`.
- `patterns/` — reusable assets to copy out: `prompts/`, `snippets/`, `configs/`, `templates/`.
- `playbooks/` — step-by-step procedural guides.
- `LEARNINGS.md` — dated, append-only log of hard-won lessons (newest at top).

## Conventions
- **Markdown-first.** Everything is `.md` unless it's literally a code/config asset.
- **Plain language, in my own words.** Distill, don't dump. A good note explains
  the *why* and *when to use*, not just *what*.
- **One source per file** in `articles/`. Filename: `YYYY-MM-DD-short-slug.md`.
- **Cross-link liberally.** Use relative links between knowledge files, articles,
  and patterns so related ideas connect.
- **Mark portability.** Anything reusable goes in `patterns/` with a header stating:
  what it is, where it came from, model/SDK assumptions, and caveats.
- **Keep indexes current.** When you add a file, add a one-line pointer to the
  nearest `README.md` (the category index) so nothing gets orphaned.
- **Attribution.** When knowledge comes from an article, link the `articles/` note.
- **Date things.** Models, prices, and benchmarks go stale fast — always datestamp
  claims that have a shelf life.

## LEARNINGS loop
When you discover something non-obvious while working here (a tool quirk, a better
way to organize, a correction to an earlier note), **append a dated line to
`LEARNINGS.md`** at the top — don't wait to be asked.

## Workflow
- This repo has its own git history, independent of any other project. Normal git
  workflow applies; nothing here is governed by another repo's hooks.
- No typecheck/lint/tests — it's content. The bar is: clear, correct, well-indexed,
  and cross-linked.
- Conventional commits: `docs:`, `chore:`, `feat:` (e.g. a new playbook), `fix:`.

## Out of scope
- Don't add secrets, API keys, or proprietary/employer-confidential material.
- Don't paste full copyrighted articles — summarize + link the source.
