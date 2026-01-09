'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clue } from '@prisma/client';
import { COUNTRIES, ARCHETYPES, ORIGIN_COUNTRIES } from '@/lib/constants';

interface ClueFormProps {
  clue?: Clue;
  mode: 'create' | 'edit';
}

export default function ClueForm({ clue, mode }: ClueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: clue?.title || '',
    phase: clue?.phase || 1,
    targetType: clue?.targetType || 'all',
    targetValue: clue?.targetValue || '',
    legitimacy: clue?.legitimacy || 'unknown',
    confidentiality: clue?.confidentiality || 'confidential',
    originCountry: clue?.originCountry || 'US',
    eventDate: clue?.eventDate || '',
    backstory: clue?.backstory || '',
    imageUrl: clue?.imageUrl || '',
    confidenceLevel: clue?.confidenceLevel || 'medium',
    supportingIntel: clue?.supportingIntel || '',
    source: clue?.source || '',
    takeaways: clue?.takeaways?.join('\n') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = mode === 'create' ? '/api/gm/clues' : `/api/gm/clues/${clue?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          takeaways: formData.takeaways.split('\n').filter((t) => t.trim()),
        }),
      });

      if (!response.ok) throw new Error('Failed to save clue');

      router.push('/gm/clues');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phase</label>
          <select
            value={formData.phase}
            onChange={(e) => setFormData({ ...formData, phase: parseInt(e.target.value) })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>Phase {p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Type</label>
          <select
            value={formData.targetType}
            onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          >
            <option value="all">All Players</option>
            <option value="country">Country</option>
            <option value="archetype">Archetype</option>
            <option value="player">Specific Player</option>
          </select>
        </div>

        {formData.targetType === 'country' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Country</label>
            <select
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
            >
              <option value="">Select...</option>
              {Object.keys(COUNTRIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {formData.targetType === 'archetype' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Archetype</label>
            <select
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
            >
              <option value="">Select...</option>
              {Object.keys(ARCHETYPES).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Legitimacy</label>
          <select
            value={formData.legitimacy}
            onChange={(e) => setFormData({ ...formData, legitimacy: e.target.value as any })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          >
            <option value="verified">Verified</option>
            <option value="suspected">Suspected</option>
            <option value="fabricated">Fabricated</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confidentiality</label>
          <select
            value={formData.confidentiality}
            onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as any })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          >
            <option value="top_secret">Top Secret</option>
            <option value="confidential">Confidential</option>
            <option value="shareable_if_pressed">Shareable If Pressed</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Origin Country</label>
          <select
            value={formData.originCountry}
            onChange={(e) => setFormData({ ...formData, originCountry: e.target.value as any })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          >
            {ORIGIN_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Event Date</label>
          <input
            type="text"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            placeholder="e.g., March 14, 1962"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Backstory</label>
          <textarea
            value={formData.backstory}
            onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
            rows={4}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confidence Level</label>
          <select
            value={formData.confidenceLevel}
            onChange={(e) => setFormData({ ...formData, confidenceLevel: e.target.value as any })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          >
            <option value="confirmed">Confirmed</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., CIA Station Chief - Berlin"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Supporting Intel</label>
          <textarea
            value={formData.supportingIntel}
            onChange={(e) => setFormData({ ...formData, supportingIntel: e.target.value })}
            rows={3}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Takeaways (one per line)</label>
          <textarea
            value={formData.takeaways}
            onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
            rows={4}
            placeholder="Enter each takeaway on a new line"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Clue' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
