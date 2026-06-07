---
title: Context Window
slug: context-window
kind: concept
layer: foundations
summary: The model's working memory — the finite token budget that holds the prompt, tools, history, and retrieved context for a single turn. It is the scarce resource every higher primitive is ultimately managing.
sources: [harness-vs-context-engineering, prompt-context-harness-engineering]
---
Everything above — caching, sessions, subagent isolation, CLAUDE.md structure — exists to spend this budget well. When a primitive confuses you, ask "what is it doing to the context window?" and its purpose usually snaps into focus.
