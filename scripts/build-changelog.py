#!/usr/bin/env python3
"""Regenerate the change log on docs/changelog.html from git history.

Every commit that lands a pull request (squash-merged with a trailing "(#NN)",
which is how this repo ships) becomes one entry, grouped under the day it landed.
Entries read like the Claude Code changelog (https://code.claude.com/docs/en/changelog):
a plain-English, verb-led sentence ("Added…", "Renamed…", "Fixed…"), with a
collapsible list of the exact files that changed — each linking to that file's
diff on GitHub — plus a link to the PR.

This is what makes "every new PR creates a changelog entry" automatic — the
GitHub Action (.github/workflows/changelog.yml) runs it on every push to main.

Usage:  python3 scripts/build-changelog.py
Idempotent: rewrites only the region between the CHANGELOG markers.
"""
from __future__ import annotations

import hashlib
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
    "feat": "New",
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

MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

# Lead the bullet with a past-tense verb, the way the Claude Code changelog does.
# The repo's commit subjects are imperative ("rename …", "add …"); map the common
# leading verbs to past tense. Anything not listed just gets sentence-capitalised.
PAST_TENSE = {
    "add": "Added", "added": "Added", "land": "Added", "introduce": "Added",
    "create": "Added", "surface": "Surfaced", "give": "Gave", "make": "Made",
    "rename": "Renamed", "relabel": "Relabeled", "retitle": "Retitled",
    "fix": "Fixed", "repair": "Fixed", "restore": "Restored", "correct": "Corrected",
    "move": "Moved", "remove": "Removed", "drop": "Dropped", "delete": "Deleted",
    "strip": "Stripped", "trim": "Trimmed", "reduce": "Reduced",
    "reorder": "Reordered", "reorganize": "Reorganized", "reorganise": "Reorganized",
    "simplify": "Simplified", "tidy": "Tidied up", "clean": "Cleaned up",
    "refactor": "Refactored", "rework": "Reworked", "redesign": "Redesigned",
    "frame": "Reframed", "reframe": "Reframed", "keep": "Kept", "hide": "Hid",
    "show": "Showed", "replace": "Replaced", "update": "Updated", "improve": "Improved",
    "build": "Built", "render": "Fixed", "switch": "Switched", "split": "Split",
    "merge": "Merged", "wire": "Wired up", "link": "Linked", "connect": "Connected",
    "ship": "Shipped", "publish": "Published", "enable": "Enabled", "support": "Added",
}


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
        ["git", "log", "--date=format:%Y-%m-%d", f"--pretty=format:{fmt}"],
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


def changed_files(sha):
    """[(status, path)] for a commit. status in A/M/D/R; renames yield the new path."""
    out = subprocess.check_output(
        ["git", "diff-tree", "--no-commit-id", "--name-status", "-r", "--root", sha],
        cwd=ROOT,
        text=True,
    )
    files = []
    for line in out.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        files.append((parts[0][0], parts[-1]))  # collapse R100 -> R; dest path last
    return files


def diff_anchor(path):
    """GitHub anchors a file's diff on a commit page as diff-<sha256(path)>."""
    return "diff-" + hashlib.sha256(path.encode("utf-8")).hexdigest()


STATUS_WORD = {"A": "new", "M": "edit", "D": "removed", "R": "renamed"}

# files that aren't user-facing pages — shown in the file list, but never used to
# build the plain-English title.
_NON_PAGE = re.compile(
    r"(^\.|/assets/|/\.|^scripts/|^LEARNINGS\.md$|^README\.md$|\.css$|\.js$|\.sh$|\.json$|\.ya?ml$)"
)

# concept pages whose filename isn't self-explanatory -> friendly name
_CONCEPT_NAMES = {
    "index": "Concepts hub",
    "mental-model": "Mental model",
    "matrix": "comparison matrix",
    "decision": "decision guide",
    "graph": "concept graph",
    "legend": "legend",
    "primitives": "Primitives index",
    "exam": "exam hub",
    "practice": "practice quiz",
    "scenarios": "scenarios",
}


# tokens that should keep their canonical casing inside a humanised slug
_PROPER = {
    "claude": "Claude", "anthropic": "Anthropic", "mcp": "MCP", "api": "API",
    "sdk": "SDK", "cca": "CCA", "ai": "AI", "html": "HTML", "css": "CSS",
}


def _nice_slug(slug):
    words = slug.replace("-", " ").replace("_", " ").strip().split()
    return " ".join(_PROPER.get(w.lower(), w) for w in words)


def friendly_label(path):
    """Human name for a user-facing page/note, or None if it's not one."""
    if _NON_PAGE.search(path):
        return None
    if path == "docs/index.html":
        return "home page"
    if path == "docs/changelog.html":
        return "change log"
    m = re.match(r"docs/concepts/primitives/([\w-]+)\.html$", path)
    if m:
        return f"{_nice_slug(m.group(1))} primitive"
    m = re.match(r"docs/concepts/([\w-]+)\.html$", path)
    if m:
        return _CONCEPT_NAMES.get(m.group(1), _nice_slug(m.group(1)))
    m = re.match(r"knowledge/notes/([\w-]+)\.md$", path)
    if m:
        return f"{_nice_slug(m.group(1))} note"
    if path == "knowledge/maps/big-picture.md":
        return "big-picture map"
    m = re.match(r"knowledge/maps/([\w-]+)\.md$", path)
    if m:
        return f"{_nice_slug(m.group(1))} map"
    return None


def _join(names):
    names = list(names)
    if len(names) <= 2:
        return " and ".join(names)
    return ", ".join(names[:-1]) + ", and " + names[-1]


def _summarize(names, noun):
    """Up to 3 names spelled out, otherwise a count ('5 pages')."""
    if len(names) <= 3:
        return _join(names)
    return f"{len(names)} {noun}"


AUTOSHIP_RE = re.compile(r"^auto-ship\s+\d+\s+file\(s\)", re.I)


def humanize(title, files):
    """Turn a machine 'auto-ship N file(s) — TIMESTAMP' title into plain English
    derived from the pages it touched. Hand-written titles fall through to
    past-tense verb leading."""
    if not AUTOSHIP_RE.match(title):
        return sentence(title)
    added = [n for n in (friendly_label(p) for s, p in files if s == "A") if n]
    edited = [n for n in (friendly_label(p) for s, p in files if s in ("M", "R")) if n]
    clauses = []
    if added:
        clauses.append("Added " + _join(added))
    if edited:
        clauses.append(("updated " if added else "Updated ") + _summarize(edited, "pages"))
    if not clauses:
        return "Published site and tooling updates"  # only non-page files changed
    return "; ".join(clauses)


def sentence(title):
    """Past-tense, verb-led, capitalised — Claude-Code-changelog voice."""
    title = title.strip()
    if not title:
        return title
    m = re.match(r"([A-Za-z]+)(\b.*)$", title)
    if m:
        verb = PAST_TENSE.get(m.group(1).lower())
        if verb:
            return verb + m.group(2)
    return title[0].upper() + title[1:]


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

    files = changed_files(sha)
    title = humanize(title, files)

    # skip a description that just restates the title (common in squashed PRs)
    norm = lambda s: re.sub(r"[^a-z0-9]+", "", CONV_RE.sub(r"\g<rest>", s.lower()))
    if desc and norm(desc) == norm(title):
        desc = ""

    return {
        "sha": sha,
        "date": when,
        "title": title,
        "tag": tag,
        "desc": desc,
        "pr": pr,
        "files": files,
    }


def pretty_date(iso):
    """'2026-06-06' -> 'June 6, 2026'."""
    try:
        y, m, d = (int(x) for x in iso.split("-"))
        return f"{MONTHS[m - 1]} {d}, {y}"
    except (ValueError, IndexError):
        return iso


def render_files(e, base):
    """Collapsible file list — each file links to its own diff inside the commit."""
    files = e.get("files") or []
    if not files:
        return ""
    items = []
    for status, path in files:
        word = STATUS_WORD.get(status, "edit")
        url = f"{base}/commit/{e['sha']}#{diff_anchor(path)}"
        items.append(
            f'        <li><span class="cl-fstat cl-fstat-{word}">{word}</span>'
            f'<a href="{html.escape(url)}" target="_blank" rel="noopener">'
            f"{html.escape(path)}</a></li>"
        )
    n = len(files)
    summary = f"What changed · {n} file{'' if n == 1 else 's'}"
    return (
        f'      <details class="cl-files">\n'
        f"        <summary>{summary}</summary>\n"
        f'        <ul class="cl-flist">\n'
        + "\n".join(items)
        + "\n        </ul>\n      </details>\n"
    )


def render(entries, base):
    if not entries:
        return (
            '  <p class="cl-empty">No entries yet — the next merged pull request '
            "will appear here.</p>"
        )

    # group consecutive entries by day (git log is already newest-first)
    days = []  # [(iso_date, [entries])]
    for e in entries:
        if not days or days[-1][0] != e["date"]:
            days.append((e["date"], []))
        days[-1][1].append(e)

    blocks = []
    for iso, day_entries in days:
        items = []
        for e in day_entries:
            tag = (
                f'<span class="cl-tag cl-tag-{e["tag"].split()[0].lower()}">'
                f'{html.escape(e["tag"])}</span>'
                if e["tag"]
                else ""
            )
            desc = (
                f'      <p class="cl-desc">{html.escape(e["desc"])}</p>\n'
                if e["desc"]
                else ""
            )
            pr_url = f"{base}/pull/{e['pr']}"
            items.append(
                f'    <li class="cl-item">\n'
                f'      <p class="cl-head">{tag}<span class="cl-text">'
                f'{html.escape(e["title"])}</span></p>\n'
                f"{desc}"
                f"{render_files(e, base)}"
                f'      <div class="cl-links">'
                f'<a href="{pr_url}" target="_blank" rel="noopener">PR #{e["pr"]} →</a>'
                f"</div>\n"
                f"    </li>"
            )
        blocks.append(
            f'  <section class="cl-day">\n'
            f'    <h2 class="cl-date">{html.escape(pretty_date(iso))}</h2>\n'
            f'    <ul class="cl-items">\n' + "\n".join(items) + "\n    </ul>\n"
            f"  </section>"
        )
    return "\n".join(blocks)


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
