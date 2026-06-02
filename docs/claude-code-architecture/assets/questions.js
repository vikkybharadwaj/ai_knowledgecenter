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
  },

  /* ===================== DOMAIN 1 — additions ===================== */
  {
    id: "D1-21", domain: "agent-arch", level: "301",
    scenario: "A support agent handles single-issue requests at 94% accuracy, but multi-issue requests ('refund order #1234 AND update shipping for #5678') drop to 58% — it often handles one and forgets the other.",
    question: "Most effective fix? (Task 1.6)",
    options: [
      "A preprocessing model call that decomposes the request first",
      "Combine the tools into fewer universal tools",
      "Add few-shot examples demonstrating decomposition and correct tool sequencing for multi-issue requests",
      "Add a validation step that re-prompts when an issue is missed"
    ],
    answer: 2,
    explanation: "The agent already handles single issues; it needs to learn the decomposition/sequencing pattern, which few-shot examples teach directly. A separate preprocessing call adds latency/complexity; merging tools loses specificity; re-prompting treats the symptom.",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D1-22", domain: "agent-arch", level: "301",
    scenario: "Complex requests ('I was billed twice, my discount didn't apply, and I want to cancel') average 12+ tool calls at 54% success, with repeated redundant get_customer calls.",
    question: "Best architecture? (Task 1.2)",
    options: [
      "Add verification checkpoints between every stage",
      "Combine get_customer/lookup_order/billing into one investigate_issue tool",
      "Decompose into separate issues, investigate them in parallel using shared customer context, then synthesize",
      "Add few-shot examples of ideal sequences"
    ],
    answer: 2,
    explanation: "Decomposition plus parallel investigation with shared customer context eliminates the redundant retrievals and the long sequential loop. A mega-tool hides complexity without structuring it; checkpoints and examples don't fix the redundant fetches.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D1-23", domain: "agent-arch", level: "201",
    scenario: "An agent averages 4+ API round-trips because it requests get_customer and then lookup_order on separate turns, even when it clearly needs both up front.",
    question: "How do you cut the loops? (Task 1.1)",
    options: [
      "Increase max_tokens",
      "Instruct the model to bundle the tool requests it needs into a single turn (parallel tool calls)",
      "Create a composite get_customer_with_orders tool",
      "Add speculative execution of every likely tool"
    ],
    answer: 1,
    explanation: "Claude can request multiple tools in one turn; instructing it to bundle obviously-needed calls collapses the sequential loop with minimal change. A composite tool is a heavier redesign; speculative execution wastes calls; max_tokens is irrelevant.",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D1-24", domain: "agent-arch", level: "301",
    scenario: "Complex cases are answered correctly, but CSAT is 15% lower: the explanations are inconsistent and the gaps differ case-to-case. No human oversight is wanted.",
    question: "Best improvement? (Task 1.4)",
    options: [
      "Add a self-critique (evaluator–optimizer) stage that checks the draft against concrete criteria before sending",
      "Add a confirmation question: 'Does this fully resolve your issue?'",
      "Upgrade the model for complex cases",
      "Add few-shot examples for the five most common complex types"
    ],
    answer: 0,
    explanation: "An evaluator–optimizer (self-critique) stage forces the agent to check its own draft against explicit completeness criteria, catching case-specific gaps that vary too much for fixed few-shot coverage. A confirmation prompt shifts work to the customer; a bigger model doesn't address consistency.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D1-25", domain: "agent-arch", level: "301",
    scenario: "Tools return data in inconsistent formats (Unix timestamps, ISO 8601, numeric status codes), and some are third-party MCP servers you cannot modify.",
    question: "Most maintainable normalization? (Task 1.5)",
    options: [
      "A PostToolUse hook that intercepts tool outputs and applies formatting transforms before the agent sees them",
      "Modify the tools you own and write wrappers for the rest",
      "A normalize_data tool the agent must call after every retrieval",
      "Detailed format documentation in the system prompt"
    ],
    answer: 0,
    explanation: "A PostToolUse hook is one deterministic interception point that normalizes all tool output in code — including data from unmodifiable third-party MCP servers — without relying on the model to interpret mixed formats or remembering to call a tool.",
    sources: ["https://code.claude.com/docs/en/hooks"], attribution: "paullarionov (rewritten)"
  },
  {
    id: "D1-26", domain: "agent-arch", level: "301",
    scenario: "A previous deep-exploration session mapped the auth flows, but the auth module has since been refactored. You need to continue the work reliably.",
    question: "Best approach? (Task 1.7)",
    options: [
      "--resume the prior session",
      "Start fresh and re-explore everything from scratch",
      "Start a new session, inject a structured summary of the still-valid findings, and explicitly note the auth module changed",
      "Resume and tell Claude to ignore its prior auth observations"
    ],
    answer: 2,
    explanation: "When prior tool results are now stale, resuming imports them as if current. A new session with a curated summary keeps the valid findings while flagging what changed — accurate and far cheaper than re-exploring everything.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-27", domain: "agent-arch", level: "301",
    scenario: "A spawned teammate keeps redoing analysis the lead already did and misses project-specific conventions, even though it loads CLAUDE.md.",
    question: "Most likely fix? (Task 1.3)",
    options: [
      "Give the teammate more tools",
      "Pass sufficient context in the spawn prompt — teammates load CLAUDE.md/MCP/skills but NOT the lead's conversation history",
      "Switch the teammate to a larger model",
      "Have the lead do all the work itself"
    ],
    answer: 1,
    explanation: "Teammates start with project memory and skills but not the lead's conversation. Anything learned in that conversation must be passed explicitly in the spawn prompt, or the teammate works blind to it.",
    sources: ["https://code.claude.com/docs/en/agent-teams"], attribution: "agent-teams docs"
  },
  {
    id: "D1-28", domain: "agent-arch", level: "201",
    scenario: "A latency-sensitive step just classifies an incoming message into one of three intents; a colleague proposes a multi-agent pipeline for it.",
    question: "Best design? (Task 1.2 / 1.6)",
    options: [
      "A multi-agent pipeline with a coordinator",
      "A single agent (or a single classification call) — multi-agent adds latency and coordination overhead with no benefit",
      "An agent team of three classifiers",
      "A dynamic workflow"
    ],
    answer: 1,
    explanation: "Match the topology to the work. A simple, single-step classification needs one agent; multi-agent orchestration adds latency and complexity for nothing. Over-provisioning is as wrong as under-provisioning.",
    sources: ["https://code.claude.com/docs/en/agents"]
  },
  {
    id: "D1-29", domain: "agent-arch", level: "201",
    scenario: "An agent gets stuck retrying a tool that is permanently failing, looping until it exhausts resources.",
    question: "Soundest design? (Task 1.1)",
    options: [
      "Remove all iteration limits and let it resolve naturally",
      "Use a max-iteration cap as a safety backstop AND add a stop condition / error classification so it stops retrying unrecoverable failures",
      "Just raise max_tokens",
      "Terminate on the first tool error"
    ],
    answer: 1,
    explanation: "Caps are a safety boundary, not the primary control; pair them with proper error handling (classify and stop on unrecoverable failures). Removing limits invites runaway loops; terminating on any error is too brittle.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D1-30", domain: "agent-arch", level: "301",
    scenario: "A draft must be iteratively improved against a rubric (e.g. a generated summary refined until it meets quality criteria).",
    question: "Which pattern fits? (Task 1.6)",
    options: [
      "A fixed sequential pipeline",
      "An evaluator–optimizer loop: one role produces, another scores against the rubric, repeat until it passes",
      "A single one-shot call",
      "A coordinator with parallel subagents"
    ],
    answer: 1,
    explanation: "Iterative refinement against explicit criteria is the evaluator–optimizer pattern. A fixed pipeline has no feedback loop; one-shot has no refinement; parallel subagents don't iterate on each other's quality.",
    sources: ["https://code.claude.com/docs/en/agents"]
  },
  {
    id: "D1-31", domain: "agent-arch", level: "301",
    scenario: "A research question requires gathering from many sources and cross-checking claims against each other for trustworthiness, at a scale beyond one conversation.",
    question: "Best tool? (orchestration choice)",
    options: [
      "A single long session",
      "A dynamic workflow (e.g. /deep-research) that fans out and adversarially cross-checks before reporting",
      "One subagent",
      "A 3-person agent team"
    ],
    answer: 1,
    explanation: "Cross-checked, large-scale research is exactly what dynamic workflows are built for — fan out, verify claims against each other, and return only the synthesis. One session/subagent can't scale it; a small team lacks the scripted cross-check pattern.",
    sources: ["https://code.claude.com/docs/en/workflows"]
  },
  {
    id: "D1-32", domain: "agent-arch", level: "301",
    scenario: "A subagent decides it needs to delegate part of its work to yet another subagent.",
    question: "What's true, and the right structure? (Task 1.2)",
    options: [
      "Subagents can nest freely; let it spawn another",
      "Subagents cannot spawn subagents — restructure so the main session (or a team/workflow) does the orchestration",
      "Switch the subagent to a larger model so it can nest",
      "Add 'Task' to the subagent's allowedTools to enable nesting"
    ],
    answer: 1,
    explanation: "Subagents can't spawn their own subagents (no nesting) — a deliberate constraint. If a workload needs hierarchical delegation, the top-level session orchestrates, or you move to an agent team / dynamic workflow.",
    sources: ["https://code.claude.com/docs/en/sub-agents"]
  },
  {
    id: "D1-33", domain: "agent-arch", level: "301",
    scenario: "You need to (a) pick up a single investigation tomorrow exactly where you left off, and separately (b) explore two divergent designs from today's shared analysis.",
    question: "Which mechanisms? (Task 1.7)",
    options: [
      "--resume for both",
      "fork_session for both",
      "--resume for the linear continuation (a); fork_session for the two divergent branches (b)",
      "Two terminal windows for both"
    ],
    answer: 2,
    explanation: "--resume continues one linear thread; fork_session branches independent explorations from a shared baseline. They solve different problems — use each for its case.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D1-34", domain: "agent-arch", level: "301",
    scenario: "A hard bug has three competing hypotheses; you want them pursued in parallel by workers who can challenge and build on each other's findings.",
    question: "Best surface? (orchestration choice)",
    options: [
      "Three subagents reporting up independently",
      "An agent team — peers that share a task list and message each other (adversarial debate)",
      "Agent view",
      "A single session"
    ],
    answer: 1,
    explanation: "When the workers need to discuss and react to each other, that's an agent team (peer communication). Subagents only report up and can't debate; agent view sessions don't coordinate; one session can't run them in parallel.",
    sources: ["https://code.claude.com/docs/en/agent-teams"]
  },
  {
    id: "D1-35", domain: "agent-arch", level: "301",
    scenario: "You have three unrelated tasks — fix a bug, review a PR, investigate a flaky test — that you'll start now and check back on later. They don't interact.",
    question: "Best surface? (orchestration choice)",
    options: [
      "An agent team with a lead",
      "Agent view — dispatch them as independent background sessions and supervise from one dashboard",
      "A dynamic workflow",
      "Three subagents in one session"
    ],
    answer: 1,
    explanation: "Independent, non-communicating tasks you supervise loosely are the agent-view case. A team adds unneeded coordination; a workflow is for scripted fan-out; subagents in one session tie them to that conversation's lifecycle.",
    sources: ["https://code.claude.com/docs/en/agent-view"]
  },
  {
    id: "D1-36", domain: "agent-arch", level: "301",
    scenario: "In an agent team, task B must not start until task A's output exists, and a third task depends on both.",
    question: "Best way to coordinate? (Task 1.4)",
    options: [
      "Tell each teammate to poll the others",
      "Model the dependencies in the shared task list so they auto-resolve and the lead sequences the handoffs",
      "Have the lead do A, B, and C itself",
      "Run all three immediately and hope ordering works out"
    ],
    answer: 1,
    explanation: "Agent teams use a shared task list with dependencies that auto-resolve, so blocked tasks wait and the lead orchestrates handoffs. Polling is wasteful; doing it all in the lead defeats the team; ignoring order causes races.",
    sources: ["https://code.claude.com/docs/en/agent-teams"]
  },

  /* ===================== DOMAIN 2 — additions ===================== */
  {
    id: "D2-15", domain: "mcp", level: "301",
    scenario: "A single agent is configured with 18 tools and frequently selects the wrong one; descriptions are already clear.",
    question: "Best structural fix? (Task 2.3)",
    options: [
      "Add few-shot examples for all 18 tools",
      "Distribute the tools across subagents (~4–5 each) grouped by domain, so each agent chooses from a small, coherent set",
      "Merge tools to reduce the count",
      "Add a keyword routing layer"
    ],
    answer: 1,
    explanation: "Too many tools on one agent degrades selection even with good descriptions. Splitting them across focused subagents (a handful each) is the documented remedy; merging loses capability and routing layers fight the model's own selection.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "dnacenta (rewritten)"
  },
  {
    id: "D2-16", domain: "mcp", level: "201",
    scenario: "On failure, an MCP tool returns a raw stack-trace string, and the coordinator can't decide whether to retry, fall back, or escalate.",
    question: "Better tool design? (Task 2.2)",
    options: [
      "Return the stack trace but make it longer",
      "Return a structured error (failure type, message, and retry/fallback guidance) so the caller can act programmatically",
      "Return an empty success so the agent moves on",
      "Log the error server-side and return nothing"
    ],
    answer: 1,
    explanation: "Callers need structured error context — type and recovery guidance — to choose retry vs fallback vs escalate. A raw trace isn't actionable; empty-success hides the failure; returning nothing strands the coordinator.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D2-17", domain: "mcp", level: "301",
    scenario: "After you rewrite two overlapping tool descriptions, ~30% of requests still misroute. The system prompt contains 'Always look up the customer first.'",
    question: "What to investigate next? (Task 2.1)",
    options: [
      "Add 10–15 more few-shot examples",
      "Audit the system prompt for keyword-sensitive instructions that create unintended tool associations overriding the descriptions",
      "Merge the two tools",
      "Deploy a routing classifier"
    ],
    answer: 1,
    explanation: "A system-prompt instruction keyed on words like 'customer' can create a keyword→tool association that competes with the descriptions. The systematic residual misrouting points there, not to more examples or a new classifier.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D2-18", domain: "mcp", level: "201",
    scenario: "You need an MCP server that pushes live events to the client (not request/response), and OAuth is not required.",
    question: "Which transport? (Task 2.4)",
    options: [
      "stdio",
      "WebSocket (ws) — for servers that push events; header-auth only",
      "HTTP",
      "SSE (the recommended default)"
    ],
    answer: 1,
    explanation: "WebSocket suits servers that push events, using header auth (no OAuth, no --transport flag). HTTP is the recommended remote default for request/response with OAuth; stdio is local; SSE is deprecated.",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },
  {
    id: "D2-19", domain: "mcp", level: "201",
    scenario: "A teammate adds a project-scoped MCP server in .mcp.json; on next launch it shows '⏸ Pending approval' for everyone.",
    question: "Why, and is that correct? (Task 2.4)",
    options: [
      "A bug — project servers should auto-start",
      "Correct — project-scoped servers require explicit approval before first use as a trust safeguard",
      "The transport is wrong; switch to stdio",
      "The token expired"
    ],
    answer: 1,
    explanation: "Project-scoped servers (committed in .mcp.json) require explicit per-user approval before they run — a deliberate trust boundary, since a committed server could otherwise execute on every clone. Reset choices with claude mcp reset-project-choices.",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },
  {
    id: "D2-20", domain: "mcp", level: "201",
    scenario: "An agent uses Bash 'sed' to make a targeted source edit instead of the Edit tool.",
    question: "Why prefer the built-in Edit tool? (Task 2.5)",
    options: [
      "sed is slower",
      "Edit makes a precise, reviewable, permission-governed change with a unique-match guard; ad-hoc Bash text manipulation bypasses that tooling and is riskier",
      "Bash can't modify files",
      "sed always corrupts files"
    ],
    answer: 1,
    explanation: "The Edit tool performs targeted, reviewable edits under the permission system and guards against ambiguous matches. Falling back to Bash text manipulation sidesteps those safeguards — reserve Bash for operations the file tools don't cover.",
    sources: ["https://code.claude.com/docs/en/settings"]
  },
  {
    id: "D2-21", domain: "mcp", level: "201",
    scenario: "In a dev-productivity agent, a fetch tool and a search tool have overlapping descriptions, so the agent often fetches when it should search.",
    question: "Most effective first step? (Task 2.1)",
    options: [
      "Add a routing classifier",
      "Rewrite the descriptions (and rename if needed) so each tool's purpose and boundaries are unambiguous",
      "Remove one of the tools",
      "Add 10 few-shot examples"
    ],
    answer: 1,
    explanation: "Overlapping descriptions are the root cause; clarifying purpose and boundaries (and renaming when names collide semantically) fixes selection at the interface. Classifiers and example padding are heavier and don't remove the ambiguity.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D2-22", domain: "mcp", level: "201",
    scenario: "For one pure-reasoning step you must ensure the model produces a text answer and does NOT call any tool.",
    question: "Best control? (Task 2.3)",
    options: [
      "tool_choice: \"any\"",
      "Don't expose tools for that call (or set tool_choice to 'none'), so no tool can be invoked",
      "tool_choice: {\"type\":\"tool\",\"name\":\"...\"}",
      "Lower the temperature"
    ],
    answer: 1,
    explanation: "To guarantee no tool use, either omit tools from that request or force 'none'. 'any' and a named tool both force a call — the opposite of the requirement; temperature doesn't control tool use.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D2-23", domain: "mcp", level: "201",
    scenario: "A remote HTTP MCP server starts returning 401 Unauthorized.",
    question: "Expected behavior / action? (Task 2.4)",
    options: [
      "Hardcode a token in .mcp.json",
      "The 401 triggers the OAuth flow; authenticate via /mcp, after which tokens are stored in the OS keychain and auto-refreshed",
      "Switch to stdio",
      "Disable the server permanently"
    ],
    answer: 1,
    explanation: "For remote servers, a 401/403 triggers OAuth; you authenticate through /mcp and tokens live in the keychain with auto-refresh. Hardcoding secrets or switching transport is wrong.",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },
  {
    id: "D2-24", domain: "mcp", level: "301",
    scenario: "Several MCP servers expose hundreds of tools combined, and you're worried about context cost every turn.",
    question: "Best approach? (Task 2.4)",
    options: [
      "Mark every server alwaysLoad: true",
      "Rely on Tool Search (default): only tool names + server instructions load, and Claude searches for tools on demand; reserve alwaysLoad for a few critical servers",
      "Disable all but one server",
      "Paste the tool list into CLAUDE.md"
    ],
    answer: 1,
    explanation: "Tool Search keeps only tool names/instructions in context and fetches tools on demand, bounding cost. alwaysLoad forces a server's tools into every turn — use it sparingly for critical servers, not everywhere.",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },
  {
    id: "D2-25", domain: "mcp", level: "201",
    scenario: "A coordinator keeps retrying a search that legitimately returned zero results, wasting calls.",
    question: "Root cause? (Task 2.2)",
    options: [
      "The model is non-deterministic",
      "The recovery logic treats a valid empty result (isError:false, results:[]) as a failure; it must distinguish 'looked, found nothing' from 'couldn't look'",
      "The search tool is broken",
      "max_tokens is too low"
    ],
    answer: 1,
    explanation: "A valid empty result is a successful answer, not an error. Retrying it forever means the recovery logic conflates empty-success with access failure — the same isError distinction, seen from the caller side.",
    sources: ["https://code.claude.com/docs/en/mcp"], attribution: "OlivierAlter (rewritten)"
  },
  {
    id: "D2-26", domain: "mcp", level: "201",
    scenario: "A document-analysis agent must locate files by name pattern, search their contents for a symbol, and then open one file fully.",
    question: "Correct built-in tools, in order? (Task 2.5)",
    options: [
      "Bash find, Bash grep, Bash cat",
      "Glob to match paths, Grep to search contents, Read to open the file",
      "Read everything, then filter",
      "Edit each candidate to inspect it"
    ],
    answer: 1,
    explanation: "Glob matches file paths, Grep searches contents, and Read opens a specific file — the purpose-built tools for locate→search→read. Shelling out to find/grep/cat bypasses the optimized tools; reading everything wastes context; Edit isn't for inspection.",
    sources: ["https://code.claude.com/docs/en/settings"]
  },

  /* ===================== DOMAIN 3 — additions ===================== */
  {
    id: "D3-16", domain: "claude-code", level: "201",
    scenario: "Your CLAUDE.md has grown unwieldy and mixes unrelated topics, but all of it is genuinely always-relevant.",
    question: "Best way to keep it modular? (Task 3.1)",
    options: [
      "Put everything in one long file and accept it",
      "Split it into focused files and pull them in with @path imports (up to depth 4)",
      "Move it all into skills",
      "Duplicate sections into per-directory CLAUDE.md files"
    ],
    answer: 1,
    explanation: "CLAUDE.md supports @path imports, so you can keep always-on content modular across focused files without bloating one document. Moving always-relevant facts to skills would make them load-on-demand (wrong for always-on); duplication invites drift.",
    sources: ["https://code.claude.com/docs/en/memory"]
  },
  {
    id: "D3-17", domain: "claude-code", level: "101",
    scenario: "A teammate has a legacy .claude/commands/deploy.md and asks whether to migrate it to a skill.",
    question: "What's the correct understanding? (Task 3.2)",
    options: [
      "Slash commands and skills are unrelated systems",
      "Custom commands were merged into skills; both .claude/commands/deploy.md and .claude/skills/deploy/SKILL.md create /deploy, with skills the current form",
      "Legacy commands no longer work at all",
      "Skills can't create slash commands"
    ],
    answer: 1,
    explanation: "Custom slash commands were merged into skills. The legacy commands path still works and produces the same /command, but skills (SKILL.md) are the current, more capable form (frontmatter, progressive disclosure, invocation control).",
    sources: ["https://code.claude.com/docs/en/skills"]
  },
  {
    id: "D3-18", domain: "claude-code", level: "201",
    scenario: "In a monorepo, the api package and the web package need different conventions, and you want each to apply automatically when working in that package.",
    question: "Best mechanism? (Task 3.1 / 3.3)",
    options: [
      "One root CLAUDE.md with both sets of rules",
      "Nested CLAUDE.md files per package (and/or .claude/rules with paths globs) so conventions load by location",
      "A single skill devs invoke per package",
      "Separate repos"
    ],
    answer: 1,
    explanation: "Memory loads by walking the directory tree, so per-package CLAUDE.md files (or path-scoped rules) apply the right conventions automatically based on where you're working. A combined root file applies everything everywhere.",
    sources: ["https://code.claude.com/docs/en/memory"]
  },
  {
    id: "D3-19", domain: "claude-code", level: "201",
    scenario: "You're integrating a third-party API whose data model and edge cases you don't fully understand yet, touching several files.",
    question: "Best mode? (Task 3.4)",
    options: [
      "Direct execution with detailed upfront specs",
      "Plan mode — explore the API and codebase and design the integration before editing",
      "Direct execution, switching to plan mode only if it gets complex",
      "Direct incremental edits"
    ],
    answer: 1,
    explanation: "Unknowns plus multi-file impact call for plan mode: explore and agree a design before making changes. The complexity is already known to exist, so don't wait for it to surface mid-edit.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-20", domain: "claude-code", level: "201",
    scenario: "After two rounds of describing the desired API-response transformation in prose, the output is still wrong on nesting and timestamp formatting.",
    question: "Best next iteration technique? (Task 3.5)",
    options: [
      "Rewrite the prose requirements yet again",
      "Provide 2–3 concrete input→output examples of the exact transformation",
      "Ask Claude to explain its current understanding",
      "Increase max_tokens"
    ],
    answer: 1,
    explanation: "Concrete input/output examples remove the ambiguity that prose keeps leaving — showing exactly how nesting and timestamps should look. It's the fastest way past repeated prose misunderstandings.",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-21", domain: "claude-code", level: "301",
    scenario: "An iterative review tool needs Claude to request related files mid-analysis (via tool calls). A manager suggests moving it to the Message Batches API for cost savings.",
    question: "Primary limitation? (Task 3.6)",
    options: [
      "Batch lacks correlation IDs",
      "The asynchronous batch model can't execute a tool mid-request and feed results back for Claude to continue — it's incompatible with iterative tool calling",
      "Batch doesn't support tool definitions at all",
      "The 24h latency would otherwise be fine"
    ],
    answer: 1,
    explanation: "Fire-and-forget batching can't intercept a tool call, run it, and return the result for the model to continue — fundamentally at odds with multi-round, tool-using review. (Latency is a separate issue.)",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-22", domain: "claude-code", level: "301",
    scenario: "Three CI jobs: (1) blocking pre-merge style checks devs wait on, (2) weekly security audits, (3) nightly test generation. The Batches API gives ~50% savings but up to 24h.",
    question: "Correct mapping? (Task 3.6)",
    options: [
      "Batch all three with polling",
      "Synchronous for the blocking style checks; Batch for the weekly audit and nightly test-gen",
      "Synchronous for all three",
      "Batch only the weekly audit"
    ],
    answer: 1,
    explanation: "Blocking, waited-on checks need synchronous calls; scheduled jobs (weekly audit, nightly test-gen) tolerate the 24h window and capture the savings. Match the API to each job's latency requirement.",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D3-23", domain: "claude-code", level: "201",
    scenario: "The same skill name exists at both project scope (.claude/skills/) and your personal scope (~/.claude/skills/).",
    question: "Which runs, and what's the overall precedence? (Task 3.2)",
    options: [
      "The project one always wins",
      "The personal one wins; overall precedence is Enterprise > Personal > Project (plugins namespaced separately)",
      "They merge",
      "It errors until you rename one"
    ],
    answer: 1,
    explanation: "Personal skills override same-named project skills; enterprise-managed skills override both. Knowing this precedence lets you safely customize a team skill for yourself.",
    sources: ["https://code.claude.com/docs/en/skills"]
  },
  {
    id: "D3-24", domain: "claude-code", level: "301",
    scenario: "Security wants a set of behavioral guidelines that every developer's Claude Code loads and that individuals cannot remove.",
    question: "Best mechanism? (Task 3.1 / governance)",
    options: [
      "A project CLAUDE.md",
      "A managed (enterprise) CLAUDE.md deployed via managed settings — it loads org-wide and cannot be excluded",
      "A README",
      "A personal CLAUDE.md template"
    ],
    answer: 1,
    explanation: "A managed CLAUDE.md (the claudeMd managed key) ships org-wide and can't be excluded by users — the right tool for non-removable guidance. (Note it's still soft behavioral guidance; for hard blocks use managed permission rules/hooks.)",
    sources: ["https://code.claude.com/docs/en/settings", "https://code.claude.com/docs/en/memory"]
  },
  {
    id: "D3-25", domain: "claude-code", level: "201",
    scenario: "You're implementing a well-understood function whose edge cases you can enumerate, and you want high correctness with tight iteration.",
    question: "Best iterative technique? (Task 3.5)",
    options: [
      "The interview pattern",
      "Test-driven iteration — write the edge-case tests first, then iterate code against them",
      "Plan mode",
      "Direct one-shot generation"
    ],
    answer: 1,
    explanation: "When the edge cases are known, TDD gives a tight correctness loop. The interview pattern is for when requirements are unknown; plan mode is for large/architectural work.",
    sources: ["https://code.claude.com/docs/en/sub-agents"]
  },
  {
    id: "D3-26", domain: "claude-code", level: "201",
    scenario: "You keep re-asking Claude, every turn, to explain its work in a teaching tone for a learning audience.",
    question: "Best mechanism? (Task 3.2)",
    options: [
      "Put 'always explain like a teacher' in CLAUDE.md",
      "Set an output style (e.g. Explanatory/Learning) — it modifies the system prompt to change response voice/format",
      "Add it to a skill",
      "Add a hook"
    ],
    answer: 1,
    explanation: "Output styles change Claude's role/voice/format at the system-prompt level — the right tool for a standing response style. CLAUDE.md is a later soft instruction; a skill is a procedure; a hook is deterministic enforcement, not tone.",
    sources: ["https://code.claude.com/docs/en/output-styles"]
  },
  {
    id: "D3-27", domain: "claude-code", level: "301",
    scenario: "A headless CI run keeps stalling because agents hit permission prompts for shell and MCP commands they need.",
    question: "Best fix? (Task 3.6)",
    options: [
      "Run interactively in CI",
      "Pre-configure the tool allowlist (permission rules / allowed tools) for the commands the run needs before starting; in claude -p there's no one to prompt",
      "Set a longer timeout",
      "Disable all permissions checks globally on every machine"
    ],
    answer: 1,
    explanation: "Non-interactive runs follow configured permission rules with no human to confirm, so pre-allow the exact commands the job needs. Running interactively defeats CI; globally disabling permissions is unsafe overkill.",
    sources: ["https://code.claude.com/docs/en/headless", "https://code.claude.com/docs/en/settings"]
  },
  {
    id: "D3-28", domain: "claude-code", level: "201",
    scenario: "You have three things to encode: (a) a fact needed in every session, (b) a multi-step procedure used occasionally, (c) guidance that should apply only when editing files under /payments.",
    question: "Correct homes? (Task 3.1 / 3.2 / 3.3)",
    options: [
      "All three in CLAUDE.md",
      "(a) CLAUDE.md, (b) a skill, (c) a .claude/rules file with a paths glob",
      "All three as skills",
      "(a) a hook, (b) CLAUDE.md, (c) a skill"
    ],
    answer: 1,
    explanation: "Always-needed fact → CLAUDE.md; occasional procedure → a skill (loads on demand); path-specific guidance → a .claude/rules file scoped with paths. Matching each need to the right mechanism is the core of Domain 3.",
    sources: ["https://code.claude.com/docs/en/memory", "https://code.claude.com/docs/en/skills"]
  },
  {
    id: "D3-29", domain: "claude-code", level: "201",
    scenario: "A teammate worries that entering plan mode for a risky change might let Claude start editing before they approve.",
    question: "What does plan mode guarantee? (Task 3.4)",
    options: [
      "Nothing — it edits as it plans",
      "Plan mode is read-only: Claude explores and proposes a plan, and you approve before any edits are made",
      "It auto-applies the plan after 30 seconds",
      "It only works in CI"
    ],
    answer: 1,
    explanation: "Plan mode keeps Claude in a read-only, propose-then-approve posture so you sign off before changes happen — ideal for risky or large work. That approval gate is exactly its value.",
    sources: ["https://code.claude.com/docs/en/sub-agents"]
  },

  /* ===================== DOMAIN 4 — additions ===================== */
  {
    id: "D4-16", domain: "prompt", level: "201",
    scenario: "A review prompt says 'flag important issues.' Output is inconsistent — sometimes trivial nits, sometimes only crashes.",
    question: "Root-cause fix? (Task 4.1)",
    options: [
      "Add 'be consistent' to the prompt",
      "Replace 'important' with an explicit categorical definition (which issue types count as important, which to skip)",
      "Lower the temperature to 0",
      "Run two passes and intersect"
    ],
    answer: 1,
    explanation: "'Important' has no operational meaning, so the model guesses differently each time. Defining the categories explicitly makes the decision rule precise and consistent. Temperature and pass-intersection don't supply the missing definition.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D4-17", domain: "prompt", level: "201",
    scenario: "An agent sometimes picks the wrong tool on ambiguous requests ('help with my recent purchase'). You decide to add few-shot examples.",
    question: "Most effective example design? (Task 4.2)",
    options: [
      "10–15 examples of clear, unambiguous requests",
      "4–6 examples targeted at the ambiguous cases, each with a rationale for why one tool was chosen over plausible alternatives",
      "Group all examples by tool",
      "One example per tool"
    ],
    answer: 1,
    explanation: "Targeting the actual failure mode — ambiguous requests — with rationale teaches the comparative decision the model is getting wrong. Generic, unambiguous examples don't address the hard cases.",
    sources: ["https://platform.claude.com/docs"], attribution: "paullarionov (rewritten)"
  },
  {
    id: "D4-18", domain: "prompt", level: "301",
    scenario: "Outputs use a strict JSON schema via tool use, yet a nested line-items array sometimes contains entries that violate a business rule (negative quantities).",
    question: "Why, and the fix? (Task 4.3 / 4.4)",
    options: [
      "The schema isn't strict enough; set strict: true",
      "Schemas enforce structure/types, not business rules — add application-layer validation (and retry) for semantic constraints like non-negative quantities",
      "Switch to prompt-only JSON",
      "Use tool_choice: \"any\""
    ],
    answer: 1,
    explanation: "A schema can require an array of numbers but not that each is non-negative or internally consistent. Business rules are semantic and belong in a validation layer with a retry loop on failure.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D4-19", domain: "prompt", level: "201",
    scenario: "An extraction sometimes returns a category value outside the allowed enum.",
    question: "Most effective feedback-loop fix? (Task 4.4)",
    options: [
      "Re-run the whole extraction at temperature 0",
      "Validate against the enum and, on failure, send a targeted retry that includes the invalid value and the list of allowed values",
      "Remove the enum constraint",
      "Add max_tokens"
    ],
    answer: 1,
    explanation: "A precise validate-and-retry — echoing the invalid value and the allowed set — corrects the specific error cheaply and reliably, far better than a blind full re-run or dropping the constraint.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D4-20", domain: "prompt", level: "301",
    scenario: "A workload has a strict real-time SLA (sub-second user-facing responses). A manager suggests the Batches API for its 50% cost savings.",
    question: "Best evaluation? (Task 4.5)",
    options: [
      "Use Batches; the savings are worth it",
      "Don't batch it — the Batches API can take up to 24h and has no latency SLA; keep it synchronous",
      "Batch it with aggressive polling",
      "Batch half the requests"
    ],
    answer: 1,
    explanation: "Batch processing trades latency for cost (up to 24h, no SLA), so it's unusable for real-time, user-facing work. Reserve batching for latency-tolerant jobs.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D4-21", domain: "prompt", level: "301",
    scenario: "A generator dismisses real bugs during generation (its reasoning shows it). A teammate proposes adding extended thinking to the generation step to catch them.",
    question: "Why won't that reliably work, and what does? (Task 4.6)",
    options: [
      "Extended thinking always fixes it",
      "The bias is intrinsic to reviewing one's own work; use an independent second instance that reviews without the generator's reasoning",
      "Add self-review instructions to the same prompt",
      "Increase the context window"
    ],
    answer: 1,
    explanation: "More thinking in the same context still rationalizes the same way (confirmation bias). A separate, independent reviewer without the generation reasoning is the structural fix — the model analog of peer review.",
    sources: ["https://platform.claude.com/docs"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D4-22", domain: "prompt", level: "201",
    scenario: "A vague-criteria prompt under-performs; a teammate insists the fix is to move the instruction to the very top of the prompt.",
    question: "Best response? (Task 4.1)",
    options: [
      "Agree — position is the main lever here",
      "Position isn't the root cause; the criteria are vague — define explicit categorical criteria regardless of position",
      "Move it to the end instead",
      "Duplicate it at top and bottom"
    ],
    answer: 1,
    explanation: "Reordering a vague instruction doesn't make it precise. The fix is explicit, categorical criteria; position is a minor factor next to a missing definition.",
    sources: ["https://platform.claude.com/docs"]
  },
  {
    id: "D4-23", domain: "prompt", level: "201",
    scenario: "A downstream system needs to parse Claude's output programmatically, and prompt-only 'return JSON' occasionally yields prose or malformed JSON.",
    question: "Most reliable design? (Task 4.3)",
    options: [
      "Stronger prompt wording",
      "Tool use with a JSON schema (in the CLI, --output-format json with --json-schema) to enforce well-formed, parseable output",
      "Post-process prose with regex",
      "Raise temperature"
    ],
    answer: 1,
    explanation: "Enforce structure at the API/CLI level with tool use + schema (or --output-format json/--json-schema) so downstream parsing is reliable. Prompt wording and regex on prose stay fragile.",
    sources: ["https://platform.claude.com/docs", "https://code.claude.com/docs/en/headless"]
  },

  /* ===================== DOMAIN 5 — additions ===================== */
  {
    id: "D5-14", domain: "context", level: "301",
    scenario: "A teammate proposes fixing lost-detail problems by editing the summarization prompt to 'always preserve numbers and dates verbatim.'",
    question: "Why is a structured facts block better? (Task 5.1)",
    options: [
      "It isn't; the prompt tweak is equivalent",
      "Summarization is inherently lossy and the instruction will eventually be ignored; a structured 'case facts' block kept outside the summarized history guarantees the specifics persist",
      "Because it uses fewer tokens",
      "Because it disables summarization entirely"
    ],
    answer: 1,
    explanation: "Telling a lossy process to be lossless is unreliable. Holding critical facts in a structured block outside the summarized history keeps them present every turn regardless of how history is compressed.",
    sources: ["https://code.claude.com/docs/en/costs"], attribution: "hamzafarooq (rewritten)"
  },
  {
    id: "D5-15", domain: "context", level: "301",
    scenario: "Research subagents return verbose reasoning and full source text; the coordinator hits context limits and synthesis degrades.",
    question: "Most effective fix? (Task 5.3 / 5.4)",
    options: [
      "Increase the coordinator's max_tokens",
      "Have subagents return structured data (key facts, citations, relevance scores) instead of verbose prose, so only distilled conclusions cross the boundary",
      "Add an intermediate summarization agent",
      "Reduce the number of subagents"
    ],
    answer: 1,
    explanation: "Fix the bloat at the source: each subagent's reasoning should stay in its own context, and only structured conclusions should reach the coordinator. A summarizer adds a hop; fewer subagents loses coverage; max_tokens just delays the wall.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "hamzafarooq/timothywarner (rewritten)"
  },
  {
    id: "D5-16", domain: "context", level: "301",
    scenario: "A web-search subagent returns 3 of 5 requested categories (two timed out); synthesis must still produce a report.",
    question: "Best error-propagation strategy? (Task 5.3)",
    options: [
      "Synthesize on the successes and don't mention the gaps",
      "Structure the output with coverage annotations marking well-supported conclusions vs areas with missing data",
      "Fail the whole synthesis and retry everything",
      "Silently retry the timeouts inside synthesis"
    ],
    answer: 1,
    explanation: "Graceful degradation with coverage annotations preserves completed work while transparently flagging gaps, so downstream confidence is informed. Hiding gaps misleads; failing everything discards good results.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D5-17", domain: "context", level: "301",
    scenario: "A support agent resolves only 55% first-contact: it escalates simple cases and tries complex policy-exception cases on its own.",
    question: "Best way to improve escalation calibration? (Task 5.5)",
    options: [
      "Have it self-rate confidence 1–10 and route below a threshold",
      "Add explicit escalation criteria to the prompt with few-shot examples of escalate-vs-resolve",
      "Add sentiment analysis to trigger escalation",
      "Train a separate classifier"
    ],
    answer: 1,
    explanation: "The root cause is unclear decision boundaries; explicit criteria plus few-shot examples fix that directly with no new infrastructure. Self-reported confidence and sentiment are unreliable triggers; a classifier is heavier than needed as a first step.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner (rewritten)"
  },
  {
    id: "D5-18", domain: "context", level: "301",
    scenario: "A synthesis must report on a topic where the available sources are thin and partly uncertain.",
    question: "Best handling? (Task 5.6)",
    options: [
      "State conclusions confidently to be useful",
      "Annotate uncertainty and coverage — distinguish well-supported claims from weakly-supported ones, with sources",
      "Omit the uncertain parts silently",
      "Average conflicting figures into one number"
    ],
    answer: 1,
    explanation: "Faithful synthesis surfaces confidence and coverage so the reader can calibrate trust. Overstating, omitting, or averaging all destroy information the downstream decision needs.",
    sources: ["https://code.claude.com/docs/en/sub-agents"]
  },
  {
    id: "D5-19", domain: "context", level: "201",
    scenario: "A user request has two reasonable interpretations that would lead to very different (and partly irreversible) actions.",
    question: "Best behavior? (Task 5.2)",
    options: [
      "Pick the more likely interpretation and proceed",
      "Ask one clarifying question to resolve the ambiguity before acting",
      "Do both interpretations",
      "Escalate to a human immediately"
    ],
    answer: 1,
    explanation: "When interpretations diverge and actions are consequential, a single clarifying question is the cheap, safe move. Guessing risks the wrong irreversible action; doing both is wasteful/dangerous; immediate escalation is premature.",
    sources: ["https://code.claude.com/docs/en/sub-agents"]
  },
  {
    id: "D5-20", domain: "context", level: "301",
    scenario: "Three situations: (a) context is 80% full but all still valid; (b) context is full and partly stale; (c) findings must survive across several future sessions and possible crashes.",
    question: "Correct tools? (Task 5.4)",
    options: [
      "/compact for all three",
      "(a) /compact, (b) new session with an injected summary, (c) a scratchpad file in the repo",
      "A scratchpad file for all three",
      "A bigger-context model for all three"
    ],
    answer: 1,
    explanation: "/compact reclaims room when context is full-but-valid; a fresh session with a curated summary is right when context is stale; a scratchpad file persists findings across sessions and crashes. Each situation needs its own tool.",
    sources: ["https://code.claude.com/docs/en/costs", "https://code.claude.com/docs/en/memory"]
  },
  {
    id: "D5-21", domain: "context", level: "301",
    scenario: "A high-stakes extraction pipeline is mostly accurate but has a few document segments with much higher error rates; fully removing human review is risky.",
    question: "Best human-review design? (Task 5.5)",
    options: [
      "Remove human review everywhere to cut cost",
      "Route only the low-confidence / high-error segments to human review (human-in-the-loop on the risky slice), automate the rest",
      "Keep 100% human review forever",
      "Review a random 1% sample"
    ],
    answer: 1,
    explanation: "Target human attention where the risk is — the segments with high error rates — using calibrated confidence to gate. That captures most of the automation savings while protecting against the catastrophic slice. A random sample misses the concentrated risk.",
    sources: ["https://code.claude.com/docs/en/evals"]
  },
  {
    id: "D5-22", domain: "context", level: "301",
    scenario: "In a multi-agent run, one subagent throws an unhandled exception, which terminates it and dumps a raw failure to the coordinator, derailing the whole run.",
    question: "Best reliability design? (Task 5.3)",
    options: [
      "Let any exception crash the run so failures are visible",
      "Recover locally where possible and otherwise propagate a structured error (type, what was attempted, partial results) so the coordinator can retry, route around it, or annotate coverage",
      "Suppress the error and return empty success",
      "Retry the entire subagent from scratch on any error"
    ],
    answer: 1,
    explanation: "Resilient systems recover at the lowest level able to, and otherwise propagate structured error context so the coordinator can make a recovery decision. Crashing the run is brittle; empty-success hides failures; whole-subagent retries are expensive and discard good partial work.",
    sources: ["https://code.claude.com/docs/en/sub-agents"], attribution: "timothywarner/hamzafarooq (rewritten)"
  }
];
