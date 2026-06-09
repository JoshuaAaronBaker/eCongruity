Status: ready-for-agent
Title: Build the eCongruity Consulting Website

## Problem Statement

eCongruity needs a public website that clearly explains what the business does, who it serves, and why an Organizational Leader should start a conversation. The current repository has only a basic Astro/Tailwind scaffold and a domain glossary; the Figma file provides useful copy and tone, but the design and content need to be translated into a coherent, production-ready site.

The site must avoid positioning eCongruity as a generic agency, software shop, packaged-service vendor, or environmental consultancy. It needs to communicate eCongruity as a Strategic Innovation Studio that helps organizations simplify Operational and Growth Complexity through Strategy-to-Implementation Engagements, Hands-On Implementation, and Tailored Solutions.

## Solution

Build a polished, responsive Astro website for eCongruity using TypeScript and Tailwind CSS. The homepage should present eCongruity's public positioning and immediately support that positioning with a testimonial proof carousel below the hero. The broader site should explain the Strategic Innovation Studio offer, show Capabilities as examples rather than packages, describe the Agile Innovation engagement model, establish founder-led trust, and guide visitors toward a simple Start the Conversation form.

The site should use the glossary language in `CONTEXT.md` as the canonical business vocabulary. It should feel tailored, credible, and strategically calm: buyers should understand that eCongruity brings together people, process, and technology to create a Clear Path to Executable Growth and Durable Business Change.

## User Stories

1. As an Organizational Leader, I want to understand what eCongruity is within the first screen, so that I can decide whether the site is relevant to my challenge.
2. As an Organizational Leader, I want the homepage to position eCongruity as a Strategic Innovation Studio, so that I do not confuse it with a generic agency or software shop.
3. As an Organizational Leader, I want to see language about people, process, and technology, so that I understand eCongruity works across business and technical concerns.
4. As an Organizational Leader, I want to understand that eCongruity helps with Operational and Growth Complexity, so that I can recognize my own messy challenge in the offer.
5. As an Organizational Leader, I want to see examples of Capabilities, so that I know the kinds of work eCongruity can provide.
6. As an Organizational Leader, I want Capabilities to be presented as examples rather than fixed packages, so that I understand the work will be shaped around my context.
7. As an Organizational Leader, I want to understand that each engagement produces a Tailored Solution, so that I trust eCongruity is not forcing a template onto my organization.
8. As an Organizational Leader, I want to understand the Strategy-to-Implementation Engagement model, so that I know eCongruity can help beyond advice.
9. As an Organizational Leader, I want to know that eCongruity can provide Hands-On Implementation, so that I know they can help carry the work through launch.
10. As an Organizational Leader, I want implementation to sound selective and strategic, so that I do not mistake eCongruity for staff augmentation.
11. As an Organizational Leader, I want to see the Agile Innovation process, so that I trust there is a repeatable way of working.
12. As an Organizational Leader, I want the Agile Innovation process to feel flexible, so that I know my engagement will not be forced into a rigid methodology.
13. As an Organizational Leader, I want the process to start with problem definition, so that I know eCongruity will clarify the challenge before prescribing technology.
14. As an Organizational Leader, I want to see ideation and reframing in the process, so that I know eCongruity will challenge assumptions.
15. As an Organizational Leader, I want to see collaboration in the process, so that I understand eCongruity will align the right Working Group.
16. As an Organizational Leader, I want to see solution delivery in the process, so that I understand eCongruity helps move from concept to execution.
17. As an Organizational Leader, I want to see iteration in the process, so that I know the work includes feedback and learning.
18. As an Organizational Leader, I want to see growth in the process, so that I know the work is meant to create a stronger foundation after launch.
19. As an Organizational Leader, I want the site to explain Clear Path to Executable Growth, so that the outcome feels concrete without promising unrealistic metrics.
20. As an Organizational Leader, I want Durable Business Change to be clear, so that "sustainable" means maintainable, context-fit work rather than only environmental impact.
21. As an Organizational Leader, I want the Nature Meets Innovation language to feel like a brand metaphor, so that the site feels distinctive without misrepresenting the service.
22. As an Organizational Leader, I want to see founder-led credibility, so that I know who is responsible for the judgment behind the work.
23. As an Organizational Leader, I want concise Founder Bios, so that I can assess the people without reading long resumes.
24. As an Organizational Leader, I want the bios to lead with professional credibility, so that I can decide whether to trust eCongruity with a strategic challenge.
25. As an Organizational Leader, I want some personal or local texture in founder bios, so that the people feel real.
26. As an Organizational Leader, I want to see testimonials directly after the Home page hero, so that proof appears while the core positioning is fresh.
27. As an Organizational Leader, I want the testimonial proof carousel to support three testimonials, so that the site has enough social proof without needing a heavy case-study library.
28. As a site maintainer, I want named testimonials to be treated as provisional until approved, so that unconfirmed client quotes are not accidentally shipped.
29. As a site maintainer, I want placeholder testimonial content to be easy to replace, so that approved wording can be added later without redesigning the section.
30. As an Organizational Leader, I want a clear Start the Conversation call to action, so that I know the next step.
31. As an Organizational Leader, I want the contact form to ask for name, email, organization, role or title, and what I am trying to solve, so that I can start the relationship without over-explaining.
32. As an Organizational Leader, I do not want the first contact form to ask me for budget, so that I am not forced to estimate work that eCongruity should help scope.
33. As an Organizational Leader, I do not want the first contact form to ask me for timeline, so that I am not forced to predefine the strategy and planning work.
34. As eCongruity, I want to own timeline and cost estimation as part of strategy and planning, so that the first conversation stays focused on the challenge.
35. As an Organizational Leader, I want navigation that lets me jump to approach, capabilities, proof, about/founders, and contact, so that I can quickly inspect the parts that matter to me.
36. As a mobile visitor, I want the site to be fully responsive, so that the content is readable and persuasive on my phone.
37. As a keyboard user, I want all navigation, testimonial controls, and form fields to be operable without a mouse, so that the site is accessible.
38. As a screen reader user, I want the content structure to use meaningful headings, labels, and landmarks, so that I can understand the page.
39. As a visitor with motion sensitivity, I want motion to be limited and respectful of reduced-motion settings, so that the site remains comfortable.
40. As eCongruity, I want the site to be fast and mostly static, so that it loads quickly and is easy to host.
41. As eCongruity, I want content to be structured, so that testimonials, capabilities, and founder information can be maintained cleanly.
42. As a future agent, I want the site's vocabulary to align with `CONTEXT.md`, so that future edits do not drift into avoided language.
43. As a developer, I want the site to build with the existing Astro/Tailwind stack, so that the implementation stays simple and maintainable.
44. As a developer, I want a high-level test seam around the rendered pages, so that we verify user-visible behavior rather than implementation details.
45. As eCongruity, I want the site to be deployable as a static build, so that hosting remains low-complexity.

## Implementation Decisions

- Use Astro with TypeScript as the site framework.
- Use Tailwind CSS for layout, responsive styling, and visual implementation.
- Keep custom brand values as CSS variables/design tokens so Tailwind utilities remain grounded in eCongruity's palette and typography.
- Use the existing Astro static output mode.
- Use the domain glossary as the canonical source for business language.
- Build the first version as a content-driven marketing site rather than a full web application.
- Treat the Figma design as content and directional inspiration, not a strict implementation spec.
- Structure the site as a traditional multi-page website with Home, Approach, Capabilities, About, and Contact pages.
- Place testimonial proof on the Home page directly after the hero as a carousel or carousel-like proof section.
- Present Capabilities as examples of possible work, never as fixed packages or a service menu.
- Support three testimonials, with named testimonials considered provisional until approved.
- Include Founder Bios focused on credibility first and personal/local texture second.
- Implement the Start the Conversation form with fields for name, email, organization, role or title, and the challenge the visitor is trying to solve.
- Exclude budget and timeline fields from the first-contact form.
- Use simple progressive enhancement for any interactive pieces, such as testimonial controls or revealable cards.
- Use `@lucide/astro` only where icons clarify actions or navigation.
- Use `embla-carousel` for the Home page testimonial proof carousel if custom lightweight carousel behavior is needed.
- Keep the site static and deployable without a custom backend for the first version.
- Form handling may be wired to static-host form handling later, such as Netlify Forms, but the initial implementation should not require a bespoke server.
- Avoid ADRs for the current decisions because the stack choice and content model are straightforward and reversible at this stage.

## Testing Decisions

- Test at the highest seam possible: the built/rendered site, not low-level component internals.
- A good test verifies visible behavior and accessible structure: headings, navigation targets, testimonial content, form labels, required fields, and responsive layout stability.
- Use `npm run check` to validate Astro and TypeScript diagnostics.
- Use `npm run build` to verify the site compiles to static output.
- Add browser-level tests once the page structure exists, preferably with Playwright or an equivalent end-to-end tool.
- Browser tests should verify that the homepage renders the Strategic Innovation Studio positioning and testimonial proof carousel, and that the separate Approach, Capabilities, About, and Contact pages render their core content.
- Browser tests should verify that the form contains only the agreed fields and omits budget and timeline fields.
- Browser tests should verify navigation anchors work for key sections.
- Browser tests should verify mobile and desktop viewports to catch text overlap, unreadable controls, and layout regressions.
- Accessibility checks should verify heading order, landmark structure, form labels, keyboard focus visibility, and reduced-motion behavior.
- There is no prior test suite in this repo, so the first tests should establish page-level conventions rather than inventing a deep component-testing layer.

## Out of Scope

- Building a client portal, dashboard, authentication system, or application backend.
- Creating fixed packages, pricing tiers, or predefined service bundles.
- Asking visitors for budget or timeline in the first-contact form.
- Shipping named client testimonials before approval.
- Creating full case studies unless source material is provided.
- Creating a CMS integration for the first version.
- Creating a blog or resource library.
- Implementing detailed analytics, CRM integration, or automated email workflows.
- Treating Nature Meets Innovation as an environmental-consulting claim.
- Recreating the Figma design pixel-for-pixel.

## Further Notes

- The current repo contains a working Astro/Tailwind baseline with `npm run dev`, `npm run check`, and `npm run build`.
- The dev server has been verified locally at `http://127.0.0.1:4321/`.
- Production dependency audit passed with `npm audit --omit=dev`.
- The glossary in `CONTEXT.md` is the most important source of truth for future content and implementation work.
- The visual design direction for the full site is captured in `.scratch/econgruity-website/DESIGN_MAP.md`.
- The likely next step is to break this PRD into implementation issues for independent vertical slices.
