# AI Knowledge Center

A personal, **self-organizing** knowledge base for the **Claude tech stack** — built to be *one
connected brain*, not a filing cabinet. I land a doc, article, or blog from the CLI; it gets distilled
into an atomic note, **wired to everything it relates to**, and placed on a single evolving map. The
goal: master the Claude/Anthropic stack, pass the **CCA-F** exam, and help small teams adopt agentic AI.

> The point isn't to *store* notes — it's to *connect* them. Every new idea is force-fit into the bigger
> picture so I can see how the pieces fit and how to use them in real scenarios.

### → Live site: **[AI Knowledge Center](https://vikkybharadwaj.github.io/ai_knowledgecenter/)**

## Two views

| View | What it is | Where |
|------|------------|-------|
| 🧠 **[Knowledge](https://vikkybharadwaj.github.io/ai_knowledgecenter/knowledge/)** | A self-organizing **concept graph** — atomic notes wired by *typed connections*, laid out on one spine. Go broad or deep at will. | `knowledge/` |
| 🎓 **[Exam Prep](https://vikkybharadwaj.github.io/ai_knowledgecenter/claude-code-architecture/)** | An interactive Claude Code Architecture field guide + **136-question CCA-F quiz**. | `docs/claude-code-architecture/` + `exam-prep/` |

## How the Knowledge view works

Three mechanisms turn a pile of notes into a brain:

1. **Typed connections** — notes link with *labeled* relationships (`builds-on`, `enables`, `part-of`,
   `used-with`, `alternative-to`, `contrasts-with`, `used-in`), each with a one-line reason. This is the
   wiring.
2. **The spine** — every note declares a `spine_layer` so it slots into the
   [Big Picture](knowledge/maps/big-picture.md): `Foundations → Claude API → Agent SDK → Claude Code
   primitives → Agent patterns → Products & consulting`. Nothing floats free.
3. **The big picture** — an [interactive graph](https://vikkybharadwaj.github.io/ai_knowledgecenter/knowledge/)
   you explore, plus a narrative [synthesis note](knowledge/maps/big-picture.md) that explains how it all
   fits. Both grow as notes are added.

Notes live as plain markdown in [`knowledge/notes/`](knowledge/notes/); the graph is **derived** from
their frontmatter by [`scripts/build-index.py`](scripts/build-index.py). Structure **emerges** — no topic
folders, no 101/201/301 levels.

## Landing new knowledge

```
/land <url | file path | pasted text>
```

The [`/land` skill](.claude/skills/land/SKILL.md) distills the source into an atomic note (in my own
words, Claude-specific, with a "why it matters" and a "how to apply" section), **connects the dots**
(2–5 typed links + a place on the spine), updates the big-picture map, regenerates the graph, and teaches
where the new idea fits. A [validation hook](.claude/hooks/validate-note.sh) blocks any note that's
malformed or **connects to nothing** — the anti-silo guard.

Conventions live in [`CLAUDE.md`](CLAUDE.md). After editing notes by hand, run
`python3 scripts/build-index.py` to refresh the graph.

## Layout

```
knowledge/
  README.md            # Home Note (dashboard / entry)
  notes/<slug>.md      # flat pool of atomic notes (+ images alongside)
  maps/big-picture.md  # the spine + narrative synthesis
exam-prep/             # markdown companions for the Exam view
docs/                  # the two-view GitHub Pages site
scripts/build-index.py # regenerates docs/assets/knowledge.js (the graph data)
.claude/skills/land/   # the ingestion + dot-connecting skill
.claude/hooks/         # note validation / anti-silo guard
LEARNINGS.md           # dated log of hard-won lessons (newest at top)
```

## Publishing (one-time)

GitHub Pages serves from `/docs`: **Settings → Pages → Deploy from a branch → `main` + `/docs`**. The
site rebuilds on every push to `main`.
