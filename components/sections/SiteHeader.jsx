export const meta = { name: "Site header", slug: "base-header", category: "Base • Layout", sequence: 10, description: "Logo, navigation links and a call-to-action button." };

export default function SiteHeader({
  brand = "{{site_title}}",
  brandHref = "/",
  links = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  ctaLabel = "Get started",
  ctaHref = "/contact",
} = {}) {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="site-header-brand" href={brandHref}>{brand}</a>
        <nav className="site-header-nav">
          {links.map((l, i) => <a key={i} className="site-header-link" href={l.href}>{l.label}</a>)}
        </nav>
        <a className="btn btn-primary site-header-cta" href={ctaHref}>{ctaLabel}</a>
      </div>
    </header>
  );
}
