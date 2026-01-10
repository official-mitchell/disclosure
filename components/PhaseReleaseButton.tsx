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
      className="button-component button-add"
      style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
    >
      {loading ? 'Releasing...' : `Release All (${unreleasedCount})`}
    </button>
  );
}
