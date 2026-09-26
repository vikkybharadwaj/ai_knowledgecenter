---
title: Code checks — test structure, state and behaviour, scoped per scenario, with pass and fail examples
slug: code-check-best-practices
kind: concept
spine_layer: foundations
tags: [evals, graders, assertions, ci-cd]
connections:
  - { to: two-kinds-of-eval-check, type: part-of, why: "Code checks are the first kind of eval check; this is how to write them well." }
  - { to: word-checks-cant-read-meaning, type: contrasts-with, why: "The Tide lesson shows code checks going wrong when they match WORDS; good code checks test structure, state and behaviour instead." }
  - { to: evals-test-judgment, type: used-with, why: "Code checks own the deterministic links: the right tool, the right arguments, the right resulting state." }
  - { to: production-to-eval-flywheel, type: used-with, why: "Cheap deterministic checks are what CI should favour; each production bug adds one." }
source: { url: "https://hamel.dev/blog/posts/evals/", author: "Hamel Husain (+ Husain & Shankar FAQ)", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Code checks — test structure, state and behaviour, scoped per scenario, with pass and fail examples

**Your question 10: what are the best practices and principles for code-based evals?**

## TL;DR
Use a code check **whenever a deterministic rule can decide pass or fail** — it's fast, cheap and never
changes its mind. Good code checks test **structure** (does the JSON parse?), **state** (does exactly one
matching record now exist?) and **behaviour** (did it call the cancel tool with this order id?), not the
exact wording. Scope them **per feature and scenario**, include **both passing and failing examples** for
every condition, run them **on every change**, and add one for every bug you fix.

## Principles
1. **Reach for code first.** If a regex, schema validator or execution test can catch the failure, the cost
   is minimal and it's almost always worth it. Save LLM judges for what rules can't decide.
2. **Check structure, state and behaviour — not phrasing.**
   - *Structure:* valid JSON, required fields present, schema matches.
   - *State:* after "add this contact", query the database and check that **exactly one** matching record
     exists.
   - *Behaviour:* the right tool, called with the right arguments, in the right order.
   String matching on the answer's *wording* is the fragile case (see the word-check lesson).
3. **Scope per feature and scenario.** Hamel's Lucy example: for a listing search, "one match" →
   `len(listings) == 1`; "several" → `> 1`; "none" → `== 0`. Each scenario gets its own precise assertion.
4. **Add generic safety-net checks too.** A regex that fails any response exposing an internal UUID, for
   example, applies everywhere.
5. **Test tool calls as four checks, not one:** tool name, arguments, result, resulting state. And a valid
   call can still be wrong if it wasn't authorised.
6. **Every condition needs a passing AND a failing example.** Otherwise you've never shown the check can
   fail. Add the edge cases you found in error analysis.
7. **Keep checks binary.** For partial credit, split into several binary sub-checks ("4 of 5 expected
   facts present") rather than a score.
8. **Run them constantly, and cheaply.** They belong in CI on every code change; they're the level-1 tests.
   Unlike ordinary unit tests, you **don't need a 100% pass rate** — track the rate over time.
9. **Grow the suite from real failures.** Every bug fixed becomes a check (Rechat grew hundreds this way).
10. **The same rules can guard production.** Simple deterministic checks are what inline **guardrails**
    are made of — PII, profanity, malformed JSON — within a few milliseconds.

**Everyday analogy:** a factory's quality gauges. A go/no-go gauge checks a bolt's thread in a second and
never has an opinion. You don't use it to judge whether the car is pleasant to drive — but you'd be mad not
to use it on every bolt.

## Mental model / why it matters
A code check is the cheapest trustworthy signal you'll ever have, so the craft is **finding the
deterministic core inside a fuzzy-looking failure**. "Did it cancel the right order?" sounds like judgment,
but it's really "was `cancel_order` called with id 123, and is order 123 now cancelled?" — two assertions.
The more of your failure map you can express this way, the fewer expensive judges you need to build and
babysit.

## How to apply (in practice / consulting)
- For each failure mode from error analysis, first try to write it as an assertion on structure, state or
  a tool call. Only if that's impossible, reach for a judge.
- Review existing string-match checks: can each be replaced by a structure or state check? If not, make it
  tolerant (formats, synonyms), or move it to a judge.
- Wire the suite into CI (e.g. GitHub Actions) and chart pass rates per check over time.
- Make "a failing test for this bug" part of the definition of done for every AI bug fix.

## Provenance & caveats
Sources (retrieved 2026-09-26): Hamel Husain, *Your AI Product Needs Evals* (2024-03-29) — level-1
assertions, scoped Lucy examples, UUID regex, hundreds of tests grown from failures, CI, no 100% pass rate;
FAQ answers on code-based evals (pass and fail examples per condition, the contact-creation DB check), agentic
workflows (four tool-call checks, authorisation), cost hierarchy, binary sub-checks, and guardrails vs
evaluators; Husain & Shankar on Lenny's (valid JSON, required keyword, executes without error).
- ❓ Practitioner methodology, not a vendor spec.
- ⚠️ Principle 2's "not phrasing" is my synthesis connecting these sources to the Tide word-check lesson; the sources themselves list "contains a required keyword" as a valid code check. Keyword checks are fine when the keyword genuinely must appear, and fragile when many phrasings are correct.

## Connections
- **part-of [Two kinds of eval check](two-kinds-of-eval-check.md)**: the first kind, done well.
- **contrasts-with [Word checks can't read meaning](word-checks-cant-read-meaning.md)**: structure and state, not wording.
- **used-with [Evals test judgment; unit tests test math](evals-test-judgment.md)**: code owns the deterministic links.
- **used-with [The production-to-eval flywheel](production-to-eval-flywheel.md)**: CI favours these; each bug adds one.
