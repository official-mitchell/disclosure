interface AuthoritySectionProps {
  formalAuthority: string;
  informalFears: string;
  safelyIgnore: string;
}

export default function AuthoritySection({
  formalAuthority,
  informalFears,
  safelyIgnore,
}: AuthoritySectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4 document-font text-sm sm:text-base">
      <div className="p-3 sm:p-4 bg-amber-50/30 border-2 border-amber-800 rounded">
        <p className="text-xs font-bold tracking-widest mb-2 typewriter-font" style={{ color: '#2d1810' }}>
          FORMAL AUTHORITY:
        </p>
        <p className="font-semibold" style={{ color: '#3d2820' }}>{formalAuthority}</p>
      </div>
      <div className="p-3 sm:p-4 bg-amber-50/30 border-2 border-amber-800 rounded">
        <p className="text-xs font-bold tracking-widest mb-2 typewriter-font" style={{ color: '#2d1810' }}>
          INFORMAL PRESSURES:
        </p>
        <p className="font-semibold" style={{ color: '#3d2820' }}>{informalFears}</p>
      </div>
      <div className="p-3 sm:p-4 bg-amber-50/30 border-2 border-amber-800 rounded">
        <p className="text-xs font-bold tracking-widest mb-2 typewriter-font" style={{ color: '#2d1810' }}>
          SAFELY IGNORE:
        </p>
        <p className="font-semibold" style={{ color: '#3d2820' }}>{safelyIgnore}</p>
      </div>
    </div>
  );
}
