export interface MonitorContext {
  description: string
  incompleteWarning: string
}

const MONITOR_CONTEXT: Record<string, MonitorContext> = {
  Catalyst: {
    description: 'Tests whether the catalytic converter is working efficiently.',
    incompleteWarning:
      'Catalyst test has not completed. If codes were recently cleared, this is expected — it takes several drive cycles to complete. Ask the seller why codes were cleared.',
  },
  'Heated catalyst': {
    description: 'Tests the heated catalytic converter (if fitted).',
    incompleteWarning: 'Heated catalyst test has not completed.',
  },
  'Evaporative system': {
    description: 'Checks for fuel vapour leaks in the EVAP system.',
    incompleteWarning:
      'EVAP test has not completed. This test requires specific conditions (fuel level, temperature) and can take several days of normal driving.',
  },
  'Secondary air system': {
    description: 'Tests the secondary air injection system used during cold starts.',
    incompleteWarning: 'Secondary air test has not completed.',
  },
  'A/C refrigerant': {
    description: 'Monitors the air conditioning refrigerant system.',
    incompleteWarning: 'A/C refrigerant test has not completed.',
  },
  'Oxygen sensor': {
    description: 'Tests the O2 sensors that monitor the air-fuel mixture.',
    incompleteWarning:
      'O2 sensor test has not completed. This is one of the faster monitors — if it has not completed, codes were likely cleared very recently.',
  },
  'Oxygen sensor heater': {
    description: 'Tests the heater circuits in the O2 sensors.',
    incompleteWarning: 'O2 sensor heater test has not completed.',
  },
  'EGR/VVT system': {
    description: 'Tests the exhaust gas recirculation or variable valve timing system.',
    incompleteWarning:
      'EGR/VVT test has not completed. On the FA20, this monitors the variable valve timing. Incomplete after a code clear is normal — it needs highway driving to complete.',
  },
}

export function getMonitorContext(name: string): MonitorContext {
  return (
    MONITOR_CONTEXT[name] ?? {
      description: `Monitors the ${name.toLowerCase()}.`,
      incompleteWarning: `${name} test has not completed.`,
    }
  )
}
