interface BoundariesSectionProps {
  canDiscuss: string[];
  mustConceal: string[];
}

export default function BoundariesSection({
  canDiscuss,
  mustConceal,
}: BoundariesSectionProps) {
  return (
    <div style={{ gap: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}>
      <div className="border-3 border-green-700 bg-green-50/40 rounded" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
        <p className="text-xs sm:text-sm font-bold tracking-widest typewriter-font text-green-800" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          MAY DISCUSS:
        </p>
        <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', paddingLeft: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
          {canDiscuss.map((item, index) => (
            <li key={index} className="flex items-start document-font text-sm sm:text-base">
              <span className="text-green-700 mr-2 font-bold text-lg flex-shrink-0">●</span>
              <span style={{ color: '#3d2820' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-3 border-red-700 bg-red-50/40 rounded" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
        <p className="text-xs sm:text-sm font-bold tracking-widest typewriter-font text-red-800" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          MUST CONCEAL:
        </p>
        <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', paddingLeft: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
          {mustConceal.map((item, index) => (
            <li key={index} className="flex items-start document-font text-sm sm:text-base">
              <span className="text-red-700 mr-2 font-bold text-lg flex-shrink-0">●</span>
              <span style={{ color: '#3d2820' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
