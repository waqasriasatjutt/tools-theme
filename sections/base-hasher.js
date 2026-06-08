(function () {
  function toHex(buf){
    var b = new Uint8Array(buf); var s = "";
    for (var i = 0; i < b.length; i++) s += ("0" + b[i].toString(16)).slice(-2);
    return s;
  }
  function init(root){
    if (!root || root.__htReady) return; root.__htReady = true;
    var input = root.querySelector(".ht-input");
    var algo = root.querySelector(".ht-algo");
    var output = root.querySelector(".ht-output");
    var error = root.querySelector(".ht-error");
    var status = root.querySelector(".ht-status");
    function showError(m){ if(!error)return; error.hidden=!m; error.textContent=m||""; }
    function setStatus(t,ok){ if(!status)return; status.textContent=t||""; status.classList.toggle("is-ok",!!ok); if(t){clearTimeout(setStatus.__t); setStatus.__t=setTimeout(function(){status.textContent="";status.classList.remove("is-ok");},1500);} }
    function go(){
      var t = (input && input.value) || "";
      if (!t) { if (output) output.value = ""; showError(""); return; }
      if (!(window.crypto && crypto.subtle)) { showError("Your browser doesn't expose SubtleCrypto — try a modern Chrome / Firefox / Safari."); return; }
      var alg = (algo && algo.value) || "SHA-256";
      crypto.subtle.digest(alg, new TextEncoder().encode(t)).then(function(buf){
        if (output) output.value = toHex(buf);
        showError("");
      }).catch(function(e){ if (output) output.value=""; showError("Hash failed: " + (e.message || e)); });
    }
    var bH = root.querySelector(".ht-hash"); if (bH) bH.addEventListener("click", go);
    var bC = root.querySelector(".ht-clear"); if (bC) bC.addEventListener("click", function(){ if(input)input.value=""; if(output)output.value=""; showError(""); if(input)input.focus(); });
    var bCp = root.querySelector(".ht-copy"); if (bCp) bCp.addEventListener("click", function(){ var t=(output&&output.value)||""; if(!t){setStatus("nothing to copy");return;} if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){setStatus("copied",true);},function(){setStatus("copy failed");}); else setStatus("copy failed"); });
  }
  function boot(){ document.querySelectorAll(".hash-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
