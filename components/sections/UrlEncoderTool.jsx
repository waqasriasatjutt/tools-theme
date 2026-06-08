export const meta = {
  name: "URL encoder / decoder",
  slug: "base-url-encoder",
  category: "Base • Tools",
  sequence: 220,
  description: "Percent-encode special characters for URLs, or decode a URL back to readable text. Client-side.",
};

export default function UrlEncoderTool({
  heading = "URL Encoder / Decoder",
  subheading = "Make text safe for use in URLs (percent-encoding), or decode an existing URL-encoded string back to readable form.",
} = {}) {
  return (
    <section className="section tool-section url-encoder-tool" id="url-encoder">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="tool-grid">
          <div className="tool-pane">
            <label className="tool-label" htmlFor="ue-input">Input</label>
            <textarea id="ue-input" className="tool-textarea ue-input" placeholder="hello world & friends  OR  hello%20world%20%26%20friends" spellCheck="false" autoCapitalize="off" />
            <div className="tool-actions">
              <button type="button" className="btn btn-primary ue-encode">Encode</button>
              <button type="button" className="btn ue-decode">Decode</button>
              <button type="button" className="btn ue-clear">Clear</button>
            </div>
          </div>
          <div className="tool-pane">
            <label className="tool-label" htmlFor="ue-output">Output</label>
            <textarea id="ue-output" className="tool-textarea tool-output ue-output" placeholder="Result appears here…" spellCheck="false" readOnly />
            <div className="tool-actions">
              <button type="button" className="btn ue-copy">Copy</button>
              <span className="ue-status" aria-live="polite" />
            </div>
          </div>
        </div>
        <p className="tool-foot ue-error" hidden />
      </div>
    </section>
  );
}
