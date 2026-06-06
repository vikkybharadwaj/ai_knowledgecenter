#!/usr/bin/env bash
# auto-ship.sh — Stop hook. When the working tree on `main` has changes,
# branch → (rebuild index) → commit → push → open PR → squash-merge → cleanup.
# No-ops on a clean tree, off main, or mid-rebase/merge. Never blocks the turn.
set -uo pipefail

emit() { printf '{"systemMessage": %s, "suppressOutput": true}\n' "$(printf '%s' "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"; }

REPO="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
cd "$REPO" 2>/dev/null || exit 0

git rev-parse --git-dir >/dev/null 2>&1 || exit 0
gd="$(git rev-parse --git-dir)"
if [ -d "$gd/rebase-merge" ] || [ -d "$gd/rebase-apply" ] || [ -f "$gd/MERGE_HEAD" ]; then exit 0; fi

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
[ "$branch" = "main" ] || exit 0
[ -n "$(git status --porcelain)" ] || exit 0

if git status --porcelain | grep -qE ' knowledge/(notes|maps)/' && [ -f scripts/build-index.py ]; then
  python3 scripts/build-index.py >/dev/null 2>&1 || true
fi

ts="$(date +%Y%m%d-%H%M%S)"
ship_branch="auto/ship-$ts"
files="$(git status --porcelain | sed 's/^...//' | sed 's/^"\(.*\)"$/\1/')"
count="$(printf '%s\n' "$files" | sed '/^$/d' | wc -l | tr -d ' ')"
title="docs: auto-ship ${count} file(s) — ${ts}"
body="$(printf 'Automated ship of working-tree changes.\n\nFiles:\n%s\n' "$(printf '%s\n' "$files" | sed 's/^/- /')")"

fail() { emit "auto-ship: $1"; git checkout main >/dev/null 2>&1 || true; exit 0; }

git checkout -b "$ship_branch" >/dev/null 2>&1 || fail "could not create branch $ship_branch"
git add -A >/dev/null 2>&1
git commit -m "$title" >/dev/null 2>&1 || fail "nothing to commit"
git push -u origin "$ship_branch" >/dev/null 2>&1 || fail "push failed for $ship_branch"
pr_url="$(gh pr create --base main --head "$ship_branch" --title "$title" --body "$body" 2>&1)" || fail "gh pr create failed: $pr_url"
merge_out="$(gh pr merge "$ship_branch" --squash --delete-branch 2>&1)" || fail "gh pr merge failed: $merge_out"

git checkout main >/dev/null 2>&1 || true
git pull --ff-only origin main >/dev/null 2>&1 || true
git branch -D "$ship_branch" >/dev/null 2>&1 || true
emit "🚀 auto-shipped & merged: ${pr_url} (${count} file(s))"
exit 0
