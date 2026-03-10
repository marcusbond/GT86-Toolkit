# Build Plan — Phase 2

Phase 1 (web POC, slices 0-7) is complete. Mock data, four scenarios, full report UI.

Phase 2: emulator integration, real serial connection, native apps.

## Connection profiles

Same `Connection` interface on every platform. App doesn't know which is active.

| Mode | Transport | Purpose | Platform |
|------|-----------|---------|----------|
| Mock | In-memory | Dev/testing, instant, no dependencies | All |
| Web Serial | Virtual serial port | Emulator testing over real wire format | Web (Chrome) |
| TCP | Network socket | Emulator testing over real wire format | iOS, Android |
| BLE | Bluetooth Low Energy | Real OBD2 adapter | iOS, Android |
| Web Bluetooth | Bluetooth Low Energy | Real OBD2 adapter (future) | Web (Chrome) |

Dev settings screen on native apps to pick mode. Mock is default.

## Open decisions

| Item | Status | Notes |
|------|--------|-------|
| BLE OBD2 adapter model | UNKNOWN | Needed for GATT service/characteristic UUIDs |
| Android or iOS first? | UNKNOWN | Mentee has both Xcode (Mac) and Android Studio (Windows) |
| Reg plate input for DVLA | UNKNOWN | Needed before real DVLA API call — before or after scan? |
| ELM327-emulator config format | PENDING | Will inspect once submodule is added |

---

## Slice 8: ELM327-emulator submodule

Add the emulator to the repo. Inspect its config format. No code changes to the web app yet.

- [ ] `git submodule add https://github.com/Ircama/ELM327-emulator.git emulator`
- [ ] Read emulator source: how scenarios are defined, how ObdMessage dicts work
- [ ] Document findings in `docs/emulator-config.md`
- [ ] Confirm it runs: `python3 -m elm` on macOS
- [ ] Confirm virtual serial port appears (pseudo-terminal)

## Slice 9: GT86 scenario configs

Write Python configs for our four scenarios using the emulator's API.

- [ ] `emulator/gt86_clean.py` — clean car responses (all PIDs, VIN, DTCs, readiness)
- [ ] `emulator/gt86_modified.py` — P0420, MIL on
- [ ] `emulator/gt86_suspect.py` — cleared codes, incomplete monitors, pending P0420, mileage rollback
- [ ] `emulator/gt86_rough.py` — multiple DTCs, overheating, low voltage
- [ ] Map every command from `docs/elm327-response-format.md` into the emulator's format
- [ ] Add fuel trims bank 2 (PIDs 08, 09) — missing from emulator defaults
- [ ] Add Mode 07 pending DTCs
- [ ] Add GT86 VIN (JF1ZNAA12E2345678)
- [ ] Test: run each scenario, send commands manually via `screen` or `minicom`, verify responses match

## Slice 10: Web Serial connection layer

New `WebSerialConnection` implementing the existing `Connection` interface.

- [ ] `web/src/connection/web-serial.ts` — implements `connect()`, `send()`, `disconnect()`, `isConnected()`
- [ ] Chrome Web Serial API: `navigator.serial.requestPort()`, open with baud rate 38400
- [ ] Line-based read: buffer until `>` prompt
- [ ] Handle `SEARCHING...` prefix on first response
- [ ] Error handling: port not found, disconnected mid-scan, timeout
- [ ] Connection picker in UI: mock vs serial (dev toggle or auto-detect)
- [ ] End-to-end test: web app → Web Serial → emulator virtual port → responses parse correctly
- [ ] Verify all four scenarios produce identical Report output as mock connection

## Slice 11: Shared knowledge as JSON

Extract GT86 knowledge data so native apps can use it without reimplementing.

- [ ] `shared/fault-codes.json` — code → description + GT86 context
- [ ] `shared/pid-ranges.json` — normal/warning/critical thresholds per PID
- [ ] `shared/monitors.json` — monitor names, descriptions, incomplete warnings
- [ ] `shared/dvla-mock.json` — mock DVLA data per scenario (for native app development)
- [ ] Web app imports from JSON instead of TS objects (or generates TS from JSON at build time)
- [ ] Unit tests still pass after extraction

---

## Slice 12: iOS app scaffold

Native iOS app. SwiftUI, same flow (Connect → Scan → Report).

**Stack:**
- SwiftUI (iOS 16+ for NavigationStack)
- MVVM architecture
- CoreBluetooth for BLE

**Structure:**
```
native-apps/ios/
├── GT86Toolkit/
│   ├── App/
│   │   └── GT86ToolkitApp.swift
│   ├── Models/              # DTC, PidReading, Report — matches web types
│   ├── Views/
│   │   ├── ConnectView.swift
│   │   ├── ScanView.swift
│   │   └── ReportView.swift
│   ├── ViewModels/
│   │   └── ScanViewModel.swift
│   ├── Services/
│   │   ├── Connection.swift         # Protocol (interface)
│   │   ├── MockConnection.swift     # Same scenarios as web
│   │   ├── TCPConnection.swift      # Emulator via network socket
│   │   ├── BLEConnection.swift      # CoreBluetooth (real adapter)
│   │   └── OBDProtocol.swift        # Command/response parsing
│   ├── Knowledge/
│   │   └── GT86Knowledge.swift      # Loads from shared JSON
│   └── Resources/
│       ├── fault-codes.json         # Symlink or copy from shared/
│       ├── pid-ranges.json
│       └── monitors.json
├── GT86Toolkit.xcodeproj
└── GT86ToolkitTests/
```

- [ ] Xcode project in `native-apps/ios/`
- [ ] NavigationStack with Connect → Scan → Report flow
- [ ] Mock connection returning scenario data (same hex strings as web)
- [ ] Protocol parsing (port from web TS → Swift)
- [ ] Knowledge layer loading shared JSON
- [ ] Report screen matching web app layout
- [ ] Scenario picker (dev only)

## Slice 13: Android app scaffold

Native Android app. Jetpack Compose, same flow.

**Stack:**
- Jetpack Compose
- Material 3 (M3) theming
- Navigation Compose (`androidx.navigation:navigation-compose`)
- Hilt for dependency injection (mock/BLE connection swap)
- MVVM + Kotlin coroutines + StateFlow
- Android BLE API

**Structure:**
```
native-apps/android/
├── app/
│   └── src/main/
│       ├── java/com/gt86toolkit/
│       │   ├── MainActivity.kt
│       │   ├── connection/
│       │   │   ├── Connection.kt        # Interface
│       │   │   ├── MockConnection.kt    # Same scenarios as web
│       │   │   ├── TcpConnection.kt     # Emulator via network socket
│       │   │   └── BLEConnection.kt     # Real adapter
│       │   ├── protocol/
│       │   │   └── OBDParser.kt          # Command/response parsing
│       │   ├── knowledge/
│       │   │   └── GT86Knowledge.kt      # Loads from shared JSON
│       │   ├── ui/
│       │   │   ├── ConnectScreen.kt
│       │   │   ├── ScanScreen.kt
│       │   │   ├── ReportScreen.kt
│       │   │   └── theme/
│       │   └── viewmodel/
│       │       └── ScanViewModel.kt
│       └── res/
│           └── raw/
│               ├── fault_codes.json
│               ├── pid_ranges.json
│               └── monitors.json
├── build.gradle.kts
└── settings.gradle.kts
```

- [ ] Compose project in `native-apps/android/`
- [ ] M3 theme with colour tokens matching web app palette
- [ ] Navigation Compose with Connect → Scan → Report flow
- [ ] Hilt module providing `Connection` interface (mock by default, swappable to TCP/BLE)
- [ ] Mock connection returning scenario data
- [ ] Protocol parsing (port from web TS → Kotlin)
- [ ] Knowledge layer loading shared JSON
- [ ] Report screen matching web app layout
- [ ] Scenario picker (dev only)

## Slice 14: TCP connection (both platforms)

Connect native apps to the emulator over TCP for wire format testing without hardware.

- [ ] iOS: `TCPConnection.swift` — NWConnection to emulator at configurable host:port
- [ ] Android: `TcpConnection.kt` — Kotlin coroutines + Socket to emulator
- [ ] Same `Connection` interface as mock — swap in without UI changes
- [ ] Dev settings screen: pick Mock / TCP / BLE, configure emulator host:port
- [ ] Emulator runs with `-n 35000` for TCP mode
- [ ] End-to-end test: native app → TCP → emulator → responses parse correctly
- [ ] Verify all four scenarios produce identical Report output as mock

## Slice 15: BLE connection (both platforms)

Wire real BLE to an OBD2 adapter. Blocked until adapter model is known.

- [ ] Discover adapter GATT UUIDs (use nRF Connect app to scan)
- [ ] iOS: CoreBluetooth scan → connect → discover services → read/write characteristics
- [ ] Android: BluetoothGatt scan → connect → discover → read/write
- [ ] Same `Connection` interface — swap in without UI changes
- [ ] Test with real adapter on a GT86
- [ ] Note: existing iOS app (`GT86 Toolkit/OBDManager.swift`) uses SwiftOBD2 package for BLE — reference for GATT patterns

---

## Slice 16: Real DVLA API

Replace mocked DVLA data with real MOT history API call.

- [ ] Reg plate input screen (before or after scan — open decision)
- [ ] DVLA MOT history API: `https://beta.check-mot.service.gov.uk/trade/vehicles/mot-tests?registration=XX00XXX`
- [ ] No auth needed, free API
- [ ] Parse response into existing `DvlaData` type
- [ ] Mileage analysis runs on real data
- [ ] Fallback: if API fails, report still shows OBD2 data without DVLA section

---

## Review checkpoint (after each slice)

Same as Phase 1:
- Does mock data flow through all layers?
- Are error states handled?
- Could someone unfamiliar with OBD2 understand the output?
- Tests pass?

Plus for Phase 2:
- Does the native app match the web app's report output?
- Does the emulator produce identical responses to mock data?
- Can you switch between mock and real connection without UI changes?
