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
    <div className="dynamic-page-wrapper bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      <div className="dynamic-container">
        <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl dynamic-card-full dynamic-padding" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
          <div className="text-center form-spacing-lg">
            <div className="flex justify-center" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <img
                src="/Catastrophic Disclosure icon.png"
                alt="Catastrophic Disclosure Icon"
                className="dynamic-image-sm"
              />
            </div>
            <div className="flex justify-center" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <div className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium" style={{ color: 'white' }}>
                GAME MASTER ACCESS
              </div>
            </div>
            <h1 className="dynamic-text-xl font-bold" style={{ color: 'white', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
              GM Login
            </h1>
            <p className="dynamic-text-base" style={{ color: 'white' }}>
              Enter the Game Master password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div className="form-spacing">
              <label
                htmlFor="password"
                className="form-label"
                style={{ color: 'white' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input form-input-blue"
                placeholder="Enter GM password"
                disabled={loading}
                style={{ color: 'white' }}
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="form-spacing" style={{ marginTop: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <button
                type="submit"
                disabled={loading}
                className="form-button form-button-primary"
              >
                {loading ? 'Authenticating...' : 'Access GM Dashboard'}
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
