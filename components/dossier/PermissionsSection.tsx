import MarkdownText from './MarkdownText';

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
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.9375rem, 1.375vw, 1.09375rem)' }}>
          DESIGNATION:
        </p>
        <div className="document-font font-bold text-base sm:text-lg" style={{ color: '#3d2820', fontSize: 'clamp(1.25rem, 2.25vw, 1.40625rem)' }}>
          <MarkdownText content={archetypeTitle} />
        </div>
      </div>

      <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.9375rem, 1.375vw, 1.09375rem)' }}>
          AUTHORIZED ACTIONS:
        </p>
        <div className="border-2 border-green-700 bg-green-50/30 rounded" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
          <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', paddingLeft: 0, listStyle: 'none' }}>
            {permissions.map((permission, index) => (
              <li key={index} className="flex items-start document-font text-sm sm:text-base" style={{ fontSize: 'clamp(1.09375rem, 1.625vw, 1.25rem)' }}>
                <span className="mr-2 font-bold flex-shrink-0" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5625rem)', lineHeight: '1.2', display: 'inline-block', color: '#2d1810' }}>✓</span>
                <span style={{ color: '#3d2820' }}>{permission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {restrictions.length > 0 && (
        <div>
          <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.9375rem, 1.375vw, 1.09375rem)' }}>
            ⚠ OPERATIONAL CONSTRAINTS:
          </p>
          <div className="border-2 border-yellow-700 bg-yellow-50/30 rounded" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <ul style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', paddingLeft: 0, listStyle: 'none' }}>
              {restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start document-font text-sm sm:text-base" style={{ fontSize: 'clamp(1.09375rem, 1.625vw, 1.25rem)' }}>
                  <span className="mr-2 font-bold flex-shrink-0" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5625rem)', lineHeight: '1.2', display: 'inline-block', color: '#2d1810' }}>⚠</span>
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
