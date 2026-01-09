'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayerLogin() {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/Catastrophic Disclosure icon.png"
            alt="Catastrophic Disclosure Icon"
            className="mx-auto mb-4 w-24 h-24"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Player Login
          </h1>
          <p className="text-gray-600">
            Enter your name and PIN to access the game
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
              placeholder="4-6 digit PIN"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
