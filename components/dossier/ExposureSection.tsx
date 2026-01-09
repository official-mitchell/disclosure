interface ExposureSectionProps {
  exposureConsequences: string;
}

export default function ExposureSection({
  exposureConsequences,
}: ExposureSectionProps) {
  return (
    <div className="border-4 border-red-700 bg-red-100/40 rounded p-4 sm:p-5 shadow-inner">
      <div className="border-l-4 border-red-800 pl-3 sm:pl-4">
        <p className="document-font text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-semibold" style={{ color: '#7f1d1d' }}>
          {exposureConsequences}
        </p>
      </div>
    </div>
  );
}
