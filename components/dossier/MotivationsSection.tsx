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
      <p className="text-xs font-bold tracking-widest mb-3 sm:mb-4 typewriter-font" style={{ color: '#2d1810' }}>
        MOTIVATIONAL DRIVERS:
      </p>
      <div className="space-y-3 sm:space-y-4">
        {motivations.map((motivation, index) => (
          <div key={index} className="border-2 border-amber-800 bg-amber-50/30 rounded-lg p-3 sm:p-4">
            <div className="border-b border-amber-700 pb-2 mb-2 sm:mb-3">
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
