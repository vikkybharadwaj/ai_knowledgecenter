# Knowledge 🧠 — the Home Note

This is the entry point to the self-organizing half of the AI Knowledge Center. It's **one
connected brain**, not a filing cabinet: atomic notes, wired together with typed links, all
hanging off a single [**Big Picture spine**](maps/big-picture.md).

> **Go broad** → read the [Big Picture](maps/big-picture.md) or open the
> [interactive concept graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/knowledge/).
> **Go deep** → click into any note and follow its **Connections** wherever they lead.

## Start here
- 🗺️ **[The Big Picture](maps/big-picture.md)** — the spine: how the whole Claude stack fits together (the dot-connecting map).
- 🕸️ **[Interactive concept graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/knowledge/)** — see every note and its typed links, laid out by spine layer.

## How this works (the model in 5 lines)
1. **Flat pool.** Every note is one atomic idea in [`notes/`](notes/) — no topic folders, no 101/201/301 levels.
2. **Typed connections.** Notes link with *labeled* relationships (`builds-on`, `enables`, `part-of`, `used-with`, `alternative-to`, `contrasts-with`, `used-in`) — the wiring of the brain.
3. **The spine.** Each note declares a `spine_layer` so it slots into the [Big Picture](maps/big-picture.md) — nothing floats free.
4. **Emergent maps.** [`maps/`](maps/) holds indexes that appear *only when a cluster earns one* — never pre-built.
5. **Land & connect.** Run `/land <url | file | pasted text>`; it distills, files, **connects the dots**, updates this map, and teaches you where the idea fits.

## All notes
*(This list is the human index; the [graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/knowledge/) is the visual one. Both are derived from the notes.)*

| Note | Layer | Depth |
|------|-------|-------|
| [Prompt vs Context vs Harness Engineering](notes/prompt-context-harness-engineering.md) | foundations | evergreen |
| [Harness vs Context vs Prompt Engineering](notes/harness-vs-context-engineering.md) | foundations | evergreen |
| [The Anatomy of an Agent Harness](notes/anatomy-of-an-agent-harness.md) | foundations | budding |
| [Claude Code Architecture — field guide](notes/claude-code-architecture.md) | claude-code | evergreen |
| [Model Context Protocol (MCP)](notes/model-context-protocol.md) | claude-code | budding |
| [Claude Code — Multi-Agent Development](notes/claude-code-multi-agent-development.md) | claude-code | budding |
| [Dynamic Workflows & the Ultraplan loop](notes/dynamic-workflows-and-ultraplan.md) | claude-code | evergreen |
| [Agentic AI Reference Architecture](notes/agentic-ai-reference-architecture.md) | patterns | evergreen |

> Looking for the **Claude Code Architecture exam prep**? That's the other view —
> [`exam-prep/`](../exam-prep/) + the [interactive quiz site](https://vikkybharadwaj.github.io/ai_knowledgecenter/claude-code-architecture/).
