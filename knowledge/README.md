# Knowledge 🧠 — the Home Note

This is the entry point to the self-organizing half of the AI Knowledge Center. It's **one
connected brain**, not a filing cabinet: atomic notes, wired together with typed links, all
hanging off a single [**Big Picture spine**](maps/big-picture.md).

> **Go broad** → read the [Big Picture](maps/big-picture.md) or open the
> [concept dependency graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/concepts/graph.html) —
> the **tech-stack concepts** (primitives, systems, patterns) wired by *what depends on what*, so you learn
> the Claude stack visually, bottom-up. **Go deep** → click any concept for a short explainer plus the
> **source notes** behind it, and follow their connections wherever they lead.

## Start here
- 🗺️ **[The Big Picture](maps/big-picture.md)** — the spine: how the whole Claude stack fits together (the dot-connecting map).
- 🧪 **[Evals](maps/evals.md)**: how to know an AI product actually works. Ten mental models for evals (distilled from Hamel Husain, Shreya Shankar and others) plus twelve plain-language lessons learned rebuilding a real eval system (hub: `docs/concepts/evals.html`).
- 🏗️ **[Building & advising on AI stacks](maps/building-ai-stacks.md)** — the consulting cluster: *when to use Claude Code vs build your own harness*, and how to bootstrap a company's AI stack.
- 🕸️ **[Concept dependency graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/concepts/graph.html)** — the tech-stack concepts and what each one depends on, laid out by spine layer (the notes below are its sources).
- 📒 **[Git glossary](git-glossary.md)** — plain-English definitions of the git/GitHub terms (commit, branch, push, PR, worktree…) used to maintain this base.

## How this works (the model in 5 lines)
1. **Flat pool.** Every note is one atomic idea in [`notes/`](notes/) — no topic folders, no 101/201/301 levels.
2. **Typed connections.** Notes link with *labeled* relationships (`builds-on`, `enables`, `part-of`, `used-with`, `alternative-to`, `contrasts-with`, `used-in`) — the wiring of the brain.
3. **The spine.** Each note declares a `spine_layer` so it slots into the [Big Picture](maps/big-picture.md) — nothing floats free.
4. **Emergent maps.** [`maps/`](maps/) holds indexes that appear *only when a cluster earns one* — never pre-built.
5. **Land & connect.** Run `/land <url | file | pasted text>`; it distills, files, **connects the dots**, updates this map, and teaches you where the idea fits.

## All notes
*(This list is the human index; the [graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/concepts/graph.html) is the visual one. Both are derived from the notes.)*

| Note | Layer | Depth |
|------|-------|-------|
| [Prompt vs Context vs Harness Engineering](notes/prompt-context-harness-engineering.md) | foundations | evergreen |
| [Harness vs Context vs Prompt Engineering](notes/harness-vs-context-engineering.md) | foundations | evergreen |
| [The Anatomy of an Agent Harness](notes/anatomy-of-an-agent-harness.md) | foundations | evergreen |
| [Harness engineering — reliability lives outside the model weights](notes/harness-engineering-discipline.md) | foundations | budding |
| [An offline eval is a controlled experiment — the agent is real, the world is frozen](notes/offline-vs-online-evals.md) | foundations | seedling |
| [A test that crashed is not a test that failed](notes/crashed-is-not-failed.md) | foundations | seedling |
| [Freeze everything the model can see — including the date and the conversation](notes/freeze-everything-the-model-sees.md) | foundations | seedling |
| [One run is a sample, not a measurement](notes/one-run-is-a-sample.md) | foundations | seedling |
| [Word checks can't read meaning (the spam-filter problem)](notes/word-checks-cant-read-meaning.md) | foundations | seedling |
| [Don't copy, derive — two copies of one fact will drift apart](notes/dont-copy-derive.md) | foundations | seedling |
| [Evals test judgment; unit tests test math](notes/evals-test-judgment.md) | foundations | seedling |
| [A safety alarm is only as good as its checks](notes/safety-alarm-false-alarms.md) | foundations | seedling |
| [Dimensions vs slices — how to build a failure map](notes/dimensions-vs-slices.md) | foundations | seedling |
| [Sort your tests onto the map before trusting the count](notes/sort-before-you-count.md) | foundations | seedling |
| [When a test fails, find out whose fault it is first](notes/whose-fault-is-the-failure.md) | foundations | seedling |
| [An eval is a repeatable check of one behaviour](notes/what-is-an-eval.md) | foundations | seedling |
| [Two kinds of eval check — code vs LLM judge](notes/two-kinds-of-eval-check.md) | foundations | seedling |
| [Evaluate by system shape — one call, RAG, or agent](notes/evals-by-system-type.md) | patterns | seedling |
| [The metrics that matter for each system shape](notes/eval-metrics-by-system-type.md) | patterns | seedling |
| [Align an LLM judge like a classifier](notes/aligning-an-llm-judge.md) | patterns | seedling |
| [Before you have users, generate scenarios from dimensions and tuples](notes/synthetic-scenarios-before-launch.md) | foundations | seedling |
| [Error analysis on real traces — read, note, group, count](notes/error-analysis-on-traces.md) | foundations | seedling |
| [Keep the eval suite current — the production-to-eval flywheel](notes/production-to-eval-flywheel.md) | foundations | seedling |
| [Humans discover and decide; automation scales and watches](notes/humans-and-automation-in-evals.md) | foundations | seedling |
| [Code checks — test structure, state and behaviour](notes/code-check-best-practices.md) | foundations | seedling |
| [Three kinds of grader, and what each one can't see](notes/three-kinds-of-grader.md) | patterns | seedling |
| [The Claude API agent primitives](notes/claude-api-agent-primitives.md) | api | budding |
| [The Claude Agent SDK](notes/claude-agent-sdk.md) | agent-sdk | budding |
| [Claude Code Architecture — field guide](notes/claude-code-architecture.md) | claude-code | evergreen |
| [Model Context Protocol (MCP)](notes/model-context-protocol.md) | claude-code | budding |
| [Claude Code — Multi-Agent Development](notes/claude-code-multi-agent-development.md) | claude-code | budding |
| [Dynamic Workflows & the Ultraplan loop](notes/dynamic-workflows-and-ultraplan.md) | claude-code | evergreen |
| [One shared context vs. many isolated contexts](notes/execution-context-isolation.md) | claude-code | budding |
| [worktree.baseRef — fresh vs head](notes/worktree-base-ref-fresh-vs-head.md) | claude-code | seedling |
| [Claude Code Routines — unattended cloud automation](notes/claude-code-routines.md) | claude-code | budding |
| [One giant instruction file fails — progressive disclosure](notes/progressive-disclosure-instructions.md) | claude-code | budding |
| [Agentic AI Reference Architecture](notes/agentic-ai-reference-architecture.md) | patterns | evergreen |
| [Six dynamic-workflow patterns & three failure modes](notes/dynamic-workflow-patterns.md) | patterns | budding |
| [The repository is the agent's only durable memory](notes/repository-as-system-of-record.md) | patterns | budding |
| [Never let the agent declare its own victory](notes/completion-is-externalized.md) | patterns | budding |
| [Loop engineering — design the loop, not the prompt](notes/designing-loops-not-prompts.md) | patterns | seedling |
| [Use Claude Code vs build your own](notes/claude-code-vs-build-your-own.md) | patterns | evergreen |
| [Scenario: bootstrapping a company's AI stack](notes/bootstrapping-company-ai-stack.md) | products | budding |

> Looking for the **CCA-F exam prep**? That's the other view —
> [`exam-prep/`](../exam-prep/) + the [interactive exam-prep site](https://vikkybharadwaj.github.io/ai_knowledgecenter/concepts/exam.html).
