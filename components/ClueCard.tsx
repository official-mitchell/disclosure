import { Clue } from '@prisma/client';
import { LEGITIMACY_DISPLAY, CONFIDENTIALITY_DISPLAY, CONFIDENCE_DISPLAY } from '@/lib/constants';

interface ClueCardProps {
  clue: Clue;
}

const getLegitimacyColor = (legitimacy: string) => {
  switch (legitimacy) {
    case 'verified': return 'bg-green-900/50 border-green-700 text-green-100';
    case 'suspected': return 'bg-yellow-900/50 border-yellow-700 text-yellow-100';
    case 'fabricated': return 'bg-red-900/50 border-red-700 text-red-100';
    default: return 'bg-gray-800 border-gray-700 text-gray-300';
  }
};

const getConfidentialityColor = (confidentiality: string) => {
  switch (confidentiality) {
    case 'top_secret': return 'bg-red-900 text-red-100';
    case 'confidential': return 'bg-orange-900 text-orange-100';
    case 'shareable_if_pressed': return 'bg-yellow-900 text-yellow-100';
    case 'public': return 'bg-green-900 text-green-100';
    default: return 'bg-gray-800 text-gray-300';
  }
};

const getConfidenceWidth = (level: string) => {
  switch (level) {
    case 'confirmed': return 'w-full';
    case 'high': return 'w-4/5';
    case 'medium': return 'w-3/5';
    case 'low': return 'w-2/5';
    case 'unverified': return 'w-1/5';
    default: return 'w-1/2';
  }
};

export default function ClueCard({ clue }: ClueCardProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌍</div>
            <div>
              <h3 className="text-xl font-bold text-white">{clue.title}</h3>
              <p className="text-sm text-gray-400">{clue.eventDate}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Origin: {clue.originCountry}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Backstory with optional image */}
        <div className="flex gap-4 mb-6">
          {clue.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={clue.imageUrl}
                alt={clue.title}
                className="w-32 h-32 object-cover rounded border border-gray-700"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-gray-300 leading-relaxed">{clue.backstory}</p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">CONFIDENCE:</span>
            <span className="text-gray-200 uppercase">
              {CONFIDENCE_DISPLAY[clue.confidenceLevel as keyof typeof CONFIDENCE_DISPLAY]}
            </span>
          </div>
          <div className="bg-gray-900 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-blue-500 h-full ${getConfidenceWidth(clue.confidenceLevel)}`}
            />
          </div>
        </div>

        {/* Source */}
        <div className="mb-4 text-sm">
          <span className="text-gray-400">SOURCE: </span>
          <span className="text-gray-200">{clue.source}</span>
        </div>

        {/* Supporting Intel */}
        {clue.supportingIntel && (
          <div className="mb-4 bg-gray-900 border border-gray-700 rounded p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">
              SUPPORTING INTEL:
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {clue.supportingIntel}
            </p>
          </div>
        )}

        {/* Takeaways */}
        {clue.takeaways.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">
              TAKEAWAYS:
            </h4>
            <ul className="space-y-1">
              {clue.takeaways.map((takeaway, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4 flex gap-3">
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${getLegitimacyColor(clue.legitimacy)}`}
        >
          {LEGITIMACY_DISPLAY[clue.legitimacy as keyof typeof LEGITIMACY_DISPLAY]}
        </span>
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${getConfidentialityColor(clue.confidentiality)}`}
        >
          {CONFIDENTIALITY_DISPLAY[clue.confidentiality as keyof typeof CONFIDENTIALITY_DISPLAY]}
        </span>
      </div>
    </div>
  );
}
