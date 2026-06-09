Status: ready-for-agent
Title: eCongruity Visual Design Map

## Purpose

This document maps the visual and interaction direction for the eCongruity website before implementation. It complements `PRD.md` and the implementation issues in `.scratch/econgruity-website/issues/`.

The design direction is **Strategic Natural** with **Calm Authority**: credible, composed, founder-led, practical, and quietly distinctive. Nature should function as a metaphor for intentional growth, systems thinking, and durable business change, not as an environmental-consulting claim.

## Design Principles

1. Lead with strategic clarity.
   Visitors should understand within the first viewport that eCongruity is a Strategic Innovation Studio helping Organizational Leaders move from complex challenges to implemented solutions.

2. Feel calm, not sleepy.
   Use generous spacing, strong hierarchy, confident contrast, and clear section rhythm. Avoid overly soft, decorative, or vague wellness-brand cues.

3. Make complexity legible.
   Page structure, diagrams, and modules should help leaders recognize disconnected systems, unclear processes, stalled ideas, and cross-functional misalignment.

4. Show implementation without sounding like staff augmentation.
   Visual patterns should connect strategy and execution as one engagement arc, not as separate consulting and development services.

5. Keep proof close to positioning.
   Testimonial proof belongs directly after the Home hero so the promise is immediately supported.

6. Design for future replacement.
   Founder images, testimonials, and example proof can use structured placeholders now, but the design should make replacement with approved real content straightforward.

## Visual System

### Palette

Use the existing CSS variables as the core brand base:

- `--color-hunter-green`: deep brand ground for hero, footer, and high-emphasis bands.
- `--color-green-kelp`: secondary dark green for panels, nav states, and section dividers.
- `--color-killarney`: active green accent for links, diagrams, and emphasis.
- `--color-oxley` and `--color-pale-leaf`: quiet supporting greens for borders, captions, and calm surfaces.
- `--color-sundance`: restrained gold accent for calls to action, key markers, proof highlights, and process numbers.
- `--color-cement`: warm neutral for secondary text on light surfaces.
- `--color-white-linen` and `--color-linen`: primary light backgrounds and text on dark surfaces.

Add one or two warm neutral surface tokens during implementation if needed, such as a paper tone and a soft stone tone. Do not let the interface become a single-hue green palette. Each major page should include a mix of dark brand ground, linen surfaces, warm neutrals, and small gold accents.

### Typography

- Use the serif family for brand-scale moments: Home hero, page titles, major section headings, and selected pull quotes.
- Use the sans-serif family for navigation, body text, captions, forms, buttons, process labels, and dense explanatory content.
- Keep headings editorial and composed, not oversized inside compact modules.
- Use normal letter spacing except for small uppercase labels, where modest tracking is acceptable.
- Do not scale font size directly with viewport width.

### Layout

- Prefer full-width bands with constrained inner content over floating page-section cards.
- Use cards only for repeated content items such as testimonials, capability examples, founder bios, and contact-support details.
- Avoid cards inside cards.
- Keep border radii restrained, generally 8px or less.
- Use clear responsive constraints for repeated modules, process steps, form controls, and carousel controls so content changes do not shift the layout.

### Motifs

Subtle nature/system cues may include:

- Fine-line branching or path motifs.
- Process markers that feel like growth rings or mapped nodes.
- Soft textured placeholder areas for photos or story imagery.
- Section transitions that alternate between grounded dark bands and warm linen surfaces.

Avoid:

- Decorative blobs, bokeh, or orb gradients.
- Leaf-heavy environmental imagery.
- Generic SaaS dashboard mockups unless tied to a real capability example.
- Stock-like handshake or boardroom photography.
- Visuals that imply fixed packages, pricing tiers, or productized services.

## Site Shell

### Navigation

The shared navigation should include:

- eCongruity brand mark or wordmark text.
- Links to Home, Approach, Capabilities, About, and Contact.
- A primary `Start the Conversation` call to action leading to Contact.

Desktop behavior:

- Keep nav calm and compact.
- Use clear active and hover states with restrained accent color.
- Avoid tall marketing-style nav bars.

Mobile behavior:

- Use a standard menu button with accessible label and visible focus state.
- Ensure all links are reachable by keyboard.
- Keep the Contact CTA present without crowding the header.

### Footer

The footer should:

- Restate the Strategic Innovation Studio positioning.
- Include links to the top-level pages.
- Include placeholder business/contact details only when source material exists or is clearly marked replaceable.
- Close with a concise CTA to start a conversation.

## Page Designs

### Home

Goal: Establish relevance and trust quickly.

Recommended section order:

1. Hero
   - First visual signal: `eCongruity`.
   - Category label: `Strategic Innovation Studio`.
   - Support copy: people, process, and technology working together for real-time business and durable change.
   - Primary CTA: `Start the Conversation`.
   - Secondary CTA: `Explore the Approach`.
   - Use a subtle system/nature visual field or structured image placeholder on the first screen.

2. Testimonial proof
   - Place directly after the hero.
   - Support three proof statements or testimonials.
   - Treat named client content as provisional until approved.
   - Include keyboard-operable previous/next controls if implemented as a carousel.
   - Respect `prefers-reduced-motion`.

3. Operational and Growth Complexity
   - Help leaders recognize unclear processes, disconnected systems, underused technology, stalled ideas, and cross-functional misalignment.
   - Use a compact problem-to-path layout rather than a generic feature grid.

4. Approach preview
   - Summarize Strategy-to-Implementation Engagements.
   - Link to Approach.

5. Capabilities preview
   - Present examples of possible work, not packages.
   - Link to Capabilities.

6. Founder-led credibility preview
   - Introduce founder-led judgment without becoming a full biography.
   - Link to About.

7. Closing CTA
   - Reinforce Start the Conversation and lead to Contact.

### Approach

Goal: Explain how eCongruity moves from complex challenge to implemented solution.

Recommended section order:

1. Page hero
   - Position Strategy-to-Implementation Engagements as the core way of working.

2. Complexity framing
   - Describe Operational and Growth Complexity concretely.
   - Avoid generic business-problem language.

3. Engagement model
   - Explain clarification, practical solution design, and hands-on execution as one guided engagement.

4. Agile Innovation process
   - Visualize the process as six steps: Problem, Ideation, Collaboration, Solution, Iteration, Growth.
   - The visual should feel flexible and cyclical, not rigid or waterfall.

5. Working Group
   - Show that eCongruity assembles client decision-makers, people closest to the work, strategists, implementers, and outside specialists or vendors as needed.

6. CTA
   - Guide visitors to Contact.

### Capabilities

Goal: Help leaders recognize where their challenge might fit without presenting fixed offers.

Recommended section order:

1. Page hero
   - State that capabilities are examples of the kinds of work eCongruity can shape into a Tailored Solution.

2. Capability examples
   - Include workflow automation, app development, enterprise CMS, learning management, mobile strategy, process improvement, organizational efficiencies, and innovation-as-a-service.
   - Use equal-weight repeated modules to avoid implying pricing tiers or packages.

3. Tailored solution explanation
   - Clarify that the right mix is selected around the organization's needs, constraints, and situation.

4. Path to approach and contact
   - Link to Approach for the working model and Contact for the first conversation.

Avoid labels such as `packages`, `plans`, `tiers`, `pricing`, `service menu`, and `standard solution`.

### About

Goal: Establish founder-led credibility.

Recommended section order:

1. Page hero
   - Explain that eCongruity is founder-led and guided by practical judgment across strategy and implementation.

2. Credibility narrative
   - Focus on why the founders are credible guides for complex strategy-to-implementation work.

3. Founder bio slots
   - Use replaceable photo placeholders.
   - Lead with professional judgment, relevant experience, and role in guiding client work.
   - Include only enough personal or local texture to make each person feel real.

4. Proof bridge
   - Link back to Home proof or mention client stories as the preferred proof format.

5. CTA
   - Lead to Contact.

### Contact

Goal: Invite a low-friction first conversation about the challenge.

Recommended section order:

1. Page hero
   - Frame the first step as a conversation, not a quote request.

2. Start the Conversation form
   Required fields:
   - Name
   - Email
   - Organization
   - Role or title
   - What are you trying to solve?

   Excluded fields:
   - Budget
   - Timeline

3. Supporting note
   - Explain that eCongruity owns timeline and cost estimation as part of strategy and planning.

4. Static-host readiness
   - The form markup should be ready for Netlify Forms or equivalent static-host handling later, but v1 should not require a custom backend.

## Components And Modules

Recommended reusable modules:

- `SiteHeader`
- `SiteFooter`
- `PageHero`
- `SectionHeader`
- `ButtonLink`
- `ProofCarousel` or carousel-like proof module
- `CapabilityCard`
- `ProcessStep`
- `FounderBioCard`
- `ContactForm`
- `PlaceholderMedia`
- `CallToActionBand`

Component behavior:

- Buttons should use text for clear commands and icons only where they clarify action.
- Carousel controls should use recognizable previous/next icons with accessible labels.
- Cards should remain single-level repeated content items.
- Placeholder media should clearly indicate replaceable content in source/data, not necessarily as visible public text.

## Interaction And Motion

- Keep interactions simple and progressive.
- Use hover and focus states that improve clarity without adding visual noise.
- Testimonial carousel behavior should support keyboard controls and visible focus states.
- Disable or simplify non-essential motion when `prefers-reduced-motion: reduce` is active.
- Avoid autoplaying carousel motion unless it can be paused and respects reduced motion; manual controls are preferred.

## Responsive Behavior

- The first viewport should signal eCongruity and the next section on both mobile and desktop.
- Navigation, hero CTAs, carousel controls, capability modules, process steps, founder bios, and form fields must remain readable without text overlap.
- Use one-column mobile layouts, two-column tablet layouts where useful, and wider desktop layouts only when they improve scanning.
- Avoid viewport-width-based font scaling.
- Keep long labels and button text wrapped or constrained so they do not overflow.

## Accessibility Constraints

- Use semantic landmarks: header, nav, main, section, footer.
- Preserve meaningful heading order.
- Provide explicit form labels.
- Ensure all interactive elements are keyboard accessible.
- Provide visible focus states on links, buttons, form fields, and carousel controls.
- Maintain adequate color contrast on dark green and light linen surfaces.
- Respect reduced-motion settings.
- Do not rely on color alone to communicate active state or validation.

## Implementation Notes

- Keep the site static in Astro.
- Keep Tailwind utilities grounded in CSS variables/design tokens.
- Store structured content for capabilities, testimonials, and founder bios in maintainable data structures or content modules rather than scattering hardcoded repeated content through pages.
- Use `@lucide/astro` where icons clarify navigation or controls.
- Use `embla-carousel` only if a carousel is necessary; a simpler accessible proof module is acceptable if it meets the proof placement and keyboard requirements.
- Do not add CMS, analytics, CRM, backend form handling, final photography, or production testimonial approvals in v1.

## Acceptance Checklist

- [ ] The visual system communicates Strategic Natural and Calm Authority.
- [ ] The palette includes dark green, linen, warm neutrals, and restrained gold accents without becoming monochrome.
- [ ] Home immediately identifies eCongruity as a Strategic Innovation Studio.
- [ ] Testimonial proof appears directly after the Home hero.
- [ ] Approach shows the Strategy-to-Implementation Engagement model and the six Agile Innovation steps.
- [ ] Capabilities are examples, not packages or tiers.
- [ ] About supports founder-led credibility with replaceable founder bio/photo slots.
- [ ] Contact includes only name, email, organization, role/title, and challenge fields.
- [ ] Shared navigation and footer cover the whole site shell.
- [ ] Responsive layouts avoid text overlap and awkward control wrapping.
- [ ] Keyboard focus, form labels, heading order, and reduced-motion behavior are accounted for.
- [ ] Future implementation can pass `npm run check` and `npm run build`.

