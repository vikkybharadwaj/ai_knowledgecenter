---
title: Model tiers — Opus · Sonnet · Haiku
slug: model-tiers
kind: primitive
layer: api
summary: The three-tier family that trades capability against speed and cost — Opus for the hardest reasoning, Sonnet for the balanced default, Haiku for fast cheap high-volume work. Choosing the tier is a first-class design decision.
sources: [claude-api-agent-primitives]
---
Good harnesses route by difficulty: Haiku for mechanical sub-steps, Sonnet for most work, Opus for the genuinely hard call. Tier choice is one of the biggest cost/quality levers in the whole stack. Current lineup (2026-06-07): **Opus 4.8** (`claude-opus-4-8`, ~$5/$25 per MTok, 1M context), **Sonnet 4.6** (`claude-sonnet-4-6`, ~$3/$15, 1M context), **Haiku 4.5** (`claude-haiku-4-5`, ~$1/$5, 200K context).
