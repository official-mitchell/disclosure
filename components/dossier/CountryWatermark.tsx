interface CountryWatermarkProps {
  country: string;
}

export default function CountryWatermark({ country }: CountryWatermarkProps) {
  const countryConfig: Record<string, { symbol: string; color: string }> = {
    RUSSIA: {
      symbol: '☭',
      color: '#7f1d1d', // Darker red
    },
    US: {
      symbol: '★',
      color: '#1e3a8a', // Darker blue
    },
    CHINA: {
      symbol: '★',
      color: '#7f1d1d', // Darker red
    },
  };

  const config = countryConfig[country.toUpperCase()] || countryConfig.US;

  return (
    <div className="flex items-center justify-center pointer-events-none">
      <div
        className="font-bold select-none"
        style={{ 
          lineHeight: 1,
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: config.color,
          opacity: 0.5
        }}
      >
        {countryConfig[country.toUpperCase()]?.symbol || countryConfig.US.symbol}
      </div>
    </div>
  );
}
