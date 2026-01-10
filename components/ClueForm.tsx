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

  // Convert new schema fields to targetType/targetValue for form
  const getTargetTypeAndValue = () => {
    if (clue?.targetCountry) {
      return { targetType: 'country', targetValue: clue.targetCountry };
    } else if (clue?.targetArchetype) {
      return { targetType: 'archetype', targetValue: clue.targetArchetype };
    } else if (clue?.targetDemeanor) {
      return { targetType: 'demeanor', targetValue: clue.targetDemeanor };
    } else if (clue?.targetPlayer) {
      return { targetType: 'player', targetValue: clue.targetPlayer };
    }
    return { targetType: 'all', targetValue: '' };
  };

  const { targetType, targetValue } = getTargetTypeAndValue();

  const [formData, setFormData] = useState({
    title: clue?.title || '',
    phase: clue?.phase || 1,
    targetType,
    targetValue,
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
    <form onSubmit={handleSubmit} style={{ gap: 'clamp(1.5rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
      {error && (
        <div className="bg-red-900/50 border border-red-700 px-4 py-3 rounded" style={{ color: '#ef4444' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <div className="col-span-2 form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="form-input form-input-dark"
          />
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Phase</label>
          <select
            value={formData.phase}
            onChange={(e) => setFormData({ ...formData, phase: parseInt(e.target.value) })}
            className="form-input form-input-dark"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>Phase {p}</option>
            ))}
          </select>
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Target Type</label>
          <select
            value={formData.targetType}
            onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any })}
            className="form-input form-input-dark"
          >
            <option value="all">All Players</option>
            <option value="country">Country</option>
            <option value="archetype">Archetype</option>
            <option value="demeanor">Demeanor</option>
            <option value="player">Specific Player</option>
          </select>
        </div>

        {formData.targetType === 'country' && (
          <div className="col-span-2 form-spacing">
            <label className="form-label" style={{ color: 'white' }}>Target Country</label>
            <select
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              className="form-input form-input-dark"
            >
              <option value="">Select...</option>
              {Object.keys(COUNTRIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {formData.targetType === 'archetype' && (
          <div className="col-span-2 form-spacing">
            <label className="form-label" style={{ color: 'white' }}>Target Archetype</label>
            <select
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              className="form-input form-input-dark"
            >
              <option value="">Select...</option>
              {Object.keys(ARCHETYPES).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        )}

        {formData.targetType === 'demeanor' && (
          <div className="col-span-2 form-spacing">
            <label className="form-label" style={{ color: 'white' }}>Target Demeanor</label>
            <select
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              className="form-input form-input-dark"
            >
              <option value="">Select...</option>
              <option value="ANTI_DISCLOSURE">Anti-Disclosure</option>
              <option value="AGNOSTIC">Agnostic</option>
              <option value="PRO_DISCLOSURE">Pro-Disclosure</option>
            </select>
          </div>
        )}

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Legitimacy</label>
          <select
            value={formData.legitimacy}
            onChange={(e) => setFormData({ ...formData, legitimacy: e.target.value as any })}
            className="form-input form-input-dark"
          >
            <option value="verified">Verified</option>
            <option value="suspected">Suspected</option>
            <option value="fabricated">Fabricated</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Confidentiality</label>
          <select
            value={formData.confidentiality}
            onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as any })}
            className="form-input form-input-dark"
          >
            <option value="top_secret">Top Secret</option>
            <option value="confidential">Confidential</option>
            <option value="shareable_if_pressed">Shareable If Pressed</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Origin Country</label>
          <select
            value={formData.originCountry}
            onChange={(e) => setFormData({ ...formData, originCountry: e.target.value as any })}
            className="form-input form-input-dark"
          >
            {ORIGIN_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Event Date</label>
          <input
            type="text"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            placeholder="e.g., March 14, 1962"
            required
            className="form-input form-input-dark"
          />
        </div>

        <div className="col-span-2 form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Backstory</label>
          <textarea
            value={formData.backstory}
            onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
            rows={4}
            required
            className="form-input form-input-dark"
            style={{ minHeight: 'clamp(6rem, 15vw, 10rem)' }}
          />
        </div>

        <div className="col-span-2 form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Image URL (optional)</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="form-input form-input-dark"
          />
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Confidence Level</label>
          <select
            value={formData.confidenceLevel}
            onChange={(e) => setFormData({ ...formData, confidenceLevel: e.target.value as any })}
            className="form-input form-input-dark"
          >
            <option value="confirmed">Confirmed</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div className="form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Source</label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., CIA Station Chief - Berlin"
            required
            className="form-input form-input-dark"
          />
        </div>

        <div className="col-span-2 form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Supporting Intel</label>
          <textarea
            value={formData.supportingIntel}
            onChange={(e) => setFormData({ ...formData, supportingIntel: e.target.value })}
            rows={3}
            required
            className="form-input form-input-dark"
            style={{ minHeight: 'clamp(5rem, 12vw, 8rem)' }}
            placeholder="Supports markdown formatting: **bold**, *italic*, line breaks"
          />
        </div>

        <div className="col-span-2 form-spacing">
          <label className="form-label" style={{ color: 'white' }}>Takeaways (one per line)</label>
          <textarea
            value={formData.takeaways}
            onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
            rows={4}
            placeholder="Enter each takeaway on a new line"
            required
            className="form-input form-input-dark"
            style={{ minHeight: 'clamp(6rem, 15vw, 10rem)' }}
          />
        </div>
      </div>

      <div className="flex" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)', marginTop: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <button
          type="submit"
          disabled={loading}
          className="form-button form-button-secondary"
          style={{ width: 'auto', flex: '1' }}
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Clue' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="nav-button"
          style={{ width: 'auto', flex: '1' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
