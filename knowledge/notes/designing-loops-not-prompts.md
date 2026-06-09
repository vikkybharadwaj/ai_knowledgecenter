---
title: "Loop engineering — design the system that prompts the agent, not the prompt"
slug: designing-loops-not-prompts
kind: concept
spine_layer: patterns
tags: [orchestration, loops, automation, harness, subagents]
connections:
  - { to: harness-engineering-discipline, type: builds-on, why: "A loop is the harness put on a timer that feeds itself — loop engineering sits one floor above harness engineering." }
  - { to: completion-is-externalized, type: builds-on, why: "An unattended loop only works if 'done' is externally verified — /goal's separate Haiku evaluator is exactly this move." }
  - { to: claude-code-multi-agent-development, type: used-with, why: "The loop's parallelism (worktrees) and maker/checker split (subagents) are the multi-agent primitives applied on a schedule." }
  - { to: repository-as-system-of-record, type: used-with, why: "The loop's sixth piece — memory — is the repo/disk, because the model forgets everything between runs." }
  - { to: claude-code-routines, type: used-with, why: "Routines / GitHub Actions / Claude Code on the web are how a loop actually runs unattended after you close the laptop." }
source: { url: "https://x.com/addyosmani/status/2064127981161959567", author: "Addy Osmani", retrieved: 2026-06-09 }
date: 2026-06-09
depth: seedling
claude_specific: true
---

# Loop engineering — design the system that prompts the agent, not the prompt

> **TL;DR.** For ~two years you got value from a coding agent by *holding it*: write a good
> prompt, read the reply, write the next prompt — one turn at a time. **Loop engineering** replaces
> *you-as-the-prompter* with a small system that finds the work, hands it out, checks it, records
> what's done, and decides the next thing — then lets that system poke the agent instead of you.
> Peter Steinberger: *"You shouldn't be prompting coding agents anymore. You should be designing
> loops that prompt your agents."* Boris Cherny (head of Claude Code): *"I don't prompt Claude
> anymore. I have loops running that prompt Claude… My job is to write loops."* It's **five building
> blocks + one memory**, and Claude Code ships all five today. It's a preview, not a settled
> practice: watch token cost and watch quality/slop. **Build the loop, but stay the engineer.**

## Where it sits on the spine
Loop engineering is **one floor above [harness engineering](harness-engineering-discipline.md)**.
The *harness* is the environment a single agent runs inside — its loop, tools, memory, verification.
A *loop* is that harness **on a timer that spawns helpers and feeds itself**. Prompt engineering →
context engineering → harness engineering → **loop engineering**: at each step the leverage point
moves outward, from the words, to the window, to the environment, to the self-driving system. The
work doesn't get easier — the leverage point moves, and loop *design* is harder than prompt writing,
not easier.

## The five building blocks (+ memory) — mapped to official Claude Code terms
The article's real insight: a year ago a loop meant a pile of bespoke bash you owned forever; now the
pieces **ship inside the products**, and the same shape works whether you sit in Claude Code or Codex.
Here are the five blocks **mapped to the official Claude Code vocabulary** (the article's looser words
in parentheses), so this stays your source of truth:

1. **Scheduling / automation — the heartbeat.** *(article: "Automations")* What turns one run into a
   recurring loop. In Claude Code: **`/loop`** runs a prompt on a cadence and **`/goal`** runs across
   turns until a condition holds; lifecycle **[hooks](../concepts/cc-hooks.md)** fire shell commands at
   events (`SessionStart`, `PreToolUse`, `Stop`, …). ⚠️ **Accuracy note:** `/loop` and the
   `CronCreate`/`CronDelete` tools are **session-scoped** — they stop when the session ends. To "keep
   running after you close the laptop" you need **[Routines](claude-code-routines.md)**, **GitHub
   Actions**, or **Claude Code on the web**, which run on Anthropic/CI infrastructure. The article
   blurs these two; they are not the same.
2. **[Worktrees](../concepts/worktrees.md) — parallel without collisions.** A git worktree is a
   separate working directory on its own branch sharing the repo's history, so two agents can't touch
   each other's checkout. Official handles: the **`--worktree` / `-w`** CLI flag, and
   **`isolation: worktree`** in a subagent's frontmatter (each helper gets a fresh, self-cleaning
   checkout). The worktree removes the *mechanical* collision; **your review bandwidth is still the
   ceiling** on how many you can run (the "orchestration tax").
3. **[Skills](../concepts/skills.md) — written-down project intent.** A folder with a `SKILL.md`
   (instructions + metadata, optional scripts/refs/assets). Without skills the loop re-derives your
   project from zero every cycle and fills gaps with confident guesses ("intent debt"); with skills,
   intent is written once on the outside and **compounds**. A tight, boring `description` beats a
   clever one because it's what makes the skill auto-trigger.
4. **[Plugins](../concepts/plugins.md) + [MCP servers](../concepts/cc-mcp-servers.md) — the loop
   touches your real tools.** ⚠️ **Terminology fix:** the article calls these "connectors"; the
   official Claude Code term is **MCP servers** (Model Context Protocol). "Connector" is only
   claude.ai/Routines UI shorthand. MCP is what lets the loop read your issue tracker, query a DB, hit
   staging, or post to Slack — the difference between an agent that *says* "here's the fix" and a loop
   that opens the PR, links the ticket, and pings the channel once CI is green. **Plugins** are the
   packaging format that ships skills + subagents + MCP config so a teammate installs the whole setup
   in one go.
5. **[Subagents](../concepts/cc-subagents.md) — keep the maker away from the checker.** The single
   most useful structural move: the agent that wrote the code is too generous grading its own
   homework, so a *second* agent — different instructions, often a different/stronger model — checks
   it. Defined as markdown files in `.claude/agents/`. (Distinct from **agent teams**, which are
   separate coordinating *sessions* passing work via `SendMessage` — an experimental flag — not
   in-session delegation.) Subagents cost more tokens; spend them where a second opinion is worth
   paying for.

**The sixth thing — memory.** A markdown file, a Linear board — anything outside the single
conversation that holds *what's done* and *what's next*. It sounds too dumb to matter, but it's the
trick every long-running agent depends on: **the model forgets everything between runs, so memory must
live on disk, not in context.** The agent forgets; the [repo doesn't](repository-as-system-of-record.md).

## What one loop looks like
An automation runs every morning. Its prompt calls a **triage skill** that reads yesterday's CI
failures, open issues, and recent commits and writes findings to a state file (markdown or Linear).
For each finding worth doing, the thread opens an isolated **worktree** and sends a **subagent** to
draft the fix and a *second* subagent to review it against the project skills and tests. **MCP
servers** let the loop open the PR and update the ticket; anything it can't handle lands in a triage
inbox for you. The **state file** is the spine — it remembers what was tried, what passed, what's
open — so tomorrow's run resumes instead of restarting. **You designed it once; you prompted none of
those steps.** And it's the same loop in Codex or Claude Code because the pieces are the same pieces.

## Mental model / why it matters
- **The leverage point moved, the job didn't get easier.** Cherny's claim isn't "less work" — it's
  that the highest-value thing you do is now *designing the loop*, not *writing the turn*.
- **Same five pieces everywhere.** Once you see the shape (heartbeat → isolate → write-down-intent →
  reach-real-tools → maker/checker → memory) you stop arguing about which tool and design a loop that
  survives a tool switch.
- **`/goal` is the maker/checker split applied to "done."** A fresh small model (Haiku) decides if the
  stop condition holds, not the agent that did the work — [externalized completion](completion-is-externalized.md)
  baked into the product.

## How to apply (in practice / consulting)
- **Sell loop *design*, not loop *autopilot*.** For a client, the deliverable is a documented loop
  (the triage skill, the verifier subagent, the state-file convention) — and the discipline to keep a
  human at the verification gate. A loop running unattended is also a loop *making mistakes*
  unattended.
- **Budget tokens explicitly.** Usage swings wildly; subagents and `/goal` multiply model+tool calls.
  Price the loop before you let it run on a schedule, especially for token-poor clients.
- **Three problems get *sharper*, not easier, as the loop improves:** verification ("done" is a claim,
  not a proof — you still ship code you confirmed), **comprehension debt** (the faster it ships code
  you didn't write, the wider the gap between what exists and what you understand), and **cognitive
  surrender** (it's tempting to stop having an opinion). Designing the loop with judgment is the cure;
  designing it to avoid thinking is the accelerant — *same action, opposite result.*
- **Two people, same loop, opposite outcomes.** One moves faster on work they understand deeply; the
  other avoids understanding the work at all. The loop can't tell the difference — you can.

## Provenance & caveats
- Source is a **2026 opinion thread by Addy Osmani** synthesizing Steinberger and Cherny — framing, not
  a spec. Datestamp: retrieved 2026-06-09.
- **Codex parity is the author's claim, not verified here.** Codex has parallel ideas (a goal mode,
  skills, agents), but the slash-command syntax, `SKILL.md`/TOML file formats, and MCP equivalence
  aren't officially documented as identical. Treat "all five in both" as directional.
- Corrections applied vs. the source: **"connectors" → MCP servers**; **scheduling split** into
  session-scoped (`/loop`, cron tools) vs. unattended (Routines / GitHub Actions / web).

## Connections
- **builds-on [Harness engineering — reliability lives outside the model weights](harness-engineering-discipline.md)** — a loop is the harness on a timer that feeds itself; loop engineering is the next floor up.
- **builds-on [Never let the agent declare its own victory](completion-is-externalized.md)** — an unattended loop is only trustworthy if "done" is externally verified, which is what `/goal`'s separate evaluator does.
- **used-with [Claude Code — Multi-Agent Development](claude-code-multi-agent-development.md)** — worktrees + subagents (the maker/checker split) are the multi-agent primitives the loop runs on a schedule.
- **used-with [The repository is the agent's only durable memory](repository-as-system-of-record.md)** — the loop's sixth piece, memory, must live on disk because the model forgets between runs.
- **used-with [Claude Code Routines — unattended cloud automation](claude-code-routines.md)** — the official way a loop keeps running unattended after you close the laptop.
