/* Claude Code Architecture site — shared interactions.
   Vanilla JS, no dependencies. Theme persistence, TOC scroll-spy,
   nav active-state, and keyboard-accessible tooltips. */

(function () {
  // ---- theme toggle (persisted) ----
  var KEY = "cca-theme";
  var saved = localStorage.getItem(KEY);

  function wireTheme() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    function label() {
      var dark = document.documentElement.getAttribute("data-theme") !== "light";
      btn.textContent = dark ? "☀ Light" : "☾ Dark";
    }
    label();
    btn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") !== "light";
      var next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(KEY, next);
      label();
    });
  }

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
    wireTheme(); wireNav(); wireToc(); wireTips();
  });
})();
