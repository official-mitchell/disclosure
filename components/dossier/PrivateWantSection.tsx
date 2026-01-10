interface PrivateWantSectionProps {
  privateWant: string;
}

export default function PrivateWantSection({
  privateWant,
}: PrivateWantSectionProps) {
  return (
    <div className="border-2 border-amber-800 bg-gray-200/60 rounded relative" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', overflow: 'visible', minHeight: 'clamp(8rem, 20vw, 12rem)' }}>
      {/* Redacted overlay effect - large, light, diagonal */}
      <div 
        className="absolute pointer-events-none"
        style={{ 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(12deg)',
          opacity: 0.15,
          zIndex: 1
        }}
      >
        <span className="typewriter-font font-bold text-red-800 border-2 border-red-800 px-8 py-4 whitespace-nowrap block" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
          REDACTED
        </span>
      </div>
      <p className="document-font text-sm sm:text-base leading-relaxed whitespace-pre-wrap relative z-10" style={{ color: '#3d2820' }}>
        {privateWant}
      </p>
    </div>
  );
}
