export const meta = {
  name: "Markdown ↔ HTML converter",
  slug: "base-markdown",
  category: "Base • Tools",
  sequence: 227,
  description: "Convert Markdown to HTML or HTML back to Markdown with live preview. Free, in-browser, no signup.",
};

export default function MarkdownTool({
  heading = "Markdown ↔ HTML Converter (with Live Preview)",
  subheading = "Convert Markdown to clean HTML or HTML back to Markdown. Real-time preview as you type. 100% client-side.",
} = {}) {
  return (
    <section className="section tool-section markdown-tool" id="markdown">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="md-mode-tabs">
          <button type="button" className="md-tab is-active" data-mode="md2html">Markdown → HTML</button>
          <button type="button" className="md-tab" data-mode="html2md">HTML → Markdown</button>
        </div>
        <div className="md-grid">
          <div className="md-pane">
            <label className="tool-label md-source-label">Markdown</label>
            <textarea className="md-input tool-textarea" rows={18} defaultValue={"# Hello, world!\n\nThis is **bold** and this is *italic*.\n\n- A list item\n- Another item\n\n[A link](https://example.com)\n\n```js\nconsole.log('code block');\n```\n\n> A blockquote.\n\n| Col A | Col B |\n|-------|-------|\n| 1 | 2 |\n"} />
          </div>
          <div className="md-pane">
            <label className="tool-label md-target-label">HTML output</label>
            <textarea className="md-output tool-textarea tool-output" rows={18} readOnly />
          </div>
        </div>
        <div className="md-preview-wrap">
          <h3 className="pt-h4">Live preview</h3>
          <div className="md-preview"></div>
        </div>
        <div className="tool-actions">
          <button type="button" className="btn md-copy">Copy output</button>
          <button type="button" className="btn md-clear">Clear</button>
          <span className="md-status" aria-live="polite" />
        </div>
      </div>
    </section>
  );
}
