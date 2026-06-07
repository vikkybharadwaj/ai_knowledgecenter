---
title: Batch API
slug: batch-api
kind: primitive
layer: api
summary: Submitting many independent requests as one asynchronous job at a large discount, for work that doesn't need an immediate answer. The right tool for offline evals, bulk extraction, and dataset generation.
edges:
  - { to: messages-api, type: depends-on, why: "A batch is a queue of ordinary Messages API calls run asynchronously." }
sources: [claude-api-agent-primitives]
---
When throughput matters more than latency, batching trades a few hours of wait for a steep price cut — ideal for grading an eval suite or processing a backlog.
