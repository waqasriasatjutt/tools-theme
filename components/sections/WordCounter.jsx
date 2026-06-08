export const meta = {
  name: "Word & character counter",
  slug: "base-word-counter",
  category: "Base • Tools",
  sequence: 223,
  description: "Real-time word, character, sentence, paragraph, line and reading-time counter. Free, no signup.",
};

export default function WordCounter({
  heading = "Word & Character Counter",
  subheading = "Real-time word, character, sentence, paragraph and reading-time counts. Built for writers, students and SEOs.",
} = {}) {
  return (
    <section className="section tool-section word-tool" id="word-counter">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="word-grid">
          <div className="word-pane">
            <textarea className="word-input tool-textarea" placeholder="Paste or type your text here…" rows={14} />
            <div className="tool-actions">
              <button type="button" className="btn word-paste">Paste</button>
              <button type="button" className="btn word-clear">Clear</button>
            </div>
          </div>
          <aside className="word-stats">
            <div className="word-stat"><div className="word-stat-label">Words</div><div className="word-stat-value word-w">0</div></div>
            <div className="word-stat"><div className="word-stat-label">Characters</div><div className="word-stat-value word-c">0</div></div>
            <div className="word-stat"><div className="word-stat-label">Characters (no spaces)</div><div className="word-stat-value word-cns">0</div></div>
            <div className="word-stat"><div className="word-stat-label">Sentences</div><div className="word-stat-value word-s">0</div></div>
            <div className="word-stat"><div className="word-stat-label">Paragraphs</div><div className="word-stat-value word-p">0</div></div>
            <div className="word-stat"><div className="word-stat-label">Lines</div><div className="word-stat-value word-l">0</div></div>
            <div className="word-stat"><div className="word-stat-label">Reading time</div><div className="word-stat-value word-rt">0 sec</div></div>
            <div className="word-stat"><div className="word-stat-label">Speaking time</div><div className="word-stat-value word-st">0 sec</div></div>
          </aside>
        </div>
        <div className="tool-foot word-info">
          <h3 className="pt-h4">Top 10 most-used words</h3>
          <ol className="word-top"></ol>
        </div>
      </div>
    </section>
  );
}
