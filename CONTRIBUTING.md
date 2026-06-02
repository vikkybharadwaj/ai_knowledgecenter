# How to add knowledge

Light conventions so the collection stays findable as it grows. (See `CLAUDE.md`
for the same rules from Claude's perspective.)

## The four homes for new content

1. **Read something worth keeping?** → `articles/`
   - Copy `articles/_TEMPLATE.md` → `articles/YYYY-MM-DD-short-slug.md`.
   - Summarize in your own words, capture the 3–5 takeaways, link the source.
   - Add a one-line pointer to `articles/README.md`.

2. **Learned something durable / understand a topic better?** → `knowledge/<NN-topic>/`
   - Put it in the right category (see `knowledge/README.md`).
   - Plain language, your own words, explain *why* and *when to use*.
   - Cross-link to the article(s) it came from and related knowledge files.

3. **Built something reusable?** → `patterns/`
   - Prompts → `patterns/prompts/`, code → `patterns/snippets/`,
     configs → `patterns/configs/`, scaffolds → `patterns/templates/`.
   - Add a header: what it is, source, model/SDK assumptions, caveats.
   - This is the stuff meant to be **copied into other repos** — keep it portable.

4. **Hit a non-obvious gotcha?** → `LEARNINGS.md`
   - One dated line at the top. Link out for depth if needed.

## Naming & formatting
- Markdown for everything except actual code/config assets.
- Article files: `YYYY-MM-DD-short-slug.md`.
- Datestamp anything with a shelf life (models, prices, benchmarks).
- Keep the nearest `README.md` index updated when you add a file.

## What NOT to add
- Secrets, API keys, credentials.
- Employer-confidential or proprietary material.
- Full copyrighted text — summarize and link instead.
