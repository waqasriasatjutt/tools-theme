(function () {
  var QR_LIB_URL = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js";
  var libPromise = null;
  function loadLib() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = QR_LIB_URL; s.async = true;
      s.onload = function () { resolve(window.qrcode); };
      s.onerror = function () { reject(new Error("Failed to load QR library")); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  function init(root) {
    if (!root || root.__qrReady) return;
    root.__qrReady = true;

    var input = root.querySelector(".qr-input");
    var sizeEl = root.querySelector(".qr-size");
    var marginEl = root.querySelector(".qr-margin");
    var levelEl = root.querySelector(".qr-level");
    var fgEl = root.querySelector(".qr-fg");
    var bgEl = root.querySelector(".qr-bg");
    var build = root.querySelector(".qr-build");
    var dlPng = root.querySelector(".qr-dl-png");
    var dlSvg = root.querySelector(".qr-dl-svg");
    var status = root.querySelector(".qr-status");
    var canvas = root.querySelector(".qr-canvas");

    var lastSvg = "";
    var debounce = null;

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg || "";
      status.classList.toggle("is-ok", kind === "ok");
      status.classList.toggle("is-err", kind === "err");
    }

    function draw() {
      loadLib().then(function (qrcode) {
        var text = (input.value || "").trim();
        if (!text) { setStatus("Enter some text or URL.", null); return; }
        var size = parseInt(sizeEl.value, 10) || 512;
        var margin = parseInt(marginEl.value, 10) || 4;
        var level = (levelEl.value || "M").toUpperCase();
        var fg = fgEl.value || "#000000";
        var bg = bgEl.value || "#ffffff";

        var qr;
        try { qr = qrcode(0, level); qr.addData(text); qr.make(); }
        catch (e) { setStatus("Encode failed: " + (e.message || e), "err"); return; }

        var modules = qr.getModuleCount();
        var cell = Math.floor((size - 2 * margin) / modules);
        if (cell < 1) cell = 1;
        var actual = cell * modules + 2 * margin;
        canvas.width = actual; canvas.height = actual;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = bg; ctx.fillRect(0, 0, actual, actual);
        ctx.fillStyle = fg;
        for (var r = 0; r < modules; r++) {
          for (var c = 0; c < modules; c++) {
            if (qr.isDark(r, c)) ctx.fillRect(margin + c * cell, margin + r * cell, cell, cell);
          }
        }
        var rects = "";
        for (var r2 = 0; r2 < modules; r2++) {
          for (var c2 = 0; c2 < modules; c2++) {
            if (qr.isDark(r2, c2)) rects += '<rect x="' + (margin + c2 * cell) + '" y="' + (margin + r2 * cell) + '" width="' + cell + '" height="' + cell + '" fill="' + fg + '"/>';
          }
        }
        lastSvg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + actual + '" height="' + actual + '" viewBox="0 0 ' + actual + ' ' + actual + '"><rect width="100%" height="100%" fill="' + bg + '"/>' + rects + '</svg>';
        setStatus("Generated (" + modules + "×" + modules + " modules)", "ok");
      }).catch(function (e) { setStatus(e.message || String(e), "err"); });
    }

    function scheduleDraw() {
      clearTimeout(debounce);
      debounce = setTimeout(draw, 250);
    }

    if (build) build.addEventListener("click", draw);
    [input, sizeEl, marginEl, levelEl, fgEl, bgEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", scheduleDraw);
      el.addEventListener("change", scheduleDraw);
    });

    if (dlPng) dlPng.addEventListener("click", function () {
      if (!canvas.width) { setStatus("Generate first.", "err"); return; }
      var a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "qr-code.png";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
    if (dlSvg) dlSvg.addEventListener("click", function () {
      if (!lastSvg) { setStatus("Generate first.", "err"); return; }
      var blob = new Blob([lastSvg], { type: "image/svg+xml" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "qr-code.svg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });

    setTimeout(draw, 100);
  }

  function boot() { document.querySelectorAll(".qr-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
