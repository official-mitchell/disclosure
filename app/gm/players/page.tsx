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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      <nav className="bg-black border-b border-gray-800 relative">
        <div className="max-w-7xl mx-auto dynamic-padding-sm">
          {/* Back button - top left */}
          <div className="absolute top-0 left-0" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <Link href="/gm/dashboard" className="logout-button" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              ← Back
            </Link>
          </div>
          
          {/* Centered content */}
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: 'clamp(1rem, 3vw, 1.5rem)', paddingBottom: 'clamp(1rem, 3vw, 1.5rem)', minHeight: 'clamp(5rem, 15vw, 8rem)' }}>
            <div className="flex justify-center mb-2">
              <img
                src="/Catastrophic Disclosure icon.png"
                alt="Icon"
                className="flex-shrink-0"
                style={{ 
                  width: 'clamp(5rem, 15vw, 8rem)', 
                  height: 'clamp(5rem, 15vw, 8rem)',
                  minWidth: '80px',
                  maxWidth: '128px'
                }}
              />
            </div>
            <h1 className="dynamic-text-base font-bold" style={{ color: 'white', textAlign: 'center' }}>Player Management</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto dynamic-padding" style={{ paddingTop: 'clamp(1.5rem, 4vw, 2rem)', paddingBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
        <PlayerManagement initialPlayers={players} />
      </main>
    </div>
  );
}
