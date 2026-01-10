// Updated: Proper dynamic sizing using viewport units, larger logo, bigger text, wider buttons, proper spacing
export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 md:p-8 lg:p-12" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      <div className="w-full max-w-[768px] mx-auto">
        <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-600 p-8 sm:p-10 md:p-12 min-h-[60vh] h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] flex flex-col justify-center" style={{ backgroundColor: '#1e293b', borderColor: '#475569', maxWidth: '768px', width: '100%' }}>
          <div className="text-center flex-1 flex flex-col justify-center gap-8 sm:gap-10 md:gap-12">
            <div className="flex justify-center">
              <img
                src="/full logo.png"
                alt="Catastrophic Disclosure"
                className="h-auto"
                style={{ width: 'min(70vw, 500px)', maxWidth: '500px' }}
              />
            </div>
            <p className="font-medium" style={{ color: 'white', fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}>
              Mystery Game - GM Clue Release System
            </p>
            <div className="flex flex-row justify-center items-center" style={{ gap: 'clamp(1.3rem, 3.9vw, 3.25rem)', marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <a
                href="/login"
                className="relative inline-block rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-center overflow-hidden"
                style={{ 
                  background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #1e3a8a)', 
                  borderColor: '#60a5fa',
                  color: 'white',
                  borderWidth: 'clamp(2px, 1vw, 4px)',
                  borderStyle: 'solid',
                  padding: 'clamp(0.975rem, 3.25vw, 1.95rem) clamp(1.625rem, 5.2vw, 3.9rem)',
                  fontSize: 'clamp(1.1375rem, 3.25vw, 1.95rem)',
                  minWidth: 'clamp(182px, 36.4vw, 364px)',
                  width: 'clamp(182px, 36.4vw, 364px)'
                }}
              >
                <span className="relative z-10">Player Login</span>
                <span className="shimmer absolute inset-0 pointer-events-none"></span>
              </a>
              <a
                href="/gm/login"
                className="relative inline-block rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-center overflow-hidden"
                style={{ 
                  background: 'linear-gradient(to bottom right, #7f1d1d, #991b1b, #7f1d1d)', 
                  borderColor: '#dc2626', 
                  color: 'white',
                  borderWidth: 'clamp(2px, 1vw, 4px)',
                  borderStyle: 'solid',
                  padding: 'clamp(0.975rem, 3.25vw, 1.95rem) clamp(1.625rem, 5.2vw, 3.9rem)',
                  fontSize: 'clamp(1.1375rem, 3.25vw, 1.95rem)',
                  minWidth: 'clamp(182px, 36.4vw, 364px)',
                  width: 'clamp(182px, 36.4vw, 364px)'
                }}
              >
                <span className="relative z-10">GM Login</span>
                <span className="shimmer-delayed absolute inset-0 pointer-events-none"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
