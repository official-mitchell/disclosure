import { redirect } from 'next/navigation';
import { requireGMAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import CharacterForm from '@/components/CharacterForm';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GMDossierEdit({ params }: PageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">
                GM: {character ? 'Edit' : 'Create'} Character
              </h1>
              <Link
                href={`/gm/players/${id}/dossier`}
                className="text-gray-300 hover:text-white transition text-sm"
              >
                ← Cancel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                Player: {player.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CharacterForm
          playerId={id}
          playerName={player.name}
          initialData={character ? {
            displayName: character.displayName,
            nationalityBloc: character.nationalityBloc,
            occupation: character.occupation,
            covertOccupation: character.covertOccupation ?? '',
            publicReputation: character.publicReputation,
            portraitUrl: character.portraitUrl ?? undefined,
            archetypeTitle: character.archetypeTitle,
            permissions: character.permissions,
            restrictions: character.restrictions,
            backstory: character.backstory,
            motivations: character.motivations as any,
            formalAuthority: character.formalAuthority,
            informalFears: character.informalFears,
            safelyIgnore: character.safelyIgnore,
            exposureConsequences: character.exposureConsequences,
            privateWant: character.privateWant,
            disclosureBelief: character.disclosureBelief,
            canDiscuss: character.canDiscuss,
            mustConceal: character.mustConceal,
          } : undefined}
        />
      </main>
    </div>
  );
}
