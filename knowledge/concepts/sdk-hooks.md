---
title: Hooks (SDK)
slug: sdk-hooks
kind: primitive
layer: agent-sdk
summary: Deterministic callbacks the SDK fires around model and tool events — before a tool runs, after a turn, on completion — so you can inject guards, logging, or policy that doesn't depend on the model choosing to comply.
edges:
  - { to: agent-sdk, type: part-of, why: "Hooks are an extension point of the SDK runtime." }
sources: [claude-agent-sdk]
---
Hooks are harness engineering made concrete: anything that must always happen belongs in a hook, not in a prompt instruction the model might ignore.
