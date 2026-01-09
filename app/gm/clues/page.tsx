import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import ReleaseControls from '@/components/ReleaseControls';
import PhaseReleaseButton from '@/components/PhaseReleaseButton';

export default async function GMCluesPage() {
  const session = await getGMSession();
  if (!session) redirect('/gm/login');

  const clues = await prisma.clue.findMany({
    orderBy: [{ phase: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { clueAssignments: true } },
    },
  });

  const cluesByPhase = clues.reduce((acc, clue) => {
    if (!acc[clue.phase]) acc[clue.phase] = [];
    acc[clue.phase].push(clue);
    return acc;
  }, {} as Record<number, typeof clues>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/gm/dashboard" className="text-gray-400 hover:text-white transition">
                ← Back
              </Link>
              <img
                src="/Catastrophic Disclosure icon.png"
                alt="Icon"
                className="w-8 h-8"
              />
              <div className="bg-amber-700 text-amber-200 px-3 py-1 rounded text-xs font-medium">
                GM
              </div>
              <h1 className="text-xl font-bold text-white">Clue Management</h1>
            </div>
            <Link
              href="/gm/clues/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Clue
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clues.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              No Clues Yet
            </h2>
            <p className="text-gray-400 mb-6">
              Create your first clue to get started
            </p>
            <Link
              href="/gm/clues/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create First Clue
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((phase) => {
              const phaseClues = cluesByPhase[phase] || [];
              if (phaseClues.length === 0) return null;

              const unreleasedCount = phaseClues.filter(c => !c.released).length;

              return (
                <div key={phase} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">
                      Phase {phase} ({phaseClues.length} {phaseClues.length === 1 ? 'clue' : 'clues'})
                    </h2>
                    <PhaseReleaseButton phase={phase} unreleasedCount={unreleasedCount} />
                  </div>
                  <div className="divide-y divide-gray-700">
                    {phaseClues.map((clue) => (
                      <div key={clue.id} className="p-6 hover:bg-gray-750 transition">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {clue.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <span className="text-gray-400">
                                Target: <span className="text-gray-300">{clue.targetType}</span>
                                {clue.targetValue && ` (${clue.targetValue})`}
                              </span>
                              <span className="text-gray-400">
                                Origin: <span className="text-gray-300">{clue.originCountry}</span>
                              </span>
                              {clue.released && (
                                <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded">
                                  Released
                                </span>
                              )}
                              {clue.retracted && (
                                <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded">
                                  Retracted
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <ReleaseControls
                              clueId={clue.id}
                              released={clue.released}
                              retracted={clue.retracted}
                            />
                            <Link
                              href={`/gm/clues/${clue.id}/edit`}
                              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition text-sm"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
