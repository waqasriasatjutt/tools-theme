(function () {
  function init(root) {
    if (!root || root.__imgReady) return;
    root.__imgReady = true;

    var zone = root.querySelector(".img-dropzone");
    var input = root.querySelector(".img-file-input");
    var browse = root.querySelector(".img-browse-btn");
    var mode = root.querySelector(".img-mode");
    var wEl = root.querySelector(".img-w");
    var hEl = root.querySelector(".img-h");
    var keepAR = root.querySelector(".img-keep-aspect");
    var qSlider = root.querySelector(".img-quality");
    var qVal = root.querySelector(".img-quality-val");
    var fmt = root.querySelector(".img-format");
    var process = root.querySelector(".img-process");
    var dlAll = root.querySelector(".img-download-all");
    var clear = root.querySelector(".img-clear");
    var status = root.querySelector(".img-status");
    var results = root.querySelector(".img-results");

    var files = [];
    var processed = [];

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg || "";
      status.classList.toggle("is-ok", kind === "ok");
      status.classList.toggle("is-err", kind === "err");
    }

    function updateModeVisibility() {
      var m = mode.value;
      root.querySelectorAll(".img-when-resize").forEach(function (el) {
        el.style.display = m === "resize" ? "" : "none";
      });
      root.querySelectorAll(".img-when-compress").forEach(function (el) {
        el.style.display = m === "compress" ? "" : "none";
      });
    }
    if (mode) {
      mode.addEventListener("change", updateModeVisibility);
      updateModeVisibility();
    }

    if (qSlider && qVal) {
      qSlider.addEventListener("input", function () { qVal.textContent = qSlider.value; });
    }

    function handleFiles(list) {
      files = Array.from(list || []).filter(function (f) { return f.type.indexOf("image/") === 0; });
      renderResults();
      setStatus(files.length ? files.length + " image(s) ready — click Process all" : "", null);
    }

    if (browse) browse.addEventListener("click", function (e) { e.stopPropagation(); input.click(); });
    if (zone) {
      zone.addEventListener("click", function () { input.click(); });
      zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("is-drag"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("is-drag"); });
      zone.addEventListener("drop", function (e) {
        e.preventDefault(); zone.classList.remove("is-drag");
        handleFiles(e.dataTransfer.files);
      });
    }
    if (input) input.addEventListener("change", function () { handleFiles(input.files); });

    function loadImage(file) {
      return new Promise(function (resolve, reject) {
        var fr = new FileReader();
        fr.onerror = reject;
        fr.onload = function () {
          var img = new Image();
          img.onload = function () { resolve(img); };
          img.onerror = reject;
          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      });
    }

    function processOne(file) {
      return loadImage(file).then(function (img) {
        var m = mode.value;
        var canvas = document.createElement("canvas");
        var targetW = img.width, targetH = img.height;

        if (m === "resize") {
          var ww = parseInt(wEl.value, 10) || 0;
          var hh = parseInt(hEl.value, 10) || 0;
          if (keepAR && keepAR.checked) {
            if (ww && !hh) { targetW = ww; targetH = Math.round(img.height * (ww / img.width)); }
            else if (hh && !ww) { targetH = hh; targetW = Math.round(img.width * (hh / img.height)); }
            else if (ww && hh) { targetW = ww; targetH = Math.round(img.height * (ww / img.width)); }
          } else {
            if (ww) targetW = ww;
            if (hh) targetH = hh;
          }
        }

        canvas.width = targetW;
        canvas.height = targetH;
        var ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetW, targetH);

        var outFormat = fmt.value === "same" ? (file.type || "image/png") : fmt.value;
        var q = m === "compress" ? (parseInt(qSlider.value, 10) / 100) : 0.92;

        return new Promise(function (resolve) {
          canvas.toBlob(function (blob) {
            resolve({
              orig: file, blob: blob,
              outFormat: outFormat,
              w: targetW, h: targetH,
              origSize: file.size, newSize: blob ? blob.size : 0,
            });
          }, outFormat, q);
        });
      });
    }

    function renderResults() {
      if (!results) return;
      results.innerHTML = "";
      processed.forEach(function (p, i) {
        var card = document.createElement("div");
        card.className = "img-card";
        var url = URL.createObjectURL(p.blob);
        var ext = (p.outFormat.split("/")[1] || "img").replace("jpeg", "jpg");
        var name = p.orig.name.replace(/\.[^.]+$/, "") + "." + ext;
        var saved = p.origSize ? Math.max(0, Math.round((1 - p.newSize / p.origSize) * 100)) : 0;
        card.innerHTML =
          '<img class="img-card-preview" src="' + url + '" alt="" />' +
          '<div class="img-card-name">' + name + '</div>' +
          '<div class="img-card-meta">' + p.w + '×' + p.h + ' · ' + fmtBytes(p.newSize) +
          (p.origSize ? ' (was ' + fmtBytes(p.origSize) + ', −' + saved + '%)' : '') + '</div>' +
          '<div class="img-card-actions">' +
          '<a class="btn btn-primary" data-i="' + i + '" data-act="dl" href="' + url + '" download="' + name + '">Download</a>' +
          '</div>';
        results.appendChild(card);
      });
      if (!processed.length && files.length) {
        results.innerHTML = '<p style="color:var(--muted);font-style:italic;padding:14px;">' +
          files.length + ' file(s) waiting — click <strong>Process all</strong>.</p>';
      }
    }

    function fmtBytes(b) {
      if (!b) return "0 B";
      var u = ["B","KB","MB","GB"]; var i = 0;
      while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
      return b.toFixed(b < 10 ? 1 : 0) + " " + u[i];
    }

    if (process) process.addEventListener("click", function () {
      if (!files.length) { setStatus("Drop or browse some images first.", "err"); return; }
      setStatus("Processing… 0/" + files.length);
      processed = [];
      var seq = Promise.resolve();
      files.forEach(function (f, i) {
        seq = seq.then(function () {
          return processOne(f).then(function (res) {
            processed.push(res);
            setStatus("Processing… " + processed.length + "/" + files.length);
            renderResults();
          });
        });
      });
      seq.then(function () {
        setStatus("Done — " + processed.length + " image(s) processed.", "ok");
      }).catch(function (e) {
        setStatus("Error: " + (e.message || e), "err");
      });
    });

    if (dlAll) dlAll.addEventListener("click", function () {
      if (!processed.length) { setStatus("Process images first.", "err"); return; }
      processed.forEach(function (p, i) {
        setTimeout(function () {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(p.blob);
          var ext = (p.outFormat.split("/")[1] || "img").replace("jpeg", "jpg");
          a.download = p.orig.name.replace(/\.[^.]+$/, "") + "." + ext;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }, i * 220);
      });
    });

    if (clear) clear.addEventListener("click", function () {
      files = []; processed = [];
      if (input) input.value = "";
      renderResults();
      setStatus("");
    });
  }

  function boot() { document.querySelectorAll(".image-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
