---
title: Buy-vs-build (the four-altitude decision)
slug: buy-vs-build
kind: pattern
layer: patterns
summary: The decision of how much harness to own — buy a product, use Claude Code, configure the SDK, or build on the raw API. Pick the highest altitude that still meets the requirement, and drop only when forced.
edges:
  - { to: claude-code, type: uses, why: "'Use Claude Code as-is' is the default altitude." }
  - { to: agent-sdk, type: uses, why: "'Configure your own harness' drops to the SDK." }
  - { to: messages-api, type: uses, why: "'Build from scratch' drops all the way to the raw API." }
sources: [claude-code-vs-build-your-own, harness-engineering-discipline]
---
Most teams build too low. Start at the top — can a product or Claude Code do it? — and only descend a floor when a hard constraint makes you. Each floor down multiplies the harness you now own.
