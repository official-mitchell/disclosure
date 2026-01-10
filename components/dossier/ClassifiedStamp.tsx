interface ClassifiedStampProps {
  type?: 'classified' | 'top_secret' | 'confidential';
  position?: 'top-right' | 'top-left' | 'bottom-right';
}

export default function ClassifiedStamp({
  type = 'classified',
  position = 'top-right',
}: ClassifiedStampProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const typeConfig = {
    classified: {
      text: 'CLASSIFIED',
      color: 'text-red-600',
      border: 'border-red-600',
    },
    top_secret: {
      text: 'TOP SECRET',
      color: 'text-red-700',
      border: 'border-red-700',
    },
    confidential: {
      text: 'CONFIDENTIAL',
      color: 'text-orange-600',
      border: 'border-orange-600',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`absolute ${positionClasses[position]} transform rotate-12 opacity-30 pointer-events-none`}
    >
      <div
        className={`${config.border} border-4 px-4 py-2 ${config.color} font-bold text-2xl tracking-wider`}
        style={{ fontFamily: 'Courier, monospace', fontSize: '1.875rem' }}
      >
        {config.text}
      </div>
    </div>
  );
}
