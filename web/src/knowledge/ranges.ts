export type RangeStatus = 'normal' | 'warning' | 'critical'

export interface RangeCheck {
  status: RangeStatus
  message: string
}

interface RangeDefinition {
  normalMin: number
  normalMax: number
  warningMin: number
  warningMax: number
  unit: string
  context: (value: number, status: RangeStatus) => string
}

const RANGES: Record<string, RangeDefinition> = {
  coolant: {
    normalMin: 75,
    normalMax: 105,
    warningMin: 60,
    warningMax: 115,
    unit: '°C',
    context: (value, status) => {
      if (value < 60) return 'Engine not at operating temperature. May not have been warmed up, or thermostat could be stuck open.'
      if (value > 115) return 'Overheating. Do not drive. Could indicate a cooling system failure — radiator, water pump, or thermostat.'
      if (value > 105) return 'Running hot. The FA20 normally sits around 80-95°C. Worth investigating the cooling system.'
      if (value < 75) return 'Still warming up. Normal if the engine was recently started.'
      return 'Normal operating temperature for the FA20.'
    },
  },
  batteryVoltage: {
    normalMin: 13.5,
    normalMax: 14.8,
    warningMin: 12.0,
    warningMax: 15.5,
    unit: 'V',
    context: (value, status) => {
      if (value < 12.0) return 'Very low voltage. Battery may be dead or alternator not charging.'
      if (value < 13.5) return 'Below charging voltage. Engine may not be running, or the alternator could be failing.'
      if (value > 15.5) return 'Overcharging. Voltage regulator may be faulty. Can damage electronics.'
      if (value > 14.8) return 'Slightly high but usually fine. Monitor if it climbs further.'
      return 'Normal charging voltage. Alternator is working correctly.'
    },
  },
  fuelTrim: {
    normalMin: -10,
    normalMax: 10,
    warningMin: -15,
    warningMax: 15,
    unit: '%',
    context: (value, status) => {
      if (Math.abs(value) <= 10) return 'Within normal range for the FA20.'
      if (value > 15) return 'Running very lean. The ECU is adding significant fuel to compensate. Could indicate a vacuum leak, failing O2 sensor, or fuel delivery issue.'
      if (value > 10) return 'Running lean. The ECU is compensating but this is outside normal range. Worth investigating.'
      if (value < -15) return 'Running very rich. The ECU is pulling significant fuel. Could indicate leaking injectors or a sensor issue.'
      if (value < -10) return 'Running rich. Outside normal range for the FA20. Check for fuel system issues.'
      return ''
    },
  },
}

export function checkRange(pid: string, value: number): RangeCheck {
  const range = RANGES[pid]
  if (!range) {
    return { status: 'normal', message: '' }
  }

  let status: RangeStatus
  if (value < range.warningMin || value > range.warningMax) {
    status = 'critical'
  } else if (value < range.normalMin || value > range.normalMax) {
    status = 'warning'
  } else {
    status = 'normal'
  }

  return { status, message: range.context(value, status) }
}
