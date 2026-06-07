---
title: Permissions & auth (SDK)
slug: sdk-permissions
kind: primitive
layer: agent-sdk
summary: The SDK's controls over what an agent is allowed to do — which tools it can call, what needs approval, and how it authenticates. The boundary that makes an autonomous agent safe to run.
edges:
  - { to: agent-sdk, type: part-of, why: "Permission and auth handling are built into the SDK runtime." }
sources: [claude-agent-sdk]
---
Autonomy without a permission boundary is how agents do damage. Decide up front what is auto-allowed, what prompts, and what is forbidden.
