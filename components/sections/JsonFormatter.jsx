export const meta = {
  name: "JSON formatter",
  slug: "base-json-formatter",
  category: "Base • Tools",
  sequence: 200,
  description: "Paste JSON in, get it pretty-printed or minified out. Client-side, no upload.",
};

export default function JsonFormatter({
  heading = "JSON Formatter",
  subheading = "Paste JSON below, click Format or Minify. Everything runs in your browser — nothing is sent to a server.",
  inputPlaceholder = '{"name":"Ada","age":36,"skills":["js","math"]}',
} = {}) {
  return (
    <section className="section tool-section json-formatter-tool">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>

        <div className="tool-grid">
          <div className="tool-pane">
            <label className="tool-label" htmlFor="jf-input">Input</label>
            <textarea
              id="jf-input"
              className="tool-textarea jf-input"
              placeholder={inputPlaceholder}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="tool-actions">
              <button type="button" className="btn btn-primary jf-format">Format</button>
              <button type="button" className="btn jf-minify">Minify</button>
              <button type="button" className="btn jf-clear">Clear</button>
            </div>
          </div>

          <div className="tool-pane">
            <label className="tool-label" htmlFor="jf-output">Output</label>
            <textarea
              id="jf-output"
              className="tool-textarea tool-output jf-output"
              placeholder="Result appears here…"
              spellCheck="false"
              readOnly
            />
            <div className="tool-actions">
              <button type="button" className="btn jf-copy">Copy</button>
              <span className="jf-status" aria-live="polite" />
            </div>
          </div>
        </div>

        <p className="tool-foot jf-error" hidden />
      </div>
    </section>
  );
}
