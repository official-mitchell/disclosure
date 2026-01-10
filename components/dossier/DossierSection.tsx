"use client";

import { useState, useEffect, ReactNode } from "react";

interface DossierSectionProps {
  sectionNumber: number;
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  storageKey: string;
}

export default function DossierSection({
  sectionNumber,
  title,
  children,
  defaultExpanded = false,
  storageKey,
}: DossierSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [mounted, setMounted] = useState(false);

  // Load preference from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsExpanded(saved === "true");
    }
  }, [storageKey]);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (mounted) {
      localStorage.setItem(storageKey, String(newState));
    }
  };

  return (
    <div
      className="shadow-lg relative overflow-visible w-full"
      style={{
        borderRadius: 0,
        backgroundColor: "#f4e8d0",
        marginBottom: 0,
        border: "4px solid rgba(180, 83, 9, 0.3)",
      }}
    >
      <div className="relative z-10">
        {/* Clickable Header - No padding, flush with borders */}
        <button
          onClick={toggleExpanded}
          className="w-full text-left flex items-center justify-between group hover:opacity-80 transition-opacity"
          style={{
            padding: "clamp(0.75rem, 2vw, 1rem)",
            borderBottom: "2px solid #92400e",
          }}
        >
          <h2
            className="text-xl sm:text-2xl font-bold typewriter-font stamp-effect flex-1"
            style={{
              color: "#2d1810",
              fontSize: "clamp(1.5625rem, 3.75vw, 2.5rem)",
            }}
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶
            </span>{" "}
            SECTION {sectionNumber}: {title}
          </h2>
        </button>

        {/* Collapsible Content - Padding only on content */}
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: isExpanded ? "5000px" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div style={{ padding: "clamp(1rem, 3vw, 2rem)" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
