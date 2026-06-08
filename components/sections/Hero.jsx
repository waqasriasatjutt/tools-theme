export const meta = { name: "Hero", slug: "base-hero", category: "Base • Hero", sequence: 20, description: "Headline, supporting text, two buttons and a media panel." };

export default function Hero({
  heading = "Build something people want",
  text = "A short, clear sentence about what you do and who it is for. Replace this with your own copy.",
  primaryLabel = "Get started",
  primaryHref = "/contact",
  secondaryLabel = "See how it works",
  secondaryHref = "/services",
  image = "",
  imageAlt = "",
} = {}) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="h1 hero-title">{heading}</h1>
          <p className="lead hero-text">{text}</p>
          <div className="btn-row hero-actions">
            <a className="btn btn-primary btn-lg" href={primaryHref}>{primaryLabel}</a>
            <a className="btn btn-outline btn-lg" href={secondaryHref}>{secondaryLabel}</a>
          </div>
        </div>
        <div className="hero-media">
          {image ? <img src={image} alt={imageAlt} /> : null}
        </div>
      </div>
    </section>
  );
}
