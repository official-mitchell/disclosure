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
      className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
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
