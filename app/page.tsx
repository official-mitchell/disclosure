export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <img
          src="/full logo.png"
          alt="Catastrophic Disclosure"
          className="mx-auto mb-8 w-full max-w-2xl px-4"
        />
        <p className="text-gray-300 mb-8 text-lg">Mystery Game - GM Clue Release System</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Player Login
          </a>
          <a
            href="/gm/login"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition font-medium"
          >
            GM Login
          </a>
        </div>
      </div>
    </div>
  );
}
