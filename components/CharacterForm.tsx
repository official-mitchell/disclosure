'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Motivation {
  label: string;
  description: string;
}

interface CharacterFormData {
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  publicReputation: string;
  portraitUrl: string;
  archetypeTitle: string;
  permissions: string[];
  restrictions: string[];
  backstory: string;
  motivations: Motivation[];
  formalAuthority: string;
  informalFears: string;
  safelyIgnore: string;
  exposureConsequences: string;
  privateWant: string;
  disclosureBelief: string;
  canDiscuss: string[];
  mustConceal: string[];
}

interface CharacterFormProps {
  playerId: string;
  playerName: string;
  initialData?: Partial<CharacterFormData>;
}

export default function CharacterForm({
  playerId,
  playerName,
  initialData,
}: CharacterFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CharacterFormData>({
    displayName: initialData?.displayName || '',
    nationalityBloc: initialData?.nationalityBloc || '',
    occupation: initialData?.occupation || '',
    publicReputation: initialData?.publicReputation || '',
    portraitUrl: initialData?.portraitUrl || '',
    archetypeTitle: initialData?.archetypeTitle || '',
    permissions: initialData?.permissions || [''],
    restrictions: initialData?.restrictions || [''],
    backstory: initialData?.backstory || '',
    motivations: initialData?.motivations || [{ label: '', description: '' }],
    formalAuthority: initialData?.formalAuthority || '',
    informalFears: initialData?.informalFears || '',
    safelyIgnore: initialData?.safelyIgnore || '',
    exposureConsequences: initialData?.exposureConsequences || '',
    privateWant: initialData?.privateWant || '',
    disclosureBelief: initialData?.disclosureBelief || '',
    canDiscuss: initialData?.canDiscuss || [''],
    mustConceal: initialData?.mustConceal || [''],
  });

  const handleArrayChange = (
    field: keyof CharacterFormData,
    index: number,
    value: string
  ) => {
    const array = [...(formData[field] as string[])];
    array[index] = value;
    setFormData({ ...formData, [field]: array });
  };

  const addArrayItem = (field: keyof CharacterFormData) => {
    const array = [...(formData[field] as string[])];
    array.push('');
    setFormData({ ...formData, [field]: array });
  };

  const removeArrayItem = (field: keyof CharacterFormData, index: number) => {
    const array = [...(formData[field] as string[])];
    array.splice(index, 1);
    setFormData({ ...formData, [field]: array });
  };

  const handleMotivationChange = (
    index: number,
    field: 'label' | 'description',
    value: string
  ) => {
    const motivations = [...formData.motivations];
    motivations[index][field] = value;
    setFormData({ ...formData, motivations });
  };

  const addMotivation = () => {
    setFormData({
      ...formData,
      motivations: [...formData.motivations, { label: '', description: '' }],
    });
  };

  const removeMotivation = (index: number) => {
    const motivations = [...formData.motivations];
    motivations.splice(index, 1);
    setFormData({ ...formData, motivations });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        permissions: formData.permissions.filter((p) => p.trim()),
        restrictions: formData.restrictions.filter((r) => r.trim()),
        canDiscuss: formData.canDiscuss.filter((c) => c.trim()),
        mustConceal: formData.mustConceal.filter((m) => m.trim()),
        motivations: formData.motivations.filter(
          (m) => m.label.trim() || m.description.trim()
        ),
      };

      const response = await fetch(`/api/gm/players/${playerId}/dossier`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error('Failed to save character');
      }

      router.push(`/gm/players/${playerId}/dossier`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Character for: {playerName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nationality Bloc
            </label>
            <input
              type="text"
              value={formData.nationalityBloc}
              onChange={(e) =>
                setFormData({ ...formData, nationalityBloc: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Occupation
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) =>
                setFormData({ ...formData, occupation: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Public Reputation
            </label>
            <textarea
              value={formData.publicReputation}
              onChange={(e) =>
                setFormData({ ...formData, publicReputation: e.target.value })
              }
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Portrait URL (optional)
            </label>
            <input
              type="text"
              value={formData.portraitUrl}
              onChange={(e) =>
                setFormData({ ...formData, portraitUrl: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 1: Permissions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 1: Clearance & Permissions
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Archetype Title
          </label>
          <input
            type="text"
            value={formData.archetypeTitle}
            onChange={(e) =>
              setFormData({ ...formData, archetypeTitle: e.target.value })
            }
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Permissions
          </label>
          {formData.permissions.map((permission, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={permission}
                onChange={(e) =>
                  handleArrayChange('permissions', index, e.target.value)
                }
                className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('permissions', index)}
                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('permissions')}
            className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            Add Permission
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Restrictions
          </label>
          {formData.restrictions.map((restriction, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={restriction}
                onChange={(e) =>
                  handleArrayChange('restrictions', index, e.target.value)
                }
                className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('restrictions', index)}
                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('restrictions')}
            className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            Add Restriction
          </button>
        </div>
      </div>

      {/* Section 2: Backstory */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 2: Background
        </h3>
        <textarea
          value={formData.backstory}
          onChange={(e) =>
            setFormData({ ...formData, backstory: e.target.value })
          }
          rows={6}
          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
          required
        />
      </div>

      {/* Section 3: Motivations */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 3: Motivations
        </h3>
        {formData.motivations.map((motivation, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-900 rounded">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">
                Motivation {index + 1}
              </label>
              <button
                type="button"
                onClick={() => removeMotivation(index)}
                className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              placeholder="Label (e.g., Legacy, Health)"
              value={motivation.label}
              onChange={(e) =>
                handleMotivationChange(index, 'label', e.target.value)
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white mb-2"
            />
            <textarea
              placeholder="Description"
              value={motivation.description}
              onChange={(e) =>
                handleMotivationChange(index, 'description', e.target.value)
              }
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMotivation}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
        >
          Add Motivation
        </button>
      </div>

      {/* Section 4: Authority */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 4: Chain of Command
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Formal Authority
            </label>
            <input
              type="text"
              value={formData.formalAuthority}
              onChange={(e) =>
                setFormData({ ...formData, formalAuthority: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Informal Fears
            </label>
            <input
              type="text"
              value={formData.informalFears}
              onChange={(e) =>
                setFormData({ ...formData, informalFears: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Safely Ignore
            </label>
            <input
              type="text"
              value={formData.safelyIgnore}
              onChange={(e) =>
                setFormData({ ...formData, safelyIgnore: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 5: Exposure */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 5: Exposure Risk
        </h3>
        <textarea
          value={formData.exposureConsequences}
          onChange={(e) =>
            setFormData({ ...formData, exposureConsequences: e.target.value })
          }
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
          required
        />
      </div>

      {/* Section 6: Private Want */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 6: Private Objectives
        </h3>
        <textarea
          value={formData.privateWant}
          onChange={(e) =>
            setFormData({ ...formData, privateWant: e.target.value })
          }
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
          required
        />
      </div>

      {/* Section 7: Disclosure */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 7: Disclosure Belief
        </h3>
        <textarea
          value={formData.disclosureBelief}
          onChange={(e) =>
            setFormData({ ...formData, disclosureBelief: e.target.value })
          }
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Their philosophy on disclosure (shown as a quote)"
          required
        />
      </div>

      {/* Section 8: Boundaries */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Section 8: Operational Boundaries
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Can Discuss
          </label>
          {formData.canDiscuss.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange('canDiscuss', index, e.target.value)
                }
                className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('canDiscuss', index)}
                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('canDiscuss')}
            className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            Add Item
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Must Conceal
          </label>
          {formData.mustConceal.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange('mustConceal', index, e.target.value)
                }
                className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('mustConceal', index)}
                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('mustConceal')}
            className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white rounded font-semibold"
        >
          {saving ? 'Saving...' : 'Save Character'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
