(function () {
  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function pretty(s) { try { return JSON.stringify(JSON.parse(s), null, 2); } catch (_e) { return s; } }
  function init(root) {
    if (!root || root.__jwtReady) return;
    root.__jwtReady = true;
    var input = root.querySelector(".jwt-input");
    var hOut = root.querySelector(".jwt-header");
    var pOut = root.querySelector(".jwt-payload");
    var sOut = root.querySelector(".jwt-signature");
    var error = root.querySelector(".jwt-error");
    var status = root.querySelector(".jwt-status");
    function showError(m){ if(!error)return; error.hidden=!m; error.textContent=m||""; }
    function setStatus(t,ok){ if(!status)return; status.textContent=t||""; status.classList.toggle("is-ok",!!ok); if(t){clearTimeout(setStatus.__t); setStatus.__t=setTimeout(function(){status.textContent="";status.classList.remove("is-ok");},1500);} }
    function decode() {
      var raw = ((input && input.value) || "").trim();
      if (!raw) { if (hOut) hOut.value=""; if (pOut) pOut.value=""; if (sOut) sOut.value=""; showError(""); return; }
      var parts = raw.split(".");
      if (parts.length < 2) { showError("A JWT has 3 dot-separated parts (header.payload.signature). Got " + parts.length + "."); if (hOut) hOut.value=""; if (pOut) pOut.value=""; if (sOut) sOut.value=""; return; }
      try {
        if (hOut) hOut.value = pretty(b64urlDecode(parts[0]));
        if (pOut) pOut.value = pretty(b64urlDecode(parts[1]));
        if (sOut) sOut.value = parts[2] || "(no signature)";
        showError("");
      } catch (e) { showError("Decode failed: " + (e.message || e)); }
    }
    var bD = root.querySelector(".jwt-decode"); if (bD) bD.addEventListener("click", decode);
    var bC = root.querySelector(".jwt-clear"); if (bC) bC.addEventListener("click", function(){ if(input)input.value=""; if(hOut)hOut.value=""; if(pOut)pOut.value=""; if(sOut)sOut.value=""; showError(""); if(input)input.focus(); });
    if (input) input.addEventListener("paste", function(){ setTimeout(decode, 30); });
  }
  function boot(){ document.querySelectorAll(".jwt-decoder-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
