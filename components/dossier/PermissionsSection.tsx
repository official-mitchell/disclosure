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
      <div className="mb-4 sm:mb-5 p-3 bg-amber-100/60 border-l-4 border-amber-800">
        <p className="text-xs font-bold tracking-widest mb-1 typewriter-font" style={{ color: '#2d1810' }}>
          DESIGNATION:
        </p>
        <p className="document-font font-bold text-base sm:text-lg" style={{ color: '#3d2820' }}>
          {archetypeTitle}
        </p>
      </div>

      <div className="mb-4 sm:mb-5">
        <p className="text-xs font-bold tracking-widest mb-2 sm:mb-3 typewriter-font" style={{ color: '#2d1810' }}>
          AUTHORIZED ACTIONS:
        </p>
        <div className="border-2 border-green-700 bg-green-50/30 rounded p-3 sm:p-4">
          <ul className="space-y-2">
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
          <p className="text-xs font-bold tracking-widest mb-2 sm:mb-3 typewriter-font" style={{ color: '#2d1810' }}>
            ⚠ OPERATIONAL CONSTRAINTS:
          </p>
          <div className="border-2 border-yellow-700 bg-yellow-50/30 rounded p-3 sm:p-4">
            <ul className="space-y-2">
              {restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start document-font text-sm sm:text-base">
                  <span className="text-yellow-700 mr-2 font-bold flex-shrink-0">▸</span>
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
