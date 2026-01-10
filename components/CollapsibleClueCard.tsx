// CollapsibleClueCard Component
// Changes:
// - Created: Collapsible clue card component for displaying clue details with expand/collapse functionality
// - Updated: Restructured layout - buttons above title, Origin moved to details section, improved spacing, left-aligned list
// - Updated: Replaced text caret (▼/▶) with SVG chevron caret matching ClueCard component, with rotation animation
// - Updated: Added markdown rendering support for supporting intel section to allow line breaks and text formatting
// - Updated: Added markdown rendering support for backstory section to match player clue view formatting
"use client";

import { useState } from "react";
import Link from "next/link";
import ReleaseControls from "./ReleaseControls";
import MarkdownText from "./dossier/MarkdownText";

interface Clue {
  id: string;
  title: string;
  targetCountry?: string | null;
  targetArchetype?: string | null;
  targetDemeanor?: string | null;
  targetPlayer?: string | null;
  originCountry: string;
  released: boolean;
  retracted: boolean;
  backstory?: string | null;
  supportingIntel?: string | null;
  takeaways?: string[] | null;
  source?: string | null;
  confidenceLevel?: string | null;
  eventDate?: string | null;
}

interface CollapsibleClueCardProps {
  clue: Clue;
}

export default function CollapsibleClueCard({
  clue,
}: CollapsibleClueCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert new schema fields to display string
  const getTargetDisplay = () => {
    if (clue.targetCountry) {
      return { type: "Country", value: clue.targetCountry };
    } else if (clue.targetArchetype) {
      return { type: "Archetype", value: clue.targetArchetype };
    } else if (clue.targetDemeanor) {
      return { type: "Demeanor", value: clue.targetDemeanor };
    } else if (clue.targetPlayer) {
      return { type: "Player", value: clue.targetPlayer };
    }
    return { type: "All", value: null };
  };

  const targetDisplay = getTargetDisplay();

  return (
    <div
      className="bg-gray-700 rounded-lg"
      style={{
        border: "1px solid rgba(156, 163, 175, 0.5)",
        boxShadow:
          "0 0 8px rgba(156, 163, 175, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.2)",
        padding: "clamp(1rem, 3vw, 1.5rem)",
        marginBottom: "clamp(0.75rem, 2vw, 1rem)",
      }}
    >
      {/* Buttons row - above title */}
      <div
        className="flex justify-end mb-3"
        style={{
          gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
          marginBottom: "clamp(0.75rem, 2vw, 1rem)",
        }}
      >
        <ReleaseControls
          clueId={clue.id}
          released={clue.released}
          retracted={clue.retracted}
        />
        <Link
          href={`/gm/clues/${clue.id}/edit`}
          className="button-component button-edit"
          style={{
            width: "auto",
            padding: "clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
            fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
          }}
        >
          Edit
        </Link>
      </div>

      {/* Title row - clickable to expand/collapse */}
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div
          className="flex items-center justify-between mb-2"
          style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}
        >
          <h3
            className="dynamic-text-lg font-semibold flex-1"
            style={{ color: "white" }}
          >
            {clue.title}
          </h3>
          <div
            className="flex items-center"
            style={{
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <svg
              style={{
                width: "clamp(1.95rem, 5.2vw, 2.6rem)",
                height: "clamp(1.95rem, 5.2vw, 2.6rem)",
                minWidth: "31px",
                color: "white",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <div
          className="flex flex-wrap"
          style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}
        >
          <span className="dynamic-text-base" style={{ color: "white" }}>
            Target:{" "}
            <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              {targetDisplay.type}
            </span>
            {targetDisplay.value && ` (${targetDisplay.value})`}
          </span>
          {clue.released && (
            <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded dynamic-text-base">
              Released
            </span>
          )}
          {clue.retracted && (
            <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded dynamic-text-base">
              Retracted
            </span>
          )}
        </div>
      </div>

      {/* Details section - below horizontal line */}
      {isOpen && (
        <div
          className="mt-4 pt-4 border-t"
          style={{
            borderColor: "rgba(156, 163, 175, 0.5)",
            marginTop: "clamp(1rem, 3vw, 1.5rem)",
            paddingTop: "clamp(1rem, 3vw, 1.5rem)",
          }}
        >
          {/* Origin - moved to details section */}
          <div style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}>
            <span
              className="dynamic-text-base font-semibold"
              style={{ color: "white" }}
            >
              Origin:{" "}
            </span>
            <span
              className="dynamic-text-base"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {clue.originCountry}
            </span>
          </div>

          {/* Event Date */}
          {clue.eventDate && (
            <div style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}>
              <span
                className="dynamic-text-base font-semibold"
                style={{ color: "white" }}
              >
                Event Date:{" "}
              </span>
              <span
                className="dynamic-text-base"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {clue.eventDate}
              </span>
            </div>
          )}

          {/* Backstory */}
          {clue.backstory && (
            <div style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}>
              <span
                className="dynamic-text-base font-semibold mb-2 block"
                style={{ color: "white" }}
              >
                Backstory:
              </span>
              <div
                className="dynamic-text-base leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                <MarkdownText content={clue.backstory} />
              </div>
            </div>
          )}

          {/* Supporting Intel */}
          {clue.supportingIntel && (
            <div style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}>
              <span
                className="dynamic-text-base font-semibold mb-2 block"
                style={{ color: "white" }}
              >
                Supporting Intel:
              </span>
              <div
                className="dynamic-text-base"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                <MarkdownText content={clue.supportingIntel} />
              </div>
            </div>
          )}

          {/* Source */}
          {clue.source && (
            <div style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}>
              <span
                className="dynamic-text-base font-semibold"
                style={{ color: "white" }}
              >
                Source:{" "}
              </span>
              <span
                className="dynamic-text-base"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {clue.source}
              </span>
            </div>
          )}

          {/* Confidence Level */}
          {clue.confidenceLevel && (
            <div style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}>
              <span
                className="dynamic-text-base font-semibold"
                style={{ color: "white" }}
              >
                Confidence:{" "}
              </span>
              <span
                className="dynamic-text-base"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {clue.confidenceLevel}
              </span>
            </div>
          )}

          {/* Takeaways - left-aligned list */}
          {clue.takeaways && clue.takeaways.length > 0 && (
            <div>
              <span
                className="dynamic-text-base font-semibold mb-2 block"
                style={{ color: "white" }}
              >
                Takeaways:
              </span>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
                }}
              >
                {clue.takeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="dynamic-text-base"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
