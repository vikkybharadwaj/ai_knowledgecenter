/* CCA-F practice question bank (seed — expanded after research harvest).
   Original / adapted questions grounded in code.claude.com/docs. No real exam content.
   Schema: { id, domain, level, scenario?, question, options:[str], answer:int, explanation, sources:[url], attribution? }
   Domains keyed to the official 5-domain blueprint. */

window.CCA_DOMAINS = {
  "agent-arch":  "Agentic architecture & orchestration",
  "claude-code": "Claude Code config & workflows",
  "prompt":      "Prompt engineering & structured output",
  "mcp":         "Tool design & MCP integration",
  "context":     "Context management & reliability"
};

window.CCA_QUESTIONS = [
  {
    id: "AA-001", domain: "agent-arch", level: "201",
    scenario: "A team runs three independent investigations on a failing service — log triage, a flaky-test hunt, and a dependency audit. Each produces large volumes of output the engineer won't reread, and none of the three needs results from the others.",
    question: "What is the most architecturally sound way to run these in Claude Code?",
    options: [
      "Spawn three parallel subagents, each returning only a summary",
      "Create an agent team with a lead so the three can coordinate",
      "Run one session and paste all three problem statements at once",
      "Write a dynamic workflow that fans out hundreds of agents"
    ],
    answer: 0,
    explanation: "The tasks are independent and produce high-volume output the main thread won't reference again — the textbook case for subagents, which work in isolated context and return just a summary. An agent team adds coordination overhead the tasks don't need (they don't talk to each other). One session would flood the context window. A dynamic workflow is for dozens-to-hundreds of agents, far more than three.",
    sources: ["https://code.claude.com/docs/en/sub-agents", "https://code.claude.com/docs/en/agents"]
  },
  {
    id: "AA-002", domain: "agent-arch", level: "301",
    scenario: "You're already running parallel subagents on a migration, but they keep hitting context limits and several need to hand intermediate findings to each other to avoid duplicate work.",
    question: "What is the documented next step?",
    options: [
      "Increase the autocompact threshold and keep using subagents",
      "Move to an agent team, where peers share a task list and message each other",
      "Switch every subagent to the Haiku model to save context",
      "Disable worktree isolation so they share one working directory"
    ],
    answer: 1,
    explanation: "The docs name this exact transition: when parallel subagents hit context limits or need to communicate, agent teams are the natural next step — teammates have their own context windows and coordinate via a shared task list and mailbox. Raising autocompact or switching models doesn't address the need to communicate; sharing a working directory causes file collisions.",
    sources: ["https://code.claude.com/docs/en/agent-teams", "https://code.claude.com/docs/en/features-overview"]
  },
  {
    id: "AA-003", domain: "agent-arch", level: "301",
    scenario: "A codebase-wide audit must touch ~500 files, run many checks in parallel, cross-check findings against each other, and you want the orchestration captured as something you can read and rerun next quarter.",
    question: "Which approach fits best?",
    options: [
      "An agent team of 4–5 peers",
      "A dynamic workflow — the plan lives in a script that orchestrates many subagents and cross-checks results",
      "Agent view, dispatching 500 background sessions",
      "A single session with a very large context window"
    ],
    answer: 1,
    explanation: "Dynamic workflows move the plan into code: a script orchestrates dozens-to-hundreds of subagents, holds intermediate results in variables (so the context window isn't flooded), applies a repeatable cross-check/adversarial-review pattern, and is itself rerunnable. Agent teams top out around a handful of peers. Agent view is for a modest number of sessions you supervise manually. One session can't hold 500 files of work.",
    sources: ["https://code.claude.com/docs/en/workflows"]
  },
  {
    id: "CC-001", domain: "claude-code", level: "201",
    scenario: "Your team keeps telling Claude the same multi-step release checklist, and it sometimes skips a step. You want it reusable, shareable via the repo, and loaded only when needed.",
    question: "What should you create?",
    options: [
      "Add the full checklist to CLAUDE.md so it's always in context",
      "A project skill (SKILL.md) committed under .claude/skills/",
      "A PreToolUse hook that runs the checklist",
      "An MCP server exposing the checklist as a tool"
    ],
    answer: 1,
    explanation: "A repeated multi-step procedure is exactly what skills are for — committed under .claude/skills/, shared with the team, and loaded on demand (progressive disclosure) so it costs nothing until invoked. Putting it all in CLAUDE.md bloats every turn. A hook is for deterministic enforcement on an event, not a human-followed checklist. MCP is for reaching external systems, not encoding a procedure.",
    sources: ["https://code.claude.com/docs/en/skills", "https://code.claude.com/docs/en/features-overview"]
  },
  {
    id: "CC-002", domain: "claude-code", level: "201",
    scenario: "A security lead writes \"never run curl\" in CLAUDE.md, but an agent still occasionally issues a curl command during a task.",
    question: "Why does this happen, and what is the correct fix?",
    options: [
      "CLAUDE.md wasn't loaded; re-run /init",
      "CLAUDE.md is soft guidance the model may not follow — enforce it with a permissions.deny rule or a PreToolUse hook",
      "Move the instruction to an output style so it's in the system prompt",
      "Add the instruction to a skill and mark it user-invocable"
    ],
    answer: 1,
    explanation: "CLAUDE.md shapes behavior but is not an enforcement layer — the model can ignore it. To actually block an action regardless of what the model decides, use a deterministic control: a permissions.deny rule (config) or a PreToolUse hook (code). This soft-vs-hard distinction is one of the most testable ideas in the cert.",
    sources: ["https://code.claude.com/docs/en/memory", "https://code.claude.com/docs/en/hooks", "https://code.claude.com/docs/en/settings"]
  },
  {
    id: "CC-003", domain: "claude-code", level: "201",
    scenario: "You want every file Claude edits to be auto-formatted immediately after the write, with no reliance on the model remembering to do it.",
    question: "Which mechanism guarantees this?",
    options: [
      "A note in CLAUDE.md asking Claude to format after editing",
      "A PostToolUse hook matching Edit|Write that runs the formatter",
      "A skill that formats files",
      "A permission rule allowing the formatter command"
    ],
    answer: 1,
    explanation: "A PostToolUse hook fires deterministically after the matched tool runs, so formatting happens every time regardless of the model's choices. CLAUDE.md and skills are model-mediated (may be skipped). A permission rule only allows/denies a call; it doesn't trigger an action.",
    sources: ["https://code.claude.com/docs/en/hooks"]
  },
  {
    id: "MC-001", domain: "mcp", level: "201",
    scenario: "You're connecting Claude Code to a remote, cloud-hosted internal service that requires OAuth, and the connection must work for teammates who clone the repo.",
    question: "Which transport and scope are appropriate?",
    options: [
      "stdio transport, user scope",
      "HTTP transport, project scope (committed .mcp.json)",
      "SSE transport, local scope",
      "WebSocket transport, project scope"
    ],
    answer: 1,
    explanation: "HTTP is the recommended remote transport and the one that supports OAuth. Project scope (.mcp.json committed at the repo root) shares the server with everyone who clones the repo. stdio is for local processes; SSE is deprecated; WebSocket supports only header auth (no OAuth).",
    sources: ["https://code.claude.com/docs/en/mcp"]
  },
  {
    id: "MC-002", domain: "mcp", level: "201",
    scenario: "An MCP server you're evaluating fetches and summarizes third-party web pages, then its tool output is fed back to the agent which then takes actions.",
    question: "What is the primary risk to design around?",
    options: [
      "Token cost from large tool outputs",
      "Prompt injection — externally-fetched content can carry instructions the agent may follow",
      "The server using SSE instead of HTTP",
      "Slow cold-start of the stdio process"
    ],
    answer: 1,
    explanation: "Any server that ingests external content can smuggle instructions into the model's context (prompt injection) — the headline MCP security risk. The docs say to verify you trust each server before connecting it, and project-scoped servers require explicit approval. Token cost and transport choice are real but secondary; cold-start is an stdio concern, not the core trust risk here.",
    sources: ["https://code.claude.com/docs/en/mcp", "https://code.claude.com/docs/en/security"]
  },
  {
    id: "PR-001", domain: "prompt", level: "201",
    scenario: "A pipeline needs Claude to return data that always conforms to a strict JSON schema; a prompt-only \"please respond in JSON\" approach occasionally returns prose or invalid JSON under load.",
    question: "What is the most reliable design?",
    options: [
      "Add more emphatic wording to the prompt (\"ONLY valid JSON, no prose\")",
      "Use tool/function calling with the schema, plus a validate-and-retry loop on failures",
      "Raise the temperature so the model is more creative about formatting",
      "Move the schema into CLAUDE.md"
    ],
    answer: 1,
    explanation: "Structured reliability comes from forcing the shape (tool/function calling with the schema) and adding a validation + retry loop, not from stronger prose instructions, which still fail under load. Higher temperature makes formatting less reliable; CLAUDE.md is soft guidance and doesn't enforce schema validity.",
    sources: ["https://code.claude.com/docs/en/mcp", "https://platform.claude.com/docs"]
  },
  {
    id: "CX-001", domain: "context", level: "301",
    scenario: "A long-running research agent steadily degrades over a session: it forgets earlier decisions and starts repeating work as the conversation grows huge.",
    question: "Which remediation addresses the root cause?",
    options: [
      "Restructure context flow: summarize/compact prior turns, retrieve relevant material on demand, and offload high-volume side tasks to subagents",
      "Ask the model to 'remember everything' more carefully",
      "Switch to a smaller, faster model",
      "Increase the response max-tokens limit"
    ],
    answer: 0,
    explanation: "This is a context-management problem: the window is overflowing with low-value tokens. The fix is to curate context — compact/summarize, retrieve rather than stuff, and push noisy side work to subagents whose summaries return — not to exhort the model, shrink the model, or change the output length. This 'curator' framing is core to context engineering.",
    sources: ["https://code.claude.com/docs/en/sub-agents", "https://code.claude.com/docs/en/costs"]
  }
];
