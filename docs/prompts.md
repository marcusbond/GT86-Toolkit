# Prompt Journal

How we approached this project, what we prompted, and why each prompt matters.

---

## Approach

1. Rough product vision — what is this, who's it for
2. Capabilities landscape — what can we actually get from this car
3. Cross-reference — user wants vs deliverable capability
4. Sharpen the use case — find the specific job to be done
5. UX and IA — shaped by the use case, not the tech
6. Build

---

## Prompt 1: Product Vision

> We're rethinking a GT86 diagnostic tool from the ground up. Before any code or tech decisions — what should this product actually be? Who is it for, and what problem does it solve? Don't assume answers. Flag what's unknown.

**Why:** Stops Claude jumping to implementation. "Don't assume" is critical — without it, Claude fills blanks with plausible guesses and you end up building the wrong thing confidently.

**What we got:** Three possible directions (diagnostic tool, track tool, companion app). Too broad — but that's the point. You need to see the options before you pick.

---

## Prompt 2: Capabilities Research

> What OBD2 diagnostic data is available on a Toyota GT86 (FA20 engine)? What's available via standard OBD2 vs Subaru's proprietary SSM2 protocol?

**Why:** Scoping, not tech selection. The answer determines what you can promise users. We learned oil temp and knock data need SSM2 and specific hardware. That's a product constraint, not a tech detail.

**What we got:** A clear split — standard OBD2 (CELs, coolant, fuel trims) works with any adapter. The interesting stuff (oil temp, knock) needs expensive hardware. This killed features we might have designed around.

---

## Prompt 3: Personas

> Define 2-3 personas for GT86 owners. Keep them short. Focus on what they need, not demographics.

**Why:** "Keep them short" stops Claude writing marketing fiction. Personas are scoping tools — if they're longer than a few lines, they're not useful.

**What we got:** Weekend Wrench, Tuner/Builder, New Owner. The cross-reference against capabilities showed Tuner/Builder couldn't be served without SSM2. That narrowed the POC.

---

## Prompt 4: Sharpen the Use Case

> I'm thinking of buying a GT86, I don't know much about them, I want an app that lets me do some checks on a car pre-purchase.

**Why this changed everything:** This wasn't a carefully crafted prompt — it was a real scenario. And it was more useful than the structured prompts above because it was specific. "Pre-purchase check" is a concrete job to be done. "Diagnostic tool for GT86 owners" isn't.

**Lesson:** A real user scenario beats a structured prompt. When you can say "I want to do X in situation Y", the product snaps into focus. Everything before this was useful groundwork, but this is the moment the product got clear.

**What we got:** A complete POC scope. Everything the buyer needs (DTCs, pending codes, readiness monitors, engine vitals) is standard OBD2. No SSM2 needed. No special adapter.

---

## Prompt 5: UX and IA

> Based on our personas and use case, what makes good UX here? What's the IA and what makes good IA?

**Why:** Asking "what makes good IA" not "design the screens" gets you principles before layout. The answer was: organise by user intent (what's wrong? has someone hidden problems?) not by technical structure (DTCs screen, PIDs screen).

**What we got:** Three-step flow (Connect → Scan → Report). The report is the product. Progressive disclosure — verdict first, GT86-specific context on every finding, detail on tap.

---

## Prompts We Didn't Use (But Could Have)

> What existing tools do GT86 owners use today and what's frustrating about them?

Would have been useful for competitive context. We skipped it — the use case was clear enough without it.

> What are the most common fault codes on the GT86 and what do they mean?

Will need this when we build the GT86-specific context layer. Not needed for IA/UX scoping.

---

## Key Lessons

1. **Know what's feasible early.** "Can we get oil temp?" is a product question. The answer killed a feature direction before we wasted time designing it.

2. **A real scenario beats a structured prompt.** "Pre-purchase check" did more for product clarity than three rounds of persona work.

3. **Ask for principles, not deliverables.** "What makes good IA?" gets better results from Claude than "design the IA." Claude explains the thinking, then you apply it together.

4. **"Don't assume" is the most important instruction.** Without it, Claude fills gaps. With it, Claude flags them. You want the flags.
