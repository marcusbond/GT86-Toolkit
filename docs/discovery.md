# Discovery

## Product Vision

Pre-purchase confidence for GT86 buyers. Plug in, get a clear picture of the car's health before you buy it.

GT86-specific context on every result, not raw codes and textbook definitions.

## Product Phases

### Phase 1: Before you buy (POC)
Read-only. Scan, report, context. You don't own this car yet, so you don't touch anything. No clearing codes, no writing to the ECU.

### Phase 2: After you buy (future)
Now it's your car. Clear codes after mods, monitor engine vitals, track changes over time. This is where Weekend Wrench and Tuner/Builder personas come in.

## Personas

### Buyer (Phase 1, lead persona)
Considering buying a GT86. Doesn't know much about them. Wants to check a car before handing over money. Needs clear answers, not technical data.

Wants:
- Are there any fault codes?
- Has someone cleared codes to hide problems?
- What's the MOT and mileage history?
- Is the engine running normally?

### Weekend Wrench (Phase 2)
Bolt-ons (headers, intake, exhaust). Read and clear CELs, confirm car is OK after a mod. Same OBD2 data as the buyer, plus write access to clear codes.

### Tuner/Builder (Phase 2, needs SSM2)
Wants oil temp, knock, AF data, before/after comparison. Needs SSM2 protocol and compatible hardware. Out of scope until the adapter question is resolved.

## POC Capability Check

All standard OBD2. No SSM2. No special adapter. Read-only.

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

What makes this worth using over a generic OBD2 app:
- P0420 → "most common code on modified GT86s, usually aftermarket headers"
- Incomplete readiness monitors → "codes may have been recently cleared, ask the seller why"
- Fuel trims outside range → explain what that means on the FA20 boxer

## Open Questions
- Dev environment: Windows + VS Code confirmed?
- BLE OBD2 adapter available to test with?
