'use client';

import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden card-container-thick">
      {/* Header - Clickable */}
      <div 
        className="bg-gray-900 border-b card-separator dynamic-card-padding cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <div className="flex items-center flex-1" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="dynamic-text-2xl">🌍</div>
            <div className="flex-1">
              <h3 className="dynamic-text-xl font-bold" style={{ color: 'white' }}>
                {clue.title}
              </h3>
              <p className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Origin: {clue.originCountry} | {clue.eventDate}
              </p>
            </div>
          </div>
          <div className="flex items-center" style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <svg
              style={{ width: 'clamp(1.95rem, 5.2vw, 2.6rem)', height: 'clamp(1.95rem, 5.2vw, 2.6rem)', minWidth: '31px', color: 'white' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content - Collapsible with Animation */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isOpen ? '5000px' : '0',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="dynamic-card-padding">
        {/* Backstory with optional image */}
        <div className="flex" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          {clue.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={clue.imageUrl}
                alt={clue.title}
                className="object-cover rounded card-container"
                style={{ width: 'clamp(8rem, 20vw, 10rem)', height: 'clamp(8rem, 20vw, 10rem)' }}
              />
            </div>
          )}
          <div className="flex-1">
            <p className="dynamic-text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{clue.backstory}</p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <div className="flex justify-between dynamic-text-base mb-2">
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>CONFIDENCE:</span>
            <span className="uppercase" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {CONFIDENCE_DISPLAY[clue.confidenceLevel as keyof typeof CONFIDENCE_DISPLAY]}
            </span>
          </div>
          <div className="bg-gray-900 rounded-full overflow-hidden" style={{ height: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
            <div
              className={`bg-blue-500 h-full ${getConfidenceWidth(clue.confidenceLevel)}`}
            />
          </div>
        </div>

        {/* Source */}
        <div className="dynamic-text-base" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>SOURCE: </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.source}</span>
        </div>

        {/* Supporting Intel */}
        {clue.supportingIntel && (
          <div className="bg-gray-900 rounded dynamic-card-padding card-container" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <h4 className="dynamic-text-base font-semibold mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              SUPPORTING INTEL:
            </h4>
            <p className="dynamic-text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {clue.supportingIntel}
            </p>
          </div>
        )}

        {/* Takeaways */}
        {clue.takeaways.length > 0 && (
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <h4 className="dynamic-text-base font-semibold mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              TAKEAWAYS:
            </h4>
            <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column' }}>
              {clue.takeaways.map((takeaway, idx) => (
                <li key={idx} className="dynamic-text-base flex" style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <span style={{ color: '#60a5fa' }}>•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t card-separator dynamic-card-padding flex" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
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
