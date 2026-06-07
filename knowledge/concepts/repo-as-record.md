---
title: Repository as system-of-record
slug: repo-as-record
kind: pattern
layer: patterns
summary: Treat the repository as the agent's only durable memory — code, docs, and decisions committed so state survives across sessions and agents. If it isn't in the repo, it didn't happen.
edges:
  - { to: context-engineering, type: depends-on, why: "The repo is curated context that persists between runs." }
sources: [repository-as-system-of-record]
---
Agents forget everything between sessions; the repo is what they remember. Write decisions and learnings into tracked files so the next run — human or agent — starts from truth, not from scratch.
