interface DossierHeaderProps {
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  publicReputation: string;
  portraitUrl?: string | null;
}

export default function DossierHeader({
  displayName,
  nationalityBloc,
  occupation,
  publicReputation,
  portraitUrl,
}: DossierHeaderProps) {
  return (
    <div className="shadow-lg relative overflow-hidden w-full" style={{ borderRadius: 0, backgroundColor: '#f4e8d0', marginBottom: 0, border: '4px solid rgba(180, 83, 9, 0.3)' }}>
      {/* Coffee stains - hidden on mobile */}
      <div className="coffee-stain hidden sm:block" style={{ width: '100px', height: '100px', top: '10px', right: '50px' }} />
      <div className="coffee-stain hidden sm:block" style={{ width: '60px', height: '60px', bottom: '20px', left: '100px' }} />

      <div className="relative z-10" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {portraitUrl && (
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={portraitUrl}
                alt={displayName}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-amber-900 shadow-md"
                style={{ filter: 'sepia(20%) contrast(110%)' }}
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold typewriter-font text-center sm:text-left" style={{ color: '#2d1810', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              {displayName}
            </h1>
            <div className="document-font text-base sm:text-lg" style={{ color: '#3d2820', gap: 'clamp(0.75rem, 2vw, 1rem)', display: 'flex', flexDirection: 'column' }}>
              <p className="border-b border-amber-800" style={{ paddingBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <span className="font-semibold uppercase tracking-wide text-xs sm:text-sm">Nationality:</span>{' '}
                <span className="font-normal">{nationalityBloc}</span>
              </p>
              <p>
                <span className="font-semibold uppercase tracking-wide text-xs sm:text-sm">Occupation:</span>{' '}
                <span className="font-normal">{occupation}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-2 border-amber-800 bg-amber-50/50 rounded" style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            PUBLIC PROFILE:
          </p>
          <p className="document-font text-sm sm:text-base leading-relaxed" style={{ color: '#3d2820' }}>
            {publicReputation}
          </p>
        </div>
      </div>
    </div>
  );
}
