---
title: CCA-F Study Guide — Claude Certified Architect (Foundations)
tags: [claude-code, certification, cca-f, exam, study-guide, cross-cutting]
added: 2026-06-02
reviewed: 2026-06-02
source: official exam blueprint (community-reconstructed) + code.claude.com/docs; high-yield patterns synthesized from community practice banks (see Attribution)
interactive: ../../docs/claude-code-architecture/exam-prep.html
---

# CCA-F Study Guide

How to study for, and what to expect from, the **Claude Certified Architect — Foundations
(CCA-F)** exam. Pair this with the interactive
[practice quiz](../../docs/claude-code-architecture/exam-prep.html) and the
[question bank](cca-f-exam-question-bank.md).

> **Not affiliated with or endorsed by Anthropic.** The blueprint below is reconstructed
> from public community study materials; the high-yield patterns are synthesized from
> community practice banks and **verified against [code.claude.com/docs](https://code.claude.com/docs)**.
> No real exam content is reproduced. Always defer to the official docs.

## The exam at a glance
- **60 questions**, scenario-based multiple choice (single best answer), **120 minutes**.
- Scaled score **100–1000**, **pass = 720**, **no negative marking**.
- **4 of 6** production scenarios are drawn per sitting.
- Tests **architectural judgment under constraint**, not API/SDK memorization. Distractors
  are realistic and "almost right" — the skill is picking the *most sound* option and
  knowing *why the other three are wrong*.
- Prep: free Anthropic Academy (Skilljar) courses. Registration via the Skilljar access portal.

## Domain weighting (study time follows the weights)
| # | Domain | Weight | This guide's deep dives |
|---|--------|:---:|---|
| 1 | Agentic architecture & orchestration | **27%** | [subagents](../../docs/claude-code-architecture/primitives/subagents.html), [teams](../../docs/claude-code-architecture/primitives/agent-teams.html), [workflows](../../docs/claude-code-architecture/primitives/workflows.html), [agent view](../../docs/claude-code-architecture/primitives/agent-view.html) |
| 2 | Claude Code configuration & workflows | **20%** | [skills](../../docs/claude-code-architecture/primitives/skills.html), [hooks](../../docs/claude-code-architecture/primitives/hooks.html), [memory](../../docs/claude-code-architecture/primitives/memory.html), [policies](../../docs/claude-code-architecture/primitives/policies.html) |
| 3 | Prompt engineering & structured output | **20%** | [harness/context/prompt](../../docs/claude-code-architecture/mental-model.html) |
| 4 | Tool design & MCP integration | **18%** | [MCP](../../docs/claude-code-architecture/primitives/mcp.html) |
| 5 | Context management & reliability | **15%** | [context engineering](../../docs/claude-code-architecture/mental-model.html#harness) |

## The 6 production scenarios
The exam frames questions inside six recurring production settings. Recognize the setting,
recall its typical failure modes:
1. **Customer-support resolution agent** — tool ordering, escalation calibration, refunds/approvals.
2. **Code generation (Claude Code)** — config, plan mode, CI/headless, structured output.
3. **Multi-agent research system** — delegation, subagent coordination, claim/source provenance.
4. **Developer productivity** — skills, hooks, MCP, conventions.
5. **CI/CD workflow automation** — headless `-p`, JSON output, permissions.
6. **Structured data extraction** — tool use + schema, required-field traps, batch vs real-time.

---

## High-yield "canonical answers" (cram sheet)
These patterns recur across every community bank and are confirmed by the docs. If a stem
matches the situation, the answer is almost always the pattern on the right.

### Domain 1 — Agentic architecture & orchestration
- **Loop control:** don't terminate on a natural-language phrase ("I'm done"). Inspect the
  API **`stop_reason`** and stop on **`end_turn`**. Iteration caps are a *safety boundary*,
  not the primary stop mechanism.
- **Enforcing a business rule** (e.g. refunds > $500 need approval; verify customer before
  acting): use **deterministic programmatic enforcement / a `PreToolUse` hook** that blocks
  or gates the tool — *not* a prompt instruction (probabilistic) and not a tool-availability
  change (fixes the wrong thing).
- **Tool ordering** (agent calls `lookup_order` before `get_customer`): add a **programmatic
  prerequisite** that blocks the dependent tool until the prerequisite returns a verified ID.
- **Parallel subagents:** issue **multiple `Task`/Agent calls in one response**. A coordinator
  that never delegates is usually missing **`Task` in its `allowedTools`**.
- **Choosing topology:** independent + noisy output → **subagents**; peers must communicate →
  **agent teams**; dozens-to-hundreds + cross-check → **dynamic workflow**; you supervise many
  independent sessions → **agent view**.

### Domain 2 — Tool design & MCP integration
- **Wrong tool chosen / minimal descriptions:** **expand tool descriptions** (formats,
  examples, boundaries) — the model routes on them.
- **Empty vs failed results:** never collapse an error into `{"results":[],"status":"success"}`.
  Use **`isError`** to distinguish an access/timeout failure from a valid empty result, or the
  agent loses its recovery signal.
- **Guarantee a specific tool is called:** `tool_choice: {"type":"tool","name":"…"}`. Force
  *some* tool with `"any"`; let the model decide with `"auto"`.
- **Shared MCP server, no committed secret:** project **`.mcp.json`** with **`${ENV_VAR}`**
  expansion, committed to the repo (token stays in the environment).
- **Transport choice:** remote + OAuth → **HTTP**; local process → **stdio**; **SSE is
  deprecated**; WebSocket = header-auth only.
- **`Edit` "match not unique":** `Read` for surrounding context, then retry with a **larger
  unique `old_string`** (verify against docs — one bank prefers full Read+Write; the
  larger-anchor approach is the lighter fix).

### Domain 3 — Claude Code configuration & workflows
- **Team can't see your standards:** `~/.claude/CLAUDE.md` is **user-scoped, not
  version-controlled** → move to **project `CLAUDE.md`** (committed).
- **Path-specific guidance:** `.claude/rules/*.md` with a **`paths:`** glob.
- **Big restructure / 45+ file migration:** use **plan mode** first. A single clear change →
  direct execution (don't over-ceremony).
- **CI hangs waiting for input:** the **`-p` / `--print`** (headless) flag.
- **Fragile parsing of Claude's CI output:** `--output-format json` (+ `--json-schema`).
- **Verbose skill floods context:** run it in a subagent via **`context: fork`** frontmatter.
- **Custom command location:** `.claude/commands/` (legacy) or `.claude/skills/` (current).

### Domain 4 — Prompt engineering & structured output
- **JSON syntax errors under load:** switch from prompt-only "return JSON" to **tool use with
  a JSON schema**. Note: schema guarantees **syntax, not semantics** — sums/dates/cross-field
  checks still need a **validate-and-retry loop**.
- **"Required" fields the source may lack:** required fields become **fabrication factories** —
  make them optional or model "not found" explicitly.
- **Inconsistent format:** add **2–4 few-shot examples** of the exact output.
- **Noisy false positives** (e.g. 60% bad security flags): **disable the noisy category +
  give explicit criteria with code examples**; "use your best judgment / only high-confidence"
  does nothing.
- **`tool_choice`:** unknown doc type, 30% plain-text responses → force **`"any"`**.
- **Batch API:** use it only for the **non-latency-sensitive** job (overnight report), never
  the blocking pre-merge gate. Resubmit only failures via **`custom_id`**.
- **Self-review misses bugs:** use an **independent second instance** without the generation
  context (a same-session self-review is biased).

### Domain 5 — Context management & reliability
- **Key fact (amount/date) lost over many turns:** inject a **persistent "case facts" block**
  every turn.
- **Long input, middle ignored ("lost in the middle"):** put **key findings first + section
  headers**.
- **Context full but still valid:** `/compact`. **Context stale / cross-session persistence:**
  a **scratchpad file** of key findings (different problems, different fixes).
- **Escalation calibration:** use **explicit escalation criteria + few-shot**, not self-reported
  confidence or customer sentiment. **Honor an explicit human request immediately** — no
  investigation first.
- **Silent error suppression** (subagent returns empty-as-success after a timeout): removes the
  coordinator's ability to recover — surface the error.
- **Aggregate accuracy hides failures:** **stratify** by document type/field; **calibrate**
  confidence scores against a labeled set before routing on them.
- **Conflicting sources:** present **both with attribution and annotate the conflict** — never
  silently average. Preserve **claim→source mappings** through synthesis.

---

## A 2–3 week study plan
1. **Build the model first.** Read the [field guide](claude-code-architecture.md) +
   [mental model](../../docs/claude-code-architecture/mental-model.html). Internalize
   *soft vs hard* and *who-holds-the-plan*.
2. **Domain by weight.** D1 → D2 → D3 → D4 → D5. For each, read the deep-dive page, then run
   the [practice quiz](../../docs/claude-code-architecture/exam-prep.html) filtered to that domain.
3. **Drill the cram sheet** above until each "situation → pattern" is automatic.
4. **Full exam-mode runs.** Take 60-question runs until you clear 720 twice, watching the
   per-domain breakdown for weak spots.
5. **Hands-on.** The exam assumes ~6 months of real use — actually configure CLAUDE.md, a
   skill, a hook, an MCP server, and run subagents/a workflow at least once.

## Attribution
High-yield patterns synthesized and **rewritten** (not copied) from community practice banks,
verified against the docs:
- [hamzafarooq/claude-certified-architect](https://github.com/hamzafarooq/claude-certified-architect) (MIT)
- [timothywarner-org/claude-architect](https://github.com/timothywarner-org/claude-architect) (MIT)
- [carolinacherry/claude-certified-architect](https://github.com/carolinacherry/claude-certified-architect) (MIT)
- [daronyondem/claude-architect-exam-guide](https://github.com/daronyondem/claude-architect-exam-guide) (CC BY 4.0)
- Referenced for coverage (unlicensed — not copied): [OlivierAlter](https://github.com/OlivierAlter/Claude-Certified-Architect-Foundations-Certification-Exam), [dnacenta](https://github.com/dnacenta/claude-certified-architect) (which credits [@hooeem](https://x.com/hooeem)), [paullarionov](https://github.com/paullarionov/claude-certified-architect)

## Related
- [Question bank](cca-f-exam-question-bank.md) · [Field guide](claude-code-architecture.md) · [Harness vs context](harness-vs-context-engineering.md)
