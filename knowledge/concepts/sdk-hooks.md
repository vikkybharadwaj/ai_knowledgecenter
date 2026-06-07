---
title: Hooks (SDK)
slug: sdk-hooks
kind: primitive
layer: agent-sdk
summary: Callbacks the SDK fires at fixed points in the agent lifecycle — tool calls, session start/stop, subagent and prompt events, compaction — so you can allow, deny, modify, or log behavior without depending on the model choosing to comply.
edges:
  - { to: agent-sdk, type: part-of, why: "Hooks are an extension point of the SDK runtime." }
sources: [claude-agent-sdk]
---
Hooks are harness engineering made concrete: anything that must always happen belongs in a hook, not in a prompt instruction the model might ignore.
