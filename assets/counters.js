/* Count-up for the home page numbers band. Progressive enhancement: the HTML
   already holds the final values; this only animates them up from zero the
   first time the band scrolls into view. Skipped for reduced motion. */
(function () {
  "use strict";

  function boot() {
    var nums = document.querySelectorAll(".stats [data-to]");
    if (!nums.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function run(el) {
      var to = parseInt(el.getAttribute("data-to"), 10), t0 = null, dur = 1400;
      function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(nums, function (el) {
      el.textContent = "0";
      io.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
