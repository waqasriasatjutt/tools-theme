export const meta = {
  name: "QR code generator",
  slug: "base-qr-generator",
  category: "Base • Tools",
  sequence: 221,
  description: "Generate QR codes for text, URLs, WiFi, contact cards — download as PNG or SVG, in the browser.",
};

export default function QrGenerator({
  heading = "Free QR Code Generator",
  subheading = "Turn any text, URL, WiFi password or contact card into a QR code — instantly. Download as PNG or SVG, no signup, no watermark.",
} = {}) {
  return (
    <section className="section tool-section qr-tool" id="qr">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="qr-grid">
          <div className="qr-controls">
            <label className="tool-label" htmlFor="qr-input">Content</label>
            <textarea id="qr-input" className="qr-input tool-textarea" placeholder="Type or paste a URL, text, WiFi credentials…" rows={6} defaultValue="https://tools.way4tech.com" />
            <div className="qr-row">
              <div className="qr-col">
                <label className="tool-label" htmlFor="qr-size">Size (px)</label>
                <input id="qr-size" type="number" className="qr-size tool-input" min="128" max="2048" step="32" defaultValue="512" />
              </div>
              <div className="qr-col">
                <label className="tool-label" htmlFor="qr-margin">Margin</label>
                <input id="qr-margin" type="number" className="qr-margin tool-input" min="0" max="20" defaultValue="4" />
              </div>
              <div className="qr-col">
                <label className="tool-label" htmlFor="qr-level">Error correction</label>
                <select id="qr-level" className="qr-level tool-input" defaultValue="M">
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>
            </div>
            <div className="qr-row">
              <div className="qr-col">
                <label className="tool-label" htmlFor="qr-fg">Foreground</label>
                <input id="qr-fg" type="color" className="qr-fg tool-input" defaultValue="#000000" />
              </div>
              <div className="qr-col">
                <label className="tool-label" htmlFor="qr-bg">Background</label>
                <input id="qr-bg" type="color" className="qr-bg tool-input" defaultValue="#ffffff" />
              </div>
            </div>
            <div className="tool-actions">
              <button type="button" className="btn btn-primary qr-build">Generate</button>
              <button type="button" className="btn qr-dl-png">Download PNG</button>
              <button type="button" className="btn qr-dl-svg">Download SVG</button>
              <span className="qr-status" aria-live="polite" />
            </div>
          </div>
          <div className="qr-preview">
            <canvas className="qr-canvas" width="512" height="512" />
            <p className="qr-hint">QR preview — auto-updates as you type.</p>
          </div>
        </div>
        <div className="tool-foot qr-info">
          <h3 className="pt-h4">Tip — common QR formats</h3>
          <ul>
            <li><strong>URL</strong>: just paste the address: <code>https://example.com</code></li>
            <li><strong>WiFi</strong>: <code>WIFI:T:WPA;S:NetworkName;P:Password;;</code></li>
            <li><strong>Contact (vCard)</strong>: <code>BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nTEL:+1234567890\nEND:VCARD</code></li>
            <li><strong>Email</strong>: <code>mailto:hello@example.com?subject=Hi</code></li>
            <li><strong>SMS</strong>: <code>sms:+1234567890?body=Hello</code></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
