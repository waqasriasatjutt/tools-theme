(function () {
  var MARKED_URL = "https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js";
  var TURNDOWN_URL = "https://cdn.jsdelivr.net/npm/turndown@7.2.0/dist/turndown.js";
  var markedPromise = null, turndownPromise = null;

  function loadScript(url, check) {
    return new Promise(function (resolve, reject) {
      if (check()) return resolve();
      var s = document.createElement("script");
      s.src = url; s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Failed to load " + url)); };
      document.head.appendChild(s);
    });
  }

  function ensureMarked() {
    if (markedPromise) return markedPromise;
    markedPromise = loadScript(MARKED_URL, function () { return typeof window.marked !== "undefined"; });
    return markedPromise;
  }
  function ensureTurndown() {
    if (turndownPromise) return turndownPromise;
    turndownPromise = loadScript(TURNDOWN_URL, function () { return typeof window.TurndownService !== "undefined"; });
    return turndownPromise;
  }

  function sanitize(html) {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/javascript:/gi, "");
  }

  function init(root) {
    if (!root || root.__mdReady) return;
    root.__mdReady = true;
    var input = root.querySelector(".md-input");
    var output = root.querySelector(".md-output");
    var preview = root.querySelector(".md-preview");
    var copy = root.querySelector(".md-copy");
    var clear = root.querySelector(".md-clear");
    var status = root.querySelector(".md-status");
    var srcLabel = root.querySelector(".md-source-label");
    var tgtLabel = root.querySelector(".md-target-label");
    var tabs = root.querySelectorAll(".md-tab");

    var mode = "md2html";

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg || "";
      status.classList.toggle("is-ok", kind === "ok");
    }

    function render() {
      var src = input.value || "";
      if (mode === "md2html") {
        ensureMarked().then(function () {
          var html = window.marked.parse(src, { breaks: true, gfm: true });
          output.value = html;
          preview.innerHTML = sanitize(html);
        }).catch(function (e) { setStatus(e.message, null); });
      } else {
        ensureTurndown().then(function () {
          var td = new window.TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
          var md = td.turndown(src);
          output.value = md;
          ensureMarked().then(function () {
            preview.innerHTML = sanitize(window.marked.parse(md, { breaks: true, gfm: true }));
          });
        }).catch(function (e) { setStatus(e.message, null); });
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        mode = tab.dataset.mode;
        if (srcLabel) srcLabel.textContent = mode === "md2html" ? "Markdown" : "HTML";
        if (tgtLabel) tgtLabel.textContent = mode === "md2html" ? "HTML output" : "Markdown output";
        if (mode === "html2md" && /^# Hello/.test(input.value)) {
          input.value = "<h1>Hello, world!</h1>\n<p>This is <strong>bold</strong> and this is <em>italic</em>.</p>\n<ul><li>A list item</li><li>Another item</li></ul>\n<p><a href=\"https://example.com\">A link</a></p>\n<pre><code>console.log('code block');</code></pre>";
        }
        render();
      });
    });

    if (copy) copy.addEventListener("click", function () {
      if (!output.value) { setStatus("Nothing to copy.", null); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(output.value).then(function () { setStatus("Copied", "ok"); setTimeout(function () { setStatus(""); }, 1200); });
    });
    if (clear) clear.addEventListener("click", function () { input.value = ""; render(); });

    var dt;
    input.addEventListener("input", function () {
      clearTimeout(dt); dt = setTimeout(render, 200);
    });
    render();
  }

  function boot() { document.querySelectorAll(".markdown-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
