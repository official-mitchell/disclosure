import { redirect } from 'next/navigation';
import { requireGMAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DossierPage from '@/components/dossier/DossierPage';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GMDossierView({ params }: PageProps) {
  await requireGMAuth();

  const { id } = await params;

  const player = await prisma.player.findUnique({
    where: { id },
  });

  if (!player) {
    redirect('/gm/players');
  }

  const character = await prisma.character.findUnique({
    where: { playerId: id },
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #3d2820 0%, #1a1410 100%)' }}>
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <div className="flex justify-between items-center" style={{ gap: 'clamp(1rem, 3vw, 2rem)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(1rem, 3vw, 2rem)' }}>
              <Link
                href="/gm/players"
                className="nav-button"
                style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
              >
                ← Back to Players
              </Link>
              <h1 className="text-xl font-bold" style={{ color: 'white', fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}>
                GM: Character Dossier
              </h1>
            </div>
            <div className="flex items-center" style={{ gap: 'clamp(1rem, 3vw, 2rem)' }}>
              <span className="text-sm" style={{ color: 'white', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                Viewing: {player.name}
              </span>
              {character ? (
                <Link
                  href={`/gm/players/${id}/dossier/edit`}
                  className="button-component button-edit"
                  style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >
                  Edit Character
                </Link>
              ) : (
                <Link
                  href={`/gm/players/${id}/dossier/edit`}
                  className="button-component button-add"
                  style={{ width: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >
                  Create Character
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!character ? (
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-yellow-100 mb-2">
              No Character Created
            </h2>
            <p className="text-yellow-200 mb-4">
              This player does not have a character dossier yet. Click "Create
              Character" to add one.
            </p>
            <Link
              href={`/gm/players/${id}/dossier/edit`}
              className="inline-block px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded"
            >
              Create Character
            </Link>
          </div>
        ) : (
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(244, 232, 208, 0.05)' }}>
            <DossierPage playerId={id} />
          </div>
        )}
      </main>
    </div>
  );
}
