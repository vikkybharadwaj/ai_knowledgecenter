---
title: Plugins (and marketplaces)
slug: plugins
kind: primitive
layer: claude-code
summary: The packaging layer of Claude Code — a plugin bundles skills, hooks, subagents, and MCP servers into one installable unit, distributed through marketplaces. How you share and reuse a whole extension setup instead of wiring each piece by hand.
edges:
  - { to: claude-code, type: part-of, why: "Plugins are Claude Code's packaging/distribution mechanism." }
  - { to: skills, type: used-with, why: "A plugin can bundle skills." }
  - { to: cc-hooks, type: used-with, why: "A plugin can bundle hooks." }
  - { to: cc-subagents, type: used-with, why: "A plugin can bundle subagents." }
  - { to: cc-mcp-servers, type: used-with, why: "A plugin can bundle MCP server configs." }
sources: []
---
Plugins are the "install once, get the whole setup" layer that sits above the individual extension primitives — the natural unit for a team or a community to ship a curated Claude Code configuration. Docs: https://code.claude.com/docs/en/plugins
