---
title: Keep the eval suite current — production failures flow into CI, and stale tests get retired
slug: production-to-eval-flywheel
kind: concept
spine_layer: foundations
tags: [evals, ci-cd, observability, flywheel]
connections:
  - { to: offline-vs-online-evals, type: builds-on, why: "That note names the flywheel; this is its mechanics — what runs in CI vs production, how findings move, and when to retire tests." }
  - { to: error-analysis-on-traces, type: used-with, why: "The flywheel is error analysis on a schedule: fresh traces each cycle find the new failure modes." }
  - { to: crashed-is-not-failed, type: used-with, why: "Production alerting only works if a broken harness can't masquerade as a quality drop." }
  - { to: dont-copy-derive, type: used-with, why: "A stale gold set is a copy of the product that drifted; the fix is regular re-derivation from real traces." }
source: { url: "https://hamel.dev/blog/posts/evals-faq/how-are-evaluations-used-differently-in-cicd-vs-monitoring-production.html", author: "Hamel Husain & Shreya Shankar", retrieved: 2026-09-26 }
date: 2026-09-26
depth: seedling
claude_specific: false
---

# Keep the eval suite current — production failures flow into CI, and stale tests get retired


## TL;DR
Run two loops that feed each other. **CI evals** run on every change: a small curated set (~100+
examples of core features, past bugs and known edge cases), mostly **cheap deterministic checks**.
**Production monitoring** samples live traces and runs **reference-free judges** on them, asynchronously.
When monitoring or error analysis finds a **new failure pattern, add representative examples to the CI
set** — so it can never silently come back. And prune: an eval that **always passes** is costing more than
it tells you.

## The idea, simply

| | CI / CD evals | Production monitoring |
|---|---|---|
| Runs | On every change, before shipping | Continuously, on sampled live traces |
| Data | Small curated set (~100+): core features, past bugs, edge cases | Real traffic, no reference answers |
| Checks | Favour assertions / deterministic checks | More reference-free LLM judges |
| Alert when | A regression fails | The **lower bound** of a metric's confidence interval crosses your threshold |

**The flywheel:**
1. Monitoring and regular error analysis surface a **new failure pattern**.
2. You add **representative examples** of it to the CI set (and a check that catches it).
3. From then on, every change is tested against it — the bug can't quietly return.

**Keeping the "gold" set from going stale**
- **Re-run error analysis on big changes:** new features, prompt updates, model switches, major bug fixes.
- **Cycle:** review **100+ fresh traces every 2–4 weeks**; in between, skim **10–20 outlier traces weekly**
  (very long conversations, repeated retries, traces monitoring flagged).
- **Cadence follows stability:** new systems weekly until failure patterns settle; mature ones monthly,
  unless usage changes.
- **Update** examples and reference answers when the product changes.
- **Retire:** if an eval keeps passing, run it less or drop it. Phase out **expensive judges** faster than
  cheap code checks — weigh each eval's cost against the value of its signal.

**Everyday analogy:** a hospital's incident log. Every serious incident becomes a new checklist item, so it
can't happen the same way twice. But the checklist is also reviewed, and items that no longer catch anything
are removed, or nobody reads it.

## Mental model / why it matters
A test suite is a **snapshot of what you knew failed, on the day you wrote it**. Products and users move, so
the snapshot decays. The flywheel keeps it tied to reality in both directions: **new real failures in**,
**dead tests out**. Without the "in", you're testing yesterday's product. Without the "out", the suite gets
slow and expensive, and people stop running it.

## How to apply (in practice / consulting)
- Give every CI example a **source tag** (feature, regression #, edge case, production trace id), so you
  know why it's there and when it can go.
- Put the 2–4 week error-analysis review on the calendar; a flywheel nobody turns is just a diagram.
- Alert on confidence-interval bounds, not single readings.
- Once a quarter, list evals that haven't failed in a long time and decide: keep, run less often, or retire.

## Provenance & caveats
Sources (retrieved 2026-09-26): FAQ *How are evaluations used differently in CI/CD vs monitoring
production?* (2025-06-29, mod. 2026-09-01) — CI composition, reference-free production judges, confidence
intervals, "add representative examples to your CI dataset"; FAQ *What should I do when my gold eval dataset
becomes stale?* and *How often should I re-run error analysis?* — cadence, retirement, cost-vs-value; Hamel
Husain 2024 — "continuously update [unit tests] based on new failures", no need for a 100% pass rate.
- ❓ Practitioner methodology; the 100+, 2–4 week and 10–20/week figures are the authors' heuristics.
- ⚠️ Two paywalled pieces (Lenny's *Building eval systems…* phase 3 "operationalizing", and *Advanced evals*) likely cover this in more depth; only their visible parts were used.

## Connections
- **builds-on [Offline vs online evals](offline-vs-online-evals.md)**: this is the flywheel's mechanics.
- **used-with [Error analysis on traces](error-analysis-on-traces.md)**: each cycle is fresh error analysis.
- **used-with [A test that crashed is not a test that failed](crashed-is-not-failed.md)**: alerts must mean something.
- **used-with [Don't copy, derive](dont-copy-derive.md)**: a stale gold set is a drifted copy.
