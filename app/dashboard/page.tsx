import { redirect } from 'next/navigation';
import { getPlayerSession } from '@/lib/auth';
import { COUNTRY_NAMES, ARCHETYPE_NAMES } from '@/lib/constants';
import CluesDisplay from '@/components/CluesDisplay';
import Link from 'next/link';

export default async function PlayerDashboard() {
  const session = await getPlayerSession();

  if (!session) {
    redirect('/login');
  }

  const countryName = COUNTRY_NAMES[session.country as keyof typeof COUNTRY_NAMES];
  const archetypeName = ARCHETYPE_NAMES[session.archetype as keyof typeof ARCHETYPE_NAMES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">
                Catastrophic Disclosure
              </h1>
              <Link
                href="/dashboard"
                className="text-white border-b-2 border-blue-500 text-sm font-semibold pb-1"
              >
                Intelligence
              </Link>
              <Link
                href="/dashboard/dossier"
                className="text-gray-300 hover:text-white transition text-sm"
              >
                Dossier
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {session.name}
              </span>
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
        {/* Connection Confirmed Banner */}
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-400"
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
                <h2 className="text-lg font-semibold text-green-100">
                  Connection Confirmed!
                </h2>
                <p className="text-green-200 mt-1">
                  You are <span className="font-bold">{session.name}</span>,{' '}
                  <span className="font-bold">{archetypeName}</span>,{' '}
                  <span className="font-bold">{countryName}</span>
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/dossier"
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
            >
              View Dossier
            </Link>
          </div>
        </div>

        {/* Clues Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Your Intelligence</h2>
          <CluesDisplay />
        </div>

        {/* Info Footer */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400 text-center">
            This dashboard auto-refreshes every 15 seconds. New intelligence will appear automatically.
          </p>
        </div>
      </main>
    </div>
  );
}
