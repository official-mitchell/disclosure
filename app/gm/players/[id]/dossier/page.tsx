import { redirect } from 'next/navigation';
import { requireGMAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DossierPage from '@/components/dossier/DossierPage';
import Link from 'next/link';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function GMDossierView({ params }: PageProps) {
  await requireGMAuth();

  const player = await prisma.player.findUnique({
    where: { id: params.id },
  });

  if (!player) {
    redirect('/gm/players');
  }

  const character = await prisma.character.findUnique({
    where: { playerId: params.id },
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #3d2820 0%, #1a1410 100%)' }}>
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">
                GM: Character Dossier
              </h1>
              <Link
                href="/gm/players"
                className="text-gray-300 hover:text-white transition text-sm"
              >
                ← Back to Players
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                Viewing: {player.name}
              </span>
              {character ? (
                <Link
                  href={`/gm/players/${params.id}/dossier/edit`}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm"
                >
                  Edit Character
                </Link>
              ) : (
                <Link
                  href={`/gm/players/${params.id}/dossier/edit`}
                  className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm"
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
              href={`/gm/players/${params.id}/dossier/edit`}
              className="inline-block px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded"
            >
              Create Character
            </Link>
          </div>
        ) : (
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(244, 232, 208, 0.05)' }}>
            <DossierPage />
          </div>
        )}
      </main>
    </div>
  );
}
