# Build approach

This is a mentoring project. The process matters as much as the output.

## Iterative slices
Build vertically, not horizontally. One complete feature (connection through to UI) before starting the next. Review each slice before moving on.

Suggested order:
1. Project scaffold + mock connection returning a static scenario
2. Report screen rendering mock data (match the POC wireframe)
3. Scenario switching (swap between clean/modified/suspect/rough)
4. Connect screen + scan flow with progress
5. GT86 knowledge layer (fault code context, normal ranges)
6. DVLA/MOT history (mocked, then real API)

## Composition and reuse
Don't extract components speculatively. Build the first card inline. Build the second. When you see the pattern, extract it. Three similar lines is fine. A premature abstraction is not.

## Decision log
When you pick one approach over another, note why in the commit message. Future sessions need that context. "Used X because Y" is more useful than "Added X".

## Review checkpoints
After each slice, ask:
- Does this match the POC wireframe?
- Does the mock data flow through all four layers?
- Are error states handled?
- Could someone unfamiliar with OBD2 understand the output?
