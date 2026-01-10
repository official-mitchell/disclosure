import { PrismaClient, Country, Archetype } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create EXAMPLE test players
  const players = [
    // US Players
    {
      name: '[EXAMPLE] Alice Johnson',
      pin: '1111',
      country: Country.US,
      archetype: Archetype.SCIENTIST,
    },
    {
      name: '[EXAMPLE] David Miller',
      pin: '2222',
      country: Country.US,
      archetype: Archetype.GENERAL,
    },
    {
      name: '[EXAMPLE] Sarah Chen',
      pin: '3333',
      country: Country.US,
      archetype: Archetype.EXECUTIVE,
    },
    {
      name: '[EXAMPLE] Marcus Webb',
      pin: '4444',
      country: Country.US,
      archetype: Archetype.JOURNALIST,
    },
    // Russia Players
    {
      name: '[EXAMPLE] Boris Petrov',
      pin: '5555',
      country: Country.RUSSIA,
      archetype: Archetype.SPY,
    },
    {
      name: '[EXAMPLE] Elena Volkov',
      pin: '6666',
      country: Country.RUSSIA,
      archetype: Archetype.OPERATIVE,
    },
    {
      name: '[EXAMPLE] Dmitri Sokolov',
      pin: '7777',
      country: Country.RUSSIA,
      archetype: Archetype.GENERAL,
    },
    {
      name: '[EXAMPLE] Natasha Ivanov',
      pin: '8888',
      country: Country.RUSSIA,
      archetype: Archetype.SCIENTIST,
    },
    // China Players
    {
      name: '[EXAMPLE] Wei Chen',
      pin: '9999',
      country: Country.CHINA,
      archetype: Archetype.DIPLOMAT,
    },
    {
      name: '[EXAMPLE] Li Huang',
      pin: '0000',
      country: Country.CHINA,
      archetype: Archetype.SCIENTIST,
    },
    {
      name: '[EXAMPLE] Zhang Wei',
      pin: '1234',
      country: Country.CHINA,
      archetype: Archetype.SPY,
    },
    {
      name: '[EXAMPLE] Mei Lin',
      pin: '5678',
      country: Country.CHINA,
      archetype: Archetype.EXECUTIVE,
    },
  ];

  for (const player of players) {
    await prisma.player.upsert({
      where: { name: player.name },
      update: {},
      create: player,
    });
  }

  console.log(`✓ Created ${players.length} EXAMPLE test players`);

  // Create EXAMPLE test characters
  const alicePlayer = await prisma.player.findUnique({
    where: { name: '[EXAMPLE] Alice Johnson' },
  });

  if (alicePlayer) {
    await prisma.character.upsert({
      where: { playerId: alicePlayer.id },
      update: {},
      create: {
        playerId: alicePlayer.id,
        displayName: 'Dr. Alice Johnson',
        nationalityBloc: 'United States',
        occupation: 'Senior Astrophysicist, DARPA Advanced Research Division',
        publicReputation: 'Dr. Johnson is known in academic circles for her groundbreaking work in radio astronomy and her controversial theories about technosignatures. She has published extensively on the detection of non-natural electromagnetic signals and has served as a consultant to several government agencies.',
        portraitUrl: null,
        archetypeTitle: 'The Scientist: Seeker of Truth',
        permissions: [
          'Access to classified astronomical data and SETI intercepts',
          'Authority to request additional telescope time for priority targets',
          'Clearance to review technical specifications of recovered materials',
          'Permission to consult with international scientific collaborators',
        ],
        restrictions: [
          'However, you cannot share raw data with civilian researchers without approval',
          'However, you must not publish findings without security review',
          'However, your analysis must support the official narrative when requested',
        ],
        backstory: `Alice Johnson grew up in rural Montana, spending countless nights stargazing from her family's ranch. Her fascination with the cosmos led her to MIT, where she completed her doctorate in astrophysics at age 26. Her dissertation on anomalous radio signals caught the attention of DARPA recruiters.

For the past decade, she has worked in a classified facility analyzing data that officially doesn't exist. The 2019 Navy UAP videos were just the tip of the iceberg—Alice has spent years studying flight characteristics, propulsion signatures, and communication attempts that defy conventional physics.

She joined this project believing she would help humanity prepare for contact. Instead, she's found herself increasingly complicit in a coverup that spans decades. The weight of what she knows—and cannot say—grows heavier each day.`,
        motivations: [
          {
            label: 'Scientific Truth',
            description: 'You became a scientist to discover truth, not to hide it. Every day you spend concealing evidence feels like a betrayal of everything you once believed in.',
          },
          {
            label: 'Humanity\'s Right to Know',
            description: 'You believe people deserve to know they\'re not alone in the universe. The psychological and philosophical implications should be decided democratically, not by a shadow committee.',
          },
          {
            label: 'Fear of Consequences',
            description: 'You\'ve seen what happens to whistleblowers. Your career, your freedom, perhaps your life—all could vanish if you speak out. Sometimes courage feels like a luxury you can\'t afford.',
          },
        ],
        formalAuthority: 'Director of Special Programs at DARPA. He can end your career with a phone call and has made it clear that operational security is paramount.',
        informalFears: 'Your mentor, Dr. Sarah Chen (EXECUTIVE), who brought you into the program. Disappointing her feels worse than any official reprimand.',
        safelyIgnore: 'Military brass who don\'t understand the science. They need your analysis and can\'t replace you easily.',
        exposureConsequences: `If your involvement becomes public, you face immediate termination and potential prosecution under the Espionage Act. Your security clearance will be revoked, ending your scientific career permanently.

More personally, your family doesn't know what you really do. Your parents still think you study radio astronomy. Learning you've been lying for a decade—and about something this monumental—would devastate them.

There's also the professional betrayal: colleagues who trusted you with data, who believed you were working toward disclosure, who don't know you've been analyzing recovered technology while publicly dismissing UFO claims.`,
        privateWant: `You want to be the one who reveals the truth to the world—not as a whistleblower fleeing to Moscow, but as a scientist presenting peer-reviewed evidence that changes human history forever.

You dream of the press conference: standing at a podium, showing the data, watching humanity's cosmic perspective shift in real-time. You want your name in history books not as a pariah, but as the person who proved we're not alone.

But that fantasy requires a level of institutional support that may never come. So perhaps what you really want is simply permission—official clearance to tell your parents, your colleagues, the world. You're tired of being brilliant and burdened and silent.`,
        disclosureBelief: `"Disclosure is inevitable, but control over its timing is power. The question isn't whether humanity can handle the truth—it's whether those in power can handle losing their monopoly on it.

Every day we wait, we make the eventual revelation more catastrophic. The longer the lie, the deeper the betrayal. We're not protecting people from the truth—we're protecting institutions from accountability for decades of deception."`,
        canDiscuss: [
          'The existence of unexplained aerial phenomena and recovered materials',
          'Technical aspects of propulsion systems beyond current human capability',
          'Timeline of government awareness and investigation programs',
          'Scientific implications for physics and consciousness',
        ],
        mustConceal: [
          'Specific locations of recovered craft and ongoing analysis facilities',
          'Names of other scientists and military personnel involved in programs',
          'Communication attempts and any potential responses received',
          'Your personal doubts about whether disclosure should happen',
        ],
      },
    });
    console.log('✓ Created character for Alice Johnson');
  }

  // Create EXAMPLE test clues
  const clues = [
    // Phase 1 - Released to all
    {
      id: 'example-clue-1',
      title: '[EXAMPLE] Intercepted Transmission - PHOENIX',
      phase: 1,
      targetType: 'all' as any,
      targetValue: null,
      legitimacy: 'verified' as any,
      confidentiality: 'top_secret' as any,
      originCountry: 'US',
      eventDate: 'March 14, 1962',
      backstory:
        'A coded transmission was intercepted from an unknown source. Intelligence analysts have determined it contains references to a classified project codenamed PHOENIX. The transmission appears to originate from a remote facility in the Nevada desert.',
      confidenceLevel: 'high' as any,
      supportingIntel:
        'Signal triangulation places the source near coordinates 37.2431° N, 115.7930° W. This location matches the suspected site of a classified Air Force installation. Radio frequency analysis indicates the use of military-grade encryption protocols.',
      source: 'NSA SIGINT Division - Fort Meade',
      takeaways: [
        'Project PHOENIX is active and operating from a classified facility',
        'Unknown entities are attempting to communicate using military channels',
        'The transmission frequency suggests non-terrestrial origin',
      ],
      released: true,
      releasedAt: new Date(),
    },
    // Phase 1 - US Only
    {
      id: 'example-clue-2',
      title: '[EXAMPLE] Roswell Incident Report - Classified',
      phase: 1,
      targetType: 'country' as any,
      targetValue: 'US',
      legitimacy: 'suspected' as any,
      confidentiality: 'top_secret' as any,
      originCountry: 'US',
      eventDate: 'July 8, 1947',
      backstory:
        'Declassified documents reveal that the "weather balloon" explanation for the Roswell incident was a cover story. Debris recovered from the crash site exhibited properties inconsistent with known terrestrial materials. Multiple military personnel reported observing non-human entities.',
      confidenceLevel: 'medium' as any,
      supportingIntel:
        'Witness testimony from Major Jesse Marcel confirms unusual debris characteristics. Material samples showed memory metal properties and hieroglyphic-like markings. Original Army Air Forces press release referred to a "flying disc" before being retracted.',
      source: 'Air Force Project Blue Book - Declassified',
      takeaways: [
        'Official Roswell narrative may have been fabricated',
        'Non-terrestrial craft may have crashed in New Mexico',
        'US military has been recovering anomalous materials since 1947',
      ],
      released: false,
    },
    // Phase 2 - Scientists only
    {
      id: 'example-clue-3',
      title: '[EXAMPLE] Biological Analysis - Unknown Origin',
      phase: 2,
      targetType: 'archetype' as any,
      targetValue: 'SCIENTIST',
      legitimacy: 'verified' as any,
      confidentiality: 'confidential' as any,
      originCountry: 'US',
      eventDate: 'January 15, 2020',
      backstory:
        'Laboratory analysis of recovered biological samples reveals DNA structures unlike any known terrestrial life. The samples exhibit unprecedented complexity with apparent engineered characteristics. The genetic material contains repeated patterns that may represent a form of encoded information.',
      confidenceLevel: 'confirmed' as any,
      supportingIntel:
        'MIT genomics lab confirms non-terrestrial origin with 99.7% certainty. DNA contains base pairs beyond the standard ATCG found in Earth life. Sample age dating suggests origin predates earliest known life on Earth by 2 billion years.',
      source: 'MIT Biological Research Laboratory',
      takeaways: [
        'Evidence of non-terrestrial biological entities confirmed',
        'Genetic engineering capabilities far exceed human technology',
        'Samples may represent ancient seeding of life on Earth',
      ],
      released: false,
    },
    // Phase 2 - Russia only
    {
      id: 'example-clue-4',
      title: '[EXAMPLE] Tunguska Event - New Evidence',
      phase: 2,
      targetType: 'country' as any,
      targetValue: 'RUSSIA',
      legitimacy: 'suspected' as any,
      confidentiality: 'shareable_if_pressed' as any,
      originCountry: 'Russia',
      eventDate: 'June 30, 1908',
      backstory:
        'Recent analysis of the 1908 Tunguska explosion suggests it was not a meteor or comet impact. Eyewitness accounts describe a cylindrical object changing direction before the blast. The blast pattern is inconsistent with natural impacts and shows evidence of controlled detonation.',
      confidenceLevel: 'medium' as any,
      supportingIntel:
        'Soviet expeditions in the 1960s recovered metallic fragments with anomalous isotope ratios. No impact crater was ever found despite the enormous explosion. Tree damage patterns suggest a mid-air detonation from a moving object.',
      source: 'Russian Academy of Sciences - Historical Archive',
      takeaways: [
        'Tunguska event may have been a controlled craft malfunction',
        'Evidence suggests intelligent guidance of the object',
        'Soviet government suppressed findings for decades',
      ],
      released: false,
    },
    // Phase 3 - China Diplomats
    {
      id: 'example-clue-5',
      title: '[EXAMPLE] Beijing Summit - Secret Protocols',
      phase: 3,
      targetType: 'archetype' as any,
      targetValue: 'DIPLOMAT',
      legitimacy: 'verified' as any,
      confidentiality: 'top_secret' as any,
      originCountry: 'China',
      eventDate: 'November 3, 2023',
      backstory:
        'A secret international summit was held in Beijing involving representatives from all major powers. The agenda focused on coordinating a unified response to undeniable proof of non-human intelligence. Attendees signed strict non-disclosure agreements with severe penalties.',
      confidenceLevel: 'confirmed' as any,
      supportingIntel:
        'Leaked diplomatic cables confirm attendance by senior officials from 47 nations. Discussion topics included disclosure timelines, public communication strategies, and economic impact mitigation. China proposed a 10-year gradual disclosure plan.',
      source: 'Ministry of Foreign Affairs - Eyes Only',
      takeaways: [
        'All major governments are aware of alien presence',
        'Coordinated disclosure timeline has been established',
        'Economic and social disruption is a primary concern',
      ],
      released: false,
    },
    // Phase 3 - All countries (not released)
    {
      id: 'example-clue-6',
      title: '[EXAMPLE] Operation MAJESTIC - Full Disclosure',
      phase: 3,
      targetType: 'all' as any,
      targetValue: null,
      legitimacy: 'verified' as any,
      confidentiality: 'top_secret' as any,
      originCountry: 'US',
      eventDate: 'September 24, 1947',
      backstory:
        'President Truman established MJ-12, a secret committee of scientists, military leaders, and government officials to manage all aspects of the extraterrestrial presence. The group has operated continuously for 76 years with complete autonomy and unlimited black budget funding.',
      confidenceLevel: 'confirmed' as any,
      supportingIntel:
        'Original Truman memo authenticated by forensic document analysis. Committee maintained facilities at Area 51, S-4, and Dulce Base. Members included Vannevar Bush, James Forrestal, and Werner von Braun. Current membership remains classified.',
      source: 'Majestic-12 Archive - Document #001',
      takeaways: [
        'Shadow government has managed alien contact for 76 years',
        'Technology exchange programs have been active since 1954',
        'Public has been systematically deceived by coordinated disinformation',
      ],
      released: false,
    },
  ];

  for (const clue of clues) {
    await prisma.clue.upsert({
      where: { id: clue.id },
      update: {},
      create: clue,
    });
  }

  console.log(`✓ Created ${clues.length} EXAMPLE test clues`);
  console.log('\n✅ Seeding complete!');
  console.log('\n📝 EXAMPLE Test Credentials:');
  console.log('\nPlayers (PIN is just repeated digits):');
  console.log('  US:');
  console.log('    - [EXAMPLE] Alice Johnson (SCIENTIST) - PIN: 1111');
  console.log('    - [EXAMPLE] David Miller (GENERAL) - PIN: 2222');
  console.log('    - [EXAMPLE] Sarah Chen (EXECUTIVE) - PIN: 3333');
  console.log('    - [EXAMPLE] Marcus Webb (JOURNALIST) - PIN: 4444');
  console.log('  RUSSIA:');
  console.log('    - [EXAMPLE] Boris Petrov (SPY) - PIN: 5555');
  console.log('    - [EXAMPLE] Elena Volkov (OPERATIVE) - PIN: 6666');
  console.log('    - [EXAMPLE] Dmitri Sokolov (GENERAL) - PIN: 7777');
  console.log('    - [EXAMPLE] Natasha Ivanov (SCIENTIST) - PIN: 8888');
  console.log('  CHINA:');
  console.log('    - [EXAMPLE] Wei Chen (DIPLOMAT) - PIN: 9999');
  console.log('    - [EXAMPLE] Li Huang (SCIENTIST) - PIN: 0000');
  console.log('    - [EXAMPLE] Zhang Wei (SPY) - PIN: 1234');
  console.log('    - [EXAMPLE] Mei Lin (EXECUTIVE) - PIN: 5678');
  console.log('\n🔐 GM Password: admin123 (from .env GM_PASSWORD)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
