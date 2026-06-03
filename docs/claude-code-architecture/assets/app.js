/* Claude Code Architecture site — shared interactions.
   Vanilla JS, no dependencies. TOC scroll-spy, nav active-state,
   and keyboard-accessible tooltips. Dark-only (no theme toggle). */

(function () {
  // ---- highlight current page in top nav ----
  function wireNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".topbar nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var target = href.split("/").pop().split("#")[0];
      if (target === here || (here === "" && target === "index.html")) a.classList.add("active");
    });
  }

  // ---- TOC scroll-spy ----
  function wireToc() {
    var toc = document.querySelector(".toc");
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var map = {};
    links.forEach(function (l) {
      var id = l.getAttribute("href");
      if (id && id.charAt(0) === "#") { var el = document.getElementById(id.slice(1)); if (el) map[id] = el; }
    });
    var ids = Object.keys(map);
    function onScroll() {
      var pos = window.scrollY + 110, current = null;
      ids.forEach(function (id) { if (map[id].offsetTop <= pos) current = id; });
      links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === current); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- make tooltips keyboard-focusable ----
  function wireTips() {
    document.querySelectorAll(".tip").forEach(function (t) {
      if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "0");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireNav(); wireToc(); wireTips();
  });
})();
