interface Motivation {
  label: string;
  description: string;
}

interface MotivationsSectionProps {
  motivations: Motivation[];
}

export default function MotivationsSection({
  motivations,
}: MotivationsSectionProps) {
  return (
    <>
      <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
        MOTIVATIONAL DRIVERS:
      </p>
      <div style={{ gap: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}>
        {motivations.map((motivation, index) => (
          <div key={index} className="border-2 border-amber-800 bg-amber-50/30 rounded-lg" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <div className="border-b border-amber-700" style={{ paddingBottom: 'clamp(0.75rem, 2vw, 1rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <h3 className="typewriter-font font-bold text-base sm:text-lg uppercase tracking-wide" style={{ color: '#2d1810' }}>
                ─ {motivation.label} ─
              </h3>
            </div>
            <p className="document-font text-sm sm:text-base leading-relaxed" style={{ color: '#3d2820' }}>
              {motivation.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
