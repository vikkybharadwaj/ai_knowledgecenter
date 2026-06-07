/* AI Knowledge Center — in-page note reader.
   GitHub is only the *source* of the content; we never link out to it. Every
   note (and the Big Picture / Home note) is rendered to HTML at build time into
   window.KC_DATA and shown here, in an overlay, so you read and follow
   connections without leaving the page.

   Public API:  window.KCReader.open(slug) · .close() · .has(slug)
   Any <a class="kc-link" data-slug="..."> anywhere on the page opens the reader. */
(function () {
  var D = window.KC_DATA;
  if (!D) return;

  var LAYER_COLORS = {
    foundations: "#7aa2f7", api: "#9ece6a", "agent-sdk": "#e0af68",
    "claude-code": "#d98b5f", patterns: "#bb9af7", products: "#f7768e"
  };

  // unified registry: concepts (the map) + notes (the sources) + map docs, by slug
  var BY = {};
  (D.concepts || []).forEach(function (c) {
    BY[c.slug] = { kind: "concept", title: c.title, html: c.html,
                   layer: c.layer, label: c.kind || "concept" };
  });
  (D.nodes || []).forEach(function (n) {
    BY[n.slug] = { kind: "note", title: n.title, html: n.html,
                   layer: n.layer, depth: n.depth, tags: n.tags || [] };
  });
  Object.keys(D.docs || {}).forEach(function (k) {
    BY[k] = { kind: "doc", title: D.docs[k].title, html: D.docs[k].html };
  });

  // overlay DOM
  var ov = document.createElement("div");
  ov.className = "kc-reader";
  ov.innerHTML =
    '<div class="kc-reader-backdrop"></div>' +
    '<div class="kc-reader-card" role="dialog" aria-modal="true" aria-label="Note reader">' +
      '<div class="kc-reader-bar">' +
        '<button class="kc-reader-back" type="button" aria-label="Back">← Back</button>' +
        '<span class="kc-reader-crumb"></span>' +
        '<span class="kc-reader-spacer"></span>' +
        '<button class="kc-reader-close" type="button" aria-label="Close">✕</button>' +
      '</div>' +
      '<article class="kc-reader-body markdown"></article>' +
    '</div>';
  document.body.appendChild(ov);

  var bodyEl = ov.querySelector(".kc-reader-body");
  var crumbEl = ov.querySelector(".kc-reader-crumb");
  var backBtn = ov.querySelector(".kc-reader-back");
  var stack = [];

  function render(slug) {
    var it = BY[slug];
    if (!it) return false;
    var head = "";
    if (it.kind === "concept") {
      head =
        '<div class="kc-reader-head">' +
          '<span class="np-layer" style="background:' + (LAYER_COLORS[it.layer] || "#9aa5bd") + '">' +
            (D.layerLabels[it.layer] || it.layer) + "</span>" +
          '<span class="np-depth">' + (it.label || "concept") + "</span>" +
        "</div>";
    } else if (it.kind === "note") {
      head =
        '<div class="kc-reader-head">' +
          '<span class="np-layer" style="background:' + (LAYER_COLORS[it.layer] || "#9aa5bd") + '">' +
            (D.layerLabels[it.layer] || it.layer) + "</span>" +
          '<span class="np-depth">source note · ' + (it.depth || "") + "</span>" +
        "</div>";
    }
    bodyEl.innerHTML = head + (it.html || "<p>(no content yet)</p>");
    crumbEl.textContent = it.title || slug;
    bodyEl.scrollTop = 0;
    backBtn.style.visibility = stack.length > 1 ? "visible" : "hidden";
    return true;
  }

  function open(slug) {
    if (!BY[slug]) return;
    if (stack[stack.length - 1] !== slug) stack.push(slug);
    if (!render(slug)) return;
    ov.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function close() {
    ov.classList.remove("show");
    document.body.style.overflow = "";
    stack = [];
  }

  function back() {
    if (stack.length > 1) { stack.pop(); render(stack[stack.length - 1]); }
  }

  ov.querySelector(".kc-reader-backdrop").addEventListener("click", close);
  ov.querySelector(".kc-reader-close").addEventListener("click", close);
  backBtn.addEventListener("click", back);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && ov.classList.contains("show")) close();
  });

  // any kc-link on the page (list, hero, graph panel, or inside the reader) opens here
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a.kc-link") : null;
    if (a && a.getAttribute("data-slug")) {
      e.preventDefault();
      open(a.getAttribute("data-slug"));
    }
  });

  window.KCReader = { open: open, close: close, has: function (s) { return !!BY[s]; } };
})();
