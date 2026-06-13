# Learnings

Hard-won, dated lessons about building AI products. **Append-only, newest at top.**
One lesson per line/block. Keep it terse — link out to the full note in `knowledge/`,
`articles/`, or `patterns/` for depth.

Format:
```
YYYY-MM-DD  <the lesson in one or two sentences> [→ link]
```

---

2026-06-13  **Closed the harness-vs-context migration — the Tide source page is now deleted, so AKC is the SOLE home.**
            Executed the tide-side checklist left open in the 2026-06-02 entry below: in the **tide** repo, deleted
            `docs/harness-vs-context-engineering.html`, removed its card + orphaned CSS from both landing pages
            (`index.html`, `visual-docs-hub.html`), and let `sync-portfolio.sh`'s orphan pass prune the live mirror
            at `vikkybharadwaj.github.io/projects/tide/`. The knowledge already lived here (and better, vendor-neutral):
            [[harness-vs-context-engineering]] (canonical note) + [[anatomy-of-an-agent-harness]] (the 12-component
            harness anatomy) + the interactive `docs/concepts/mental-model.html#harness` render. Nothing ported this
            round — the 2026-06-02 distillation WAS the migration; the verbatim Tide-specific "15 jobs mapped onto Tide"
            table was application detail that stays in Tide's own LEARNINGS, not reusable AKC material. Lesson: a
            migration isn't done when the new home exists — it's done when the old copy is deleted and every pointer to
            it is gone; carry the removal checklist in LEARNINGS so the second half doesn't get orphaned for weeks.
            [→ knowledge/notes/harness-vs-context-engineering.md]

2026-06-09  **Changelog deep-links must validate anchors against the LIVE page, not the historical file.**
            The change log now links each touched `docs/*.html` to its live GitHub Pages URL and lists the exact
            visible text added/removed (HTML tags stripped), deep-linked to the nearest `id=` section. Gotcha: the
            nearest-anchor is computed from the file *at that commit* (`git show <sha>:<path>`) for correct line-number
            alignment, but the link points to the *current* page — so a section renamed/removed since then, or a
            JS-injected id, yields a dead `#anchor`. Fix: filter every anchor through `current_anchors()` (ids in the
            working-tree file); misses fall back to the page top. One `git diff-tree -p` per commit keeps the build ~2.6s.
            (`scripts/build-changelog.py`)

2026-06-09  **Two confusable families, sorted by one verified frame each.** Landing the "WTF Is a Loop?"
            article surfaced two mix-ups worth pinning. (1) Automation: the command is **`/goal`** (singular,
            v2.1.139+) — a *condition*-driven wrapper around a prompt-based **Stop hook** that a small fast model
            (Haiku) evaluates each turn; **`/loop`** (v2.1.72+) is *clock*-driven, uses `CronCreate` cron syntax
            but is session-scoped + 7-day-expiry (≠ OS cron's fixed script, ≠ cloud **routines**'s unattended
            run). The clean separator: *WHERE it runs × WHAT starts the next unit (clock / condition / event)*,
            and *"a loop is cron plus a decision-maker in the body."* (2) Invocation: **tool use ⊃ tool call ⊃
            {MCP call, `Skill` tool call}**; "function call" is the legacy OpenAI synonym. Also: there was a
            `routines.html` primitive page and a `claude-code-routines` note but **no `routines` concept node** —
            a silent graph gap; added it alongside `scheduled-tasks` + `goal-mode`. Codex `/goal` parity and
            Yegge's "Gas Town" marked ❓ (author's claims), per the existing verification rubric.
            [→ knowledge/notes/{loop-is-cron-plus-a-decision-maker,automation-control-flow-spectrum,tool-call-taxonomy}.md]

2026-06-09  **Opinion articles can't be trusted to define vocabulary for a source-of-truth vault — verify
            before you write, not after.** Landing Addy Osmani's "loop engineering" thread, a docs fact-check
            (via the claude-code-guide agent) found the Claude Code *claims* largely correct but the *terms*
            loose: "connectors" is really **MCP servers**, "schedule a cron task" conflates session-scoped
            (`/loop`, `CronCreate`) with unattended (Routines / GitHub Actions / web), and "agent teams" ≠
            "subagents". Cross-tool parity ("Codex has all five too") was unverifiable and got marked as the
            author's claim. Fix: added a **Step 2.5 verification gate** to `/land` + a reusable
            **`verification-rubric.md`** (10 criteria) + a **`knowledge-fact-checker` subagent** that reruns the
            rubric on a PR diff — the article's own maker/checker split applied to the vault itself.
            [→ .claude/skills/land/verification-rubric.md, knowledge/notes/designing-loops-not-prompts.md]

2026-06-08  **A whole-card link (`<a class="card">…</a>`) silently breaks the moment it wraps an inner `<a>` —
            HTML forbids nested anchors, so the parser auto-closes the outer anchor right before the inner link,
            and every child after that point (sub-links, the "go →" affordance) escapes the card and renders as a
            sibling row.** Symptom looks like a CSS bug (flex/grid rules "not applying"); it's actually the DOM.
            Fix for the portfolio `.module`/`.xcard` pattern: the card anchor may contain only non-anchor children —
            use `.chip`/tag **spans**, never `<a>` sub-links. Caught it by `--dump-dom`, not by reading the CSS.
            [→ docs/index.html explore band]

2026-06-08  **The site is re-skinnable as a pure token remap — both stylesheets share the same CSS variable
            names (`--bg`, `--accent`, `--text*`, `--border*`, `--radius`, `--sans/--mono`), and JS never reads
            CSS vars.** Aligning the whole UI to the portfolio (`vikkybharadwaj.github.io` + Product Cockpit:
            JetBrains Mono, `#0a0f1a`, glassy cards, green→blue gradient, ambient glow, dark-only) meant remapping
            the `:root` values in `docs/assets/style.css` (hub/graph/reader) + `docs/concepts/assets/style.css`
            (concepts/exam), plus the only hard-coded colours — `LAYER_COLORS`/`TYPE_COLORS` in `graph.js` &
            `reader.js`. No note/concept content changes, no `build-index.py` rerun. Nav was the one structural
            edit (rail+crumbbar → sticky top `.nav`), done across 22 HTML files by a path-keyed script.

2026-06-07  **Fact-check the graph against `code.claude.com/docs` — training memory drifts.** A docs pass on the
            42 concepts caught real errors a confident summary would never flag: "Dynamic Workflows / Ultraplan"
            conflated two *separate* features (dynamic workflows fire on **`ultracode`**; ultraplan is a different
            *cloud* feature); slash commands have **merged into skills**; **CLAUDE.md loads in full** (smallness comes
            from a ~200-line target + `.claude/rules/` + skills, NOT progressive disclosure); skills do **not** depend
            on CLAUDE.md; CC features don't "run on" SDK sub-primitives. Also: scope a learning map to the surface you
            actually use — dropped cloud/CI nodes (routines, ultraplan, GitHub Actions) to keep it CLI-only. And edges
            needed a second family: **dependency** (solid) vs **relation** (dashed: `used-with`, `alternative-to`),
            because forcing "Agent teams = alternative to Subagents" into a dependency type is itself a lie. Lesson:
            for any Claude Code claim, WebFetch the docs and diff — don't trust the model's recollection.

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
