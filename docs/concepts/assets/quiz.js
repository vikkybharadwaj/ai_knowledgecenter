/* CCA-F practice quiz engine. Reads window.CCA_QUESTIONS (array) and
   window.CCA_DOMAINS (map of key -> label). Vanilla JS, no deps.
   Question shape:
   { id, domain, scenario?, question, options:[str], answer:int, explanation, sources:[url], attribution? }
*/
(function () {
  var Q = window.CCA_QUESTIONS || [];
  var DOMAINS = window.CCA_DOMAINS || {};
  var root = document.getElementById("quiz");
  if (!root) return;

  var state = { pool: [], i: 0, picks: {}, revealed: {}, mode: "practice" };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function letter(i) { return String.fromCharCode(65 + i); }
  function esc(s){ return (s==null?"":String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function buildControls() {
    var bar = el("div", "quiz-controls");
    var dom = el("select"); dom.id = "f-domain";
    dom.appendChild(new Option("All domains", "all"));
    Object.keys(DOMAINS).forEach(function (k) { dom.appendChild(new Option(DOMAINS[k], k)); });
    var practice = el("button", "primary", "Practice set");
    var exam = el("button", null, "Exam mode (60)");
    bar.appendChild(el("span", null, "<span class='meta'>Filter:</span>"));
    bar.appendChild(dom);
    bar.appendChild(el("span", "grow")); bar.appendChild(practice); bar.appendChild(exam);
    practice.onclick = function () { startPractice(dom.value); };
    exam.onclick = function () { startExam(); };
    return bar;
  }

  function filtered(domain) {
    return Q.filter(function (q) {
      return (domain === "all" || q.domain === domain);
    });
  }

  function startPractice(domain) {
    state.mode = "practice";
    state.pool = shuffle(filtered(domain));
    state.i = 0; state.picks = {}; state.revealed = {};
    render();
  }
  function startExam() {
    state.mode = "exam";
    state.pool = shuffle(Q).slice(0, Math.min(60, Q.length));
    state.i = 0; state.picks = {}; state.revealed = {};
    render();
  }

  function pick(qi, oi) {
    if (state.revealed[qi] && state.mode === "practice") return;
    state.picks[qi] = oi;
    if (state.mode === "practice") { state.revealed[qi] = true; }
    render();
  }

  function score() {
    var correct = 0, answered = 0;
    state.pool.forEach(function (q, qi) { if (state.picks[qi] != null) { answered++; if (state.picks[qi] === q.answer) correct++; } });
    return { correct: correct, answered: answered, total: state.pool.length };
  }

  function render() {
    root.innerHTML = "";
    if (!state.pool.length) {
      root.appendChild(el("div", "callout", "No questions match that filter yet. Try All domains."));
      return;
    }
    var sc = score();
    var stat = el("div", "quiz-stat");
    stat.innerHTML = "<span>Question <b>" + (state.i + 1) + "</b> / " + state.pool.length + "</span>" +
      "<span>Answered <b>" + sc.answered + "</b></span>" +
      "<span>Correct <b>" + sc.correct + "</b></span>" +
      "<span>Mode: <b>" + (state.mode === "exam" ? "Exam (reveal at end)" : "Practice (instant feedback)") + "</b></span>";
    root.appendChild(stat);
    var sb = el("div", "scorebar"); sb.appendChild(el("span")); sb.firstChild.style.width = (100 * sc.answered / sc.total) + "%"; root.appendChild(sb);

    var q = state.pool[state.i], qi = state.i;
    var card = el("div", "qcard");
    var meta = el("div", "qmeta");
    var idm = /^D(\d+)-(\d+)$/.exec(q.id || "");
    var idTitle = idm
      ? "Domain " + idm[1] + ", question " + parseInt(idm[2], 10) + " — " + (DOMAINS[q.domain] || q.domain)
      : (q.id || "");
    meta.innerHTML = "<span class='badge'>" + esc(DOMAINS[q.domain] || q.domain) + "</span>" +
      "<span class='badge idbadge' title='" + esc(idTitle) + "'>" + esc(q.id || "") + "</span>";
    card.appendChild(meta);
    if (q.scenario) card.appendChild(el("div", "scenario", esc(q.scenario)));
    card.appendChild(el("div", "stem", esc(q.question)));

    var revealed = (state.mode === "practice" && state.revealed[qi]);
    var opts = el("div", "options");
    q.options.forEach(function (opt, oi) {
      var o = el("div", "option");
      var picked = state.picks[qi] === oi;
      if (picked) o.classList.add("selected");
      if (revealed) {
        o.classList.add("disabled");
        if (oi === q.answer) o.classList.add("correct");
        else if (picked) o.classList.add("wrong");
      }
      o.innerHTML = "<span class='key'>" + letter(oi) + "</span><span>" + esc(opt) + "</span>" +
        (revealed && oi === q.answer ? "<span class='mark'>✓</span>" : (revealed && picked ? "<span class='mark'>✕</span>" : ""));
      o.onclick = function () { pick(qi, oi); };
      opts.appendChild(o);
    });
    card.appendChild(opts);

    if (revealed) {
      var ex = el("div", "explain show");
      var ok = state.picks[qi] === q.answer;
      ex.appendChild(el("div", "verdict " + (ok ? "ok" : "no"), ok ? "✓ Correct" : "✕ Not quite — correct answer: " + letter(q.answer)));
      ex.appendChild(el("div", null, esc(q.explanation)));
      if (q.sources && q.sources.length) {
        var s = el("div", "src", "Source: " + q.sources.map(function (u) { return "<a href='" + esc(u) + "' target='_blank' rel='noopener'>" + esc(u.replace(/^https?:\/\//, "").split("/").slice(0,3).join("/")) + "</a>"; }).join(" · "));
        ex.appendChild(s);
      }
      if (q.attribution) ex.appendChild(el("div", "src", "Adapted from: " + esc(q.attribution)));
      card.appendChild(ex);
    }
    root.appendChild(card);

    var nav = el("div", "qnav");
    var prev = el("button", null, "← Previous"); prev.disabled = state.i === 0; prev.onclick = function () { state.i--; render(); };
    var nextLabel = state.i === state.pool.length - 1 ? (state.mode === "exam" ? "Finish & score" : "Done") : "Next →";
    var next = el("button", "primary", nextLabel);
    next.onclick = function () { if (state.i === state.pool.length - 1) { finish(); } else { state.i++; render(); } };
    nav.appendChild(prev); nav.appendChild(next);
    root.appendChild(nav);
  }

  function finish() {
    var sc = score();
    // scale to 1000 like the real exam (pass 720)
    var scaled = Math.round(1000 * sc.correct / sc.total);
    var pass = scaled >= 720;
    root.innerHTML = "";
    var card = el("div", "qcard result-card");
    card.appendChild(el("div", "big " + (pass ? "pass" : "fail"), scaled + " / 1000"));
    card.appendChild(el("div", null, "<p>" + sc.correct + " of " + sc.total + " correct &middot; " +
      (pass ? "<b style='color:var(--accent-3)'>Above the 720 pass line</b>" : "<b style='color:var(--warn)'>Below the 720 pass line</b>") + "</p>"));

    // per-domain breakdown
    var byDom = {};
    state.pool.forEach(function (q, qi) {
      var d = q.domain; byDom[d] = byDom[d] || { c: 0, t: 0 };
      byDom[d].t++; if (state.picks[qi] === q.answer) byDom[d].c++;
    });
    var tbl = el("table", "domain-breakdown");
    tbl.innerHTML = "<thead><tr><th>Domain</th><th class='s'>Score</th></tr></thead>";
    var tb = el("tbody");
    Object.keys(byDom).forEach(function (d) {
      var r = el("tr");
      var pct = Math.round(100 * byDom[d].c / byDom[d].t);
      r.innerHTML = "<td>" + esc(DOMAINS[d] || d) + "</td><td class='s'>" + byDom[d].c + "/" + byDom[d].t + " (" + pct + "%)</td>";
      tb.appendChild(r);
    });
    tbl.appendChild(tb);
    var wrap = el("div", "table-wrap"); wrap.style.marginTop = "18px"; wrap.appendChild(tbl);
    card.appendChild(wrap);
    var again = el("button", "primary", "Retake"); again.style.marginTop = "20px";
    again.onclick = function () { state.i = 0; state.picks = {}; state.revealed = {}; root.innerHTML = ""; buildAll(); };
    card.appendChild(again);
    root.appendChild(card);
  }

  var controlsHost;
  function buildAll() {
    if (!controlsHost) { controlsHost = el("div"); root.parentNode.insertBefore(controlsHost, root); }
    controlsHost.innerHTML = "";
    controlsHost.appendChild(buildControls());
    var n = Q.length;
    root.innerHTML = "<div class='callout'><span class='label'>" + n + " questions loaded</span>" +
      "Choose a domain and hit <b>Practice set</b> for instant feedback, or <b>Exam mode</b> for a timed-style 60-question run scored out of 1000 (pass = 720).</div>";
  }

  document.addEventListener("DOMContentLoaded", buildAll);
})();
