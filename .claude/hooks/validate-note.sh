#!/usr/bin/env bash
# PostToolUse(Write|Edit) hook — validate AI Knowledge Center notes.
#
# Two jobs:
#   1. Frontmatter completeness: every note in knowledge/notes/ has the required keys.
#   2. ANTI-SILO guard: a `kind: concept` note must declare >=1 connection. A note that
#      connects to nothing is the silo failure mode this whole repo exists to prevent.
#
# Only touches knowledge/notes/*.md; silent (exit 0) for everything else.
# On a problem it exits 2 so the message is surfaced back to Claude to fix.
#
# NOTE: the hook JSON is passed to python via the HOOK_JSON env var — NOT stdin —
# because `python3 - <<'PY'` already consumes stdin for the heredoc script.

input=$(cat)
HOOK_JSON="$input" python3 - <<'PY'
import os, sys, json, re

try:
    data = json.loads(os.environ.get("HOOK_JSON", ""))
except Exception:
    sys.exit(0)

path = (data.get("tool_input") or {}).get("file_path", "") or ""
if "/knowledge/notes/" not in path or not path.endswith(".md"):
    sys.exit(0)
if not os.path.isfile(path):
    sys.exit(0)

text = open(path, encoding="utf-8").read()

errors = []
if not text.startswith("---"):
    errors.append("missing YAML frontmatter (the note must start with a --- block)")
    fm = ""
else:
    end = text.find("\n---", 3)
    fm = text[3:end] if end != -1 else ""
    if end == -1:
        errors.append("frontmatter block is not closed with ---")

if fm:
    for key in ("title", "slug", "kind", "spine_layer", "tags", "date", "depth"):
        if not re.search(r"(?m)^%s:" % key, fm):
            errors.append("missing required frontmatter key `%s:`" % key)

    valid_layers = {"foundations", "api", "agent-sdk", "claude-code", "patterns", "products"}
    layer = re.search(r"(?m)^spine_layer:\s*([A-Za-z\-]+)", fm)
    if layer and layer.group(1) not in valid_layers:
        errors.append("spine_layer `%s` is not one of: %s" % (layer.group(1), ", ".join(sorted(valid_layers))))

    kind = re.search(r"(?m)^kind:\s*([A-Za-z\-]+)", fm)
    kind = kind.group(1) if kind else "concept"
    has_conn = re.search(r"(?m)^connections:\s*\n\s*-\s", fm)
    if kind == "concept" and not has_conn:
        errors.append(
            "ANTI-SILO: a `kind: concept` note needs >=1 `connections:` entry. "
            "A note that connects to nothing is a silo — wire it to the graph "
            "(builds-on / enables / part-of / used-with / alternative-to / contrasts-with)."
        )

if errors:
    sys.stderr.write("Knowledge-note validation failed for %s:\n" % os.path.basename(path))
    for e in errors:
        sys.stderr.write("  - %s\n" % e)
    sys.stderr.write("Fix the frontmatter so the note stays connected and findable.\n")
    sys.exit(2)

sys.exit(0)
PY
