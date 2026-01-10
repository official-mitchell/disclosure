import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import DossierPage from '@/components/dossier/DossierPage';
import PlayerCluesDisplay from '@/components/PlayerCluesDisplay';

export default async function ViewAsPlayerPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ playerId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getGMSession();
  if (!session) redirect('/gm/login');

  const { playerId } = await params;
  const { tab = 'dossier' } = await searchParams;
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    return <div>Player not found</div>;
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

      {/* Navigation Links Row with GM Indicator */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto dynamic-padding-sm">
          <div className="flex justify-between items-center" style={{ paddingTop: 'clamp(0.75rem, 2vw, 1rem)', paddingBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(1rem, 3vw, 2rem)' }}>
              <Link
                href="/gm/dashboard"
                className="dynamic-text-base transition hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                ← Back to GM
              </Link>
              <div className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded text-xs font-medium">
                GM VIEW
              </div>
              <Link
                href={`/gm/view-as/${playerId}?tab=intelligence`}
                className={`dynamic-text-base transition pb-1 ${
                  tab === 'intelligence' 
                    ? 'font-semibold text-white border-b-2' 
                    : 'hover:text-white'
                }`}
                style={{ 
                  color: tab === 'intelligence' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  borderBottom: tab === 'intelligence' ? '2px solid #3b82f6' : 'none'
                }}
              >
                Intelligence
              </Link>
              <Link
                href={`/gm/view-as/${playerId}?tab=dossier`}
                className={`dynamic-text-base transition pb-1 ${
                  tab === 'dossier' 
                    ? 'font-semibold text-white border-b-2' 
                    : 'hover:text-white'
                }`}
                style={{ 
                  color: tab === 'dossier' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  borderBottom: tab === 'dossier' ? '2px solid #3b82f6' : 'none'
                }}
              >
                Dossier
              </Link>
            </div>
            <div className="flex items-center" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <span className="dynamic-text-base font-semibold" style={{ color: 'white' }}>
                Viewing as: {player.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full" style={{ paddingTop: 0, paddingBottom: 0 }}>
        {tab === 'intelligence' ? (
          <div className="max-w-7xl mx-auto dynamic-padding" style={{ paddingTop: 'clamp(1.5rem, 4vw, 2rem)', paddingBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
            <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
              <h2 className="dynamic-text-2xl font-bold mb-6 text-center" style={{ color: 'white' }}>Intelligence Visible to {player.name}</h2>
              <PlayerCluesDisplay playerId={playerId} />
            </div>
          </div>
        ) : (
          <DossierPage playerId={playerId} />
        )}
      </main>
    </div>
  );
}
