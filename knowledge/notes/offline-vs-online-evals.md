---
title: An offline eval is a controlled experiment — the agent is real, the world is frozen
slug: offline-vs-online-evals
kind: concept
spine_layer: foundations
tags: [evals, reliability, fixtures, llm-as-judge, observability, harness]
connections:
  - { to: harness-engineering-discipline, type: builds-on, why: "That note says evals tell the harness which failure modes deserve a guard; this one is how to build the measuring instrument so the number it produces can be trusted." }
  - { to: anatomy-of-an-agent-harness, type: builds-on, why: "An eval harness is the same anatomy with one organ swapped: the tool-execution layer returns canned fixture data instead of touching the real world." }
  - { to: tool-call-taxonomy, type: used-with, why: "The tool_use → tool_result boundary is the exact seam where a fixture injects its frozen world, and the tool_use blocks are what 'must call tool X' assertions grade." }
  - { to: completion-is-externalized, type: used-with, why: "Same maker/checker split: the agent never grades itself — code checks and judges outside it do, and the harness first checks that a real measurement happened at all." }
source: { url: null, author: "Vik — distilled in-house from rebuilding the Tide Coach eval harness (tide PR #234)", retrieved: 2026-09-18 }
date: 2026-09-18
depth: seedling
claude_specific: false
---

# An offline eval is a controlled experiment — the agent is real, the world is frozen

## TL;DR
An **offline eval** runs the *real* agent (the production system prompt, the production tool
definitions, the real Claude model) against a **frozen world**: every tool call returns data the
test case (the *fixture*) wrote in advance. So each fixture asks a conditional question: *if the
world looked exactly like this, would the agent do the right thing?* Freezing the world leaves the
agent's judgment as the only variable, and that is what lets you know the right answer in advance.
The cost is realism, which you buy back with **online evals** on sampled production traffic and a
**flywheel** that freezes real failures into new fixtures. The experiment only holds if you freeze
**everything the agent can observe, including the clock.**

## Two layers, two kinds of test
An agentic product has a **deterministic layer** (data and arithmetic: same input, same output) and an **agent
layer** (judgment and communication: probabilistic). **Evals test judgment; unit tests test arithmetic.**
Mocking the tool layer is what separates them: the fixture *assumes* the math is right and asks only how the
agent handles its output. The full lesson, including the easy-to-miss seam between the two, is
[Evals test judgment; unit tests test math](evals-test-judgment.md).

## Why frozen data instead of live data (most important first)
1. **No known answer, no grade.** Live data keeps changing, so there's nothing stable to compare
   against. Every grader that needs a reference answer only works on frozen inputs.
2. **Attribution.** If the score moves after a prompt change and the inputs were frozen, the prompt
   is the only thing that changed.
3. **Rare scenarios on demand.** The cases that matter most (safety, crisis, adversarial) rarely
   show up naturally. You manufacture them instead: the *flight-simulator principle*.
4. **Privacy.** Eval results end up in repos, CI logs and dashboards, so real PII must never go into them.
5. **Stability.** Live dependencies fail for reasons that have nothing to do with the agent, and
   those failures get misread as quality.

**What offline evals can't tell you:** whether the frozen world still matches production (*mocks
drift*), whether real users actually ask these questions (fixtures are authored, not observed), and
whether the full chain works end to end.

## Offline and online evals are a pair, not alternatives

| | Offline evals | Online evals |
|---|---|---|
| Input | Frozen, mocked fixtures | Real conversations sampled from production |
| Right answer known? | Yes | No |
| Good for | Catching regressions before shipping; A/B-ing prompts | How it actually goes for real users |
| Graders that work | Code checks, reference (ground-truth) judge, rubric judge | **Reference-free only**: rubric-based LLM judge, human review |
| Analogy | Flight simulator | Flight-recorder review |

**Which grader works where follows from the known-answer requirement.** A grader that compares
against a reference answer can only run offline. A **rubric judge** grades against a *standard*,
not an answer, so it's the one automated grader that carries over to production traffic.

**The flywheel** joins the two halves: a flagged production conversation is frozen into a new
fixture, and its real tool outputs (anonymized first) become the mock data. Real failures become
permanent regression tests, which keeps the offline suite grounded in reality rather than drifting
into imagined scenarios. (Tide: `evals/scripts/trace_to_fixture.ts` turns a flagged row in the
`ai_traces` table into a fixture template; a PM then writes the ground-truth response.)

## The two lessons that make this stick
**Freeze *everything*, including the clock.** The experiment is only controlled if every input the agent can
observe comes from the fixture. Tide's harness froze the tool data but stamped the prompt with the real date,
so a test written for a March payday, run in September, had the agent (correctly) call the payday stale and
get graded **1/5**. Once each fixture carried its own required "today", the same test scored **4/5**.
The full checklist (date, conversation, limits) is
[Freeze everything the model can see](freeze-everything-the-model-sees.md).

**Validity gates every score.** An errored run still produces a result object, and a naive harness scores it
as a quality failure. Tide published a confident **0% for 95 nights** because the eval pinned a model ID the
Claude API had retired, while production on Amazon Bedrock kept working. First ask *"did we measure anything
at all?"*, then *"how good was it?"* The full lesson is
[A test that crashed is not a test that failed](crashed-is-not-failed.md).

## Mental model / why it matters
Think **flight simulator vs flight recorder.** The simulator (offline) lets you script the storm,
knows the correct manoeuvre, and replays identically, so it's where you catch regressions before
shipping. The recorder (online) shows what really happened, but there's no answer key, so you can
only grade it against a standard. Neither one alone is enough, and the flywheel is the loop between
them. It also connects to the harness picture: an eval harness *is* an agent harness whose
tool-execution organ is swapped for canned data. Every rule about a controlled experiment
(freeze all inputs, check the instrument before trusting the reading) is harness engineering
applied to the measuring tool itself.

## How to apply (in practice / consulting)
- **First question to a client with "evals":** *what does the agent see that the fixture doesn't
  control?* Look for dates, the logged-in user, locale, feature flags and live lookups. Each one is
  a repeatability leak.
- **Split the test plan by layer.** Numbers and data plumbing get unit tests with exact assertions;
  only judgment and communication go to evals. Don't pay LLM-judge costs to check arithmetic.
- **Pick graders by whether the answer is known.** Offline: code checks plus a ground-truth judge
  plus a rubric judge. Online: rubric judge plus human review. Write the rubric first, because it's
  the one grader that works in both places.
- **Gate every score on validity.** Run a preflight model call, classify each run as
  valid/degraded/dead, and never plot a dead run on the trend chart.
- **Build the flywheel early.** Log traces with a "flag" affordance from day one, so production
  failures can become fixtures.
- **Pin evals to the model aliases the vendor keeps alive,** and watch the deprecation page. On
  Anthropic's platform, requests to a retired model ID *fail*; they don't silently fall back.

## Provenance & caveats
Distilled in-house on 2026-09-18 from rebuilding the Tide Coach eval harness (tide PR #234). Tide claims
checked against that repo by a separate fact-check pass: `evals/scripts/trace_to_fixture.ts` (flagged
`ai_traces` rows → fixture templates), per-fixture frozen dates (commit `45e40fe`, required by
`evals/runner.ts`), `proj-acc-002` similarity 1 → 4 (runs `2026-09-18T11-07` vs `T16-12`), and 95 nightly
runs at 0/81 from 2026-06-16.
- ✅ *Requests to retired models fail; Bedrock/Google Cloud set their own retirement schedules;
  `claude-sonnet-4-20250514` retired on the Claude API 2026-06-15.* Source: platform.claude.com/docs
  "Model deprecations", retrieved 2026-09-18.
- ✅ *Anthropic's grader types:* exact/string match, code-graded, LLM-graded (e.g. Likert / rubric),
  and human grading. Source: platform.claude.com/docs "Define success criteria and build
  evaluations", retrieved 2026-09-18.
- ⚠️ The **offline/online** and **reference vs reference-free** framing is *not* Anthropic's
  wording. It's a synthesis on top of that grader list.
- ❌ **Corrected 2026-09-18 (second pass):** the first version of this note used `conf-003` as the stale-clock
  example and said the clock fix was still open. `conf-003` actually failed a date-*format* word check; the
  real stale-clock case is `proj-acc-002`. Frozen dates shipped in PR #234.
- ❓ The five-reason ordering and the flight-simulator analogy are opinion (a teaching frame), not
  vendor guidance.

## Connections
- **builds-on [Harness engineering — reliability lives outside the model weights](harness-engineering-discipline.md)**: evals are the feedback signal that note's harness depends on; this note is how to make that signal trustworthy.
- **builds-on [The Anatomy of an Agent Harness](anatomy-of-an-agent-harness.md)**: an eval harness is that anatomy with the tool-execution organ swapped for fixture data.
- **used-with [Tool call, function call, MCP, skill — one containment model](tool-call-taxonomy.md)**: the `tool_use` → `tool_result` seam is where the frozen world is injected and where `must_call_tool`-style assertions look.
- **used-with [Never let the agent declare its own victory](completion-is-externalized.md)**: graders outside the agent own the verdict, and a validity gate owns "did we measure anything".
