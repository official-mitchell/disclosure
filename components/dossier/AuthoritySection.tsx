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
    <div className="document-font text-sm sm:text-base" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-amber-50/30 border-2 border-amber-800 rounded" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          FORMAL AUTHORITY:
        </p>
        <p className="font-semibold" style={{ color: '#3d2820' }}>{formalAuthority}</p>
      </div>
      <div className="bg-amber-50/30 border-2 border-amber-800 rounded" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          INFORMAL PRESSURES:
        </p>
        <p className="font-semibold" style={{ color: '#3d2820' }}>{informalFears}</p>
      </div>
      <div className="bg-amber-50/30 border-2 border-amber-800 rounded" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <p className="text-xs font-bold tracking-widest typewriter-font" style={{ color: '#2d1810', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          SAFELY IGNORE:
        </p>
        <p className="font-semibold" style={{ color: '#3d2820' }}>{safelyIgnore}</p>
      </div>
    </div>
  );
}
