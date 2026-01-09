interface CountryWatermarkProps {
  country: string;
}

export default function CountryWatermark({ country }: CountryWatermarkProps) {
  const countryConfig: Record<string, { symbol: string; color: string }> = {
    RUSSIA: {
      symbol: '☭',
      color: 'text-red-900/10',
    },
    US: {
      symbol: '★',
      color: 'text-blue-900/10',
    },
    CHINA: {
      symbol: '★',
      color: 'text-red-900/10',
    },
  };

  const config = countryConfig[country.toUpperCase()] || countryConfig.US;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div
        className={`${config.color} text-[300px] font-bold select-none`}
        style={{ lineHeight: 1 }}
      >
        {config.symbol}
      </div>
    </div>
  );
}
