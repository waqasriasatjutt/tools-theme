export const meta = { name: "Call to action", slug: "base-cta", category: "Base • Conversion", sequence: 80, description: "A full-width band with a heading, a line of text and a button." };

export default function CTA({
  heading = "Ready to get started?",
  text = "Tell us what you want to build. We will get back to you within one business day.",
  buttonLabel = "Contact us",
  buttonHref = "/contact",
} = {}) {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-band">
          <div className="cta-copy">
            <h2 className="h2 cta-title">{heading}</h2>
            <p className="cta-text">{text}</p>
          </div>
          <a className="btn btn-lg cta-btn" href={buttonHref}>{buttonLabel}</a>
        </div>
      </div>
    </section>
  );
}
