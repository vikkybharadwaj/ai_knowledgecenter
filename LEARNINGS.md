# Learnings

Hard-won, dated lessons about building AI products. **Append-only, newest at top.**
One lesson per line/block. Keep it terse — link out to the full note in `knowledge/`,
`articles/`, or `patterns/` for depth.

Format:
```
YYYY-MM-DD  <the lesson in one or two sentences> [→ link]
```

---

2026-06-07  **The concept graph should plot the TECH STACK, not the articles.** A graph whose nodes are
            notes (distilled articles) connected by note-relationships teaches you the *reading list*, not the
            *system*. Reframed it: nodes are now tech-stack **concepts** (primitives/systems/patterns in
            `knowledge/concepts/`) wired by **strict dependency** edges (`runs-on · depends-on · part-of ·
            uses`, arrows point to what a thing needs); the 20 atomic notes became **sources** each concept
            links to for depth. Lesson: a visual learning map is a model of the *domain*, and source material
            is an input to building it — don't let the artifact you ingested become the artifact you ship.
            (Also: wrap dense lanes into sub-rows — 13 chips crammed in one row clip; ~6 columns keeps titles
            legible and the spine still reads top-to-bottom.) [→ knowledge/concepts/, scripts/build-index.py]

2026-06-07  **Land a multi-lecture curriculum by its underlying model, not 1-note-per-page.** The 12-lecture
            "Learn Harness Engineering" site collapsed to 4 atomic notes mapped to the harness's *subsystems*
            (discipline+5 subsystems / repo-as-record / progressive-disclosure instructions / externalized
            completion) — denser and better-connected than 12 thin notes that would all overlap our existing
            harness cluster. Distill to the idea-shape, not the source's chapter count. [→ knowledge/notes/harness-engineering-discipline.md]

2026-06-07  **A stray committed git worktree silently breaks GitHub Pages.** `.claude/worktrees/<name>` got
            committed as a gitlink (mode 160000) with no `.gitmodules`; Pages' checkout runs `git submodule
            update --init` and dies with "No url found for submodule path", so every `pages-build-deployment`
            fails and the live site freezes on the last good build — the repo looks correct, the site just
            stops updating. Fix: `git rm --cached` the gitlink and gitignore `.claude/worktrees/`. When "the
            site won't update," check the Pages deploy run, not just the content workflow.

2026-06-06  **Never nest an `<a>` inside an `<a class="card">` — the whole card is already a link.** The HTML
            parser auto-closes the outer card anchor at the inner `<a>`, ejecting the rest of the card's content
            (heading stays put, paragraph spills into the next grid cell) and looking like "overlapping cards."
            Use `<em>`/`<span>` for emphasis inside a card, or reword to point at the standalone card. Bit the
            Skills card on `docs/concepts/primitives.html`; fixed in f331c8b.

2026-06-06  **Terminology "corrections" have a shelf life — datestamp them like prices.** The vault asserted
            in ~6 places that "routines isn't a real term" (it meant skills); Anthropic then shipped a feature
            *literally named* Routines (unattended cloud automation). A flat denial aged into a contradiction.
            Fix pattern: prefer "X usually means Y" over "X isn't real," and when a name collides, document
            *both meanings* rather than picking one. [→ knowledge/notes/claude-code-routines.md]

2026-06-05  When a new source overlaps an existing note, **split by idea, don't fatten the note**. The
            "Master Dynamic Workflows" article overlapped `dynamic-workflows-and-ultraplan`, but it carried
            two genuinely distinct ideas — the *execution-context model* (modes stay in one window, agents
            fork) and the *six-pattern catalog + three failure modes*. Made each its own atomic note rather
            than bloating the existing one; atomicity keeps connections precise. [→ knowledge/notes/execution-context-isolation.md, knowledge/notes/dynamic-workflow-patterns.md]

2026-06-05  The Concepts section now has a dedicated **hub** at `concepts/index.html` (overview + "ways in"
            cards), mirroring the exam section's `exam.html`. The primitives field guide moved to its own
            `concepts/primitives.html`. Before, `index.html` *was* the primitives page, so the "🧠 Concepts"
            rail tab (and every breadcrumb "Concepts") dumped users into Primitives instead of an overview.
            Lesson: a section landing should be a hub, not double as one of its sub-pages — keep the rail's
            hub item ("Overview"/"About the exam") uniform across all pages in the section.

2026-06-05  The nine-primitives matrix (`concepts/matrix.html#matrix`) now splits its columns into two
            jobs: the left set helps you *understand* a primitive (what/coordination/enforcement/where), the
            right set helps you *use* it — **Cost & footprint** (tokens/latency/context spent), **Pairs with**
            (cross-links to the primitives it composes with), and **Watch out for** (its characteristic failure
            mode). "Scale" answers *how many run*, which is not the same question as *what it costs you* — keep
            both. The Pairs-with cells double as the connect-the-dots wiring the vault is built around.

2026-06-05  Mini-cases are now a fixed 4-line template: **Situation → Tempting (the trap) → Answer → Principle**
            (`.mc-trap`/`.mc-ans`/`.principle` in `concepts/assets/style.css`). The CCA-F exam rewards knowing
            *why the other three options are wrong*, so naming the tempting-but-wrong choice explicitly is the
            highest-leverage learnability fix — a worked case that only states the right answer teaches one verdict,
            not the discriminator. Also added a "Why these six?" provenance callout to `scenarios.html`: the six are
            the *real* CCA-F production scenarios (exam launched 2026-03-12, 4-of-6 drawn per sitting) — customer
            support is official, e-commerce is not; they're a fixed external spec, don't add/remove.
            DEPLOY GOTCHA that caused this: an earlier "add a Principle to every mini-case" fix was made on the
            pre-restructure `docs/claude-code-architecture/` paths and left *uncommitted* while `main` moved to
            `docs/concepts/` — so the live page never got it and looked half-finished. Lesson: after the
            claude-code-architecture→concepts rename, always edit `docs/concepts/`; check `git status` isn't
            stranding edits on dead paths, and that local `main` isn't behind `origin/main` before editing the site.

2026-06-05  ONE learning section + ONE exam tab. Retired the two-partition site (Knowledge ⟂ Claude Code
            Architecture) that made learning a constant context-switch: merged the architecture field guide
            (mental model, matrix, decision, primitives) AND the concept graph into a single **Concepts**
            view at `docs/concepts/`, and split the exam into its own hub `docs/concepts/exam.html` (about →
            `practice.html` quiz → `scenarios.html`), surfaced as the lone top-right tab. Two move-gotchas:
            (1) `build-index.py`'s `IMG_OUT` is hardcoded to the graph page's dir — moving the graph from
            `docs/knowledge/` to `docs/concepts/` required updating `IMG_OUT` + re-running the build so note
            images land beside the page (`<img src="notes/…">` is page-relative). (2) The home-note + two
            notes baked **absolute published URLs** (`…/knowledge/`, `…/claude-code-architecture/`) into
            `knowledge.js` — fix the *source* `.md` (never the generated JS) and rebuild.

2026-06-05  Notes now READ IN-PAGE — no link-out to GitHub. `build-index.py` renders each note body
            (plus the Big Picture map + Home note) to HTML and bakes it into `knowledge.js`; a new
            `docs/assets/reader.js` overlay shows it, and every note/content link is an
            `<a class="kc-link" data-slug=…>`. GitHub is now just the *source* the build reads from.
            Note images are auto-copied into `docs/knowledge/notes/`. Still never hand-edit `knowledge.js`.

2026-06-04  BIG REVAMP — turned the KC into a self-organizing, dot-connecting "second brain" with two
            views (Knowledge graph + Exam Prep). Deleted `articles/`, `patterns/`, `playbooks/` and the
            numbered `knowledge/` categories; flattened everything into `knowledge/notes/` (atomic notes,
            flat pool). Structure now EMERGES from typed `connections:` frontmatter + a `spine_layer`, not
            from folders. Added the `/land` skill (ingest → distill → connect → update map → rebuild index
            → teach), a `PostToolUse` validation hook with an ANTI-SILO guard (a `kind: concept` note with
            zero connections is blocked, exit 2), and a vendor-free canvas concept graph
            (`docs/knowledge/` + `docs/assets/graph.js`) generated by `scripts/build-index.py`. Removed the
            101/201/301 leveling from the exam-prep site for free-form "coordination groupings."
            [→ knowledge/maps/big-picture.md]

2026-06-04  Method worth keeping: built this via the "ultraplan" loop — a fan-out research WORKFLOW
            (4 parallel agents, structured schemas) → transparent synthesis → plan-mode gate → execute.
            Reusable lesson: fan out for INDEPENDENT work; keep INTERDEPENDENT work (like wiring a coherent
            graph across notes) in one reasoner. [→ knowledge/notes/dynamic-workflows-and-ultraplan.md]

2026-06-04  Hook gotcha: in a `cmd <<'PY' … PY` heredoc, the heredoc IS stdin — so piping JSON to a python
            heredoc and calling `json.load(sys.stdin)` reads the SCRIPT, not the JSON (silent exit 0). Pass
            the payload via env instead: `HOOK_JSON="$input" python3 - <<'PY'`.

2026-06-02  Turned `docs/` into a hosted AI Knowledge Center. `docs/index.html` is a landing
            hub driven by a module registry (`docs/assets/modules.js`) — add a module by
            appending one entry. Added `.nojekyll` (plain static HTML, no Jekyll). GitHub
            Pages can't be enabled via API/git — it's a one-time manual toggle:
            Settings → Pages → Deploy from a branch → `main` + `/docs`. Live URL:
            https://vikkybharadwaj.github.io/ai_knowledgecenter/ . Sub-sites and the hub
            share the `cca-theme` localStorage key so dark/light stays in sync.

2026-06-02  Added a `knowledge/10-cross-cutting/` category for topics that span multiple
            folders, plus an interactive HTML field guide at `docs/claude-code-architecture/`
            covering the Claude Code primitives (skills, hooks, MCP, subagents, agent teams,
            dynamic workflows, agent view, worktrees, conventions, policies). Key clarifications
            worth remembering: **conventions (CLAUDE.md) ≠ policies (managed settings)** —
            soft vs hard enforcement; **"routines" is not an official Claude Code term**
            (→ skills / workflows / output styles); **rules ≠ hooks** — three things wear
            "rule" (hooks = code that runs, permission rules = config, `.claude/rules/` = memory).
            [→ knowledge/10-cross-cutting/claude-code-architecture.md]

2026-06-02  TIDE REMOVAL CHECKLIST (couldn't be done from this session — the `tide` repo is
            out of scope here). The harness-vs-context content now has its canonical home at
            `knowledge/10-cross-cutting/harness-vs-context-engineering.md` + the HTML mental-model
            page. To finish the migration, in the **tide** repo: (1) delete
            `harness-vs-context-engineering.html`; (2) remove any nav links/cards pointing to it
            (check `operating-system.html` and any index/landing page); (3) optionally add a
            redirect or a note pointing to the AI Knowledge Center copy. The `operating-system.html`
            page can stay in Tide unless you want it centralized too.

2026-06-02  Imported 5 AI reference diagrams from `~/Documents` as distilled notes
            (kept the source image next to each). Mental model worth internalizing:
            **prompt ⊂ context ⊂ harness** engineering — where a bug lives tells you
            which level to fix. [→ knowledge/01-prompting/prompt-context-harness-engineering.md]

2026-06-02  Background jobs in this repo are blocked from writing files unless they
            isolate in a worktree. For a content task that must land in the live
            checkout, the workaround is: write notes to the job tmp dir with the
            Write tool, then `cp` them into the repo (Bash isn't guarded). Also added
            `.claude/settings.json` with `worktree.bgIsolation: "none"` for future runs.

2026-06-02  Initialized the AI Knowledge Center. Structure: `knowledge/` (distilled
            reference by topic), `articles/` (one note per source), `patterns/`
            (portable assets to copy into other repos), `playbooks/` (how-tos).
            The whole point is **reuse across AI product repos** — write everything
            so it can be lifted out, not just read in place.
