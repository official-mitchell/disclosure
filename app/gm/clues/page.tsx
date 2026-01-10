import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import ReleaseControls from '@/components/ReleaseControls';
import PhaseReleaseButton from '@/components/PhaseReleaseButton';
import CollapsiblePhase from '@/components/CollapsiblePhase';
import CollapsibleClueCard from '@/components/CollapsibleClueCard';

export default async function GMCluesPage() {
  const session = await getGMSession();
  if (!session) redirect('/gm/login');

  const clues = await prisma.clue.findMany({
    orderBy: [{ phase: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { clueAssignments: true } },
    },
  });

  const cluesByPhase = clues.reduce((acc, clue) => {
    if (!acc[clue.phase]) acc[clue.phase] = [];
    acc[clue.phase].push(clue);
    return acc;
  }, {} as Record<number, typeof clues>);

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
            <h1 className="dynamic-text-base font-bold" style={{ color: 'white', textAlign: 'center' }}>Clue Management</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto dynamic-padding" style={{ paddingTop: 'clamp(1.5rem, 4vw, 2rem)', paddingBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
        {/* New Clue button - above content */}
        <div className="mb-6" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <Link href="/gm/clues/new" className="button-component button-add" style={{ width: 'auto', minWidth: 'clamp(120px, 20vw, 160px)', display: 'inline-block' }}>
            + New Clue
          </Link>
        </div>

        {clues.length === 0 ? (
          <div className="bg-gray-800 rounded-lg dynamic-card-padding text-center card-container-thick">
            <h2 className="dynamic-text-lg font-semibold mb-4" style={{ color: 'white' }}>
              No Clues Yet
            </h2>
            <p className="dynamic-text-base mb-6" style={{ color: 'white' }}>
              Create your first clue to get started
            </p>
            <Link
              href="/gm/clues/new"
              className="button-component button-add"
              style={{ width: 'auto', minWidth: 'clamp(150px, 25vw, 200px)', display: 'inline-block' }}
            >
              Create First Clue
            </Link>
          </div>
        ) : (
          <div>
            {[1, 2, 3, 4, 5].map((phase) => {
              const phaseClues = cluesByPhase[phase] || [];
              if (phaseClues.length === 0) return null;

              const unreleasedCount = phaseClues.filter(c => !c.released).length;

              return (
                <CollapsiblePhase
                  key={phase}
                  phase={phase}
                  clueCount={phaseClues.length}
                  headerActions={<PhaseReleaseButton phase={phase} unreleasedCount={unreleasedCount} />}
                >
                  {phaseClues.map((clue) => (
                    <CollapsibleClueCard key={clue.id} clue={clue} />
                  ))}
                </CollapsiblePhase>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
