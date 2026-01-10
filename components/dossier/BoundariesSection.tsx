interface BoundariesSectionProps {
  canDiscuss: string[];
  mustConceal: string[];
}

export default function BoundariesSection({
  canDiscuss,
  mustConceal,
}: BoundariesSectionProps) {
  return (
    <div
      style={{
        gap: "clamp(1rem, 3vw, 1.5rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="bg-green-50/40 rounded"
        style={{ padding: "clamp(0.75rem, 2vw, 1rem)" }}
      >
        <p
          className="text-xs sm:text-sm font-bold tracking-widest typewriter-font"
          style={{
            marginBottom: "clamp(0.75rem, 2vw, 1rem)",
            color: "#2d1810",
            fontSize: "clamp(0.9375rem, 1.375vw, 1.09375rem)",
          }}
        >
          SPEAK OPENLY:
        </p>
        <ul
          style={{
            gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
            display: "flex",
            flexDirection: "column",
            paddingLeft: 0,
            listStyle: "none",
          }}
        >
          {canDiscuss.map((item, index) => (
            <li
              key={index}
              className="flex items-start document-font text-sm sm:text-base"
              style={{ fontSize: "clamp(1.09375rem, 1.625vw, 1.25rem)" }}
            >
              <span
                className="mr-2 font-bold flex-shrink-0"
                style={{
                  fontSize: "clamp(1.25rem, 2vw, 1.5625rem)",
                  lineHeight: "1.2",
                  display: "inline-block",
                  color: "#2d1810",
                }}
              >
                ✓
              </span>
              <span style={{ color: "#3d2820" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="bg-red-50/40 rounded"
        style={{ padding: "clamp(0.75rem, 2vw, 1rem)" }}
      >
        <p
          className="text-xs sm:text-sm font-bold tracking-widest typewriter-font"
          style={{
            marginBottom: "clamp(0.75rem, 2vw, 1rem)",
            color: "#2d1810",
            fontSize: "clamp(0.9375rem, 1.375vw, 1.09375rem)",
          }}
        >
          KEEP SECRETIVE:
        </p>
        <ul
          style={{
            gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
            display: "flex",
            flexDirection: "column",
            paddingLeft: 0,
            listStyle: "none",
          }}
        >
          {mustConceal.map((item, index) => (
            <li
              key={index}
              className="flex items-start document-font text-sm sm:text-base"
              style={{ fontSize: "clamp(1.09375rem, 1.625vw, 1.25rem)" }}
            >
              <span
                className="mr-2 font-bold flex-shrink-0"
                style={{
                  fontSize: "clamp(1.25rem, 2vw, 1.5625rem)",
                  lineHeight: "1.2",
                  display: "inline-block",
                  color: "#2d1810",
                }}
              >
                ⚠
              </span>
              <span style={{ color: "#3d2820" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
