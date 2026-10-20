# Portfolio code review — design, SEO & performance

Oct 19, 2026 · @Nico

The site is lean and well structured; the biggest gaps are mobile layout, a few unused or missing tokens, and missing SEO basics (sitemap, og:image, structured data).

Scope: everything in `src` of [ncollin/portfolio](https://github.com/ncollin/portfolio) at commit `3d36e91`, plus a production build. The code was checked against the token system exported from Figma, not against the Figma frames themselves. Fonts couldn't download in the review sandbox, so font payload wasn't measured.

## Design vs code

The site has no responsive behavior yet, which matters most: on a phone the 72px hero title and the header row will overflow.

| # | Issue | Where | Fix |
| --- | --- | --- | --- |
| 1 | No responsive behavior. Only hover and reduced-motion media queries exist; display is 72px, layout padding 40px, header row never wraps. | `layout.css`, `header.module.css`, tokens | Add a mobile type and spacing scale (token mode or `clamp()`) and let the header wrap. |
| 2 | Hero `type` prop does nothing. No CSS for `nc-hero--home` / `--page`, home never passes `type="home"`, `heading-1` tokens unused anywhere. | `hero.astro`, `hero.module.css`, `index.astro` | Likely: case study heroes use `heading-1`, home uses `display`. Confirm in Figma. |
| 3 | Motion tokens missing. `motion-duration-*` and `motion-easing-standard` only work through hardcoded fallbacks. | button, link, card, segmented control CSS | Add them as Figma variables, or drop the `var()`. |
| 4 | Unused tokens: all 5 `icon-*` colors (icons follow `currentColor`), `background-surface`, `gap-2xl`. | `semantic.*.css` | Connect them in code, or remove them from Figma. |
| 5 | Toggle slides on load. A saved "bold" visitor gets "spec" checked in HTML; the header script fixes it after load, so the indicator animates. | `segmented-control.module.css`, `header.astro` | Drive the indicator from `[data-theme="bold"]`, which the inline script sets before paint. |
| 6 | Anchor jumps hide section titles. The sticky header is taller than `scroll-margin-top` (64px). | `layout.css` | Set `scroll-padding-top` on `html` to the header height. |

Smaller issues:

- [x] Button and Link compose icons before or after text in the default slot, without named icon slots.
- [x] Button links with `target="_blank"` announce "opens in a new tab" like Link.
- [x] Removed the duplicate button icon stroke rule; Icon owns stroke styling.
- [x] Removed the unused footer content passed by the layout.
- [ ] Token diagram still uses placeholder example names.
- [ ] The brand toggle sits inside `<nav>`, but it isn't navigation; move it beside the nav.

## SEO

The metadata base is solid; the gaps are URL consistency, social previews, structured data and a sitemap.

| # | Issue | Where | Fix |
| --- | --- | --- | --- |
| 1 | Done: page URLs consistently omit trailing slashes, except `/`. | `astro.config.mjs`, `base-layout.astro`, all links | `trailingSlash: "never"` and canonical normalization; verify permanent redirects on the deployed host. |
| 2 | Done: canonical tags are omitted on `noindex` pages (currently only the 404). | `base-layout.astro` | Keep the `noindex` robots directive and `og:url`; all three published case studies retain their canonical tags. |
| 3 | Done: default and case-study social images use a shared spec-themed template. | `base-layout.astro`, case-study pages, `scripts/generate-social-images.mjs` | Build-time 1200 x 630 PNGs with alt text and dimensions; verify social previews after deployment. |
| 4 | Done: homepage has `ProfilePage` / `Person` JSON-LD; case studies have `Article` with a shared author identity. | `base-layout.astro`, `index.astro`, case study pages | Safely serialized metadata with visible headlines, URLs, and images; no invented dates. Validate with external tools after deployment. |
| 5 | Done: official sitemap integration and Astro-generated `robots.txt`. | `astro.config.mjs`, `src/pages/robots.txt.ts`, `base-layout.astro` | Include home and all three published case studies, exclude the 404, and advertise the sitemap in robots and the page head. |

Smaller items:

- [x] Use `og:type="article"` on the case studies.
- [x] Use one title separator everywhere: `Page title · Nico Collin`.
- [x] Add `initial-scale=1` to the viewport tag.

## Performance

The site is already lean: no JS framework, about 34 KB of CSS in 3 files, and 17–29 KB of HTML per page.

| # | Issue | Where | Fix |
| --- | --- | --- | --- |
| 1 | Evaluated: keep fonts demand-loaded; no unconditional preload. | `base-layout.astro` | Cold-cache production-preview tests (3 runs per theme, 1.6 Mbps / 150 ms latency) found Plex Sans 600 preload did not improve LCP and fetched an unused ~24 KB font for saved-bold visitors. Revisit with deployed measurements if needed. |
| 2 | Done: Plex Mono uses an explicit monospace fallback while loading. | `astro.config.mjs` | `fallbacks: ["monospace"]`; other families and demand-loading behavior remain unchanged. |
| 3 | Done: removed developer markup comments from component source. | molecules and organisms | Comments no longer appear in source or generated HTML; rendered elements and content are unchanged. |
| 4 | Done: observer-only section and page-bottom tracking; no scroll or resize handlers. | `header.astro`, `base-layout.astro`, `layout.css` | A hidden end-of-page marker triggers the bottom override, including viewport/content-size changes; unchanged `aria-current` attributes are not rewritten. |
| 5 | 3 render-blocking CSS requests. | config | Consider `build.inlineStylesheets: "always"`. |

## Next steps

- [ ] Share the Figma file link (final frames, including mobile) to compare screens against the code.
- [ ] Finalize the content of the 3 case studies.
