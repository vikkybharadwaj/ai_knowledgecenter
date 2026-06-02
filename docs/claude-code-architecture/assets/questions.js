/* CCA-F practice question bank.
   ORIGINAL / ADAPTED questions grounded in code.claude.com/docs and verified against it.
   Community practice banks (hamzafarooq MIT, OlivierAlter/dnacenta unlicensed, daronyondem CC-BY)
   informed coverage and calibration; questions here are rewritten in our own words and attributed.
   NO real Anthropic exam content is reproduced.

   Schema: { id, domain, level, scenario?, question, options:[str], answer:int(0-based),
             explanation, sources:[url], attribution? }
   Domains keyed to the official 5-domain blueprint. */

window.CCA_DOMAINS = {
  "agent-arch":  "Agentic architecture & orchestration",
  "claude-code": "Claude Code config & workflows",
  "prompt":      "Prompt engineering & structured output",
  "mcp":         "Tool design & MCP integration",
  "context":     "Context management & reliability"
};

window.CCA_ATTRIB = "Adapted/verified from community study banks (hamzafarooq MIT; OlivierAlter, dnacenta unlicensed; daronyondem CC-BY); rewritten and checked against code.claude.com/docs.";

window.CCA_QUESTIONS = [
  /* ===================== DOMAIN 1 — AGENTIC ARCHITECTURE & ORCHESTRATION (27%) ===================== */
  {
    id: "D1-01", domain: "agent-arch", level: "201",
    scenario: "A support agent occasionally calls process_refund using only the customer's stated name, skipping the get_customer verification step — sometimes refunding the wrong account.",
    question: "Which change most reliably guarantees verification happens first?",
    options: [
      "Strengthen the system prompt: 'verification is mandatory before any refund'",
      "Add few-shot examples that always show get_customer called first",
      "Programmatically block lookup_order and process_refund until get_customer returns a verified ID",
      "Add a classifier that enables only the appropriate tool subset"
    ],
    answer: 2,
    explanation: "When the stakes are real, prefer deterministic enforcement over probabilistic nudges. Prompt wording and few-shot examples both have non-zero failure rates; a programmatic prerequisite gate (or PreToolUse hook) enforces ordering 100% of the time. The classifier changes tool availability, not the required ordering.",
    sources: ["https://code.claude.com/docs/en/hooks"], attribution: "OlivierAlter / hamzafarooq (rewritten)"
  },
  {
    id: "D1-02", domain: "agent-arch", level: "201",
    scenario: "An agent loop is coded to terminate when the model's text contains the phrase 'I have completed the task.'",
    question: "Why is this fragile, and what should drive termination?",
    options: [
      "It's fine as long as the phrase is exact",
      "Natural-language signals are unreliable; stop on the API stop_reason of 'end_turn'",
      "Add a 5-second sleep then stop",
      "Terminate after any tool error"
    ],
    answer: 1,
    explanation: "Parsing prose to decide control flow is unreliable — wording drifts. The authoritative signal is the API's stop_reason: 'tool_use' means keep going, 'end_turn' means the model is done. Iteration caps are a safety boundary, not the primary stop mechanism.",
    sources: ["https://platform.claude.com/docs", "https://code.claude.com/docs/en/sub-agents"], attribution: "OlivierAlter / carolinacherry anti-patterns (rewritten)"
  },
  {
    id: "D1-03", domain: "agent-arch", level: "201",
    scenario: "A coordinator is configured with clear delegation instructions and named subagents, but in production it always does the work itself and never delegates.",
    question: "What is the most likely cause?",
    options: [
      "The system prompt doesn't name the subagents",
      "The subagents have no system prompts",
      "'Task' (the Agent/delegation tool) is missing from the coordinator's allowedTools",
      "The coordinator needs more topic context"
    ],
    answer: 2,
    explanation: "Delegation is a capability, not just an instruction: the coordinator can only spawn workers if its allowedTools includes the Task/Agent tool. This is a configuration requirement — no amount of prompting fixes a missing tool permission.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq / OlivierAlter (rewritten)"
  },
  {
    id: "D1-04", domain: "agent-arch", level: "201",
    scenario: "A coordinator must run a web-search subagent and a document-analysis subagent at the same time to cut wall-clock time.",
    question: "How does it actually run them in parallel?",
    options: [
      "Emit one Task call, then another on the next turn",
      "Emit multiple Task tool calls within a single response",
      "Use fork_session for each",
      "List every subagent name in allowedTools"
    ],
    answer: 1,
    explanation: "Parallelism comes from issuing multiple Task/Agent calls in the same assistant turn; sequential turns run them one after another. fork_session is for branching divergent exploration from a shared baseline, not for fanning out different worker types.",
    sources: ["https://code.claude.com/docs/en/sub-agents", "https://code.claude.com/docs/en/agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-05", domain: "agent-arch", level: "301",
    scenario: "Three independent investigations (log triage, flaky-test hunt, dependency audit) each emit large output the engineer won't reread; none needs the others' results.",
    question: "Best orchestration?",
    options: [
      "Three parallel subagents, each returning only a summary",
      "An agent team with a lead so they coordinate",
      "One session with all three problem statements pasted in",
      "A dynamic workflow fanning out hundreds of agents"
    ],
    answer: 0,
    explanation: "Independent + high-volume output that won't be reused = the canonical subagent case (isolated context, summary returns). A team adds coordination the tasks don't need; one session floods context; a workflow is overkill for three tasks.",
    sources: ["https://code.claude.com/docs/en/sub-agents", "https://code.claude.com/docs/en/agents"]
  },
  {
    id: "D1-06", domain: "agent-arch", level: "301",
    scenario: "You're running parallel subagents on a migration, but they keep hitting context limits and several need to hand findings to each other to avoid duplicate work.",
    question: "Documented next step?",
    options: [
      "Raise the autocompact threshold and keep using subagents",
      "Move to an agent team — peers share a task list and message each other",
      "Switch all subagents to Haiku to save context",
      "Disable worktree isolation so they share a directory"
    ],
    answer: 1,
    explanation: "The docs name this exact transition: when parallel subagents hit context limits or need to communicate, agent teams are the natural next step. Tuning autocompact or the model doesn't enable communication; sharing a directory causes file collisions.",
    sources: ["https://code.claude.com/docs/en/agent-teams", "https://code.claude.com/docs/en/features-overview"]
  },
  {
    id: "D1-07", domain: "agent-arch", level: "301",
    scenario: "A codebase-wide audit must touch ~500 files, run many checks in parallel, cross-check findings, and be rerunnable next quarter as a script you can read.",
    question: "Which approach fits best?",
    options: [
      "An agent team of 4–5 peers",
      "A dynamic workflow — the plan lives in a script orchestrating many subagents with cross-checking",
      "Agent view, dispatching 500 background sessions",
      "One session with a very large context window"
    ],
    answer: 1,
    explanation: "Dynamic workflows move the plan into code: a script orchestrates dozens-to-hundreds of subagents, keeps intermediate results in variables (no context flood), applies a repeatable cross-check pattern, and is rerunnable. Teams top out at a handful of peers; agent view is manual supervision; one session can't hold 500 files.",
    sources: ["https://code.claude.com/docs/en/workflows"]
  },
  {
    id: "D1-08", domain: "agent-arch", level: "301",
    scenario: "A multi-agent research run on 'AI's impact on creative industries' returns only visual-arts coverage. Logs show the coordinator decomposed the task into 'AI in digital art', 'AI in graphic design', 'AI in photography'; every subagent succeeded.",
    question: "Root cause?",
    options: [
      "The synthesis agent lacks coverage-gap instructions",
      "The coordinator's task decomposition was too narrow",
      "Web-search queries weren't comprehensive",
      "Document analysis filtered out non-visual sources"
    ],
    answer: 1,
    explanation: "Trace the failure to its origin. The subagents executed their assignments correctly; the missing domains (music, writing, film) were never assigned. That's a coordinator decomposition problem, upstream of synthesis or search.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-09", domain: "agent-arch", level: "301",
    scenario: "Two research subagents investigate the same subtopics; token usage nearly doubled with no extra coverage.",
    question: "Most effective fix?",
    options: [
      "Give both identical tools and let outputs differ naturally",
      "Merge them into one agent",
      "Partition scope in the coordinator's decomposition — distinct subtopics/sources per agent",
      "Add a dedup pass in synthesis"
    ],
    answer: 2,
    explanation: "Duplicate work is a partitioning failure — fix it upstream in the coordinator by assigning non-overlapping scope. Merging sacrifices specialization; a dedup pass only discards tokens already spent.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-10", domain: "agent-arch", level: "301",
    scenario: "In a hub-and-spoke research system, an engineer proposes letting the document-analysis subagent send results straight to the synthesis agent, bypassing the coordinator.",
    question: "Why keep the coordinator in the middle?",
    options: [
      "It reduces latency",
      "It provides centralized observability, consistent error handling, and controlled information flow",
      "It lets subagents share extra context directly",
      "It avoids synthesis waiting on reformatting"
    ],
    answer: 1,
    explanation: "The hub gives you one place to observe progress, apply consistent recovery, and control what context flows where. Direct subagent-to-subagent messaging bypasses all three and makes failures harder to handle.",
    sources: ["https://code.claude.com/docs/en/agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-11", domain: "agent-arch", level: "301",
    scenario: "A PDF-analysis subagent hits varied failures (corrupt sections, password-protected files, timeouts). Any exception terminates it and dumps to the coordinator, overloading it.",
    question: "Best architectural improvement?",
    options: [
      "Coordinator retries the whole subagent up to 3× on any failure",
      "Add error-handling instructions to the subagent's system prompt",
      "Pre-validate every PDF upfront",
      "Local error recovery in the subagent (fallback parsers, skip-with-partial-result); propagate structured context only for truly unresolvable failures"
    ],
    answer: 3,
    explanation: "Recover where the error happens and only escalate what can't be resolved locally. Coordinator-level whole-subagent retries are expensive and re-do successful work; prompt instructions don't add fallback parsers; upfront validation can't anticipate every failure.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-12", domain: "agent-arch", level: "301",
    scenario: "You want to explore two competing refactor architectures, both starting from the same codebase analysis you did this morning, keeping their findings independent.",
    question: "Which mechanism?",
    options: [
      "Two terminal sessions you sync manually",
      "--resume with two session names",
      "fork_session to branch twice from the shared analysis baseline",
      "Two Task calls in one coordinator response"
    ],
    answer: 2,
    explanation: "fork_session creates independent branches from a shared baseline — ideal for parallel 'what-if' exploration. --resume continues one linear thread; Task calls spawn subagents rather than branch your own session.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-13", domain: "agent-arch", level: "201",
    scenario: "A refund tool may issue refunds, but any amount over $500 must get manager approval. In production, ~3% of large refunds skipped approval.",
    question: "Most reliable enforcement?",
    options: [
      "Add 'always get approval over $500' to the system prompt",
      "A PreToolUse hook that intercepts process_refund and blocks/redirects when amount > $500",
      "Few-shot examples of the approval flow",
      "Lower the model temperature"
    ],
    answer: 1,
    explanation: "A monetary control must be deterministic. A PreToolUse hook can inspect the arguments and deny or redirect before execution — guaranteed regardless of the model. Prompt/few-shot/temperature are all probabilistic.",
    sources: ["https://code.claude.com/docs/en/hooks"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D1-14", domain: "agent-arch", level: "301",
    scenario: "A code-review job always runs the same three steps: per-file analysis, a cross-file integration pass, then a severity-ranked summary. Each step consumes the previous step's output.",
    question: "Which decomposition pattern fits, and is it appropriate?",
    options: [
      "Dynamic decomposition — appropriate",
      "A fixed sequential pipeline (prompt chaining) — appropriate, because the structure is stable",
      "Evaluator–optimizer loop",
      "A fixed pipeline, but inappropriate; it should be dynamic"
    ],
    answer: 1,
    explanation: "Stable, predictable, output-chaining workflows are the textbook case for a fixed sequential pipeline. Dynamic decomposition adds planning overhead with no benefit when the steps never change.",
    sources: ["https://code.claude.com/docs/en/agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-15", domain: "agent-arch", level: "201",
    scenario: "An iteration cap of 15 tool calls is being used as the primary way to end an agent's loop.",
    question: "What's the issue?",
    options: [
      "15 is too low; raise it to 50",
      "Caps are a safety boundary, not the primary stop mechanism — terminate on stop_reason 'end_turn'",
      "Caps should be removed entirely",
      "Switch to a larger model"
    ],
    answer: 1,
    explanation: "An iteration cap exists to bound runaway loops, not to decide normal completion. The authoritative completion signal is stop_reason == end_turn; the cap is a backstop.",
    sources: ["https://platform.claude.com/docs"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D1-16", domain: "agent-arch", level: "301",
    scenario: "You have several long-running, independent tasks (a bugfix, a PR review, a flaky-test investigation) you want to start and check back on later, stepping in only when one needs you.",
    question: "Best surface?",
    options: [
      "Agent view — dispatch them as background sessions and supervise from one dashboard",
      "An agent team with a lead",
      "A single session switching between tasks",
      "A dynamic workflow"
    ],
    answer: 0,
    explanation: "Independent sessions you supervise (not ones that must talk to each other) are exactly what agent view is for: dispatch many background sessions, see status at a glance, attach when one needs input. A team is for peers that coordinate; a workflow is for scripted fan-out.",
    sources: ["https://code.claude.com/docs/en/agent-view", "https://code.claude.com/docs/en/agents"]
  },
  {
    id: "D1-17", domain: "agent-arch", level: "301",
    scenario: "Two agent-team teammates are assigned work that both edit src/config.ts.",
    question: "What's the risk and the right practice?",
    options: [
      "No risk — teams auto-isolate each teammate in a worktree",
      "They can collide on the file; partition work so no two teammates edit the same file (teams do not auto-isolate)",
      "Switch to subagents, which always isolate files",
      "Raise the teammate count to spread the load"
    ],
    answer: 1,
    explanation: "Unlike agent view (which auto-creates a worktree per session), agent teams do NOT automatically isolate teammates — you must partition files so two teammates never edit the same one. Subagents don't 'always' isolate either; isolation is opt-in via isolation: worktree.",
    sources: ["https://code.claude.com/docs/en/agent-teams", "https://code.claude.com/docs/en/worktrees"]
  },
  {
    id: "D1-18", domain: "agent-arch", level: "301",
    scenario: "After /resume on a session that had a 4-teammate agent team, the lead tries to message teammates that no longer exist.",
    question: "What's going on?",
    options: [
      "A bug; file a report",
      "Agent teams have weak resumability — /resume and /rewind don't restore in-process teammates; tell the lead to spawn new ones",
      "The team config file is corrupt; delete it",
      "Teammates always survive resume; the lead is confused"
    ],
    answer: 1,
    explanation: "A documented limitation: resuming/rewinding does not restore in-process teammates, so the lead may reference teammates that are gone. The fix is to have the lead spawn fresh teammates.",
    sources: ["https://code.claude.com/docs/en/agent-teams"]
  },
  {
    id: "D1-19", domain: "agent-arch", level: "201",
    scenario: "A subagent definition needs to run a verbose, high-volume scan but you don't want its output polluting the main conversation, and it edits files alongside other parallel work.",
    question: "Which two settings help most?",
    options: [
      "Put the scan in CLAUDE.md; run on Opus",
      "Keep output by design; share the main worktree",
      "Restrict its tools and set isolation: worktree so it edits in its own checkout",
      "Disable the subagent and do it inline"
    ],
    answer: 2,
    explanation: "Subagents already isolate context (only a summary returns). Restricting tools keeps it focused/safe, and isolation: worktree gives it its own git checkout so parallel edits don't collide. CLAUDE.md and the main worktree don't address either need.",
    sources: ["https://code.claude.com/docs/en/sub-agents", "https://code.claude.com/docs/en/worktrees"]
  },
  {
    id: "D1-20", domain: "agent-arch", level: "201",
    scenario: "Your team wants to standardize a research subagent across the repo so everyone gets it on clone.",
    question: "Where should the subagent definition live?",
    options: [
      "~/.claude/agents/ (user scope)",
      ".claude/agents/ in the project, committed to the repo",
      "Inline in each prompt",
      "In CLAUDE.md as prose"
    ],
    answer: 1,
    explanation: "Project subagents live in .claude/agents/ and, when committed, are shared with everyone who clones the repo. User-scope (~/.claude/agents/) isn't version-controlled; CLAUDE.md prose isn't a subagent definition.",
    sources: ["https://code.claude.com/docs/en/sub-agents"]
  },

  /* ===================== DOMAIN 2 — TOOL DESIGN & MCP INTEGRATION (18%) ===================== */
  {
    id: "D2-01", domain: "mcp", level: "201",
    scenario: "An agent keeps calling get_customer for order-status questions where lookup_order is the right tool. Both tools have one-line descriptions ('Gets customer information' / 'Gets order details') and similar ID formats.",
    question: "Most effective first step? (Task 2.1)",
    options: [
      "Add a keyword routing layer that preselects tools",
      "Revise the tool descriptions to clearly state purpose, required inputs, and when to use each vs the other",
      "Add 8–10 few-shot examples",
      "Disable get_customer whenever an order number is present"
    ],
    answer: 1,
    explanation: "Tool descriptions are the model's primary signal for tool selection. Vague, near-identical descriptions are the root cause; the cheapest fix that addresses it is clarifying purpose, required inputs, and boundaries. Routing layers and few-shot are heavier and don't fix the underlying ambiguity.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D2-02", domain: "mcp", level: "201",
    scenario: "Uploaded-document requests misroute to the web-search agent ~45% of the time. The web tool is analyze_content ('analyzes content and extracts key information'); the doc tool is analyze_document ('analyzes documents and extracts key information').",
    question: "Best fix? (Task 2.1)",
    options: [
      "Add a pre-routing classifier",
      "Rename the web tool (e.g. extract_web_results) and rewrite both descriptions so their boundaries don't overlap",
      "Merge the two tools into one",
      "Add a system-prompt rule to always send uploads to the doc agent"
    ],
    answer: 1,
    explanation: "The names/descriptions are semantically overlapping — that's the root cause. Renaming and rewriting to make each tool's scope unambiguous fixes selection at the interface level. Merging loses specialization; prompt rules compete with descriptions.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D2-03", domain: "mcp", level: "201",
    scenario: "Tool A returns {\"isError\":false,\"results\":[]} when nothing matches; tool B returns {\"isError\":true,\"message\":\"Database timeout\"}. A teammate proposes normalizing both to {\"status\":\"no_results\"}.",
    question: "Why is that a mistake? (Task 2.2)",
    options: [
      "isError is required by the MCP spec",
      "It conflates an access failure with a valid empty result, so the coordinator can't tell whether to retry — destroying recovery logic",
      "Agents always retry on isError:true anyway",
      "'status' isn't a recognized field"
    ],
    answer: 1,
    explanation: "isError:true means 'couldn't look' (retry candidate); isError:false with an empty list means 'looked, found nothing' (a valid answer). Collapsing them removes the signal the coordinator needs to decide between retrying and accepting the result.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D2-04", domain: "mcp", level: "201",
    scenario: "During an API outage, a search MCP tool returns an empty result set with a success status, so the agent reports 'no records found' instead of recognizing the outage.",
    question: "Correct tool design? (Task 2.2)",
    options: [
      "Cache the last good result and return it",
      "Return isError:true with structured error context (failure type, retry guidance) for access failures, distinct from a valid empty result",
      "Always retry three times inside the tool and return whatever you get",
      "Add the outage warning to the system prompt"
    ],
    answer: 1,
    explanation: "A tool must surface access failures as errors (isError:true) with enough structure for the caller to decide on recovery, never disguise them as empty-but-successful. Silent retries hide the failure context the coordinator needs.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D2-05", domain: "mcp", level: "201",
    scenario: "A pipeline must guarantee that a specific generate_summary tool is invoked on every run; with the default setting the model sometimes answers in prose instead.",
    question: "Which configuration enforces it? (Task 2.3)",
    options: [
      "tool_choice: \"auto\"",
      "tool_choice: {\"type\":\"tool\",\"name\":\"generate_summary\"}",
      "tool_choice: \"any\"",
      "Increase max_tokens"
    ],
    answer: 1,
    explanation: "Forcing a named tool (tool_choice with type 'tool' and the name) guarantees that specific tool is called. 'any' forces some tool but not which one; 'auto' lets the model decide (the current failing behavior).",
    sources: ["https://platform.claude.com/docs"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D2-06", domain: "mcp", level: "201",
    scenario: "An extraction agent must always call a tool, but the document type varies and ~30% of the time the model replies with plain text instead of any tool call.",
    question: "Best setting? (Task 2.3)",
    options: [
      "tool_choice: \"auto\"",
      "tool_choice: \"any\" — force the model to use one of the available tools",
      "Force one specific tool by name",
      "Lower temperature to 0"
    ],
    answer: 1,
    explanation: "When you need *a* tool call but the right one depends on the input, 'any' forces tool use while letting the model pick which. Forcing one specific tool would be wrong when the correct tool varies; 'auto' permits the prose responses you're seeing.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D2-07", domain: "mcp", level: "201",
    scenario: "Your team needs to share a GitHub MCP server through the repo. Each developer has their own token, and no secret may be committed.",
    question: "Correct configuration? (Task 2.4)",
    options: [
      "~/.claude.json with the token hardcoded",
      "Project .mcp.json committed to the repo, using ${GITHUB_TOKEN} env-var expansion",
      "~/.claude/CLAUDE.md with an @import of the token",
      ".claude/settings.json with the token as a CI secret"
    ],
    answer: 1,
    explanation: "Project-scoped MCP lives in .mcp.json at the repo root (version-controlled, shared on clone). Env-var expansion (${GITHUB_TOKEN}) lets each dev supply their own credential via the environment, so nothing secret is committed.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D2-08", domain: "mcp", level: "201",
    scenario: "You're connecting to a remote, cloud-hosted internal service that requires OAuth, and the connection must work for teammates who clone the repo.",
    question: "Transport and scope? (Task 2.4)",
    options: [
      "stdio transport, user scope",
      "HTTP transport, project scope (committed .mcp.json)",
      "SSE transport, local scope",
      "WebSocket transport, project scope"
    ],
    answer: 1,
    explanation: "HTTP is the recommended remote transport and the one supporting OAuth; project scope shares it via the repo. stdio is for local processes; SSE is deprecated; WebSocket supports only header auth (no OAuth).",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },
  {
    id: "D2-09", domain: "mcp", level: "301",
    scenario: "A candidate MCP server fetches and summarizes third-party web pages, and its output is fed straight back to the agent which then takes actions.",
    question: "Primary risk to design around? (Task 2.4)",
    options: [
      "Token cost of large outputs",
      "Prompt injection — externally-fetched content can carry instructions the agent may follow",
      "It uses SSE instead of HTTP",
      "Slow stdio cold-start"
    ],
    answer: 1,
    explanation: "Any server ingesting external content can smuggle instructions into context (prompt injection) — the headline MCP risk. The docs say to verify you trust each server before connecting it; project-scoped servers require explicit approval. Cost and transport are secondary.",
    sources: ["https://code.claude.com/docs/en/mcp", "https://code.claude.com/docs/en/security"]
  },
  {
    id: "D2-10", domain: "mcp", level: "201",
    scenario: "An Edit call fails with 'match not unique' because the anchor text appears in many places in the file.",
    question: "Best recovery? (Task 2.5)",
    options: [
      "Run Bash sed to do a global replace",
      "Read the file for surrounding context, then retry Edit with a larger old_string that is unique (falling back to a full Read+Write only if needed)",
      "Retry the same Edit repeatedly",
      "Use Glob to find the file and edit blindly"
    ],
    answer: 1,
    explanation: "Edit requires a unique match. The right move is to read enough surrounding context to construct a larger, unique old_string, then retry; a full Read+Write of the file is the heavier fallback. sed bypasses the intended tooling and Glob matches paths, not content.",
    sources: ["https://code.claude.com/docs/en/settings"], attribution: "OlivierAlter vs hamzafarooq differ; reconciled against docs"
  },
  {
    id: "D2-11", domain: "mcp", level: "201",
    scenario: "An agent needs to locate every file that defines a React component and then read one specific file in full.",
    question: "Which built-in tools fit? (Task 2.5)",
    options: [
      "Bash 'cat' for everything",
      "Grep to search file contents for the pattern, Glob to match file paths, and Read for the full file",
      "Read every file in the repo and filter mentally",
      "Edit to probe each file"
    ],
    answer: 1,
    explanation: "Grep searches contents, Glob matches path patterns, and Read loads a specific file — the right built-ins for search-then-read. Reading everything wastes context; Edit isn't a discovery tool.",
    sources: ["https://code.claude.com/docs/en/settings"]
  },
  {
    id: "D2-12", domain: "mcp", level: "201",
    scenario: "A document-analysis agent was given a general fetch_url tool; it now downloads search-results pages and does ad-hoc web search it shouldn't.",
    question: "Best fix? (Task 2.1 / least privilege)",
    options: [
      "Add a prompt instruction to only fetch documents",
      "Replace fetch_url with a constrained load_document tool that validates the URL points to a document",
      "Filter calls to known search-engine domains",
      "Remove all fetching and route through the coordinator"
    ],
    answer: 1,
    explanation: "Replacing an over-broad tool with a narrow, validating one makes the unwanted behavior impossible (least privilege), rather than merely discouraged. Prompt instructions and domain filters are leaky; removing fetching entirely overcorrects.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D2-13", domain: "mcp", level: "301",
    scenario: "A synthesis agent frequently needs to verify claims; routing every check through the coordinator adds 40% latency. 85% of checks are simple fact lookups; 15% need deeper investigation.",
    question: "Best tool distribution? (Task 2.3)",
    options: [
      "Give the synthesis agent the full web-search toolset",
      "Give it a narrow verify_fact tool for the simple 85%, and keep routing complex checks through the coordinator",
      "Batch all verifications to the end",
      "Have the search agent speculatively cache extra context"
    ],
    answer: 1,
    explanation: "Least privilege plus a proportionate fix: a scoped tool handles the common simple case directly (killing most round-trips) while the existing coordinator path handles the rare complex case. The full toolset over-grants; batching delays needed checks.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D2-14", domain: "mcp", level: "201",
    scenario: "You want an MCP server that uses your personal API key, available across all your own projects but never shared or committed.",
    question: "Which scope? (Task 2.4)",
    options: [
      "Project scope (.mcp.json committed)",
      "User scope (stored in ~/.claude.json, applies to all your projects, not version-controlled)",
      "Plugin scope",
      "Managed/enterprise scope"
    ],
    answer: 1,
    explanation: "User scope gives a server to all your projects without committing it. Project scope would share it (and risk the credential) with everyone who clones the repo; that's wrong for a personal key.",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },

  /* ===================== DOMAIN 3 — CLAUDE CODE CONFIG & WORKFLOWS (20%) ===================== */
  {
    id: "D3-01", domain: "claude-code", level: "101",
    scenario: "Dev A's work follows the team conventions; Dev B's (same repo and branch) doesn't. Both run /memory and see their config loaded.",
    question: "Most likely cause? (Task 3.1)",
    options: [
      "Dev B is missing some MCP servers",
      "Dev A put the conventions in ~/.claude/CLAUDE.md (user scope), which git never tracked, so Dev B never got them",
      "Dev B has a silent YAML error",
      "A subdirectory CLAUDE.md is overriding the root for Dev B"
    ],
    answer: 1,
    explanation: "When two people on the same repo diverge, suspect user-level vs project-level config first. User-scope CLAUDE.md isn't version-controlled; conventions everyone must share belong in the committed project CLAUDE.md.",
    sources: ["https://code.claude.com/docs/en/memory"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D3-02", domain: "claude-code", level: "201",
    scenario: "A 400+ line CLAUDE.md mixes always-relevant coding standards with workflow-specific guidance for PR review, deploys, and migrations that only matters occasionally.",
    question: "Best restructuring? (Task 3.1 / 3.2)",
    options: [
      "Keep everything in CLAUDE.md via @import",
      "Keep the universal standards in CLAUDE.md; move the workflow-specific guidance into skills that load on demand",
      "Move all of it into skills, leaving CLAUDE.md empty",
      "Split it into one CLAUDE.md per subdirectory"
    ],
    answer: 1,
    explanation: "CLAUDE.md loads every session, so it should hold what's always needed; procedural, occasional guidance belongs in skills (progressive disclosure) so it costs nothing until invoked. Stuffing it all in CLAUDE.md bloats every turn.",
    sources: ["https://code.claude.com/docs/en/memory", "https://code.claude.com/docs/en/skills"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-03", domain: "claude-code", level: "201",
    scenario: "You want a custom /review command available to every developer automatically when they clone or pull the repo.",
    question: "Where do you put it? (Task 3.2)",
    options: [
      "~/.claude/commands/ in each developer's home directory",
      ".claude/commands/ (or .claude/skills/) committed in the project repo",
      "A commands array in .claude/config.json",
      "In the root CLAUDE.md"
    ],
    answer: 1,
    explanation: "Project-level commands/skills committed under .claude/ are version-controlled and auto-available to everyone on clone. ~/.claude/ is personal; .claude/config.json isn't the mechanism; CLAUDE.md prose isn't a command.",
    sources: ["https://code.claude.com/docs/en/skills"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D3-04", domain: "claude-code", level: "201",
    scenario: "A developer wants to tweak the team's shared /commit skill for personal use without affecting teammates.",
    question: "Best approach? (Task 3.2)",
    options: [
      "Add a username conditional inside the project skill",
      "Create a personal ~/.claude/skills/commit/SKILL.md with the same name — personal skills take precedence",
      "Add override: true to the project skill",
      "Fork the whole repo"
    ],
    answer: 1,
    explanation: "Personal (user-scope) skills override same-named project skills, so the developer keeps the familiar /commit name while customizing only for themselves, leaving the team's version untouched.",
    sources: ["https://code.claude.com/docs/en/skills"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-05", domain: "claude-code", level: "201",
    scenario: "Test files (Button.test.tsx, etc.) are co-located across dozens of directories, and you want identical testing conventions to apply whenever any test file is edited — without manual invocation.",
    question: "Most maintainable mechanism? (Task 3.3)",
    options: [
      "A single '## Testing' section in the root CLAUDE.md",
      "A .claude/rules/ file with paths: [\"**/*.test.*\", \"**/*.spec.*\"] frontmatter",
      "A CLAUDE.md in every test directory",
      "A /generate-tests skill devs must remember to run"
    ],
    answer: 1,
    explanation: "Path-scoped rules auto-load when a matching file is touched, work across directories, and need no manual trigger. Root CLAUDE.md loads for everything (not scoped); per-directory files don't scale; a skill needs explicit invocation.",
    sources: ["https://code.claude.com/docs/en/memory"], attribution: "hamzafarooq/dnacenta (rewritten)"
  },
  {
    id: "D3-06", domain: "claude-code", level: "201",
    scenario: "You're about to restructure a monolith into microservices — dozens of files and several service-boundary decisions with multiple valid approaches.",
    question: "Which mode? (Task 3.4)",
    options: [
      "Direct execution with comprehensive upfront instructions",
      "Plan mode — explore and design before making changes",
      "Direct incremental execution",
      "Direct execution, switching to plan mode only if surprises emerge"
    ],
    answer: 1,
    explanation: "Plan mode fits large-scale, multi-file changes with architectural decisions and multiple valid approaches — explore and agree on a plan before expensive edits. The complexity is already known, so don't wait for it to 'emerge.'",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D3-07", domain: "claude-code", level: "101",
    scenario: "A change is a single, well-scoped null check in one function.",
    question: "Best approach? (Task 3.4)",
    options: [
      "Enter plan mode and design first",
      "Direct execution — the scope is clear and small",
      "Spin up an agent team",
      "Write a dynamic workflow"
    ],
    answer: 1,
    explanation: "Match ceremony to complexity. Plan mode and multi-agent orchestration are overhead for a trivial, unambiguous change; direct execution is correct. Knowing when NOT to escalate is itself tested.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D3-08", domain: "claude-code", level: "201",
    scenario: "A developer unfamiliar with cache invalidation and stampede prevention asks Claude to implement Redis caching immediately.",
    question: "Best iterative technique to surface concerns before coding? (Task 3.5)",
    options: [
      "Direct execution",
      "Plan mode",
      "The interview pattern — have Claude ask targeted questions to surface design considerations first",
      "Test-driven iteration"
    ],
    answer: 2,
    explanation: "When the developer doesn't know what they don't know, the interview pattern surfaces unstated requirements (TTL, invalidation, stampede protection) before any code. Plan mode explores implementation but not unknown requirements; TDD presumes you already know the edge cases.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D3-09", domain: "claude-code", level: "201",
    scenario: "In CI, `claude \"Analyze this pull request...\"` hangs waiting for interactive input.",
    question: "Correct fix? (Task 3.6)",
    options: [
      "Set CLAUDE_HEADLESS=true",
      "Add the -p / --print flag: claude -p \"...\"",
      "Redirect stdin from /dev/null",
      "Add a --batch flag"
    ],
    answer: 1,
    explanation: "-p / --print is the documented non-interactive (headless) mode: it processes the prompt, writes to stdout, and exits — exactly what CI needs. The other flags/vars don't exist or don't address the interactivity.",
    sources: ["https://code.claude.com/docs/en/headless"], attribution: "all banks agree (rewritten)"
  },
  {
    id: "D3-10", domain: "claude-code", level: "201",
    scenario: "CI reviews come back as narrative prose, but the team needs each finding posted as a separate inline PR comment with file, line, severity, and fix.",
    question: "Best approach? (Task 3.6)",
    options: [
      "Regex-parse the narrative",
      "Use --output-format json with --json-schema to enforce structured output, then post via the API",
      "Add 'always respond in JSON' to CLAUDE.md",
      "Run a second Claude pass to convert prose to JSON"
    ],
    answer: 1,
    explanation: "The CLI's --output-format json with --json-schema enforces machine-parseable, well-formed output with the required fields. Regex on prose is fragile; CLAUDE.md is soft guidance; a second pass adds cost and another failure point.",
    sources: ["https://code.claude.com/docs/en/headless"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D3-11", domain: "claude-code", level: "201",
    scenario: "A /brainstorm skill produces huge exploratory output; afterward the main session is less responsive and loses track of the original task.",
    question: "Best fix while keeping the full analysis? (Task 3.2)",
    options: [
      "Move the skill to ~/.claude/skills/",
      "Add context: fork to the skill's frontmatter so it runs in an isolated subagent context",
      "Set model: haiku",
      "Split it into several smaller skills"
    ],
    answer: 1,
    explanation: "context: fork runs the skill in a forked subagent context; its verbose output stays there and only the summary returns, keeping the main window clean and responsive. Relocating, downgrading the model, or splitting doesn't solve the context pollution.",
    sources: ["https://code.claude.com/docs/en/skills"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D3-12", domain: "claude-code", level: "201",
    scenario: "A second commit to a PR causes the review bot to re-flag issues that were already addressed in the first commit, producing duplicate comments.",
    question: "Best fix? (Task 3.6)",
    options: [
      "Review only the incremental diff",
      "Include the prior review findings in context and instruct Claude to report only new or still-unaddressed issues",
      "Run a fresh independent instance per commit",
      "Increase max_tokens"
    ],
    answer: 1,
    explanation: "Giving Claude the prior findings lets it distinguish new from already-addressed issues while still catching cross-file problems. Diff-only review misses cross-file issues; an independent instance doesn't know what was already reported.",
    sources: ["https://code.claude.com/docs/en/headless"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D3-13", domain: "claude-code", level: "201",
    scenario: "You want certain conventions to load only when editing files under src/payments/ and different ones under src/ui/.",
    question: "Best mechanism? (Task 3.3)",
    options: [
      "Two big sections in the root CLAUDE.md",
      "Separate .claude/rules/ files, each with a paths: glob scoping it to its directory",
      "A skill per area that you invoke manually",
      "Inline comments in the code"
    ],
    answer: 1,
    explanation: "Path-scoped rules files load conditionally based on which files are in play, keeping unrelated guidance out of context. Root CLAUDE.md isn't scoped; manual skills defeat the 'automatic' requirement.",
    sources: ["https://code.claude.com/docs/en/memory"], attribution: "dnacenta/timothywarner (rewritten)"
  },
  {
    id: "D3-14", domain: "claude-code", level: "201",
    scenario: "You're authoring a skill that takes a ticket ID argument, should run an isolated scan, and only needs Read/Grep tools.",
    question: "Which frontmatter combination fits? (Task 3.2)",
    options: [
      "Only a description",
      "argument-hint for the ticket ID, context: fork for isolation, and allowed-tools limited to Read/Grep",
      "disable-model-invocation plus model: opus",
      "paths globs and nothing else"
    ],
    answer: 1,
    explanation: "argument-hint documents the expected input, context: fork isolates the scan in a subagent, and allowed-tools narrows the tool surface for focus and safety — each maps directly to a stated requirement.",
    sources: ["https://code.claude.com/docs/en/skills"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-15", domain: "claude-code", level: "201",
    scenario: "Before changing anything, you need to understand an unfamiliar, large legacy module — and you don't want the discovery output to consume your main context.",
    question: "Best approach? (Task 3.4 / discovery)",
    options: [
      "Read every file into the main session",
      "Use the read-only Explore subagent (or a forked discovery skill) to map the module and report a summary back",
      "Start editing and learn as you go",
      "Switch to a bigger-context model and paste everything"
    ],
    answer: 1,
    explanation: "The built-in Explore subagent is read-only and runs in its own context, so it can map the module and return a concise summary without flooding your main window. Reading everything inline or pasting it all defeats the purpose.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },

  /* ===================== DOMAIN 4 — PROMPT ENGINEERING & STRUCTURED OUTPUT (20%) ===================== */
  {
    id: "D4-01", domain: "prompt", level: "201",
    scenario: "An automated code review produces ~60% false-positive style flags. Adding 'only report high-confidence findings' to the prompt made no difference.",
    question: "Why, and what's the fix? (Task 4.1)",
    options: [
      "Confidence wasn't calibrated; set temperature to 0",
      "'High-confidence' has no operational meaning; define explicit categorical criteria for which issue types to report vs skip",
      "The instruction is in the wrong position; move it to the top",
      "Style and security need separate passes"
    ],
    answer: 1,
    explanation: "Vague qualifiers like 'high-confidence' don't change behavior because they aren't operationally defined. Replacing them with explicit, categorical criteria (flag X and Y; skip Z) precisely scopes what gets reported.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D4-02", domain: "prompt", level: "201",
    scenario: "One review category ('potential performance issues') is so noisy that developers now ignore ALL of the bot's output, including good security findings.",
    question: "Best short-term fix? (Task 4.1)",
    options: [
      "Lower the confidence threshold for that category",
      "Temporarily disable the performance category entirely while you improve its prompt, restoring trust in the rest",
      "Add more detailed instructions for that category",
      "Run it as a separate pass"
    ],
    answer: 1,
    explanation: "A single noisy category contaminates trust in the whole tool. Pulling it out immediately restores credibility for the reliable categories while you fix it offline — a counterintuitive but high-impact move.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D4-03", domain: "prompt", level: "201",
    scenario: "Review comments come back in inconsistent formats; adding 'always include a concrete fix' yields variable output.",
    question: "Most reliable technique? (Task 4.2)",
    options: [
      "Add more explicit step-by-step instructions for every finding type",
      "Add 2–4 few-shot examples demonstrating the exact desired output (location, issue, root cause, concrete fix)",
      "Set temperature to 0",
      "Expand the context window"
    ],
    answer: 1,
    explanation: "When instructions alone produce inconsistent formatting, a few concrete examples give the model a pattern to replicate — far more reliable than ever-growing abstract instructions.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D4-04", domain: "prompt", level: "201",
    scenario: "Extraction is correct except dates come out as MM/DD/YYYY while the schema requires ISO 8601.",
    question: "Most effective fix? (Task 4.4)",
    options: [
      "Add 'return ISO 8601' to the system prompt and re-run the full extraction",
      "Send a follow-up request with the original input, the failed output, and the specific validation error, asking it to correct just that",
      "Regex-reformat in post-processing",
      "Make the date field nullable and fix it in the app layer"
    ],
    answer: 1,
    explanation: "This is an output error, not missing data: a targeted validate-and-retry with the specific error is cheaper and more reliable than a full re-run, and keeps the model authoritative over the value.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D4-05", domain: "prompt", level: "201",
    scenario: "A pipeline asks for JSON via prompt only ('respond in valid JSON'); ~3% of responses have JSON syntax errors under load.",
    question: "Best design? (Task 4.3)",
    options: [
      "Add stronger wording: 'ONLY valid JSON, no prose'",
      "Switch to tool use with a JSON schema so the structure is enforced",
      "Raise the temperature",
      "Move the schema into CLAUDE.md"
    ],
    answer: 1,
    explanation: "Prompt-only formatting still fails under load. Tool use with a JSON schema forces syntactic validity at the API level — the reliable mechanism for structured output.",
    sources: ["https://platform.claude.com/docs"], attribution: "OlivierAlter/dnacenta (rewritten)"
  },
  {
    id: "D4-06", domain: "prompt", level: "301",
    scenario: "Even with a strict JSON schema via tool use, validation still catches line items that don't sum to the total and dates placed in the wrong field.",
    question: "Why? (Task 4.3 / 4.4)",
    options: [
      "The schema isn't applied to nested arrays",
      "Tool use with a schema guarantees syntactic validity, not semantic correctness — arithmetic and cross-field logic still need application-layer validation",
      "You forgot tool_choice: \"any\"",
      "strict: true wasn't set"
    ],
    answer: 1,
    explanation: "A schema enforces shape and types, not business logic. Sums, date sanity, and cross-field consistency are semantic checks the model can still get wrong — add a validation (and retry) layer.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/dnacenta (rewritten)"
  },
  {
    id: "D4-07", domain: "prompt", level: "201",
    scenario: "An invoice schema makes tax_id a required string, but only 40% of invoices actually contain a tax ID.",
    question: "What happens on the other 60%, and the fix? (Task 4.4)",
    options: [
      "The model returns an error; add a try/catch",
      "The model fabricates a value to satisfy the required field — make it optional/nullable so it can honestly return null",
      "The whole extraction fails; raise max_tokens",
      "It silently skips the field; no fix needed"
    ],
    answer: 1,
    explanation: "Required fields become 'fabrication factories' — to satisfy the constraint the model invents data. Modeling truly-optional fields as optional/nullable lets the model report absence honestly.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/dnacenta (rewritten)"
  },
  {
    id: "D4-08", domain: "prompt", level: "201",
    scenario: "You have two workloads: (1) a blocking pre-merge review developers wait on, and (2) an overnight tech-debt audit. A manager wants both moved to the Message Batches API for its ~50% savings (results within 24h).",
    question: "Best evaluation? (Task 4.5)",
    options: [
      "Switch both to the Batches API",
      "Use the Batches API for the overnight audit only; keep the pre-merge review synchronous",
      "Keep both synchronous",
      "Switch both, with 10-minute polling as a fallback"
    ],
    answer: 1,
    explanation: "Match the API to the latency requirement. Batch processing (up to 24h, no latency SLA) suits the overnight job but is unusable for a blocking, interactive gate.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D4-09", domain: "prompt", level: "301",
    scenario: "A nightly batch extraction over thousands of documents has ~2% that fail validation; you want to reprocess efficiently.",
    question: "Best approach? (Task 4.5)",
    options: [
      "Re-run the entire batch",
      "Resubmit only the failed items, identified by their custom_id",
      "Switch the whole job to synchronous calls",
      "Lower the validation strictness"
    ],
    answer: 1,
    explanation: "Batch items carry a custom_id, so you can resubmit just the failures rather than reprocessing everything — far cheaper. Re-running all or going synchronous wastes work and money.",
    sources: ["https://platform.claude.com/docs"], attribution: "dnacenta (rewritten)"
  },
  {
    id: "D4-10", domain: "prompt", level: "301",
    scenario: "Subtle bugs are only caught in human review; the generator's own reasoning shows it considered and then dismissed them. A same-session self-review step doesn't help.",
    question: "Most effective architecture? (Task 4.6)",
    options: [
      "Add extended thinking during generation",
      "Run an independent second instance to review without access to the generator's reasoning",
      "Add self-review instructions to the generation prompt",
      "Include the full test suite in the generation context"
    ],
    answer: 1,
    explanation: "A same-session review inherits the generator's rationalizations (confirmation bias). A fresh, independent instance reviews with clean eyes — the model analog of human peer review.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D4-11", domain: "prompt", level: "301",
    scenario: "A 14-file PR reviewed in a single pass gives inconsistent depth and even contradictory findings (a pattern flagged in one file, fine in another).",
    question: "Root cause and fix? (Task 4.6)",
    options: [
      "Context window too small; use a bigger model",
      "Attention dilution across many files; split into per-file local passes plus a separate cross-file integration pass",
      "Inconsistent formatting; auto-format first",
      "Scope too broad; review security only"
    ],
    answer: 1,
    explanation: "Cramming many files into one pass dilutes attention. Per-file passes give consistent local depth; a separate integration pass covers cross-file concerns. A bigger context just gives more to dilute.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D4-12", domain: "prompt", level: "201",
    scenario: "A prompt says 'check that comments are accurate and up to date.' It flags TODO markers and plain descriptions but misses comments that contradict the code.",
    question: "Root-cause fix? (Task 4.1)",
    options: [
      "Add few-shot examples of misleading comments",
      "Replace the vague instruction with a categorical rule: flag a comment only when its described behavior contradicts the actual code; skip TODOs, style, and description-only comments",
      "Run a second dedicated pass",
      "Include git blame data"
    ],
    answer: 1,
    explanation: "'Accurate' has no operational definition. A precise categorical decision rule both cuts the false positives (TODOs, descriptions) and targets the real defect (contradiction with code).",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D4-13", domain: "prompt", level: "201",
    scenario: "An extraction returns null for methodology_section whenever the methodology is described inline without a dedicated header.",
    question: "Most effective fix? (Task 4.2)",
    options: [
      "Make the field required",
      "Add 2–4 few-shot examples showing extraction from inline descriptions as well as from dedicated headers",
      "Add max_tokens headroom",
      "Set tool_choice: \"any\""
    ],
    answer: 1,
    explanation: "The model needs to see structural variety. Few-shot examples covering both inline and headered forms teach it to recognize the inline case. Making it required would induce fabrication; max_tokens is irrelevant.",
    sources: ["https://platform.claude.com/docs"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D4-14", domain: "prompt", level: "201",
    scenario: "There are ~15 findings per PR with a 40% false-positive rate; the bottleneck is the time developers spend investigating each. CLAUDE.md already lists acceptable patterns, and stakeholders reject any pre-review filtering.",
    question: "Best change? (Task 4.1)",
    options: [
      "Add a 1–10 confidence score to each finding",
      "Require a brief inline rationale per finding (which rule it violates and why this instance isn't a known-acceptable pattern)",
      "Reduce scope to security only",
      "Require two-instance consensus before posting"
    ],
    answer: 1,
    explanation: "An inline rationale lets developers judge each finding at a glance, killing investigation time — without filtering anything out (which stakeholders rejected). Scope reduction and consensus are forms of pre-review filtering.",
    sources: ["https://platform.claude.com/docs"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D4-15", domain: "prompt", level: "201",
    scenario: "Test-case suggestions: 6 of 10 duplicate tests that already exist in the file.",
    question: "Most effective change? (Task 4.2 / context)",
    options: [
      "Reduce suggestions from 10 to 5",
      "Include the existing test file in context so the model knows what's already covered",
      "Focus only on edge cases",
      "Post-process to filter by test-name overlap"
    ],
    answer: 1,
    explanation: "The model can only avoid duplicates it can see. Providing the existing tests addresses the root cause; trimming counts or keyword-filtering treats symptoms.",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },

  /* ===================== DOMAIN 5 — CONTEXT MANAGEMENT & RELIABILITY (15%) ===================== */
  {
    id: "D5-01", domain: "context", level: "301",
    scenario: "After ~15 turns, a support agent refers to 'a recent refund' and 'prompt processing' instead of the customer's specific '$247.83 refund promised by Friday.'",
    question: "What failed, and the fix? (Task 5.1)",
    options: [
      "A tool result was silently dropped; add retries",
      "Progressive summarization compressed the specific facts into vague prose; inject a persistent verbatim 'case facts' block (amounts, dates, IDs) every turn, outside the summarized history",
      "Lost-in-the-middle; reorder the history",
      "The output was truncated; raise max_tokens"
    ],
    answer: 1,
    explanation: "Summarization destroys high-value specifics first. A structured case-facts block kept outside the summarized history (and re-injected each turn) preserves the exact amounts/dates/IDs reliably.",
    sources: ["https://code.claude.com/docs/en/costs"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D5-02", domain: "context", level: "301",
    scenario: "At ~75K tokens, a synthesis agent cites the first 15K and last 10K but omits the middle 50K of its aggregated input.",
    question: "Best way to restructure the input? (Task 5.4)",
    options: [
      "Summarize everything to under 20K before aggregation",
      "Put a key-findings summary at the start and organize the details under explicit section headings",
      "Stream results incrementally, web results first",
      "Rotate which subagent's results appear first each run"
    ],
    answer: 1,
    explanation: "This is 'lost in the middle.' Leading with a key-findings summary uses primacy, and explicit section headers give navigational anchors so mid-input content gets attention. Over-summarizing loses detail; rotation/streaming don't address position.",
    sources: ["https://code.claude.com/docs/en/costs"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D5-03", domain: "context", level: "301",
    scenario: "During a long exploration, context is ~82% full and the model starts drifting to generic patterns instead of the specific code structure it found 20 turns ago — but the existing context is still valid.",
    question: "Best immediate action? (Task 5.4)",
    options: [
      "Start a new session with an injected summary",
      "Use /compact to reduce usage while preserving key findings, then continue",
      "Switch to a larger-context model",
      "Re-read all the earlier files"
    ],
    answer: 1,
    explanation: "When context is full but still valid, /compact reclaims room while keeping the important findings. A fresh session is for stale context; re-reading files would burn the remaining headroom.",
    sources: ["https://code.claude.com/docs/en/costs"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D5-04", domain: "context", level: "301",
    scenario: "An exploration found key module boundaries and transformations; the work must continue across several future sessions without losing these findings.",
    question: "Most reliable approach? (Task 5.4)",
    options: [
      "/compact and keep going",
      "Have Claude write the key findings to a scratchpad file in the repo that future sessions read",
      "Ask Claude to summarize and manually paste it next time",
      "Start fresh and re-describe from memory"
    ],
    answer: 1,
    explanation: "A scratchpad file persists findings across context boundaries, restarts, and crashes — unlike /compact, which only helps within the current session. It's the durable option for multi-session work.",
    sources: ["https://code.claude.com/docs/en/memory"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D5-05", domain: "context", level: "201",
    scenario: "A customer says: 'Just connect me with a human — I'm done with bots.' The agent replies, 'Let me quickly check your account and resolve this first.'",
    question: "Is that correct? (Task 5.2)",
    options: [
      "Yes — it maximizes first-contact resolution",
      "No — an explicit human request must be honored immediately, without first attempting investigation",
      "Yes — try once before escalating",
      "No — escalate only after a tool call confirms it's beyond scope"
    ],
    answer: 1,
    explanation: "An explicit request for a human is an immediate escalation trigger, no exceptions. (Sentiment alone isn't a trigger, but an explicit request always is.)",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D5-06", domain: "context", level: "301",
    scenario: "Policy allows price-matching the company's own site within 14 days but is silent on competitor prices. A customer requests a competitor price-match.",
    question: "Best behavior? (Task 5.2)",
    options: [
      "Approve it — price matching is allowed",
      "Deny it outright",
      "Escalate for human policy interpretation — there's a genuine policy gap and the agent must not invent policy",
      "Average the two prices and offer that"
    ],
    answer: 2,
    explanation: "A true policy gap (no rule on competitor matching) requires human judgment; the agent should neither fabricate a policy nor guess. Approving/denying both assume a rule that doesn't exist.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D5-07", domain: "context", level: "201",
    scenario: "A customer says 'I need help with my account,' and get_customer returns three records matching that name.",
    question: "What should the agent do? (Task 5.2)",
    options: [
      "Pick the most recently active record",
      "Pick the highest-lifetime-value record",
      "Ask the customer for an additional identifier (email, account number, order ID) before taking any account-specific action",
      "Escalate to a human immediately"
    ],
    answer: 2,
    explanation: "Multiple matches means ambiguous identity; requesting one more identifier resolves it safely. Choosing by a heuristic risks exposing the wrong account's data; immediate escalation is unnecessarily disruptive.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D5-08", domain: "context", level: "301",
    scenario: "A subagent times out, then returns an empty result marked as success. The coordinator treats it as 'no data found' and proceeds, missing that the lookup never actually ran.",
    question: "What's the failure, and the fix? (Task 5.3)",
    options: [
      "Latency; raise the timeout",
      "Silent error suppression — returning empty-as-success removes the coordinator's ability to recover; the subagent must surface a structured error instead",
      "The coordinator needs more context",
      "Use a larger model for the subagent"
    ],
    answer: 1,
    explanation: "Disguising a timeout as an empty success destroys the coordinator's recovery signal. Subagents must propagate structured errors (failure type, what was attempted) so the coordinator can retry or escalate.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "OlivierAlter/hamzafarooq (rewritten)"
  },
  {
    id: "D5-09", domain: "context", level: "301",
    scenario: "A web-search subagent gets: academic = 15 papers; industry = '0 results'; patent = 'Connection timeout.'",
    question: "Best error propagation to the coordinator? (Task 5.3)",
    options: [
      "Combine all three into a single error status",
      "Return only the academic results and silently drop the rest",
      "Return all three distinctly: academic = success; industry = valid empty result (isError:false); patent = isError:true with structured error context",
      "Silently retry the patent timeout and return a unified result"
    ],
    answer: 2,
    explanation: "Each outcome needs a different coordinator response: success, a valid empty result, and an access failure to consider retrying. Distinguishing them preserves recovery; combining or silently retrying hides the context.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D5-10", domain: "context", level: "301",
    scenario: "An extraction pipeline reports 96% accuracy across 10,000 invoices, and the team wants to remove human review.",
    question: "Most critical validation step first? (Task 5.5)",
    options: [
      "Run 1,000 more invoices to confirm 96% holds",
      "Analyze accuracy by document type and field segment to check performance is consistent, not masking a catastrophic per-segment failure",
      "Lower the confidence threshold from 0.9 to 0.85",
      "Add a second extraction pass"
    ],
    answer: 1,
    explanation: "Aggregate accuracy can hide segment failures (e.g. 99.9% on digital, 40% on handwritten still averages ~96%). Stratifying by type/field reveals whether removing human review is actually safe.",
    sources: ["https://code.claude.com/docs/en/evals"], attribution: "hamzafarooq/OlivierAlter (rewritten)"
  },
  {
    id: "D5-11", domain: "context", level: "301",
    scenario: "A team plans to auto-route cases to humans whenever the model's self-reported confidence is below a threshold.",
    question: "What must be validated first? (Task 5.5)",
    options: [
      "That the threshold is exactly 0.8",
      "That the confidence scores are calibrated against a labeled set — raw model confidence is often miscalibrated and unreliable for routing",
      "That the model uses extended thinking",
      "Nothing — model confidence is reliable by default"
    ],
    answer: 1,
    explanation: "Raw model confidence rarely matches true correctness. Before routing on it, you must calibrate against labeled data; otherwise the routing decisions are built on an unreliable signal.",
    sources: ["https://code.claude.com/docs/en/evals"], attribution: "OlivierAlter/dnacenta (rewritten)"
  },
  {
    id: "D5-12", domain: "context", level: "301",
    scenario: "A document-analysis agent finds two credible sources that conflict (40% vs 12% growth).",
    question: "Best handling? (Task 5.6)",
    options: [
      "Pick the more authoritative source and note it briefly",
      "Average them to 26% with a footnote",
      "Include both figures with full source attribution and explicitly annotate the conflict, letting synthesis/downstream decide",
      "Pause the analysis and wait"
    ],
    answer: 2,
    explanation: "Surface conflicts transparently with both values and attribution; never average (that fabricates a number) or silently pick one. Pausing is unnecessary — the agent can finish and hand reconciliation upstream.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D5-13", domain: "context", level: "301",
    scenario: "A multi-agent research report makes a specific claim, but the source it came from has been lost through synthesis, so it can't be cited.",
    question: "Best design to prevent this? (Task 5.6)",
    options: [
      "Tell the synthesis agent to 'remember sources'",
      "Have subagents output structured claim→source mappings, and have synthesis preserve those mappings through to the final report",
      "Add citations only at the end from memory",
      "Increase the synthesis agent's context window"
    ],
    answer: 1,
    explanation: "Provenance must be carried as structured data (claim linked to source) from the subagents through synthesis, not reconstructed afterward. Exhortations and bigger context don't guarantee traceability.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "OlivierAlter (rewritten)"
  }
];
