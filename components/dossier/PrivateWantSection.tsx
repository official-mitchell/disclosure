interface PrivateWantSectionProps {
  privateWant: string;
}

export default function PrivateWantSection({
  privateWant,
}: PrivateWantSectionProps) {
  return (
    <div className="border-2 border-amber-800 bg-gray-200/60 rounded p-4 sm:p-5 relative">
      {/* Redacted overlay effect */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 transform rotate-12 opacity-60">
        <span className="typewriter-font font-bold text-red-800 text-xs border-2 border-red-800 px-2 py-1">
          REDACTED
        </span>
      </div>
      <p className="document-font text-sm sm:text-base leading-relaxed whitespace-pre-wrap pr-16 sm:pr-0" style={{ color: '#3d2820' }}>
        {privateWant}
      </p>
    </div>
  );
}
