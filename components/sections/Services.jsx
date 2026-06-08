export const meta = { name: "Services", slug: "base-services", category: "Base • Content", sequence: 40, description: "What you offer — cards with a title, description and a link." };

function Service({ title, text, linkLabel, href }) {
  return (
    <div className="card service">
      <h3 className="h3 service-title">{title}</h3>
      <p className="muted service-text">{text}</p>
      <a className="service-link" href={href}>{linkLabel} →</a>
    </div>
  );
}

export default function Services({
  heading = "What we do",
  text = "Describe the services or products you offer. One card per offering works well.",
  items = [
    { title: "Strategy", text: "Figure out what to build and why before writing a line.", linkLabel: "Learn more", href: "/services" },
    { title: "Design and build", text: "Turn the plan into a fast, accessible, on-brand product.", linkLabel: "Learn more", href: "/services" },
    { title: "Support and growth", text: "Keep it running, measure it, and improve it over time.", linkLabel: "Learn more", href: "/services" },
  ],
} = {}) {
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">{heading}</h2>
          <p className="lead">{text}</p>
        </div>
        <div className="grid cols-3">
          {items.map((it, i) => <Service key={i} {...it} />)}
        </div>
      </div>
    </section>
  );
}
