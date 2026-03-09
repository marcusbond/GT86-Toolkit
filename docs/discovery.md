# Discovery

## Product Vision

Pre-purchase confidence for GT86 buyers. Plug in, get a clear picture of the car's health before you buy it.

GT86-specific context on every result — not raw codes and textbook definitions.

## Lead Persona: Buyer

Considering buying a GT86. Doesn't know much about them. Wants to check a car before handing over money. Needs clear answers, not technical data.

**Wants:**
- Are there any fault codes? (stored and pending)
- Has someone cleared codes to hide problems?
- Is the engine running normally?
- Any red flags?

## Supporting Personas

### Weekend Wrench
Bolt-ons (headers, intake, exhaust). Read/clear CELs, confirm car is OK after mod. Served by the same feature set.

### Tuner/Builder
Wants oil temp, knock, AF data. Needs SSM2. Out of scope for POC.

## POC Capability Check

All standard OBD2. No SSM2. No special adapter.

| Check | OBD2 Mode | What it tells you |
|---|---|---|
| Stored DTCs | Mode 03 | Current faults |
| Pending DTCs | Mode 07 | Faults developing but not yet triggered CEL |
| Readiness monitors | Mode 01 PID 01 | Have all tests completed? If not, codes were probably recently cleared |
| VIN | Mode 09 | Confirm identity |
| Coolant temp | Mode 01 PID 05 | Reaching normal operating temp? |
| Battery voltage | Mode 01 PID 42 | Charging system healthy? |
| Fuel trims (both banks) | Mode 01 PIDs 06-09 | Running rich/lean = potential issues |

## GT86-Specific Value

The differentiator. Contextualise results for this car:
- P0420 → "most common code on modified GT86s — usually aftermarket headers"
- Incomplete readiness monitors → "codes may have been recently cleared — ask the seller why"
- Fuel trims outside range → explain what that means on the FA20 boxer

## Open Questions
- Dev environment: Windows + VS Code confirmed?
- BLE OBD2 adapter available to test with?
