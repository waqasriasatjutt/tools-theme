export const meta = {
  name: "Lorem ipsum generator",
  slug: "base-lorem-ipsum",
  category: "Base • Tools",
  sequence: 225,
  description: "Generate lorem ipsum placeholder text — paragraphs, sentences or words. Classic or hipster / corporate variants.",
};

export default function LoremIpsum({
  heading = "Lorem Ipsum Generator",
  subheading = "Generate dummy placeholder text — paragraphs, sentences or words. Classic Latin or modern variants for designers and developers.",
} = {}) {
  return (
    <section className="section tool-section lorem-tool" id="lorem">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="lorem-controls">
          <div className="lorem-col">
            <label className="tool-label">Amount</label>
            <input type="number" className="lorem-count tool-input" min="1" max="200" defaultValue="5" />
          </div>
          <div className="lorem-col">
            <label className="tool-label">Type</label>
            <select className="lorem-type tool-input" defaultValue="paragraphs">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="lorem-col">
            <label className="tool-label">Variant</label>
            <select className="lorem-variant tool-input" defaultValue="classic">
              <option value="classic">Classic Latin</option>
              <option value="hipster">Hipster</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
          <div className="lorem-col lorem-col-cb">
            <label className="tool-label"><input type="checkbox" className="lorem-start" defaultChecked /> Start with "Lorem ipsum…"</label>
          </div>
        </div>
        <div className="tool-actions">
          <button type="button" className="btn btn-primary lorem-gen">Generate</button>
          <button type="button" className="btn lorem-copy">Copy</button>
          <span className="lorem-status" aria-live="polite" />
        </div>
        <div className="lorem-output" contentEditable="false" tabIndex={0}></div>
      </div>
    </section>
  );
}
