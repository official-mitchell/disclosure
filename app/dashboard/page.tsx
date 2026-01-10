// Player Dashboard Page
// Changes:
// - Updated: Replaced archetype display with occupation (covertOccupation if available, otherwise occupation)
import { redirect } from 'next/navigation';
import { getPlayerSession } from '@/lib/auth';
import { COUNTRY_NAMES } from '@/lib/constants';
import { prisma } from '@/lib/db';
import CluesDisplay from '@/components/CluesDisplay';
import Link from 'next/link';

export default async function PlayerDashboard() {
  const session = await getPlayerSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch character to get occupation
  const character = await prisma.character.findUnique({
    where: {
      playerId: session.playerId,
    },
    select: {
      occupation: true,
      covertOccupation: true,
    },
  });

  const countryName = COUNTRY_NAMES[session.country as keyof typeof COUNTRY_NAMES] || session.country;
  // Use covertOccupation if available, otherwise use occupation
  const occupationDisplay = character?.covertOccupation || character?.occupation || 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      {/* Logo and Title Section - Centered */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto dynamic-padding-sm">
          <div className="flex flex-col items-center" style={{ paddingTop: 'clamp(0.85rem, 2.55vw, 1.275rem)', paddingBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="flex justify-center mb-2">
              <img
                src="/Catastrophic Disclosure icon.png"
                alt="Icon"
                className="flex-shrink-0"
                style={{ 
                  width: 'clamp(4.8rem, 14vw, 7.2rem)', 
                  height: 'clamp(4.8rem, 14vw, 7.2rem)',
                  minWidth: '76px',
                  maxWidth: '115px'
                }}
              />
            </div>
            <h1 className="dynamic-text-xl font-bold text-center" style={{ color: 'white' }}>
              Catastrophic Disclosure
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Links Row */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto dynamic-padding-sm">
          <div className="flex justify-between items-center" style={{ paddingTop: 'clamp(0.75rem, 2vw, 1rem)', paddingBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(1rem, 3vw, 2rem)' }}>
              <Link
                href="/dashboard"
                className="dynamic-text-base font-semibold pb-1"
                style={{ color: 'white', borderBottom: '2px solid #3b82f6' }}
              >
                Intelligence
              </Link>
              <Link
                href="/dashboard/dossier"
                className="dynamic-text-base transition hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Dossier
              </Link>
            </div>
            <div className="flex items-center" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <span className="dynamic-text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {session.name}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="logout-button dynamic-text-base"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        <div className="max-w-7xl mx-auto dynamic-padding" style={{ paddingTop: 'clamp(1.5rem, 4vw, 2rem)', paddingBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
        {/* Connection Confirmed Banner */}
        <div className="bg-green-900/50 border border-green-700 rounded-lg dynamic-card-padding card-container" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <div className="flex items-center justify-between" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <div className="flex-shrink-0">
                <svg
                  className="text-green-400"
                  style={{ width: 'clamp(1.5rem, 4vw, 2rem)', height: 'clamp(1.5rem, 4vw, 2rem)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="dynamic-text-lg font-semibold" style={{ color: '#d1fae5' }}>
                  Connection Confirmed!
                </h2>
                <p className="dynamic-text-base mt-1" style={{ color: '#a7f3d0' }}>
                  You are <span className="font-bold">{session.name}</span>,{' '}
                  <span className="font-bold">{occupationDisplay}</span>,{' '}
                  <span className="font-bold">{countryName}</span>
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/dossier"
              className="form-button form-button-secondary"
              style={{ width: 'auto', minWidth: 'clamp(120px, 20vw, 160px)' }}
            >
              View Dossier
            </Link>
          </div>
        </div>

        {/* Clues Section */}
        <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <h2 className="dynamic-text-2xl font-bold mb-6 text-center" style={{ color: 'white' }}>Your Intelligence</h2>
          <CluesDisplay />
        </div>

        {/* Info Footer */}
        <div className="bg-gray-800 rounded-lg dynamic-card-padding card-container">
          <p className="dynamic-text-base text-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            This dashboard auto-refreshes every 15 seconds. New intelligence will appear automatically.
          </p>
        </div>
        </div>
      </main>
    </div>
  );
}
