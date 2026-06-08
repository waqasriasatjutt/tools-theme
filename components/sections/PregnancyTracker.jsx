export const meta = {
  name: "Pregnancy tracker (3D + AI Q&A)",
  slug: "base-pregnancy-tracker",
  category: "Base • Health",
  sequence: 300,
  description: "Calculate your due date and explore week-by-week pregnancy development with a 3D model, comprehensive milestone data, and an AI Q&A assistant. All client-side.",
};

export default function PregnancyTracker({
  heading = "Pregnancy Tracker",
  subheading = "Calculate your due date, explore week-by-week development in 3D, and ask questions. Not medical advice — always consult your healthcare provider.",
} = {}) {
  return (
    <section className="section pregnancy-tracker">
      <div className="container">
        <header className="pt-head">
          <h1 className="h1 pt-title">{heading}</h1>
          <p className="pt-sub">{subheading}</p>
        </header>

        {/* ── Top: due date calculator ──────────────────────────────── */}
        <div className="pt-calc-wrap">
          <h2 className="h3 pt-section-title">Due Date Calculator</h2>
          <div className="pt-calc">
            <div className="pt-calc-inputs">
              <label className="pt-label">Method</label>
              <select className="pt-input pt-method" defaultValue="lmp">
                <option value="lmp">Last Menstrual Period (LMP)</option>
                <option value="conception">Conception date</option>
                <option value="ultrasound">Ultrasound date + weeks</option>
              </select>
              <label className="pt-label pt-mt">Date</label>
              <input type="date" className="pt-input pt-date" />
              <div className="pt-ultra-wrap" hidden>
                <label className="pt-label pt-mt">Weeks at ultrasound</label>
                <input type="number" className="pt-input pt-ultra-weeks" min="1" max="42" step="0.1" placeholder="e.g. 8.5" />
              </div>
              <label className="pt-label pt-mt">Average cycle length (days)</label>
              <input type="number" className="pt-input pt-cycle" min="20" max="45" defaultValue="28" />
              <div className="pt-calc-actions">
                <button type="button" className="btn btn-primary pt-calc-btn">Calculate</button>
                <button type="button" className="btn pt-today-btn">Use today</button>
              </div>
            </div>
            <div className="pt-calc-results">
              <div className="pt-result-card">
                <div className="pt-result-label">Estimated due date</div>
                <div className="pt-result-value pt-due-date">—</div>
              </div>
              <div className="pt-result-card">
                <div className="pt-result-label">Current week</div>
                <div className="pt-result-value pt-current-week">—</div>
              </div>
              <div className="pt-result-card">
                <div className="pt-result-label">Trimester</div>
                <div className="pt-result-value pt-trimester">—</div>
              </div>
              <div className="pt-result-card">
                <div className="pt-result-label">Days remaining</div>
                <div className="pt-result-value pt-days-left">—</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Middle: 3D + week-by-week explorer ────────────────────── */}
        <div className="pt-explorer-wrap">
          <h2 className="h3 pt-section-title">Week-by-Week 3D Explorer</h2>
          <div className="pt-week-selector">
            <button type="button" className="btn pt-week-prev" aria-label="Previous week">‹</button>
            <label className="pt-week-label">Week</label>
            <input type="range" className="pt-week-slider" min="4" max="40" defaultValue="20" />
            <input type="number" className="pt-week-input" min="4" max="40" defaultValue="20" />
            <button type="button" className="btn pt-week-next" aria-label="Next week">›</button>
          </div>
          <div className="pt-explorer">
            <div className="pt-3d-wrap">
              <div className="pt-3d-canvas" />
              <div className="pt-3d-overlay">
                <span className="pt-3d-week">Week 20</span>
                <span className="pt-3d-rotate-hint">drag to rotate</span>
              </div>
            </div>
            <div className="pt-info">
              <h3 className="h3 pt-info-week">Week 20</h3>
              <p className="pt-info-size"><strong>Size:</strong> <span className="pt-info-size-val">—</span></p>
              <p className="pt-info-length"><strong>Length:</strong> <span className="pt-info-length-val">—</span></p>
              <p className="pt-info-weight"><strong>Weight:</strong> <span className="pt-info-weight-val">—</span></p>
              <h4 className="pt-h4 pt-mt">Baby development</h4>
              <p className="pt-info-development">—</p>
              <h4 className="pt-h4 pt-mt">Common symptoms</h4>
              <p className="pt-info-symptoms">—</p>
              <h4 className="pt-h4 pt-mt">Tip for this week</h4>
              <p className="pt-info-tip">—</p>
            </div>
          </div>
        </div>

        {/* ── Bottom: AI Q&A ────────────────────────────────────────── */}
        <div className="pt-qa-wrap">
          <h2 className="h3 pt-section-title">Ask the Pregnancy Assistant</h2>
          <p className="pt-qa-intro">Quick info about your current week. Powered by a curated knowledge base — answers are general guidance only, not medical advice.</p>
          <div className="pt-qa">
            <div className="pt-qa-chips">
              <button type="button" className="pt-chip" data-q="what symptoms should I expect">What symptoms should I expect?</button>
              <button type="button" className="pt-chip" data-q="what foods to avoid">What foods to avoid?</button>
              <button type="button" className="pt-chip" data-q="when is my next appointment">When is my next appointment?</button>
              <button type="button" className="pt-chip" data-q="can I exercise">Can I exercise?</button>
              <button type="button" className="pt-chip" data-q="can I travel">Can I travel?</button>
              <button type="button" className="pt-chip" data-q="when can I feel baby kicks">When will I feel baby kicks?</button>
            </div>
            <div className="pt-qa-input-row">
              <input type="text" className="pt-qa-input" placeholder="Ask anything about your current week…" />
              <button type="button" className="btn btn-primary pt-qa-send">Ask</button>
            </div>
            <div className="pt-qa-thread" />
          </div>
        </div>

        {/* ── Disclaimer ────────────────────────────────────────────── */}
        <div className="pt-disclaimer">
          <strong>⚠ Not medical advice.</strong> Information on this page is for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding pregnancy, a medical condition, or your baby's development.
          <br /><br />
          <strong>Privacy:</strong> Your dates, week, and questions are processed entirely in your browser. Nothing is sent to a server or stored on this site.
        </div>
      </div>
    </section>
  );
}
