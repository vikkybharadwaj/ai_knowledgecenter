---
title: Subagents (SDK)
slug: sdk-subagents
kind: primitive
layer: agent-sdk
summary: Spawning a fresh agent with its own context to handle a scoped task and report back a result. The SDK primitive that makes fan-out, isolation, and multi-agent orchestration possible.
edges:
  - { to: agent-sdk, type: part-of, why: "Subagents are an SDK capability for delegating work." }
  - { to: sdk-sessions, type: uses, why: "Each subagent runs in its own session/context." }
sources: [claude-agent-sdk, claude-code-multi-agent-development]
---
A subagent trades shared context for a clean slate — you give it a task and get back a conclusion, not the whole transcript. This is the building block under every orchestration pattern.
