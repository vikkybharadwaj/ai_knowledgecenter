# Patterns

**Portable, reusable assets meant to be copied into other AI product repos.** This
is the "flows out" half of the knowledge center — if `knowledge/` is what I *know*,
`patterns/` is what I can *reuse*.

| Subdir | What lives here |
|--------|-----------------|
| [`prompts/`](prompts/) | Reusable system/user prompts and prompt fragments |
| [`snippets/`](snippets/) | Drop-in code (client setup, retry/backoff, streaming, tool loops) |
| [`configs/`](configs/) | Reusable config (eval configs, model config, harness settings) |
| [`templates/`](templates/) | Scaffolds to copy whole (eval harness, CLAUDE.md, agent skeleton) |

## Every pattern carries a header
So it's safe to lift into another repo. At the top of each file (or its README):

```
# <name>
What: <one line>
Source: <where it came from — article, repo, experiment>
Assumes: <model / SDK / version assumptions>
Caveats: <gotchas, things to change before reuse>
Last verified: <YYYY-MM-DD>
```

## Reuse etiquette
- Prefer **copying** into the target repo over symlinking — patterns drift, and the
  target repo should own its copy.
- When you copy one out, leave a comment in the target pointing back here.
- When you improve a copy in a product repo, fold the improvement back here.
