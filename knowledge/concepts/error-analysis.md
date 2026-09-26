---
title: Error analysis
slug: error-analysis
kind: pattern
layer: patterns
summary: Reading real (or synthetic) traces, writing a plain note on what went wrong in each, then grouping and counting those notes into a small taxonomy of failure modes. It decides which evals to build, which is why practitioners call it the most important activity in evals.
edges:
  - { to: evals-reliability, type: part-of, why: "It's the discovery step of the eval practice — everything else measures what error analysis found." }
  - { to: llm-as-judge, type: used-with, why: "Its failure taxonomy says which judges to build, and its human labels are the ground truth that aligns them." }
sources: [error-analysis-on-traces, synthetic-scenarios-before-launch, production-to-eval-flywheel, dimensions-vs-slices, whose-fault-is-the-failure]
---
Open coding (free-text notes, first upstream failure only), then axial coding (under ~10 named, counted failure modes), repeated until new traces stop adding new failures. Humans lead — criteria only emerge from seeing failures — and AI assists with clustering and search once ~30 traces are annotated. Re-run it every 2–4 weeks and on every significant change, so the eval suite follows the product.
