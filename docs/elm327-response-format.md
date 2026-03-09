# ELM327 Response Format Reference

Wire-level response formats for building mock data. Based on the ELM327 protocol spec and the [ELM327-emulator](https://github.com/Ircama/ELM327-emulator) reference implementation.

## Wire Protocol Basics

### Line endings and prompt
- Default line ending: `\r` (carriage return)
- With linefeeds on (`ATL1`): `\r\n`
- Response terminator: `\r\r>` (blank line then prompt)
- The `>` prompt signals "ready for next command"

### Spaces
- Default: spaces between hex byte pairs (`41 05 7B`)
- `ATS0` removes spaces (`41057B`)

### Echo
- Default: echo ON. The command you sent is echoed back before the response
- `ATE0` turns echo off (what we want for programmatic use)

### Headers
- Default: headers OFF. Response is just the data bytes
- `ATH1` shows CAN headers (source address + frame length)

### Response with echo ON (default):
```
01 05\r
41 05 7B\r
\r
>
```

### Response with echo OFF (ATE0, what our app uses):
```
41 05 7B\r
\r
>
```

### Response with headers ON (ATH1):
```
7E8 03 41 05 7B\r
\r
>
```

Where `7E8` = engine ECU response address, `03` = byte count of data that follows.

## CAN Addressing

| ECU | Request Address | Response Address |
|-----|----------------|-----------------|
| Engine (primary) | 7E0 | 7E8 |
| Transmission | 7E1 | 7E9 |
| Hybrid (if applicable) | 7E2 | 7EA |
| Broadcast/functional | 7DF | varies |

The GT86 uses `7E0`/`7E8` for the engine ECU. Broadcast `7DF` queries all ECUs.

## Response Mode Byte Convention

The response mode byte = request mode + 0x40:
- Send mode `01` -> response starts with `41`
- Send mode `03` -> response starts with `43`
- Send mode `07` -> response starts with `47`
- Send mode `09` -> response starts with `49`

---

## AT Commands (Initialisation Sequence)

### ATZ - Reset
```
Send:    ATZ
Response: \r\rELM327 v1.5\r\r>
```
Returns the device identifier string. There's a ~0.5s delay.

### ATE0 - Echo Off
```
Send:    ATE0
Response: OK\r\r>
```

### ATL0 - Linefeeds Off
```
Send:    ATL0
Response: OK\r\r>
```

### ATS1 - Spaces On (default, but explicit)
```
Send:    ATS1
Response: OK\r\r>
```

### ATH0 - Headers Off (default, but explicit)
```
Send:    ATH0
Response: OK\r\r>
```

### ATSP6 - Set Protocol to CAN 500kbps 11-bit
```
Send:    ATSP6
Response: OK\r\r>
```
Protocol 6 = ISO 15765-4 CAN (11-bit ID, 500kbps). This is what the GT86 uses.

Protocol numbers:
- 0 = Auto
- 6 = ISO 15765-4 CAN (11-bit, 500k) -- GT86
- 7 = ISO 15765-4 CAN (29-bit, 500k)
- 8 = ISO 15765-4 CAN (11-bit, 250k)
- 9 = ISO 15765-4 CAN (29-bit, 250k)

### Typical init sequence for our app:
```
ATZ       -> ELM327 v1.5
ATE0      -> OK
ATL0      -> OK
ATH0      -> OK
ATSP6     -> OK
```

---

## Mode 01: Live Data (Single-Value PIDs)

All Mode 01 responses follow: `41 [PID] [data bytes]`

### PID 00 - Supported PIDs (01-20)
```
Send:    01 00
Response: 41 00 BE 3F A8 13
```
4-byte bitmask. Each bit = one PID supported (1) or not (0). Bit 7 of byte A = PID 01, bit 6 = PID 02, etc.

The emulator's first response to `01 00` includes a `SEARCHING...` prefix and 3-second delay (simulating protocol detection):
```
SEARCHING...\r
\r
41 00 BE 3F A8 13\r
\r
>
```

### PID 01 - Monitor Status / Readiness
```
Send:    01 01
Response: 41 01 00 07 A1 00
```

4 data bytes (A, B, C, D):

**Byte A** - DTC count and MIL status:
- Bit 7: MIL (Check Engine Light) on = 1, off = 0
- Bits 6-0: Number of confirmed DTCs (0-127)

**Byte B** - Available and incomplete tests:
- Bit 0: Misfire monitoring supported
- Bit 1: Fuel system monitoring supported
- Bit 2: Comprehensive component monitoring supported
- Bit 3: Compression ignition monitoring (0 = spark ignition)
- Bit 4: Misfire monitoring incomplete
- Bit 5: Fuel system monitoring incomplete
- Bit 6: Comprehensive component monitoring incomplete
- Bit 7: Reserved

**Bytes C & D** - Test availability and completeness (spark ignition):

Byte C (supported):
- Bit 0: Catalyst
- Bit 1: Heated catalyst
- Bit 2: Evaporative system
- Bit 3: Secondary air system
- Bit 4: A/C refrigerant
- Bit 5: Oxygen sensor
- Bit 6: Oxygen sensor heater
- Bit 7: EGR/VVT system

Byte D (incomplete, same bit positions as C):
- 1 = test incomplete, 0 = test complete

Example: `00 07 A1 00`
- `00`: MIL off, 0 DTCs
- `07`: Misfire + fuel + comprehensive supported, spark ignition
- `A1`: Catalyst, oxygen sensor, EGR supported (bits 0,5,7 = 0xA1)
- `00`: All supported tests complete

**Cleared codes scenario** (monitors incomplete):
```
41 01 00 07 E1 E1
```
- `E1` in byte D: catalyst, oxygen sensor, EGR incomplete (recently cleared)

### PID 05 - Coolant Temperature
```
Send:    01 05
Response: 41 05 7B
```

1 data byte. Formula: **temp_C = A - 40**

| Hex | Decimal | Temp C | Temp F |
|-----|---------|--------|--------|
| 00  | 0       | -40    | -40    |
| 28  | 40      | 0      | 32     |
| 73  | 115     | 75     | 167    |
| 7B  | 123     | 83     | 181    |
| 9A  | 154     | 114    | 237    |

Normal GT86 operating temp: ~80-95C. `7B` = 83C (normal warm engine).

### PID 06 - Short Term Fuel Trim, Bank 1
```
Send:    01 06
Response: 41 06 80
```

1 data byte. Formula: **trim_% = (A - 128) * 100 / 128**

| Hex | Decimal | Trim % | Meaning |
|-----|---------|--------|---------|
| 00  | 0       | -100%  | Max rich correction |
| 64  | 100     | -21.9% | Running rich |
| 78  | 120     | -6.3%  | Slightly rich |
| 80  | 128     | 0%     | Neutral |
| 88  | 136     | +6.3%  | Slightly lean |
| 9C  | 156     | +21.9% | Running lean |
| FF  | 255     | +99.2% | Max lean correction |

Normal range on FA20: roughly -10% to +10%.

### PID 07 - Long Term Fuel Trim, Bank 1
```
Send:    01 07
Response: 41 07 79
```
Same formula as PID 06. `79` (121) = -5.5%. Long term trims reflect learned adaptation.

### PID 08 - Short Term Fuel Trim, Bank 2
```
Send:    01 08
Response: 41 08 80
```
Same formula. Bank 2 on the FA20 boxer = cylinders 2 & 4.

### PID 09 - Long Term Fuel Trim, Bank 2
```
Send:    01 09
Response: 41 09 7E
```
Same formula. `7E` (126) = -1.6%.

### PID 42 - Control Module Voltage
```
Send:    01 42
Response: 41 42 39 D6
```

2 data bytes. Formula: **voltage = ((A * 256) + B) / 1000**

| Hex   | A    | B    | Voltage |
|-------|------|------|---------|
| 2E E0 | 0x2E | 0xE0 | 12.0V  |
| 31 54 | 0x31 | 0x54 | 12.628V |
| 39 D6 | 0x39 | 0xD6 | 14.806V |
| 38 A4 | 0x38 | 0xA4 | 14.500V |

Engine off: ~12.0-12.6V. Engine running: ~13.5-14.8V. `39 D6` = 14.8V (charging).

---

## Mode 03: Stored DTCs

```
Send:    03
```

Response format: `43 [count byte] [DTC1 byte1] [DTC1 byte2] [DTC2 byte1] [DTC2 byte2] ...`

### No DTCs:
```
43 00\r
\r
>
```

### One DTC (e.g. P0420):
```
43 01 04 20\r
\r
>
```

### Two DTCs (e.g. P0420 + P0171):
```
43 02 04 20 01 71\r
\r
>
```

### DTC Byte Encoding

Each DTC is 2 bytes. The first 2 bits of byte 1 encode the category:

| Bits 7-6 | Prefix | Category |
|----------|--------|----------|
| 00       | P0     | Powertrain (generic) |
| 01       | P1     | Powertrain (manufacturer) |
| 10       | C      | Chassis |
| 11       | B      | Body |

Remaining bits form a 4-digit hex code:
```
Byte 1: [CC][D1][D2D2D2D2]  (CC=category, D1=first digit bits 5-4, D2=second digit bits 3-0)
Byte 2: [D3D3D3D3][D4D4D4D4] (D3=third digit, D4=fourth digit)
```

Decoding examples:
```
04 20 -> 0000 0100  0010 0000
         CC=00 -> P
         D1=01 -> 0
         D2=0100 -> 4
         D3=0010 -> 2
         D4=0000 -> 0
         Result: P0420

01 71 -> 0000 0001  0111 0001
         CC=00 -> P
         D1=00 -> 0
         D2=0001 -> 1
         D3=0111 -> 7
         D4=0001 -> 1
         Result: P0171

C0 01 -> 1100 0000  0000 0001
         CC=11 -> B
         D1=00 -> 0
         D2=0000 -> 0
         D3=0000 -> 0
         D4=0001 -> 1
         Result: B0001
```

### Multi-frame DTC responses (more than 3 DTCs)

Each CAN frame holds up to 3 DTCs (6 data bytes). If there are more than 3, the response uses ISO-TP multi-frame:

**With headers OFF** (our default, simplified view):
```
43 03 04 20 01 71 01 74\r
\r
>
```
Up to 3 DTCs fit in a single frame. For more DTCs, additional lines appear.

**With headers ON** (shows the CAN framing):
```
7E8 10 0A 43 04 04 20 01 71\r
7E8 21 01 74 01 33 00 00 00\r
\r
>
```
`10 0A` = first frame, 10 total bytes. `21` = consecutive frame #1.

---

## Mode 07: Pending DTCs

Same format as Mode 03 but response starts with `47` instead of `43`.

### No pending DTCs:
```
47 00\r
\r
>
```

### One pending DTC (e.g. P0442):
```
47 01 04 42\r
\r
>
```

---

## Mode 09 PID 02: VIN

VIN is 17 ASCII characters and requires a multi-frame response (too long for one CAN frame).

```
Send:    09 02
```

### Without headers (simplified, how ELM327-emulator does it):

The emulator returns two positive-answer lines:
```
49 02 01 57 50 30 5A 5A 5A 39 39 5A 54 53 33 39 30 30 30 30\r
49 02 01 4D 41 54 34 30 33 30 39 36 42 4E 4C 30 30 30 30 30\r
\r
>
```

The `01` after `49 02` is the message count/index. The remaining bytes are ASCII.

### With headers (shows ISO-TP multi-frame on CAN):
```
7E8 10 14 49 02 01 57 50 30\r
7E8 21 5A 5A 5A 39 39 5A 54\r
7E8 22 53 33 39 30 30 30 30\r
\r
>
```

- `10 14`: First frame, total 20 (0x14) data bytes
- `21`: Consecutive frame 1
- `22`: Consecutive frame 2

### Decoding the VIN bytes

Each byte after the mode/PID/count prefix is an ASCII character:

```
57 50 30 5A 5A 5A 39 39 5A 54 53 33 39 30 30 30 30
W  P  0  Z  Z  Z  9  9  Z  T  S  3  9  0  0  0  0
```

GT86 VIN pattern: `JF1ZN6...` (starts with JF1 for Subaru-manufactured Toyota).

Example GT86 VIN bytes:
```
4A 46 31 5A 4E 36 ...
J  F  1  Z  N  6  ...
```

---

## Error Responses

### NO DATA
Returned when the ECU doesn't respond to a PID request (PID not supported or timeout):
```
NO DATA\r
\r
>
```

### UNABLE TO CONNECT
Returned when no ECU responds at all (no car, wrong protocol, adapter issue):
```
UNABLE TO CONNECT\r
\r
>
```

### ? (Unknown Command)
Returned for unrecognised AT commands or malformed input:
```
?\r
\r
>
```

### BUS INIT: ...ERROR
Protocol initialisation failed:
```
BUS INIT: ...ERROR\r
\r
>
```

### SEARCHING...
Not an error. Appears on the first OBD command while the ELM327 auto-detects the protocol:
```
SEARCHING...\r
41 00 BE 3F A8 13\r
\r
>
```

### CAN ERROR
CAN bus communication error:
```
CAN ERROR\r
\r
>
```

### BUFFER FULL
Response too large for internal buffer:
```
BUFFER FULL\r
\r
>
```

### STOPPED
User interrupted a command (sent any character during processing):
```
STOPPED\r
\r
>
```

---

## Mock Scenarios for GT86 Pre-Purchase

Based on the architecture's four scenarios, here are the exact response strings:

### Scenario: clean
A healthy, unmodified GT86 with all monitors complete.

| Command | Response |
|---------|----------|
| `01 01` | `41 01 00 07 E1 00` (MIL off, 0 DTCs, all monitors complete) |
| `03`    | `43 00` (no stored DTCs) |
| `07`    | `47 00` (no pending DTCs) |
| `01 05` | `41 05 7B` (coolant 83C - normal) |
| `01 06` | `41 06 82` (STFT B1: +1.6%) |
| `01 07` | `41 07 7D` (LTFT B1: -2.3%) |
| `01 08` | `41 08 81` (STFT B2: +0.8%) |
| `01 09` | `41 09 7F` (LTFT B2: -0.8%) |
| `01 42` | `41 42 38 A4` (14.5V - charging) |
| `09 02` | `49 02 01 4A 46 31 5A 4E 36 ...` (VIN: JF1ZN6...) |

### Scenario: modified
GT86 with aftermarket headers. P0420 but otherwise healthy.

| Command | Response |
|---------|----------|
| `01 01` | `41 01 81 07 E1 00` (MIL on, 1 DTC, all monitors complete) |
| `03`    | `43 01 04 20` (P0420: catalyst efficiency below threshold) |
| `07`    | `47 00` (no pending) |
| `01 05` | `41 05 7B` (coolant 83C - normal) |
| `01 06` | `41 06 83` (STFT B1: +2.3%) |
| `01 07` | `41 07 7C` (LTFT B1: -3.1%) |
| `01 08` | `41 08 84` (STFT B2: +3.1%) |
| `01 09` | `41 09 7B` (LTFT B2: -3.9%) |
| `01 42` | `41 42 38 A4` (14.5V) |

### Scenario: suspect
Recently cleared codes, incomplete monitors, mileage anomaly.

| Command | Response |
|---------|----------|
| `01 01` | `41 01 00 07 E1 E1` (MIL off, 0 DTCs, monitors INCOMPLETE) |
| `03`    | `43 00` (no stored - cleared!) |
| `07`    | `47 01 04 20` (P0420 pending - coming back) |
| `01 05` | `41 05 7B` (coolant 83C) |
| `01 06` | `41 06 8C` (STFT B1: +9.4% - running lean) |
| `01 07` | `41 07 8E` (LTFT B1: +10.9% - high) |
| `01 08` | `41 08 8A` (STFT B2: +7.8%) |
| `01 09` | `41 09 8B` (LTFT B2: +8.6%) |
| `01 42` | `41 42 38 A4` (14.5V) |

### Scenario: rough
Multiple faults, high fuel trims, failing car.

| Command | Response |
|---------|----------|
| `01 01` | `41 01 83 07 E1 00` (MIL on, 3 DTCs, monitors complete) |
| `03`    | `43 03 04 20 01 71 03 01` (P0420 + P0171 + P0301) |
| `07`    | `47 01 03 02` (P0302 pending) |
| `01 05` | `41 05 9A` (coolant 114C - overheating!) |
| `01 06` | `41 06 96` (STFT B1: +17.2% - very lean) |
| `01 07` | `41 07 94` (LTFT B1: +15.6%) |
| `01 08` | `41 08 6E` (STFT B2: -14.1% - rich) |
| `01 09` | `41 09 6C` (LTFT B2: -15.6%) |
| `01 42` | `41 42 2E E0` (12.0V - not charging properly) |

---

## Common GT86 DTCs

| Bytes | Code | Description |
|-------|------|-------------|
| `04 20` | P0420 | Catalyst efficiency below threshold (Bank 1) |
| `01 71` | P0171 | System too lean (Bank 1) |
| `01 72` | P0172 | System too rich (Bank 1) |
| `01 74` | P0174 | System too lean (Bank 2) |
| `03 01` | P0301 | Cylinder 1 misfire detected |
| `03 02` | P0302 | Cylinder 2 misfire detected |
| `03 03` | P0303 | Cylinder 3 misfire detected |
| `03 04` | P0304 | Cylinder 4 misfire detected |
| `04 42` | P0442 | Evaporative emission system leak (small) |
| `04 56` | P0456 | Evaporative emission system leak (very small) |
| `01 28` | P0128 | Coolant thermostat below regulating temp |

---

## Supported PIDs Bitmask (PID 00, 20, 40)

### PID 00 response - PIDs 01-20 supported
```
41 00 BE 3F A8 13
```

Decoding `BE 3F A8 13`:
```
BE = 1011 1110 -> PIDs 01,03,04,05,06,07 supported
3F = 0011 1111 -> PIDs 0B,0C,0D,0E,0F,10 supported
A8 = 1010 1000 -> PIDs 11,13,15 supported
13 = 0001 0011 -> PIDs 1C,1F,20 supported
```

### PID 20 response - PIDs 21-40 supported
```
41 20 80 01 A0 01
```

### PID 40 response - PIDs 41-60 supported
```
41 40 7A 1C 80 00
```

For mock purposes, the supported PID bitmask just needs to include the PIDs we actually query (01, 05, 06, 07, 08, 09, 42).

---

## ELM327-Emulator Implementation Notes

The emulator uses XML-like tags internally that get rendered to wire format:
- `PA('7B')` -> `41 [PID] 7B` (positive answer, auto-prepends mode+0x40 and PID)
- `HD('7E8') + SZ('03') + DT('41 05 7B')` -> raw header+size+data (used when headers ON)
- `ST('OK')` -> `OK` (string/text response)
- `ST('NO DATA')` -> `NO DATA`

The `ELM_FOOTER` regex `r'[0123456]?$'` matches optional trailing digits (frame number for multi-frame requests).

Multi-value responses use Python lists: `[PA('80'), PA('78'), PA('88')]` -- the emulator cycles through them on successive queries to simulate changing values.
