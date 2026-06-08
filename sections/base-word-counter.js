(function () {
  var STOPWORDS = new Set(("a an the and or but if then else of to in on at by for from with as is are was were be been being it its this that these those i you he she we they me him her us them my your his their our".split(" ")));

  function init(root) {
    if (!root || root.__wcReady) return;
    root.__wcReady = true;
    var input = root.querySelector(".word-input");
    var w = root.querySelector(".word-w");
    var c = root.querySelector(".word-c");
    var cns = root.querySelector(".word-cns");
    var s = root.querySelector(".word-s");
    var p = root.querySelector(".word-p");
    var l = root.querySelector(".word-l");
    var rt = root.querySelector(".word-rt");
    var st = root.querySelector(".word-st");
    var top = root.querySelector(".word-top");
    var clearBtn = root.querySelector(".word-clear");
    var pasteBtn = root.querySelector(".word-paste");

    function humanTime(sec) {
      if (sec < 60) return sec + " sec";
      var m = Math.floor(sec / 60); var rem = sec % 60;
      return m + " min " + (rem ? rem + " sec" : "");
    }

    function update() {
      var t = input.value || "";
      var words = (t.trim().match(/\S+/g) || []);
      var sentences = (t.match(/[^.!?]+[.!?]+/g) || (t.trim() ? [t] : []));
      var paragraphs = t.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      var lines = t.split(/\n/);
      w.textContent = words.length.toLocaleString();
      c.textContent = t.length.toLocaleString();
      cns.textContent = t.replace(/\s+/g, "").length.toLocaleString();
      s.textContent = sentences.length.toLocaleString();
      p.textContent = paragraphs.length.toLocaleString();
      l.textContent = lines.length.toLocaleString();
      var readSec = Math.ceil(words.length / 200 * 60);
      var speakSec = Math.ceil(words.length / 130 * 60);
      rt.textContent = humanTime(readSec);
      st.textContent = humanTime(speakSec);

      var counts = {};
      words.forEach(function (raw) {
        var x = raw.toLowerCase().replace(/[^a-z0-9'-]/g, "");
        if (!x || x.length < 3 || STOPWORDS.has(x)) return;
        counts[x] = (counts[x] || 0) + 1;
      });
      var sorted = Object.entries(counts).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 10);
      top.innerHTML = sorted.map(function (kv) {
        return '<li><code>' + kv[0] + '</code> — ' + kv[1] + '</li>';
      }).join("") || '<li style="color:var(--muted);font-style:italic;">Type or paste text above to see top words.</li>';
    }

    if (clearBtn) clearBtn.addEventListener("click", function () { input.value = ""; update(); input.focus(); });
    if (pasteBtn) pasteBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (t) { input.value = t; update(); });
      }
    });
    input.addEventListener("input", update);
    update();
  }
  function boot() { document.querySelectorAll(".word-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
