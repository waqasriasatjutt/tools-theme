# Base — a React theme for the Websites Portal

A theme is a **React project**. Every section of a page is a real React component —
plain JSX (`div`, `h1`/`h2`/`h3`, lists, `<details>`, forms, whatever) with its CSS next
to it. Run it like any Next.js app; deploy `app/` anywhere to test it live; and the
Websites Portal turns each component into a **drag-and-drop block** in its visual editor,
where a content editor changes text, colours and layout — no code.

> **There is no JSON page format and no portal-built-in blocks.** The blocks you see in the
> portal's visual editor are exactly the components in `components/sections/` of the theme you
> picked. Edit a component, rebuild, push, re-fetch — the block updates.

## What's in here

```
components/sections/                 # ← the theme. Each file = one React component = one editable block.
  SiteHeader.jsx   SiteHeader.css    #   logo + nav + CTA button
  Hero.jsx         Hero.css          #   headline, text, two buttons, media panel
  FeatureGrid.jsx  FeatureGrid.css   #   icon + title + text cards
  Services.jsx     Services.css      #   "what we do" cards with a link
  Pricing.jsx      Pricing.css       #   three pricing tiers
  Testimonials.jsx Testimonials.css  #   customer quotes
  FAQ.jsx          FAQ.css           #   accordion (native <details>, no JS)
  CTA.jsx          CTA.css           #   full-width call-to-action band
  ContactForm.jsx  ContactForm.css   #   name / email / message form + contact details
  SiteFooter.jsx   SiteFooter.css    #   multi-column footer + copyright bar
scripts/build-sections.mjs           # `npm run build:sections` -> renders the components above

sections/                            # GENERATED — what the portal imports (commit it; don't hand-edit)
  base-header.html  base-header.css  base-header.json   # html + css + meta(name/slug/category/sequence/description)
  base-hero.html ...  (+ .js if a component has a sibling .js)

theme.json                           # name, slug, version, description, colors{primary,accent,bg,text,muted}, fonts{body,display}, extra_tokens{}
theme.css                            # shared primitives — .container .section .h1/.h2/.h3 .btn .card .grid .field .badge … (responsive)
head.html                            # extra <head> markup (webfont <link>s) injected on live sites — optional
app/  package.json  next.config.mjs  # the Next.js preview app (npm run dev) + standard config
```

## A section component

```jsx
// components/sections/Hero.jsx
export const meta = { name: "Hero", slug: "base-hero", category: "Base • Hero", sequence: 20, description: "Headline, text, two buttons and a media panel." };

export default function Hero({
  heading = "Build something people want",
  text = "A short, clear sentence about what you do and who it is for.",
  primaryLabel = "Get started", primaryHref = "/contact",
  secondaryLabel = "See how it works", secondaryHref = "/services",
  image = "", imageAlt = "",
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
        <div className="hero-media">{image ? <img src={image} alt={imageAlt} /> : null}</div>
      </div>
    </section>
  );
}
```

- **Props default to content.** That's what renders in the preview / on the live site;
  in the portal's visual editor the editor edits the rendered text directly.
- **`export const meta`** = how the block shows up in the editor (`name`, `slug`,
  `category`, `sequence`, `description`). `slug` becomes the generated file name and the
  portal section record's slug — prefix it with your theme slug (`base-hero`) to keep it unique.
- **CSS** goes in `<Name>.css` next to the component, using the theme's CSS vars (below).
  A component that only needs the shared primitives in `theme.css` can skip its own `.css`.
- **Live data / APIs** — make the component `async` and `fetch()` inside it (App Router
  server component), or pass props from `app/page.jsx`. Anything React can do, you can do here.
- **Interactive widget** (e.g. a chat button, a slider)? Add a `<Name>.js` next to the
  component — `(function(el){ /* el = the section root on the live site */ })(root)` — it's
  copied to `sections/<slug>.js` and runs after the section mounts. (Static markup comes from
  the JSX; the `.js` is for behaviour. For heavier interactivity the portal's renderer also has
  a `react_widget` block.)
- **`{{tokens}}`** — put `{{site_title}}`, `{{tagline}}`, `{{year}}`, `{{focus_keyword}}`,
  or any per-site token (including rotating keyword tokens) anywhere as text — they resolve on
  the live site. The preview substitutes a few sample values.

## Theme tokens

`theme.json` `colors` / `fonts` / `extra_tokens` become CSS variables on every site using the theme
(also as `var(--wp-*)` aliases — both names work). Use them in `theme.css` and your component CSS:

```
var(--primary)  var(--accent)  var(--bg)  var(--text)  var(--muted)
var(--font-body)  var(--font-display)   var(--radius)  var(--maxw)
```

`theme.css` also derives a couple more: `var(--surface)` (subtle background), `var(--border)`,
`var(--primary-fg)` (text on a primary background), `var(--radius-sm)`. The visual editor canvas
renders against all of this, so the editor matches the live site. Write **responsive** CSS —
`clamp()` for type, `grid-template-columns: repeat(auto-fit, …)`, `flex-wrap`, `@media`.

## Run / test / deploy

```bash
npm install
npm run dev                   # http://localhost:3000 — composes the section components (app/page.jsx)
npm run build:sections        # render components -> sections/*.{html,css,json}
npm run build && npm start     # production build of the preview app
# deploy app/ to Vercel / Netlify / Cloudflare Pages to test the theme live on your platform
```

Typical change: edit a component in `components/sections/`, `npm run build:sections`,
`git add -A && git commit && git push`, then **Fetch from GitHub** in the portal.

## Add a new component

1. `components/sections/MyThing.jsx` — a default-exported component **and** `export const meta = { name, slug, category, sequence, description }` (slug like `base-mything`).
2. (Optional) `components/sections/MyThing.css`; add an `@import` for it in `app/globals.css` so the preview picks it up. (Optional) `MyThing.js` for interactivity.
3. Use it in `app/page.jsx` if you want it in the demo — it's built either way.
4. `npm run build:sections` → generates `sections/base-mything.{html,css,json}`. Commit everything, push, re-fetch in the portal — it appears as a new draggable block.

That's how you'd add, say, a `WhatsAppWidget`, a `Stats` row, a `LogoCloud`, a `Team` grid,
a `BlogList`, a `Gallery` — write the component, build, push.

## Use it in the portal

1. **Websites Portal → Developer Tools → Themes → Import theme from GitHub** → paste this repo's URL.
   It creates a Theme record and pulls in the colours/fonts/`theme.css`/`head.html` and every section.
2. Create a site, pick this theme. Open a page → **Visual editor → Open visual builder** → the
   theme's components appear as draggable blocks (grouped by `meta.category`). Drag them in, edit
   text, restyle, publish. The canvas uses the theme's colours.
3. Edited the repo? **Theme → GitHub import → Fetch from GitHub** again — it updates the theme +
   sections in place (matched by slug). Bump `version` in `theme.json` so the change is visible.

## Make it *your* theme

1. Change the 5 colours + 2 fonts (and `extra_tokens`) in `theme.json` — rename it too.
2. Adjust `theme.css` — keep the CSS-var names so colours apply; keep it responsive.
3. Edit / replace / add section components. `npm run build:sections`. Push. Re-fetch.
