import MarkdownText from './MarkdownText';

interface ExposureSectionProps {
  exposureConsequences: string;
}

export default function ExposureSection({
  exposureConsequences,
}: ExposureSectionProps) {
  return (
    <div className="border-4 border-red-700 bg-red-100/40 rounded shadow-inner" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
      <div className="border-l-4 border-red-800" style={{ paddingLeft: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <div className="document-font text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-semibold" style={{ color: '#7f1d1d', fontSize: 'clamp(1.09375rem, 1.625vw, 1.25rem)' }}>
          <MarkdownText content={exposureConsequences} />
        </div>
      </div>
    </div>
  );
}
