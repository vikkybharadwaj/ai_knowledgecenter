---
title: Claude Code Routines — unattended cloud automation
slug: claude-code-routines
kind: concept
spine_layer: claude-code
tags: [claude-code, routines, automation, scheduling, triggers, cloud, github, mcp]
connections:
  - { to: claude-code-architecture, type: part-of, why: "Routines are the unattended cloud 'operate' member of the Claude Code primitive set — the field guide's tenth entry." }
  - { to: dynamic-workflow-patterns, type: used-with, why: "/loop is the in-session local cousin of a scheduled routine; both run a saved procedure repeatedly, on different infrastructure." }
  - { to: model-context-protocol, type: used-with, why: "A routine bundles connectors/MCP servers into its saved config so the unattended cloud run can reach external systems." }
  - { to: execution-context-isolation, type: contrasts-with, why: "Routine runs are fully autonomous cloud sessions with NO permission prompts/approval mode — the opposite end of the spectrum from an interactive local session." }
  - { to: claude-code-multi-agent-development, type: alternative-to, why: "Both run Claude work off your main thread, but a routine runs unattended on Anthropic's cloud on a trigger, not as peer/worker agents you supervise." }
source: { url: "https://code.claude.com/docs/en/routines", author: "code.claude.com/docs, distilled in-house", retrieved: 2026-06-06 }
date: 2026-06-06
depth: budding
claude_specific: true
---

# Claude Code Routines — unattended cloud automation

## TL;DR
A **routine** is a *saved Claude Code configuration* — a prompt + one or more repositories +
connectors/MCP — packaged once and run **automatically on Anthropic-managed cloud infrastructure**,
with your laptop closed. Each routine fires on one or more **triggers**: a schedule, a GitHub
event, or an API call. It's part of *Claude Code on the web*, and it's in **research preview**
(2026-06-06).

## The mental model
Interactive Claude Code = you in the loop, approving as you go. A routine = "set it and forget it."
The plan and the tools are frozen into a saved config; a trigger pulls it off the shelf and runs it
**unattended in the cloud**. The unit of value moves from *a session you drive* to *a standing order
that runs itself*.

## Three triggers (combinable in one routine)
- **Scheduled** — a recurring cadence (hourly / daily / weekdays / weekly; minimum interval **1 hour**;
  custom cron via `/schedule update`), or a single **one-off** run at a future timestamp.
- **API** — a per-routine HTTPS endpoint. `POST .../routines/<id>/fire` with a bearer token and an
  optional freeform `text` payload (e.g. an alert body) starts a run and returns a session URL.
  Ships behind an experimental beta header.
- **GitHub** — runs on repository events (`pull_request.*`, `release.*`) with filters (author, base/head
  branch, labels, draft/merged, etc.). Each matching event starts its own session.

One routine can attach all three (e.g. a PR-review routine that also runs nightly and can be fired from
a deploy script).

## Where it's managed
Create and manage at **claude.ai/code/routines**, in the **Desktop app**, or from the CLI with
**`/schedule`** (`/schedule list | update | run`). The CLI creates **scheduled** triggers only —
API and GitHub triggers are added on the web. All three surfaces write to the same cloud account.

## Reach & safety
A run is a **fully autonomous cloud session: no permission prompts, no approval mode.** What it can
touch is fixed *before* it runs, by four knobs:
- **Repositories** selected (cloned per run from the default branch) + the branch-push setting — by
  default it can only push to **`claude/`-prefixed branches** unless *Allow unrestricted branch pushes*
  is enabled.
- **Environment** — network access (default **Trusted**: package registries + common dev domains only),
  environment variables/secrets, and a cached setup script.
- **Connectors** included (MCP). All tools of an included connector are usable, **including writes**,
  with no per-run approval.

A routine belongs to your **individual** claude.ai account (not shared), and everything it does appears
**as you** (your GitHub identity, your connectors). Team/Enterprise admins can disable routines org-wide.

## Usage & cost
Routines draw down subscription usage like interactive sessions, **plus a per-account daily run cap**.
One-off runs are exempt from the daily cap (but still consume regular usage). Available on Pro / Max /
Team / Enterprise with Claude Code on the web enabled.

## The terminology collision (read this)
If you've ever called a *saved, repeatable procedure* "a routine," you meant a **[Skill](claude-code-architecture.md)** —
that long-standing correction still holds. But Anthropic now *also* ships a feature **literally named
Routines**, and it's a different thing: **unattended cloud automation** triggered on a schedule / GitHub
event / API call — not a procedure loaded into a session. The clean split:
**a Skill is the *what to do*; a Routine is the *when & where it runs unattended*.** A routine can even
invoke skills (and connectors) inside its cloud run.

## When to reach for it / when not
- **Reach for it:** recurring unattended maintenance (triage, changelogs, docs-drift PRs); Claude
  reacting to a GitHub event on its own; an external system firing a Claude run via an authenticated
  webhook; any "should keep working with my laptop closed" job.
- **Not** for a task that repeats *inside an open session* → `/loop` (local, in-session). **Not** for a
  schedule that must run *on your own machine* → Desktop scheduled tasks. **Not** for a pure pass/fail
  CI gate → GitHub Actions.

## Connections
*Typed links — the concept graph is built from the `connections:` frontmatter above.*
- **part-of** → [Claude Code Architecture](claude-code-architecture.md) — the field guide's unattended "operate" primitive.
- **used-with** → [Six dynamic-workflow patterns](dynamic-workflow-patterns.md) — `/loop` is the in-session local cousin of a scheduled routine.
- **used-with** → [Model Context Protocol (MCP)](model-context-protocol.md) — connectors/MCP bundled into the saved config give the cloud run its reach.
- **contrasts-with** → [One shared context vs. many isolated contexts](execution-context-isolation.md) — routine runs have no permission prompts/approval mode, unlike interactive sessions.
- **alternative-to** → [Claude Code — Multi-Agent Development](claude-code-multi-agent-development.md) — unattended cloud trigger vs. supervised local agents.
