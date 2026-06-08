export const meta = {
  name: "Color picker / converter / palette",
  slug: "base-color-tool",
  category: "Base • Tools",
  sequence: 226,
  description: "Color picker with HEX ↔ RGB ↔ HSL conversion, contrast checker (WCAG), and palette generator.",
};

export default function ColorTool({
  heading = "Color Picker, Converter & Palette",
  subheading = "Pick a color, convert between HEX / RGB / HSL, check WCAG contrast, and generate a matching palette for your design.",
} = {}) {
  return (
    <section className="section tool-section color-tool" id="color">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>

        <div className="ct-grid">
          <div className="ct-pick">
            <input type="color" className="ct-input-color" defaultValue="#0e7490" />
            <div className="ct-swatch"></div>
          </div>
          <div className="ct-fields">
            <div className="ct-row">
              <label className="tool-label">HEX</label>
              <input type="text" className="ct-hex tool-input" defaultValue="#0e7490" />
            </div>
            <div className="ct-row">
              <label className="tool-label">RGB</label>
              <input type="text" className="ct-rgb tool-input" defaultValue="rgb(14, 116, 144)" />
            </div>
            <div className="ct-row">
              <label className="tool-label">HSL</label>
              <input type="text" className="ct-hsl tool-input" defaultValue="hsl(192, 82%, 31%)" />
            </div>
            <div className="ct-row">
              <label className="tool-label">CMYK</label>
              <input type="text" className="ct-cmyk tool-input" defaultValue="cmyk(90%, 19%, 0%, 44%)" readOnly />
            </div>
          </div>
        </div>

        <div className="ct-palette-wrap">
          <h3 className="pt-h4">Generated palette</h3>
          <div className="ct-palette-controls">
            <select className="ct-scheme tool-input">
              <option value="mono">Monochromatic</option>
              <option value="complement">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic</option>
            </select>
          </div>
          <div className="ct-palette"></div>
        </div>

        <div className="ct-contrast-wrap">
          <h3 className="pt-h4">Contrast checker (WCAG)</h3>
          <div className="ct-contrast">
            <div className="ct-contrast-fields">
              <label className="tool-label">Foreground <input type="color" className="ct-fg" defaultValue="#ffffff" /></label>
              <label className="tool-label">Background <input type="color" className="ct-bg" defaultValue="#0e7490" /></label>
            </div>
            <div className="ct-contrast-preview">
              <p style={{margin:0,fontSize:"1.25rem"}}>Large text sample</p>
              <p style={{margin:"6px 0 0",fontSize:"0.95rem"}}>Body text — the quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="ct-contrast-result">
              <div className="ct-contrast-ratio">—</div>
              <div className="ct-contrast-grades"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
