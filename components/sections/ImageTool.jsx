export const meta = {
  name: "Image resizer / compressor / converter",
  slug: "base-image-tool",
  category: "Base • Tools",
  sequence: 220,
  description: "Resize, compress, or convert images (JPG / PNG / WEBP) right in the browser. 100% client-side — files never leave your device.",
};

export default function ImageTool({
  heading = "Image Resizer, Compressor & Converter",
  subheading = "Resize images to any dimension, compress JPG/PNG/WEBP, or convert between formats. Multi-file batch — your files never leave your browser.",
} = {}) {
  return (
    <section className="section tool-section image-tool" id="image-tool">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>

        <div className="img-dropzone" tabIndex={0} role="button" aria-label="Drop images here or click to browse">
          <div className="img-drop-icon">🖼️</div>
          <p className="img-drop-title">Drop images here or <button type="button" className="img-browse-btn">browse</button></p>
          <p className="img-drop-sub">JPG, PNG, WEBP, GIF, BMP — process many at once</p>
          <input type="file" className="img-file-input" accept="image/*" multiple hidden />
        </div>

        <div className="img-controls">
          <div className="img-control">
            <label className="tool-label" htmlFor="img-mode">Operation</label>
            <select id="img-mode" className="img-mode tool-input">
              <option value="resize">Resize</option>
              <option value="compress">Compress</option>
              <option value="convert">Convert format</option>
            </select>
          </div>
          <div className="img-control img-when-resize">
            <label className="tool-label" htmlFor="img-w">Width (px)</label>
            <input id="img-w" type="number" className="img-w tool-input" placeholder="e.g. 1200" min="1" />
          </div>
          <div className="img-control img-when-resize">
            <label className="tool-label" htmlFor="img-h">Height (px)</label>
            <input id="img-h" type="number" className="img-h tool-input" placeholder="auto = keep aspect" min="1" />
          </div>
          <div className="img-control img-when-resize">
            <label className="tool-label">
              <input type="checkbox" className="img-keep-aspect" defaultChecked /> Keep aspect ratio
            </label>
          </div>
          <div className="img-control img-when-compress">
            <label className="tool-label" htmlFor="img-quality">Quality: <span className="img-quality-val">82</span>%</label>
            <input id="img-quality" type="range" className="img-quality tool-input" min="10" max="100" defaultValue="82" />
          </div>
          <div className="img-control">
            <label className="tool-label" htmlFor="img-format">Output format</label>
            <select id="img-format" className="img-format tool-input">
              <option value="same">Same as input</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>
        </div>

        <div className="tool-actions img-actions">
          <button type="button" className="btn btn-primary img-process">Process all</button>
          <button type="button" className="btn img-download-all">Download all (.zip-less, one by one)</button>
          <button type="button" className="btn img-clear">Clear</button>
          <span className="img-status" aria-live="polite" />
        </div>

        <div className="img-results"></div>

        <div className="tool-foot img-info">
          <h3 className="pt-h4">Why use this tool?</h3>
          <ul>
            <li><strong>100% private</strong> — images are processed in your browser, never uploaded.</li>
            <li><strong>Batch ready</strong> — process many images at once with the same settings.</li>
            <li><strong>Format conversion</strong> — JPG, PNG, WEBP (smaller files at the same quality).</li>
            <li><strong>Free and unlimited</strong> — no watermarks, no signup, no file-size limit other than your RAM.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
