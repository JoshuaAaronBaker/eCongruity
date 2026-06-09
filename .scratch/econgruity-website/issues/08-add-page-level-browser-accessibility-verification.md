Status: ready-for-agent
Title: Add Page-Level Browser and Accessibility Verification

## Parent

.scratch/econgruity-website/PRD.md

## What to build

Add page-level verification for the multi-page eCongruity website. Tests should focus on user-visible behavior and accessible structure rather than internal component details. The verification should cover the top-level pages, navigation, key content, contact form fields, responsive layout, and build health.

## Acceptance criteria

- [ ] `npm run check` and `npm run build` are part of the documented verification flow.
- [ ] Browser-level tests or equivalent checks confirm that all top-level pages render.
- [ ] Tests confirm navigation reaches Home, Approach, Capabilities, About, and Contact.
- [ ] Tests confirm the Home page includes the testimonial proof carousel directly after the hero content.
- [ ] Tests confirm the Contact form includes the agreed fields and omits budget and timeline.
- [ ] Tests cover mobile and desktop viewports for obvious layout regressions.
- [ ] Accessibility checks cover meaningful headings, landmarks, form labels, keyboard focus, and reduced-motion behavior.

## Blocked by

- .scratch/econgruity-website/issues/02-build-home-page-positioning-and-cta.md
- .scratch/econgruity-website/issues/03-build-approach-page.md
- .scratch/econgruity-website/issues/04-build-capabilities-page.md
- .scratch/econgruity-website/issues/05-build-about-page-founder-led-credibility.md
- .scratch/econgruity-website/issues/06-build-home-page-testimonial-proof-carousel.md
- .scratch/econgruity-website/issues/07-build-contact-page-start-the-conversation-form.md
