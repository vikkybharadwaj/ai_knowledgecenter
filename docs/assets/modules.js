/* AI Knowledge Center — hub logic.
   To add a learning module later, append one entry to MODULES and it
   renders automatically (grouped by status). Theme key "cca-theme" is
   shared with the module sub-sites so dark/light stays in sync. */

(function () {
  // ---- shared theme ----
  var KEY = "cca-theme";
  var saved = localStorage.getItem(KEY);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      var label = function () {
        var dark = document.documentElement.getAttribute("data-theme") !== "light";
        btn.textContent = dark ? "☀ Light" : "☾ Dark";
      };
      label();
      btn.addEventListener("click", function () {
        var dark = document.documentElement.getAttribute("data-theme") !== "light";
        var next = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(KEY, next); label();
      });
    }
    renderModules();
  });

  // ---- the registry: ONE place to add modules ----
  var MODULES = [
    {
      status: "live", icon: "🧭",
      title: "Claude Code Architecture",
      tagline: "One mental model for every Claude Code primitive — skills, hooks, MCP, subagents, agent teams, dynamic workflows, agent view, worktrees, conventions, policies — plus a decision ladder and a full CCA-F exam-prep system.",
      href: "claude-code-architecture/index.html",
      chips: ["10 primitives", "101/201/301", "136-question exam prep"],
      links: [
        { label: "Mental model", href: "claude-code-architecture/mental-model.html" },
        { label: "Comparison matrix", href: "claude-code-architecture/matrix.html" },
        { label: "Decide what to use", href: "claude-code-architecture/decision.html" },
        { label: "Exam prep", href: "claude-code-architecture/exam-prep.html" },
        { label: "Scenarios", href: "claude-code-architecture/scenarios.html" }
      ]
    },
    {
      status: "live", icon: "🪜",
      title: "Harness · Context · Prompt Engineering",
      tagline: "The three nested levels of control over an LLM — the frame the whole stack hangs off. Where a bug lives tells you which level to fix.",
      href: "claude-code-architecture/mental-model.html#harness",
      chips: ["mental model"],
      links: [
        { label: "Read it", href: "claude-code-architecture/mental-model.html#harness" }
      ]
    },
    { status: "building", icon: "✍️", title: "Prompting & Context Engineering",
      tagline: "Structured output, few-shot design, context curation, prompt caching strategy — distilled into clickable references and drills." },
    { status: "building", icon: "🤖", title: "Agents & Tool Use",
      tagline: "Agent loops, orchestration patterns, tool/function design, memory and error recovery — beyond the Claude Code lens." },
    { status: "planned", icon: "🔎", title: "RAG & Retrieval",
      tagline: "Embeddings, chunking, hybrid search, reranking — when retrieval beats stuffing, and how to evaluate it." },
    { status: "planned", icon: "🧪", title: "Evals & Testing",
      tagline: "Eval design, LLM-as-judge, ground truth, regression gates — how I know a change actually improved things." },
    { status: "planned", icon: "🛡️", title: "Safety & Security",
      tagline: "Prompt injection, guardrails, PII, red-teaming — the trust boundary around every agent." }
  ];

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function card(m) {
    var live = m.status === "live";
    var c = el(live ? "a" : "div", "module " + (live ? "live" : "soon"));
    if (live) c.href = m.href;
    var chips = (m.chips || []).map(function (x) { return "<span class='chip'>" + esc(x) + "</span>"; }).join(" ");
    var top = "<span class='accentbar'></span><div class='topline'><span class='icon'>" + esc(m.icon || "•") +
      "</span><h3>" + esc(m.title) + "</h3><span class='status " + m.status + "'>" + m.status + "</span></div>";
    var tag = "<p class='tagline'>" + esc(m.tagline) + "</p>";
    var body = chips ? "<div class='topline'>" + chips + "</div>" : "";
    var foot = "";
    if (live) {
      var ml = (m.links || []).map(function (l) { return "<a href='" + esc(l.href) + "'>" + esc(l.label) + "</a>"; }).join("");
      foot = (ml ? "<div class='mlinks'>" + ml + "</div>" : "") + "<div class='go'>Open module →</div>";
    } else {
      foot = "<div class='go' style='color:var(--text-dim)'>" + (m.status === "building" ? "Hydrating soon" : "On the roadmap") + "</div>";
    }
    c.innerHTML = top + tag + body + foot;
    // stop inner link clicks from also triggering the card link
    if (live) c.querySelectorAll(".mlinks a").forEach(function (a) {
      a.addEventListener("click", function (e) { e.stopPropagation(); });
    });
    return c;
  }

  function renderModules() {
    var host = document.getElementById("modules-grid");
    if (!host) return;
    var live = MODULES.filter(function (m) { return m.status === "live"; });
    var rest = MODULES.filter(function (m) { return m.status !== "live"; });
    host.innerHTML = "";
    live.forEach(function (m) { host.appendChild(card(m)); });
    rest.forEach(function (m) { host.appendChild(card(m)); });
    var cnt = document.getElementById("module-count");
    if (cnt) cnt.textContent = live.length + " live · " + rest.length + " on the way";
  }
})();
