# UX & Information Architecture

## Context
User is standing next to a car they might buy. Seller is watching. Needs answers fast, not an interface to learn.

## Principle
Organised by user intent, not technical structure. No "DTCs screen" and "PIDs screen" — that's OBD2's structure, not the buyer's.

## Flow

### 1. Connect
- One button. No configuration.
- Pairs with adapter, confirms it's a GT86 (VIN decode).

### 2. Scan
- Automatic. Runs all checks — DTCs, pending codes, readiness, live snapshot.
- Progress indicator. ~30 seconds.

### 3. Report
This is the product. Everything before it is setup.

**Top level:** verdict. Green/amber/red. "2 issues found" or "Looking healthy."

**Sections, in order:**

| Section | Question it answers |
|---|---|
| Fault codes | Is anything wrong right now? |
| Pending codes | Is anything about to go wrong? |
| Readiness monitors | Has someone hidden problems? |
| Engine vitals | Is it running normally? |

**Each section:**
- Status icon → one-line summary → expandable detail
- GT86-specific context on every finding
- No issues = one line, collapsed. Issues = expanded with explanation.

## Examples

**No problems:**
> ✓ No fault codes found
> ✓ No pending codes
> ✓ All readiness monitors complete
> ✓ Engine vitals normal

**Problems found:**
> ✗ 1 fault code — P0420: Catalyst efficiency below threshold
> "Most common code on modified GT86s. Usually caused by aftermarket headers. Ask the seller if headers have been fitted."
>
> ⚠ Readiness monitors incomplete (2 of 8)
> "Some emissions tests haven't completed. This can mean codes were recently cleared. Ask the seller why."

## What makes this good IA
- Answer first, detail second (progressive disclosure)
- Every section answers one question
- No raw values without context
- Nothing is surfaced equally — problems get space, clean checks collapse
