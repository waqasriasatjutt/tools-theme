export const meta = {
  name: "Mortgage / loan calculator",
  slug: "base-mortgage-calculator",
  category: "Base • Tools",
  sequence: 222,
  description: "Mortgage / loan calculator with full amortization schedule, total interest paid, and extra-payment what-if.",
};

export default function MortgageCalculator({
  heading = "Mortgage & Loan Calculator",
  subheading = "Estimate your monthly mortgage or loan payment, see the full amortization schedule, and find out how much extra payments could save you.",
} = {}) {
  return (
    <section className="section tool-section mortgage-tool" id="mortgage">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>

        <div className="mtg-grid">
          <div className="mtg-inputs">
            <div className="mtg-row">
              <label className="tool-label">Loan amount</label>
              <input type="number" className="mtg-principal tool-input" defaultValue="300000" min="0" step="1000" />
            </div>
            <div className="mtg-row">
              <label className="tool-label">Annual interest rate (%)</label>
              <input type="number" className="mtg-rate tool-input" defaultValue="6.5" min="0" step="0.01" />
            </div>
            <div className="mtg-row">
              <label className="tool-label">Term (years)</label>
              <input type="number" className="mtg-years tool-input" defaultValue="30" min="1" max="50" step="1" />
            </div>
            <div className="mtg-row">
              <label className="tool-label">Extra monthly payment <span style={{color:"var(--muted)",fontSize:"0.84rem"}}>(optional)</span></label>
              <input type="number" className="mtg-extra tool-input" defaultValue="0" min="0" step="50" />
            </div>
            <div className="tool-actions">
              <button type="button" className="btn btn-primary mtg-calc">Calculate</button>
              <button type="button" className="btn mtg-reset">Reset</button>
            </div>
          </div>

          <div className="mtg-summary">
            <div className="mtg-card">
              <div className="mtg-card-label">Monthly payment</div>
              <div className="mtg-card-value mtg-monthly">—</div>
            </div>
            <div className="mtg-card">
              <div className="mtg-card-label">Total interest</div>
              <div className="mtg-card-value mtg-interest">—</div>
            </div>
            <div className="mtg-card">
              <div className="mtg-card-label">Total paid</div>
              <div className="mtg-card-value mtg-total">—</div>
            </div>
            <div className="mtg-card mtg-card-extra" hidden>
              <div className="mtg-card-label">With extra payment, you save</div>
              <div className="mtg-card-value mtg-saved">—</div>
              <div className="mtg-card-sub mtg-paidoff">—</div>
            </div>
          </div>
        </div>

        <div className="mtg-schedule-wrap">
          <h3 className="pt-h4">Amortization schedule</h3>
          <div className="mtg-schedule-controls">
            <label className="tool-label" style={{display:"inline-flex",gap:"6px",alignItems:"center"}}>
              <input type="radio" name="mtg-view" className="mtg-view-yearly" defaultChecked /> Yearly
            </label>
            <label className="tool-label" style={{display:"inline-flex",gap:"6px",alignItems:"center",marginLeft:"12px"}}>
              <input type="radio" name="mtg-view" className="mtg-view-monthly" /> Monthly
            </label>
          </div>
          <div className="mtg-schedule"></div>
        </div>

        <div className="tool-foot mtg-info">
          <h3 className="pt-h4">How it works</h3>
          <p>This calculator uses the standard amortization formula: <code>M = P × r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> − 1)</code>, where P is the principal, r is the monthly interest rate, and n is the total number of months.</p>
          <p>Adding any amount to the <strong>Extra monthly payment</strong> field reduces the term and total interest — try a small amount like $100/month and see what it does.</p>
          <p style={{color:"var(--muted)",fontSize:"0.88rem"}}>For estimation purposes only. Talk to a licensed lender for an actual loan quote.</p>
        </div>
      </div>
    </section>
  );
}
