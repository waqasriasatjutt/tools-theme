/* PDF to Word — client-side conversion using pdf.js (Mozilla) + docx (dolanmiu).
 * - Drag-drop multi-file upload
 * - Extract text via pdf.js per page (or OCR via Tesseract.js if 'OCR mode' on)
 * - Group items into paragraphs by line height + vertical gap
 * - Detect headings by font size (top 5% → H1, 10-20% → H2, etc.) if 'headings' on
 * - Generate .docx via the docx library
 * - Per-file download + preview
 * - All in browser; nothing uploaded.
 */
(function () {
  var PDFJS_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
  var PDFJS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  var DOCX_URL = "https://unpkg.com/docx@8.5.0/build/index.umd.js";
  var TESS_URL = "https://unpkg.com/tesseract.js@5/dist/tesseract.min.js";

  // ── Dynamic CDN loader ──────────────────────────────────────────
  var loaded = {};
  function loadScript(url) {
    if (loaded[url]) return loaded[url];
    loaded[url] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { delete loaded[url]; reject(new Error("Failed to load " + url)); };
      document.head.appendChild(s);
    });
    return loaded[url];
  }
  function loadPdfJs() {
    return loadScript(PDFJS_URL).then(function () {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      }
      return window.pdfjsLib;
    });
  }
  function loadDocx() { return loadScript(DOCX_URL).then(function () { return window.docx; }); }
  function loadTesseract() { return loadScript(TESS_URL).then(function () { return window.Tesseract; }); }

  // ── State per instance ─────────────────────────────────────────
  function makeState() {
    return {
      files: [],       // [{ id, file, name, sizeBytes, status, progress, paragraphs, docxBlob, error }]
      nextId: 1,
    };
  }

  function fmtSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1024*1024) return (b/1024).toFixed(1) + " KB";
    return (b/1024/1024).toFixed(2) + " MB";
  }

  // ── Extract text from a PDF via pdf.js → array of paragraph objects.
  function extractParagraphs(arrayBuffer, onProgress) {
    return loadPdfJs().then(function (pdfjsLib) {
      return pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    }).then(function (pdf) {
      var total = pdf.numPages;
      var paragraphs = [];
      var p = Promise.resolve();
      for (var pageNum = 1; pageNum <= total; pageNum++) {
        (function (pn) {
          p = p.then(function () { return pdf.getPage(pn); }).then(function (page) {
            return page.getTextContent().then(function (content) {
              // Group items into lines based on Y position, then lines into paragraphs based on vertical gap.
              var items = content.items.map(function (it) {
                var t = it.transform;
                return {
                  str: it.str,
                  x: t[4], y: t[5],
                  fontSize: Math.abs(t[3]) || Math.abs(t[0]),
                  hasEOL: !!it.hasEOL,
                  width: it.width,
                };
              });
              // Sort items: top to bottom (Y desc since PDF Y is bottom-origin) then left to right
              items.sort(function (a, b) {
                if (Math.abs(a.y - b.y) > 4) return b.y - a.y;
                return a.x - b.x;
              });
              // Group into lines
              var lines = [];
              var cur = null;
              items.forEach(function (it) {
                if (!cur || Math.abs(cur.y - it.y) > 4) {
                  cur = { y: it.y, fontSize: it.fontSize, items: [it] };
                  lines.push(cur);
                } else {
                  cur.items.push(it);
                  if (it.fontSize > cur.fontSize) cur.fontSize = it.fontSize;
                }
              });
              // Render each line into text
              var lineObjs = lines.map(function (ln) {
                ln.items.sort(function (a, b) { return a.x - b.x; });
                return { text: ln.items.map(function (i) { return i.str; }).join(" ").replace(/\s+/g, " ").trim(),
                         y: ln.y, fontSize: ln.fontSize };
              }).filter(function (l) { return l.text.length > 0; });
              // Group lines into paragraphs by vertical gap
              for (var i = 0; i < lineObjs.length; i++) {
                var prev = paragraphs.length ? paragraphs[paragraphs.length - 1] : null;
                var L = lineObjs[i];
                var sameParagraph = prev
                  && prev.page === pn
                  && Math.abs(prev.lastFontSize - L.fontSize) < 1.5
                  && (i > 0 && Math.abs(lineObjs[i - 1].y - L.y) < L.fontSize * 1.5);
                if (sameParagraph) {
                  prev.text += " " + L.text;
                  prev.lastFontSize = L.fontSize;
                } else {
                  paragraphs.push({ text: L.text, fontSize: L.fontSize, lastFontSize: L.fontSize, page: pn });
                }
              }
              if (onProgress) onProgress(pn / total);
            });
          });
        })(pageNum);
      }
      return p.then(function () { return paragraphs; });
    });
  }

  // ── OCR fallback: render each page to canvas, run Tesseract ──
  function extractParagraphsViaOCR(arrayBuffer, onProgress) {
    return Promise.all([loadPdfJs(), loadTesseract()]).then(function (mods) {
      var pdfjsLib = mods[0];
      var Tesseract = mods[1];
      return pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function (pdf) {
        var total = pdf.numPages;
        var paragraphs = [];
        var p = Promise.resolve();
        for (var pageNum = 1; pageNum <= total; pageNum++) {
          (function (pn) {
            p = p.then(function () { return pdf.getPage(pn); }).then(function (page) {
              var viewport = page.getViewport({ scale: 2 });
              var canvas = document.createElement("canvas");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              var ctx = canvas.getContext("2d");
              return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                return Tesseract.recognize(canvas, "eng");
              }).then(function (res) {
                var text = (res.data && res.data.text) || "";
                text.split(/\n{2,}/).forEach(function (para) {
                  var t = para.replace(/\s+/g, " ").trim();
                  if (t) paragraphs.push({ text: t, fontSize: 11, lastFontSize: 11, page: pn });
                });
                if (onProgress) onProgress(pn / total);
              });
            });
          })(pageNum);
        }
        return p.then(function () { return paragraphs; });
      });
    });
  }

  // ── Detect heading level from font size distribution
  function classifyHeadings(paragraphs) {
    if (!paragraphs.length) return paragraphs;
    var sizes = paragraphs.map(function (p) { return p.fontSize; }).sort(function (a, b) { return a - b; });
    var median = sizes[Math.floor(sizes.length / 2)];
    var max = sizes[sizes.length - 1];
    var h1 = max - (max - median) * 0.15;
    var h2 = median + (max - median) * 0.5;
    var h3 = median + (max - median) * 0.2;
    return paragraphs.map(function (p) {
      var level = null;
      if (p.text.length < 200) {
        if (p.fontSize >= h1) level = "H1";
        else if (p.fontSize >= h2) level = "H2";
        else if (p.fontSize >= h3) level = "H3";
      }
      return Object.assign({}, p, { heading: level });
    });
  }

  // ── Build .docx blob from paragraphs
  function buildDocx(paragraphs, useHeadings) {
    return loadDocx().then(function (docx) {
      var paras = paragraphs.map(function (p) {
        var opts = {};
        if (useHeadings && p.heading) {
          if (p.heading === "H1") opts.heading = docx.HeadingLevel.HEADING_1;
          else if (p.heading === "H2") opts.heading = docx.HeadingLevel.HEADING_2;
          else opts.heading = docx.HeadingLevel.HEADING_3;
        }
        return new docx.Paragraph(Object.assign({
          children: [new docx.TextRun({ text: p.text })],
          spacing: { after: 160 },
        }, opts));
      });
      var doc = new docx.Document({
        styles: {
          paragraphStyles: [
            { id: "Normal", name: "Normal", run: { font: "Calibri", size: 22 }, paragraph: { spacing: { line: 276 } } },
          ],
        },
        sections: [{ properties: {}, children: paras }],
      });
      return docx.Packer.toBlob(doc);
    });
  }

  function saveBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  // ── Render file list row
  function renderFile(state, container, fObj) {
    var row = document.createElement("div");
    row.className = "p2w-file";
    row.dataset.fileId = fObj.id;
    var left = document.createElement("div");
    left.innerHTML =
      '<div class="p2w-file-name"></div>' +
      '<div class="p2w-file-meta"></div>' +
      '<div class="p2w-file-bar-wrap"><div class="p2w-file-bar"></div></div>' +
      '<div class="p2w-file-status"></div>';
    left.querySelector(".p2w-file-name").textContent = fObj.name;
    left.querySelector(".p2w-file-meta").textContent = fmtSize(fObj.sizeBytes);
    var right = document.createElement("div");
    right.className = "p2w-file-actions";
    right.innerHTML =
      '<button type="button" class="btn p2w-file-preview">Preview</button>' +
      '<button type="button" class="btn btn-primary p2w-file-download" disabled>Download</button>' +
      '<button type="button" class="btn p2w-file-remove">Remove</button>';
    row.appendChild(left); row.appendChild(right);
    container.appendChild(row);

    right.querySelector(".p2w-file-remove").addEventListener("click", function () {
      state.files = state.files.filter(function (x) { return x.id !== fObj.id; });
      row.remove();
      if (!state.files.length) {
        var empty = document.createElement("div");
        empty.className = "p2w-empty";
        empty.textContent = "No files yet. Drop a PDF above to get started.";
        container.appendChild(empty);
      }
    });
    right.querySelector(".p2w-file-preview").addEventListener("click", function () {
      if (!fObj.paragraphs) return;
      showPreview(fObj);
    });
    right.querySelector(".p2w-file-download").addEventListener("click", function () {
      if (!fObj.docxBlob) return;
      var name = fObj.name.replace(/\.pdf$/i, "") + ".docx";
      saveBlob(fObj.docxBlob, name);
    });
    return row;
  }

  function updateFileRow(fObj) {
    var row = document.querySelector('.p2w-file[data-file-id="' + fObj.id + '"]');
    if (!row) return;
    var bar = row.querySelector(".p2w-file-bar");
    var status = row.querySelector(".p2w-file-status");
    var dl = row.querySelector(".p2w-file-download");
    if (bar) bar.style.width = Math.round((fObj.progress || 0) * 100) + "%";
    status.textContent = fObj.status || "";
    status.classList.toggle("is-ok", fObj.status === "Ready");
    status.classList.toggle("is-err", !!fObj.error);
    if (dl) dl.disabled = !fObj.docxBlob;
  }

  var previewModal, previewBody, previewTitle;
  function showPreview(fObj) {
    if (!previewModal) return;
    previewTitle.textContent = "Preview — " + fObj.name;
    previewBody.textContent = (fObj.paragraphs || []).map(function (p) {
      return (p.heading ? "# " + p.heading + ": " : "") + p.text;
    }).join("\n\n");
    previewModal.hidden = false;
  }

  // ── Init per-instance ─────────────────────────────────────────
  function init(root) {
    if (!root || root.__p2wReady) return;
    root.__p2wReady = true;
    var state = makeState();
    var drop = root.querySelector(".p2w-dropzone");
    var fileInput = root.querySelector(".p2w-file-input");
    var filesList = root.querySelector(".p2w-files");
    var statusEl = root.querySelector(".p2w-status");
    var convertAllBtn = root.querySelector(".p2w-convert-all");
    var downloadAllBtn = root.querySelector(".p2w-download-all");
    var clearBtn = root.querySelector(".p2w-clear");
    var ocrToggle = root.querySelector(".p2w-ocr-toggle");
    var headingsToggle = root.querySelector(".p2w-headings-toggle");
    previewModal = root.querySelector(".p2w-preview-modal");
    previewBody = root.querySelector(".p2w-preview-body");
    previewTitle = root.querySelector(".p2w-preview-title");
    var previewClose = root.querySelector(".p2w-preview-close");
    // Defensive: make 100% sure the modal starts hidden no matter what CSS
    // cascade is on the page.
    if (previewModal) previewModal.hidden = true;
    function closeModal() { if (previewModal) previewModal.hidden = true; }
    if (previewClose) previewClose.addEventListener("click", closeModal);
    if (previewModal) previewModal.addEventListener("click", function (e) { if (e.target === previewModal) closeModal(); });
    // ESC key also closes the modal
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && previewModal && !previewModal.hidden) closeModal(); });

    function setStatus(text, kind) {
      if (!statusEl) return;
      statusEl.textContent = text || "";
      statusEl.classList.toggle("is-ok", kind === "ok");
      statusEl.classList.toggle("is-err", kind === "err");
      if (text) { clearTimeout(setStatus.__t); setStatus.__t = setTimeout(function () { statusEl.textContent = ""; statusEl.classList.remove("is-ok","is-err"); }, 3500); }
    }

    function addFiles(fileList) {
      // Drop the "no files" placeholder if present
      var empty = filesList.querySelector(".p2w-empty");
      if (empty) empty.remove();
      Array.from(fileList).forEach(function (f) {
        if (!/\.pdf$/i.test(f.name) && f.type !== "application/pdf") {
          setStatus("Skipped " + f.name + ": not a PDF", "err");
          return;
        }
        var obj = {
          id: state.nextId++,
          file: f,
          name: f.name,
          sizeBytes: f.size,
          status: "Queued",
          progress: 0,
        };
        state.files.push(obj);
        renderFile(state, filesList, obj);
      });
      convertAllBtn.disabled = state.files.length === 0;
    }

    // Drag-drop wiring
    drop.addEventListener("click", function (e) {
      if (e.target.closest(".p2w-browse-btn") || e.target === drop) fileInput.click();
    });
    drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
    fileInput.addEventListener("change", function (e) { if (e.target.files && e.target.files.length) addFiles(e.target.files); fileInput.value = ""; });
    ;["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-drag"); });
    });
    ;["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-drag"); });
    });
    drop.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });

    clearBtn.addEventListener("click", function () {
      state.files = [];
      filesList.innerHTML = '<div class="p2w-empty">No files yet. Drop a PDF above to get started.</div>';
      convertAllBtn.disabled = true;
      downloadAllBtn.disabled = true;
      setStatus("");
    });

    convertAllBtn.addEventListener("click", function () {
      convertOne(0);
    });

    function convertOne(idx) {
      if (idx >= state.files.length) {
        var any = state.files.some(function (f) { return f.docxBlob; });
        downloadAllBtn.disabled = !any;
        setStatus("Done — " + state.files.filter(function (f) { return f.docxBlob; }).length + " of " + state.files.length + " converted", "ok");
        return;
      }
      var fObj = state.files[idx];
      if (fObj.docxBlob) return convertOne(idx + 1);

      fObj.status = "Reading…";
      fObj.progress = 0.02;
      updateFileRow(fObj);

      var reader = new FileReader();
      reader.onload = function () {
        var buf = reader.result;
        var useOcr = !!(ocrToggle && ocrToggle.checked);
        var useHeadings = !!(headingsToggle && headingsToggle.checked);
        var extractor = useOcr ? extractParagraphsViaOCR : extractParagraphs;
        fObj.status = useOcr ? "Running OCR (slow)…" : "Extracting text…";
        updateFileRow(fObj);
        extractor(buf, function (p) {
          fObj.progress = 0.05 + p * 0.75;
          updateFileRow(fObj);
        }).then(function (paragraphs) {
          // If text extraction yielded nothing, suggest OCR
          if (!useOcr && paragraphs.length === 0) {
            fObj.error = true;
            fObj.status = "No text found — try enabling OCR mode";
            updateFileRow(fObj);
            return convertOne(idx + 1);
          }
          fObj.paragraphs = useHeadings ? classifyHeadings(paragraphs) : paragraphs;
          fObj.status = "Generating .docx…";
          fObj.progress = 0.9;
          updateFileRow(fObj);
          return buildDocx(fObj.paragraphs, useHeadings).then(function (blob) {
            fObj.docxBlob = blob;
            fObj.status = "Ready";
            fObj.progress = 1;
            updateFileRow(fObj);
            convertOne(idx + 1);
          });
        }).catch(function (e) {
          console.error("[p2w] convert error", e);
          fObj.error = true;
          fObj.status = "Error: " + (e && e.message ? e.message : String(e));
          fObj.progress = 0;
          updateFileRow(fObj);
          convertOne(idx + 1);
        });
      };
      reader.onerror = function () {
        fObj.error = true;
        fObj.status = "Failed to read file";
        updateFileRow(fObj);
        convertOne(idx + 1);
      };
      reader.readAsArrayBuffer(fObj.file);
    }

    downloadAllBtn.addEventListener("click", function () {
      // Download each as separate file (no JSZip dependency for now)
      var any = false;
      state.files.forEach(function (f) {
        if (f.docxBlob) {
          var name = f.name.replace(/\.pdf$/i, "") + ".docx";
          saveBlob(f.docxBlob, name);
          any = true;
        }
      });
      if (any) setStatus("Downloaded " + state.files.filter(function (f) { return f.docxBlob; }).length + " files", "ok");
    });
  }

  function boot() { document.querySelectorAll(".pdf2word-section").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
