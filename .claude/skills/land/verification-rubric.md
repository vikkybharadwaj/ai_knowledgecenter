# Verification rubric — the source-of-truth gate

This vault is Vikram's **single source of truth**: once something lands, he won't re-check it against
official Claude Code docs or the original article. So every land must pass an **adversarial
verification** pass — performed by a *checker* separate from the *author* (the maker/checker split),
against the externalized criteria below. A note fails the gate if **any** ❌ criterion is unmet; ⚠️
items must be surfaced in the note, not silently passed.

This is the same checklist a per-PR reviewer (`knowledge-fact-checker` subagent) runs on the diff.

## Criteria

1. **Terminology fidelity (❌ blocking).** Every product/feature name maps to the *official* Claude
   Code / Anthropic term. Source synonyms are corrected — official term primary, the source's looser
   word in parentheses. *Example caught: a source's "connectors" → **MCP servers**; "agent teams" is
   not a synonym for "subagents".*

2. **Claim provenance (❌ blocking).** Every factual claim about a Claude/Anthropic capability is
   tagged so it can't inherit the source's authority unverified:
   - ✅ **verified** against official docs (name the doc),
   - ⚠️ **partial / needs nuance** (state the nuance),
   - ❓ **author's claim / unverified** (mark as opinion or out-of-scope),
   - ❌ **corrected** (what the source got wrong + the fix).

3. **Official-doc check, not memory (❌ blocking).** Claude/Anthropic claims are verified against
   `code.claude.com/docs` / `docs.claude.com` via the **claude-code-guide** agent (or **claude-api**
   skill / WebFetch) — never from model memory. Cite the doc.

4. **Datestamp + maturity (⚠️).** Anything with a shelf life (models, prices, previews, "ships
   today", feature-parity claims) carries a `retrieved:` date and a preview-vs-GA flag.

5. **Scope honesty (❌ blocking).** Non-Claude claims (Codex, other tools/vendors) are clearly marked
   out-of-scope / unverified — never laundered into fact alongside verified Claude claims.

6. **No fabrication (❌ blocking).** No invented flags, file paths, commands, or features. If a
   flag/command can't be confirmed in docs, it is flagged — not asserted.

7. **Connection truth (⚠️).** Each typed connection's `why` actually holds, and the type is the most
   specific correct one. A wrong edge corrupts the mental model as much as a wrong fact.

8. **Internal consistency (❌ blocking).** The note must not silently contradict an existing note or
   concept. If it does, surface the conflict and reconcile it — the source of truth can't hold two
   conflicting claims.

9. **No copyright dump (❌ blocking).** Summarized + cited, never pasted full text.

10. **Build integrity (❌ blocking).** `python3 scripts/build-index.py` reports **0 dropped edges**,
    **no orphan concepts**, and every `sources:`/`to:` slug resolves.

## How to run the check
- **At land-time:** the `/land` skill performs this pass before writing (Step 2.5). The author drafts;
  the checker verdict is captured by tagging claims (criterion 2) and applying corrections in-note.
- **On a PR:** invoke the `knowledge-fact-checker` subagent on the diff; it returns a per-criterion
  verdict and the specific lines to fix. Treat unresolved ❌ as merge-blocking.
