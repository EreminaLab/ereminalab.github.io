/* Spectrum-strip sweep on scroll. The sweep itself is CSS (.band.strip img in
   site.css) and on its own plays at page load, so a strip below the fold has
   finished before anyone scrolls to it. This holds those strips back with
   .wait (hidden, no animation) and releases each one when it scrolls into
   view, which restarts the CSS animation. Strips already on screen are left
   alone. Without IntersectionObserver, or under reduced motion, nothing is
   held back and the CSS behaves as before. */
(function () {
  "use strict";

  function boot() {
    var strips = document.querySelectorAll(".band.strip");
    if (!strips.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.remove("wait");
      });
    }, { threshold: 0.5 });

    var vh = window.innerHeight || document.documentElement.clientHeight;
    Array.prototype.forEach.call(strips, function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) return;
      el.classList.add("wait");
      io.observe(el);
    });
  }

  /* Loaded at the end of <body>, so the strips already exist: run now rather
     than at DOMContentLoaded, before the load-time sweep gets going. */
  boot();
})();
