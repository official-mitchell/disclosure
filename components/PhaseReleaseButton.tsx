'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PhaseReleaseButtonProps {
  phase: number;
  unreleasedCount: number;
}

export default function PhaseReleaseButton({ phase, unreleasedCount }: PhaseReleaseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReleasePhase = async () => {
    if (!confirm(`Release all ${unreleasedCount} unreleased clues in Phase ${phase}?`)) {
      return;
    }

    setLoading(true);
    try {
      await fetch(`/api/gm/release/phase/${phase}`, { method: 'POST' });
      router.refresh();
    } catch (error) {
      console.error('Failed to release phase:', error);
    }
    setLoading(false);
  };

  if (unreleasedCount === 0) return null;

  return (
    <button
      onClick={handleReleasePhase}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm disabled:opacity-50"
    >
      {loading ? 'Releasing...' : `Release All (${unreleasedCount})`}
    </button>
  );
}
