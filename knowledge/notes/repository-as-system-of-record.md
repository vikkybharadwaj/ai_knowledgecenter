---
title: The repository is the agent's only durable memory — make it the system of record
slug: repository-as-system-of-record
kind: concept
spine_layer: patterns
tags: [harness, state, memory, agents-md, continuity]
connections:
  - { to: harness-engineering-discipline, type: part-of, why: "Concretizes two of the five subsystems — Instructions and State — into durable repo files." }
  - { to: prompt-context-harness-engineering, type: builds-on, why: "The context window is the ephemeral layer; this pushes everything that must survive a session down into the repo." }
  - { to: claude-code-architecture, type: used-with, why: "CLAUDE.md is exactly the AGENTS.md landing-page mechanism this note prescribes." }
  - { to: execution-context-isolation, type: used-with, why: "Per-agent progress files + git branches are the ACID isolation that lets forked contexts coordinate without clobbering each other." }
  - { to: completion-is-externalized, type: used-with, why: "The feature-list state machine that owns 'done' is itself a repo-of-record file the next session reads." }
source: { url: "https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/", author: "Walking Labs (Learn Harness Engineering)", retrieved: 2026-06-07 }
date: 2026-06-07
depth: budding
claude_specific: true
---

# The repository is the agent's only durable memory — make it the system of record

**TL;DR** — An agent has exactly three input sources: the system prompt, repository file contents,
and tool output. Slack threads, Confluence pages, and "what the senior eng knows" are *invisible* to
it. **Information that doesn't exist in the repo doesn't exist for the agent.** And because the
context window is session-bound and ephemeral, anything that must survive a session has to be written
into the repo as a structured file. The repo isn't documentation *about* the system — for an agent it
*is* the system of record.

## Why the repo, not the context window
- **The window is temporary.** It exhausts fast, and crucial facts buried deep cost real budget just
  to rediscover. The repo is the durable, retrievable store.
- **Agents can't compensate.** A human fills gaps by asking around; an agent can only use what's
  documented. So agent success correlates directly with **repository completeness**.
- **Knowledge decay is worse than absence.** Stale docs misdirect an agent that confidently executes
  the wrong instruction — more dangerous than no docs at all. Bind doc updates to code changes.

## The file set (knowledge lives next to code)
- **`AGENTS.md` / `CLAUDE.md`** (50–100 lines): the landing page — *what is this, how do I run it,
  how do I verify it.*
- **`ARCHITECTURE.md`** in module dirs: local decisions, documented where the code lives.
- **`CONSTRAINTS.md`**: explicit MUST / MUST NOT hard rules.
- **`PROGRESS.md`**: current commit, test status, done / in-progress / blocked, next actions.
- **`DECISIONS.md`**: the *why* behind choices — "the code is the what; the next session sees the
  what but not the why" unless you record it. Stops cross-session **drift**.

## State management as ACID
Treat the repo like a transactional store:
- **Atomicity** — one logical change = one git commit; failure rolls back.
- **Consistency** — verification predicates (tests/lint) hold after each operation.
- **Isolation** — separate progress files per agent; git branches prevent races.
- **Durability** — only git-tracked files count; nothing ephemeral survives.

## Mental model / why it matters
Two metrics make this concrete. The **fresh-session test**: can a brand-new agent session, using
*only* the repo, answer the five basic questions (what is this, how to run, how to verify, what's
done, what's next)? If not, the repo isn't the system of record yet. And **rebuild cost**: the
minutes a new session needs to reach an executable state — a good `PROGRESS.md` compresses that from
~15 min to ~3 min. A team with 30 microservices and 70% task-failure (decisions scattered across
Confluence/Slack/heads) fixed it not by changing models but by consolidating into local
`ARCHITECTURE.md` / `CONSTRAINTS.md` / `PROGRESS.md`. The lesson: **always ready to hand off** — at any
moment the project should be operable by a fresh agent from documentation alone.

## How to apply (in practice / consulting)
- **Run the fresh-session test as an audit.** Spin a clean Claude Code session with zero verbal
  context and ask it the five questions. Every "I can't tell" is a missing repo-of-record file — that
  list *is* the onboarding backlog.
- **Move tribal knowledge into the repo, near the code.** The consulting win is rarely a new tool;
  it's relocating decisions out of Slack/heads into `CONSTRAINTS.md` + per-module `ARCHITECTURE.md`.
- **Make doc-with-code a commit rule.** Pair every behavior change with its doc change in the same PR
  (this vault's own house rule) so knowledge decay never gets a foothold.

## Connections
- **Part of [[harness-engineering-discipline]]** — this is the Instructions + State subsystems made
  concrete and durable.
- **Builds on [[prompt-context-harness-engineering]]** — the context window is the ephemeral layer;
  anything that must outlive a session gets pushed down into the repo.
- **Used with [[claude-code-architecture]]** — `CLAUDE.md` is precisely the `AGENTS.md` landing-page
  mechanism prescribed here.
- **Used with [[execution-context-isolation]]** — per-agent progress files and git branches are the
  ACID isolation that lets forked/parallel agents coordinate without clobbering shared state.
- **Used with [[completion-is-externalized]]** — the feature-list state machine that owns "done" is
  itself a repo-of-record artifact the next session reads to know what's left.
- See also [[progressive-disclosure-instructions]] for *how* to structure the instruction files so the
  landing page stays small.
