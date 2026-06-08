export const meta = {
  name: "Hash generator (SHA-1 / SHA-256 / SHA-384 / SHA-512)",
  slug: "base-hasher",
  category: "Base • Tools",
  sequence: 240,
  description: "Generate cryptographic hashes for any text using the browser's SubtleCrypto. Output is hex.",
};

export default function HashTool({
  heading = "Hash Generator",
  subheading = "Type or paste text and pick an algorithm. Hash is computed in your browser via SubtleCrypto — no data leaves your machine.",
} = {}) {
  return (
    <section className="section tool-section hash-tool" id="hash">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="tool-grid">
          <div className="tool-pane">
            <label className="tool-label" htmlFor="ht-input">Input</label>
            <textarea id="ht-input" className="tool-textarea ht-input" placeholder="hello world" spellCheck="false" autoCapitalize="off" />
            <div className="tool-actions">
              <label className="tool-label" style={{ marginRight: 6 }} htmlFor="ht-algo">Algorithm</label>
              <select id="ht-algo" className="ht-algo" defaultValue="SHA-256">
                <option value="SHA-1">SHA-1</option>
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
              </select>
              <button type="button" className="btn btn-primary ht-hash">Hash</button>
              <button type="button" className="btn ht-clear">Clear</button>
            </div>
          </div>
          <div className="tool-pane">
            <label className="tool-label">Output (hex)</label>
            <textarea className="tool-textarea tool-output ht-output" placeholder="Result appears here…" spellCheck="false" readOnly />
            <div className="tool-actions">
              <button type="button" className="btn ht-copy">Copy</button>
              <span className="ht-status" aria-live="polite" />
            </div>
          </div>
        </div>
        <p className="tool-foot ht-error" hidden />
      </div>
    </section>
  );
}
