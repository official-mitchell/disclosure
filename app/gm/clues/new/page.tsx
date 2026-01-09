import { redirect } from 'next/navigation';
import { getGMSession } from '@/lib/auth';
import Link from 'next/link';
import ClueForm from '@/components/ClueForm';

export default async function NewCluePage() {
  const session = await getGMSession();
  if (!session) redirect('/gm/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 h-16">
            <Link href="/gm/clues" className="text-gray-400 hover:text-white transition">
              ← Back
            </Link>
            <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs font-medium">
              GM
            </div>
            <h1 className="text-xl font-bold text-white">Create New Clue</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <ClueForm mode="create" />
        </div>
      </main>
    </div>
  );
}
