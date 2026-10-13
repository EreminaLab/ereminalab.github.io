/* ---------------------------------------------------------------
   spectra.js — draws synthetic SERS reporter spectra into <canvas>.
   Used as hero / section artwork in the style mockups so the pages
   have real subject-grounded graphics without needing figure files.

   Usage:  <canvas data-spectrum="dark"></canvas>
           modes: "dark" | "light" | "waterfall" | "mono"
   Optional attributes:
           data-colors="#7C5CFF,#16C2C2"   override the palette
           data-count="4"                  how many reporters to draw
   --------------------------------------------------------------- */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Each reporter is a small set of [position, relative intensity] bands.
     Positions are hand-placed so no two reporters share a band — the
     visual analogue of the spectral orthogonality the library is built on. */
  var REPORTERS = [
    { peaks: [[0.10, 0.42], [0.23, 1.00], [0.31, 0.30], [0.58, 0.52], [0.74, 0.26]] },
    { peaks: [[0.16, 0.30], [0.37, 0.88], [0.44, 0.44], [0.66, 1.00], [0.85, 0.22]] },
    { peaks: [[0.07, 0.24], [0.29, 0.56], [0.50, 1.00], [0.61, 0.34], [0.90, 0.46]] },
    { peaks: [[0.13, 0.66], [0.34, 0.28], [0.47, 0.38], [0.70, 0.44], [0.81, 1.00]] },
    { peaks: [[0.19, 0.52], [0.41, 0.34], [0.54, 0.62], [0.77, 1.00], [0.94, 0.30]] },
    { peaks: [[0.05, 0.36], [0.26, 0.44], [0.39, 1.00], [0.64, 0.28], [0.88, 0.58]] }
  ];

  var DEFAULT_COLORS = ["#7C5CFF", "#16C2C2", "#F0A02A", "#E0464B", "#4D8DF6", "#E36BB0"];

  function intensity(x, peaks) {
    var y = 0;
    for (var i = 0; i < peaks.length; i++) {
      var c = peaks[i][0], a = peaks[i][1], w = 0.0092;
      var d = (x - c) / w;
      y += a * Math.exp(-0.5 * d * d);
    }
    return y;
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16)
    ];
  }

  function trace(ctx, W, peaks, baseline, height, progress) {
    var limit = W * progress;
    ctx.beginPath();
    var started = false;
    for (var px = 0; px <= limit; px++) {
      var y = baseline - intensity(px / W, peaks) * height;
      if (!started) { ctx.moveTo(px, y); started = true; }
      else { ctx.lineTo(px, y); }
    }
    return limit;
  }

  function drawCurve(ctx, W, peaks, baseline, height, color, fillAlpha, progress, weight) {
    var limit = trace(ctx, W, peaks, baseline, height, progress);

    if (fillAlpha) {
      ctx.lineTo(limit, baseline);
      ctx.lineTo(0, baseline);
      ctx.closePath();
      var rgb = hexToRgb(color);
      ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + fillAlpha + ")";
      ctx.fill();
      trace(ctx, W, peaks, baseline, height, progress);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = weight || 2.4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function render(canvas, progress) {
    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var mode = canvas.getAttribute("data-spectrum") || "dark";
    var count = parseInt(canvas.getAttribute("data-count") || "4", 10);
    var custom = canvas.getAttribute("data-colors");
    var colors = custom ? custom.split(",").map(function (s) { return s.trim(); }) : DEFAULT_COLORS;

    ctx.clearRect(0, 0, W, H);
    count = Math.min(count, REPORTERS.length);

    if (mode === "waterfall" || mode === "light") {
      var grid = canvas.getAttribute("data-grid");
      if (grid !== "off") {
        ctx.strokeStyle = mode === "light" ? "#EDEEF1" : "rgba(255,255,255,.07)";
        ctx.lineWidth = 1;
        for (var g = 1; g < 8; g++) {
          var gx = Math.round((W * g) / 8) + 0.5;
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
        }
      }
      var slot = H / count;
      for (var i = 0; i < count; i++) {
        var base = slot * (i + 1) - 6;
        drawCurve(ctx, W, REPORTERS[i].peaks, base, slot * 0.88,
          colors[i % colors.length], null, progress, 2);
      }
      return;
    }

    if (mode === "mono") {
      var baseM = H - 10;
      for (var m = 0; m < count; m++) {
        drawCurve(ctx, W, REPORTERS[m].peaks, baseM, H * 0.6,
          colors[m % colors.length], null, progress, 1.6);
      }
      return;
    }

    /* default: overlaid + soft fills on a dark ground */
    var baseline = H - 14;
    for (var j = 0; j < count; j++) {
      drawCurve(ctx, W, REPORTERS[j].peaks, baseline, H * 0.62,
        colors[j % colors.length], 0.13, progress, 2.4);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, baseline + 0.5);
    ctx.lineTo(W, baseline + 0.5);
    ctx.stroke();
  }

  function boot() {
    var canvases = document.querySelectorAll("canvas[data-spectrum]");
    Array.prototype.forEach.call(canvases, function (cv) {
      if (reduce) { render(cv, 1); return; }
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / 1500);
        render(cv, 1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
