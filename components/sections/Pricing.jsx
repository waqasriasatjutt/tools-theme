export const meta = { name: "Pricing", slug: "base-pricing", category: "Base • Conversion", sequence: 50, description: "Three pricing tiers with a feature list and a call-to-action each." };

function Plan({ name, price, period, blurb, features, ctaLabel, ctaHref, featured }) {
  return (
    <div className={featured ? "card plan plan-featured" : "card plan"}>
      {featured ? <span className="badge plan-badge">Most popular</span> : null}
      <h3 className="h3 plan-name">{name}</h3>
      <div className="plan-price"><span className="plan-amount">{price}</span><span className="plan-period">{period}</span></div>
      <p className="muted plan-blurb">{blurb}</p>
      <ul className="plan-features">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <a className={featured ? "btn btn-primary btn-block" : "btn btn-outline btn-block"} href={ctaHref}>{ctaLabel}</a>
    </div>
  );
}

export default function Pricing({
  heading = "Simple, honest pricing",
  text = "Swap in your own plans. Mark one as featured to draw the eye.",
  plans = [
    { name: "Starter", price: "$0", period: "/mo", blurb: "For trying things out.", features: ["1 project", "Community support", "Basic analytics"], ctaLabel: "Start free", ctaHref: "/contact", featured: false },
    { name: "Growth", price: "$29", period: "/mo", blurb: "For teams getting serious.", features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom domain"], ctaLabel: "Choose Growth", ctaHref: "/contact", featured: true },
    { name: "Scale", price: "Custom", period: "", blurb: "For larger organisations.", features: ["Everything in Growth", "SSO and audit logs", "Dedicated manager", "Service-level agreement"], ctaLabel: "Talk to us", ctaHref: "/contact", featured: false },
  ],
} = {}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">{heading}</h2>
          <p className="lead">{text}</p>
        </div>
        <div className="grid cols-3 pricing-grid">
          {plans.map((p, i) => <Plan key={i} {...p} />)}
        </div>
      </div>
    </section>
  );
}
