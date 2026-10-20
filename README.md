# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Page metadata

Every page using `BaseLayout` must provide a unique `title` and `description`.
The layout uses these for search metadata, Open Graph, and Twitter cards, and
generates an absolute canonical URL from the page pathname and `site` in
[astro.config.mjs](astro.config.mjs), without query strings or fragments.
The `site` setting is required.

Page URLs use no trailing slash, except for the homepage (`/`).
The config sets `trailingSlash: "never"`; internal page links, canonical URLs,
and `og:url` follow the same convention. Static hosting must serve these
extensionless URLs and permanently redirect trailing-slash variants to them.
Verify this on deployment: Astro's setting alone does not configure every host's
redirects.

Pages default to the shared 1200 x 630 social image, with a large-image Twitter
card and Open Graph image metadata. Override it with an `image` URL or
root-relative public asset path and `imageAlt`. Dimensions default to 1200 x 630
for all images; override `imageWidth` / `imageHeight` only when the asset differs.
Custom images do not inherit the default image's alt text.

`npm run social:images` generates the default and three case-study PNGs in
`public/assets/social/`. It also runs before `npm run build`. Edit the shared
template and copy in [scripts/generate-social-images.mjs](scripts/generate-social-images.mjs)
to regenerate them. The template reads primitive colors from the site's tokens
and outlines packaged IBM Plex Sans / Mono glyphs, requiring no system fonts,
network font downloads, or runtime image service. Each image must be below
200 KB. These build-time dependencies add no browser JavaScript.

```astro
<BaseLayout
  title="My case study - Nico Collin"
  description="A concise summary of this case study."
  image="/assets/my-case-study-preview.jpg"
  imageAlt="A preview of the case study"
>
  <!-- Page content -->
</BaseLayout>
```

Use `noindex` for pages that should not appear in search results. These pages
receive a `noindex` robots directive and omit the canonical tag; `og:url` remains
available for social sharing. It is currently
set on the 404 page and the draft platform-modernization case study; remove it
from the case study when it is ready to be indexed. `noindex` is not access control:
the page remains publicly accessible.

## Tags

`Tag` accepts `tone="accent"` (the default) or `tone="muted"`. Accent uses the
theme's accent text color; muted uses its secondary text color. Omitting `tone`
preserves the accent appearance used by hero eyebrows.

## Segmented control

Use the control's default slot to provide radio segments:

```astro
---
import SegmentedControl from "./src/components/atoms/segmented-control/segmented-control.astro";
import Segment from "./src/components/atoms/segmented-control/_segment.astro";
---

<SegmentedControl label="View layout">
  <Segment name="view-layout" value="grid" checked>Grid</Segment>
  <Segment name="view-layout" value="list">List</Segment>
  <Segment name="view-layout" value="map" disabled>Map</Segment>
</SegmentedControl>
```

Adjust the import paths relative to the consuming component. The required `label`
provides a visually hidden legend. All segments in a control must share a nonempty
`name` and have distinct `value` props; use different names for independent controls
in the same form (or page outside a form). Set `checked` on at most one segment for
an initial selection. Each segment's slot should contain text or non-interactive
content such as a decorative icon, not links or buttons.

Native radios provide single selection, keyboard navigation, and form submission
without JavaScript. Use `disabled` on a segment or the entire control, and `required`
on a segment if the group must have a selection. The component changes selection
only; filtering content or switching panels requires separate application logic
listening for the native `change` event.

## Organism scaffolds

Each component in `src/components/organisms/` has a matching folder, `.astro` file,
CSS Module, and root class. All accept content through a default slot.

The `step-list`, `lesson-list`, and `work-list` components render native lists:
wrap each slotted item in `<li>`. Supply appropriate headings when using the
section and article components. These are structural scaffolds; layouts and
interactive behavior are not implemented yet.

## Import aliases

[tsconfig.json](tsconfig.json) defines aliases for all local source imports,
including colocated CSS Modules and SVG assets:

| Alias | Directory |
| --- | --- |
| `@atoms/*` | `src/components/atoms/*` |
| `@molecules/*` | `src/components/molecules/*` |
| `@organisms/*` | `src/components/organisms/*` |
| `@layouts/*` | `src/layouts/*` |
| `@styles/*` | `src/styles/*` |
| `@/*` | `src/*` (other source files) |

Astro resolves these aliases in both the editor and builds, including nested paths.
Package imports such as `astro:assets` and `astro/types` are unchanged.

```astro
---
import Link from "@atoms/link/link.astro";
import styles from "@atoms/link/link.module.css";
---
```

## CSS tokens

The header's brand selector saves its choice in local storage under `nc-brand`.
The shared layout restores a valid `spec` or `bold` choice in an inline head
script before rendering. Without a valid saved choice, the layout's `brand` prop
is used. Storage failures are logged to the console and do not prevent switching
the current page's brand.

The three global stylesheets in [src/styles/tokens](src/styles/tokens/) correspond
one-to-one with the JSON sources in [specs](specs/):

| Source | Stylesheet | Scope |
| --- | --- | --- |
| `primitives.tokens.json` | `primitives.css` | `:root` |
| `semantic.bold.tokens.json` | `semantic.bold.css` | `[data-theme="bold"]` |
| `semantic.spec.tokens.json` | `semantic.spec.css` | `[data-theme="spec"]` |

Token paths become hyphenated custom properties prefixed with `nc-`:
`color.text.primary` becomes `--nc-color-text-primary`. All authored CSS classes
also use the `nc-` prefix, including CSS Module keys and utility classes.
JSON token paths and component filenames remain unchanged.
Aliases remain `var()` references, and font-family arrays
become CSS font stacks. Pixel dimensions in the JSON are converted to rem in CSS
by dividing by 10; other values and theme names follow the source files:
`bold` contains the yellow / Archivo palette; `spec` contains the dark slate / Plex
palette.

The homepage imports all three files. Select a theme on `<html>` (or a containing
element) with `data-theme="bold"` or `data-theme="spec"`, then consume the tokens
in component CSS:

```css
.nc-example {
  color: var(--nc-color-text-primary);
  background-color: var(--nc-color-background-surface);
  padding: var(--nc-padding-md);
  font-family: var(--nc-font-family-body);
}
```

The [shared layout](src/layouts/base-layout.astro) loads IBM Plex Sans, IBM Plex
Mono, Archivo, and Archivo Black through Astro's Fonts API, configured in
[astro.config.mjs](astro.config.mjs). Fontsource provides the files at build time;
Astro caches and serves them from the site, without third-party font requests
from visitors. The first three families include normal weights 400, 500, and 600;
Archivo Black includes normal weight 400. All use the Latin subset and
`font-display: swap`. Font-family primitives reference Astro's generated font
variables, keeping semantic token usage unchanged. Fonts are fetched by the
browser when used, rather than preloading every family.

These CSS files are static:
keep them in sync when editing their JSON sources.

The shared [base layout](src/layouts/base-layout.astro) imports
[layout.css](src/styles/layout.css), which sets the root font size to `62.5%` and
the body to `1.6rem`. With a browser default of 16px, `1rem` equals 10px, so
`24px` in the design becomes `2.4rem`. Browser font preferences still scale these
lengths. Use semantic tokens such as `var(--nc-padding-md)` without doing conversions
in components. All length tokens, including borders and letter spacing, use rem;
colors, font families, weights, and opacity retain their appropriate types.

The sources reference these undefined typography tokens, which are intentionally
preserved without invented values:

- `--nc-type-size-md` (bold only)
- `--nc-type-size-lg`
- `--nc-type-size-xl`
- `--nc-type-line-height-md` (bold only)
- `--nc-type-line-height-lg`
- `--nc-type-line-height-lg-tight`
- `--nc-type-line-height-xl`

Define them at the theme scope before using the dependent heading, display, and
large-data tokens. Until then, those dependent custom properties are invalid at
computed-value time.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
