'use client';

import { useState, useEffect, ReactNode } from 'react';

interface DossierSectionProps {
  sectionNumber: number;
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  storageKey: string;
}

export default function DossierSection({
  sectionNumber,
  title,
  children,
  defaultExpanded = false,
  storageKey,
}: DossierSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [mounted, setMounted] = useState(false);

  // Load preference from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsExpanded(saved === 'true');
    }
  }, [storageKey]);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (mounted) {
      localStorage.setItem(storageKey, String(newState));
    }
  };

  return (
    <div className="aged-paper border-4 border-amber-900 rounded-lg p-4 sm:p-6 mb-6 shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        {/* Clickable Header */}
        <button
          onClick={toggleExpanded}
          className="w-full text-left flex items-center justify-between group mb-4 hover:opacity-80 transition-opacity"
        >
          <h2 className="text-xl sm:text-2xl font-bold typewriter-font stamp-effect border-b-2 border-amber-900 pb-2 flex-1" style={{ color: '#2d1810' }}>
            <span className="inline-block transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              ▶
            </span>
            {' '}
            SECTION {sectionNumber}: {title}
          </h2>
        </button>

        {/* Collapsible Content */}
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: isExpanded ? '5000px' : '0px',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
