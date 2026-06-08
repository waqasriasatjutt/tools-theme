(function () {
  function init(root) {
    if (!root || root.__b64Ready) return;
    root.__b64Ready = true;
    var input = root.querySelector(".b64-input");
    var output = root.querySelector(".b64-output");
    var error = root.querySelector(".b64-error");
    var status = root.querySelector(".b64-status");
    function showError(msg) { if (!error) return; error.hidden = !msg; error.textContent = msg || ""; }
    function setStatus(text, ok) {
      if (!status) return;
      status.textContent = text || "";
      status.classList.toggle("is-ok", !!ok);
      if (text) { clearTimeout(setStatus.__t); setStatus.__t = setTimeout(function(){status.textContent="";status.classList.remove("is-ok");}, 1500); }
    }
    function encode() {
      var t = (input && input.value) || "";
      if (!t) { if (output) output.value = ""; showError(""); return; }
      try {
        var bytes = new TextEncoder().encode(t);
        var bin = ""; for (var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
        if (output) output.value = btoa(bin);
        showError("");
      } catch (e) { if (output) output.value=""; showError("Encode failed: " + (e.message || e)); }
    }
    function decode() {
      var t = ((input && input.value) || "").trim();
      if (!t) { if (output) output.value = ""; showError(""); return; }
      try {
        var bin = atob(t.replace(/\s+/g, ""));
        var bytes = new Uint8Array(bin.length);
        for (var i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
        if (output) output.value = new TextDecoder().decode(bytes);
        showError("");
      } catch (e) { if (output) output.value=""; showError("Not valid Base64: " + (e.message || e)); }
    }
    var bE = root.querySelector(".b64-encode"); if (bE) bE.addEventListener("click", encode);
    var bD = root.querySelector(".b64-decode"); if (bD) bD.addEventListener("click", decode);
    var bC = root.querySelector(".b64-clear"); if (bC) bC.addEventListener("click", function(){ if (input) input.value=""; if (output) output.value=""; showError(""); if (input) input.focus(); });
    var bCopy = root.querySelector(".b64-copy"); if (bCopy) bCopy.addEventListener("click", function(){
      var text = (output && output.value) || ""; if (!text) { setStatus("nothing to copy"); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){setStatus("copied", true);}, function(){setStatus("copy failed");});
      else setStatus("copy failed");
    });
  }
  function boot() { document.querySelectorAll(".base64-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
