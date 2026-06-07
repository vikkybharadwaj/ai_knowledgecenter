---
title: Harness Engineering
slug: harness-engineering
kind: concept
layer: foundations
summary: Building the deterministic code around the model — the loops, tools, validators, and retries — so reliability lives outside the weights. The third lever, the highest-leverage, and the most neglected.
edges:
  - { to: three-levels-of-engineering, type: part-of, why: "The third of the three levers." }
  - { to: agent-harness, type: uses, why: "Harness engineering is the practice of building the agent harness." }
sources: [harness-engineering-discipline, prompt-context-harness-engineering]
---
The model is a probabilistic component; the harness is where you make the system as a whole dependable. Externalized completion, adversarial verification, and loop-until-done are all harness moves.
