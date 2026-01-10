// CollapsibleClueCard Component
// Changes:
// - Created: Collapsible clue card component for displaying clue details with expand/collapse functionality
// - Updated: Restructured layout - buttons above title, Origin moved to details section, improved spacing, left-aligned list
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReleaseControls from './ReleaseControls';

interface Clue {
  id: string;
  title: string;
  targetType: string;
  targetValue: string | null;
  originCountry: string;
  released: boolean;
  retracted: boolean;
  backstory?: string | null;
  supportingIntel?: string | null;
  takeaways?: string[] | null;
  source?: string | null;
  confidenceLevel?: string | null;
  eventDate?: string | null;
}

interface CollapsibleClueCardProps {
  clue: Clue;
}

export default function CollapsibleClueCard({ clue }: CollapsibleClueCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="bg-gray-700 rounded-lg"
      style={{ 
        border: '1px solid rgba(156, 163, 175, 0.5)',
        boxShadow: '0 0 8px rgba(156, 163, 175, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
      }}
    >
      {/* Buttons row - above title */}
      <div 
        className="flex justify-end mb-3"
        style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}
      >
        <ReleaseControls
          clueId={clue.id}
          released={clue.released}
          retracted={clue.retracted}
        />
        <Link
          href={`/gm/clues/${clue.id}/edit`}
          className="button-component button-edit"
          style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
        >
          Edit
        </Link>
      </div>

      {/* Title row - clickable to expand/collapse */}
      <div 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="dynamic-text-lg font-semibold mb-2" style={{ color: 'white' }}>
          {clue.title}
          <span className="ml-2" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
            {isOpen ? '▼' : '▶'}
          </span>
        </h3>
        <div className="flex flex-wrap" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
          <span className="dynamic-text-base" style={{ color: 'white' }}>
            Target: <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.targetType}</span>
            {clue.targetValue && ` (${clue.targetValue})`}
          </span>
          {clue.released && (
            <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded dynamic-text-base">
              Released
            </span>
          )}
          {clue.retracted && (
            <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded dynamic-text-base">
              Retracted
            </span>
          )}
        </div>
      </div>
      
      {/* Details section - below horizontal line */}
      {isOpen && (
        <div 
          className="mt-4 pt-4 border-t" 
          style={{ 
            borderColor: 'rgba(156, 163, 175, 0.5)',
            marginTop: 'clamp(1rem, 3vw, 1.5rem)', 
            paddingTop: 'clamp(1rem, 3vw, 1.5rem)' 
          }}
        >
          {/* Origin - moved to details section */}
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <span className="dynamic-text-base font-semibold" style={{ color: 'white' }}>Origin: </span>
            <span className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.originCountry}</span>
          </div>

          {/* Event Date */}
          {clue.eventDate && (
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <span className="dynamic-text-base font-semibold" style={{ color: 'white' }}>Event Date: </span>
              <span className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.eventDate}</span>
            </div>
          )}

          {/* Backstory */}
          {clue.backstory && (
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <span className="dynamic-text-base font-semibold mb-2 block" style={{ color: 'white' }}>Backstory:</span>
              <p className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.backstory}</p>
            </div>
          )}

          {/* Supporting Intel */}
          {clue.supportingIntel && (
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <span className="dynamic-text-base font-semibold mb-2 block" style={{ color: 'white' }}>Supporting Intel:</span>
              <p className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.supportingIntel}</p>
            </div>
          )}

          {/* Source */}
          {clue.source && (
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <span className="dynamic-text-base font-semibold" style={{ color: 'white' }}>Source: </span>
              <span className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.source}</span>
            </div>
          )}

          {/* Confidence Level */}
          {clue.confidenceLevel && (
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <span className="dynamic-text-base font-semibold" style={{ color: 'white' }}>Confidence: </span>
              <span className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{clue.confidenceLevel}</span>
            </div>
          )}

          {/* Takeaways - left-aligned list */}
          {clue.takeaways && clue.takeaways.length > 0 && (
            <div>
              <span className="dynamic-text-base font-semibold mb-2 block" style={{ color: 'white' }}>Takeaways:</span>
              <ul style={{ 
                listStyle: 'disc',
                paddingLeft: 'clamp(1.25rem, 4vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)'
              }}>
                {clue.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{takeaway}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
