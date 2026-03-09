# Testing Approach

## No physical hardware
No adapter or simulator purchase.

## Options

### 1. Mocked data in-app
Simulate OBD2 responses directly in code. Control scenarios exactly.

### 2. ELM327-emulator
https://github.com/Ircama/ELM327-emulator

Python-based. Emulates an ELM327 adapter without hardware.

**What it supports:**
- OBD2 Modes 01-04, 06-07, 09 (live data, freeze frame, DTCs, clear DTCs, vehicle info)
- Fully configurable responses — add any PID via dictionary entries
- Can import PID definitions from Torque CSV format
- Dynamic/computed responses via inline Python
- Built-in scenarios (default, Toyota Auris Hybrid, engine off)
- Custom DTCs possible by editing response dictionary

**Connection methods:**
- Virtual serial port (macOS/Linux)
- TCP socket (all platforms)
- Serial COM port (Windows)
- No BLE. No Web Bluetooth.

**How a web app connects:**
- **Web Serial API** (Chrome 89+) — browser talks to the virtual serial port directly. Most viable path.
- TCP socket would need a WebSocket bridge/proxy.

**What it can't do:**
- No SSM2/Subaru proprietary protocol out of the box (but extensible — could add custom responses)
- No BLE GATT emulation

## Recommendation
Start with mocked data for the product/UX work. ELM327-emulator is useful later for testing real ELM327 command parsing via Web Serial.
