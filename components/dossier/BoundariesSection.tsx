interface BoundariesSectionProps {
  canDiscuss: string[];
  mustConceal: string[];
}

export default function BoundariesSection({
  canDiscuss,
  mustConceal,
}: BoundariesSectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="border-3 border-green-700 bg-green-50/40 rounded p-4 sm:p-5">
        <p className="text-xs sm:text-sm font-bold tracking-widest mb-2 sm:mb-3 typewriter-font text-green-800">
          MAY DISCUSS:
        </p>
        <ul className="space-y-2">
          {canDiscuss.map((item, index) => (
            <li key={index} className="flex items-start document-font text-sm sm:text-base">
              <span className="text-green-700 mr-2 font-bold text-lg flex-shrink-0">●</span>
              <span style={{ color: '#3d2820' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-3 border-red-700 bg-red-50/40 rounded p-4 sm:p-5">
        <p className="text-xs sm:text-sm font-bold tracking-widest mb-2 sm:mb-3 typewriter-font text-red-800">
          MUST CONCEAL:
        </p>
        <ul className="space-y-2">
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
