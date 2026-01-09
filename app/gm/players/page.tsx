import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import PlayerManagement from '@/components/PlayerManagement';

export default async function GMPlayersPage() {
  const session = await getGMSession();
  if (!session) redirect('/gm/login');

  const players = await prisma.player.findMany({
    orderBy: [{ country: 'asc' }, { name: 'asc' }],
    include: {
      character: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
  });

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
              <h1 className="text-xl font-bold text-white">Player Management</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlayerManagement initialPlayers={players} />
      </main>
    </div>
  );
}
