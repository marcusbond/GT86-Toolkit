export type ScenarioName = 'clean' | 'modified' | 'suspect' | 'rough'

export type ScenarioData = Record<string, string>

// VIN: JF1ZNAA12E2345678 (fictional GT86, 2014, manual)
// Encoded as ASCII hex bytes for Mode 09 PID 02 response
const GT86_VIN_RESPONSE =
  '49 02 01 4A 46 31 5A 4E 41 41 31 32 45 32 33 34 35 36 37 38'

const AT_RESPONSES: Record<string, string> = {
  ATZ: 'ELM327 v1.5',
  ATE0: 'OK',
  ATL0: 'OK',
  ATH0: 'OK',
  ATS1: 'OK',
  ATSP6: 'OK',
}

const clean: ScenarioData = {
  '01 01': '41 01 00 07 E1 00',
  '03': '43 00',
  '07': '47 00',
  '01 05': '41 05 7B',
  '01 06': '41 06 82',
  '01 07': '41 07 7D',
  '01 08': '41 08 81',
  '01 09': '41 09 7F',
  '01 42': '41 42 38 A4',
  '09 02': GT86_VIN_RESPONSE,
}

const modified: ScenarioData = {
  '01 01': '41 01 81 07 E1 00',
  '03': '43 01 04 20',
  '07': '47 00',
  '01 05': '41 05 7B',
  '01 06': '41 06 83',
  '01 07': '41 07 7C',
  '01 08': '41 08 84',
  '01 09': '41 09 7B',
  '01 42': '41 42 38 A4',
  '09 02': GT86_VIN_RESPONSE,
}

const suspect: ScenarioData = {
  '01 01': '41 01 00 07 E1 E1',
  '03': '43 00',
  '07': '47 01 04 20',
  '01 05': '41 05 7B',
  '01 06': '41 06 8C',
  '01 07': '41 07 8E',
  '01 08': '41 08 8A',
  '01 09': '41 09 8B',
  '01 42': '41 42 38 A4',
  '09 02': GT86_VIN_RESPONSE,
}

const rough: ScenarioData = {
  '01 01': '41 01 83 07 E1 00',
  '03': '43 03 04 20 01 71 03 01',
  '07': '47 01 03 02',
  '01 05': '41 05 9A',
  '01 06': '41 06 96',
  '01 07': '41 07 94',
  '01 08': '41 08 6E',
  '01 09': '41 09 6C',
  '01 42': '41 42 2E E0',
  '09 02': GT86_VIN_RESPONSE,
}

export const scenarios: Record<ScenarioName, ScenarioData> = {
  clean,
  modified,
  suspect,
  rough,
}

export { AT_RESPONSES }
