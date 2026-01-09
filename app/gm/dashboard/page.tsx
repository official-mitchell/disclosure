import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import ViewAsPlayerSelector from '@/components/ViewAsPlayerSelector';

export default async function GMDashboard() {
  const session = await getGMSession();

  if (!session) {
    redirect('/gm/login');
  }

  const players = await prisma.player.findMany({
    orderBy: { name: 'asc' },
  });

  const cluesCount = await prisma.clue.count();
  const releasedCount = await prisma.clue.count({ where: { released: true, retracted: false } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs font-medium">
                GM
              </div>
              <h1 className="text-xl font-bold text-white">
                Game Master Control Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ViewAsPlayerSelector players={players} />
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Total Players</div>
            <div className="text-3xl font-bold text-white">{players.length}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Total Clues</div>
            <div className="text-3xl font-bold text-white">{cluesCount}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Released Clues</div>
            <div className="text-3xl font-bold text-white">{releasedCount}</div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/gm/players">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Player Management
                  </h3>
                  <p className="text-gray-400">
                    View and manage players, edit details
                  </p>
                </div>
                <svg
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/gm/clues">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Clue Management
                  </h3>
                  <p className="text-gray-400">
                    Create, edit, and release clues
                  </p>
                </div>
                <svg
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Getting Started */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-100 mb-3">
            Getting Started
          </h3>
          <ol className="space-y-2 text-blue-200">
            <li>1. Add players to the system (Player Management)</li>
            <li>2. Create clues for each phase (Clue Management)</li>
            <li>3. Release clues to players during gameplay</li>
            <li>4. Use "View as Player" to verify what players see</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
