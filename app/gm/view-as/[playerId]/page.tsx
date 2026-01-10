import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { COUNTRY_NAMES, ARCHETYPE_NAMES } from '@/lib/constants';
import ClueCard from '@/components/ClueCard';

export default async function ViewAsPlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
  const session = await getGMSession();
  if (!session) redirect('/gm/login');

  const { playerId } = await params;
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    return <div>Player not found</div>;
  }

  // Fetch visible clues for this player (same logic as player API)
  const clues = await prisma.clue.findMany({
    where: {
      released: true,
      retracted: false,
      OR: [
        // Target all (all target fields are null/empty)
        {
          targetCountry: null,
          targetArchetypes: { isEmpty: true },
          targetDemeanor: null,
          targetPlayer: null,
        },
        // Target specific player OR assigned to player
        {
          OR: [
            { targetPlayer: player.id },
            {
              clueAssignments: {
                some: {
                  playerId: player.id,
                },
              },
            },
          ],
        },
        // Target with country and/or archetype filters
        // This requires ALL specified filters to match (AND logic)
        {
          AND: [
            // If targetCountry is set, must match player's country
            {
              OR: [
                { targetCountry: null },
                { targetCountry: player.country as any },
              ],
            },
            // If targetArchetypes is set, must include player's archetype
            {
              OR: [
                { targetArchetypes: { isEmpty: true } },
                { targetArchetypes: { has: player.archetype as any } },
              ],
            },
            // If targetDemeanor is set, must match player's demeanor
            {
              OR: [
                { targetDemeanor: null },
                { targetDemeanor: player.demeanor as any },
              ],
            },
          ],
        },
      ],
    },
    orderBy: { releasedAt: 'desc' },
  });

  const countryName = COUNTRY_NAMES[player.country as keyof typeof COUNTRY_NAMES];
  const archetypeName = ARCHETYPE_NAMES[player.archetype as keyof typeof ARCHETYPE_NAMES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/gm/dashboard" className="text-gray-400 hover:text-white transition">
                ← Back to GM
              </Link>
              <div className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded text-xs font-medium">
                VIEWING AS PLAYER
              </div>
              <h1 className="text-xl font-bold text-white">
                {player.name}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-yellow-100">
                GM View
              </h2>
              <p className="text-yellow-200 mt-1">
                Viewing as: <span className="font-bold">{player.name}</span>,{' '}
                <span className="font-bold">{archetypeName}</span>,{' '}
                <span className="font-bold">{countryName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Intelligence Visible to {player.name} ({clues.length})
          </h2>
          {clues.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <p className="text-gray-400">No clues visible to this player yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {clues.map((clue) => (
                <ClueCard key={clue.id} clue={clue} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
