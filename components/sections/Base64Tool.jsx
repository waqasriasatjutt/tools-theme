export const meta = {
  name: "Base64 encoder / decoder",
  slug: "base-base64",
  category: "Base • Tools",
  sequence: 210,
  description: "Encode text to Base64 or decode Base64 back to text. Client-side, no upload.",
};

export default function Base64Tool({
  heading = "Base64 Encoder / Decoder",
  subheading = "Encode any text to Base64, or decode a Base64 string back to readable text. All in your browser.",
} = {}) {
  return (
    <section className="section tool-section base64-tool" id="base64">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="tool-grid">
          <div className="tool-pane">
            <label className="tool-label" htmlFor="b64-input">Input</label>
            <textarea id="b64-input" className="tool-textarea b64-input" placeholder="hello world  OR  aGVsbG8gd29ybGQ=" spellCheck="false" autoCapitalize="off" />
            <div className="tool-actions">
              <button type="button" className="btn btn-primary b64-encode">Encode</button>
              <button type="button" className="btn b64-decode">Decode</button>
              <button type="button" className="btn b64-clear">Clear</button>
            </div>
          </div>
          <div className="tool-pane">
            <label className="tool-label" htmlFor="b64-output">Output</label>
            <textarea id="b64-output" className="tool-textarea tool-output b64-output" placeholder="Result appears here…" spellCheck="false" readOnly />
            <div className="tool-actions">
              <button type="button" className="btn b64-copy">Copy</button>
              <span className="b64-status" aria-live="polite" />
            </div>
          </div>
        </div>
        <p className="tool-foot b64-error" hidden />
      </div>
    </section>
  );
}
