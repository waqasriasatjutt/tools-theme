(function () {
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function fmtUtc(d){
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth()+1) + "-" + pad(d.getUTCDate()) + " " +
           pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + " UTC";
  }
  function fmtLocal(d){
    return d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate()) + " " +
           pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) +
           " (" + Intl.DateTimeFormat().resolvedOptions().timeZone + ")";
  }
  function fmtRelative(d){
    var diff = (Date.now() - d.getTime()) / 1000;
    var sign = diff >= 0 ? "ago" : "from now";
    diff = Math.abs(diff);
    if (diff < 60) return Math.floor(diff) + "s " + sign;
    if (diff < 3600) return Math.floor(diff/60) + "m " + sign;
    if (diff < 86400) return Math.floor(diff/3600) + "h " + sign;
    if (diff < 86400*30) return Math.floor(diff/86400) + "d " + sign;
    if (diff < 86400*365) return Math.floor(diff/86400/30) + "mo " + sign;
    return Math.floor(diff/86400/365) + "y " + sign;
  }
  function init(root){
    if (!root || root.__tsReady) return; root.__tsReady = true;
    var inUnix = root.querySelector(".ts-unix");
    var inIso = root.querySelector(".ts-iso");
    var outUtc = root.querySelector(".ts-utc");
    var outLocal = root.querySelector(".ts-local");
    var outRel = root.querySelector(".ts-relative");
    var error = root.querySelector(".ts-error");
    function showError(m){ if(!error)return; error.hidden=!m; error.textContent=m||""; }
    function update(date){
      if (!date || isNaN(date.getTime())) { if (outUtc) outUtc.value=""; if (outLocal) outLocal.value=""; if (outRel) outRel.value=""; return; }
      if (outUtc) outUtc.value = fmtUtc(date);
      if (outLocal) outLocal.value = fmtLocal(date);
      if (outRel) outRel.value = fmtRelative(date);
      showError("");
    }
    function fromUnix(){
      var v = (inUnix && inUnix.value || "").trim();
      if (!v) { update(null); return; }
      if (!/^-?\d+$/.test(v)) { showError("Unix timestamp should be an integer (seconds or milliseconds)."); update(null); return; }
      var n = parseInt(v, 10);
      // Auto-detect: if abs(n) > 10^11 it's milliseconds; otherwise seconds.
      var ms = Math.abs(n) > 1e11 ? n : n * 1000;
      var d = new Date(ms);
      if (inIso) inIso.value = d.toISOString();
      update(d);
    }
    function fromIso(){
      var v = (inIso && inIso.value || "").trim();
      if (!v) { update(null); return; }
      var d = new Date(v);
      if (isNaN(d.getTime())) { showError("Not a valid ISO date — try e.g. 2026-06-08T10:00:00Z"); update(null); return; }
      if (inUnix) inUnix.value = String(Math.floor(d.getTime() / 1000));
      update(d);
    }
    if (inUnix) inUnix.addEventListener("input", fromUnix);
    if (inIso) inIso.addEventListener("input", fromIso);
    var bNow = root.querySelector(".ts-now");
    if (bNow) bNow.addEventListener("click", function(){
      var now = Date.now();
      if (inUnix) inUnix.value = String(Math.floor(now / 1000));
      var d = new Date(now);
      if (inIso) inIso.value = d.toISOString();
      update(d);
    });
    var bClr = root.querySelector(".ts-clear");
    if (bClr) bClr.addEventListener("click", function(){
      if (inUnix) inUnix.value = "";
      if (inIso) inIso.value = "";
      update(null);
      if (inUnix) inUnix.focus();
    });
  }
  function boot(){ document.querySelectorAll(".timestamp-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
