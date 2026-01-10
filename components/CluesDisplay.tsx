'use client';

import useSWR from 'swr';
import ClueCard from './ClueCard';
import { Clue } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CluesDisplay() {
  const { data, error, isLoading, mutate } = useSWR<{ clues: Clue[] }>(
    '/api/clues/visible',
    fetcher,
    {
      refreshInterval: 15000, // 15 seconds
      revalidateOnFocus: true,
    }
  );

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg dynamic-card-padding card-container text-center">
        <p className="dynamic-text-base" style={{ color: '#ef4444' }}>Failed to load intelligence. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg dynamic-card-padding card-container text-center">
        <div className="animate-pulse">
          <div className="bg-gray-700 rounded-full mx-auto mb-4" style={{ width: 'clamp(3rem, 8vw, 4rem)', height: 'clamp(3rem, 8vw, 4rem)' }}></div>
          <p className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data?.clues || data.clues.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg dynamic-card-padding card-container text-center">
        <svg
          className="mx-auto mb-4"
          style={{ width: 'clamp(3rem, 8vw, 4rem)', height: 'clamp(3rem, 8vw, 4rem)', color: 'rgba(255, 255, 255, 0.4)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="dynamic-text-lg font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No Intelligence Available
        </h3>
        <p className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Wait for the Game Master to release clues. This page will automatically update.
        </p>
      </div>
    );
  }

  return (
    <div style={{ gap: 'clamp(1.5rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
      <div className="flex justify-between items-center">
        <p className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {data.clues.length} {data.clues.length === 1 ? 'report' : 'reports'} available
        </p>
        <button
          onClick={() => mutate()}
          className="form-button form-button-secondary"
          style={{ width: 'auto', minWidth: 'clamp(100px, 18vw, 140px)' }}
        >
          Refresh Now
        </button>
      </div>
      {data.clues.map((clue) => (
        <ClueCard key={clue.id} clue={clue} />
      ))}
    </div>
  );
}
