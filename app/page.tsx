export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Catastrophic Disclosure</h1>
        <p className="text-gray-600 mb-8">Mystery Game - GM Clue Release System</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Player Login
          </a>
          <a
            href="/gm/login"
            className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
          >
            GM Login
          </a>
        </div>
      </div>
    </div>
  );
}
