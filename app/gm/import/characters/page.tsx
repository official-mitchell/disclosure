'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportCharactersPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const response = await fetch('/api/gm/import/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import characters');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">
                GM: Import Characters
              </h1>
              <Link
                href="/gm/players"
                className="text-gray-300 hover:text-white transition text-sm"
              >
                ← Back to Players
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Bulk Character Import
          </h2>
          <p className="text-gray-300 mb-6">
            Upload a JSON file containing character data for all players. The
            system will create or update character dossiers based on player
            names.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-700 file:text-white
                  hover:file:bg-blue-600
                  cursor-pointer"
              />
            </div>

            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="px-6 py-3 bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white rounded font-semibold"
            >
              {importing ? 'Importing...' : 'Import Characters'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-900/50 border border-red-700 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {results && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-100 mb-2">
                  Import Complete
                </h3>
                <p className="text-green-200">
                  Successfully imported: {results.imported} characters
                </p>
                {results.failed > 0 && (
                  <p className="text-yellow-200 mt-1">
                    Failed: {results.failed} characters
                  </p>
                )}
              </div>

              {results.results.success.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-300 mb-2">
                    Successfully Imported:
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {results.results.success.map((name: string, i: number) => (
                      <li key={i}>✓ {name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {results.results.errors.length > 0 && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-red-300 mb-2">
                    Errors:
                  </h4>
                  <ul className="text-sm text-red-400 space-y-1">
                    {results.results.errors.map(
                      (err: { playerName: string; error: string }, i: number) => (
                        <li key={i}>
                          ✗ {err.playerName}: {err.error}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <Link
                href="/gm/players"
                className="inline-block px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
              >
                View Players
              </Link>
            </div>
          )}
        </div>

        {/* Example JSON Format */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Expected JSON Format
          </h3>
          <pre className="bg-gray-900 border border-gray-600 rounded p-4 text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(
              {
                characters: [
                  {
                    playerName: 'Oscar',
                    displayName: 'Dr. Oscar Morozov',
                    nationalityBloc: 'Russia',
                    occupation:
                      'Senior Materials Scientist, Energia — State Aerospace Lab',
                    publicReputation: 'Brilliant, erratic, stubborn...',
                    archetypeTitle: 'Ranking Scientist Tech Lead',
                    permissions: [
                      'Authenticate or debunk evidence',
                      'Can be elevated into political position',
                    ],
                    restrictions: [
                      'Assume your clues are being spied upon',
                      'Your credibility is fragile',
                    ],
                    backstory: 'You were raised on the streets...',
                    motivations: [
                      {
                        label: 'Legacy',
                        description: 'You want your work to matter...',
                      },
                    ],
                    formalAuthority: 'The Ministry of Defense',
                    informalFears: 'The CIA and the GRU',
                    safelyIgnore: 'Journalists',
                    exposureConsequences: 'You would lose lab access...',
                    privateWant: 'You want international collaboration...',
                    disclosureBelief:
                      "I don't have all the pieces to the puzzle...",
                    canDiscuss: ['Anomalous material properties'],
                    mustConceal: ['Non-terrestrial manufacturing signatures'],
                  },
                ],
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    </div>
  );
}
