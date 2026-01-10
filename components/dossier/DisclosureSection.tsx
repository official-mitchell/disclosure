interface DisclosureSectionProps {
  disclosureBelief: string;
  displayName: string;
}

export default function DisclosureSection({
  disclosureBelief,
  displayName,
}: DisclosureSectionProps) {
  return (
    <>
      <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
        SUBJECT'S STATEMENT:
      </p>
      <div className="border-2 border-amber-800 bg-amber-50/30 rounded shadow-inner" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
        <div className="border-l-4 border-amber-900" style={{ paddingLeft: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <p className="document-font italic text-lg sm:text-xl leading-relaxed" style={{ color: '#3d2820' }}>
            "{disclosureBelief}"
          </p>
          <p className="document-font text-right text-base sm:text-lg font-semibold" style={{ color: '#2d1810', marginTop: 'clamp(1rem, 3vw, 1.5rem)' }}>
            — {displayName}
          </p>
        </div>
      </div>
    </>
  );
}
