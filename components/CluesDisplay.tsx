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
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 text-center">
        <p className="text-red-200">Failed to load intelligence. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data?.clues || data.clues.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-600 mb-4"
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
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          No Intelligence Available
        </h3>
        <p className="text-gray-500">
          Wait for the Game Master to release clues. This page will automatically update.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          {data.clues.length} {data.clues.length === 1 ? 'report' : 'reports'} available
        </p>
        <button
          onClick={() => mutate()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
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
