export const meta = { name: "Site footer", slug: "base-footer", category: "Base • Layout", sequence: 100, description: "Multi-column footer with link lists, brand line and a copyright bar." };

function FooterCol({ title, links }) {
  return (
    <div className="footer-col">
      <h4 className="footer-col-title">{title}</h4>
      <ul className="footer-col-links">
        {links.map((l, i) => <li key={i}><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </div>
  );
}

export default function SiteFooter({
  brand = "{{site_title}}",
  tagline = "{{tagline}}",
  year = "{{year}}",
  columns = [
    { title: "Product", links: [{ label: "Services", href: "/services" }, { label: "Pricing", href: "/pricing" }, { label: "FAQ", href: "/faq" }] },
    { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Careers", href: "/careers" }] },
    { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
  ],
} = {}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">{brand}</span>
            <p className="muted footer-tagline">{tagline}</p>
          </div>
          <div className="footer-cols">
            {columns.map((c, i) => <FooterCol key={i} {...c} />)}
          </div>
        </div>
        <div className="footer-bar">© {year} {brand}. All rights reserved.</div>
      </div>
    </footer>
  );
}
