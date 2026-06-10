Status: ready-for-agent
Title: Build About Page with Founder-Led Credibility

## Parent

.scratch/econgruity-website/PRD.md

## What to build

Build the About page around eCongruity's Founder-Led trust posture. The page should explain who leads the work, what kind of judgment they bring, and why clients can trust eCongruity with Strategy-to-Implementation Engagements. Founder Bios should lead with professional credibility and include only enough personal or local texture to feel real.

## Photo requirements

Use the provided team photos from `/Users/baker/Downloads/photos team/` as founder/team portraits within the About page bio cards. These photos should support the founder-led credibility narrative; do not turn the About page into a standalone photo gallery.

Portraits should be modest circular images that fit the current eCongruity design system:

- Place each portrait inside its related founder/team bio card on `/about/`.
- Render portraits as circles with `border-radius: 9999px`, `aspect-ratio: 1 / 1`, and `object-fit: cover`.
- Target a portrait size around `5rem` to `6rem` on desktop, with `6rem` as the maximum intended display size.
- Avoid full-width or oversized card images.
- Preserve the current visual language: linen/stone surfaces, restrained borders, soft shadow, and hunter green/sundance accents.

## Implementation expectations

- Create a stable project asset location for the selected portraits, such as `public/images/team/`.
- Copy and rename selected photos with simple lowercase slugs so the image paths are maintainable.
- Extend the `Founder` content model in `src/content/site.ts` with optional image metadata, such as `imageSrc` and `imageAlt`.
- Update `src/pages/about.astro` to render an actual `<img>` when `imageSrc` exists.
- Use meaningful alt text for real portraits, ideally tied to the person's name and role.
- Keep placeholder support for bios that do not yet have final approved names, roles, bios, or images.

## Design and accessibility expectations

- Portraits should add credibility and warmth without overpowering the bio text.
- Do not stretch, distort, or crop faces awkwardly; use square/circular crops that keep the subject centered.
- Decorative fallback placeholders should remain hidden from assistive technology.
- Real portraits should not be `aria-hidden`; they should use descriptive `alt` text.
- Ensure the layout remains clean on mobile and desktop, with no text overlap or awkward spacing.

## Acceptance criteria

- [ ] The page includes a founder-led credibility narrative.
- [ ] The page supports concise Founder Bios.
- [ ] Founder Bio content emphasizes judgment, relevant experience, and role in guiding client work.
- [ ] Personal or local texture supports credibility without becoming a life story.
- [ ] Placeholder bio content is clearly easy to replace when final founder details are available.
- [ ] Founder/team portraits from `/Users/baker/Downloads/photos team/` are placed in the About page bio cards.
- [ ] Portraits are circular, consistently sized, and no larger than `6rem`.
- [ ] Real portraits have useful alt text, while decorative placeholders remain hidden from assistive technology.
- [ ] The page includes a clear path to Home page proof and Contact.

## Test plan

- Run the project build after implementation.
- Verify `/about/` visually at mobile and desktop widths.
- Confirm portraits are circular, consistently sized, not too large, and aligned with the existing cards.
- Confirm image paths resolve from the built site.
- Confirm real image alt text is present and no layout shifts or text overlap occur.

## Assumptions

- The About page should remain founder/team credibility focused, not become a standalone photo gallery.
- The implementer may choose the best matching photos from `/Users/baker/Downloads/photos team/` unless final person-to-photo mappings are later supplied.
- Final names and bios may still be placeholder content, so the implementation should preserve an easy replacement path.

## Blocked by

- .scratch/econgruity-website/issues/01-establish-structured-site-content-layout-navigation.md
