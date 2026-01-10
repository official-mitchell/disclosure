import MarkdownText from './MarkdownText';

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
      <div className="border-2 border-amber-800 bg-amber-50/30 rounded" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)' }}>
        <div className="border-l-4 border-amber-900" style={{ paddingLeft: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <div className="document-font italic text-lg sm:text-xl leading-relaxed" style={{ color: '#3d2820', fontSize: 'clamp(1.40625rem, 2.5vw, 1.5625rem)' }}>
            "<MarkdownText content={disclosureBelief} />"
          </div>
          <p className="document-font text-right text-base sm:text-lg font-semibold" style={{ color: '#2d1810', marginTop: 'clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(1.25rem, 2.25vw, 1.40625rem)' }}>
            — {displayName}
          </p>
        </div>
      </div>
    </>
  );
}
