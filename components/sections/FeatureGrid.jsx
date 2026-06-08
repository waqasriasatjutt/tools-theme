export const meta = { name: "Feature grid", slug: "base-features", category: "Base • Content", sequence: 30, description: "Three or four cards, each with an icon, title and short text." };

function Feature({ icon, title, text }) {
  return (
    <div className="card feature">
      <div className="feature-icon">{icon}</div>
      <h3 className="h3 feature-title">{title}</h3>
      <p className="muted feature-text">{text}</p>
    </div>
  );
}

export default function FeatureGrid({
  heading = "Everything you need to ship",
  text = "Group your key benefits here. Keep each one to a short title and one sentence.",
  items = [
    { icon: "▣", title: "Fast to launch", text: "Go live in days, not months." },
    { icon: "◆", title: "Built to last", text: "Maintainable, documented, yours to own." },
    { icon: "◎", title: "Made to measure", text: "Adapt every section to your business." },
  ],
} = {}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">{heading}</h2>
          <p className="lead">{text}</p>
        </div>
        <div className="grid cols-3">
          {items.map((it, i) => <Feature key={i} {...it} />)}
        </div>
      </div>
    </section>
  );
}
