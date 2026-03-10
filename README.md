# GT86 Toolkit

Pre-purchase health check for Toyota GT86 buyers. Plug in an OBD2 adapter, get a clear report on the car's condition.

## What it does

- Reads stored and pending fault codes with GT86-specific context
- Checks readiness monitors (detects recently cleared codes)
- Reads engine vitals: coolant temp, battery voltage, fuel trims (both banks)
- Pulls DVLA/MOT history: mileage consistency, MOT pass/fail, advisories
- Flags mileage rollbacks and anomalies
- Four mock scenarios: clean, modified, suspect, rough

## Stack

| Tool | Purpose |
|------|---------|
| React | UI |
| TypeScript | Language (strict mode) |
| Vite | Build / dev server |
| Tailwind CSS v4 | Styling |
| Vitest | Testing |

## Architecture

Four layers, each independent:

```
UI (React components)
  ↓
Knowledge (GT86 context, normal ranges, fault code meanings)
  ↓
Protocol (OBD2 command construction, response parsing)
  ↓
Connection (mock / Web Bluetooth / Web Serial)
```

DVLA data is a separate module — different source, different pipeline.

## Project structure

```
GT86-Toolkit/
├── docs/           # Discovery, architecture, build plan, ELM327 reference
├── poc/            # HTML wireframe (visual spec)
├── web/            # React app
│   └── src/
│       ├── connection/   # Mock adapter, scenario data
│       ├── protocol/     # OBD2 response parsing
│       ├── knowledge/    # GT86 fault codes, ranges, monitors
│       ├── dvla/         # MOT history, mileage analysis
│       └── components/   # React UI
```

## Run

```
cd web
npm install
npm run dev
```

## Test

```
cd web
npm test
```

110 tests across protocol parsing, knowledge enrichment, mileage analysis, and UI integration.

## Status

All build plan slices complete (0-7). Mock data only — no real adapter or DVLA API yet.

## Docs

- `docs/architecture.md` — layer design, mock scenarios
- `docs/build-plan.md` — slice-by-slice checklist
- `docs/elm327-response-format.md` — wire formats, decoding, scenario data
- `docs/discovery.md` — product vision, personas
- `docs/ux-ia.md` — UX principles, report structure
- `docs/testing-approach.md` — mock data and emulator strategy
- `docs/prompts.md` — prompt journal and lessons learned
