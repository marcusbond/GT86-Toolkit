import type { ScenarioName } from '@/connection'
import type { DvlaData } from './types'

const clean: DvlaData = {
  vehicle: {
    registrationDate: 'March 2015',
    colour: 'White',
    engine: '2.0L Petrol',
    taxStatus: 'Taxed until Oct 2026',
    taxDueDate: '2026-10-01',
    motExpiry: '28 October 2026',
  },
  motHistory: [
    { date: '28 Oct 2025', result: 'pass', mileage: 67430, advisories: [], failures: [] },
    {
      date: '30 Oct 2024',
      result: 'pass',
      mileage: 59812,
      advisories: ['Rear brake disc worn but above limit'],
      failures: [],
    },
    { date: '1 Nov 2023', result: 'pass', mileage: 52105, advisories: [], failures: [] },
    { date: '28 Oct 2022', result: 'pass', mileage: 44290, advisories: [], failures: [] },
    { date: '2 Nov 2021', result: 'pass', mileage: 36800, advisories: [], failures: [] },
    { date: '29 Oct 2020', result: 'pass', mileage: 29150, advisories: [], failures: [] },
    { date: '31 Oct 2019', result: 'pass', mileage: 22400, advisories: [], failures: [] },
    { date: '1 Nov 2018', result: 'pass', mileage: 14900, advisories: [], failures: [] },
    { date: '30 Oct 2017', result: 'pass', mileage: 7500, advisories: [], failures: [] },
  ],
}

const modified: DvlaData = {
  vehicle: {
    registrationDate: 'June 2014',
    colour: 'Red',
    engine: '2.0L Petrol',
    taxStatus: 'Taxed until Mar 2026',
    taxDueDate: '2026-03-01',
    motExpiry: '15 March 2026',
  },
  motHistory: [
    {
      date: '15 Mar 2025',
      result: 'pass',
      mileage: 71200,
      advisories: ['Exhaust emissions slightly high'],
      failures: [],
    },
    { date: '18 Mar 2024', result: 'pass', mileage: 63400, advisories: [], failures: [] },
    { date: '20 Mar 2023', result: 'pass', mileage: 55100, advisories: [], failures: [] },
    { date: '22 Mar 2022', result: 'pass', mileage: 47800, advisories: [], failures: [] },
    { date: '25 Mar 2021', result: 'pass', mileage: 40200, advisories: [], failures: [] },
    { date: '19 Mar 2020', result: 'pass', mileage: 32500, advisories: [], failures: [] },
    { date: '21 Mar 2019', result: 'pass', mileage: 24100, advisories: [], failures: [] },
    { date: '15 Mar 2018', result: 'pass', mileage: 16800, advisories: [], failures: [] },
  ],
}

const suspect: DvlaData = {
  vehicle: {
    registrationDate: 'September 2013',
    colour: 'Silver',
    engine: '2.0L Petrol',
    taxStatus: 'Taxed until Jul 2026',
    taxDueDate: '2026-07-01',
    motExpiry: '10 July 2026',
  },
  motHistory: [
    { date: '10 Jul 2025', result: 'pass', mileage: 48200, advisories: [], failures: [] },
    { date: '12 Jul 2024', result: 'pass', mileage: 45900, advisories: [], failures: [] },
    { date: '8 Jul 2023', result: 'pass', mileage: 52100, advisories: [], failures: [] },
    {
      date: '15 Jul 2022',
      result: 'pass',
      mileage: 44800,
      advisories: ['Nearside front tyre worn close to legal limit'],
      failures: [],
    },
    { date: '20 Jul 2021', result: 'pass', mileage: 38200, advisories: [], failures: [] },
    { date: '22 Jul 2020', result: 'pass', mileage: 31400, advisories: [], failures: [] },
    { date: '18 Jul 2019', result: 'pass', mileage: 24500, advisories: [], failures: [] },
    { date: '12 Jul 2018', result: 'pass', mileage: 17200, advisories: [], failures: [] },
  ],
}

const rough: DvlaData = {
  vehicle: {
    registrationDate: 'January 2013',
    colour: 'Black',
    engine: '2.0L Petrol',
    taxStatus: 'SORN',
    taxDueDate: null,
    motExpiry: '5 February 2026',
  },
  motHistory: [
    {
      date: '5 Feb 2025',
      result: 'pass',
      mileage: 98400,
      advisories: [
        'Exhaust emissions Lambda reading high',
        'Offside rear tyre worn close to legal limit',
      ],
      failures: [],
    },
    {
      date: '2 Feb 2025',
      result: 'fail',
      mileage: 98350,
      advisories: [],
      failures: [
        'Nearside front tyre below minimum tread',
        'Offside rear brake binding slightly',
        'Exhaust Lambda reading outside limits',
      ],
    },
    {
      date: '8 Feb 2024',
      result: 'pass',
      mileage: 89100,
      advisories: ['Exhaust has slight leak'],
      failures: [],
    },
    {
      date: '5 Feb 2024',
      result: 'fail',
      mileage: 89050,
      advisories: [],
      failures: ['Exhaust emissions exceed limits'],
    },
    { date: '10 Feb 2023', result: 'pass', mileage: 78900, advisories: [], failures: [] },
    { date: '12 Feb 2022', result: 'pass', mileage: 67200, advisories: [], failures: [] },
    { date: '15 Feb 2021', result: 'pass', mileage: 55800, advisories: [], failures: [] },
    { date: '18 Feb 2020', result: 'pass', mileage: 42100, advisories: [], failures: [] },
    { date: '20 Feb 2019', result: 'pass', mileage: 28500, advisories: [], failures: [] },
    { date: '22 Feb 2018', result: 'pass', mileage: 15200, advisories: [], failures: [] },
  ],
}

export const dvlaScenarios: Record<ScenarioName, DvlaData> = {
  clean,
  modified,
  suspect,
  rough,
}
