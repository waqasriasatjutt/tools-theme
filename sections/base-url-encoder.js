(function () {
  function init(root) {
    if (!root || root.__ueReady) return;
    root.__ueReady = true;
    var input = root.querySelector(".ue-input");
    var output = root.querySelector(".ue-output");
    var error = root.querySelector(".ue-error");
    var status = root.querySelector(".ue-status");
    function showError(m){ if(!error)return; error.hidden=!m; error.textContent=m||""; }
    function setStatus(t,ok){ if(!status)return; status.textContent=t||""; status.classList.toggle("is-ok",!!ok); if(t){clearTimeout(setStatus.__t); setStatus.__t=setTimeout(function(){status.textContent="";status.classList.remove("is-ok");},1500);} }
    function enc(){ var t=(input&&input.value)||""; if(!t){if(output)output.value="";showError("");return;} try{if(output)output.value=encodeURIComponent(t);showError("");}catch(e){if(output)output.value="";showError("Encode failed: "+(e.message||e));} }
    function dec(){ var t=(input&&input.value)||""; if(!t){if(output)output.value="";showError("");return;} try{if(output)output.value=decodeURIComponent(t);showError("");}catch(e){if(output)output.value="";showError("Not valid percent-encoding: "+(e.message||e));} }
    var bE=root.querySelector(".ue-encode"); if(bE) bE.addEventListener("click",enc);
    var bD=root.querySelector(".ue-decode"); if(bD) bD.addEventListener("click",dec);
    var bC=root.querySelector(".ue-clear"); if(bC) bC.addEventListener("click",function(){if(input)input.value="";if(output)output.value="";showError("");if(input)input.focus();});
    var bCp=root.querySelector(".ue-copy"); if(bCp) bCp.addEventListener("click",function(){var t=(output&&output.value)||"";if(!t){setStatus("nothing to copy");return;}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){setStatus("copied",true);},function(){setStatus("copy failed");});else setStatus("copy failed");});
  }
  function boot(){ document.querySelectorAll(".url-encoder-tool").forEach(init); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
  setTimeout(boot,200); setTimeout(boot,1200);
})();
