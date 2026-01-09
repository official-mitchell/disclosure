export const COUNTRIES = {
  RUSSIA: 'RUSSIA',
  US: 'US',
  CHINA: 'CHINA',
} as const;

export const ARCHETYPES = {
  SCIENTIST: 'SCIENTIST',
  SPY: 'SPY',
  DIPLOMAT: 'DIPLOMAT',
  GENERAL: 'GENERAL',
  EXECUTIVE: 'EXECUTIVE',
  JOURNALIST: 'JOURNALIST',
  OPERATIVE: 'OPERATIVE',
} as const;

export const TARGET_TYPES = {
  all: 'all',
  country: 'country',
  archetype: 'archetype',
  player: 'player',
} as const;

export const LEGITIMACY = {
  verified: 'verified',
  suspected: 'suspected',
  fabricated: 'fabricated',
  unknown: 'unknown',
} as const;

export const CONFIDENTIALITY = {
  top_secret: 'top_secret',
  confidential: 'confidential',
  shareable_if_pressed: 'shareable_if_pressed',
  public: 'public',
} as const;

export const CONFIDENCE_LEVEL = {
  confirmed: 'confirmed',
  high: 'high',
  medium: 'medium',
  low: 'low',
  unverified: 'unverified',
} as const;

// Display names for UI
export const COUNTRY_NAMES = {
  RUSSIA: 'Russia',
  US: 'United States',
  CHINA: 'China',
};

export const ARCHETYPE_NAMES = {
  SCIENTIST: 'Scientist',
  SPY: 'Spy',
  DIPLOMAT: 'Diplomat',
  GENERAL: 'General',
  EXECUTIVE: 'Executive',
  JOURNALIST: 'Journalist',
  OPERATIVE: 'Operative',
};

export const LEGITIMACY_DISPLAY = {
  verified: 'Verified',
  suspected: 'Suspected',
  fabricated: 'Fabricated',
  unknown: 'Unknown',
};

export const CONFIDENTIALITY_DISPLAY = {
  top_secret: 'TOP SECRET - DENY ALL KNOWLEDGE',
  confidential: 'CONFIDENTIAL',
  shareable_if_pressed: 'SHARE ONLY IF CORNERED',
  public: 'PUBLIC INFORMATION',
};

export const CONFIDENCE_DISPLAY = {
  confirmed: 'Confirmed',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  unverified: 'Unverified',
};

// Common origin countries for intel
export const ORIGIN_COUNTRIES = [
  'US',
  'Russia',
  'China',
  'UK',
  'France',
  'Germany',
  'Israel',
  'India',
  'Pakistan',
  'Brazil',
  'Japan',
  'North Korea',
  'Iran',
  'Unknown',
];
