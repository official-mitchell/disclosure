interface DossierHeaderProps {
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  covertOccupation?: string | null;
  publicReputation: string;
  portraitUrl?: string | null;
}

export default function DossierHeader({
  displayName,
  nationalityBloc,
  occupation,
  covertOccupation,
  publicReputation,
  portraitUrl,
}: DossierHeaderProps) {
  return (
    <div
      className="shadow-lg relative overflow-hidden w-full"
      style={{
        borderRadius: 0,
        backgroundColor: "#f4e8d0",
        marginBottom: 0,
        border: "4px solid rgba(180, 83, 9, 0.3)",
      }}
    >
      {/* Coffee stains - hidden on mobile */}
      <div
        className="coffee-stain hidden sm:block"
        style={{ width: "100px", height: "100px", top: "10px", right: "50px" }}
      />
      <div
        className="coffee-stain hidden sm:block"
        style={{ width: "60px", height: "60px", bottom: "20px", left: "100px" }}
      />

      <div
        className="relative z-10"
        style={{ padding: "clamp(1rem, 3vw, 2rem)" }}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {portraitUrl && (
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={portraitUrl}
                alt={displayName}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover shadow-md"
                style={{ filter: "sepia(20%) contrast(110%)" }}
              />
            </div>
          )}
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-4xl font-bold typewriter-font text-center sm:text-left"
              style={{
                color: "#2d1810",
                marginBottom: "clamp(1rem, 3vw, 1.5rem)",
                fontSize: "clamp(2.5rem, 5.625vw, 5.625rem)",
              }}
            >
              {displayName}
            </h1>
            <div
              className="document-font text-base sm:text-lg"
              style={{
                color: "#3d2820",
                gap: "clamp(0.75rem, 2vw, 1rem)",
                display: "flex",
                flexDirection: "column",
                fontSize: "clamp(1.25rem, 2.25vw, 1.40625rem)",
              }}
            >
              <p
                className="border-b border-amber-800"
                style={{ paddingBottom: "clamp(0.75rem, 2vw, 1rem)" }}
              >
                <span
                  className="font-semibold uppercase tracking-wide text-xs sm:text-sm"
                  style={{ fontSize: "clamp(0.9375rem, 1.375vw, 1.09375rem)" }}
                >
                  Nationality:
                </span>{" "}
                <span className="font-normal">{nationalityBloc}</span>
              </p>
              <p
                className={covertOccupation ? "border-b border-amber-800" : ""}
                style={
                  covertOccupation
                    ? { paddingBottom: "clamp(0.75rem, 2vw, 1rem)" }
                    : {}
                }
              >
                <span
                  className="font-semibold uppercase tracking-wide text-xs sm:text-sm"
                  style={{ fontSize: "clamp(0.9375rem, 1.375vw, 1.09375rem)" }}
                >
                  Occupation:
                </span>{" "}
                <span className="font-normal">{occupation}</span>
              </p>
              {covertOccupation && (
                <p className="bg-red-900/10 border border-red-900/30 rounded px-3 py-2">
                  <span
                    className="font-semibold uppercase tracking-wide text-xs sm:text-sm text-red-900"
                    style={{
                      fontSize: "clamp(0.9375rem, 1.375vw, 1.09375rem)",
                    }}
                  >
                    Covert Occupation:
                  </span>{" "}
                  <span className="font-normal text-red-900/90">
                    {covertOccupation}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="bg-amber-50/50 rounded"
          style={{
            marginTop: "clamp(1.5rem, 4vw, 2.5rem)",
            padding: "clamp(1rem, 3vw, 1.5rem)",
          }}
        >
          <p
            className="text-xs font-bold tracking-widest typewriter-font"
            style={{
              color: "#2d1810",
              marginBottom: "clamp(0.75rem, 2vw, 1rem)",
              fontSize: "clamp(0.9375rem, 1.375vw, 1.09375rem)",
            }}
          >
            PUBLIC PROFILE:
          </p>
          <p
            className="document-font text-sm sm:text-base leading-relaxed"
            style={{
              color: "#3d2820",
              fontSize: "clamp(1.09375rem, 1.625vw, 1.25rem)",
            }}
          >
            {publicReputation}
          </p>
        </div>
      </div>
    </div>
  );
}
