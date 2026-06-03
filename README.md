# AI Knowledge Center

A personal, evolving knowledge base for building **AI products**. This is where I
accumulate articles, distilled lessons, reusable prompts/snippets, and playbooks
over time — so I can **pull battle-tested knowledge into other AI product repos**
instead of re-learning the same things in each one.

> Think of this repo as the "shared brain" that sits behind every AI product I build.
> Knowledge flows **in** here from articles, experiments, and projects; reusable
> assets flow **out** of here into product repos (e.g. Tide).

---

## How this repo is organized

| Dir | What lives here | Nature |
|-----|-----------------|--------|
| [`knowledge/`](knowledge/) | Distilled, categorized knowledge — what I actually understand, in my own words, by topic | **Reference** |
| [`articles/`](articles/) | Notes/summaries of external articles, papers, talks, threads (one file per source) | **Inbox → reference** |
| [`patterns/`](patterns/) | Reusable, portable assets meant to be **copied into other repos** — prompts, code snippets, configs, templates | **Reusable** |
| [`playbooks/`](playbooks/) | Step-by-step "how to do X" guides (set up evals, add prompt caching, build an agent loop, etc.) | **Procedural** |
| [`LEARNINGS.md`](LEARNINGS.md) | Running, dated log of hard-won lessons — append-only, newest at top | **Journal** |

### Knowledge categories

`knowledge/` is split into numbered topic areas (see [`knowledge/README.md`](knowledge/README.md)):

1. **Prompting** — prompt engineering, structured output, context design
2. **Models** — model selection, capabilities, pricing, benchmarks
3. **RAG & Retrieval** — embeddings, chunking, vector stores, hybrid search
4. **Agents & Tool Use** — agent loops, tool/function calling, orchestration, memory
5. **Evals & Testing** — eval design, dimensions, fixtures, ground truth, CI
6. **Infra, Cost & Latency** — serving, caching, batching, streaming, cost control
7. **Safety & Security** — guardrails, prompt injection, PII, red-teaming
8. **Product & UX** — AI product UX patterns, trust, latency UX, failure modes
9. **Tooling & SDKs** — Anthropic/OpenAI SDKs, frameworks, dev tooling
10. **Cross-Cutting** — mental models & guides that span multiple categories

### Interactive docs

Some knowledge is also published as small interactive HTML sites under [`docs/`](docs/)
(hostable on GitHub Pages):

- [`docs/claude-code-architecture/`](docs/claude-code-architecture/index.html) — a clickable
  field guide to the Claude Code primitives (skills, hooks, MCP, subagents, agent teams,
  dynamic workflows, agent view, worktrees, conventions, policies) with a comparison matrix
  and 101/201/301 leveling. Markdown companion: [`knowledge/10-cross-cutting/`](knowledge/10-cross-cutting/).

---

## How to use it

**Adding knowledge?** See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the (light) conventions.

- Read an article worth keeping → drop a note in `articles/` (use `_TEMPLATE.md`).
- Learned something durable → distill it into the right `knowledge/<cat>/` file, in your own words.
- Built something reusable → promote it to `patterns/` and tag it portable.
- Hit a non-obvious gotcha → append a dated line to `LEARNINGS.md`.

**Pulling knowledge into another repo?** Everything in `patterns/` is written to be
copied out. Each pattern's header says what it is, where it came from, and any
caveats. Prefer copying (with attribution back here) over symlinking.

---

## Status

Just initialized — scaffolding in place, content accumulates over time. This is a
living repo; structure can evolve as the collection grows.
