---
title: Routines (cloud)
slug: routines
kind: primitive
layer: claude-code
summary: A saved Claude Code config — prompt + repos + connectors — that runs unattended on Anthropic-managed cloud infrastructure on a schedule, a GitHub event, or an API call. The "set it and forget it, laptop closed" tier. Runs autonomously with no permission prompts, so its reach is scoped by the repos and connectors you attach.
edges:
  - { to: claude-code, type: part-of, why: "Routines are the unattended-cloud member of the Claude Code primitive set (Claude Code on the web)." }
  - { to: cc-mcp-servers, type: uses, why: "A routine bundles connectors/MCP servers into its saved config so the cloud run can reach external systems." }
sources: [claude-code-routines, automation-control-flow-spectrum, loop-is-cron-plus-a-decision-maker]
---
Interactive Claude Code keeps you in the loop approving as you go; a routine freezes the plan and tools into a saved config that a trigger pulls off the shelf and runs in the cloud. The unit of value moves from a session you drive to a standing order that runs itself. It's the durable cousin of the session-scoped `/loop` — reach for it when work must run with your machine off.
