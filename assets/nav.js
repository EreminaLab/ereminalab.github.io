/* Mobile navigation toggle. Progressive enhancement — the nav is a plain
   list of links with no JS; this only collapses it on narrow screens. */
(function () {
  "use strict";

  function boot() {
    var btn = document.querySelector(".navtoggle");
    var nav = document.querySelector(".sitenav");
    if (!btn || !nav) return;

    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "sitenav");
    nav.id = nav.id || "sitenav";

    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Close" : "Menu";
    });

    /* close on navigation within the page */
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menu";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
