'use client';

import { useEffect, useState } from 'react';
import DossierHeader from './DossierHeader';
import DossierSection from './DossierSection';
import PermissionsSection from './PermissionsSection';
import BackstorySection from './BackstorySection';
import MotivationsSection from './MotivationsSection';
import AuthoritySection from './AuthoritySection';
import ExposureSection from './ExposureSection';
import PrivateWantSection from './PrivateWantSection';
import DisclosureSection from './DisclosureSection';
import BoundariesSection from './BoundariesSection';
import CountryWatermark from './CountryWatermark';
import ClassifiedStamp from './ClassifiedStamp';

interface Motivation {
  label: string;
  description: string;
}

interface Character {
  id: string;
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  publicReputation: string;
  portraitUrl?: string | null;
  archetypeTitle: string;
  permissions: string[];
  restrictions: string[];
  backstory: string;
  motivations: Motivation[];
  formalAuthority: string;
  informalFears: string;
  safelyIgnore: string;
  exposureConsequences: string;
  privateWant: string;
  disclosureBelief: string;
  canDiscuss: string[];
  mustConceal: string[];
}

export default function DossierPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch('/api/player/dossier');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch character');
        }

        setCharacter(data.character);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading dossier...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-100 mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Character not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Country Watermark */}
      <CountryWatermark country={character.nationalityBloc} />

      {/* Folder Tab Header */}
      <div className="mb-4 sm:mb-6 relative">
        <div className="folder-tab inline-block px-4 sm:px-8 py-2 sm:py-3 rounded-t-lg">
          <h1 className="text-lg sm:text-2xl font-bold typewriter-font stamp-effect" style={{ color: '#2d1810' }}>
            CLASSIFIED PERSONNEL DOSSIER
          </h1>
        </div>
        <div className="hidden sm:block">
          <ClassifiedStamp type="top_secret" position="top-right" />
        </div>
      </div>

      <DossierHeader
        displayName={character.displayName}
        nationalityBloc={character.nationalityBloc}
        occupation={character.occupation}
        publicReputation={character.publicReputation}
        portraitUrl={character.portraitUrl}
      />

      <DossierSection
        sectionNumber={1}
        title="CLEARANCE & PERMISSIONS"
        defaultExpanded={true}
        storageKey="dossier-section-1"
      >
        <PermissionsSection
          archetypeTitle={character.archetypeTitle}
          permissions={character.permissions}
          restrictions={character.restrictions}
        />
      </DossierSection>

      <DossierSection
        sectionNumber={2}
        title="BACKGROUND [EYES ONLY]"
        defaultExpanded={true}
        storageKey="dossier-section-2"
      >
        <BackstorySection backstory={character.backstory} />
      </DossierSection>

      <DossierSection
        sectionNumber={3}
        title="PSYCHOLOGICAL PROFILE"
        defaultExpanded={true}
        storageKey="dossier-section-3"
      >
        <MotivationsSection motivations={character.motivations} />
      </DossierSection>

      <DossierSection
        sectionNumber={4}
        title="CHAIN OF COMMAND"
        defaultExpanded={true}
        storageKey="dossier-section-4"
      >
        <AuthoritySection
          formalAuthority={character.formalAuthority}
          informalFears={character.informalFears}
          safelyIgnore={character.safelyIgnore}
        />
      </DossierSection>

      <DossierSection
        sectionNumber={5}
        title="EXPOSURE RISK ASSESSMENT"
        defaultExpanded={false}
        storageKey="dossier-section-5"
      >
        <ExposureSection
          exposureConsequences={character.exposureConsequences}
        />
      </DossierSection>

      <DossierSection
        sectionNumber={6}
        title="CLASSIFIED — PRIVATE OBJECTIVES"
        defaultExpanded={false}
        storageKey="dossier-section-6"
      >
        <PrivateWantSection privateWant={character.privateWant} />
      </DossierSection>

      <DossierSection
        sectionNumber={7}
        title="DISCLOSURE ASSESSMENT"
        defaultExpanded={false}
        storageKey="dossier-section-7"
      >
        <DisclosureSection
          disclosureBelief={character.disclosureBelief}
          displayName={character.displayName}
        />
      </DossierSection>

      <DossierSection
        sectionNumber={8}
        title="OPERATIONAL BOUNDARIES"
        defaultExpanded={false}
        storageKey="dossier-section-8"
      >
        <BoundariesSection
          canDiscuss={character.canDiscuss}
          mustConceal={character.mustConceal}
        />
      </DossierSection>
    </div>
  );
}
