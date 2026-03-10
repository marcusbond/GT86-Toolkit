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

## Prompt 8: Tooling Decisions

> Let's think about the build. Tooling first, repo structure. CRA is old hat. Thoughts? Think hard.

Deliberately asked for reasoning, not just a recommendation. "Think hard" is a useful nudge — without it you get the safe default answer (which would have been "use Vite" anyway, but without the comparison).

**What came back:** Vite over CRA (dead) and Next.js (unnecessary SSR complexity). Originally suggested plain JS and plain CSS "to keep it simple for a mentee." Pushed back on both:

> I think TS is de facto for this.

> I think best practice as per industry standards is a goal here.

Both corrections stuck immediately. The lesson: Claude optimises for reducing friction by default. If your goal is industry-standard practice, say so explicitly — Claude won't assume that's what you want in a mentoring context.

**Final stack:** Vite + React + TypeScript (strict) + Tailwind v4 + Vitest + ESLint + Prettier.

**Takeaway:** State your quality bar. "Industry standard" is a useful constraint that changes recommendations. Without it, you get the simplest thing. With it, you get the right thing.

## Prompt 9: Document Before Building

> We should document this and not race off.

One sentence. Stopped Claude from scaffolding immediately. This matters because decisions not written down get lost between sessions — especially in a mentoring project where the mentee needs to understand *why*, not just *what*.

Produced `docs/tooling.md` (stack choices with rationale) and `docs/build-plan.md` (seven slices with checklists and review checkpoints).

**Takeaway:** Claude defaults to action. If you want documentation, ask for it before the code starts. Once scaffolding begins, the moment has passed.

## Prompt 10: ELM327 Research

> How do we know what that looks like?

Asked before writing any connection layer code. The point: don't mock something you haven't seen. If the mock data doesn't match real ELM327 wire format, you'll rewrite the protocol parser later.

Pointed Claude at the ELM327-emulator reference from `docs/testing-approach.md` and asked it to research actual response formats for every command the app needs.

**What came back:** Complete reference doc with exact hex responses for all four scenarios, decoding formulas, error responses, AT command init sequence, and multi-frame format for VIN. All grounded in the ELM327 spec and emulator source, not invented.

**Takeaway:** "How do we know what that looks like?" is a better prompt than "build the mock data." Research before code. The 10 minutes spent on the reference doc saves rewriting the parser when you discover the format was wrong.

## Prompt 11: Build Phase — Iterative Slices

> ya then come back

> lfg

> commit ten both

The build phase prompts were short and directive. "lfg" (let's go) to start a slice. "ya" to approve and move on. "commit then both" to bundle related work. This worked because the build plan was already documented — Claude knew what each slice contained without being told.

**What worked:** The build plan did the heavy lifting. Each slice was scoped, ordered by dependency, with clear acceptance criteria. The prompts just said "go" and "next."

**What we'd do differently:** Nothing. Short prompts during build are fine when the plan is solid. Long prompts during build usually mean the plan wasn't clear enough.

## Prompt 12: Visual Verification

> see it, connect to chrome and drive

Instead of describing what the UI should look like, we pointed Claude at the browser and let it compare against the POC wireframe directly. Chrome automation caught issues (wrong scenario default, unstyled components) that text-based review would have missed.

**Takeaway:** "Look at it" beats "describe it." If your tool can see the output, use that. Visual bugs are visual — you catch them by looking, not by reading code.

## Prompt 13: Code Quality Audit

> scan the code and tests for any workarounds and also for compositions to avoid repetitive code

Asked explicitly before moving to the next slice. This caught:
- **FaultCodesCard and PendingCodesCard** were near-identical — extracted into a shared DtcCard component
- **`import.meta.env.MODE === 'test'`** — reviewed and kept as standard Vite pattern, not a hack
- **Parser boilerplate** — reviewed and left alone, each parser already extracts its own common pattern internally

The audit found that most "repetition" was intentional (thin wrappers with clear purpose) and the one real duplication was worth fixing. Three similar lines is fine. Two identical 40-line components is not.

**Takeaway:** "Scan for workarounds" is a good checkpoint prompt between slices. It catches technical debt before it compounds. But not everything flagged needs fixing — use judgement about whether the duplication is accidental (fix it) or structural (leave it).

## Prompt 14: Bug Debugging

> scenario selector not working

Short bug report. Claude investigated in the browser, found the error ("Cannot read properties of undefined (reading '09 02')"), and traced it to `onClick={onConnect}` passing the MouseEvent as the first argument to `startScan(scenarioOverride?)`. The MouseEvent was truthy, so `target = scenarioOverride ?? scenario` used the event object as a scenario name.

Classic React gotcha: `onClick={fn}` passes the event. `onClick={() => fn()}` doesn't. The fix was one line.

**Takeaway:** Browser automation is valuable for debugging. Seeing the actual error message in the UI (not just reading the code) made the root cause obvious. Also: TypeScript doesn't catch this because the `scenarioOverride` parameter accepts `string`, and MouseEvent is truthy — the bug is in the runtime contract, not the types.

## What we learned (updated)

"Can we get oil temp?" is a product question. Answering it early killed a feature direction before we wasted time on it.

A real scenario beats a structured prompt. Every time.

Asking for principles ("what makes good IA?") gets better results than asking for deliverables ("design the IA"). Claude explains the thinking, you apply it.

And "don't assume" is the single most useful instruction you can give Claude. Without it, Claude fills gaps. With it, Claude flags them. You want the flags.

State your quality bar explicitly. Claude defaults to "simplest for the context." If you want industry standard, say "industry standard." If you want production-grade, say that. The constraint changes the output.

"Document before building" and "research before coding" are one-sentence prompts that save hours. Claude's bias is toward action. Slowing it down at the right moment is the highest-leverage thing you can do.

"How do we know what that looks like?" is the single best question to ask before building anything that talks to an external system. It forces grounded research instead of plausible-sounding invention.

Short prompts work during build when the plan is solid. "lfg" is a valid prompt if the build plan already says what "go" means.

"Look at it" beats "describe it." Browser automation catches visual bugs that code review can't. If your tool can see the output, use that instead of imagining it.

"Scan for workarounds" between slices catches debt early. But not everything flagged is worth fixing — two identical 40-line components is a problem, three similar lines is not.

TypeScript doesn't catch every bug. `onClick={fn}` passing a MouseEvent into a `string?` parameter is a runtime contract violation that types can't see. When something fails at runtime but passes the compiler, check what values are actually flowing through.
