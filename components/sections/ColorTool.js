(function () {
  function hexToRgb(h) {
    h = (h || "").replace("#", "").trim();
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  function rgbToHex(r, g, b) {
    function p(v) { v = Math.max(0, Math.min(255, Math.round(v))); return v.toString(16).padStart(2, "0"); }
    return "#" + p(r) + p(g) + p(b);
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r1 = 0, g1 = 0, b1 = 0;
    if (h < 60) { r1 = c; g1 = x; }
    else if (h < 120) { r1 = x; g1 = c; }
    else if (h < 180) { g1 = c; b1 = x; }
    else if (h < 240) { g1 = x; b1 = c; }
    else if (h < 300) { r1 = x; b1 = c; }
    else { r1 = c; b1 = x; }
    return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
  }
  function rgbToCmyk(r, g, b) {
    var rr = r / 255, gg = g / 255, bb = b / 255;
    var k = 1 - Math.max(rr, gg, bb);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    var c = (1 - rr - k) / (1 - k);
    var m = (1 - gg - k) / (1 - k);
    var y = (1 - bb - k) / (1 - k);
    return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
  }
  function srgbLum(c) {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function contrast(rgb1, rgb2) {
    var L1 = 0.2126 * srgbLum(rgb1.r) + 0.7152 * srgbLum(rgb1.g) + 0.0722 * srgbLum(rgb1.b);
    var L2 = 0.2126 * srgbLum(rgb2.r) + 0.7152 * srgbLum(rgb2.g) + 0.0722 * srgbLum(rgb2.b);
    var hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function init(root) {
    if (!root || root.__ctReady) return;
    root.__ctReady = true;
    var picker = root.querySelector(".ct-input-color");
    var swatch = root.querySelector(".ct-swatch");
    var hex = root.querySelector(".ct-hex");
    var rgb = root.querySelector(".ct-rgb");
    var hsl = root.querySelector(".ct-hsl");
    var cmyk = root.querySelector(".ct-cmyk");
    var paletteEl = root.querySelector(".ct-palette");
    var scheme = root.querySelector(".ct-scheme");
    var fg = root.querySelector(".ct-fg");
    var bg = root.querySelector(".ct-bg");
    var preview = root.querySelector(".ct-contrast-preview");
    var ratio = root.querySelector(".ct-contrast-ratio");
    var grades = root.querySelector(".ct-contrast-grades");

    function paint(h) {
      var c = hexToRgb(h);
      if (!c) return;
      swatch.style.background = h;
      picker.value = h;
      hex.value = h.toUpperCase();
      rgb.value = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
      var hh = rgbToHsl(c.r, c.g, c.b);
      hsl.value = "hsl(" + hh.h + ", " + hh.s + "%, " + hh.l + "%)";
      var k = rgbToCmyk(c.r, c.g, c.b);
      cmyk.value = "cmyk(" + k.c + "%, " + k.m + "%, " + k.y + "%, " + k.k + "%)";
      renderPalette(hh);
    }

    function renderPalette(hslObj) {
      if (!paletteEl) return;
      var list = [];
      var s = scheme.value;
      if (s === "mono") {
        [-30, -15, 0, 15, 30].forEach(function (d) { list.push({ h: hslObj.h, s: hslObj.s, l: Math.max(5, Math.min(95, hslObj.l + d)) }); });
      } else if (s === "complement") {
        list = [{ h: hslObj.h, s: hslObj.s, l: hslObj.l }, { h: (hslObj.h + 180) % 360, s: hslObj.s, l: hslObj.l }];
      } else if (s === "analogous") {
        [-60, -30, 0, 30, 60].forEach(function (d) { list.push({ h: (hslObj.h + d + 360) % 360, s: hslObj.s, l: hslObj.l }); });
      } else if (s === "triadic") {
        list = [{ h: hslObj.h, s: hslObj.s, l: hslObj.l }, { h: (hslObj.h + 120) % 360, s: hslObj.s, l: hslObj.l }, { h: (hslObj.h + 240) % 360, s: hslObj.s, l: hslObj.l }];
      } else {
        list = [{ h: hslObj.h, s: hslObj.s, l: hslObj.l }, { h: (hslObj.h + 90) % 360, s: hslObj.s, l: hslObj.l }, { h: (hslObj.h + 180) % 360, s: hslObj.s, l: hslObj.l }, { h: (hslObj.h + 270) % 360, s: hslObj.s, l: hslObj.l }];
      }
      paletteEl.innerHTML = list.map(function (c) {
        var rgb = hslToRgb(c.h, c.s, c.l);
        var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        var text = c.l < 50 ? "#fff" : "#000";
        return '<div class="ct-swatch-card" style="background:' + hex + ';color:' + text + ';" data-hex="' + hex + '">' + hex.toUpperCase() + '</div>';
      }).join("");
      paletteEl.querySelectorAll(".ct-swatch-card").forEach(function (el) {
        el.addEventListener("click", function () {
          if (navigator.clipboard) navigator.clipboard.writeText(el.dataset.hex);
          var t = el.textContent; el.textContent = "Copied!"; setTimeout(function () { el.textContent = t; }, 800);
        });
      });
    }

    function refreshContrast() {
      var f = hexToRgb(fg.value), b = hexToRgb(bg.value);
      if (!f || !b) return;
      preview.style.background = bg.value;
      preview.style.color = fg.value;
      var r = contrast(f, b);
      ratio.textContent = r.toFixed(2) + " : 1";
      grades.innerHTML = [
        ["AA Normal (4.5)", r >= 4.5],
        ["AA Large (3.0)", r >= 3.0],
        ["AAA Normal (7.0)", r >= 7.0],
        ["AAA Large (4.5)", r >= 4.5],
      ].map(function (g) {
        return '<div class="ct-grade ' + (g[1] ? "is-pass" : "is-fail") + '">' + (g[1] ? "✓" : "✗") + " " + g[0] + '</div>';
      }).join("");
    }

    if (picker) picker.addEventListener("input", function () { paint(picker.value); });
    if (hex) hex.addEventListener("change", function () {
      var c = hexToRgb(hex.value); if (c) paint(rgbToHex(c.r, c.g, c.b));
    });
    if (scheme) scheme.addEventListener("change", function () { paint(picker.value); });
    [fg, bg].forEach(function (el) { if (el) el.addEventListener("input", refreshContrast); });

    paint("#0e7490");
    refreshContrast();
  }

  function boot() { document.querySelectorAll(".color-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
