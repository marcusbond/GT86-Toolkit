export interface FaultCodeInfo {
  description: string
  gt86Context: string | null
}

const FAULT_CODES: Record<string, FaultCodeInfo> = {
  P0420: {
    description: 'Catalyst system efficiency below threshold (Bank 1)',
    gt86Context:
      'Most common code on modified GT86s. Usually caused by aftermarket headers or a decat. If the car has a standard exhaust, this could indicate a failing catalytic converter.',
  },
  P0171: {
    description: 'System too lean (Bank 1)',
    gt86Context:
      'Bank 1 on the FA20 is cylinders 1 and 3. Can be caused by a vacuum leak, failing fuel injector, or dirty MAF sensor. Check for aftermarket intakes that may have disturbed the MAF housing.',
  },
  P0172: {
    description: 'System too rich (Bank 1)',
    gt86Context:
      'Bank 1 running rich. On the FA20, check for leaking fuel injectors or a stuck-open purge valve. Common after poorly done intake mods.',
  },
  P0174: {
    description: 'System too lean (Bank 2)',
    gt86Context:
      'Bank 2 on the FA20 is cylinders 2 and 4. Same causes as P0171 but on the other bank. If both banks are lean, suspect a common cause like a vacuum leak at the intake manifold.',
  },
  P0301: {
    description: 'Cylinder 1 misfire detected',
    gt86Context:
      'Misfire on cylinder 1. Check spark plugs and coil packs. The FA20 is known to foul plugs if running rich. Could also indicate low compression.',
  },
  P0302: {
    description: 'Cylinder 2 misfire detected',
    gt86Context:
      'Misfire on cylinder 2. Same checks as P0301. If multiple cylinders are misfiring, suspect a common cause like fuel pressure or ignition system.',
  },
  P0303: {
    description: 'Cylinder 3 misfire detected',
    gt86Context: 'Misfire on cylinder 3. Check spark plug and coil pack. Same bank as cylinder 1.',
  },
  P0304: {
    description: 'Cylinder 4 misfire detected',
    gt86Context: 'Misfire on cylinder 4. Check spark plug and coil pack. Same bank as cylinder 2.',
  },
  P0442: {
    description: 'Evaporative emission system leak detected (small)',
    gt86Context:
      'Small EVAP leak. Often a loose or worn fuel cap. Check the cap seal first before suspecting anything else.',
  },
  P0456: {
    description: 'Evaporative emission system leak detected (very small)',
    gt86Context:
      'Very small EVAP leak. Same as P0442 but smaller. Fuel cap is the most likely cause. Common on older GT86s.',
  },
  P0128: {
    description: 'Coolant thermostat below regulating temperature',
    gt86Context:
      'Thermostat stuck open or slow to close. The FA20 runs cool anyway — this code means it is not reaching operating temperature at all. Cheap fix but worth checking before purchase.',
  },
}

export function lookupFaultCode(code: string): FaultCodeInfo {
  return (
    FAULT_CODES[code] ?? {
      description: `Diagnostic trouble code ${code}`,
      gt86Context: null,
    }
  )
}
