interface PermissionsSectionProps {
  archetypeTitle: string;
  permissions: string[];
  restrictions: string[];
}

export default function PermissionsSection({
  archetypeTitle,
  permissions,
  restrictions,
}: PermissionsSectionProps) {
  return (
    <>
      <div className="bg-amber-100/60 border-l-4 border-amber-800" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          DESIGNATION:
        </p>
        <p className="document-font font-bold text-base sm:text-lg" style={{ color: '#3d2820' }}>
          {archetypeTitle}
        </p>
      </div>

      <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          AUTHORIZED ACTIONS:
        </p>
        <div className="border-2 border-green-700 bg-green-50/30 rounded" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
          <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', paddingLeft: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
            {permissions.map((permission, index) => (
              <li key={index} className="flex items-start document-font text-sm sm:text-base">
                <span className="text-green-700 mr-2 text-lg font-bold flex-shrink-0">✓</span>
                <span style={{ color: '#3d2820' }}>{permission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {restrictions.length > 0 && (
        <div>
          <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            ⚠ OPERATIONAL CONSTRAINTS:
          </p>
          <div className="border-2 border-yellow-700 bg-yellow-50/30 rounded" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', paddingLeft: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
              {restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start document-font text-sm sm:text-base">
                  <span className="text-yellow-700 mr-2 font-bold flex-shrink-0">⚠</span>
                  <span style={{ color: '#3d2820' }}>{restriction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
