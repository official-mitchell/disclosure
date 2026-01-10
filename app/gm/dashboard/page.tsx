// GM Dashboard Page
// Changes:
// - 2024-12-XX: Improved mobile responsiveness - reduced icon sizes on mobile, improved navigation bar layout for small screens, adjusted card layouts and spacing for better mobile experience
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto dynamic-padding-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center dynamic-gap-sm py-3 sm:py-0 h-auto sm:h-16">
            <div className="flex items-center flex-wrap justify-center sm:justify-start w-full sm:w-auto" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
              <div className="flex justify-center w-full sm:w-auto">
                <img
                  src="/Catastrophic Disclosure icon.png"
                  alt="Icon"
                  className="flex-shrink-0"
                  style={{ 
                    width: 'clamp(4rem, 12vw, 6rem)', 
                    height: 'clamp(4rem, 12vw, 6rem)',
                    minWidth: '64px',
                    maxWidth: '96px'
                  }}
                />
              </div>
              <h1 className="dynamic-text-base font-bold" style={{ color: 'white' }}>
                Game Master Control Panel
              </h1>
            </div>
            <div className="flex items-center w-full sm:w-auto justify-end" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
              <ViewAsPlayerSelector players={players} />
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="logout-button"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto dynamic-padding" style={{ paddingTop: 'clamp(1.5rem, 4vw, 2rem)', paddingBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
        {/* Quick Stats */}
        <div className="flex flex-wrap justify-start items-stretch" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <div className="bg-gray-800 rounded-lg dynamic-card-padding" style={{ flex: '1 1 auto', minWidth: 'clamp(150px, 25vw, 200px)', maxWidth: 'clamp(200px, 30vw, 250px)', border: '2px solid white' }}>
            <div className="mb-2" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'white' }}>Total Players</div>
            <div className="dynamic-text-xl font-bold" style={{ color: 'white' }}>{players.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg dynamic-card-padding" style={{ flex: '1 1 auto', minWidth: 'clamp(150px, 25vw, 200px)', maxWidth: 'clamp(200px, 30vw, 250px)', border: '2px solid white' }}>
            <div className="mb-2" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'white' }}>Total Clues</div>
            <div className="dynamic-text-xl font-bold" style={{ color: 'white' }}>{cluesCount}</div>
          </div>
          <div className="bg-gray-800 rounded-lg dynamic-card-padding" style={{ flex: '1 1 auto', minWidth: 'clamp(150px, 25vw, 200px)', maxWidth: 'clamp(200px, 30vw, 250px)', border: '2px solid white' }}>
            <div className="mb-2" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'white' }}>Released Clues</div>
            <div className="dynamic-text-xl font-bold" style={{ color: 'white' }}>{releasedCount}</div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 dynamic-gap-sm" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <div className="bg-gray-800 rounded-lg dynamic-card-padding" style={{ border: '2px solid white' }}>
            <div className="flex items-start sm:items-center justify-between mb-4" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <div className="flex-1 min-w-0">
                <h3 className="dynamic-text-lg font-bold" style={{ color: 'white', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                  Player Management
                </h3>
                <p className="dynamic-text-base" style={{ color: 'white' }}>
                  View and manage players, edit details
                </p>
              </div>
              <svg
                className="flex-shrink-0"
                style={{ width: 'clamp(1.25rem, 4vw, 2rem)', height: 'clamp(1.25rem, 4vw, 2rem)', color: 'white' }}
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
            <Link href="/gm/players" className="block">
              <button type="button" className="nav-button">
                Go to Player Management
              </button>
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg dynamic-card-padding" style={{ border: '2px solid white' }}>
            <div className="flex items-start sm:items-center justify-between mb-4" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <div className="flex-1 min-w-0">
                <h3 className="dynamic-text-lg font-bold" style={{ color: 'white', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                  Clue Management
                </h3>
                <p className="dynamic-text-base" style={{ color: 'white' }}>
                  Create, edit, and release clues
                </p>
              </div>
              <svg
                className="flex-shrink-0"
                style={{ width: 'clamp(1.25rem, 4vw, 2rem)', height: 'clamp(1.25rem, 4vw, 2rem)', color: 'white' }}
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
            <Link href="/gm/clues" className="block">
              <button type="button" className="nav-button">
                Go to Clue Management
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
