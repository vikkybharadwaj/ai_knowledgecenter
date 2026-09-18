---
title: LLM-as-judge
slug: llm-as-judge
kind: pattern
layer: patterns
summary: Using a second model call to grade an AI answer against written rules (a rubric) or against a reference answer. It's the grader that can read meaning, which word checks can't, but it's blind to anything it isn't shown, and it's only trustworthy once people have checked it.
edges:
  - { to: evals-reliability, type: part-of, why: "It's one of the three grader kinds an eval suite is built from, alongside code checks and human review." }
  - { to: messages-api, type: runs-on, why: "A judge is just another model request: the answer (plus rubric, conversation and data) goes in, a verdict comes out." }
  - { to: adversarial-verification, type: used-with, why: "Both put the verdict in a separate checker instead of the maker, and both inherit the checker's blind spots." }
sources: [three-kinds-of-grader, offline-vs-online-evals, word-checks-cant-read-meaning]
---
Two flavours, with different reach. A **rubric judge** grades against a *standard*, so it works on live production traffic where nobody knows the right answer. A **reference judge** grades against a *model answer*, so it only works on frozen test cases. Anthropic's eval guide recommends a different model for grading than the one being graded. Give the judge everything it needs to judge (the whole conversation, and the data if accuracy matters), and have a person grade a sample to check the judge itself.
