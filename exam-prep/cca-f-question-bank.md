---
title: CCA-F Question Bank — Claude Certified Architect (Foundations)
tags: [claude-code, certification, cca-f, exam, practice-questions, cross-cutting]
added: 2026-06-02
reviewed: 2026-06-02
source: original/adapted questions verified against code.claude.com/docs; community banks (see Attribution) informed coverage
interactive: ../../docs/claude-code-architecture/exam-prep.html
---

# CCA-F Question Bank

136 scenario-based practice questions for the **Claude Certified Architect — Foundations**
exam, weighted to the official 5-domain blueprint and mapped to the 30 official task statements.
Take them interactively (instant feedback + 60-question exam mode) at the
[practice quiz](../../docs/claude-code-architecture/exam-prep.html); this is the text companion.

> **Not affiliated with or endorsed by Anthropic. No real exam content is reproduced.**
> Questions are original or **rewritten/adapted** from community practice banks and **verified
> against [code.claude.com/docs](https://code.claude.com/docs)**. See Attribution at the bottom.
> Study tip: the exam rewards knowing *why the other three options are wrong* — read every explanation.

## Coverage

| Domain | Weight | Questions |
|---|---|---|
| Agentic architecture & orchestration | 27% | 36 |
| Tool design & MCP integration | 18% | 26 |
| Claude Code config & workflows | 20% | 29 |
| Prompt engineering & structured output | 20% | 23 |
| Context management & reliability | 15% | 22 |
| **Total** | **100%** | **136** |

---

## Agentic architecture & orchestration (27%)

### D1-01 · L201

*Scenario:* A support agent occasionally calls process_refund using only the customer's stated name, skipping the get_customer verification step — sometimes refunding the wrong account.

**Which change most reliably guarantees verification happens first?**

- **A.** Strengthen the system prompt: 'verification is mandatory before any refund'
- **B.** Add few-shot examples that always show get_customer called first
- **C.** Programmatically block lookup_order and process_refund until get_customer returns a verified ID
- **D.** Add a classifier that enables only the appropriate tool subset

<details><summary>Answer & explanation</summary>

**Correct: C.** When the stakes are real, prefer deterministic enforcement over probabilistic nudges. Prompt wording and few-shot examples both have non-zero failure rates; a programmatic prerequisite gate (or PreToolUse hook) enforces ordering 100% of the time. The classifier changes tool availability, not the required ordering.

_Source:_ <https://code.claude.com/docs/en/hooks>

_Adapted from:_ OlivierAlter / hamzafarooq (rewritten)

</details>

### D1-02 · L201

*Scenario:* An agent loop is coded to terminate when the model's text contains the phrase 'I have completed the task.'

**Why is this fragile, and what should drive termination?**

- **A.** It's fine as long as the phrase is exact
- **B.** Natural-language signals are unreliable; stop on the API stop_reason of 'end_turn'
- **C.** Add a 5-second sleep then stop
- **D.** Terminate after any tool error

<details><summary>Answer & explanation</summary>

**Correct: B.** Parsing prose to decide control flow is unreliable — wording drifts. The authoritative signal is the API's stop_reason: 'tool_use' means keep going, 'end_turn' means the model is done. Iteration caps are a safety boundary, not the primary stop mechanism.

_Source:_ <https://platform.claude.com/docs> · <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ OlivierAlter / carolinacherry anti-patterns (rewritten)

</details>

### D1-03 · L201

*Scenario:* A coordinator is configured with clear delegation instructions and named subagents, but in production it always does the work itself and never delegates.

**What is the most likely cause?**

- **A.** The system prompt doesn't name the subagents
- **B.** The subagents have no system prompts
- **C.** 'Task' (the Agent/delegation tool) is missing from the coordinator's allowedTools
- **D.** The coordinator needs more topic context

<details><summary>Answer & explanation</summary>

**Correct: C.** Delegation is a capability, not just an instruction: the coordinator can only spawn workers if its allowedTools includes the Task/Agent tool. This is a configuration requirement — no amount of prompting fixes a missing tool permission.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq / OlivierAlter (rewritten)

</details>

### D1-04 · L201

*Scenario:* A coordinator must run a web-search subagent and a document-analysis subagent at the same time to cut wall-clock time.

**How does it actually run them in parallel?**

- **A.** Emit one Task call, then another on the next turn
- **B.** Emit multiple Task tool calls within a single response
- **C.** Use fork_session for each
- **D.** List every subagent name in allowedTools

<details><summary>Answer & explanation</summary>

**Correct: B.** Parallelism comes from issuing multiple Task/Agent calls in the same assistant turn; sequential turns run them one after another. fork_session is for branching divergent exploration from a shared baseline, not for fanning out different worker types.

_Source:_ <https://code.claude.com/docs/en/sub-agents> · <https://code.claude.com/docs/en/agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-05 · L301

*Scenario:* Three independent investigations (log triage, flaky-test hunt, dependency audit) each emit large output the engineer won't reread; none needs the others' results.

**Best orchestration?**

- **A.** Three parallel subagents, each returning only a summary
- **B.** An agent team with a lead so they coordinate
- **C.** One session with all three problem statements pasted in
- **D.** A dynamic workflow fanning out hundreds of agents

<details><summary>Answer & explanation</summary>

**Correct: A.** Independent + high-volume output that won't be reused = the canonical subagent case (isolated context, summary returns). A team adds coordination the tasks don't need; one session floods context; a workflow is overkill for three tasks.

_Source:_ <https://code.claude.com/docs/en/sub-agents> · <https://code.claude.com/docs/en/agents>

</details>

### D1-06 · L301

*Scenario:* You're running parallel subagents on a migration, but they keep hitting context limits and several need to hand findings to each other to avoid duplicate work.

**Documented next step?**

- **A.** Raise the autocompact threshold and keep using subagents
- **B.** Move to an agent team — peers share a task list and message each other
- **C.** Switch all subagents to Haiku to save context
- **D.** Disable worktree isolation so they share a directory

<details><summary>Answer & explanation</summary>

**Correct: B.** The docs name this exact transition: when parallel subagents hit context limits or need to communicate, agent teams are the natural next step. Tuning autocompact or the model doesn't enable communication; sharing a directory causes file collisions.

_Source:_ <https://code.claude.com/docs/en/agent-teams> · <https://code.claude.com/docs/en/features-overview>

</details>

### D1-07 · L301

*Scenario:* A codebase-wide audit must touch ~500 files, run many checks in parallel, cross-check findings, and be rerunnable next quarter as a script you can read.

**Which approach fits best?**

- **A.** An agent team of 4–5 peers
- **B.** A dynamic workflow — the plan lives in a script orchestrating many subagents with cross-checking
- **C.** Agent view, dispatching 500 background sessions
- **D.** One session with a very large context window

<details><summary>Answer & explanation</summary>

**Correct: B.** Dynamic workflows move the plan into code: a script orchestrates dozens-to-hundreds of subagents, keeps intermediate results in variables (no context flood), applies a repeatable cross-check pattern, and is rerunnable. Teams top out at a handful of peers; agent view is manual supervision; one session can't hold 500 files.

_Source:_ <https://code.claude.com/docs/en/workflows>

</details>

### D1-08 · L301

*Scenario:* A multi-agent research run on 'AI's impact on creative industries' returns only visual-arts coverage. Logs show the coordinator decomposed the task into 'AI in digital art', 'AI in graphic design', 'AI in photography'; every subagent succeeded.

**Root cause?**

- **A.** The synthesis agent lacks coverage-gap instructions
- **B.** The coordinator's task decomposition was too narrow
- **C.** Web-search queries weren't comprehensive
- **D.** Document analysis filtered out non-visual sources

<details><summary>Answer & explanation</summary>

**Correct: B.** Trace the failure to its origin. The subagents executed their assignments correctly; the missing domains (music, writing, film) were never assigned. That's a coordinator decomposition problem, upstream of synthesis or search.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-09 · L301

*Scenario:* Two research subagents investigate the same subtopics; token usage nearly doubled with no extra coverage.

**Most effective fix?**

- **A.** Give both identical tools and let outputs differ naturally
- **B.** Merge them into one agent
- **C.** Partition scope in the coordinator's decomposition — distinct subtopics/sources per agent
- **D.** Add a dedup pass in synthesis

<details><summary>Answer & explanation</summary>

**Correct: C.** Duplicate work is a partitioning failure — fix it upstream in the coordinator by assigning non-overlapping scope. Merging sacrifices specialization; a dedup pass only discards tokens already spent.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-10 · L301

*Scenario:* In a hub-and-spoke research system, an engineer proposes letting the document-analysis subagent send results straight to the synthesis agent, bypassing the coordinator.

**Why keep the coordinator in the middle?**

- **A.** It reduces latency
- **B.** It provides centralized observability, consistent error handling, and controlled information flow
- **C.** It lets subagents share extra context directly
- **D.** It avoids synthesis waiting on reformatting

<details><summary>Answer & explanation</summary>

**Correct: B.** The hub gives you one place to observe progress, apply consistent recovery, and control what context flows where. Direct subagent-to-subagent messaging bypasses all three and makes failures harder to handle.

_Source:_ <https://code.claude.com/docs/en/agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-11 · L301

*Scenario:* A PDF-analysis subagent hits varied failures (corrupt sections, password-protected files, timeouts). Any exception terminates it and dumps to the coordinator, overloading it.

**Best architectural improvement?**

- **A.** Coordinator retries the whole subagent up to 3× on any failure
- **B.** Add error-handling instructions to the subagent's system prompt
- **C.** Pre-validate every PDF upfront
- **D.** Local error recovery in the subagent (fallback parsers, skip-with-partial-result); propagate structured context only for truly unresolvable failures

<details><summary>Answer & explanation</summary>

**Correct: D.** Recover where the error happens and only escalate what can't be resolved locally. Coordinator-level whole-subagent retries are expensive and re-do successful work; prompt instructions don't add fallback parsers; upfront validation can't anticipate every failure.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-12 · L301

*Scenario:* You want to explore two competing refactor architectures, both starting from the same codebase analysis you did this morning, keeping their findings independent.

**Which mechanism?**

- **A.** Two terminal sessions you sync manually
- **B.** --resume with two session names
- **C.** fork_session to branch twice from the shared analysis baseline
- **D.** Two Task calls in one coordinator response

<details><summary>Answer & explanation</summary>

**Correct: C.** fork_session creates independent branches from a shared baseline — ideal for parallel 'what-if' exploration. --resume continues one linear thread; Task calls spawn subagents rather than branch your own session.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-13 · L201

*Scenario:* A refund tool may issue refunds, but any amount over $500 must get manager approval. In production, ~3% of large refunds skipped approval.

**Most reliable enforcement?**

- **A.** Add 'always get approval over $500' to the system prompt
- **B.** A PreToolUse hook that intercepts process_refund and blocks/redirects when amount > $500
- **C.** Few-shot examples of the approval flow
- **D.** Lower the model temperature

<details><summary>Answer & explanation</summary>

**Correct: B.** A monetary control must be deterministic. A PreToolUse hook can inspect the arguments and deny or redirect before execution — guaranteed regardless of the model. Prompt/few-shot/temperature are all probabilistic.

_Source:_ <https://code.claude.com/docs/en/hooks>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D1-14 · L301

*Scenario:* A code-review job always runs the same three steps: per-file analysis, a cross-file integration pass, then a severity-ranked summary. Each step consumes the previous step's output.

**Which decomposition pattern fits, and is it appropriate?**

- **A.** Dynamic decomposition — appropriate
- **B.** A fixed sequential pipeline (prompt chaining) — appropriate, because the structure is stable
- **C.** Evaluator–optimizer loop
- **D.** A fixed pipeline, but inappropriate; it should be dynamic

<details><summary>Answer & explanation</summary>

**Correct: B.** Stable, predictable, output-chaining workflows are the textbook case for a fixed sequential pipeline. Dynamic decomposition adds planning overhead with no benefit when the steps never change.

_Source:_ <https://code.claude.com/docs/en/agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-15 · L201

*Scenario:* An iteration cap of 15 tool calls is being used as the primary way to end an agent's loop.

**What's the issue?**

- **A.** 15 is too low; raise it to 50
- **B.** Caps are a safety boundary, not the primary stop mechanism — terminate on stop_reason 'end_turn'
- **C.** Caps should be removed entirely
- **D.** Switch to a larger model

<details><summary>Answer & explanation</summary>

**Correct: B.** An iteration cap exists to bound runaway loops, not to decide normal completion. The authoritative completion signal is stop_reason == end_turn; the cap is a backstop.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D1-16 · L301

*Scenario:* You have several long-running, independent tasks (a bugfix, a PR review, a flaky-test investigation) you want to start and check back on later, stepping in only when one needs you.

**Best surface?**

- **A.** Agent view — dispatch them as background sessions and supervise from one dashboard
- **B.** An agent team with a lead
- **C.** A single session switching between tasks
- **D.** A dynamic workflow

<details><summary>Answer & explanation</summary>

**Correct: A.** Independent sessions you supervise (not ones that must talk to each other) are exactly what agent view is for: dispatch many background sessions, see status at a glance, attach when one needs input. A team is for peers that coordinate; a workflow is for scripted fan-out.

_Source:_ <https://code.claude.com/docs/en/agent-view> · <https://code.claude.com/docs/en/agents>

</details>

### D1-17 · L301

*Scenario:* Two agent-team teammates are assigned work that both edit src/config.ts.

**What's the risk and the right practice?**

- **A.** No risk — teams auto-isolate each teammate in a worktree
- **B.** They can collide on the file; partition work so no two teammates edit the same file (teams do not auto-isolate)
- **C.** Switch to subagents, which always isolate files
- **D.** Raise the teammate count to spread the load

<details><summary>Answer & explanation</summary>

**Correct: B.** Unlike agent view (which auto-creates a worktree per session), agent teams do NOT automatically isolate teammates — you must partition files so two teammates never edit the same one. Subagents don't 'always' isolate either; isolation is opt-in via isolation: worktree.

_Source:_ <https://code.claude.com/docs/en/agent-teams> · <https://code.claude.com/docs/en/worktrees>

</details>

### D1-18 · L301

*Scenario:* After /resume on a session that had a 4-teammate agent team, the lead tries to message teammates that no longer exist.

**What's going on?**

- **A.** A bug; file a report
- **B.** Agent teams have weak resumability — /resume and /rewind don't restore in-process teammates; tell the lead to spawn new ones
- **C.** The team config file is corrupt; delete it
- **D.** Teammates always survive resume; the lead is confused

<details><summary>Answer & explanation</summary>

**Correct: B.** A documented limitation: resuming/rewinding does not restore in-process teammates, so the lead may reference teammates that are gone. The fix is to have the lead spawn fresh teammates.

_Source:_ <https://code.claude.com/docs/en/agent-teams>

</details>

### D1-19 · L201

*Scenario:* A subagent definition needs to run a verbose, high-volume scan but you don't want its output polluting the main conversation, and it edits files alongside other parallel work.

**Which two settings help most?**

- **A.** Put the scan in CLAUDE.md; run on Opus
- **B.** Keep output by design; share the main worktree
- **C.** Restrict its tools and set isolation: worktree so it edits in its own checkout
- **D.** Disable the subagent and do it inline

<details><summary>Answer & explanation</summary>

**Correct: C.** Subagents already isolate context (only a summary returns). Restricting tools keeps it focused/safe, and isolation: worktree gives it its own git checkout so parallel edits don't collide. CLAUDE.md and the main worktree don't address either need.

_Source:_ <https://code.claude.com/docs/en/sub-agents> · <https://code.claude.com/docs/en/worktrees>

</details>

### D1-20 · L201

*Scenario:* Your team wants to standardize a research subagent across the repo so everyone gets it on clone.

**Where should the subagent definition live?**

- **A.** ~/.claude/agents/ (user scope)
- **B.** .claude/agents/ in the project, committed to the repo
- **C.** Inline in each prompt
- **D.** In CLAUDE.md as prose

<details><summary>Answer & explanation</summary>

**Correct: B.** Project subagents live in .claude/agents/ and, when committed, are shared with everyone who clones the repo. User-scope (~/.claude/agents/) isn't version-controlled; CLAUDE.md prose isn't a subagent definition.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

</details>

### D1-21 · L301

*Scenario:* A support agent handles single-issue requests at 94% accuracy, but multi-issue requests ('refund order #1234 AND update shipping for #5678') drop to 58% — it often handles one and forgets the other.

**Most effective fix? (Task 1.6)**

- **A.** A preprocessing model call that decomposes the request first
- **B.** Combine the tools into fewer universal tools
- **C.** Add few-shot examples demonstrating decomposition and correct tool sequencing for multi-issue requests
- **D.** Add a validation step that re-prompts when an issue is missed

<details><summary>Answer & explanation</summary>

**Correct: C.** The agent already handles single issues; it needs to learn the decomposition/sequencing pattern, which few-shot examples teach directly. A separate preprocessing call adds latency/complexity; merging tools loses specificity; re-prompting treats the symptom.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D1-22 · L301

*Scenario:* Complex requests ('I was billed twice, my discount didn't apply, and I want to cancel') average 12+ tool calls at 54% success, with repeated redundant get_customer calls.

**Best architecture? (Task 1.2)**

- **A.** Add verification checkpoints between every stage
- **B.** Combine get_customer/lookup_order/billing into one investigate_issue tool
- **C.** Decompose into separate issues, investigate them in parallel using shared customer context, then synthesize
- **D.** Add few-shot examples of ideal sequences

<details><summary>Answer & explanation</summary>

**Correct: C.** Decomposition plus parallel investigation with shared customer context eliminates the redundant retrievals and the long sequential loop. A mega-tool hides complexity without structuring it; checkpoints and examples don't fix the redundant fetches.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D1-23 · L201

*Scenario:* An agent averages 4+ API round-trips because it requests get_customer and then lookup_order on separate turns, even when it clearly needs both up front.

**How do you cut the loops? (Task 1.1)**

- **A.** Increase max_tokens
- **B.** Instruct the model to bundle the tool requests it needs into a single turn (parallel tool calls)
- **C.** Create a composite get_customer_with_orders tool
- **D.** Add speculative execution of every likely tool

<details><summary>Answer & explanation</summary>

**Correct: B.** Claude can request multiple tools in one turn; instructing it to bundle obviously-needed calls collapses the sequential loop with minimal change. A composite tool is a heavier redesign; speculative execution wastes calls; max_tokens is irrelevant.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D1-24 · L301

*Scenario:* Complex cases are answered correctly, but CSAT is 15% lower: the explanations are inconsistent and the gaps differ case-to-case. No human oversight is wanted.

**Best improvement? (Task 1.4)**

- **A.** Add a self-critique (evaluator–optimizer) stage that checks the draft against concrete criteria before sending
- **B.** Add a confirmation question: 'Does this fully resolve your issue?'
- **C.** Upgrade the model for complex cases
- **D.** Add few-shot examples for the five most common complex types

<details><summary>Answer & explanation</summary>

**Correct: A.** An evaluator–optimizer (self-critique) stage forces the agent to check its own draft against explicit completeness criteria, catching case-specific gaps that vary too much for fixed few-shot coverage. A confirmation prompt shifts work to the customer; a bigger model doesn't address consistency.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D1-25 · L301

*Scenario:* Tools return data in inconsistent formats (Unix timestamps, ISO 8601, numeric status codes), and some are third-party MCP servers you cannot modify.

**Most maintainable normalization? (Task 1.5)**

- **A.** A PostToolUse hook that intercepts tool outputs and applies formatting transforms before the agent sees them
- **B.** Modify the tools you own and write wrappers for the rest
- **C.** A normalize_data tool the agent must call after every retrieval
- **D.** Detailed format documentation in the system prompt

<details><summary>Answer & explanation</summary>

**Correct: A.** A PostToolUse hook is one deterministic interception point that normalizes all tool output in code — including data from unmodifiable third-party MCP servers — without relying on the model to interpret mixed formats or remembering to call a tool.

_Source:_ <https://code.claude.com/docs/en/hooks>

_Adapted from:_ paullarionov (rewritten)

</details>

### D1-26 · L301

*Scenario:* A previous deep-exploration session mapped the auth flows, but the auth module has since been refactored. You need to continue the work reliably.

**Best approach? (Task 1.7)**

- **A.** --resume the prior session
- **B.** Start fresh and re-explore everything from scratch
- **C.** Start a new session, inject a structured summary of the still-valid findings, and explicitly note the auth module changed
- **D.** Resume and tell Claude to ignore its prior auth observations

<details><summary>Answer & explanation</summary>

**Correct: C.** When prior tool results are now stale, resuming imports them as if current. A new session with a curated summary keeps the valid findings while flagging what changed — accurate and far cheaper than re-exploring everything.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-27 · L301

*Scenario:* A spawned teammate keeps redoing analysis the lead already did and misses project-specific conventions, even though it loads CLAUDE.md.

**Most likely fix? (Task 1.3)**

- **A.** Give the teammate more tools
- **B.** Pass sufficient context in the spawn prompt — teammates load CLAUDE.md/MCP/skills but NOT the lead's conversation history
- **C.** Switch the teammate to a larger model
- **D.** Have the lead do all the work itself

<details><summary>Answer & explanation</summary>

**Correct: B.** Teammates start with project memory and skills but not the lead's conversation. Anything learned in that conversation must be passed explicitly in the spawn prompt, or the teammate works blind to it.

_Source:_ <https://code.claude.com/docs/en/agent-teams>

_Adapted from:_ agent-teams docs

</details>

### D1-28 · L201

*Scenario:* A latency-sensitive step just classifies an incoming message into one of three intents; a colleague proposes a multi-agent pipeline for it.

**Best design? (Task 1.2 / 1.6)**

- **A.** A multi-agent pipeline with a coordinator
- **B.** A single agent (or a single classification call) — multi-agent adds latency and coordination overhead with no benefit
- **C.** An agent team of three classifiers
- **D.** A dynamic workflow

<details><summary>Answer & explanation</summary>

**Correct: B.** Match the topology to the work. A simple, single-step classification needs one agent; multi-agent orchestration adds latency and complexity for nothing. Over-provisioning is as wrong as under-provisioning.

_Source:_ <https://code.claude.com/docs/en/agents>

</details>

### D1-29 · L201

*Scenario:* An agent gets stuck retrying a tool that is permanently failing, looping until it exhausts resources.

**Soundest design? (Task 1.1)**

- **A.** Remove all iteration limits and let it resolve naturally
- **B.** Use a max-iteration cap as a safety backstop AND add a stop condition / error classification so it stops retrying unrecoverable failures
- **C.** Just raise max_tokens
- **D.** Terminate on the first tool error

<details><summary>Answer & explanation</summary>

**Correct: B.** Caps are a safety boundary, not the primary control; pair them with proper error handling (classify and stop on unrecoverable failures). Removing limits invites runaway loops; terminating on any error is too brittle.

_Source:_ <https://platform.claude.com/docs>

</details>

### D1-30 · L301

*Scenario:* A draft must be iteratively improved against a rubric (e.g. a generated summary refined until it meets quality criteria).

**Which pattern fits? (Task 1.6)**

- **A.** A fixed sequential pipeline
- **B.** An evaluator–optimizer loop: one role produces, another scores against the rubric, repeat until it passes
- **C.** A single one-shot call
- **D.** A coordinator with parallel subagents

<details><summary>Answer & explanation</summary>

**Correct: B.** Iterative refinement against explicit criteria is the evaluator–optimizer pattern. A fixed pipeline has no feedback loop; one-shot has no refinement; parallel subagents don't iterate on each other's quality.

_Source:_ <https://code.claude.com/docs/en/agents>

</details>

### D1-31 · L301

*Scenario:* A research question requires gathering from many sources and cross-checking claims against each other for trustworthiness, at a scale beyond one conversation.

**Best tool? (orchestration choice)**

- **A.** A single long session
- **B.** A dynamic workflow (e.g. /deep-research) that fans out and adversarially cross-checks before reporting
- **C.** One subagent
- **D.** A 3-person agent team

<details><summary>Answer & explanation</summary>

**Correct: B.** Cross-checked, large-scale research is exactly what dynamic workflows are built for — fan out, verify claims against each other, and return only the synthesis. One session/subagent can't scale it; a small team lacks the scripted cross-check pattern.

_Source:_ <https://code.claude.com/docs/en/workflows>

</details>

### D1-32 · L301

*Scenario:* A subagent decides it needs to delegate part of its work to yet another subagent.

**What's true, and the right structure? (Task 1.2)**

- **A.** Subagents can nest freely; let it spawn another
- **B.** Subagents cannot spawn subagents — restructure so the main session (or a team/workflow) does the orchestration
- **C.** Switch the subagent to a larger model so it can nest
- **D.** Add 'Task' to the subagent's allowedTools to enable nesting

<details><summary>Answer & explanation</summary>

**Correct: B.** Subagents can't spawn their own subagents (no nesting) — a deliberate constraint. If a workload needs hierarchical delegation, the top-level session orchestrates, or you move to an agent team / dynamic workflow.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

</details>

### D1-33 · L301

*Scenario:* You need to (a) pick up a single investigation tomorrow exactly where you left off, and separately (b) explore two divergent designs from today's shared analysis.

**Which mechanisms? (Task 1.7)**

- **A.** --resume for both
- **B.** fork_session for both
- **C.** --resume for the linear continuation (a); fork_session for the two divergent branches (b)
- **D.** Two terminal windows for both

<details><summary>Answer & explanation</summary>

**Correct: C.** --resume continues one linear thread; fork_session branches independent explorations from a shared baseline. They solve different problems — use each for its case.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D1-34 · L301

*Scenario:* A hard bug has three competing hypotheses; you want them pursued in parallel by workers who can challenge and build on each other's findings.

**Best surface? (orchestration choice)**

- **A.** Three subagents reporting up independently
- **B.** An agent team — peers that share a task list and message each other (adversarial debate)
- **C.** Agent view
- **D.** A single session

<details><summary>Answer & explanation</summary>

**Correct: B.** When the workers need to discuss and react to each other, that's an agent team (peer communication). Subagents only report up and can't debate; agent view sessions don't coordinate; one session can't run them in parallel.

_Source:_ <https://code.claude.com/docs/en/agent-teams>

</details>

### D1-35 · L301

*Scenario:* You have three unrelated tasks — fix a bug, review a PR, investigate a flaky test — that you'll start now and check back on later. They don't interact.

**Best surface? (orchestration choice)**

- **A.** An agent team with a lead
- **B.** Agent view — dispatch them as independent background sessions and supervise from one dashboard
- **C.** A dynamic workflow
- **D.** Three subagents in one session

<details><summary>Answer & explanation</summary>

**Correct: B.** Independent, non-communicating tasks you supervise loosely are the agent-view case. A team adds unneeded coordination; a workflow is for scripted fan-out; subagents in one session tie them to that conversation's lifecycle.

_Source:_ <https://code.claude.com/docs/en/agent-view>

</details>

### D1-36 · L301

*Scenario:* In an agent team, task B must not start until task A's output exists, and a third task depends on both.

**Best way to coordinate? (Task 1.4)**

- **A.** Tell each teammate to poll the others
- **B.** Model the dependencies in the shared task list so they auto-resolve and the lead sequences the handoffs
- **C.** Have the lead do A, B, and C itself
- **D.** Run all three immediately and hope ordering works out

<details><summary>Answer & explanation</summary>

**Correct: B.** Agent teams use a shared task list with dependencies that auto-resolve, so blocked tasks wait and the lead orchestrates handoffs. Polling is wasteful; doing it all in the lead defeats the team; ignoring order causes races.

_Source:_ <https://code.claude.com/docs/en/agent-teams>

</details>

---

## Tool design & MCP integration (18%)

### D2-01 · L201

*Scenario:* An agent keeps calling get_customer for order-status questions where lookup_order is the right tool. Both tools have one-line descriptions ('Gets customer information' / 'Gets order details') and similar ID formats.

**Most effective first step? (Task 2.1)**

- **A.** Add a keyword routing layer that preselects tools
- **B.** Revise the tool descriptions to clearly state purpose, required inputs, and when to use each vs the other
- **C.** Add 8–10 few-shot examples
- **D.** Disable get_customer whenever an order number is present

<details><summary>Answer & explanation</summary>

**Correct: B.** Tool descriptions are the model's primary signal for tool selection. Vague, near-identical descriptions are the root cause; the cheapest fix that addresses it is clarifying purpose, required inputs, and boundaries. Routing layers and few-shot are heavier and don't fix the underlying ambiguity.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D2-02 · L201

*Scenario:* Uploaded-document requests misroute to the web-search agent ~45% of the time. The web tool is analyze_content ('analyzes content and extracts key information'); the doc tool is analyze_document ('analyzes documents and extracts key information').

**Best fix? (Task 2.1)**

- **A.** Add a pre-routing classifier
- **B.** Rename the web tool (e.g. extract_web_results) and rewrite both descriptions so their boundaries don't overlap
- **C.** Merge the two tools into one
- **D.** Add a system-prompt rule to always send uploads to the doc agent

<details><summary>Answer & explanation</summary>

**Correct: B.** The names/descriptions are semantically overlapping — that's the root cause. Renaming and rewriting to make each tool's scope unambiguous fixes selection at the interface level. Merging loses specialization; prompt rules compete with descriptions.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ timothywarner (rewritten)

</details>

### D2-03 · L201

*Scenario:* Tool A returns {"isError":false,"results":[]} when nothing matches; tool B returns {"isError":true,"message":"Database timeout"}. A teammate proposes normalizing both to {"status":"no_results"}.

**Why is that a mistake? (Task 2.2)**

- **A.** isError is required by the MCP spec
- **B.** It conflates an access failure with a valid empty result, so the coordinator can't tell whether to retry — destroying recovery logic
- **C.** Agents always retry on isError:true anyway
- **D.** 'status' isn't a recognized field

<details><summary>Answer & explanation</summary>

**Correct: B.** isError:true means 'couldn't look' (retry candidate); isError:false with an empty list means 'looked, found nothing' (a valid answer). Collapsing them removes the signal the coordinator needs to decide between retrying and accepting the result.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D2-04 · L201

*Scenario:* During an API outage, a search MCP tool returns an empty result set with a success status, so the agent reports 'no records found' instead of recognizing the outage.

**Correct tool design? (Task 2.2)**

- **A.** Cache the last good result and return it
- **B.** Return isError:true with structured error context (failure type, retry guidance) for access failures, distinct from a valid empty result
- **C.** Always retry three times inside the tool and return whatever you get
- **D.** Add the outage warning to the system prompt

<details><summary>Answer & explanation</summary>

**Correct: B.** A tool must surface access failures as errors (isError:true) with enough structure for the caller to decide on recovery, never disguise them as empty-but-successful. Silent retries hide the failure context the coordinator needs.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D2-05 · L201

*Scenario:* A pipeline must guarantee that a specific generate_summary tool is invoked on every run; with the default setting the model sometimes answers in prose instead.

**Which configuration enforces it? (Task 2.3)**

- **A.** tool_choice: "auto"
- **B.** tool_choice: {"type":"tool","name":"generate_summary"}
- **C.** tool_choice: "any"
- **D.** Increase max_tokens

<details><summary>Answer & explanation</summary>

**Correct: B.** Forcing a named tool (tool_choice with type 'tool' and the name) guarantees that specific tool is called. 'any' forces some tool but not which one; 'auto' lets the model decide (the current failing behavior).

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D2-06 · L201

*Scenario:* An extraction agent must always call a tool, but the document type varies and ~30% of the time the model replies with plain text instead of any tool call.

**Best setting? (Task 2.3)**

- **A.** tool_choice: "auto"
- **B.** tool_choice: "any" — force the model to use one of the available tools
- **C.** Force one specific tool by name
- **D.** Lower temperature to 0

<details><summary>Answer & explanation</summary>

**Correct: B.** When you need *a* tool call but the right one depends on the input, 'any' forces tool use while letting the model pick which. Forcing one specific tool would be wrong when the correct tool varies; 'auto' permits the prose responses you're seeing.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D2-07 · L201

*Scenario:* Your team needs to share a GitHub MCP server through the repo. Each developer has their own token, and no secret may be committed.

**Correct configuration? (Task 2.4)**

- **A.** ~/.claude.json with the token hardcoded
- **B.** Project .mcp.json committed to the repo, using ${GITHUB_TOKEN} env-var expansion
- **C.** ~/.claude/CLAUDE.md with an @import of the token
- **D.** .claude/settings.json with the token as a CI secret

<details><summary>Answer & explanation</summary>

**Correct: B.** Project-scoped MCP lives in .mcp.json at the repo root (version-controlled, shared on clone). Env-var expansion (${GITHUB_TOKEN}) lets each dev supply their own credential via the environment, so nothing secret is committed.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D2-08 · L201

*Scenario:* You're connecting to a remote, cloud-hosted internal service that requires OAuth, and the connection must work for teammates who clone the repo.

**Transport and scope? (Task 2.4)**

- **A.** stdio transport, user scope
- **B.** HTTP transport, project scope (committed .mcp.json)
- **C.** SSE transport, local scope
- **D.** WebSocket transport, project scope

<details><summary>Answer & explanation</summary>

**Correct: B.** HTTP is the recommended remote transport and the one supporting OAuth; project scope shares it via the repo. stdio is for local processes; SSE is deprecated; WebSocket supports only header auth (no OAuth).

_Source:_ <https://code.claude.com/docs/en/mcp>

</details>

### D2-09 · L301

*Scenario:* A candidate MCP server fetches and summarizes third-party web pages, and its output is fed straight back to the agent which then takes actions.

**Primary risk to design around? (Task 2.4)**

- **A.** Token cost of large outputs
- **B.** Prompt injection — externally-fetched content can carry instructions the agent may follow
- **C.** It uses SSE instead of HTTP
- **D.** Slow stdio cold-start

<details><summary>Answer & explanation</summary>

**Correct: B.** Any server ingesting external content can smuggle instructions into context (prompt injection) — the headline MCP risk. The docs say to verify you trust each server before connecting it; project-scoped servers require explicit approval. Cost and transport are secondary.

_Source:_ <https://code.claude.com/docs/en/mcp> · <https://code.claude.com/docs/en/security>

</details>

### D2-10 · L201

*Scenario:* An Edit call fails with 'match not unique' because the anchor text appears in many places in the file.

**Best recovery? (Task 2.5)**

- **A.** Run Bash sed to do a global replace
- **B.** Read the file for surrounding context, then retry Edit with a larger old_string that is unique (falling back to a full Read+Write only if needed)
- **C.** Retry the same Edit repeatedly
- **D.** Use Glob to find the file and edit blindly

<details><summary>Answer & explanation</summary>

**Correct: B.** Edit requires a unique match. The right move is to read enough surrounding context to construct a larger, unique old_string, then retry; a full Read+Write of the file is the heavier fallback. sed bypasses the intended tooling and Glob matches paths, not content.

_Source:_ <https://code.claude.com/docs/en/settings>

_Adapted from:_ OlivierAlter vs hamzafarooq differ; reconciled against docs

</details>

### D2-11 · L201

*Scenario:* An agent needs to locate every file that defines a React component and then read one specific file in full.

**Which built-in tools fit? (Task 2.5)**

- **A.** Bash 'cat' for everything
- **B.** Grep to search file contents for the pattern, Glob to match file paths, and Read for the full file
- **C.** Read every file in the repo and filter mentally
- **D.** Edit to probe each file

<details><summary>Answer & explanation</summary>

**Correct: B.** Grep searches contents, Glob matches path patterns, and Read loads a specific file — the right built-ins for search-then-read. Reading everything wastes context; Edit isn't a discovery tool.

_Source:_ <https://code.claude.com/docs/en/settings>

</details>

### D2-12 · L201

*Scenario:* A document-analysis agent was given a general fetch_url tool; it now downloads search-results pages and does ad-hoc web search it shouldn't.

**Best fix? (Task 2.1 / least privilege)**

- **A.** Add a prompt instruction to only fetch documents
- **B.** Replace fetch_url with a constrained load_document tool that validates the URL points to a document
- **C.** Filter calls to known search-engine domains
- **D.** Remove all fetching and route through the coordinator

<details><summary>Answer & explanation</summary>

**Correct: B.** Replacing an over-broad tool with a narrow, validating one makes the unwanted behavior impossible (least privilege), rather than merely discouraged. Prompt instructions and domain filters are leaky; removing fetching entirely overcorrects.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ timothywarner (rewritten)

</details>

### D2-13 · L301

*Scenario:* A synthesis agent frequently needs to verify claims; routing every check through the coordinator adds 40% latency. 85% of checks are simple fact lookups; 15% need deeper investigation.

**Best tool distribution? (Task 2.3)**

- **A.** Give the synthesis agent the full web-search toolset
- **B.** Give it a narrow verify_fact tool for the simple 85%, and keep routing complex checks through the coordinator
- **C.** Batch all verifications to the end
- **D.** Have the search agent speculatively cache extra context

<details><summary>Answer & explanation</summary>

**Correct: B.** Least privilege plus a proportionate fix: a scoped tool handles the common simple case directly (killing most round-trips) while the existing coordinator path handles the rare complex case. The full toolset over-grants; batching delays needed checks.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D2-14 · L201

*Scenario:* You want an MCP server that uses your personal API key, available across all your own projects but never shared or committed.

**Which scope? (Task 2.4)**

- **A.** Project scope (.mcp.json committed)
- **B.** User scope (stored in ~/.claude.json, applies to all your projects, not version-controlled)
- **C.** Plugin scope
- **D.** Managed/enterprise scope

<details><summary>Answer & explanation</summary>

**Correct: B.** User scope gives a server to all your projects without committing it. Project scope would share it (and risk the credential) with everyone who clones the repo; that's wrong for a personal key.

_Source:_ <https://code.claude.com/docs/en/mcp>

</details>

### D2-15 · L301

*Scenario:* A single agent is configured with 18 tools and frequently selects the wrong one; descriptions are already clear.

**Best structural fix? (Task 2.3)**

- **A.** Add few-shot examples for all 18 tools
- **B.** Distribute the tools across subagents (~4–5 each) grouped by domain, so each agent chooses from a small, coherent set
- **C.** Merge tools to reduce the count
- **D.** Add a keyword routing layer

<details><summary>Answer & explanation</summary>

**Correct: B.** Too many tools on one agent degrades selection even with good descriptions. Splitting them across focused subagents (a handful each) is the documented remedy; merging loses capability and routing layers fight the model's own selection.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ dnacenta (rewritten)

</details>

### D2-16 · L201

*Scenario:* On failure, an MCP tool returns a raw stack-trace string, and the coordinator can't decide whether to retry, fall back, or escalate.

**Better tool design? (Task 2.2)**

- **A.** Return the stack trace but make it longer
- **B.** Return a structured error (failure type, message, and retry/fallback guidance) so the caller can act programmatically
- **C.** Return an empty success so the agent moves on
- **D.** Log the error server-side and return nothing

<details><summary>Answer & explanation</summary>

**Correct: B.** Callers need structured error context — type and recovery guidance — to choose retry vs fallback vs escalate. A raw trace isn't actionable; empty-success hides the failure; returning nothing strands the coordinator.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D2-17 · L301

*Scenario:* After you rewrite two overlapping tool descriptions, ~30% of requests still misroute. The system prompt contains 'Always look up the customer first.'

**What to investigate next? (Task 2.1)**

- **A.** Add 10–15 more few-shot examples
- **B.** Audit the system prompt for keyword-sensitive instructions that create unintended tool associations overriding the descriptions
- **C.** Merge the two tools
- **D.** Deploy a routing classifier

<details><summary>Answer & explanation</summary>

**Correct: B.** A system-prompt instruction keyed on words like 'customer' can create a keyword→tool association that competes with the descriptions. The systematic residual misrouting points there, not to more examples or a new classifier.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D2-18 · L201

*Scenario:* You need an MCP server that pushes live events to the client (not request/response), and OAuth is not required.

**Which transport? (Task 2.4)**

- **A.** stdio
- **B.** WebSocket (ws) — for servers that push events; header-auth only
- **C.** HTTP
- **D.** SSE (the recommended default)

<details><summary>Answer & explanation</summary>

**Correct: B.** WebSocket suits servers that push events, using header auth (no OAuth, no --transport flag). HTTP is the recommended remote default for request/response with OAuth; stdio is local; SSE is deprecated.

_Source:_ <https://code.claude.com/docs/en/mcp>

</details>

### D2-19 · L201

*Scenario:* A teammate adds a project-scoped MCP server in .mcp.json; on next launch it shows '⏸ Pending approval' for everyone.

**Why, and is that correct? (Task 2.4)**

- **A.** A bug — project servers should auto-start
- **B.** Correct — project-scoped servers require explicit approval before first use as a trust safeguard
- **C.** The transport is wrong; switch to stdio
- **D.** The token expired

<details><summary>Answer & explanation</summary>

**Correct: B.** Project-scoped servers (committed in .mcp.json) require explicit per-user approval before they run — a deliberate trust boundary, since a committed server could otherwise execute on every clone. Reset choices with claude mcp reset-project-choices.

_Source:_ <https://code.claude.com/docs/en/mcp>

</details>

### D2-20 · L201

*Scenario:* An agent uses Bash 'sed' to make a targeted source edit instead of the Edit tool.

**Why prefer the built-in Edit tool? (Task 2.5)**

- **A.** sed is slower
- **B.** Edit makes a precise, reviewable, permission-governed change with a unique-match guard; ad-hoc Bash text manipulation bypasses that tooling and is riskier
- **C.** Bash can't modify files
- **D.** sed always corrupts files

<details><summary>Answer & explanation</summary>

**Correct: B.** The Edit tool performs targeted, reviewable edits under the permission system and guards against ambiguous matches. Falling back to Bash text manipulation sidesteps those safeguards — reserve Bash for operations the file tools don't cover.

_Source:_ <https://code.claude.com/docs/en/settings>

</details>

### D2-21 · L201

*Scenario:* In a dev-productivity agent, a fetch tool and a search tool have overlapping descriptions, so the agent often fetches when it should search.

**Most effective first step? (Task 2.1)**

- **A.** Add a routing classifier
- **B.** Rewrite the descriptions (and rename if needed) so each tool's purpose and boundaries are unambiguous
- **C.** Remove one of the tools
- **D.** Add 10 few-shot examples

<details><summary>Answer & explanation</summary>

**Correct: B.** Overlapping descriptions are the root cause; clarifying purpose and boundaries (and renaming when names collide semantically) fixes selection at the interface. Classifiers and example padding are heavier and don't remove the ambiguity.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ timothywarner (rewritten)

</details>

### D2-22 · L201

*Scenario:* For one pure-reasoning step you must ensure the model produces a text answer and does NOT call any tool.

**Best control? (Task 2.3)**

- **A.** tool_choice: "any"
- **B.** Don't expose tools for that call (or set tool_choice to 'none'), so no tool can be invoked
- **C.** tool_choice: {"type":"tool","name":"..."}
- **D.** Lower the temperature

<details><summary>Answer & explanation</summary>

**Correct: B.** To guarantee no tool use, either omit tools from that request or force 'none'. 'any' and a named tool both force a call — the opposite of the requirement; temperature doesn't control tool use.

_Source:_ <https://platform.claude.com/docs>

</details>

### D2-23 · L201

*Scenario:* A remote HTTP MCP server starts returning 401 Unauthorized.

**Expected behavior / action? (Task 2.4)**

- **A.** Hardcode a token in .mcp.json
- **B.** The 401 triggers the OAuth flow; authenticate via /mcp, after which tokens are stored in the OS keychain and auto-refreshed
- **C.** Switch to stdio
- **D.** Disable the server permanently

<details><summary>Answer & explanation</summary>

**Correct: B.** For remote servers, a 401/403 triggers OAuth; you authenticate through /mcp and tokens live in the keychain with auto-refresh. Hardcoding secrets or switching transport is wrong.

_Source:_ <https://code.claude.com/docs/en/mcp>

</details>

### D2-24 · L301

*Scenario:* Several MCP servers expose hundreds of tools combined, and you're worried about context cost every turn.

**Best approach? (Task 2.4)**

- **A.** Mark every server alwaysLoad: true
- **B.** Rely on Tool Search (default): only tool names + server instructions load, and Claude searches for tools on demand; reserve alwaysLoad for a few critical servers
- **C.** Disable all but one server
- **D.** Paste the tool list into CLAUDE.md

<details><summary>Answer & explanation</summary>

**Correct: B.** Tool Search keeps only tool names/instructions in context and fetches tools on demand, bounding cost. alwaysLoad forces a server's tools into every turn — use it sparingly for critical servers, not everywhere.

_Source:_ <https://code.claude.com/docs/en/mcp>

</details>

### D2-25 · L201

*Scenario:* A coordinator keeps retrying a search that legitimately returned zero results, wasting calls.

**Root cause? (Task 2.2)**

- **A.** The model is non-deterministic
- **B.** The recovery logic treats a valid empty result (isError:false, results:[]) as a failure; it must distinguish 'looked, found nothing' from 'couldn't look'
- **C.** The search tool is broken
- **D.** max_tokens is too low

<details><summary>Answer & explanation</summary>

**Correct: B.** A valid empty result is a successful answer, not an error. Retrying it forever means the recovery logic conflates empty-success with access failure — the same isError distinction, seen from the caller side.

_Source:_ <https://code.claude.com/docs/en/mcp>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D2-26 · L201

*Scenario:* A document-analysis agent must locate files by name pattern, search their contents for a symbol, and then open one file fully.

**Correct built-in tools, in order? (Task 2.5)**

- **A.** Bash find, Bash grep, Bash cat
- **B.** Glob to match paths, Grep to search contents, Read to open the file
- **C.** Read everything, then filter
- **D.** Edit each candidate to inspect it

<details><summary>Answer & explanation</summary>

**Correct: B.** Glob matches file paths, Grep searches contents, and Read opens a specific file — the purpose-built tools for locate→search→read. Shelling out to find/grep/cat bypasses the optimized tools; reading everything wastes context; Edit isn't for inspection.

_Source:_ <https://code.claude.com/docs/en/settings>

</details>

---

## Claude Code config & workflows (20%)

### D3-01 · L101

*Scenario:* Dev A's work follows the team conventions; Dev B's (same repo and branch) doesn't. Both run /memory and see their config loaded.

**Most likely cause? (Task 3.1)**

- **A.** Dev B is missing some MCP servers
- **B.** Dev A put the conventions in ~/.claude/CLAUDE.md (user scope), which git never tracked, so Dev B never got them
- **C.** Dev B has a silent YAML error
- **D.** A subdirectory CLAUDE.md is overriding the root for Dev B

<details><summary>Answer & explanation</summary>

**Correct: B.** When two people on the same repo diverge, suspect user-level vs project-level config first. User-scope CLAUDE.md isn't version-controlled; conventions everyone must share belong in the committed project CLAUDE.md.

_Source:_ <https://code.claude.com/docs/en/memory>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D3-02 · L201

*Scenario:* A 400+ line CLAUDE.md mixes always-relevant coding standards with workflow-specific guidance for PR review, deploys, and migrations that only matters occasionally.

**Best restructuring? (Task 3.1 / 3.2)**

- **A.** Keep everything in CLAUDE.md via @import
- **B.** Keep the universal standards in CLAUDE.md; move the workflow-specific guidance into skills that load on demand
- **C.** Move all of it into skills, leaving CLAUDE.md empty
- **D.** Split it into one CLAUDE.md per subdirectory

<details><summary>Answer & explanation</summary>

**Correct: B.** CLAUDE.md loads every session, so it should hold what's always needed; procedural, occasional guidance belongs in skills (progressive disclosure) so it costs nothing until invoked. Stuffing it all in CLAUDE.md bloats every turn.

_Source:_ <https://code.claude.com/docs/en/memory> · <https://code.claude.com/docs/en/skills>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-03 · L201

*Scenario:* You want a custom /review command available to every developer automatically when they clone or pull the repo.

**Where do you put it? (Task 3.2)**

- **A.** ~/.claude/commands/ in each developer's home directory
- **B.** .claude/commands/ (or .claude/skills/) committed in the project repo
- **C.** A commands array in .claude/config.json
- **D.** In the root CLAUDE.md

<details><summary>Answer & explanation</summary>

**Correct: B.** Project-level commands/skills committed under .claude/ are version-controlled and auto-available to everyone on clone. ~/.claude/ is personal; .claude/config.json isn't the mechanism; CLAUDE.md prose isn't a command.

_Source:_ <https://code.claude.com/docs/en/skills>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D3-04 · L201

*Scenario:* A developer wants to tweak the team's shared /commit skill for personal use without affecting teammates.

**Best approach? (Task 3.2)**

- **A.** Add a username conditional inside the project skill
- **B.** Create a personal ~/.claude/skills/commit/SKILL.md with the same name — personal skills take precedence
- **C.** Add override: true to the project skill
- **D.** Fork the whole repo

<details><summary>Answer & explanation</summary>

**Correct: B.** Personal (user-scope) skills override same-named project skills, so the developer keeps the familiar /commit name while customizing only for themselves, leaving the team's version untouched.

_Source:_ <https://code.claude.com/docs/en/skills>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-05 · L201

*Scenario:* Test files (Button.test.tsx, etc.) are co-located across dozens of directories, and you want identical testing conventions to apply whenever any test file is edited — without manual invocation.

**Most maintainable mechanism? (Task 3.3)**

- **A.** A single '## Testing' section in the root CLAUDE.md
- **B.** A .claude/rules/ file with paths: ["**/*.test.*", "**/*.spec.*"] frontmatter
- **C.** A CLAUDE.md in every test directory
- **D.** A /generate-tests skill devs must remember to run

<details><summary>Answer & explanation</summary>

**Correct: B.** Path-scoped rules auto-load when a matching file is touched, work across directories, and need no manual trigger. Root CLAUDE.md loads for everything (not scoped); per-directory files don't scale; a skill needs explicit invocation.

_Source:_ <https://code.claude.com/docs/en/memory>

_Adapted from:_ hamzafarooq/dnacenta (rewritten)

</details>

### D3-06 · L201

*Scenario:* You're about to restructure a monolith into microservices — dozens of files and several service-boundary decisions with multiple valid approaches.

**Which mode? (Task 3.4)**

- **A.** Direct execution with comprehensive upfront instructions
- **B.** Plan mode — explore and design before making changes
- **C.** Direct incremental execution
- **D.** Direct execution, switching to plan mode only if surprises emerge

<details><summary>Answer & explanation</summary>

**Correct: B.** Plan mode fits large-scale, multi-file changes with architectural decisions and multiple valid approaches — explore and agree on a plan before expensive edits. The complexity is already known, so don't wait for it to 'emerge.'

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D3-07 · L101

*Scenario:* A change is a single, well-scoped null check in one function.

**Best approach? (Task 3.4)**

- **A.** Enter plan mode and design first
- **B.** Direct execution — the scope is clear and small
- **C.** Spin up an agent team
- **D.** Write a dynamic workflow

<details><summary>Answer & explanation</summary>

**Correct: B.** Match ceremony to complexity. Plan mode and multi-agent orchestration are overhead for a trivial, unambiguous change; direct execution is correct. Knowing when NOT to escalate is itself tested.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D3-08 · L201

*Scenario:* A developer unfamiliar with cache invalidation and stampede prevention asks Claude to implement Redis caching immediately.

**Best iterative technique to surface concerns before coding? (Task 3.5)**

- **A.** Direct execution
- **B.** Plan mode
- **C.** The interview pattern — have Claude ask targeted questions to surface design considerations first
- **D.** Test-driven iteration

<details><summary>Answer & explanation</summary>

**Correct: C.** When the developer doesn't know what they don't know, the interview pattern surfaces unstated requirements (TTL, invalidation, stampede protection) before any code. Plan mode explores implementation but not unknown requirements; TDD presumes you already know the edge cases.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D3-09 · L201

*Scenario:* In CI, `claude "Analyze this pull request..."` hangs waiting for interactive input.

**Correct fix? (Task 3.6)**

- **A.** Set CLAUDE_HEADLESS=true
- **B.** Add the -p / --print flag: claude -p "..."
- **C.** Redirect stdin from /dev/null
- **D.** Add a --batch flag

<details><summary>Answer & explanation</summary>

**Correct: B.** -p / --print is the documented non-interactive (headless) mode: it processes the prompt, writes to stdout, and exits — exactly what CI needs. The other flags/vars don't exist or don't address the interactivity.

_Source:_ <https://code.claude.com/docs/en/headless>

_Adapted from:_ all banks agree (rewritten)

</details>

### D3-10 · L201

*Scenario:* CI reviews come back as narrative prose, but the team needs each finding posted as a separate inline PR comment with file, line, severity, and fix.

**Best approach? (Task 3.6)**

- **A.** Regex-parse the narrative
- **B.** Use --output-format json with --json-schema to enforce structured output, then post via the API
- **C.** Add 'always respond in JSON' to CLAUDE.md
- **D.** Run a second Claude pass to convert prose to JSON

<details><summary>Answer & explanation</summary>

**Correct: B.** The CLI's --output-format json with --json-schema enforces machine-parseable, well-formed output with the required fields. Regex on prose is fragile; CLAUDE.md is soft guidance; a second pass adds cost and another failure point.

_Source:_ <https://code.claude.com/docs/en/headless>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D3-11 · L201

*Scenario:* A /brainstorm skill produces huge exploratory output; afterward the main session is less responsive and loses track of the original task.

**Best fix while keeping the full analysis? (Task 3.2)**

- **A.** Move the skill to ~/.claude/skills/
- **B.** Add context: fork to the skill's frontmatter so it runs in an isolated subagent context
- **C.** Set model: haiku
- **D.** Split it into several smaller skills

<details><summary>Answer & explanation</summary>

**Correct: B.** context: fork runs the skill in a forked subagent context; its verbose output stays there and only the summary returns, keeping the main window clean and responsive. Relocating, downgrading the model, or splitting doesn't solve the context pollution.

_Source:_ <https://code.claude.com/docs/en/skills>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D3-12 · L201

*Scenario:* A second commit to a PR causes the review bot to re-flag issues that were already addressed in the first commit, producing duplicate comments.

**Best fix? (Task 3.6)**

- **A.** Review only the incremental diff
- **B.** Include the prior review findings in context and instruct Claude to report only new or still-unaddressed issues
- **C.** Run a fresh independent instance per commit
- **D.** Increase max_tokens

<details><summary>Answer & explanation</summary>

**Correct: B.** Giving Claude the prior findings lets it distinguish new from already-addressed issues while still catching cross-file problems. Diff-only review misses cross-file issues; an independent instance doesn't know what was already reported.

_Source:_ <https://code.claude.com/docs/en/headless>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D3-13 · L201

*Scenario:* You want certain conventions to load only when editing files under src/payments/ and different ones under src/ui/.

**Best mechanism? (Task 3.3)**

- **A.** Two big sections in the root CLAUDE.md
- **B.** Separate .claude/rules/ files, each with a paths: glob scoping it to its directory
- **C.** A skill per area that you invoke manually
- **D.** Inline comments in the code

<details><summary>Answer & explanation</summary>

**Correct: B.** Path-scoped rules files load conditionally based on which files are in play, keeping unrelated guidance out of context. Root CLAUDE.md isn't scoped; manual skills defeat the 'automatic' requirement.

_Source:_ <https://code.claude.com/docs/en/memory>

_Adapted from:_ dnacenta/timothywarner (rewritten)

</details>

### D3-14 · L201

*Scenario:* You're authoring a skill that takes a ticket ID argument, should run an isolated scan, and only needs Read/Grep tools.

**Which frontmatter combination fits? (Task 3.2)**

- **A.** Only a description
- **B.** argument-hint for the ticket ID, context: fork for isolation, and allowed-tools limited to Read/Grep
- **C.** disable-model-invocation plus model: opus
- **D.** paths globs and nothing else

<details><summary>Answer & explanation</summary>

**Correct: B.** argument-hint documents the expected input, context: fork isolates the scan in a subagent, and allowed-tools narrows the tool surface for focus and safety — each maps directly to a stated requirement.

_Source:_ <https://code.claude.com/docs/en/skills>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-15 · L201

*Scenario:* Before changing anything, you need to understand an unfamiliar, large legacy module — and you don't want the discovery output to consume your main context.

**Best approach? (Task 3.4 / discovery)**

- **A.** Read every file into the main session
- **B.** Use the read-only Explore subagent (or a forked discovery skill) to map the module and report a summary back
- **C.** Start editing and learn as you go
- **D.** Switch to a bigger-context model and paste everything

<details><summary>Answer & explanation</summary>

**Correct: B.** The built-in Explore subagent is read-only and runs in its own context, so it can map the module and return a concise summary without flooding your main window. Reading everything inline or pasting it all defeats the purpose.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-16 · L201

*Scenario:* Your CLAUDE.md has grown unwieldy and mixes unrelated topics, but all of it is genuinely always-relevant.

**Best way to keep it modular? (Task 3.1)**

- **A.** Put everything in one long file and accept it
- **B.** Split it into focused files and pull them in with @path imports (up to depth 4)
- **C.** Move it all into skills
- **D.** Duplicate sections into per-directory CLAUDE.md files

<details><summary>Answer & explanation</summary>

**Correct: B.** CLAUDE.md supports @path imports, so you can keep always-on content modular across focused files without bloating one document. Moving always-relevant facts to skills would make them load-on-demand (wrong for always-on); duplication invites drift.

_Source:_ <https://code.claude.com/docs/en/memory>

</details>

### D3-17 · L101

*Scenario:* A teammate has a legacy .claude/commands/deploy.md and asks whether to migrate it to a skill.

**What's the correct understanding? (Task 3.2)**

- **A.** Slash commands and skills are unrelated systems
- **B.** Custom commands were merged into skills; both .claude/commands/deploy.md and .claude/skills/deploy/SKILL.md create /deploy, with skills the current form
- **C.** Legacy commands no longer work at all
- **D.** Skills can't create slash commands

<details><summary>Answer & explanation</summary>

**Correct: B.** Custom slash commands were merged into skills. The legacy commands path still works and produces the same /command, but skills (SKILL.md) are the current, more capable form (frontmatter, progressive disclosure, invocation control).

_Source:_ <https://code.claude.com/docs/en/skills>

</details>

### D3-18 · L201

*Scenario:* In a monorepo, the api package and the web package need different conventions, and you want each to apply automatically when working in that package.

**Best mechanism? (Task 3.1 / 3.3)**

- **A.** One root CLAUDE.md with both sets of rules
- **B.** Nested CLAUDE.md files per package (and/or .claude/rules with paths globs) so conventions load by location
- **C.** A single skill devs invoke per package
- **D.** Separate repos

<details><summary>Answer & explanation</summary>

**Correct: B.** Memory loads by walking the directory tree, so per-package CLAUDE.md files (or path-scoped rules) apply the right conventions automatically based on where you're working. A combined root file applies everything everywhere.

_Source:_ <https://code.claude.com/docs/en/memory>

</details>

### D3-19 · L201

*Scenario:* You're integrating a third-party API whose data model and edge cases you don't fully understand yet, touching several files.

**Best mode? (Task 3.4)**

- **A.** Direct execution with detailed upfront specs
- **B.** Plan mode — explore the API and codebase and design the integration before editing
- **C.** Direct execution, switching to plan mode only if it gets complex
- **D.** Direct incremental edits

<details><summary>Answer & explanation</summary>

**Correct: B.** Unknowns plus multi-file impact call for plan mode: explore and agree a design before making changes. The complexity is already known to exist, so don't wait for it to surface mid-edit.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-20 · L201

*Scenario:* After two rounds of describing the desired API-response transformation in prose, the output is still wrong on nesting and timestamp formatting.

**Best next iteration technique? (Task 3.5)**

- **A.** Rewrite the prose requirements yet again
- **B.** Provide 2–3 concrete input→output examples of the exact transformation
- **C.** Ask Claude to explain its current understanding
- **D.** Increase max_tokens

<details><summary>Answer & explanation</summary>

**Correct: B.** Concrete input/output examples remove the ambiguity that prose keeps leaving — showing exactly how nesting and timestamps should look. It's the fastest way past repeated prose misunderstandings.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-21 · L301

*Scenario:* An iterative review tool needs Claude to request related files mid-analysis (via tool calls). A manager suggests moving it to the Message Batches API for cost savings.

**Primary limitation? (Task 3.6)**

- **A.** Batch lacks correlation IDs
- **B.** The asynchronous batch model can't execute a tool mid-request and feed results back for Claude to continue — it's incompatible with iterative tool calling
- **C.** Batch doesn't support tool definitions at all
- **D.** The 24h latency would otherwise be fine

<details><summary>Answer & explanation</summary>

**Correct: B.** Fire-and-forget batching can't intercept a tool call, run it, and return the result for the model to continue — fundamentally at odds with multi-round, tool-using review. (Latency is a separate issue.)

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-22 · L301

*Scenario:* Three CI jobs: (1) blocking pre-merge style checks devs wait on, (2) weekly security audits, (3) nightly test generation. The Batches API gives ~50% savings but up to 24h.

**Correct mapping? (Task 3.6)**

- **A.** Batch all three with polling
- **B.** Synchronous for the blocking style checks; Batch for the weekly audit and nightly test-gen
- **C.** Synchronous for all three
- **D.** Batch only the weekly audit

<details><summary>Answer & explanation</summary>

**Correct: B.** Blocking, waited-on checks need synchronous calls; scheduled jobs (weekly audit, nightly test-gen) tolerate the 24h window and capture the savings. Match the API to each job's latency requirement.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D3-23 · L201

*Scenario:* The same skill name exists at both project scope (.claude/skills/) and your personal scope (~/.claude/skills/).

**Which runs, and what's the overall precedence? (Task 3.2)**

- **A.** The project one always wins
- **B.** The personal one wins; overall precedence is Enterprise > Personal > Project (plugins namespaced separately)
- **C.** They merge
- **D.** It errors until you rename one

<details><summary>Answer & explanation</summary>

**Correct: B.** Personal skills override same-named project skills; enterprise-managed skills override both. Knowing this precedence lets you safely customize a team skill for yourself.

_Source:_ <https://code.claude.com/docs/en/skills>

</details>

### D3-24 · L301

*Scenario:* Security wants a set of behavioral guidelines that every developer's Claude Code loads and that individuals cannot remove.

**Best mechanism? (Task 3.1 / governance)**

- **A.** A project CLAUDE.md
- **B.** A managed (enterprise) CLAUDE.md deployed via managed settings — it loads org-wide and cannot be excluded
- **C.** A README
- **D.** A personal CLAUDE.md template

<details><summary>Answer & explanation</summary>

**Correct: B.** A managed CLAUDE.md (the claudeMd managed key) ships org-wide and can't be excluded by users — the right tool for non-removable guidance. (Note it's still soft behavioral guidance; for hard blocks use managed permission rules/hooks.)

_Source:_ <https://code.claude.com/docs/en/settings> · <https://code.claude.com/docs/en/memory>

</details>

### D3-25 · L201

*Scenario:* You're implementing a well-understood function whose edge cases you can enumerate, and you want high correctness with tight iteration.

**Best iterative technique? (Task 3.5)**

- **A.** The interview pattern
- **B.** Test-driven iteration — write the edge-case tests first, then iterate code against them
- **C.** Plan mode
- **D.** Direct one-shot generation

<details><summary>Answer & explanation</summary>

**Correct: B.** When the edge cases are known, TDD gives a tight correctness loop. The interview pattern is for when requirements are unknown; plan mode is for large/architectural work.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

</details>

### D3-26 · L201

*Scenario:* You keep re-asking Claude, every turn, to explain its work in a teaching tone for a learning audience.

**Best mechanism? (Task 3.2)**

- **A.** Put 'always explain like a teacher' in CLAUDE.md
- **B.** Set an output style (e.g. Explanatory/Learning) — it modifies the system prompt to change response voice/format
- **C.** Add it to a skill
- **D.** Add a hook

<details><summary>Answer & explanation</summary>

**Correct: B.** Output styles change Claude's role/voice/format at the system-prompt level — the right tool for a standing response style. CLAUDE.md is a later soft instruction; a skill is a procedure; a hook is deterministic enforcement, not tone.

_Source:_ <https://code.claude.com/docs/en/output-styles>

</details>

### D3-27 · L301

*Scenario:* A headless CI run keeps stalling because agents hit permission prompts for shell and MCP commands they need.

**Best fix? (Task 3.6)**

- **A.** Run interactively in CI
- **B.** Pre-configure the tool allowlist (permission rules / allowed tools) for the commands the run needs before starting; in claude -p there's no one to prompt
- **C.** Set a longer timeout
- **D.** Disable all permissions checks globally on every machine

<details><summary>Answer & explanation</summary>

**Correct: B.** Non-interactive runs follow configured permission rules with no human to confirm, so pre-allow the exact commands the job needs. Running interactively defeats CI; globally disabling permissions is unsafe overkill.

_Source:_ <https://code.claude.com/docs/en/headless> · <https://code.claude.com/docs/en/settings>

</details>

### D3-28 · L201

*Scenario:* You have three things to encode: (a) a fact needed in every session, (b) a multi-step procedure used occasionally, (c) guidance that should apply only when editing files under /payments.

**Correct homes? (Task 3.1 / 3.2 / 3.3)**

- **A.** All three in CLAUDE.md
- **B.** (a) CLAUDE.md, (b) a skill, (c) a .claude/rules file with a paths glob
- **C.** All three as skills
- **D.** (a) a hook, (b) CLAUDE.md, (c) a skill

<details><summary>Answer & explanation</summary>

**Correct: B.** Always-needed fact → CLAUDE.md; occasional procedure → a skill (loads on demand); path-specific guidance → a .claude/rules file scoped with paths. Matching each need to the right mechanism is the core of Domain 3.

_Source:_ <https://code.claude.com/docs/en/memory> · <https://code.claude.com/docs/en/skills>

</details>

### D3-29 · L201

*Scenario:* A teammate worries that entering plan mode for a risky change might let Claude start editing before they approve.

**What does plan mode guarantee? (Task 3.4)**

- **A.** Nothing — it edits as it plans
- **B.** Plan mode is read-only: Claude explores and proposes a plan, and you approve before any edits are made
- **C.** It auto-applies the plan after 30 seconds
- **D.** It only works in CI

<details><summary>Answer & explanation</summary>

**Correct: B.** Plan mode keeps Claude in a read-only, propose-then-approve posture so you sign off before changes happen — ideal for risky or large work. That approval gate is exactly its value.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

</details>

---

## Prompt engineering & structured output (20%)

### D4-01 · L201

*Scenario:* An automated code review produces ~60% false-positive style flags. Adding 'only report high-confidence findings' to the prompt made no difference.

**Why, and what's the fix? (Task 4.1)**

- **A.** Confidence wasn't calibrated; set temperature to 0
- **B.** 'High-confidence' has no operational meaning; define explicit categorical criteria for which issue types to report vs skip
- **C.** The instruction is in the wrong position; move it to the top
- **D.** Style and security need separate passes

<details><summary>Answer & explanation</summary>

**Correct: B.** Vague qualifiers like 'high-confidence' don't change behavior because they aren't operationally defined. Replacing them with explicit, categorical criteria (flag X and Y; skip Z) precisely scopes what gets reported.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D4-02 · L201

*Scenario:* One review category ('potential performance issues') is so noisy that developers now ignore ALL of the bot's output, including good security findings.

**Best short-term fix? (Task 4.1)**

- **A.** Lower the confidence threshold for that category
- **B.** Temporarily disable the performance category entirely while you improve its prompt, restoring trust in the rest
- **C.** Add more detailed instructions for that category
- **D.** Run it as a separate pass

<details><summary>Answer & explanation</summary>

**Correct: B.** A single noisy category contaminates trust in the whole tool. Pulling it out immediately restores credibility for the reliable categories while you fix it offline — a counterintuitive but high-impact move.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D4-03 · L201

*Scenario:* Review comments come back in inconsistent formats; adding 'always include a concrete fix' yields variable output.

**Most reliable technique? (Task 4.2)**

- **A.** Add more explicit step-by-step instructions for every finding type
- **B.** Add 2–4 few-shot examples demonstrating the exact desired output (location, issue, root cause, concrete fix)
- **C.** Set temperature to 0
- **D.** Expand the context window

<details><summary>Answer & explanation</summary>

**Correct: B.** When instructions alone produce inconsistent formatting, a few concrete examples give the model a pattern to replicate — far more reliable than ever-growing abstract instructions.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D4-04 · L201

*Scenario:* Extraction is correct except dates come out as MM/DD/YYYY while the schema requires ISO 8601.

**Most effective fix? (Task 4.4)**

- **A.** Add 'return ISO 8601' to the system prompt and re-run the full extraction
- **B.** Send a follow-up request with the original input, the failed output, and the specific validation error, asking it to correct just that
- **C.** Regex-reformat in post-processing
- **D.** Make the date field nullable and fix it in the app layer

<details><summary>Answer & explanation</summary>

**Correct: B.** This is an output error, not missing data: a targeted validate-and-retry with the specific error is cheaper and more reliable than a full re-run, and keeps the model authoritative over the value.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D4-05 · L201

*Scenario:* A pipeline asks for JSON via prompt only ('respond in valid JSON'); ~3% of responses have JSON syntax errors under load.

**Best design? (Task 4.3)**

- **A.** Add stronger wording: 'ONLY valid JSON, no prose'
- **B.** Switch to tool use with a JSON schema so the structure is enforced
- **C.** Raise the temperature
- **D.** Move the schema into CLAUDE.md

<details><summary>Answer & explanation</summary>

**Correct: B.** Prompt-only formatting still fails under load. Tool use with a JSON schema forces syntactic validity at the API level — the reliable mechanism for structured output.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ OlivierAlter/dnacenta (rewritten)

</details>

### D4-06 · L301

*Scenario:* Even with a strict JSON schema via tool use, validation still catches line items that don't sum to the total and dates placed in the wrong field.

**Why? (Task 4.3 / 4.4)**

- **A.** The schema isn't applied to nested arrays
- **B.** Tool use with a schema guarantees syntactic validity, not semantic correctness — arithmetic and cross-field logic still need application-layer validation
- **C.** You forgot tool_choice: "any"
- **D.** strict: true wasn't set

<details><summary>Answer & explanation</summary>

**Correct: B.** A schema enforces shape and types, not business logic. Sums, date sanity, and cross-field consistency are semantic checks the model can still get wrong — add a validation (and retry) layer.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/dnacenta (rewritten)

</details>

### D4-07 · L201

*Scenario:* An invoice schema makes tax_id a required string, but only 40% of invoices actually contain a tax ID.

**What happens on the other 60%, and the fix? (Task 4.4)**

- **A.** The model returns an error; add a try/catch
- **B.** The model fabricates a value to satisfy the required field — make it optional/nullable so it can honestly return null
- **C.** The whole extraction fails; raise max_tokens
- **D.** It silently skips the field; no fix needed

<details><summary>Answer & explanation</summary>

**Correct: B.** Required fields become 'fabrication factories' — to satisfy the constraint the model invents data. Modeling truly-optional fields as optional/nullable lets the model report absence honestly.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/dnacenta (rewritten)

</details>

### D4-08 · L201

*Scenario:* You have two workloads: (1) a blocking pre-merge review developers wait on, and (2) an overnight tech-debt audit. A manager wants both moved to the Message Batches API for its ~50% savings (results within 24h).

**Best evaluation? (Task 4.5)**

- **A.** Switch both to the Batches API
- **B.** Use the Batches API for the overnight audit only; keep the pre-merge review synchronous
- **C.** Keep both synchronous
- **D.** Switch both, with 10-minute polling as a fallback

<details><summary>Answer & explanation</summary>

**Correct: B.** Match the API to the latency requirement. Batch processing (up to 24h, no latency SLA) suits the overnight job but is unusable for a blocking, interactive gate.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D4-09 · L301

*Scenario:* A nightly batch extraction over thousands of documents has ~2% that fail validation; you want to reprocess efficiently.

**Best approach? (Task 4.5)**

- **A.** Re-run the entire batch
- **B.** Resubmit only the failed items, identified by their custom_id
- **C.** Switch the whole job to synchronous calls
- **D.** Lower the validation strictness

<details><summary>Answer & explanation</summary>

**Correct: B.** Batch items carry a custom_id, so you can resubmit just the failures rather than reprocessing everything — far cheaper. Re-running all or going synchronous wastes work and money.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ dnacenta (rewritten)

</details>

### D4-10 · L301

*Scenario:* Subtle bugs are only caught in human review; the generator's own reasoning shows it considered and then dismissed them. A same-session self-review step doesn't help.

**Most effective architecture? (Task 4.6)**

- **A.** Add extended thinking during generation
- **B.** Run an independent second instance to review without access to the generator's reasoning
- **C.** Add self-review instructions to the generation prompt
- **D.** Include the full test suite in the generation context

<details><summary>Answer & explanation</summary>

**Correct: B.** A same-session review inherits the generator's rationalizations (confirmation bias). A fresh, independent instance reviews with clean eyes — the model analog of human peer review.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D4-11 · L301

*Scenario:* A 14-file PR reviewed in a single pass gives inconsistent depth and even contradictory findings (a pattern flagged in one file, fine in another).

**Root cause and fix? (Task 4.6)**

- **A.** Context window too small; use a bigger model
- **B.** Attention dilution across many files; split into per-file local passes plus a separate cross-file integration pass
- **C.** Inconsistent formatting; auto-format first
- **D.** Scope too broad; review security only

<details><summary>Answer & explanation</summary>

**Correct: B.** Cramming many files into one pass dilutes attention. Per-file passes give consistent local depth; a separate integration pass covers cross-file concerns. A bigger context just gives more to dilute.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D4-12 · L201

*Scenario:* A prompt says 'check that comments are accurate and up to date.' It flags TODO markers and plain descriptions but misses comments that contradict the code.

**Root-cause fix? (Task 4.1)**

- **A.** Add few-shot examples of misleading comments
- **B.** Replace the vague instruction with a categorical rule: flag a comment only when its described behavior contradicts the actual code; skip TODOs, style, and description-only comments
- **C.** Run a second dedicated pass
- **D.** Include git blame data

<details><summary>Answer & explanation</summary>

**Correct: B.** 'Accurate' has no operational definition. A precise categorical decision rule both cuts the false positives (TODOs, descriptions) and targets the real defect (contradiction with code).

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D4-13 · L201

*Scenario:* An extraction returns null for methodology_section whenever the methodology is described inline without a dedicated header.

**Most effective fix? (Task 4.2)**

- **A.** Make the field required
- **B.** Add 2–4 few-shot examples showing extraction from inline descriptions as well as from dedicated headers
- **C.** Add max_tokens headroom
- **D.** Set tool_choice: "any"

<details><summary>Answer & explanation</summary>

**Correct: B.** The model needs to see structural variety. Few-shot examples covering both inline and headered forms teach it to recognize the inline case. Making it required would induce fabrication; max_tokens is irrelevant.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D4-14 · L201

*Scenario:* There are ~15 findings per PR with a 40% false-positive rate; the bottleneck is the time developers spend investigating each. CLAUDE.md already lists acceptable patterns, and stakeholders reject any pre-review filtering.

**Best change? (Task 4.1)**

- **A.** Add a 1–10 confidence score to each finding
- **B.** Require a brief inline rationale per finding (which rule it violates and why this instance isn't a known-acceptable pattern)
- **C.** Reduce scope to security only
- **D.** Require two-instance consensus before posting

<details><summary>Answer & explanation</summary>

**Correct: B.** An inline rationale lets developers judge each finding at a glance, killing investigation time — without filtering anything out (which stakeholders rejected). Scope reduction and consensus are forms of pre-review filtering.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D4-15 · L201

*Scenario:* Test-case suggestions: 6 of 10 duplicate tests that already exist in the file.

**Most effective change? (Task 4.2 / context)**

- **A.** Reduce suggestions from 10 to 5
- **B.** Include the existing test file in context so the model knows what's already covered
- **C.** Focus only on edge cases
- **D.** Post-process to filter by test-name overlap

<details><summary>Answer & explanation</summary>

**Correct: B.** The model can only avoid duplicates it can see. Providing the existing tests addresses the root cause; trimming counts or keyword-filtering treats symptoms.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D4-16 · L201

*Scenario:* A review prompt says 'flag important issues.' Output is inconsistent — sometimes trivial nits, sometimes only crashes.

**Root-cause fix? (Task 4.1)**

- **A.** Add 'be consistent' to the prompt
- **B.** Replace 'important' with an explicit categorical definition (which issue types count as important, which to skip)
- **C.** Lower the temperature to 0
- **D.** Run two passes and intersect

<details><summary>Answer & explanation</summary>

**Correct: B.** 'Important' has no operational meaning, so the model guesses differently each time. Defining the categories explicitly makes the decision rule precise and consistent. Temperature and pass-intersection don't supply the missing definition.

_Source:_ <https://platform.claude.com/docs>

</details>

### D4-17 · L201

*Scenario:* An agent sometimes picks the wrong tool on ambiguous requests ('help with my recent purchase'). You decide to add few-shot examples.

**Most effective example design? (Task 4.2)**

- **A.** 10–15 examples of clear, unambiguous requests
- **B.** 4–6 examples targeted at the ambiguous cases, each with a rationale for why one tool was chosen over plausible alternatives
- **C.** Group all examples by tool
- **D.** One example per tool

<details><summary>Answer & explanation</summary>

**Correct: B.** Targeting the actual failure mode — ambiguous requests — with rationale teaches the comparative decision the model is getting wrong. Generic, unambiguous examples don't address the hard cases.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ paullarionov (rewritten)

</details>

### D4-18 · L301

*Scenario:* Outputs use a strict JSON schema via tool use, yet a nested line-items array sometimes contains entries that violate a business rule (negative quantities).

**Why, and the fix? (Task 4.3 / 4.4)**

- **A.** The schema isn't strict enough; set strict: true
- **B.** Schemas enforce structure/types, not business rules — add application-layer validation (and retry) for semantic constraints like non-negative quantities
- **C.** Switch to prompt-only JSON
- **D.** Use tool_choice: "any"

<details><summary>Answer & explanation</summary>

**Correct: B.** A schema can require an array of numbers but not that each is non-negative or internally consistent. Business rules are semantic and belong in a validation layer with a retry loop on failure.

_Source:_ <https://platform.claude.com/docs>

</details>

### D4-19 · L201

*Scenario:* An extraction sometimes returns a category value outside the allowed enum.

**Most effective feedback-loop fix? (Task 4.4)**

- **A.** Re-run the whole extraction at temperature 0
- **B.** Validate against the enum and, on failure, send a targeted retry that includes the invalid value and the list of allowed values
- **C.** Remove the enum constraint
- **D.** Add max_tokens

<details><summary>Answer & explanation</summary>

**Correct: B.** A precise validate-and-retry — echoing the invalid value and the allowed set — corrects the specific error cheaply and reliably, far better than a blind full re-run or dropping the constraint.

_Source:_ <https://platform.claude.com/docs>

</details>

### D4-20 · L301

*Scenario:* A workload has a strict real-time SLA (sub-second user-facing responses). A manager suggests the Batches API for its 50% cost savings.

**Best evaluation? (Task 4.5)**

- **A.** Use Batches; the savings are worth it
- **B.** Don't batch it — the Batches API can take up to 24h and has no latency SLA; keep it synchronous
- **C.** Batch it with aggressive polling
- **D.** Batch half the requests

<details><summary>Answer & explanation</summary>

**Correct: B.** Batch processing trades latency for cost (up to 24h, no SLA), so it's unusable for real-time, user-facing work. Reserve batching for latency-tolerant jobs.

_Source:_ <https://platform.claude.com/docs>

</details>

### D4-21 · L301

*Scenario:* A generator dismisses real bugs during generation (its reasoning shows it). A teammate proposes adding extended thinking to the generation step to catch them.

**Why won't that reliably work, and what does? (Task 4.6)**

- **A.** Extended thinking always fixes it
- **B.** The bias is intrinsic to reviewing one's own work; use an independent second instance that reviews without the generator's reasoning
- **C.** Add self-review instructions to the same prompt
- **D.** Increase the context window

<details><summary>Answer & explanation</summary>

**Correct: B.** More thinking in the same context still rationalizes the same way (confirmation bias). A separate, independent reviewer without the generation reasoning is the structural fix — the model analog of peer review.

_Source:_ <https://platform.claude.com/docs>

_Adapted from:_ timothywarner (rewritten)

</details>

### D4-22 · L201

*Scenario:* A vague-criteria prompt under-performs; a teammate insists the fix is to move the instruction to the very top of the prompt.

**Best response? (Task 4.1)**

- **A.** Agree — position is the main lever here
- **B.** Position isn't the root cause; the criteria are vague — define explicit categorical criteria regardless of position
- **C.** Move it to the end instead
- **D.** Duplicate it at top and bottom

<details><summary>Answer & explanation</summary>

**Correct: B.** Reordering a vague instruction doesn't make it precise. The fix is explicit, categorical criteria; position is a minor factor next to a missing definition.

_Source:_ <https://platform.claude.com/docs>

</details>

### D4-23 · L201

*Scenario:* A downstream system needs to parse Claude's output programmatically, and prompt-only 'return JSON' occasionally yields prose or malformed JSON.

**Most reliable design? (Task 4.3)**

- **A.** Stronger prompt wording
- **B.** Tool use with a JSON schema (in the CLI, --output-format json with --json-schema) to enforce well-formed, parseable output
- **C.** Post-process prose with regex
- **D.** Raise temperature

<details><summary>Answer & explanation</summary>

**Correct: B.** Enforce structure at the API/CLI level with tool use + schema (or --output-format json/--json-schema) so downstream parsing is reliable. Prompt wording and regex on prose stay fragile.

_Source:_ <https://platform.claude.com/docs> · <https://code.claude.com/docs/en/headless>

</details>

---

## Context management & reliability (15%)

### D5-01 · L301

*Scenario:* After ~15 turns, a support agent refers to 'a recent refund' and 'prompt processing' instead of the customer's specific '$247.83 refund promised by Friday.'

**What failed, and the fix? (Task 5.1)**

- **A.** A tool result was silently dropped; add retries
- **B.** Progressive summarization compressed the specific facts into vague prose; inject a persistent verbatim 'case facts' block (amounts, dates, IDs) every turn, outside the summarized history
- **C.** Lost-in-the-middle; reorder the history
- **D.** The output was truncated; raise max_tokens

<details><summary>Answer & explanation</summary>

**Correct: B.** Summarization destroys high-value specifics first. A structured case-facts block kept outside the summarized history (and re-injected each turn) preserves the exact amounts/dates/IDs reliably.

_Source:_ <https://code.claude.com/docs/en/costs>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D5-02 · L301

*Scenario:* At ~75K tokens, a synthesis agent cites the first 15K and last 10K but omits the middle 50K of its aggregated input.

**Best way to restructure the input? (Task 5.4)**

- **A.** Summarize everything to under 20K before aggregation
- **B.** Put a key-findings summary at the start and organize the details under explicit section headings
- **C.** Stream results incrementally, web results first
- **D.** Rotate which subagent's results appear first each run

<details><summary>Answer & explanation</summary>

**Correct: B.** This is 'lost in the middle.' Leading with a key-findings summary uses primacy, and explicit section headers give navigational anchors so mid-input content gets attention. Over-summarizing loses detail; rotation/streaming don't address position.

_Source:_ <https://code.claude.com/docs/en/costs>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D5-03 · L301

*Scenario:* During a long exploration, context is ~82% full and the model starts drifting to generic patterns instead of the specific code structure it found 20 turns ago — but the existing context is still valid.

**Best immediate action? (Task 5.4)**

- **A.** Start a new session with an injected summary
- **B.** Use /compact to reduce usage while preserving key findings, then continue
- **C.** Switch to a larger-context model
- **D.** Re-read all the earlier files

<details><summary>Answer & explanation</summary>

**Correct: B.** When context is full but still valid, /compact reclaims room while keeping the important findings. A fresh session is for stale context; re-reading files would burn the remaining headroom.

_Source:_ <https://code.claude.com/docs/en/costs>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D5-04 · L301

*Scenario:* An exploration found key module boundaries and transformations; the work must continue across several future sessions without losing these findings.

**Most reliable approach? (Task 5.4)**

- **A.** /compact and keep going
- **B.** Have Claude write the key findings to a scratchpad file in the repo that future sessions read
- **C.** Ask Claude to summarize and manually paste it next time
- **D.** Start fresh and re-describe from memory

<details><summary>Answer & explanation</summary>

**Correct: B.** A scratchpad file persists findings across context boundaries, restarts, and crashes — unlike /compact, which only helps within the current session. It's the durable option for multi-session work.

_Source:_ <https://code.claude.com/docs/en/memory>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D5-05 · L201

*Scenario:* A customer says: 'Just connect me with a human — I'm done with bots.' The agent replies, 'Let me quickly check your account and resolve this first.'

**Is that correct? (Task 5.2)**

- **A.** Yes — it maximizes first-contact resolution
- **B.** No — an explicit human request must be honored immediately, without first attempting investigation
- **C.** Yes — try once before escalating
- **D.** No — escalate only after a tool call confirms it's beyond scope

<details><summary>Answer & explanation</summary>

**Correct: B.** An explicit request for a human is an immediate escalation trigger, no exceptions. (Sentiment alone isn't a trigger, but an explicit request always is.)

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D5-06 · L301

*Scenario:* Policy allows price-matching the company's own site within 14 days but is silent on competitor prices. A customer requests a competitor price-match.

**Best behavior? (Task 5.2)**

- **A.** Approve it — price matching is allowed
- **B.** Deny it outright
- **C.** Escalate for human policy interpretation — there's a genuine policy gap and the agent must not invent policy
- **D.** Average the two prices and offer that

<details><summary>Answer & explanation</summary>

**Correct: C.** A true policy gap (no rule on competitor matching) requires human judgment; the agent should neither fabricate a policy nor guess. Approving/denying both assume a rule that doesn't exist.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D5-07 · L201

*Scenario:* A customer says 'I need help with my account,' and get_customer returns three records matching that name.

**What should the agent do? (Task 5.2)**

- **A.** Pick the most recently active record
- **B.** Pick the highest-lifetime-value record
- **C.** Ask the customer for an additional identifier (email, account number, order ID) before taking any account-specific action
- **D.** Escalate to a human immediately

<details><summary>Answer & explanation</summary>

**Correct: C.** Multiple matches means ambiguous identity; requesting one more identifier resolves it safely. Choosing by a heuristic risks exposing the wrong account's data; immediate escalation is unnecessarily disruptive.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D5-08 · L301

*Scenario:* A subagent times out, then returns an empty result marked as success. The coordinator treats it as 'no data found' and proceeds, missing that the lookup never actually ran.

**What's the failure, and the fix? (Task 5.3)**

- **A.** Latency; raise the timeout
- **B.** Silent error suppression — returning empty-as-success removes the coordinator's ability to recover; the subagent must surface a structured error instead
- **C.** The coordinator needs more context
- **D.** Use a larger model for the subagent

<details><summary>Answer & explanation</summary>

**Correct: B.** Disguising a timeout as an empty success destroys the coordinator's recovery signal. Subagents must propagate structured errors (failure type, what was attempted) so the coordinator can retry or escalate.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ OlivierAlter/hamzafarooq (rewritten)

</details>

### D5-09 · L301

*Scenario:* A web-search subagent gets: academic = 15 papers; industry = '0 results'; patent = 'Connection timeout.'

**Best error propagation to the coordinator? (Task 5.3)**

- **A.** Combine all three into a single error status
- **B.** Return only the academic results and silently drop the rest
- **C.** Return all three distinctly: academic = success; industry = valid empty result (isError:false); patent = isError:true with structured error context
- **D.** Silently retry the patent timeout and return a unified result

<details><summary>Answer & explanation</summary>

**Correct: C.** Each outcome needs a different coordinator response: success, a valid empty result, and an access failure to consider retrying. Distinguishing them preserves recovery; combining or silently retrying hides the context.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D5-10 · L301

*Scenario:* An extraction pipeline reports 96% accuracy across 10,000 invoices, and the team wants to remove human review.

**Most critical validation step first? (Task 5.5)**

- **A.** Run 1,000 more invoices to confirm 96% holds
- **B.** Analyze accuracy by document type and field segment to check performance is consistent, not masking a catastrophic per-segment failure
- **C.** Lower the confidence threshold from 0.9 to 0.85
- **D.** Add a second extraction pass

<details><summary>Answer & explanation</summary>

**Correct: B.** Aggregate accuracy can hide segment failures (e.g. 99.9% on digital, 40% on handwritten still averages ~96%). Stratifying by type/field reveals whether removing human review is actually safe.

_Source:_ <https://code.claude.com/docs/en/evals>

_Adapted from:_ hamzafarooq/OlivierAlter (rewritten)

</details>

### D5-11 · L301

*Scenario:* A team plans to auto-route cases to humans whenever the model's self-reported confidence is below a threshold.

**What must be validated first? (Task 5.5)**

- **A.** That the threshold is exactly 0.8
- **B.** That the confidence scores are calibrated against a labeled set — raw model confidence is often miscalibrated and unreliable for routing
- **C.** That the model uses extended thinking
- **D.** Nothing — model confidence is reliable by default

<details><summary>Answer & explanation</summary>

**Correct: B.** Raw model confidence rarely matches true correctness. Before routing on it, you must calibrate against labeled data; otherwise the routing decisions are built on an unreliable signal.

_Source:_ <https://code.claude.com/docs/en/evals>

_Adapted from:_ OlivierAlter/dnacenta (rewritten)

</details>

### D5-12 · L301

*Scenario:* A document-analysis agent finds two credible sources that conflict (40% vs 12% growth).

**Best handling? (Task 5.6)**

- **A.** Pick the more authoritative source and note it briefly
- **B.** Average them to 26% with a footnote
- **C.** Include both figures with full source attribution and explicitly annotate the conflict, letting synthesis/downstream decide
- **D.** Pause the analysis and wait

<details><summary>Answer & explanation</summary>

**Correct: C.** Surface conflicts transparently with both values and attribution; never average (that fabricates a number) or silently pick one. Pausing is unnecessary — the agent can finish and hand reconciliation upstream.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D5-13 · L301

*Scenario:* A multi-agent research report makes a specific claim, but the source it came from has been lost through synthesis, so it can't be cited.

**Best design to prevent this? (Task 5.6)**

- **A.** Tell the synthesis agent to 'remember sources'
- **B.** Have subagents output structured claim→source mappings, and have synthesis preserve those mappings through to the final report
- **C.** Add citations only at the end from memory
- **D.** Increase the synthesis agent's context window

<details><summary>Answer & explanation</summary>

**Correct: B.** Provenance must be carried as structured data (claim linked to source) from the subagents through synthesis, not reconstructed afterward. Exhortations and bigger context don't guarantee traceability.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ OlivierAlter (rewritten)

</details>

### D5-14 · L301

*Scenario:* A teammate proposes fixing lost-detail problems by editing the summarization prompt to 'always preserve numbers and dates verbatim.'

**Why is a structured facts block better? (Task 5.1)**

- **A.** It isn't; the prompt tweak is equivalent
- **B.** Summarization is inherently lossy and the instruction will eventually be ignored; a structured 'case facts' block kept outside the summarized history guarantees the specifics persist
- **C.** Because it uses fewer tokens
- **D.** Because it disables summarization entirely

<details><summary>Answer & explanation</summary>

**Correct: B.** Telling a lossy process to be lossless is unreliable. Holding critical facts in a structured block outside the summarized history keeps them present every turn regardless of how history is compressed.

_Source:_ <https://code.claude.com/docs/en/costs>

_Adapted from:_ hamzafarooq (rewritten)

</details>

### D5-15 · L301

*Scenario:* Research subagents return verbose reasoning and full source text; the coordinator hits context limits and synthesis degrades.

**Most effective fix? (Task 5.3 / 5.4)**

- **A.** Increase the coordinator's max_tokens
- **B.** Have subagents return structured data (key facts, citations, relevance scores) instead of verbose prose, so only distilled conclusions cross the boundary
- **C.** Add an intermediate summarization agent
- **D.** Reduce the number of subagents

<details><summary>Answer & explanation</summary>

**Correct: B.** Fix the bloat at the source: each subagent's reasoning should stay in its own context, and only structured conclusions should reach the coordinator. A summarizer adds a hop; fewer subagents loses coverage; max_tokens just delays the wall.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ hamzafarooq/timothywarner (rewritten)

</details>

### D5-16 · L301

*Scenario:* A web-search subagent returns 3 of 5 requested categories (two timed out); synthesis must still produce a report.

**Best error-propagation strategy? (Task 5.3)**

- **A.** Synthesize on the successes and don't mention the gaps
- **B.** Structure the output with coverage annotations marking well-supported conclusions vs areas with missing data
- **C.** Fail the whole synthesis and retry everything
- **D.** Silently retry the timeouts inside synthesis

<details><summary>Answer & explanation</summary>

**Correct: B.** Graceful degradation with coverage annotations preserves completed work while transparently flagging gaps, so downstream confidence is informed. Hiding gaps misleads; failing everything discards good results.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D5-17 · L301

*Scenario:* A support agent resolves only 55% first-contact: it escalates simple cases and tries complex policy-exception cases on its own.

**Best way to improve escalation calibration? (Task 5.5)**

- **A.** Have it self-rate confidence 1–10 and route below a threshold
- **B.** Add explicit escalation criteria to the prompt with few-shot examples of escalate-vs-resolve
- **C.** Add sentiment analysis to trigger escalation
- **D.** Train a separate classifier

<details><summary>Answer & explanation</summary>

**Correct: B.** The root cause is unclear decision boundaries; explicit criteria plus few-shot examples fix that directly with no new infrastructure. Self-reported confidence and sentiment are unreliable triggers; a classifier is heavier than needed as a first step.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner (rewritten)

</details>

### D5-18 · L301

*Scenario:* A synthesis must report on a topic where the available sources are thin and partly uncertain.

**Best handling? (Task 5.6)**

- **A.** State conclusions confidently to be useful
- **B.** Annotate uncertainty and coverage — distinguish well-supported claims from weakly-supported ones, with sources
- **C.** Omit the uncertain parts silently
- **D.** Average conflicting figures into one number

<details><summary>Answer & explanation</summary>

**Correct: B.** Faithful synthesis surfaces confidence and coverage so the reader can calibrate trust. Overstating, omitting, or averaging all destroy information the downstream decision needs.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

</details>

### D5-19 · L201

*Scenario:* A user request has two reasonable interpretations that would lead to very different (and partly irreversible) actions.

**Best behavior? (Task 5.2)**

- **A.** Pick the more likely interpretation and proceed
- **B.** Ask one clarifying question to resolve the ambiguity before acting
- **C.** Do both interpretations
- **D.** Escalate to a human immediately

<details><summary>Answer & explanation</summary>

**Correct: B.** When interpretations diverge and actions are consequential, a single clarifying question is the cheap, safe move. Guessing risks the wrong irreversible action; doing both is wasteful/dangerous; immediate escalation is premature.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

</details>

### D5-20 · L301

*Scenario:* Three situations: (a) context is 80% full but all still valid; (b) context is full and partly stale; (c) findings must survive across several future sessions and possible crashes.

**Correct tools? (Task 5.4)**

- **A.** /compact for all three
- **B.** (a) /compact, (b) new session with an injected summary, (c) a scratchpad file in the repo
- **C.** A scratchpad file for all three
- **D.** A bigger-context model for all three

<details><summary>Answer & explanation</summary>

**Correct: B.** /compact reclaims room when context is full-but-valid; a fresh session with a curated summary is right when context is stale; a scratchpad file persists findings across sessions and crashes. Each situation needs its own tool.

_Source:_ <https://code.claude.com/docs/en/costs> · <https://code.claude.com/docs/en/memory>

</details>

### D5-21 · L301

*Scenario:* A high-stakes extraction pipeline is mostly accurate but has a few document segments with much higher error rates; fully removing human review is risky.

**Best human-review design? (Task 5.5)**

- **A.** Remove human review everywhere to cut cost
- **B.** Route only the low-confidence / high-error segments to human review (human-in-the-loop on the risky slice), automate the rest
- **C.** Keep 100% human review forever
- **D.** Review a random 1% sample

<details><summary>Answer & explanation</summary>

**Correct: B.** Target human attention where the risk is — the segments with high error rates — using calibrated confidence to gate. That captures most of the automation savings while protecting against the catastrophic slice. A random sample misses the concentrated risk.

_Source:_ <https://code.claude.com/docs/en/evals>

</details>

### D5-22 · L301

*Scenario:* In a multi-agent run, one subagent throws an unhandled exception, which terminates it and dumps a raw failure to the coordinator, derailing the whole run.

**Best reliability design? (Task 5.3)**

- **A.** Let any exception crash the run so failures are visible
- **B.** Recover locally where possible and otherwise propagate a structured error (type, what was attempted, partial results) so the coordinator can retry, route around it, or annotate coverage
- **C.** Suppress the error and return empty success
- **D.** Retry the entire subagent from scratch on any error

<details><summary>Answer & explanation</summary>

**Correct: B.** Resilient systems recover at the lowest level able to, and otherwise propagate structured error context so the coordinator can make a recovery decision. Crashing the run is brittle; empty-success hides failures; whole-subagent retries are expensive and discard good partial work.

_Source:_ <https://code.claude.com/docs/en/sub-agents>

_Adapted from:_ timothywarner/hamzafarooq (rewritten)

</details>

---

## Attribution & licensing

Questions are **original or rewritten/adapted** and verified against the official docs. Community
banks that informed coverage and calibration:
- [hamzafarooq/claude-certified-architect](https://github.com/hamzafarooq/claude-certified-architect) — **MIT**
- [timothywarner-org/claude-architect](https://github.com/timothywarner-org/claude-architect) — **MIT**
- [carolinacherry/claude-certified-architect](https://github.com/carolinacherry/claude-certified-architect) — **MIT**
- [daronyondem/claude-architect-exam-guide](https://github.com/daronyondem/claude-architect-exam-guide) — **CC BY 4.0** (prose guide)
- Referenced for coverage, **not copied** (unlicensed): [OlivierAlter](https://github.com/OlivierAlter/Claude-Certified-Architect-Foundations-Certification-Exam), [dnacenta](https://github.com/dnacenta/claude-certified-architect) (credits [@hooeem](https://x.com/hooeem)), [paullarionov](https://github.com/paullarionov/claude-certified-architect)
- Paywalled (not accessed): Towards AI/Hightower, Tutorials Dojo, claudecertifications.com

Blueprint & 30 task statements: official Anthropic CCA-F exam guide (community-surfaced).

## Related
- [Study guide & cram sheet](cca-f-study-guide.md) · [Field guide](claude-code-architecture.md) · [Interactive quiz](../../docs/claude-code-architecture/exam-prep.html)
