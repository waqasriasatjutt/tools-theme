export const meta = {
  name: "PDF to Word converter",
  slug: "base-pdf-to-word",
  category: "Base • Tools",
  sequence: 260,
  description: "Convert PDF files to editable Microsoft Word (.docx) documents in your browser. Multi-file batch, optional OCR for scanned PDFs, 100% client-side — files never leave your device.",
};

export default function PdfToWord({
  heading = "PDF to Word Converter",
  subheading = "Convert any PDF to an editable Word (.docx) document right in your browser. Multi-file batch, optional OCR for scanned PDFs, never uploaded to any server.",
} = {}) {
  return (
    <section className="section pdf2word-section">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>

        {/* ── Drop zone ───────────────────────────────────────────── */}
        <div className="p2w-dropzone p2w-drop" tabIndex="0">
          <input type="file" className="p2w-file-input" accept="application/pdf,.pdf" multiple hidden />
          <div className="p2w-drop-icon">📄</div>
          <p className="p2w-drop-title"><strong>Drop PDF files here</strong></p>
          <p className="p2w-drop-sub">or <button type="button" className="p2w-browse-btn">click to browse</button> — multiple files OK</p>
          <p className="p2w-drop-note">All processing happens in your browser. Nothing is uploaded.</p>
        </div>

        {/* ── Options ─────────────────────────────────────────────── */}
        <div className="p2w-options">
          <label className="p2w-option">
            <input type="checkbox" className="p2w-ocr-toggle" />
            <span><strong>OCR mode</strong> — for scanned PDFs (image-based, no selectable text). Much slower (~30s per page), runs entirely in your browser via Tesseract.</span>
          </label>
          <label className="p2w-option">
            <input type="checkbox" className="p2w-headings-toggle" defaultChecked />
            <span><strong>Detect headings</strong> — promote larger-font text to Heading 1 / 2 / 3 in the output. Recommended.</span>
          </label>
        </div>

        {/* ── File list ───────────────────────────────────────────── */}
        <div className="p2w-files">
          <div className="p2w-empty">No files yet. Drop a PDF above to get started.</div>
        </div>

        {/* ── Action bar ──────────────────────────────────────────── */}
        <div className="p2w-actions">
          <button type="button" className="btn btn-primary p2w-convert-all" disabled>Convert all</button>
          <button type="button" className="btn p2w-download-all" disabled>Download all as ZIP</button>
          <button type="button" className="btn p2w-clear">Clear list</button>
          <span className="p2w-status" aria-live="polite" />
        </div>

        {/* ── Preview modal trigger spot ──────────────────────────── */}
        <div className="p2w-preview-modal" hidden>
          <div className="p2w-preview-inner">
            <div className="p2w-preview-head">
              <strong className="p2w-preview-title">Preview</strong>
              <button type="button" className="p2w-preview-close" aria-label="Close">×</button>
            </div>
            <div className="p2w-preview-body" />
          </div>
        </div>

        {/* ── Info / scope ────────────────────────────────────────── */}
        <div className="p2w-info">
          <h3 className="pt-h4">Best for</h3>
          <ul>
            <li>Articles, reports, resumes, contracts — anything text-heavy</li>
            <li>Multi-page documents — batch convert in one click</li>
            <li>Scanned PDFs (with OCR mode on) — text gets extracted automatically</li>
          </ul>
          <h3 className="pt-h4">Honest limitations</h3>
          <ul>
            <li>Complex multi-column layouts may scramble reading order — review before saving as final</li>
            <li>Tables become text rows, not Word tables</li>
            <li>Mathematical formulas, code blocks with special fonts, and decorative artwork may not survive cleanly</li>
            <li>Passwords / encrypted PDFs are not supported</li>
          </ul>
          <h3 className="pt-h4">Privacy</h3>
          <p>Files are processed entirely in your browser using <code>pdf.js</code> and <code>docx</code> libraries. Nothing is uploaded to a server. If you close this tab without downloading, the file is gone.</p>
        </div>
      </div>
    </section>
  );
}
