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
    <div className="aged-paper border-4 border-amber-900 rounded-lg p-4 sm:p-6 mb-6 shadow-lg relative overflow-hidden">
      {/* Coffee stains - hidden on mobile */}
      <div className="coffee-stain hidden sm:block" style={{ width: '100px', height: '100px', top: '10px', right: '50px' }} />
      <div className="coffee-stain hidden sm:block" style={{ width: '60px', height: '60px', bottom: '20px', left: '100px' }} />

      <div className="relative z-10">
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
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 typewriter-font text-center sm:text-left" style={{ color: '#2d1810' }}>
              {displayName}
            </h1>
            <div className="space-y-2 document-font text-base sm:text-lg" style={{ color: '#3d2820' }}>
              <p className="border-b border-amber-800 pb-2">
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

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 border-2 border-amber-800 bg-amber-50/50 rounded">
          <p className="text-xs font-bold tracking-widest mb-2 typewriter-font" style={{ color: '#2d1810' }}>
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
