#!/usr/bin/env python3
"""Regenerate the change log on docs/changelog.html from git history.

Every commit that lands a pull request (squash-merged with a trailing "(#NN)",
which is how this repo ships) becomes one dated entry: when it landed, a short
title, the change description, and links to the exact PR + commit diff on GitHub.

This is what makes "every new PR creates a changelog entry" automatic — the
GitHub Action (.github/workflows/changelog.yml) runs it on every push to main.

Usage:  python3 scripts/build-changelog.py
Idempotent: rewrites only the region between the CHANGELOG markers.
"""
from __future__ import annotations

import html
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "docs" / "changelog.html"
START = "<!-- CHANGELOG:START -->"
END = "<!-- CHANGELOG:END -->"
MAX_ENTRIES = 200

# kebab record/field separators that won't appear in commit text
RS, FS = "\x1e", "\x1f"

# conventional-commit type -> human label for the little pill tag
TYPE_LABELS = {
    "feat": "Feature",
    "fix": "Fix",
    "docs": "Docs",
    "chore": "Chore",
    "refactor": "Refactor",
    "style": "Style",
    "test": "Test",
    "perf": "Perf",
}

PR_RE = re.compile(r"\(#(\d+)\)\s*$")
CONV_RE = re.compile(r"^(?P<type>\w+)(?:\([^)]*\))?(?P<bang>!)?:\s*(?P<rest>.+)$")


def repo_url() -> str:
    """Canonical https URL for the origin remote (no .git suffix)."""
    try:
        url = subprocess.check_output(
            ["git", "config", "--get", "remote.origin.url"], cwd=ROOT, text=True
        ).strip()
    except subprocess.CalledProcessError:
        return "https://github.com/vikkybharadwaj/ai_knowledgecenter"
    if url.startswith("git@"):  # git@github.com:owner/repo.git
        url = "https://" + url[len("git@"):].replace(":", "/", 1)
    return url[:-4] if url.endswith(".git") else url


def git_log():
    fmt = f"%H{FS}%cd{FS}%s{FS}%b{RS}"
    out = subprocess.check_output(
        ["git", "log", "--date=format:%Y-%m-%d · %H:%M", f"--pretty=format:{fmt}"],
        cwd=ROOT,
        text=True,
    )
    for record in out.split(RS):
        record = record.strip("\n")
        if not record.strip():
            continue
        parts = record.split(FS)
        if len(parts) < 4:
            parts += [""] * (4 - len(parts))
        sha, when, subject, body = parts[0], parts[1], parts[2], parts[3]
        yield sha.strip(), when.strip(), subject.strip(), body.strip()


def parse_entry(sha, when, subject, body):
    m = PR_RE.search(subject)
    if not m:
        return None  # only PR-numbered commits make the log
    pr = m.group(1)
    clean = PR_RE.sub("", subject).strip()

    tag = None
    conv = CONV_RE.match(clean)
    if conv:
        tag = TYPE_LABELS.get(conv.group("type").lower())
        title = conv.group("rest").strip()
        if conv.group("bang"):
            tag = (tag or conv.group("type")) + " ⚠"
    else:
        title = clean

    # description: first non-empty paragraph of the body, trailers stripped
    desc = ""
    for para in body.split("\n\n"):
        para = " ".join(line.strip() for line in para.splitlines() if line.strip())
        para = re.sub(r"^[*\-]\s+", "", para)  # drop a leading markdown bullet
        if not para:
            continue
        if re.match(r"^(Co-authored-by|Signed-off-by|Reviewed-by):", para, re.I):
            continue
        desc = para
        break

    # skip a description that just restates the title (common in squashed PRs)
    norm = lambda s: re.sub(r"[^a-z0-9]+", "", CONV_RE.sub(r"\g<rest>", s.lower()))
    if desc and norm(desc) == norm(title):
        desc = ""
    return {"sha": sha, "when": when, "title": title, "tag": tag, "desc": desc, "pr": pr}


def render(entries, base):
    if not entries:
        return (
            '  <li class="cl-entry"><p class="cl-empty">No entries yet — the next '
            "merged pull request will appear here.</p></li>"
        )
    rows = []
    for e in entries:
        tag = f'<span class="cl-tag">{html.escape(e["tag"])}</span>' if e["tag"] else ""
        desc = (
            f'    <p class="cl-desc">{html.escape(e["desc"])}</p>\n' if e["desc"] else ""
        )
        pr_url = f"{base}/pull/{e['pr']}"
        commit_url = f"{base}/commit/{e['sha']}"
        rows.append(
            f'  <li class="cl-entry">\n'
            f'    <div class="cl-when">{html.escape(e["when"])}</div>\n'
            f'    <div class="cl-title">{html.escape(e["title"])}{tag}</div>\n'
            f"{desc}"
            f'    <div class="cl-links">'
            f'<a href="{pr_url}" target="_blank" rel="noopener">PR #{e["pr"]} →</a>'
            f'<a href="{commit_url}" target="_blank" rel="noopener">View diff</a>'
            f"</div>\n"
            f"  </li>"
        )
    return "\n".join(rows)


def main():
    if not PAGE.exists():
        print(f"error: {PAGE} not found", file=sys.stderr)
        return 1
    base = repo_url()
    entries = []
    seen = set()
    for sha, when, subject, body in git_log():
        e = parse_entry(sha, when, subject, body)
        if e and e["pr"] not in seen:  # newest commit per PR wins
            seen.add(e["pr"])
            entries.append(e)
        if len(entries) >= MAX_ENTRIES:
            break

    block = render(entries, base)
    text = PAGE.read_text(encoding="utf-8")
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.S)
    if not pattern.search(text):
        print("error: CHANGELOG markers not found in changelog.html", file=sys.stderr)
        return 1
    new = pattern.sub(f"{START}\n{block}\n  {END}", text)
    if new != text:
        PAGE.write_text(new, encoding="utf-8")
        print(f"updated changelog: {len(entries)} entr{'y' if len(entries)==1 else 'ies'}")
    else:
        print("changelog already up to date")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
