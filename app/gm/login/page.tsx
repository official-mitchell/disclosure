'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GMLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/gm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to GM dashboard on success
      router.push('/gm/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/Catastrophic Disclosure icon.png"
            alt="Catastrophic Disclosure Icon"
            className="mx-auto mb-4 w-24 h-24"
          />
          <div className="inline-block bg-amber-700 text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            GAME MASTER ACCESS
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            GM Login
          </h1>
          <p className="text-gray-400">
            Enter the Game Master password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
              placeholder="Enter GM password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Access GM Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-200 transition"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
