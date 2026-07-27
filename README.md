# eCongruity

The public website for eCongruity, a Strategic Innovation Studio that helps organizations connect people, process, and technology through strategy-to-implementation engagements.

The site is a static Astro project deployed on Netlify. It includes a responsive marketing experience across Home, Approach, Capabilities, About, and Contact pages, with brand-specific typography, animation, navigation, and verification coverage.

## Project Overview

eCongruity serves organizational leaders who are working through operational or growth complexity: unclear processes, disconnected systems, underused technology, stalled initiatives, or cross-functional misalignment.

The site is designed to make eCongruity feel:

- Grounded, strategic, and humane.
- Founder-led rather than faceless.
- Technically fluent without reading like a software shop.
- Practical about implementation, not just strategy.

Core language and positioning live in [CONTEXT.md](./CONTEXT.md). Use that file when changing page copy, messaging, headings, or service language.

## Tech Stack

- [Astro](https://astro.build/) for static site generation.
- TypeScript for scripts and typed content data.
- Tailwind CSS v4 tooling, with most production styling in `src/styles/global.css`.
- Playwright for responsive and behavior-focused end-to-end tests.
- Netlify for production hosting.

## Pages

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Homepage positioning, what eCongruity does, process, proof, and closing CTA. |
| `/approach/` | `src/pages/approach.astro` | Engagement model, complexity signals, working group framing, and challenge map. |
| `/capabilities/` | `src/pages/capabilities.astro` | Flexible capability areas and implementation ingredients. |
| `/about/` | `src/pages/about.astro` | Mission, story, founders, values, and founder-led credibility. |
| `/contact/` | `src/pages/contact.astro` | Contact introduction and Netlify-enabled inquiry form. |

## Key Directories

```text
src/
  components/       Shared Astro components for layout, navigation, forms, CTAs, and carousel UI.
  content/          Typed site content and navigation data.
  layouts/          Base document layout, global font loading, header/footer wiring.
  pages/            Astro page routes.
  scripts/          Browser behavior modules.
  styles/           Global brand, layout, responsive, and interaction CSS.

tests/
  pages.spec.ts     Playwright coverage for pages, layout, navigation, form behavior, and accessibility.

docs/
  verification.md   Verification expectations for shipping changes.
  agents/           Local issue-tracker and agent workflow notes.

public/
  images/           Static brand and page assets served from the site root.
```

## Brand System

The site uses a fixed brand palette and font pairing loaded in `src/layouts/BaseLayout.astro`.

### Fonts

- Display / serif: `Cormorant Garamond`
- Body / UI: `DM Sans`

The Google Fonts URL is loaded with a print-media swap pattern and a `noscript` fallback.

### Color Tokens

Defined in `src/styles/global.css`:

```css
:root {
  --moss: #1E3A1E;
  --fern: #3D6B4A;
  --sage: #7BA08A;
  --mist: #B8CEB8;
  --linen: #F0EAE0;
  --bark: #8A7060;
  --cream: #FAF6EF;
  --gold: #C8A55A;
  --ink: #111A10;
  --white: #FDFAF5;
}
```

Use these custom properties instead of hard-coded colors for new UI. In particular, hover and focus treatments that turn gold should use `var(--gold)`.

## Important UI Behavior

### Header

The site header is sticky, full-bleed, and opaque. It keeps its own horizontal padding instead of following the shared page content frame.

Current header behavior:

- Opaque `var(--ink)` background at rest, while scrolled, and when mobile navigation is open.
- Hides when scrolling down.
- Reappears when scrolling up.
- Keeps desktop navigation centered and the CTA right-aligned.
- Uses a mobile `details` menu with a moved panel/backdrop for viewport-level positioning.

### About Mission Stats

The About page mission stats use `src/scripts/countUpStats.ts`.

Behavior:

- Static HTML renders final values for no-JS safety.
- JavaScript counts values up once when the stat grid enters view.
- `prefers-reduced-motion: reduce` skips the animation and leaves final values in place.
- Values and suffixes are sourced from `aboutStats` in `src/content/site.ts`.

### Card Hover Treatments

The Home "Our Process" cards and About "Our Values" cards intentionally avoid a lighter full-card hover fill. The hover/focus feedback is limited to:

- Number turning gold.
- Title staying or turning gold.
- Bottom gold line animating in.

Other card groups have their own behavior and should not be changed by those scoped rules.

### Contact Form

The Contact form is a Netlify form:

- `data-netlify="true"`
- Honeypot field: `company-website`
- The "What problem are you facing?" field is a textarea to encourage a longer message.
- Budget and timeline fields are intentionally omitted.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the local dev server:

```sh
npm run dev
```

Astro will print the local URL, usually `http://localhost:4321`.

## Available Scripts

```sh
npm run dev
```

Starts the Astro development server.

```sh
npm run check
```

Runs Astro and TypeScript diagnostics.

```sh
npm run build
```

Builds the static site into `dist/`.

```sh
npm run preview
```

Serves the built site locally for inspection.

```sh
npm run test:e2e
```

Runs the Playwright suite.

```sh
npm run verify
```

Runs the full release check:

1. `npm run check`
2. `npm run build`
3. `npm run test:e2e`

Use `npm run verify` before shipping changes.

## Testing Notes

The Playwright suite in `tests/pages.spec.ts` covers:

- Top-level route rendering.
- Semantic landmarks and heading structure.
- Approved brand palette and font manifest.
- Desktop and mobile navigation behavior.
- Shared content gutters and responsive overflow.
- Home proof carousel behavior.
- About mission, story, team, values, and closing layout checks.
- Contact form fields, layout, and hover states.
- Keyboard focus visibility.
- Reduced-motion behavior.

Some tests intentionally run only in the desktop Playwright project because they perform their own viewport matrix internally.

## Deployment

Production hosting is configured for Netlify.

Netlify configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Production URL:

[https://www.econgruity.com](https://www.econgruity.com)

Manual production deploy from a verified local build:

```sh
npm run verify
npx netlify deploy --prod --dir=dist
```

The Netlify CLI may also run the configured build command during deploy. Check the CLI output for the production deploy URL and deploy logs.

## Content Editing

Most shared copy and structured content lives in `src/content/site.ts`, including:

- Navigation items.
- Capability descriptions.
- Homepage process steps.
- Approach and challenge-map content.
- Testimonials and proof content.
- About stats and timeline entries.
- Founder data.

Page-specific layout and line composition live in the relevant `src/pages/*.astro` files. Many headings use explicit nested spans to preserve approved line breaks across responsive layouts, so copy changes should be checked visually and with Playwright.

## Styling Guidance

Most styling is centralized in `src/styles/global.css`. When editing styles:

- Prefer existing tokens and local class patterns.
- Keep shared page content aligned to `--site-content-width`.
- Preserve the full-bleed header behavior.
- Use responsive `clamp()` values where the existing system does.
- Avoid unscoped hover changes that affect unrelated card groups.
- Verify text does not overflow at mobile, tablet, small desktop, and wide desktop widths.

## Accessibility Notes

The site includes:

- A skip link.
- Semantic page landmarks.
- Button and navigation focus states.
- Reduced-motion accommodations for major animation behavior.
- No-JS fallback rendering for mission stat values.
- Form labels for the Contact form.

Continue to preserve keyboard and reduced-motion behavior when changing interactive scripts or CSS.

## Local Artifacts

The repo may contain local-only folders created during visual QA or agent workflows, such as:

- `.agents/`
- `.impeccable/`
- `output/`
- `tmp/`
- `test-results/`

Do not commit generated screenshots, temporary PDFs, or local skill/cache folders unless a task explicitly calls for them.

## Shipping Checklist

Before committing or deploying:

1. Review `git status --short`.
2. Stage only intentional source, content, and test changes.
3. Run `npm run verify`.
4. Commit with a concise message.
5. Push `main`.
6. Deploy with Netlify or confirm the remote deploy pipeline completed.

