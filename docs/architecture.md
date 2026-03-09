# Architecture

## Layers

```
UI (React components)
  ↓ consumes interpreted data
Knowledge (GT86-specific context, normal ranges, fault code meanings)
  ↓ enriches raw data
Protocol (OBD2 command construction, response parsing)
  ↓ speaks OBD2
Connection (mock / Web Bluetooth / Web Serial)
  ↓ transports bytes
Adapter or emulator
```

Each layer has a defined interface. The layer above never reaches past the one below it. UI never parses bytes. Protocol never knows about React.

## Connection layer
Swappable. Three implementations, same interface:
- **Mock** (default for POC): returns canned responses, supports scenario switching
- **Web Bluetooth**: for real BLE adapters in Chrome
- **Web Serial**: for the ELM327 software emulator

The UI doesn't know which one is active.

## Protocol layer
Handles ELM327 AT commands and OBD2 mode requests. Input: "read stored DTCs". Output: parsed DTC objects. No GT86 knowledge here, just protocol.

## Knowledge layer
Takes parsed OBD2 data, adds GT86 context. This is where P0420 becomes "common after aftermarket headers". Where fuel trim +12% becomes "outside normal range for the FA20".

Structured as data, not code. A fault code lookup table, a set of normal ranges per PID, readiness monitor descriptions. Easy to extend without changing logic.

## Mock data
Scenarios, not random values. Each scenario is a complete car state:
- `clean`: no faults, all monitors complete, normal vitals, clean MOT
- `modified`: P0420, incomplete readiness, otherwise healthy
- `suspect`: recently cleared codes, mileage gap, pending faults
- `rough`: multiple faults, high fuel trims, MOT failures

The mock connection returns scenario data. The UI doesn't know it's mocked.

## DVLA integration
Free MOT history API. Needs registration number (not VIN). For the POC this is mocked. Real integration is a fetch call, no auth needed.
