/* JSON Formatter runtime — vanilla JS, no React on the live page.
 * Discovers every instance via .json-formatter-tool class so multiple instances
 * on the same page (or layout/portal injection variations) all work.
 */
(function () {
  function init(root) {
    if (!root || root.__jfReady) return;
    root.__jfReady = true;

    var input  = root.querySelector(".jf-input");
    var output = root.querySelector(".jf-output");
    var error  = root.querySelector(".jf-error");
    var status = root.querySelector(".jf-status");
    var bFmt   = root.querySelector(".jf-format");
    var bMin   = root.querySelector(".jf-minify");
    var bClr   = root.querySelector(".jf-clear");
    var bCopy  = root.querySelector(".jf-copy");

    function showError(msg) {
      if (!error) return;
      error.hidden = !msg;
      error.textContent = msg || "";
    }

    function transform(pretty) {
      var raw = (input && input.value || "").trim();
      if (!raw) {
        if (output) output.value = "";
        showError("");
        return;
      }
      try {
        var obj = JSON.parse(raw);
        if (output) output.value = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
        showError("");
      } catch (e) {
        if (output) output.value = "";
        showError("Invalid JSON: " + (e && e.message ? e.message : String(e)));
      }
    }

    function setStatus(text, ok) {
      if (!status) return;
      status.textContent = text || "";
      if (ok) status.classList.add("is-ok");
      else status.classList.remove("is-ok");
      if (text) {
        clearTimeout(setStatus.__t);
        setStatus.__t = setTimeout(function () {
          status.textContent = "";
          status.classList.remove("is-ok");
        }, 1500);
      }
    }

    if (bFmt)  bFmt.addEventListener("click", function () { transform(true);  });
    if (bMin)  bMin.addEventListener("click", function () { transform(false); });
    if (bClr)  bClr.addEventListener("click", function () {
      if (input) input.value = "";
      if (output) output.value = "";
      showError("");
      if (input) input.focus();
    });
    if (bCopy) bCopy.addEventListener("click", function () {
      var text = (output && output.value) || "";
      if (!text) { setStatus("nothing to copy"); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { setStatus("copied", true); },
          function () { fallbackCopy(text); }
        );
      } else {
        fallbackCopy(text);
      }
    });

    function fallbackCopy(text) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setStatus("copied", true);
      } catch (_e) {
        setStatus("copy failed");
      }
    }

    // Ctrl/Cmd+Enter from the input also formats
    if (input) input.addEventListener("keydown", function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
        ev.preventDefault();
        transform(true);
      }
    });
  }

  function bootstrap() {
    var roots = document.querySelectorAll(".json-formatter-tool");
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
  // Re-scan on a short delay too, so a GrapesJS-canvas drop or AJAX insert still wires up.
  setTimeout(bootstrap, 200);
  setTimeout(bootstrap, 1200);
})();
