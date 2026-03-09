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

- [ ] Fault code lookup table — code → description + GT86 context
- [ ] Normal ranges for PIDs on the FA20 (coolant, fuel trims, battery)
- [ ] Readiness monitor descriptions (what each one means for a buyer)
- [ ] `interpret()` function: takes parsed data, returns enriched report
- [ ] Unit tests: known codes get context, values outside range get flagged
- [ ] Commit

## Slice 4: Report screen

Render enriched data. Match the POC wireframe.

- [ ] Scorecard row — summary badges (faults, pending, readiness, MOT, mileage)
- [ ] Vehicle details card
- [ ] Fault codes card (with GT86 context)
- [ ] Pending codes card
- [ ] Readiness monitors card
- [ ] Engine vitals card (coolant, battery, fuel trims with range indicators)
- [ ] Wire up: mock connection → protocol → knowledge → UI
- [ ] Visual check against `poc/index.html`
- [ ] Commit

## Slice 5: Scenario switching

Swap between mock scenarios to prove the UI handles all states.

- [ ] Add remaining scenarios: `modified`, `suspect`, `rough`
- [ ] Scenario picker (dev-only UI, dropdown or similar)
- [ ] Verify each scenario renders correctly — clean, warnings, failures
- [ ] Unit tests for each scenario through the full stack
- [ ] Commit

## Slice 6: Connect + scan flow

The UX before the report.

- [ ] Connect screen — single button, adapter status
- [ ] Scan screen — progress indicator, auto-runs all checks
- [ ] Flow: connect → scan → report
- [ ] Error states: adapter not found, connection lost, unexpected response
- [ ] Commit

## Slice 7: DVLA / MOT history

- [ ] Mocked DVLA response (MOT history, mileage, tax status)
- [ ] Mileage history card (consistency check, gap detection)
- [ ] MOT history card (pass/fail, advisories, failures)
- [ ] Unit tests for mileage anomaly detection
- [ ] Commit

---

## Review checkpoint (after each slice)

- Does it match the POC wireframe (where applicable)?
- Does mock data flow through all layers involved?
- Are error states handled?
- Could someone unfamiliar with OBD2 understand the output?
- Tests pass?
