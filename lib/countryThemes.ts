export interface CountryTheme {
  primary: string;
  accent: string;
  border: string;
  headerBg: string;
  sectionBg: string;
  textDark: string;
  textLight: string;
}

export const countryThemes: Record<string, CountryTheme> = {
  RUSSIA: {
    primary: '#8B0000', // Deep Red
    accent: '#D4AF37', // Gold
    border: '#6B0000',
    headerBg: 'bg-red-900',
    sectionBg: 'bg-red-50',
    textDark: 'text-red-900',
    textLight: 'text-red-800',
  },
  US: {
    primary: '#000080', // Navy Blue
    accent: '#DC143C', // Crimson
    border: '#00005F',
    headerBg: 'bg-blue-900',
    sectionBg: 'bg-blue-50',
    textDark: 'text-blue-900',
    textLight: 'text-blue-800',
  },
  CHINA: {
    primary: '#DE2910', // Red
    accent: '#FFDE00', // Yellow
    border: '#A01E0C',
    headerBg: 'bg-red-800',
    sectionBg: 'bg-red-50',
    textDark: 'text-red-900',
    textLight: 'text-red-800',
  },
};

export function getCountryTheme(country: string): CountryTheme {
  return countryThemes[country.toUpperCase()] || countryThemes.US;
}

export function getCountryName(country: string): string {
  const names: Record<string, string> = {
    RUSSIA: 'Russian Federation',
    US: 'United States of America',
    CHINA: "People's Republic of China",
  };
  return names[country.toUpperCase()] || country;
}
