import { redirect } from 'next/navigation';
import { getPlayerSession } from '@/lib/auth';
import DossierPage from '@/components/dossier/DossierPage';
import Link from 'next/link';

export default async function DossierRoute() {
  const session = await getPlayerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #3d2820 0%, #1a1410 100%)' }}>
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img
                  src="/Catastrophic Disclosure icon.png"
                  alt="Icon"
                  className="w-10 h-10"
                />
                <h1 className="text-xl font-bold text-white">
                  Catastrophic Disclosure
                </h1>
              </div>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition text-sm"
              >
                Intelligence
              </Link>
              <Link
                href="/dashboard/dossier"
                className="text-white border-b-2 border-blue-500 text-sm font-semibold pb-1"
              >
                Dossier
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">{session.name}</span>
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
        <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(244, 232, 208, 0.05)' }}>
          <DossierPage />
        </div>
      </main>
    </div>
  );
}
