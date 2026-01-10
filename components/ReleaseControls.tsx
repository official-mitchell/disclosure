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
        className="button-component button-edit"
        style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
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
        className="button-component button-delete"
        style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
      >
        {loading ? 'Retracting...' : 'Retract'}
      </button>
    );
  }

  return (
    <button
      onClick={handleRelease}
      disabled={loading}
      className="button-component button-add"
      style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
    >
      {loading ? 'Releasing...' : 'Release'}
    </button>
  );
}
