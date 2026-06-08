/**
 * Demo home page — imports the section components and composes a page, the way a
 * developer would in any React app. Pass props to override the defaults; wire in
 * fetch() / your API / a CMS where a section needs live data.
 *
 *   npm run dev               -> this page
 *   npm run build:sections    -> render each component to sections/<slug>.{html,css,json},
 *                                which the Websites Portal imports as editable blocks
 *
 * components/sections/*.jsx are the single source of truth. Edit them, rebuild, push,
 * then "Fetch from GitHub" in the portal. Add your own components the same way — a new
 * file in components/sections/ with a default export and an exported `meta`.
 */
import SiteHeader from "../components/sections/SiteHeader.jsx";
import Hero from "../components/sections/Hero.jsx";
import FeatureGrid from "../components/sections/FeatureGrid.jsx";
import Services from "../components/sections/Services.jsx";
import Pricing from "../components/sections/Pricing.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import FAQ from "../components/sections/Faq.jsx";
import CTA from "../components/sections/Cta.jsx";
import ContactForm from "../components/sections/ContactForm.jsx";
import SiteFooter from "../components/sections/SiteFooter.jsx";

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <>
      <SiteHeader brand="Acme" />
      <main>
        <Hero
          heading="A website you can actually own and edit"
          text="Themes are plain React components. Compose them, change the props, connect your own data — then publish."
        />
        <FeatureGrid />
        <Services />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <ContactForm />
      </main>
      <SiteFooter brand="Acme" tagline="We build things that work." year={year} />
    </>
  );
}
