# Getting Your Hands Dirty with AI — A Product Leader's On-Ramp

*A structured, no-overwhelm way into building with AI. Claude ecosystem first (on purpose — one stack, one mental model, no thrash). ~2–3 hrs/week for 6 weeks. Everything hands-on runs on one **Claude Pro** plan (~$20/mo) — no terminal, no code.*

> **How to use this doc.** Pages 1–2 are the whole map — read them once, then do **one row a week**. The appendices are a reference library to dip into, not homework. You already write good prompts; this is about everything that wraps *around* the prompt — which is where the actual leverage (and the actual PM craft) now lives.

---

## Page 1 — The one idea that organizes everything

If you remember nothing else, remember the arc:

> ## Prompt → Context → Harness → Loop
> **Each era didn't replace the last — it *wrapped* it.** The skill that creates value kept moving outward, from "write a clever ask" to "design a system that runs itself."

Think of it the way the field actually evolved (and the way your own AI roadmap will mature):

| Era | What you control | The plain-English version | The PM analogy from your world |
|---|---|---|---|
| **1. Prompt** | One ask, one answer | How you phrase a single request to the model | A single, well-written ticket or brief |
| **2. Context** | What the model *sees* this turn | The instructions, files, and history in its working memory — including **RAG** (pulling in the right docs automatically) | The data, specs, and guardrails you put in front of a team before they start |
| **3. Harness** | The whole **gather → act → verify** loop | The model in a cycle: it uses tools, checks its own work, retries — not just one reply | An experimentation system: hypothesis → run → **measure** → iterate. The *measure* step is the point. |
| **4. Loop** | The harness running **itself** | The system kicks itself off, spawns helpers, and works unattended over time | A standing program with its own cadence — a growth engine that runs without you in every meeting |

**And they nest.** A loop contains a harness, which curates context, which frames a prompt:

```
┌─ LOOP — runs itself, on a cadence, spawns helpers ───────────┐
│  ┌─ HARNESS — gather → act → verify, with tools + memory ──┐ │
│  │   ┌─ CONTEXT — what's in the window (+ RAG) ─────────┐  │ │
│  │   │        ┌─ PROMPT — the single ask ───────────┐   │  │ │
│  │   │        └──────────────────────────────────────┘   │  │ │
│  │   └───────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### The instinct this gives you: *"Which layer is this problem on?"*

This is the single most useful reflex in an AI roadmap review. When something's wrong, the *symptom* tells you which layer to fix — and stops you from "just rewording the prompt" forever:

| The symptom | The layer that's actually broken | The fix |
|---|---|---|
| "The answer is bad, but a clearer ask fixes it" | **Prompt** | Reword. (You already do this.) |
| "It forgot what I told it / it's missing the relevant doc / it's drowning in irrelevant text" | **Context** | Curate the window — Projects, instructions, RAG |
| "It produced something plausible but *wrong*, and didn't catch it" | **Harness** | Add verification, tools, a check step — the model can't grade its own homework |
| "It works, but I have to babysit every step" | **Loop** | Design the system that runs the steps for you |

> **The big shift for a PM:** "AI quality" is rarely a model problem. It's almost always a **context** or **harness** problem — i.e., a *product design* problem you're equipped to own. That's the opening.

---

## Page 2 — The 6-week path

One concept a week. Each week: **read the why → do the 20–30 min exercise → optionally follow one link deeper.** Surfaces graduate as the concepts do — you start in the chat box and end up directing a system. **All three surfaces come with one Claude Pro plan; none need a terminal.**

**Before Week 1 (5 min):** Get **Claude Pro** and install the **Claude desktop app** ([claude.com/download](https://claude.com/download)). That one subscription unlocks Claude.ai (web), **Cowork** (the desktop agent), and **Claude Code** (desktop/web) — the three surfaces below.

| Wk | Concept | Why *you* need it | 20–30 min exercise | Surface | Go deeper |
|---|---|---|---|---|---|
| **1** | **The arc + a prompt tune-up** | Internalize the map; confirm prompting is a *solved* base you can build past | Take a real work task. Push one prompt to a genuinely great output — *then deliberately find its ceiling* (it doesn't know your data, can't act, won't check itself). That ceiling is the rest of this plan. | Claude.ai | [AI Fluency](https://anthropic.skilljar.com/ai-fluency-framework-foundations) · [Claude 101](https://anthropic.skilljar.com/claude-101) |
| **2** | **Context engineering + RAG** | This is where 80% of "AI quality" actually lives — and it's product work, not ML | Create a **Project**: write a system instruction (role/tone/rules) and upload 2–3 of your own docs (a spec, a PRD, past research). Ask questions that span the docs. *That cross-doc retrieval is RAG, lite.* | Claude.ai **Projects** | [Projects guide](https://claude.ai/projects) · [Prompt tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) |
| **3** | **Context → Harness: what makes it an *agent*** | The leap from "answers" to "does the work + checks itself" — the gather→act→**verify** loop | In **Cowork**, point Claude at a folder and give it a multi-step job ("read these 3 files, find the trend, draft a 1-page summary"). Watch it **plan, act, and hand back a finished deliverable** — not a chat reply. | **Cowork** (desktop) | [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) · [Intro to Cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork) |
| **4** | **The harness toolbox: primitives** | The vocabulary you'll use to *spec* AI features — each primitive answers one control question | In Cowork/Claude, connect a tool (a **connector / MCP**) or try an **Agent Skill**. Notice you just gave the agent a new *capability*, not a new sentence. | Cowork / Claude | [Agent Skills](https://github.com/anthropics/skills) · [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) |
| **5** | **The Loop: work that runs itself** | Where leverage stops being "per task" and becomes "per system" — the executive view of AI | In **Claude Code** (desktop/web — no terminal), give it a small multi-step goal on a folder and watch it loop through sub-steps on its own. Optional: set a **Routine** to run something on a schedule. | **Claude Code** (desktop/web) | [Dynamic workflows](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code) · [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) |
| **6** | **Capstone: build one real thing** | Cement it by shipping — and by naming the layer behind each design choice | Pick a recurring task you actually own. Build it end-to-end (Project → Cowork → maybe a Routine). Then annotate: *where's my context boundary? where should I add a verify step? what could run unattended?* | your pick | — |

> **The whole arc in one breath:** Week 1 you *ask*. Week 2 you *feed it the right context*. Week 3 it *does the work and checks itself*. Week 5 it *runs itself*. Week 6 you *direct the system* — which is the actual job of a PM in the AI era.

---
---

# Appendices (reference — dip in as needed)

## Appendix A — The evolution, expanded (the connect-the-dots)

The four eras as a story of **where the leverage moved**:

- **Prompt engineering** — *Leverage = phrasing.* You optimize a single turn. Real, but capped: the model only knows what's in front of it and only gets one shot.
- **Context engineering** — *Leverage = curation.* You realize the model is only as good as what's in its window, so you manage that window: instructions, examples, and **retrieval (RAG)** to pull in the right knowledge at the right moment. Most "make the AI better" work is here.
- **Harness engineering** — *Leverage = the loop around the model.* One reply isn't enough for real work, so you wrap the model in a cycle — **gather context → act with tools → verify the result → retry** — plus memory. This is where reliability is won or lost. Key truth: *the model is systematically overconfident, so "done" has to be judged by the harness, not the model* (the **completion-is-externalized** idea in Appendix C).
- **Loop engineering** — *Leverage = the system.* You stop writing turns and start designing the thing that writes the turns: a harness that triggers itself, spawns sub-agents, and runs unattended. A **loop is just cron + a decision-maker** — a scheduler that runs a *model that decides what to do next*, instead of a fixed script.

**Why this matters to you specifically:** your edge isn't writing model internals — it's knowing *which layer a problem lives on* and designing the product around it. Reread the symptom→layer table on Page 1; that's the appendix in one glance.

## Appendix B — The Spine (the 6-layer "lens stack")

The same `gather → act → verify` idea, zoomed out one level at a time. Not a skill ladder — a set of lenses; you pick the layer your question lives on.

| Layer | What lives here | One line |
|---|---|---|
| **Products & consulting** | Real builds, client scenarios | What you ship |
| **Agent patterns** | Chaining, routing, orchestrator–worker | How you compose |
| **Claude Code primitives** | Skills, hooks, MCP, subagents | The toolbox |
| **Agent SDK** | Build your own agent on the loop | The framework |
| **Claude API** | Tool use, caching, batching | The engine |
| **Foundations** | prompt ⊂ context ⊂ harness | The physics |

## Appendix C — Mental models (your working vocabulary)

Memorable shapes worth internalizing — these are the words to *think and argue in*:

| Model | The idea | When to reach for it |
|---|---|---|
| **prompt ⊂ context ⊂ harness** | Three nested levels of control | Deciding *where* a problem lives |
| **Harness = a debugging ladder** | Climb out one level when the current one can't fix it | When rewording the prompt keeps failing |
| **Anatomy of a harness (6 organs)** | Loop · context · tools · memory · verification · delegation | Spec'ing or auditing an agent feature |
| **Containment vs. discrimination** | Nest things to *understand* them; grid them to *decide* between them | When a "is X a type of Y?" debate stalls |
| **Loop = cron + a decision-maker** | Cron runs a fixed script; a loop runs a model that *decides* the next step | Explaining what "agentic" even means |
| **Completion is externalized** | Agents are overconfident; the *harness* owns "done," not the model | Designing QA / acceptance for any AI feature |
| **Designing loops, not prompts** | Leverage moved from "write the turn" to "design the system that prompts" | Thinking about scale and automation |
| **Automation = where × trigger** | *Where* it runs (in-session vs. independent) × *what* starts it (clock / condition / event) | Choosing the right automation primitive |
| **Repo as system-of-record** | Could a fresh agent, using only the written record, do the job? | Judging whether your context/docs are good enough |

## Appendix D — Primitives field guide (each answers *one* control question)

| Primitive | The one question it answers | Plain version |
|---|---|---|
| **Tool use** | "How does the model *do* things, not just talk?" | Model calls a function you defined; your code runs; result comes back |
| **MCP (connectors)** | "How do I plug in external tools/data cleanly?" | An open standard — the "USB-C" for agents (now adopted across vendors) |
| **Skills** | "How do I teach a repeatable procedure once?" | A folder of instructions the agent loads on demand |
| **Subagents** | "How do I get a second set of eyes / parallel work?" | A delegated worker in its own context (maker/checker split) |
| **Hooks** | "How do I enforce a rule the agent *can't* skip?" | Deterministic handlers fired at lifecycle events |
| **Routines** | "How do I make it run unattended on a schedule?" | Saved config that runs on the cloud, laptop closed |
| **Dynamic workflows** | "How do I orchestrate dozens of agents on a big task?" | A script that fans out many subagents |

## Appendix E — Cross-vendor cheat sheet (orientation only — titles, no deep dives)

So you can map a Claude concept onto its OpenAI/Gemini cousin in a meeting. **Stay on Claude while learning** — this is just so the words aren't foreign elsewhere.

| Concept | Claude | OpenAI | Google Gemini |
|---|---|---|---|
| The chat app | Claude.ai | ChatGPT | Gemini app |
| Saved workspace + knowledge | **Projects** | Projects / Custom GPTs | **Gems** |
| Retrieval over your docs (RAG) | Project knowledge | Custom GPT knowledge | Grounding / NotebookLM |
| Inline editable output | Artifacts | Canvas | Canvas |
| Tool/data connection standard | **MCP** | (adopted MCP) | (adopted MCP) |
| Desktop agent that does work | **Cowork** | Agent / Operator | Project Mariner |
| Coding/agentic dev tool | **Claude Code** | Codex CLI | Gemini CLI |
| Reusable skill packages | **Agent Skills** | (adopting the open standard) | (adopting the open standard) |
| Scheduled, unattended runs | **Routines** | Tasks | Scheduled actions |

## Appendix F — Decision guide ("I want X → reach for Y")

- *"I want a better single answer."* → **Prompt** it more clearly.
- *"I want it to know my docs/specs."* → **Context**: a Project + uploads (RAG).
- *"I want it to actually do a multi-step job and hand me a deliverable."* → **Harness**: Cowork.
- *"I want a new capability (a tool, a data source)."* → A **connector / MCP** or a **Skill**.
- *"I want a second opinion or parallel work."* → **Subagents**.
- *"I want a rule it can never skip."* → A **hook**.
- *"I want it to run on its own, on a schedule."* → A **Routine** / the **Loop**.

## Appendix G — Curated official resources (start here, go in order)

**Start here — Anthropic Academy (free, on Skilljar):** <https://anthropic.skilljar.com/>
- [Claude 101](https://anthropic.skilljar.com/claude-101) — the everyday foundation
- [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations) — how to *think* with AI
- [Introduction to Claude Cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork) — the desktop agent (Week 3)
- [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) — the loop/primitives (Week 5)
- [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — optional, for when she's curious how products are built

**Context & prompting**
- [Interactive Prompt Engineering Tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) — hands-on, with a playground
- [Claude Projects](https://claude.ai/projects) — the context workspace

**Agents & the harness**
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — *the* essay; read it twice
- [Agent Skills (official repo)](https://github.com/anthropics/skills) — what a reusable skill looks like
- [Cowork](https://claude.com/product/cowork) · [Cowork overview](https://www.anthropic.com/product/claude-cowork)

**The loop & Claude Code**
- [Claude Code docs](https://code.claude.com/docs) · [desktop app](https://code.claude.com/docs/en/desktop) · [scheduled tasks/routines](https://code.claude.com/docs/en/scheduled-tasks)
- [Use Claude Code with Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan) — confirms one Pro plan covers it
- [Dynamic workflows](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code) — orchestration, when she's ready
- [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/en/) — community deep dive on the harness idea

## Appendix H — Glossary (one line each)

- **Prompt** — a single instruction to the model.
- **Context window** — everything the model can "see" in one turn.
- **Context engineering** — deliberately managing what's in that window.
- **RAG (retrieval-augmented generation)** — automatically pulling relevant docs into the context before answering.
- **Tool use / function calling** — the model calling code you defined to *do* something.
- **Agent** — a model running in a gather→act→verify loop with tools.
- **Harness** — the loop + tools + memory + verification wrapped around the model.
- **Verification** — the step where work is checked; the harness owns "done," not the model.
- **MCP (Model Context Protocol)** — an open standard for connecting tools/data to agents.
- **Skill** — a reusable, loadable package of instructions for a repeatable task.
- **Subagent** — a delegated agent working in its own separate context.
- **Hook** — a deterministic rule the agent is forced to obey at set moments.
- **Loop / loop engineering** — designing the self-running system, not the single turn.
- **Routine** — an agent saved to run unattended on a schedule.
- **Cowork** — Anthropic's desktop agent that works on your files and returns finished deliverables.
- **Claude Code** — Anthropic's agentic dev tool (terminal, desktop, web, IDE) — the clearest place to *watch* a loop work.

---

*Built from a personal AI knowledge base, grounded in official Anthropic sources. Claude-first by design — once the four layers click here, every other vendor's tools map onto the same arc (Appendix E).*
