---
title: Permissions & auth (SDK)
slug: sdk-permissions
kind: primitive
layer: agent-sdk
summary: The SDK's controls over what tools an agent may use and what needs approval — permission modes, allow/deny rules, and the canUseTool callback for everything else. The boundary that makes an autonomous agent safe to run. (Authentication is configured separately.)
edges:
  - { to: agent-sdk, type: part-of, why: "Permission and auth handling are built into the SDK runtime." }
sources: [claude-agent-sdk]
---
Autonomy without a permission boundary is how agents do damage. Decide up front what is auto-allowed, what prompts, and what is forbidden.
