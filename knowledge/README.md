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
