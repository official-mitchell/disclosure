import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import Link from 'next/link';

export default async function GMPlayersPage() {
  const session = await getGMSession();

  if (!session) {
    redirect('/gm/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/gm/dashboard" className="text-gray-400 hover:text-white transition">
                ← Back
              </Link>
              <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs font-medium">
                GM
              </div>
              <h1 className="text-xl font-bold text-white">
                Player Management
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            Player Management Coming Soon
          </h2>
          <p className="text-gray-400 mb-6">
            This feature will be implemented in Phase 5
          </p>
          <Link
            href="/gm/dashboard"
            className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
