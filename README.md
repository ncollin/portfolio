# Nico Collin — Portfolio

Source for [nico.collin.app](https://nico.collin.app): a static portfolio with three case studies, built with Astro and CSS Modules, with no UI framework and no client-side framework JavaScript.

The site ships two brands, **spec** (dark slate, IBM Plex) and **bold** (yellow, Archivo), driven by the same semantic tokens. Visitors switch brands with the toggle in the header.

## Getting started

Requires Node.js 22.22 or later.

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Generate social images, then build to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run social:images` | Regenerate the social preview images only |
| `npm run astro ...` | Run Astro CLI commands such as `astro check` |

## Project structure

```text
/
├── public/
│   └── assets/            Resume PDF and generated social images
├── scripts/
│   └── generate-social-images.mjs
├── specs/                 Token JSON sources (exported from Figma)
└── src/
    ├── components/
    │   ├── atoms/         button, divider, icon, link, segmented-control, tag
    │   ├── molecules/     fact, info-card, lesson-block, section-header, stat, step-row
    │   └── organisms/     card-grid, case-study-card, header, hero, …
    ├── layouts/
    │   └── base-layout.astro
    ├── pages/
    │   ├── index.astro
    │   ├── 404.astro
    │   ├── robots.txt.ts
    │   └── case-studies/  component-library, platform-modernization, tecsys-design-practice
    └── styles/
        ├── layout.css
        ├── utils-classes.css
        └── tokens/        primitives.css, semantic.spec.css, semantic.bold.css
```

Components follow atomic design. Each one has its own folder with a matching `.astro` file, CSS Module, and `nc-` root class.

### Import aliases

[tsconfig.json](tsconfig.json) defines aliases for all local imports, including colocated CSS Modules and SVG assets:

| Alias | Directory |
| --- | --- |
| `@atoms/*` | `src/components/atoms/*` |
| `@molecules/*` | `src/components/molecules/*` |
| `@organisms/*` | `src/components/organisms/*` |
| `@layouts/*` | `src/layouts/*` |
| `@styles/*` | `src/styles/*` |
| `@/*` | `src/*` (other source files) |

```astro
---
import Link from "@atoms/link/link.astro";
import styles from "@atoms/link/link.module.css";
---
```

## Design tokens

Tokens come in three collections, each referencing the one before it:

```
primitives  →  scale (base | md | lg)  →  semantic (spec | bold)  →  components
```

The stylesheets in [src/styles/tokens](src/styles/tokens/) map to the JSON sources in [specs](specs/), one JSON file per mode:

| Source | Stylesheet | Scope |
| --- | --- | --- |
| `primitives.tokens.json` | `primitives.css` | `:root` |
| `scale.base.tokens.json` | `scale.css` | `:root` |
| `scale.md.tokens.json` | `scale.css` | `:root`, from `48em` |
| `scale.lg.tokens.json` | `scale.css` | `:root`, from `64em` |
| `semantic.spec.tokens.json` | `semantic.spec.css` | `[data-theme="spec"]` |
| `semantic.bold.tokens.json` | `semantic.bold.css` | `[data-theme="bold"]` |

The CSS files are static, so keep them in sync when editing the JSON sources. The layout imports them in this order: primitives, scale, spec, bold.

**Scale.** Scale holds only the tokens that change with the viewport, which are the same in both brands. Components never use scale tokens directly: semantic tokens point to them (`--nc-font-size-display: var(--nc-scale-font-size-display)`), so components keep using semantic names. Spec's `heading-2` is the one exception: a small label that doesn't scale, so it points to its primitive instead.

| Token | base | md (≥48em) | lg (≥64em) |
| --- | --- | --- | --- |
| `font-size` / `line-height`: `display` | 35 / 40 | 57 / 60 | 72 / 76 |
| `heading-1` | 35 / 40 | 45 / 48 | 57 / 60 |
| `heading-2` (bold only) | 28 / 32 | 35 / 40 | 35 / 40 |
| `heading-3` | 22 / 28 | 22 / 28 | 28 / 32 |
| `lead` | 17 / 28 | 22 / 36 | 22 / 36 |
| `data-lg` | 35 / 40 | 45 / 48 | 57 / 56 |
| `data-sm` | 22 / 28 | 28 / 32 | 28 / 32 |
| `padding-xl` | 24 | 32 | 32 |
| `padding-2xl` (page margins) | 16 | 24 | 40 |
| `gap-lg` | 24 | 32 | 32 |
| `gap-xl` | 40 | 64 | 64 |
| `gap-2xl` | 64 | 96 | 96 |

Values are in px; every one references an existing primitive. The `lg` values are the original desktop values. Breakpoints can't be tokens, because media queries can't read custom properties: `md` and `lg` are fixed at `48em` and `64em` in `scale.css` and in this README. The Scale collection still needs to be created in Figma to match these files.

**Naming.** Token paths become hyphenated custom properties with the `nc-` prefix: `color.text.primary` becomes `--nc-color-text-primary`. All authored CSS classes, CSS Module keys, and utility classes also use `nc-`. Aliases stay as `var()` references, and font-family arrays become CSS font stacks.

**Units.** `layout.css` sets the root font size to `62.5%`, so `1rem` equals 10px at the browser default and `24px` in the design becomes `2.4rem`. Pixel values in the JSON are divided by 10. All length tokens, including borders and letter spacing, use rem, so browser font preferences still scale them. Components use semantic tokens such as `var(--nc-padding-md)` directly, without conversions.

```css
.nc-example {
  color: var(--nc-color-text-primary);
  padding: var(--nc-padding-md);
  font-family: var(--nc-font-family-body);
}
```

**Motion.** Motion tokens are shared across both brands in the primitives: `--nc-motion-duration-instant` (60ms), `--nc-motion-duration-fast` (120ms), `--nc-motion-duration-base` (200ms), and `--nc-motion-easing-standard` (`cubic-bezier(0.2, 0, 0, 1)`). Components use them without local fallbacks, and reduced-motion rules stay in effect.

**Reserved tokens.** The five `--nc-color-icon-*` tokens, `--nc-color-background-surface`, and `--nc-gap-2xl` are intentionally kept in both brands and their JSON sources, even though no component uses them yet. Icons inherit `currentColor` so they follow their control's state. Don't force their use or remove them during cleanup.

### Fonts

The [base layout](src/layouts/base-layout.astro) loads IBM Plex Sans, IBM Plex Mono, Archivo, and Archivo Black through Astro's Fonts API, configured in [astro.config.mjs](astro.config.mjs). Fontsource provides the files at build time, and Astro serves them from the site, so visitors make no third-party font requests.

- Plex Sans, Plex Mono, and Archivo include weights 400, 500, and 600. Archivo Black includes 400.
- All use the Latin subset and `font-display: swap`.
- Plex Mono sets `fallbacks: ["monospace"]` so its fallback stays monospaced while loading.
- Fonts load on demand, only when the active brand uses them. There is no preload (see [Performance](#performance)).

### Brand switching

The header's brand toggle saves the choice in local storage under `nc-brand`. An inline script in the layout's `<head>` restores a valid `spec` or `bold` value on `<html>` before rendering. Without a saved choice, the layout's `brand` prop applies (default: `spec`). Storage failures are logged and don't block switching on the current page.

The header sets `--nc-segmented-control-indicator-offset` from the restored `data-theme`, so the indicator starts in the right position before the header script syncs the radios. User changes still animate unless reduced motion is requested.

## Responsive

**Rule: mobile first.** Every component's base styles target the smallest screen (320px). Wider layouts are added with `min-width` media queries only, never `max-width`.

| Breakpoint | Min width | Typical devices |
| --- | --- | --- |
| base | 0 | Phones |
| `md` | `48em` (768px) | Tablets, small laptops |
| `lg` | `64em` (1024px) | Desktop |

Breakpoints are in `em` so they also respond to browser zoom. Type and spacing change through the [Scale tokens](#design-tokens), so components rarely need their own media queries for sizes.

How each layout changes:

| Component | Base | `md` | `lg` |
| --- | --- | --- | --- |
| Header | Two rows (name and toggle, then navigation), not sticky | One row, sticky | |
| `step-row` | Number and title, description below | Title and description side by side | |
| `case-study-card` | Text, stats below | | Stats to the right |
| `case-study-nav` | Previous and next stacked | Two halves | |
| `contact-block` | Text, buttons below aligned left | Side by side when they fit, buttons aligned right | |
| `hero__actions` | Buttons wrap | | |
| Three-item grids (cards, stats, token layers) | One column | Three columns | |
| Three lessons | One column | One column | Three columns |
| Other grids | `auto-fit` columns of at least `min-width-column` (240px), never wider than the screen | | |

Safety nets for narrow screens and 400% zoom:

- `overflow-wrap: break-word` on `body`: a word too long for its line breaks instead of scrolling the page sideways. Known case: at exactly 320px, the period of "INFRASTRUCTURE." in a bold lesson card moves to the next line.
- Grid minimums use `min(100%, …)`, and the home card stats use `minmax(min-content, 1fr)`, so no column is wider than the screen or narrower than its longest word.
- Long code examples (token names) use `overflow-wrap: anywhere`.

When adding a component: write the phone layout first, check the longest words of its headings in both brands at 320px and 768px (bold's uppercase Archivo Black is much wider than spec's Plex Sans), then add `md` or `lg` rules.

## Components

### Header

Mobile first:

- **Base:** two rows. Your name and the brand toggle on the first, the navigation spread across the second. The header isn't sticky, so it doesn't take a fixed share of a small screen. The toggle's segments use tighter side padding (`--nc-segmented-control-segment-padding-inline`) so name and toggle share the row; on the narrowest screens, the name wraps before anything overflows.
- **From `md` (48em):** one row, sticky. Name on the left, then navigation and toggle on the right.
- The HTML order follows the mobile layout (name, toggle, navigation), and a CSS grid moves the toggle after the navigation from `md`. So on wider screens, keyboard focus reaches the toggle before the links, even though it sits to their right.
- Navigation links are at least 44px tall for touch. That's shorter than the toggle, so the one-row header keeps its height.

In-page links (`/#work`, `/#contact`) land below the header through `scroll-padding-top` in [layout.css](src/styles/layout.css). On mobile, it's only breathing room. From `md`, it's the sticky header's height, built from the same tokens as the header. If you change the header's padding, gap, toggle or name size, update that calculation too.

### Hero

`variant="home"` uses display typography, and `variant="page"` (the default) uses heading-1 typography. The home page uses `home`, and all case studies use `page`. Both render a semantic `h1` and take their full typography role from the active brand, including text transform.

The home modifier is a standalone CSS Module rule. Check both dev and production output when changing these selectors: descendant-only modifier rules were missing from the dev server's class map.

### Buttons and links

Compose labels and icons in the default slot. There are no named icon slots. Put the Icon before or after the text to choose its position.

```astro
<Button href="#work"><Icon name="arrow-down" /> View case studies</Button>
<Link href="/assets/nico-collin-resume.pdf">Resume <Icon name="download" /></Link>
```

- Button renders a link when given `href`, otherwise a native `<button>`.
- Buttons and links with `target="_blank"` include a visually hidden "(opens in a new tab)" notice.
- Icon is decorative (hidden from assistive technology) and inherits color from its control.

### Tag

`tone="accent"` (default) uses the brand's accent text color, and `tone="muted"` uses its secondary text color.

### Segmented control

Native radios provide single selection, keyboard navigation, and form submission without JavaScript.

```astro
<SegmentedControl label="View layout">
  <Segment name="view-layout" value="grid" checked>Grid</Segment>
  <Segment name="view-layout" value="list">List</Segment>
  <Segment name="view-layout" value="map" disabled>Map</Segment>
</SegmentedControl>
```

- `label` is required and becomes a visually hidden legend.
- All segments in a control share one non-empty `name` and have distinct `value`s. Use different names for independent controls on the same page.
- Set `checked` on at most one segment. Segments accept `disabled` and `required`.
- Slot content must be non-interactive (text or a decorative icon).
- The control only changes selection. Filtering or switching content needs your own `change` listener.

The header places the brand toggle beside, not inside, the Main navigation landmark. Other segmented controls position their indicator from the checked radio.

### Organisms

Organisms accept content through a default slot. `step-list`, `lesson-list`, and `work-list` render native lists, so wrap each slotted item in `<li>`.

### Case study content

All three case studies are final and indexable. The token diagram in the component-library case study (`case-studies/_components/token-diagram`) is a one-off illustration, not a design system component. Its `stla` examples are confirmed Nurun token names describing the case study, not this site's `nc` tokens.

## SEO

### Page metadata

Every page using `BaseLayout` provides a unique `title` and `description`. Titles follow the format `Page title · Nico Collin`. The layout uses them for search metadata, Open Graph, and Twitter cards. The `site` setting in [astro.config.mjs](astro.config.mjs) is required: the layout uses it to build absolute canonical URLs without query strings or fragments.

```astro
<BaseLayout
  title="My case study · Nico Collin"
  description="A concise summary of this case study."
  image="/assets/social/my-case-study.png"
  imageAlt="A preview of the case study"
>
  …
</BaseLayout>
```

**URLs.** Page URLs have no trailing slash, except the home page (`/`). The config sets `trailingSlash: "never"`, and internal links, canonical URLs, and `og:url` follow the same convention. The host must serve extensionless URLs and permanently redirect trailing-slash variants.

**noindex.** Pages with `noindex` get a `noindex` robots directive and no canonical tag. `og:url` stays for social sharing. Only the 404 page uses it. `noindex` isn't access control: the page stays publicly accessible.

### Social images

Pages default to a shared 1200×630 image with a large-image Twitter card. Override it with `image` and `imageAlt`. Custom images don't inherit the default alt text. Set `imageWidth` and `imageHeight` only when an image isn't 1200×630.

`npm run social:images` generates the default image and one per case study in `public/assets/social/`, and runs automatically before `npm run build`. To change them, edit the template and copy in [scripts/generate-social-images.mjs](scripts/generate-social-images.mjs). The template reads primitive colors from the site's tokens and outlines packaged IBM Plex glyphs, so it needs no system fonts, network downloads, or runtime image service. Each image must stay under 200 KB.

### Structured data

- `pageType="profile"` (home page) emits `ProfilePage` JSON-LD with a `Person` main entity.
- `pageType="article"` (case studies) emits `Article` JSON-LD and sets `og:type="article"`. It requires a `headline` prop, shared with the visible hero title, and reuses the page's description, URL, and social image.
- The default `pageType="website"` (404) emits no JSON-LD.

Author details are defined once in [base-layout.astro](src/layouts/base-layout.astro) with a stable `Person` identifier. JSON is serialized with `<` escaped so content can't close the script early. Articles also require a `datePublished` prop (ISO 8601, such as `2026-10-20`) and accept an optional `dateModified`, which defaults to `datePublished`. Both feed the JSON-LD and the `article:published_time` / `article:modified_time` Open Graph tags. Update `dateModified` when a case study's content changes meaningfully.

### Sitemap and robots

`@astrojs/sitemap` generates `sitemap-index.xml` and numbered sitemap files at build time. They include the home page and the three case studies, and exclude the 404. [robots.txt.ts](src/pages/robots.txt.ts) generates `robots.txt`, which allows crawling and points to the sitemap index. The layout also links to the sitemap.

If a future page uses `noindex`, also exclude it with the sitemap `filter` in [astro.config.mjs](astro.config.mjs), since the integration doesn't read layout props. Keep crawling allowed so search engines can read the `noindex`.

## Performance

These are local lab results (Chromium, 390×844 viewport, 4× CPU slowdown, 1.6 Mbps, 150ms latency), not field Core Web Vitals.

### CSS delivery

Production uses `build.inlineStylesheets: "always"`. It was chosen on October 20, 2026, by comparing production builds of Astro's `auto`, `always`, and `never` modes (5 runs per scenario and brand, 150 navigations total). Median FCP/LCP in milliseconds, spec / bold:

| Scenario | `auto` | `always` | `never` |
| --- | --- | --- | --- |
| Cold home | 400 / 396 | 228 / 224 | 392 / 400 |
| Repeat home | 240 / 248 | 228 / 224 | 248 / 244 |
| Home → component library | 392 / 392 | 232 / 232 | 392 / 392 |
| Component library → platform modernization | 240 / 236 | 228 / 228 | 240 / 244 |
| Cold component library | 420 / 408 | 224 / 232 | 428 / 424 |

Inlining removes the stylesheet round trip and improves cold rendering by about 170–200ms, with no measured regression on repeat visits. The trade-off is caching: shared CSS is no longer reused across pages, which adds roughly 3–4 KB of compressed HTML per cached visit. A cold home → component library → platform modernization journey transfers about 26.5 KB of HTML/CSS with `always`, versus 21.6 KB with `auto`. Reconsider if the styles or typical browsing depth grow. CLS was unchanged.

### Font preload

An unconditional Plex Sans 600 preload was tested on the production preview (cold cache, 3 reloads per brand). Median LCP got worse: 400 → 528ms for spec, and 424 → 524ms for bold. It also fetched an unused ~24 KB Plex font for bold visitors, so it wasn't kept.

## TODO

### Open

- [ ] **Responsive testing.** Layouts are done and checked at 375, 768 and 1280px in both brands. Remaining: 320px, 200% and 400% zoom on desktop (no horizontal scrolling), keyboard order in the header, a real iPhone and Android phone, and Lighthouse on mobile.
- [ ] **Figma comparison.** Compare the screens against the final Figma frames, including mobile.

### After deployment

- [ ] Confirm the host permanently redirects trailing-slash URLs to their no-slash versions.
- [ ] Check social previews (LinkedIn, Slack) for the home page and each case study.
- [ ] Validate structured data with Google's Rich Results Test and the Schema.org validator.
- [ ] Make sure any Content Security Policy allows the inline styles generated by `inlineStylesheets: "always"`.
- [ ] Re-measure CSS inlining and font preloading on the deployed host, covering both brands.