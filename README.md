# eCongruity Website

This repository contains the public website for eCongruity, a Strategic Innovation Studio that helps organizations connect people, process, and technology through strategy-to-implementation engagements.

The site is a static [Astro](https://astro.build/) project. It is designed as a focused marketing and inquiry experience for organizational leaders who are facing operational or growth complexity: unclear processes, disconnected systems, underused technology, stalled initiatives, or cross-functional misalignment.

## Table of Contents

- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [Site Map](#site-map)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Content Model](#content-model)
- [Design System](#design-system)
- [Interactive Behavior](#interactive-behavior)
- [Testing and Verification](#testing-and-verification)
- [Deployment](#deployment)
- [Maintenance Guide](#maintenance-guide)
- [Contribution Guide](#contribution-guide)
- [Troubleshooting](#troubleshooting)

## Project Goals

The website should help a prospective client quickly understand:

- What eCongruity is: a Strategic Innovation Studio, not a generic agency, software shop, or staff-augmentation provider.
- Who it serves: organizational leaders at small to mid-sized businesses, nonprofits, growth-stage ventures, and enterprise teams.
- What problems it fits: operational and growth complexity that needs both strategy and implementation.
- How eCongruity works: clarify the challenge, align the right working group, shape a tailored solution, and carry the work into implementation where needed.
- What action to take next: start a conversation by describing the challenge, without being forced into a premature quote, budget, or timeline request.

The canonical language for the business, audience, positioning, and terms of art lives in [`CONTEXT.md`](./CONTEXT.md). Read it before changing page copy, headings, service descriptions, proof language, or calls to action.

## Tech Stack

- [Astro](https://astro.build/) for static site generation and file-based routing.
- TypeScript for typed content and browser behavior modules.
- CSS with Tailwind CSS v4 PostCSS tooling. Most production styles are written directly in [`src/styles/global.css`](./src/styles/global.css).
- [@lucide/astro](https://lucide.dev/) for icons.
- [Embla Carousel](https://www.embla-carousel.com/) for carousel behavior.
- [Three.js](https://threejs.org/) for the mountain particle visual.
- [Playwright](https://playwright.dev/) for responsive, behavioral, accessibility, and visual-regression-adjacent checks.
- Netlify for production hosting.

## Site Map

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | [`src/pages/index.astro`](./src/pages/index.astro) | Homepage positioning, audience signals, capability paths, process overview, proof, and primary CTA. |
| `/approach/` | [`src/pages/approach.astro`](./src/pages/approach.astro) | Explains the engagement model, complexity signals, working group framing, and challenge-map outputs. |
| `/capabilities/` | [`src/pages/capabilities.astro`](./src/pages/capabilities.astro) | Presents capability areas as flexible ingredients for tailored solutions rather than fixed service packages. |
| `/about/` | [`src/pages/about.astro`](./src/pages/about.astro) | Communicates purpose, origin story, team credibility, values, and founder-led trust. |
| `/contact/` | [`src/pages/contact.astro`](./src/pages/contact.astro) | Provides the inquiry path and Netlify-powered contact form. |

## Repository Structure

```text
.
|-- src/
|   |-- components/       Shared Astro components for navigation, layout sections, CTAs, forms, and proof UI.
|   |-- content/          Typed site content, navigation data, capabilities, testimonials, stats, and team data.
|   |-- layouts/          Base HTML document layout, global metadata, fonts, header, footer, and global scripts.
|   |-- pages/            Astro routes for the public pages.
|   |-- scripts/          Browser-only TypeScript modules for animation and interaction.
|   `-- styles/           Global brand, layout, typography, responsive, and interaction CSS.
|-- public/
|   `-- images/           Static brand, hero, favicon, and team assets served from the site root.
|-- tests/                Playwright end-to-end and regression checks.
|-- docs/                 Verification and agent workflow documentation.
|-- astro.config.mjs      Astro configuration.
|-- netlify.toml          Netlify build and publish configuration.
|-- package.json          Dependencies and project scripts.
`-- README.md             Project guide.
```

Some local folders may appear during development or automated review workflows, such as `.astro/`, `dist/`, `.netlify/`, `test-results/`, `playwright-report/`, `output/`, `tmp/`, `.agents/`, and `.impeccable/`. Generated build output, screenshots, reports, caches, and temporary review artifacts should not be committed unless a task explicitly calls for them.

## Getting Started

### Requirements

- Node.js with npm.
- Git.
- Playwright browser dependencies for running the end-to-end test suite.
- Netlify CLI only if you need to run manual deploys from your machine.

This project uses `package-lock.json`, so prefer `npm` commands for dependency management.

### Install Dependencies

```sh
npm install
```

If Playwright browsers are not already installed on your machine, install them with:

```sh
npx playwright install
```

### Start Local Development

```sh
npm run dev
```

Astro will print a local URL, usually:

```text
http://localhost:4321
```

Open that URL and verify the primary pages while you work.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Astro development server. |
| `npm run check` | Runs Astro and TypeScript diagnostics. |
| `npm run build` | Builds the static site into `dist/`. |
| `npm run preview` | Serves the built site locally for inspection. |
| `npm run test:e2e` | Runs the Playwright test suite. |
| `npm run verify` | Runs `check`, `build`, and `test:e2e` in sequence. |

Run the full verification command before shipping meaningful changes:

```sh
npm run verify
```

## Content Model

Most reusable site content lives in [`src/content/site.ts`](./src/content/site.ts). This file exports typed data used across pages and components, including:

- Site name, category, positioning, and primary CTA language.
- Header navigation items.
- Capability descriptions.
- Homepage diagnostic signals and page-path cards.
- Agile Innovation process steps.
- Approach page complexity, engagement, challenge-map, and working group content.
- Testimonials and proof-story data.
- About page stats, timeline entries, and founder/team data.

Use `src/content/site.ts` for content that is reused, list-driven, or likely to be maintained by non-layout editors. Use page files in `src/pages/` for page-specific composition, section order, one-off copy, and markup that controls layout.

### Copy Guidelines

Before editing copy, read [`CONTEXT.md`](./CONTEXT.md). In general:

- Use "Strategic Innovation Studio" for the category.
- Use "Organizational Leader" for the buyer.
- Use "Strategy-to-Implementation Engagement" for the core work.
- Describe capabilities as examples or ingredients, not packages.
- Treat "Nature Meets Innovation" as a metaphor for intentional growth, systems thinking, sustainability, and local texture. Do not make the site sound like an environmental consultancy.
- Keep timeline and cost out of the first contact form. Those belong in discovery and planning.

When editing headings, check them visually on small mobile, tablet, desktop, and wide desktop. Several headings use explicit spans or line composition to preserve the approved rhythm across viewports.

## Design System

The core design system is implemented in [`src/styles/global.css`](./src/styles/global.css), with global document setup in [`src/layouts/BaseLayout.astro`](./src/layouts/BaseLayout.astro).

### Typography

The site loads Google Fonts from the base layout:

- Display and editorial type: `Cormorant Garamond`
- Body and interface type: `DM Sans`

The font link uses a print-media loading pattern with a `noscript` fallback. Preserve this when changing font loading so text remains resilient if JavaScript is disabled.

### Color Tokens

Brand colors are defined as CSS custom properties:

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

Use these tokens for new UI instead of hard-coded colors. If a new color is genuinely required, add it deliberately and update tests or documentation as needed.

### Layout Conventions

- Shared content width is controlled through site-level container styles in `global.css`.
- Page sections are generally full-width bands with constrained inner content.
- The header is sticky and full-bleed.
- The site uses large editorial typography on hero and major section headings, with tighter sizing inside cards, lists, navigation, and form controls.
- Responsive behavior should be verified at mobile, tablet, small desktop, and wide desktop widths.
- Avoid global style changes that unintentionally affect unrelated card groups or page sections.

## Interactive Behavior

Interactive browser behavior is split into small modules under [`src/scripts/`](./src/scripts):

| Script | Purpose |
| --- | --- |
| [`scrollReveals.ts`](./src/scripts/scrollReveals.ts) | Reveals section content as it enters the viewport, with reduced-motion handling. |
| [`siteCursor.ts`](./src/scripts/siteCursor.ts) | Adds the custom cursor effect for pointer devices that support hover. |
| [`mountainParticles.ts`](./src/scripts/mountainParticles.ts) | Renders the Three.js particle treatment used by the mountain hero visual. |
| [`exclusiveFlipCards.ts`](./src/scripts/exclusiveFlipCards.ts) | Keeps flip-card interactions mutually exclusive within a card group. |
| [`countUpStats.ts`](./src/scripts/countUpStats.ts) | Animates About page stats once they enter view, while preserving static no-JS values. |

Global scripts are initialized from [`src/layouts/BaseLayout.astro`](./src/layouts/BaseLayout.astro). Page-specific scripts should be imported close to the page or component that owns the behavior.

When adding or changing interactions:

- Preserve keyboard access.
- Preserve usable no-JS content where the HTML carries meaningful information.
- Respect `prefers-reduced-motion`.
- Test hover, focus, touch, and mobile menu behavior.
- Confirm no horizontal overflow is introduced.

## Testing and Verification

The Playwright suite lives in [`tests/pages.spec.ts`](./tests/pages.spec.ts). It covers the public pages and protects several project contracts:

- Top-level page rendering.
- Landmarks and usable heading structure.
- Approved brand palette and font manifest.
- Desktop and mobile navigation.
- Responsive content gutters and overflow.
- Homepage proof carousel behavior.
- Contact form fields and layout.
- Keyboard focus visibility.
- Reduced-motion behavior.
- Selected layout, typography, and section surface expectations.

The Playwright config starts the built site with `npm run preview` on `http://127.0.0.1:4321`. Because tests run against the preview build, build the site before running Playwright directly:

```sh
npm run build
npm run test:e2e
```

For the standard release check, use:

```sh
npm run verify
```

Additional verification notes are documented in [`docs/verification.md`](./docs/verification.md).

## Deployment

The production site is configured for Netlify in [`netlify.toml`](./netlify.toml):

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Production URL:

[https://www.econgruity.com](https://www.econgruity.com)

Before deploying, run:

```sh
npm run verify
```

For a manual production deploy with the Netlify CLI:

```sh
npx netlify deploy --prod --dir=dist
```

If the Netlify CLI is configured to run the build command during deployment, review its output and confirm the deploy URL and logs.

## Maintenance Guide

### Editing Pages

Page files live in [`src/pages/`](./src/pages/). Each page imports [`BaseLayout`](./src/layouts/BaseLayout.astro), shared components, and content from [`src/content/site.ts`](./src/content/site.ts).

When changing a page:

1. Start with the content model if the change belongs to shared data.
2. Update the page markup only where layout or section-specific composition needs to change.
3. Keep semantic headings in order.
4. Check desktop and mobile navigation if route labels or paths change.
5. Run `npm run check` early, then `npm run verify` before shipping.

### Editing Components

Shared components live in [`src/components/`](./src/components/):

- [`SiteHeader.astro`](./src/components/SiteHeader.astro) owns primary and mobile navigation.
- [`SiteFooter.astro`](./src/components/SiteFooter.astro) owns footer navigation and footer CTA treatment.
- [`PageHero.astro`](./src/components/PageHero.astro) provides the common interior-page hero structure.
- [`ButtonLink.astro`](./src/components/ButtonLink.astro) provides styled link buttons.
- [`ContactForm.astro`](./src/components/ContactForm.astro) owns the Netlify inquiry form contract.
- [`ProofCarousel.astro`](./src/components/ProofCarousel.astro) owns testimonial/proof presentation.
- [`HeroScrollButton.astro`](./src/components/HeroScrollButton.astro) provides the hero scroll affordance.

Prefer extending existing components before adding new ones. Add a new component when markup repeats, behavior has a clear owner, or the page file becomes hard to scan.

### Editing Styles

Most styles are in [`src/styles/global.css`](./src/styles/global.css). When editing CSS:

- Reuse brand tokens and existing layout patterns.
- Keep focus states visible.
- Avoid unscoped selectors for cards, buttons, navigation, and section surfaces.
- Test small viewports for text wrapping and horizontal overflow.
- Preserve reduced-motion behavior for animated sections.
- Update Playwright expectations if you intentionally change a protected visual contract.

### Editing Images

Static assets live in [`public/images/`](./public/images/). Files in `public/` are served from the site root, so this file:

```text
public/images/brand/econgruity-logo.png
```

is referenced in markup as:

```text
/images/brand/econgruity-logo.png
```

When replacing images:

- Keep filenames stable if the consuming markup should not change.
- Use descriptive `alt` text for meaningful images.
- Use empty or hidden alt treatment only for purely decorative imagery.
- Check image quality and crop at mobile and desktop sizes.
- Avoid committing large source exports if the web-ready asset is all the site needs.

### Maintaining the Contact Form

The contact form is configured for Netlify Forms in [`ContactForm.astro`](./src/components/ContactForm.astro). It includes:

- `data-netlify="true"`
- A hidden `form-name` input.
- A honeypot field named `company-website`.
- Required contact fields.
- A textarea for the challenge/problem description.

If fields are added, renamed, or removed, update the Playwright tests and confirm Netlify still recognizes the form after deployment.

### Dependencies

Use npm for dependency changes:

```sh
npm install package-name
npm install --save-dev package-name
```

Commit both `package.json` and `package-lock.json` for dependency updates. After changing dependencies, run:

```sh
npm run verify
```

## Contribution Guide

### Recommended Workflow

1. Pull the latest branch.
2. Create a focused feature branch.
3. Install dependencies with `npm install` if needed.
4. Run `npm run dev` and make the change.
5. Check the affected pages in the browser.
6. Run `npm run check` during development.
7. Run `npm run verify` before opening a pull request or deploying.
8. Review `git status --short` and stage only intentional files.

### Pull Request Expectations

A good pull request should include:

- A concise summary of the user-facing change.
- Notes about content, design, accessibility, or behavior that reviewers should inspect.
- The verification command that was run, usually `npm run verify`.
- Screenshots for visual changes when useful.
- Any deployment or Netlify form considerations.

### Code Standards

- Follow the existing Astro, TypeScript, and CSS patterns.
- Keep changes narrowly scoped.
- Prefer readable markup and CSS over clever abstractions.
- Keep content terminology aligned with [`CONTEXT.md`](./CONTEXT.md).
- Preserve semantic HTML and accessible names.
- Do not commit generated folders or local review artifacts.

### Issue Tracking

Project issues and PRDs are tracked as local markdown files under `.scratch/`. Agent workflow notes live in:

- [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md)
- [`docs/agents/triage-labels.md`](./docs/agents/triage-labels.md)
- [`docs/agents/domain.md`](./docs/agents/domain.md)

## Troubleshooting

### `npm run test:e2e` cannot connect to the site

Run a production build first:

```sh
npm run build
npm run test:e2e
```

The Playwright config uses `npm run preview`, which serves the built `dist/` output.

### Playwright browsers are missing

Install the browser binaries:

```sh
npx playwright install
```

### Styles or fonts look different in tests

Run the build again and make sure the Google Fonts URL, font family names, font weights, and color tokens still match the expectations in [`tests/pages.spec.ts`](./tests/pages.spec.ts).

### Netlify form submissions are not appearing

Confirm that the rendered form still includes the expected Netlify attributes and hidden `form-name` input. After deploying, check Netlify's Forms dashboard for the deployed site.

### The page has horizontal scrolling

Inspect the changed section at narrow widths first. Common causes are fixed-width elements, long unbroken text, oversized media, or absolute-positioned decorative elements extending beyond the viewport. The Playwright suite includes overflow checks for the top-level pages.
