---
title: "A loop is cron plus a decision-maker in the body"
slug: loop-is-cron-plus-a-decision-maker
kind: concept
spine_layer: patterns
tags: [loops, automation, orchestration, cron, goal, skills, economics]
connections:
  - { to: designing-loops-not-prompts, type: builds-on, why: "Same loop-engineering thesis from a second 2026 source — this note adds the lineage, the one-line definition, and the economics the other note doesn't carry." }
  - { to: automation-control-flow-spectrum, type: used-with, why: "The lineage ends in the exact Claude Code primitives (/loop, /goal, routines) that the spectrum note disambiguates." }
  - { to: completion-is-externalized, type: used-with, why: "Boris's fifth tip — a loop must self-verify end to end — is externalized completion stated as the thing that makes a loop trustworthy." }
  - { to: claude-code-routines, type: used-with, why: "Stage five of the lineage (laptop closed, durable, on a schedule) is literally what a cloud routine provides." }
source: { url: "https://x.com/mvanhorn/status/2063865685558903149", author: "Matt Van Horn", retrieved: 2026-06-09 }
date: 2026-06-09
depth: seedling
claude_specific: true
---

# A loop is cron plus a decision-maker in the body

> **TL;DR.** "WTF is a loop?" was the most-repeated phrase in AI coding in early June 2026, and almost
> nobody saying it could define it. The clean answer: **a loop is cron plus a decision-maker in the body.**
> Cron runs a *fixed script* on a timer; a loop runs a *model* that looks at the current state, decides the
> next action, does it, checks whether it worked, and decides whether to keep going — **the decision is the
> agent's, not a hardcoded branch.** That one added part is the whole game. The term hides a five-stage
> lineage (ReAct → AutoGPT → ralph → `/goal` → orchestration), the on-ramp in Claude Code is now a single
> slash command, and the punchline of 2026 is that **the loop, not the model, is the expensive part.**

## The lineage — five things "loop" can mean
The replies were a brawl because "loop" hides at least five different things. Oldest to newest, so you stop
talking past people:

1. **ReAct (2022)** — the academic while-loop: one model reasons, calls a tool, reads the result, repeats,
   with a human watching. One model, one loop.
2. **AutoGPT (2023)** — gave the loop a *goal* and let it prompt itself. Famous for spinning forever doing
   nothing; that failure seeded years of "agents are a toy."
3. **The ralph loop (July 2025, Geoffrey Huntley)** — a bash one-liner piping the same prompt file into the
   agent over and over. Its innovation was **discipline**: every iteration *resets the context to a fixed set
   of anchor files* instead of letting the conversation grow. (Huntley reportedly built a small programming
   language this way for ~$297.)
4. **`/goal` (spring 2026)** — productized the ralph loop: run the loop until a small validator model
   confirms the task is done. This is Claude Code's [`/goal`](goal-mode.md) — condition-driven, self-checking.
   ⚠️ The article claims Codex shipped the same command; **Codex parity is the author's claim, unverified
   here.**
5. **Orchestration loops (2026)** — what Steinberger and Cherny actually mean, and genuinely new. Four things
   changed: the **loop became the unit of work** (not the task); loops **supervise other loops**, concurrently
   and on a schedule; **scheduling replaced the human kickoff**, so the loop runs on infrastructure time
   instead of your attention; and **durability became explicit** — git-backed state and crash recovery,
   because these runs must survive a restart. Ralph assumed your terminal stayed open; the 2026 version
   assumes it does not.

So the skeptic line *"cronjobs have funny re-branding rn"* is **half right**: the scheduling layer *is* cron
(Claude Code's `/loop` uses cron under the hood). What cron never had is the part in the middle — the
decision-maker. **Single-agent ralph is old hat; multi-agent supervision is the new layer.**

## "I don't prompt Claude anymore. My job is to write loops."
Boris Cherny (creator of Claude Code) on stage at WorkOS Acquired Unplugged, June 2 2026:
*"I have loops that are running. They're the ones that are prompting Claude and figuring out what to do. My
job is to write loops."* Steinberger's version, June 7 2026: *"You shouldn't be prompting coding agents
anymore. You should be designing loops that prompt your agents."* You stop being the thing inside the loop
typing prompts; you become the **author of the loop**, and the model becomes a subroutine. The on-ramp is one
line — `/loop babysit all my PRs. Auto-fix build issues, and when comments come in, use a worktree agent to
fix them.` — and Boris's five tips for running a model autonomously for hours: **auto mode** for permissions,
**dynamic workflows** to orchestrate many agents, **`/goal` or `/loop`** to keep it going, **the cloud** so
you can close your laptop, and **a way to self-verify end to end.** Tip five is the one practitioners obsess
over: *a loop is only as trustworthy as its ability to check its own work.*

## The plot twist — the loop is now the expensive part
Once the model writes the code for almost nothing, the cost moves to the *loop running it.* One engineer's
deflation: *"Every AI agent I shipped this year is a for-loop, an LLM call, and a try/catch around the JSON
parsing. The only thing agentic about it is the Anthropic bill at the end of the month."* The receipts are
real — Uber reportedly capped engineers at **$1,500/person/month per tool** for Claude Code and Cursor after
burning its annual AI budget in four months. The failure mode everyone in production fears is **the loop that
doesn't stop.** So every serious 2026 write-up converges on the **same three hard stops**:

- a **maximum iteration count**,
- **no-progress detection** (kill it if nothing changed), and
- a **token or dollar budget ceiling.**

Without those guardrails you get infinite loops and billing surprises orders of magnitude over budget. **The
expensive resource shifted from tokens to loop management.**

## It's not loops. It's skills.
The durable asset isn't the loop — **the loop is plumbing; the asset is the skill it calls.** A loop with no
reusable [skills](skills.md) inside it is just a `while-true` around a stranger; a loop that calls a library of
sharp, tested, named skills is a system that **compounds.** Steinberger's pairing rule: *if you do something
more than once, turn it into a skill; if you do something hard, turn it into a skill afterward so next time
it's free.* This is the bridge between the two halves of the stack — the loop is *how* it keeps going, the
skill is *what* it knows how to do well.

## How to apply (in practice / consulting)
- **Lead with the definition.** When a client says "we want agents," the useful reframe is: you want a loop —
  cron plus a decision-maker — wrapped in guardrails. That single sentence cuts through most of the hype.
- **Price the loop, not the model.** Budget the *loop management* explicitly: set the iteration cap,
  no-progress detector, and dollar ceiling **before** you let it run unattended. This is now the line item
  that surprises people.
- **Sell the skill library.** The compounding value you deliver is the named, tested skills the loop calls —
  not the loop itself. A loop without skills doesn't accrue.
- **Reality check the hype.** Gartner pegged ~17% of organizations as actually deploying agents (peak of
  inflated expectations). The timeline is loud; the receipts are thinner. Build the loop, stay the engineer.

## Provenance & caveats
- Source: **Matt Van Horn, "WTF Is a Loop? Peter Steinberger vs. Boris Cherny"** (X, Jun 8 2026, 2.3M views),
  a synthesis of ~80 voices across X / Reddit / HN. Framing and opinion, not a spec. Retrieved 2026-06-09.
- ✅ Verified vs official docs: `/goal` is a real Claude Code command (a small fast model checks a condition
  each turn); `/loop` is a bundled skill that schedules via cron tools. See [goal mode](goal-mode.md) and
  [scheduled tasks](scheduled-tasks.md).
- ❓ Author's claims, **not verified**: Codex shipped an equivalent `/goal`; Steve Yegge's "Gas Town" (20–30
  Claude Code instances under a "Mayor" agent). Treated as illustrative, like the vault's handling of Osmani's
  Codex-parity claim.

## Connections
- **builds-on [Loop engineering — design the system that prompts the agent](designing-loops-not-prompts.md)** — the same thesis from a second source; this note adds the lineage, the one-line definition, and the economics.
- **used-with [Keeping Claude working — the two axes](automation-control-flow-spectrum.md)** — the lineage's endpoints (`/loop`, `/goal`, routines) are exactly the primitives that note tells apart.
- **used-with [Never let the agent declare its own victory](completion-is-externalized.md)** — "self-verify end to end" is externalized completion, restated as what makes a loop trustworthy.
- **used-with [Claude Code Routines — unattended cloud automation](claude-code-routines.md)** — stage five (durable, scheduled, laptop closed) is what a cloud routine provides.
