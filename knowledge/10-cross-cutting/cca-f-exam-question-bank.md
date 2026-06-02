---
title: CCA-F Question Bank — Claude Certified Architect (Foundations)
tags: [claude-code, certification, cca-f, exam, practice-questions, cross-cutting]
added: 2026-06-02
reviewed: 2026-06-02
source: original/adapted questions verified against code.claude.com/docs; community banks (see Attribution) informed coverage
interactive: ../../docs/claude-code-architecture/exam-prep.html
---

# CCA-F Question Bank

77 scenario-based practice questions for the **Claude Certified Architect — Foundations**
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
| Agentic architecture & orchestration | 27% | 20 |
| Tool design & MCP integration | 18% | 14 |
| Claude Code config & workflows | 20% | 15 |
| Prompt engineering & structured output | 20% | 15 |
| Context management & reliability | 15% | 13 |
| **Total** | **100%** | **77** |

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
