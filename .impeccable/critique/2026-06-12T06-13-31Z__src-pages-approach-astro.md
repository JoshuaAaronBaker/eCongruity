---
target: Analyze the approach page
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-06-12T06-13-31Z
slug: src-pages-approach-astro
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active nav and clear CTAs work; no progress indication is needed for this static page. |
| 2 | Match System / Real World | 3 | The language fits organizational complexity, but stays abstract before showing a concrete engagement artifact. |
| 3 | User Control and Freedom | 3 | Navigation and CTAs are available; the page is still a mostly linear read. |
| 4 | Consistency and Standards | 3 | The system is consistent, but consistency becomes sameness across sections. |
| 5 | Error Prevention | 3 | Low-risk static page; contact path is clear. |
| 6 | Recognition Rather Than Recall | 3 | Signals and steps are recognizable, but the user has to remember how the frameworks relate. |
| 7 | Flexibility and Efficiency | 2 | Returning visitors get little skimmable shortcut to deliverables, roles, timeline, or first-call expectations. |
| 8 | Aesthetic and Minimalist Design | 2 | Calm and readable, but overuses eyebrow/H2/cards and does not create enough brand-specific moments. |
| 9 | Error Recovery | 3 | Not heavily applicable; no transactional states on this page. |
| 10 | Help and Documentation | 2 | It explains the philosophy, but does not answer enough “what happens next?” decision questions. |
| **Total** | | **27/40** | **Solid foundation; needs more specificity and art direction.** |

#### Anti-Patterns Verdict

**LLM assessment**: The page does not immediately fail the “AI made this” test, but it is standing close to the edge. The palette is coherent, the typography has presence, and the copy has more domain truth than a generic consultancy page. The risk is the accumulated grammar: repeated uppercase eyebrows, large serif headings, section bands, card grids, and numbered process cards. By the fourth section, the page feels more like a polished template than a founder-led studio explaining a distinctive way of working.

**Deterministic scan**: Clean. `node .agents/skills/impeccable/scripts/detect.mjs --json src/pages/approach.astro` returned `[]`, with no deterministic slop findings in the target file.

**Visual overlays**: No reliable user-visible overlay is available. Browser mutation preflight failed because the available Playwright evaluate surface is read-only, so script injection could not be confirmed.

#### Overall Impression

The Approach page is credible, calm, and readable. It succeeds at saying eCongruity connects strategy and implementation. Its biggest opportunity is to stop merely describing the approach and start demonstrating it: show the operating map, the working group shape, the first executable slice, or a concrete engagement arc.

#### What's Working

- The hero communicates the core promise quickly: complex challenge to implemented solution is the right conceptual bridge for this brand.
- The “Recognizable signals” section meets leaders where they are. The four cards name real symptoms instead of generic transformation claims.
- The dark green engagement section gives the page a strong tonal anchor and makes “strategy and execution stay connected” feel more committed than the surrounding lighter bands.

#### Priority Issues

**[P1] The page explains the method but does not show the work**

**Why it matters**: Organizational leaders are being asked to trust a custom engagement whose timeline and cost depend on discovery. Without a concrete artifact, example pathway, or before/after engagement slice, the page can feel reassuring but not yet actionable.

**Fix**: Add one signature section that visualizes the engagement: “Challenge Map → Working Group → First Executable Slice → Launch/Learning.” Make it feel proprietary to eCongruity, not like a generic process diagram. Include tangible outputs such as operating map, decision log, implementation backlog, configured workflow, adoption plan, or launch support.

**Suggested command**: `$impeccable shape approach page evidence section`

**[P1] Too many conceptual models compete for attention**

**Why it matters**: The page asks users to absorb complexity signals, Strategy-to-Implementation Engagement, Agile Innovation, Working Group, Tailored Solution, and executable growth. Each makes sense alone, but together they increase cognitive load. A first-time visitor may understand every paragraph and still leave unsure which model is the actual approach.

**Fix**: Choose one primary spine for the page. Treat the others as supporting layers. For example: lead with the 3-part Strategy-to-Implementation arc, fold “signals” into the entry point, fold “Agile Innovation” into how the work iterates, and fold “Working Group” into who participates at each stage.

**Suggested command**: `$impeccable distill approach page`

**[P2] The section rhythm becomes template-like**

**Why it matters**: A brand page should create memory. This one repeats eyebrow + serif H2 + paragraph + cards/lists across almost every fold, so the visual experience flattens even though the content is thoughtful.

**Fix**: Break the rhythm in two places. Replace one card grid with a left-to-right engagement map or annotated artifact. Replace one section header with a bolder editorial statement, founder note, or paired “what leaders bring / what eCongruity carries” composition. Keep cards only where comparison is the real job.

**Suggested command**: `$impeccable layout approach page`

**[P2] Brand distinctiveness is under-leveraged**

**Why it matters**: The current green/linen/gold palette and serif display type feel calm and grounded, but they also sit in a familiar consulting-and-studio lane. The Nature Meets Innovation metaphor is present in color but not yet in structure, imagery, or interaction.

**Fix**: Give the page one branded visual language that belongs to eCongruity: branching roots as decision pathways, operating-system layers, field notes from discovery, or an implementation “growth ring” motif. Avoid decorative nature cues; make the metaphor carry information.

**Suggested command**: `$impeccable bolder approach page`

**[P3] CTA intent is clear, but qualification is thin**

**Why it matters**: The final CTA wisely says the first conversation is not a quote request. Still, a cautious leader may wonder what to bring, what they will get back, and whether their challenge is mature enough.

**Fix**: Add a compact “A good first conversation sounds like…” block with 3 prompts and 2 outcomes. This can reduce hesitation without turning the page into a procurement flow.

**Suggested command**: `$impeccable clarify approach page CTA`

#### Persona Red Flags

**Jordan (First-Time Executive Sponsor)**: The page feels trustworthy, but Jordan may not know what decision they can make after reading it. The primary action is visible, yet the page does not clearly answer “what happens in the first conversation?” or “what will eCongruity produce before implementation starts?”

**Morgan (Operations Lead Close to the Work)**: The complexity signals will resonate, especially unclear processes and disconnected systems. The red flag is participation clarity: Morgan can see that people closest to the work matter, but not how much time, authority, or implementation burden the approach places on their team.

**Riley (Skeptical Buyer / Procurement-Adjacent Leader)**: The page intentionally avoids packaged pricing, which fits the brand. The risk is that Riley has few alternate decision anchors: no engagement boundaries, sample outputs, minimum viable scope, or proof that the model has worked in messy organizations.

#### Minor Observations

- Contrast is generally strong. Sample checks pass body requirements: cement on linen 7.86:1, cement on stone 5.64:1, pale leaf on green-kelp 7.48:1. Killarney on stone is 4.25:1, fine for bold uppercase labels but too low for small regular text if reused elsewhere.
- Mobile has no obvious horizontal overflow, and the hero scales cleanly.
- The page uses ordered numbers appropriately for true sequences, but the numbered visual treatment appears in more than one system, which weakens its meaning.
- The cards are restrained, but repeated card grids across the site risk making “tailored solution” feel less tailored.

#### Questions to Consider

- What is the one artifact a client would remember after an eCongruity engagement: a challenge map, implementation roadmap, working group model, or launch backlog?
- If this page had to prove “strategy and implementation stay connected” without saying that sentence, what would it show?
- Which terms are brand language, and which are only explanatory scaffolding: Agile Innovation, Working Group, Tailored Solution, Strategy-to-Implementation, executable growth?
