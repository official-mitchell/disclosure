import MarkdownText from "./MarkdownText";

interface AuthoritySectionProps {
  formalAuthority: string[];
  informalFears: string[];
  safelyIgnore: string[];
}

export default function AuthoritySection({
  formalAuthority,
  informalFears,
  safelyIgnore,
}: AuthoritySectionProps) {
  // Ensure arrays (handle both old string format and new array format)
  const formalAuthorityArray = Array.isArray(formalAuthority)
    ? formalAuthority
    : formalAuthority
    ? [formalAuthority as any]
    : [];
  const informalFearsArray = Array.isArray(informalFears)
    ? informalFears
    : informalFears
    ? [informalFears as any]
    : [];
  const safelyIgnoreArray = Array.isArray(safelyIgnore)
    ? safelyIgnore
    : safelyIgnore
    ? [safelyIgnore as any]
    : [];

  return (
    <div
      style={{
        gap: "clamp(1rem, 3vw, 1.5rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Formal Authority */}
      {formalAuthorityArray.length > 0 && (
        <div
          className="bg-amber-50/30 rounded-lg"
          style={{ padding: "clamp(1rem, 3vw, 1.5rem)" }}
        >
          <div
            className="border-b border-amber-700"
            style={{
              paddingBottom: "clamp(0.75rem, 2vw, 1rem)",
              marginBottom: "clamp(0.75rem, 2vw, 1rem)",
            }}
          >
            <h3
              className="typewriter-font font-bold text-base sm:text-lg uppercase tracking-wide"
              style={{
                color: "#2d1810",
                fontSize: "clamp(1.25rem, 2.25vw, 1.40625rem)",
              }}
            >
              FORMAL AUTHORITY
            </h3>
          </div>
          <ul
            style={{
              gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
              display: "flex",
              flexDirection: "column",
              paddingLeft: 0,
              listStyle: "none",
            }}
          >
            {formalAuthorityArray.map((item, index) => (
              <li
                key={index}
                className="flex items-start document-font text-sm sm:text-base"
                style={{ fontSize: "clamp(1.09375rem, 1.625vw, 1.25rem)" }}
              >
                <span
                  className="mr-2 flex-shrink-0"
                  style={{
                    fontSize: "clamp(1.25rem, 2vw, 1.5625rem)",
                    lineHeight: "1.2",
                    display: "inline-block",
                    color: "#2d1810",
                  }}
                >
                  •
                </span>
                <span style={{ color: "#3d2820" }}>
                  <MarkdownText content={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Informal Pressures */}
      {informalFearsArray.length > 0 && (
        <div
          className="bg-amber-50/30 rounded-lg"
          style={{ padding: "clamp(1rem, 3vw, 1.5rem)" }}
        >
          <div
            className="border-b border-amber-700"
            style={{
              paddingBottom: "clamp(0.75rem, 2vw, 1rem)",
              marginBottom: "clamp(0.75rem, 2vw, 1rem)",
            }}
          >
            <h3
              className="typewriter-font font-bold text-base sm:text-lg uppercase tracking-wide"
              style={{
                color: "#2d1810",
                fontSize: "clamp(1.25rem, 2.25vw, 1.40625rem)",
              }}
            >
              INFORMAL PRESSURES
            </h3>
          </div>
          <ul
            style={{
              gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
              display: "flex",
              flexDirection: "column",
              paddingLeft: 0,
              listStyle: "none",
            }}
          >
            {informalFearsArray.map((item, index) => (
              <li
                key={index}
                className="flex items-start document-font text-sm sm:text-base"
                style={{ fontSize: "clamp(1.09375rem, 1.625vw, 1.25rem)" }}
              >
                <span
                  className="mr-2 flex-shrink-0"
                  style={{
                    fontSize: "clamp(1.25rem, 2vw, 1.5625rem)",
                    lineHeight: "1.2",
                    display: "inline-block",
                    color: "#2d1810",
                  }}
                >
                  •
                </span>
                <span style={{ color: "#3d2820" }}>
                  <MarkdownText content={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safely Ignore */}
      {safelyIgnoreArray.length > 0 && (
        <div
          className="bg-amber-50/30 rounded-lg"
          style={{ padding: "clamp(1rem, 3vw, 1.5rem)" }}
        >
          <div
            className="border-b border-amber-700"
            style={{
              paddingBottom: "clamp(0.75rem, 2vw, 1rem)",
              marginBottom: "clamp(0.75rem, 2vw, 1rem)",
            }}
          >
            <h3
              className="typewriter-font font-bold text-base sm:text-lg uppercase tracking-wide"
              style={{
                color: "#2d1810",
                fontSize: "clamp(1.25rem, 2.25vw, 1.40625rem)",
              }}
            >
              SAFELY IGNORE
            </h3>
          </div>
          <ul
            style={{
              gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
              display: "flex",
              flexDirection: "column",
              paddingLeft: 0,
              listStyle: "none",
            }}
          >
            {safelyIgnoreArray.map((item, index) => (
              <li
                key={index}
                className="flex items-start document-font text-sm sm:text-base"
                style={{ fontSize: "clamp(1.09375rem, 1.625vw, 1.25rem)" }}
              >
                <span
                  className="mr-2 flex-shrink-0"
                  style={{
                    fontSize: "clamp(1.25rem, 2vw, 1.5625rem)",
                    lineHeight: "1.2",
                    display: "inline-block",
                    color: "#2d1810",
                  }}
                >
                  •
                </span>
                <span style={{ color: "#3d2820" }}>
                  <MarkdownText content={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
