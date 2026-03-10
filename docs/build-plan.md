# Build Plan

Work through in order. Each slice: code, tests, review, then next.

## Slice 0: Scaffold

Set up the project shell. Nothing functional, just a working build.

- [x] `npm create vite@latest` with React + TypeScript template in `web/`
- [x] Install Tailwind CSS v4
- [x] Install and configure Vitest
- [x] ESLint + Prettier config (2-space indent, consistent rules)
- [x] `@/` path alias in `tsconfig.json` and `vite.config.ts`
- [x] Create empty layer directories: `connection/`, `protocol/`, `knowledge/`, `components/`
- [x] Placeholder `index.ts` in each layer (named export, nothing else)
- [x] Confirm: `npm run dev` starts, `npm run build` succeeds, `npm run test` passes
- [x] Commit: `41d41f2`

## Slice 1: Mock connection

The connection layer with a mock implementation returning a static scenario.

- [x] Define `Connection` interface — `connect()`, `send()`, `disconnect()`, `isConnected()`
- [x] Scenario data for all four scenarios with exact ELM327 hex values
- [x] Build `MockConnection` implementing the interface, returning scenario data
- [x] Unit tests: lifecycle, AT commands, all four scenarios, error cases (22 tests)
- [x] Commit: `d40d520`

## Slice 2: Protocol layer

Parse raw OBD2 responses into typed objects. Pure input/output.

- [x] Define protocol types — `DTC`, `ReadinessMonitors`, `Monitor`, `PidReading`, result types
- [x] Parse Mode 03 response → stored DTCs
- [x] Parse Mode 07 response → pending DTCs
- [x] Parse Mode 01 PID 01 → readiness monitors
- [x] Parse Mode 01 PIDs (coolant, battery, fuel trims both banks) → typed readings
- [x] Parse Mode 09 → VIN
- [x] Unit tests for each parser, including malformed input (42 tests)
- [x] Commit: `d7736f7`

## Slice 3: Knowledge layer

GT86-specific context on top of parsed data.

- [x] Fault code lookup table — code → description + GT86 context
- [x] Normal ranges for PIDs on the FA20 (coolant, fuel trims, battery)
- [x] Readiness monitor descriptions (what each one means for a buyer)
- [x] `interpret()` function: takes parsed data, returns enriched report
- [x] Unit tests: known codes get context, values outside range get flagged (34 tests)
- [x] Commit: `830d5e0`

## Slice 4: Report screen

Render enriched data. Match the POC wireframe.

- [x] Scorecard row — summary badges (faults, pending, readiness)
- [x] Fault codes card (with GT86 context)
- [x] Pending codes card
- [x] Readiness monitors card
- [x] Engine vitals card (coolant, battery, fuel trims with range indicators)
- [x] Wire up: mock connection → protocol → knowledge → UI
- [x] Visual check against `poc/index.html`
- [x] Commit: `a8b64a2`

## Slice 5: Scenario switching + POC styling

Swap between mock scenarios to prove the UI handles all states. Match POC visual design.

- [x] Scenario picker (dev-only dropdown)
- [x] All four scenarios render correctly — clean, modified, suspect, rough
- [x] Plus Jakarta Sans font, theme tokens matching POC palette
- [x] Components styled with theme colors (cool blue-greys, status colors)
- [x] Commit: `c19bb45`

## Slice 6: Connect + scan flow

The UX before the report. Three-screen state machine matching the POC wireframe.

- [x] ConnectScreen — brand, title, setup steps, "Connect and scan" button
- [x] ScanScreen — progress bar with step text, updates via callback
- [x] runScan progress reporting (5 steps as it moves through OBD2 queries)
- [x] MockConnection configurable delay (400ms dev, 0ms test)
- [x] App state machine: connect → scanning → report, with error screen
- [x] Scenario switcher re-scans from report screen
- [x] Error screen with "Try again"
- [x] Fixed onClick event leaking MouseEvent as scenario arg
- [x] Extracted DtcCard — shared component for FaultCodesCard and PendingCodesCard
- [x] 101 tests green
- [x] Commit: `4b34038`

## Slice 7: DVLA / MOT history

- [x] New `dvla/` module: types, mock data per scenario, mileage analysis
- [x] Vehicle Details card (registration, colour, engine, tax status, MOT expiry)
- [x] Mileage History card (bar chart, anomaly highlighting, rollback detection)
- [x] MOT History card (pass/fail, advisories, failures in red)
- [x] Scorecard extended with MOT expiry and mileage consistency cells
- [x] Unit tests for mileage anomaly detection (rollback, excessive, edge cases)
- [x] All four scenarios verified visually against POC wireframe
- [x] 110 tests green
- [x] Commit: `d5c05f0`

---

## Review checkpoint (after each slice)

- Does it match the POC wireframe (where applicable)?
- Does mock data flow through all layers involved?
- Are error states handled?
- Could someone unfamiliar with OBD2 understand the output?
- Tests pass?
