export const meta = { name: "Testimonials", slug: "base-testimonials", category: "Base • Social proof", sequence: 60, description: "Customer quotes with a name and role." };

function Quote({ quote, name, role }) {
  return (
    <figure className="card quote">
      <blockquote className="quote-text">{quote}</blockquote>
      <figcaption className="quote-by">
        <span className="quote-avatar">{name ? name.charAt(0) : ""}</span>
        <span className="quote-meta"><strong>{name}</strong><span className="muted">{role}</span></span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({
  heading = "What people say",
  text = "Real quotes build trust. Use the words your customers actually used.",
  items = [
    { quote: "It did exactly what we needed and the handover was painless.", name: "Alex Carter", role: "Founder, Northwind" },
    { quote: "Fast, clear, and genuinely easy to keep editing ourselves.", name: "Priya Shah", role: "Marketing lead, Lumen" },
    { quote: "We launched weeks earlier than planned. Highly recommend.", name: "Diego Martins", role: "COO, Brightline" },
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
          {items.map((it, i) => <Quote key={i} {...it} />)}
        </div>
      </div>
    </section>
  );
}
