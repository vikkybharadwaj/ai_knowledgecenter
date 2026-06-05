#!/usr/bin/env python3
"""
build-index.py — derive the Knowledge-view graph data from the note pool.

Scans knowledge/notes/*.md, parses each note's YAML frontmatter (a small,
SCHEMA-SPECIFIC parser — no PyYAML dependency, so it runs anywhere), renders the
note body to HTML, and emits docs/assets/knowledge.js: the nodes + typed edges
the interactive graph renders AND the rendered note content the in-page reader
shows. GitHub is the *source* of the content; the site never links out to it —
every note opens and renders inside the page itself.

The index is DERIVED. Never hand-edit knowledge.js — edit the notes and re-run:
    python3 scripts/build-index.py
"""

import os
import re
import json
import shutil
import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTES_DIR = os.path.join(ROOT, "knowledge", "notes")
MAPS_DIR = os.path.join(ROOT, "knowledge", "maps")
README = os.path.join(ROOT, "knowledge", "README.md")
OUT = os.path.join(ROOT, "docs", "assets", "knowledge.js")
# Where note images get copied so the in-page reader can show them (relative to
# docs/knowledge/index.html the reader resolves these as notes/<file>).
IMG_OUT = os.path.join(ROOT, "docs", "knowledge", "notes")
BLOB = "https://github.com/vikkybharadwaj/ai_knowledgecenter/blob/main/knowledge/notes/"

LAYERS = ["foundations", "api", "agent-sdk", "claude-code", "patterns", "products"]
LAYER_LABELS = {
    "foundations": "Foundations",
    "api": "Claude API",
    "agent-sdk": "Agent SDK",
    "claude-code": "Claude Code",
    "patterns": "Agent Patterns",
    "products": "Products & Consulting",
}


# ---------------------------------------------------------------------------
# frontmatter parsing (schema-specific, dependency-free)
# ---------------------------------------------------------------------------
def split_frontmatter(text):
    """Return (frontmatter_str, body) or (None, text) if no frontmatter."""
    if not text.startswith("---"):
        return None, text
    end = text.find("\n---", 3)
    if end == -1:
        return None, text
    return text[3:end].strip("\n"), text[end + 4:]


def scalar(fm, key, default=None):
    m = re.search(r"^%s:\s*(.+?)\s*$" % re.escape(key), fm, re.MULTILINE)
    if not m:
        return default
    val = m.group(1).strip()
    if val.lower() in ("true", "false"):
        return val.lower() == "true"
    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
        val = val[1:-1]
    return val


def parse_tags(fm):
    m = re.search(r"^tags:\s*\[(.*?)\]\s*$", fm, re.MULTILINE)
    if not m:
        return []
    return [t.strip().strip('"\'') for t in m.group(1).split(",") if t.strip()]


def parse_connections(fm):
    """Parse the `connections:` block of inline dicts:
         - { to: slug, type: kind, why: "..." }
       Uses targeted regex so commas/em-dashes inside `why` don't break parsing."""
    conns = []
    block = re.search(r"^connections:\s*\n(.*?)(?=^\S|\Z)", fm + "\n", re.MULTILINE | re.DOTALL)
    if not block:
        return conns
    for line in block.group(1).splitlines():
        line = line.strip()
        if not line.startswith("- "):
            continue
        to = re.search(r"\bto:\s*([A-Za-z0-9\-]+)", line)
        typ = re.search(r"\btype:\s*([A-Za-z\-]+)", line)
        why = re.search(r'\bwhy:\s*"(.*)"', line)
        if to and typ:
            conns.append({"to": to.group(1), "type": typ.group(1),
                          "why": why.group(1) if why else ""})
    return conns


# ---------------------------------------------------------------------------
# markdown -> HTML  (the subset our notes use, rendered at build time so the
# in-page reader just sets innerHTML — no client-side markdown lib needed)
# ---------------------------------------------------------------------------
PUA_O, PUA_C = "", ""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _inline_basic(text):
    """Escape + bold/italic/code only — used for link labels (no nested links)."""
    text = esc(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    return text


def render_inline(text, title_of):
    """Render inline markdown. `title_of(slug)` resolves a note/doc slug to its
    title for [[wikilinks]]. All internal links (.md, [[...]]) become in-page
    kc-link anchors; only http(s) links leave the page."""
    tokens = []

    def stash(html):
        tokens.append(html)
        return PUA_O + str(len(tokens) - 1) + PUA_C

    # images: ![alt](src) — local images are copied into docs/knowledge/notes/
    def img_sub(m):
        alt, src = m.group(1), m.group(2).strip()
        if re.match(r"^https?://", src):
            url = src
        else:
            url = "notes/" + src.split("/")[-1]
        return stash('<img src="%s" alt="%s" loading="lazy">' % (esc(url), esc(alt)))

    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", img_sub, text)

    # links: [label](href)
    def link_sub(m):
        label, href = m.group(1), m.group(2).strip()
        inner = _inline_basic(label)
        if re.match(r"^https?://", href):
            return stash('<a href="%s" target="_blank" rel="noopener">%s</a>' % (esc(href), inner))
        base = href.split("#")[0].rstrip("/").split("/")[-1]
        if base.endswith(".md"):
            slug = base[:-3].lower()
            return stash('<a href="#" class="kc-link" data-slug="%s">%s</a>' % (esc(slug), inner))
        # a bare relative dir/anchor (e.g. notes/, maps/) — no GitHub leak; keep the label
        return stash('<span class="kc-ref">%s</span>' % inner)

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link_sub, text)

    # wikilinks: [[slug]] or [[slug|label]]
    def wiki_sub(m):
        inner = m.group(1).strip()
        if "|" in inner:
            slug, label = inner.split("|", 1)
        else:
            slug, label = inner, inner
        slug = slug.strip().lower()
        label = title_of(slug) or label.strip()
        return stash('<a href="#" class="kc-link" data-slug="%s">%s</a>' % (esc(slug), esc(label)))

    text = re.sub(r"\[\[([^\]]+)\]\]", wiki_sub, text)

    # inline code
    text = re.sub(r"`([^`]+)`", lambda m: stash("<code>%s</code>" % esc(m.group(1))), text)

    # escape everything still raw, then bold / italic
    text = esc(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", text)

    # restore protected tokens
    text = re.sub(PUA_O + r"(\d+)" + PUA_C, lambda m: tokens[int(m.group(1))], text)
    return text


def _split_row(line):
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [c.strip() for c in line.split("|")]


def _parse_list(lines, i, title_of):
    """Consume one list (with continuations + nested sublists) starting at i.
    Returns (html, next_i)."""
    n = len(lines)
    m = re.match(r"^(\s*)([-*+]|\d+\.)\s+(.*)$", lines[i])
    indent = len(m.group(1))
    ordered = bool(re.match(r"^\d+\.", m.group(2)))
    tag = "ol" if ordered else "ul"
    items = []  # {'text': str, 'sub': html}
    while i < n:
        line = lines[i]
        if not line.strip():
            j = i + 1
            while j < n and not lines[j].strip():
                j += 1
            if j < n:
                mm = re.match(r"^(\s*)([-*+]|\d+\.)\s+", lines[j])
                if mm and len(mm.group(1)) >= indent:
                    i = j
                    continue
            break
        lm = re.match(r"^(\s*)([-*+]|\d+\.)\s+(.*)$", line)
        if lm:
            cur = len(lm.group(1))
            if cur < indent:
                break
            if cur > indent and items:
                sub_html, i = _parse_list(lines, i, title_of)
                items[-1]["sub"] += sub_html
                continue
            items.append({"text": lm.group(3), "sub": ""})
            i += 1
            continue
        # non-bullet line: a continuation of the current item if indented
        cur = len(line) - len(line.lstrip())
        if cur > indent and items:
            items[-1]["text"] += " " + line.strip()
            i += 1
            continue
        break
    out = []
    for it in items:
        out.append("<li>" + render_inline(it["text"].strip(), title_of) + it["sub"] + "</li>")
    return "<%s>%s</%s>" % (tag, "".join(out), tag), i


def render_markdown(text, title_of):
    lines = text.split("\n")
    n = len(lines)
    out = []
    para = []

    def flush():
        if para:
            out.append("<p>" + render_inline(" ".join(para).strip(), title_of) + "</p>")
            para.clear()

    i = 0
    while i < n:
        line = lines[i]
        stripped = line.strip()

        # fenced code
        if stripped.startswith("```"):
            flush()
            i += 1
            code = []
            while i < n and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1  # closing fence
            out.append("<pre><code>" + esc("\n".join(code)) + "</code></pre>")
            continue

        if not stripped:
            flush()
            i += 1
            continue

        hm = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if hm:
            flush()
            lvl = len(hm.group(1))
            out.append("<h%d>%s</h%d>" % (lvl, render_inline(hm.group(2), title_of), lvl))
            i += 1
            continue

        if re.match(r"^(---|\*\*\*|___)$", stripped):
            flush()
            out.append("<hr>")
            i += 1
            continue

        # table: header row | separator row of dashes
        if (stripped.startswith("|") and i + 1 < n
                and re.match(r"^\|?[\s:\-|]+\|?$", lines[i + 1].strip())
                and "-" in lines[i + 1]):
            flush()
            header = _split_row(stripped)
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append(_split_row(lines[i]))
                i += 1
            t = ["<table><thead><tr>"]
            t += ["<th>%s</th>" % render_inline(c, title_of) for c in header]
            t.append("</tr></thead><tbody>")
            for r in rows:
                t.append("<tr>" + "".join("<td>%s</td>" % render_inline(c, title_of) for c in r) + "</tr>")
            t.append("</tbody></table>")
            out.append("".join(t))
            continue

        if stripped.startswith(">"):
            flush()
            quote = []
            while i < n and lines[i].strip().startswith(">"):
                quote.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            out.append("<blockquote>" + render_markdown("\n".join(quote), title_of) + "</blockquote>")
            continue

        if re.match(r"^(\s*)([-*+]|\d+\.)\s+", line):
            flush()
            html, i = _parse_list(lines, i, title_of)
            out.append(html)
            continue

        para.append(stripped)
        i += 1

    flush()
    return "\n".join(out)


def copy_images(body, srcdir):
    """Copy locally-referenced images from a note into docs/knowledge/notes/."""
    for m in re.finditer(r"!\[[^\]]*\]\(([^)]+)\)", body):
        src = m.group(1).strip()
        if re.match(r"^https?://", src):
            continue
        name = src.split("/")[-1]
        srcp = os.path.join(srcdir, name)
        if os.path.exists(srcp):
            os.makedirs(IMG_OUT, exist_ok=True)
            shutil.copy2(srcp, os.path.join(IMG_OUT, name))


# ---------------------------------------------------------------------------
def main():
    raw_notes, raw_edges = [], []   # raw_notes: collected before rendering (need title map first)
    for fn in sorted(os.listdir(NOTES_DIR)):
        if not fn.endswith(".md"):
            continue
        with open(os.path.join(NOTES_DIR, fn), encoding="utf-8") as f:
            text = f.read()
        fm, body = split_frontmatter(text)
        if fm is None:
            print("  ! skipped (no frontmatter): %s" % fn)
            continue
        slug = scalar(fm, "slug") or fn[:-3]
        raw_notes.append({
            "slug": slug,
            "title": scalar(fm, "title", slug),
            "kind": scalar(fm, "kind", "concept"),
            "layer": scalar(fm, "spine_layer", "foundations"),
            "tags": parse_tags(fm),
            "depth": scalar(fm, "depth", "seedling"),
            "claudeSpecific": bool(scalar(fm, "claude_specific", True)),
            "url": BLOB + fn,
            "_body": body,
        })
        for c in parse_connections(fm):
            raw_edges.append({"from": slug, "to": c["to"], "type": c["type"], "why": c["why"]})
        copy_images(body, NOTES_DIR)

    # ---- map docs (Big Picture spine + Home note) so their links open in-page ----
    docs = {}
    title_index = {n["slug"]: n["title"] for n in raw_notes}

    bp_path = os.path.join(MAPS_DIR, "big-picture.md")
    if os.path.exists(bp_path):
        with open(bp_path, encoding="utf-8") as f:
            fm, body = split_frontmatter(f.read())
        title_index["big-picture"] = (scalar(fm or "", "title", "The Big Picture")
                                       if fm else "The Big Picture")
        docs["big-picture"] = {"title": title_index["big-picture"], "_body": body}
        copy_images(body, MAPS_DIR)

    if os.path.exists(README):
        with open(README, encoding="utf-8") as f:
            body = f.read()
        h1 = re.search(r"^#\s+(.*)$", body, re.MULTILINE)
        title_index["readme"] = (h1.group(1).strip() if h1 else "Knowledge — the Home Note")
        docs["readme"] = {"title": title_index["readme"], "_body": body}
        copy_images(body, os.path.dirname(README))

    def title_of(slug):
        return title_index.get(slug)

    # ---- render bodies now that every title is known ----
    nodes = []
    for n in raw_notes:
        body = n.pop("_body")
        n["html"] = render_markdown(body, title_of)
        nodes.append(n)
    for key in docs:
        docs[key]["html"] = render_markdown(docs[key].pop("_body"), title_of)

    # ---- edges + degree + orphan check ----
    known = {n["slug"] for n in nodes}
    edges, dropped = [], []
    for e in raw_edges:
        (edges if e["to"] in known else dropped).append(e)
    for e in dropped:
        print("  ! dropped edge to unknown note: %s -> %s" % (e["from"], e["to"]))

    deg = {n["slug"]: 0 for n in nodes}
    for e in edges:
        deg[e["from"]] += 1
        deg[e["to"]] += 1
    orphans = []
    for n in nodes:
        n["connCount"] = deg[n["slug"]]
        if n["kind"] == "concept" and deg[n["slug"]] == 0:
            orphans.append(n["slug"])

    data = {
        "generated": datetime.date.today().isoformat(),
        "layers": LAYERS,
        "layerLabels": LAYER_LABELS,
        "nodes": nodes,
        "edges": edges,
        "docs": docs,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* AUTO-GENERATED by scripts/build-index.py — do not edit by hand.\n")
        f.write("   Re-run after changing notes:  python3 scripts/build-index.py */\n")
        f.write("window.KC_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")

    print("Wrote %s" % os.path.relpath(OUT, ROOT))
    print("  nodes: %d   edges: %d   dropped: %d   docs: %d"
          % (len(nodes), len(edges), len(dropped), len(docs)))
    if orphans:
        print("  ⚠ ORPHAN concept notes (no connections — silo risk): %s" % ", ".join(orphans))
    else:
        print("  ✓ no orphans — every concept note is wired into the graph")


if __name__ == "__main__":
    main()
