// CollapsiblePhase Component
// Changes:
// - Created: Collapsible phase component for GM clues page with expand/collapse functionality
'use client';

import { useState } from 'react';

interface CollapsiblePhaseProps {
  phase: number;
  clueCount: number;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export default function CollapsiblePhase({ phase, clueCount, children, headerActions }: CollapsiblePhaseProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden" 
      style={{ 
        border: '2px solid rgba(156, 163, 175, 0.5)',
        boxShadow: '0 0 8px rgba(156, 163, 175, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)' 
      }}
    >
      <div 
        className="bg-gray-900 border-b cursor-pointer" 
        style={{ 
          borderColor: 'rgba(156, 163, 175, 0.5)',
          padding: 'clamp(1rem, 3vw, 1.5rem)' 
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h2 className="dynamic-text-lg font-bold" style={{ color: 'white' }}>
            Phase {phase} ({clueCount} {clueCount === 1 ? 'clue' : 'clues'})
            <span className="ml-2" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              {isOpen ? '▼' : '▶'}
            </span>
          </h2>
          <div onClick={(e) => e.stopPropagation()}>
            {headerActions}
          </div>
        </div>
      </div>
      {isOpen && (
        <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', gap: 'clamp(0.75rem, 2vw, 1rem)', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      )}
    </div>
  );
}
