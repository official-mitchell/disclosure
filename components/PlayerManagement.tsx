'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Player } from '@prisma/client';
import { COUNTRIES, ARCHETYPES, COUNTRY_NAMES, ARCHETYPE_NAMES } from '@/lib/constants';
import Link from 'next/link';

type PlayerWithCharacter = Player & {
  character: { id: string; displayName: string } | null;
};

interface PlayerManagementProps {
  initialPlayers: PlayerWithCharacter[];
}

export default function PlayerManagement({ initialPlayers }: PlayerManagementProps) {
  const router = useRouter();
  const [players, setPlayers] = useState(initialPlayers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    country: 'US',
    archetype: 'SCIENTIST',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', pin: '', country: 'US', archetype: 'SCIENTIST' });
    setEditingId(null);
    setShowAddForm(false);
    setError('');
  };

  const handleEdit = (player: Player) => {
    setFormData({
      name: player.name,
      pin: player.pin,
      country: player.country,
      archetype: player.archetype,
    });
    setEditingId(player.id);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = editingId ? `/api/gm/players/${editingId}` : '/api/gm/players';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save player');
        setLoading(false);
        return;
      }

      resetForm();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete player ${name}? This will also delete their clue assignments.`)) {
      return;
    }

    try {
      await fetch(`/api/gm/players/${id}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      alert('Failed to delete player');
    }
  };

  return (
    <div style={{ gap: 'clamp(1.5rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Add Player Button */}
      {!showAddForm && !editingId && (
        <div>
          <button
            onClick={() => setShowAddForm(true)}
            className="button-component button-add"
            style={{ width: 'auto', minWidth: 'clamp(150px, 25vw, 200px)' }}
          >
            + Add Player
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-800 rounded-lg dynamic-card-padding" style={{ border: '2px solid white' }}>
          <h3 className="dynamic-text-lg font-bold mb-4" style={{ color: 'white' }}>
            {editingId ? 'Edit Player' : 'Add New Player'}
          </h3>
          <form onSubmit={handleSubmit} style={{ gap: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <div className="form-spacing">
                <label className="form-label" style={{ color: 'white' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input form-input-dark"
                />
              </div>

              <div className="form-spacing">
                <label className="form-label" style={{ color: 'white' }}>PIN</label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  required
                  className="form-input form-input-dark"
                />
              </div>

              <div className="form-spacing">
                <label className="form-label" style={{ color: 'white' }}>Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value as any })}
                  className="form-input form-input-dark"
                >
                  {Object.keys(COUNTRIES).map((c) => (
                    <option key={c} value={c}>{COUNTRY_NAMES[c as keyof typeof COUNTRY_NAMES]}</option>
                  ))}
                </select>
              </div>

              <div className="form-spacing">
                <label className="form-label" style={{ color: 'white' }}>Archetype</label>
                <select
                  value={formData.archetype}
                  onChange={(e) => setFormData({ ...formData, archetype: e.target.value as any })}
                  className="form-input form-input-dark"
                >
                  {Object.keys(ARCHETYPES).map((a) => (
                    <option key={a} value={a}>{ARCHETYPE_NAMES[a as keyof typeof ARCHETYPE_NAMES]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <button
                type="submit"
                disabled={loading}
                className="form-button form-button-secondary"
                style={{ width: 'auto', flex: '1' }}
              >
                {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Add Player'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="nav-button"
                style={{ width: 'auto', flex: '1' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Player List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ border: '2px solid white' }}>
        <div className="bg-gray-900 border-b" style={{ borderColor: 'white', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <h2 className="dynamic-text-lg font-bold" style={{ color: 'white' }}>
            Players ({initialPlayers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b" style={{ borderColor: 'white' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'white', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'white', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>PIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'white', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'white', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', backgroundColor: 'rgba(251, 146, 60, 0.2)' }}>Archetype</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase" style={{ color: 'white', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialPlayers.map((player) => (
                <tr 
                  key={player.id} 
                  className="hover:bg-gray-750"
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                    marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)'
                  }}
                >
                  <td 
                    className="px-6 py-4 text-sm" 
                    style={{ 
                      color: 'white', 
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)'
                    }}
                  >
                    {player.name}
                  </td>
                  <td 
                    className="px-6 py-4 text-sm" 
                    style={{ 
                      color: 'white', 
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)'
                    }}
                  >
                    {player.pin}
                  </td>
                  <td 
                    className="px-6 py-4 text-sm" 
                    style={{ 
                      color: 'white', 
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      backgroundColor: 'rgba(168, 85, 247, 0.1)',
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)'
                    }}
                  >
                    {COUNTRY_NAMES[player.country as keyof typeof COUNTRY_NAMES]}
                  </td>
                  <td 
                    className="px-6 py-4 text-sm" 
                    style={{ 
                      color: 'white', 
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      backgroundColor: 'rgba(251, 146, 60, 0.1)',
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)'
                    }}
                  >
                    {ARCHETYPE_NAMES[player.archetype as keyof typeof ARCHETYPE_NAMES]}
                  </td>
                  <td 
                    className="px-6 py-4 text-sm text-right" 
                    style={{ 
                      gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)'
                    }}
                  >
                    <button
                      onClick={() => handleEdit(player)}
                      className="button-component button-edit"
                      style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(player.id, player.name)}
                      className="button-component button-delete"
                      style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
