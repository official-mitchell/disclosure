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
    <div className="space-y-6">
      {/* Add Player Button */}
      {!showAddForm && !editingId && (
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Player
          </button>
          <Link
            href="/gm/import/characters"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Bulk Import Characters
          </Link>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Player' : 'Add New Player'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">PIN</label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
                >
                  {Object.keys(COUNTRIES).map((c) => (
                    <option key={c} value={c}>{COUNTRY_NAMES[c as keyof typeof COUNTRY_NAMES]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Archetype</label>
                <select
                  value={formData.archetype}
                  onChange={(e) => setFormData({ ...formData, archetype: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
                >
                  {Object.keys(ARCHETYPES).map((a) => (
                    <option key={a} value={a}>{ARCHETYPE_NAMES[a as keyof typeof ARCHETYPE_NAMES]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Add Player'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Player List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            Players ({initialPlayers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">PIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Archetype</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Character</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {initialPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm text-white">{player.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{player.pin}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {COUNTRY_NAMES[player.country as keyof typeof COUNTRY_NAMES]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {ARCHETYPE_NAMES[player.archetype as keyof typeof ARCHETYPE_NAMES]}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {player.character ? (
                      <Link
                        href={`/gm/players/${player.id}/dossier`}
                        className="text-green-400 hover:text-green-300 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {player.character.displayName}
                      </Link>
                    ) : (
                      <Link
                        href={`/gm/players/${player.id}/dossier/edit`}
                        className="text-yellow-400 hover:text-yellow-300 text-xs"
                      >
                        + Create
                      </Link>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(player.id, player.name)}
                      className="text-red-400 hover:text-red-300"
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
