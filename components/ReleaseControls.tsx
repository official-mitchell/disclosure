'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReleaseControlsProps {
  clueId: string;
  released: boolean;
  retracted: boolean;
}

export default function ReleaseControls({ clueId, released, retracted }: ReleaseControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRelease = async () => {
    setLoading(true);
    try {
      await fetch(`/api/gm/clues/${clueId}/release`, { method: 'PATCH' });
      router.refresh();
    } catch (error) {
      console.error('Failed to release:', error);
    }
    setLoading(false);
  };

  const handleRetract = async () => {
    setLoading(true);
    try {
      await fetch(`/api/gm/clues/${clueId}/retract`, { method: 'PATCH' });
      router.refresh();
    } catch (error) {
      console.error('Failed to retract:', error);
    }
    setLoading(false);
  };

  if (retracted) {
    return (
      <button
        onClick={handleRelease}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm disabled:opacity-50"
      >
        {loading ? 'Re-releasing...' : 'Re-release'}
      </button>
    );
  }

  if (released) {
    return (
      <button
        onClick={handleRetract}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm disabled:opacity-50"
      >
        {loading ? 'Retracting...' : 'Retract'}
      </button>
    );
  }

  return (
    <button
      onClick={handleRelease}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm disabled:opacity-50"
    >
      {loading ? 'Releasing...' : 'Release'}
    </button>
  );
}
