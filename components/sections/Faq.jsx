export const meta = { name: "FAQ", slug: "base-faq", category: "Base • Content", sequence: 70, description: "Accordion of questions and answers — native <details>, no JavaScript." };

export default function FAQ({
  heading = "Questions, answered",
  text = "Cover the things people ask before they buy.",
  items = [
    { q: "How long does it take?", a: "Most projects go live in two to four weeks, depending on scope." },
    { q: "Can we edit it ourselves afterwards?", a: "Yes. You get a visual editor plus full access to the code." },
    { q: "Do you handle hosting?", a: "Yes, fully managed, monitored and backed up. You can also self-host." },
    { q: "What does it cost?", a: "See the pricing section above, or get in touch for a custom quote." },
  ],
} = {}) {
  return (
    <section className="section">
      <div className="container faq-container">
        <div className="section-head">
          <h2 className="h2">{heading}</h2>
          <p className="lead">{text}</p>
        </div>
        <div className="faq-list">
          {items.map((it, i) => (
            <details className="faq-item" key={i}>
              <summary className="faq-q">{it.q}</summary>
              <p className="faq-a">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
