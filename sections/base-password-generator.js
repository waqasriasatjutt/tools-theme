(function () {
  var WORDLIST = ["correct","horse","battery","staple","atlas","brave","candle","dragon","ember","forest","galaxy","harbor","island","jungle","keystone","lantern","meadow","nebula","oasis","prism","quartz","river","summit","tundra","umbrella","velvet","willow","xenon","yellow","zephyr","amber","bridge","copper","dahlia","echo","fern","granite","hazel","ivory","jade","koala","linden","marble","nettle","onyx","pebble","quill","raven","silver","topaz"];

  function rint(max) {
    var a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] % max;
  }

  function init(root) {
    if (!root || root.__pwReady) return;
    root.__pwReady = true;
    var out = root.querySelector(".pw-output");
    var roll = root.querySelector(".pw-roll");
    var copy = root.querySelector(".pw-copy");
    var len = root.querySelector(".pw-len");
    var lenVal = root.querySelector(".pw-len-val");
    var up = root.querySelector(".pw-up");
    var low = root.querySelector(".pw-low");
    var num = root.querySelector(".pw-num");
    var sym = root.querySelector(".pw-sym");
    var noAmbig = root.querySelector(".pw-no-ambig");
    var mode = root.querySelector(".pw-mode");
    var bar = root.querySelector(".pw-bar-fill");
    var lbl = root.querySelector(".pw-strength-label");
    var ent = root.querySelector(".pw-entropy");

    function charset() {
      var U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var L = "abcdefghijklmnopqrstuvwxyz";
      var N = "0123456789";
      var S = "!@#$%^&*()-_=+[]{};:,.<>/?~";
      var pool = "";
      if (up.checked) pool += U;
      if (low.checked) pool += L;
      if (num.checked) pool += N;
      if (sym.checked) pool += S;
      if (noAmbig.checked) pool = pool.replace(/[0OIl1|`'"]/g, "");
      return pool;
    }

    function genRandom() {
      var pool = charset();
      if (!pool) { out.value = ""; lbl.textContent = "select at least one set"; bar.style.width = "0%"; ent.textContent = ""; return; }
      var n = parseInt(len.value, 10) || 20;
      var s = "";
      for (var i = 0; i < n; i++) s += pool[rint(pool.length)];
      out.value = s;
      var bits = n * Math.log2(pool.length);
      return { value: s, bits: bits };
    }

    function genPassphrase() {
      var n = Math.max(3, Math.round((parseInt(len.value, 10) || 20) / 5));
      var words = [];
      for (var i = 0; i < n; i++) words.push(WORDLIST[rint(WORDLIST.length)]);
      var s = words.join("-");
      out.value = s;
      var bits = n * Math.log2(WORDLIST.length);
      return { value: s, bits: bits };
    }

    function meter(bits) {
      var pct = Math.min(100, Math.round(bits / 128 * 100));
      bar.style.width = pct + "%";
      var label;
      if (bits < 28) label = "very weak";
      else if (bits < 48) label = "weak";
      else if (bits < 80) label = "fair";
      else if (bits < 100) label = "strong";
      else label = "excellent";
      lbl.textContent = label;
      ent.textContent = "≈ " + Math.round(bits) + " bits of entropy";
    }

    function regen() {
      var r;
      if (mode.value === "passphrase") r = genPassphrase();
      else r = genRandom();
      if (r) meter(r.bits);
    }

    if (len && lenVal) len.addEventListener("input", function () { lenVal.textContent = len.value; regen(); });
    [up, low, num, sym, noAmbig, mode].forEach(function (el) { if (el) el.addEventListener("change", regen); });
    if (roll) roll.addEventListener("click", regen);
    if (copy) copy.addEventListener("click", function () {
      if (!out.value) return;
      if (navigator.clipboard) navigator.clipboard.writeText(out.value);
      var orig = copy.textContent; copy.textContent = "✓"; setTimeout(function () { copy.textContent = orig; }, 900);
    });
    regen();
  }
  function boot() { document.querySelectorAll(".password-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
