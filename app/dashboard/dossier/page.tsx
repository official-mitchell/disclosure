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
                className="dynamic-text-base transition hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Intelligence
              </Link>
              <Link
                href="/dashboard/dossier"
                className="dynamic-text-base font-semibold pb-1"
                style={{ color: 'white', borderBottom: '2px solid #3b82f6' }}
              >
                Dossier
              </Link>
            </div>
            <div className="flex items-center" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <span className="dynamic-text-base font-semibold" style={{ color: 'white' }}>
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

      <main className="w-full" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <DossierPage />
      </main>
    </div>
  );
}
