---
title: Sessions (SDK)
slug: sdk-sessions
kind: primitive
layer: agent-sdk
summary: The SDK's unit of a continuing conversation — it carries message history, tool state, and context across turns so an agent can run a long task without you re-threading state by hand.
edges:
  - { to: agent-sdk, type: part-of, why: "Sessions are the SDK's core stateful abstraction." }
  - { to: context-window, type: depends-on, why: "A session is, in effect, managed context-window state over time." }
sources: [claude-agent-sdk]
---
A session is where memory lives between turns. Most "the agent forgot" problems are really session/context-management problems.
