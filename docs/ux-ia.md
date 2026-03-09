# UX and Information Architecture

## The situation
You're standing next to a car you might buy. The seller is watching. You want answers fast, not an interface to learn.

## Organising principle
Structure around what the buyer wants to know, not how OBD2 works internally. No "DTCs screen" and "PIDs screen". Those are the protocol's categories, not the user's questions.

## Flow

### 1. Connect
One button. No configuration. Pairs with adapter, confirms it's a GT86 via VIN.

### 2. Scan
Runs everything automatically: DTCs, pending codes, readiness monitors, live data snapshot. Progress indicator. About 30 seconds.

### 3. Report
This is the product. Everything before it is just setup.

Top of the page: a scorecard. Faults, pending, readiness, MOT, mileage. One glance tells you if there's a problem.

Then each category as its own card:

| Card | What it answers |
|---|---|
| Vehicle details | What car is this? Tax, MOT, registration date |
| Mileage history | Has the mileage been consistent? Any gaps or rollbacks? |
| MOT history | Pass/fail record, advisories, failure reasons |
| Fault codes | Is anything wrong right now? |
| Pending codes | Is anything developing? |
| Readiness monitors | Has someone recently cleared codes to hide problems? |
| Engine vitals | Coolant, battery, fuel trims. Is it running normally? |

Each card: title, status badge (pass/warn/fail), then the detail. GT86-specific context on anything that needs explaining.

## What makes this work
- Answer first, detail underneath. Don't make people dig.
- Problems get space. Clean checks stay short.
- No raw values without explaining what they mean for this car.
- Everything scrolls. No tabs, no hidden panels. You're in a car park, not at a desk.
