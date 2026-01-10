// ViewAsPlayerSelector Component
// Changes:
// - 2024-12-XX: Improved mobile responsiveness - adjusted padding and text size for smaller screens
'use client';

import { useRouter } from 'next/navigation';
import { Player } from '@prisma/client';

interface ViewAsPlayerSelectorProps {
  players: Player[];
}

export default function ViewAsPlayerSelector({ players }: ViewAsPlayerSelectorProps) {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      router.push(`/gm/view-as/${e.target.value}`);
    }
  };

  return (
    <select
      onChange={handleSelect}
      defaultValue=""
      className="form-input form-input-dark"
      style={{ 
        padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
        width: 'auto',
        minWidth: 'clamp(150px, 25vw, 200px)'
      }}
    >
      <option value="">View As Player...</option>
      {players.map((player) => (
        <option key={player.id} value={player.id}>
          {player.name} ({player.country}, {player.archetype})
        </option>
      ))}
    </select>
  );
}
