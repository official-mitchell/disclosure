interface BackstorySectionProps {
  backstory: string;
}

export default function BackstorySection({ backstory }: BackstorySectionProps) {
  return (
    <div className="border-2 border-amber-800 bg-amber-50/30 rounded" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
      <div className="document-font text-sm sm:text-base leading-relaxed whitespace-pre-wrap" style={{ color: '#3d2820' }}>
        {backstory}
      </div>
    </div>
  );
}
