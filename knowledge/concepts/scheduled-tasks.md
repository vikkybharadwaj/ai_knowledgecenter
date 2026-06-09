---
title: Scheduled tasks (/loop)
slug: scheduled-tasks
kind: primitive
layer: claude-code
summary: In-session, clock-driven repetition. The /loop bundled skill re-runs a prompt on an interval (or a Claude-chosen delay), converting it to a cron expression via the CronCreate/CronList/CronDelete tools. Session-scoped and local — it fires between turns of an open session, inherits its permissions, and expires 7 days after creation.
edges:
  - { to: claude-code, type: part-of, why: "Scheduled tasks are a Claude Code session feature; the cron tools are its internal scheduling API." }
  - { to: skills, type: part-of, why: "/loop is a bundled skill — the same invocation surface as any other slash command." }
  - { to: routines, type: alternative-to, why: "Same 'repeat on a clock' need; /loop is local and needs the session open, a routine runs unattended in the cloud." }
sources: [automation-control-flow-spectrum, loop-is-cron-plus-a-decision-maker, designing-loops-not-prompts]
---
Use it to poll a deploy, babysit a PR, or check a long build during development. It feels like cron because it uses cron syntax under the hood — but it runs a model that decides what to do each tick, fires only while the session is open and idle, and self-deletes after 7 days. For durable, laptop-closed scheduling, graduate to a routine.
