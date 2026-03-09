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

## What we learned

"Can we get oil temp?" is a product question. Answering it early killed a feature direction before we wasted time on it.

A real scenario beats a structured prompt. Every time.

Asking for principles ("what makes good IA?") gets better results than asking for deliverables ("design the IA"). Claude explains the thinking, you apply it.

And "don't assume" is the single most useful instruction you can give Claude. Without it, Claude fills gaps. With it, Claude flags them. You want the flags.
