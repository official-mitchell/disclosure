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
    <div className="dynamic-page-wrapper bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="dynamic-container">
        <div className="bg-white rounded-2xl shadow-2xl dynamic-card-full dynamic-padding">
          <div className="text-center form-spacing-lg">
            <img
              src="/Catastrophic Disclosure icon.png"
              alt="Catastrophic Disclosure Icon"
              className="mx-auto mb-6 dynamic-image-sm"
            />
            <h1 className="dynamic-text-xl font-bold text-gray-900 mb-3">
              Player Login
            </h1>
            <p className="dynamic-text-base text-gray-600">
              Enter your name and PIN to access the game
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div className="form-spacing">
              <label
                htmlFor="name"
                className="form-label text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input form-input-light"
                placeholder="Your name"
                disabled={loading}
              />
            </div>

            <div className="form-spacing">
              <label
                htmlFor="pin"
                className="form-label text-gray-700"
              >
                PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="form-input form-input-light"
                placeholder="4-6 digit PIN"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="form-spacing" style={{ marginTop: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <button
                type="submit"
                disabled={loading}
                className="form-button form-button-secondary"
                style={{ minWidth: 'auto' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
