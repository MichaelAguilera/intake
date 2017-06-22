 export const ROLE_TYPE_REPORTER = Object.freeze([
  'Mandated Reporter',
  'Non-mandated Reporter',
  'Anonymous Reporter',
  'Parent',
  'Caregiver',
])
export const ROLE_TYPE_NON_REPORTER = Object.freeze([
  'Victim',
  'Alleged Perpetrator',
])

export const ROLE_TYPE = Object.freeze([
  ...ROLE_TYPE_NON_REPORTER,
  ...ROLE_TYPE_REPORTER,
])
