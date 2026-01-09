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
      <p className="text-xs font-bold tracking-widest mb-3 sm:mb-4 typewriter-font" style={{ color: '#2d1810' }}>
        SUBJECT'S STATEMENT:
      </p>
      <div className="border-2 border-amber-800 bg-amber-50/30 rounded p-4 sm:p-6 shadow-inner">
        <div className="border-l-4 border-amber-900 pl-3 sm:pl-4">
          <p className="document-font italic text-lg sm:text-xl leading-relaxed" style={{ color: '#3d2820' }}>
            "{disclosureBelief}"
          </p>
          <p className="document-font text-right mt-4 sm:mt-6 text-base sm:text-lg font-semibold" style={{ color: '#2d1810' }}>
            — {displayName}
          </p>
        </div>
      </div>
    </>
  );
}
