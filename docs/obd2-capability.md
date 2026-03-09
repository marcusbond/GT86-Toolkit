# GT86 OBD2 Capability

## Protocol
CAN bus (ISO 15765-4) at 500kbps. Primary ECU at 0x7E0.

## Standard OBD2 (works on any adapter)
- Engine RPM, vehicle speed, throttle position
- Coolant temp (caps at 215F via standard PID)
- Intake air temp, MAP
- Fuel trims — both banks (boxer engine, Bank 1 = cyl 1&3, Bank 2 = cyl 2&4)
- O2 sensors, catalyst temp
- Battery voltage
- CEL read/clear (Mode 03/04)

## SSM2 Extended (Subaru proprietary, needs raw CAN support)
- Oil temperature — not available via standard OBD2
- Knock feedback / knock correction
- AF correction / AF learning
- AVCS cam position (intake; exhaust on 2017+)
- Injector duty cycle / pulse width
- DI fuel pressure (high-side)
- MAF sensor (sometimes missing from standard PIDs)

## Known Quirks
- Oil temp only via SSM2 — the single biggest gap in standard OBD2
- Cheap BLE adapters often can't do SSM2 raw CAN frames
- 2017+ models have additional AVCS parameters (dual AVCS)
- Standard coolant temp PID has limited resolution at high temps
- MAF PID (0x10) sometimes reports "not supported" via standard OBD2

## Community Priority (what GT86 owners actually want)
1. Oil temperature
2. Knock feedback
3. AF learning/correction
4. Coolant temp (high resolution)
5. CEL read/clear (headers/exhaust mods throw codes constantly)
