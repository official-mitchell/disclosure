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
    <div className="dynamic-page-wrapper bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      <div className="dynamic-container">
        <div className="bg-slate-800 rounded-2xl dynamic-card-full dynamic-padding card-container-thick" style={{ backgroundColor: '#1e293b' }}>
          <div className="text-center form-spacing-lg">
            <div className="flex justify-center" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <img
                src="/Catastrophic Disclosure icon.png"
                alt="Catastrophic Disclosure Icon"
                className="dynamic-image-sm"
              />
            </div>
            <h1 className="dynamic-text-xl font-bold mb-3" style={{ color: 'white' }}>
              Player Login
            </h1>
            <p className="dynamic-text-base" style={{ color: 'white' }}>
              Enter your first name and PIN to access the game
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div className="form-spacing">
              <label
                htmlFor="name"
                className="form-label"
                style={{ color: 'white' }}
              >
                First Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input form-input-dark"
                placeholder="Your first name"
                disabled={loading}
              />
            </div>

            <div className="form-spacing">
              <label
                htmlFor="pin"
                className="form-label"
                style={{ color: 'white' }}
              >
                PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="form-input form-input-dark"
                placeholder="4-6 digit PIN"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 px-4 py-3 rounded-lg text-sm" style={{ color: '#ef4444' }}>
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

          <div className="text-center" style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <a
              href="/"
              className="text-sm transition"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
