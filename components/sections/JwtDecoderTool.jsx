export const meta = {
  name: "JWT decoder",
  slug: "base-jwt-decoder",
  category: "Base • Tools",
  sequence: 230,
  description: "Paste a JSON Web Token and see its header and payload decoded. Signature is shown but not verified — all client-side.",
};

export default function JwtDecoderTool({
  heading = "JWT Decoder",
  subheading = "Paste any JWT to see its header and payload decoded. Signature is shown but not verified (no secret leaves your browser).",
} = {}) {
  return (
    <section className="section tool-section jwt-decoder-tool" id="jwt">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="tool-pane jwt-input-pane">
          <label className="tool-label" htmlFor="jwt-input">Token</label>
          <textarea id="jwt-input" className="tool-textarea jwt-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.signature" spellCheck="false" autoCapitalize="off" rows="3" />
          <div className="tool-actions">
            <button type="button" className="btn btn-primary jwt-decode">Decode</button>
            <button type="button" className="btn jwt-clear">Clear</button>
            <span className="jwt-status" aria-live="polite" />
          </div>
        </div>
        <div className="tool-grid jwt-results">
          <div className="tool-pane">
            <label className="tool-label">Header</label>
            <textarea className="tool-textarea tool-output jwt-header" placeholder='{ "alg": "HS256", "typ": "JWT" }' spellCheck="false" readOnly />
          </div>
          <div className="tool-pane">
            <label className="tool-label">Payload</label>
            <textarea className="tool-textarea tool-output jwt-payload" placeholder='{ "sub": "...", "name": "...", "exp": 0 }' spellCheck="false" readOnly />
          </div>
          <div className="tool-pane">
            <label className="tool-label">Signature (raw)</label>
            <textarea className="tool-textarea tool-output jwt-signature" placeholder="signature string" spellCheck="false" readOnly />
          </div>
        </div>
        <p className="tool-foot jwt-error" hidden />
      </div>
    </section>
  );
}
