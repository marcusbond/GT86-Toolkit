# Prompt Journal

What we prompted, what came back, and what we learned.

## Approach

1. Rough product vision
2. Capabilities landscape (what can the car actually give us)
3. Cross-reference user wants vs what's deliverable
4. Sharpen the use case
5. UX and IA
6. Build

## Prompt 1: Product Vision

> We're rethinking a GT86 diagnostic tool from the ground up. Before any code or tech decisions, what should this product actually be? Who is it for, and what problem does it solve? Don't assume answers. Flag what's unknown.

**Why this prompt:** "Don't assume" is the important bit. Without it, Claude fills in blanks with plausible-sounding guesses and you end up building the wrong thing confidently.

**What came back:** Three possible directions (diagnostic tool, track tool, companion app). Too broad, but that's the point. You need to see the options before picking one.

## Prompt 2: Capabilities Research

> What OBD2 diagnostic data is available on a Toyota GT86 (FA20 engine)? What's available via standard OBD2 vs Subaru's proprietary SSM2 protocol?

**Why this prompt:** Scoping, not tech selection. Oil temp and knock data need SSM2 and specific hardware. That's a product constraint, not a tech detail. No point designing features around data you can't get.

**What came back:** Standard OBD2 (CELs, coolant, fuel trims) works with any adapter. The interesting stuff (oil temp, knock) needs expensive hardware. This killed features we might have designed around.

## Prompt 3: Personas

> Define 2-3 personas for GT86 owners. Keep them short. Focus on what they need, not demographics.

**Why this prompt:** "Keep them short" stops Claude writing marketing fiction. Personas are scoping tools. If they're longer than a few lines, they're not doing their job.

**What came back:** Weekend Wrench, Tuner/Builder, New Owner. Cross-referencing against capabilities showed Tuner/Builder can't be served without SSM2. That narrowed the POC.

## Prompt 4: Sharpen the Use Case

> I'm thinking of buying a GT86, I don't know much about them, I want an app that lets me do some checks on a car pre-purchase.

This wasn't a carefully crafted prompt. It was a real scenario. And it was more useful than the structured prompts above because it was specific. "Pre-purchase check" is a job. "Diagnostic tool for GT86 owners" isn't.

Everything the buyer needs (DTCs, pending codes, readiness monitors, engine vitals) turned out to be standard OBD2. No SSM2 needed. No special adapter. The POC scope fell out of the use case.

**Takeaway:** A real scenario you can describe in one sentence ("I want to check a car before buying it") will get you further than three rounds of persona work.

## Prompt 5: UX and IA

> Based on our personas and use case, what makes good UX here? What's the IA and what makes good IA?

Asking "what makes good IA" instead of "design the screens" gets you principles before layout. The answer: organise by what the buyer wants to know (what's wrong? has someone hidden problems?) not by the OBD2 spec (DTCs screen, PIDs screen).

We got: Connect, Scan, Report. Three steps. The report is the product. Everything else is setup.

## Prompts We Didn't Use

> What existing tools do GT86 owners use today and what's frustrating about them?

Would have been useful for competitive context. We skipped it because the use case was clear enough.

> What are the most common fault codes on the GT86 and what do they mean?

We'll need this when building the GT86-specific context layer. Not needed for UX scoping.

## Prompt 6: POC Wireframe

> Rough out the report screen in basic HTML. Just structure and placeholder content, no styling beyond what's needed to show the hierarchy.

Started with structure only. Then iterated on the visual design by talking about it, not by writing detailed specs.

### Vibing on the POC

This was the most iterative part. We went through several rounds:

1. **First pass** was structurally right but visually bland. System fonts, grey boxes, no personality.
2. **Added typography and colour** (Fraunces serif, warm tones). Looked like a blog. Too editorial.
3. **Tried tabbed categories** with swappable panels. Felt like a widget, not information. The tabs looked awful.
4. **Looked at Carwow and PistonHeads** for reference. The pattern: confident, clean, content-first. No gimmicks. Data presented plainly with good hierarchy.
5. **Dropped tabs, went to scrollable cards.** Each category is its own card. Scorecard row at the top for the summary. Felt more like a vehicle listing page.
6. **Added DVLA/MOT history.** You're already checking the car, why not pull in the stuff you'd normally pay HPI for?
7. **Fixed the palette.** Earthy/sand tones felt like Basecamp. Switched to cool blue-greys. Fresh, not warm.

What worked about the vibing process:
- Stating what was wrong ("looks like a blog", "tabs look awful") was more useful than describing what we wanted. Easier to react to something concrete than design in the abstract.
- Looking at real products (Carwow, PistonHeads) gave us a shared reference point. "Like that, not like this."
- Each round was small. Change one thing, look at it, react. Not big redesigns.

What we'd do differently:
- Should have looked at reference sites earlier, before writing any CSS. Would have saved a couple of rounds.
- The font and colour exploration would have been faster with a moodboard or a few screenshots rather than iterating in code.

## Prompt 7: Reflection

> Let's reflect on whether we equal or improve the original POC and whether we are aligned with vision and deliver on our personas.

This is worth doing explicitly. We compared the original iOS app (three buttons, raw PID dumps, developer tool) against the POC (single flow, plain language, GT86 context, DVLA history). The comparison made it obvious the POC is a different product, not a port.

It also caught a gap: we'd been thinking about "clear fault codes" as a feature, but that doesn't belong in a pre-purchase tool. You don't write to someone else's ECU. That led to the Phase 1 / Phase 2 split, which cleaned up the personas.

**Takeaway:** Stepping back to check alignment is cheap and catches drift early. We'd been building for 45 minutes and had already started assuming Weekend Wrench was a POC user. They're not. They're Phase 2.

## What we learned

"Can we get oil temp?" is a product question. Answering it early killed a feature direction before we wasted time on it.

A real scenario beats a structured prompt. Every time.

Asking for principles ("what makes good IA?") gets better results than asking for deliverables ("design the IA"). Claude explains the thinking, you apply it.

And "don't assume" is the single most useful instruction you can give Claude. Without it, Claude fills gaps. With it, Claude flags them. You want the flags.
