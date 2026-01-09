import { PrismaClient, Country, Archetype } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test players
  const players = [
    {
      name: 'Alice Johnson',
      pin: '1234',
      country: Country.US,
      archetype: Archetype.SCIENTIST,
    },
    {
      name: 'Boris Petrov',
      pin: '5678',
      country: Country.RUSSIA,
      archetype: Archetype.SPY,
    },
    {
      name: 'Chen Wei',
      pin: '9012',
      country: Country.CHINA,
      archetype: Archetype.DIPLOMAT,
    },
    {
      name: 'David Miller',
      pin: '3456',
      country: Country.US,
      archetype: Archetype.GENERAL,
    },
    {
      name: 'Elena Volkov',
      pin: '7890',
      country: Country.RUSSIA,
      archetype: Archetype.OPERATIVE,
    },
  ];

  for (const player of players) {
    await prisma.player.upsert({
      where: { name: player.name },
      update: {},
      create: player,
    });
  }

  console.log(`✓ Created ${players.length} test players`);

  // Create a test clue
  const clue = await prisma.clue.upsert({
    where: { id: 'test-clue-1' },
    update: {},
    create: {
      id: 'test-clue-1',
      title: 'Intercepted Transmission - PHOENIX',
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
      released: false,
    },
  });

  console.log('✓ Created test clue:', clue.title);
  console.log('\n✅ Seeding complete!');
  console.log('\nTest credentials:');
  console.log('Player: Alice Johnson, PIN: 1234');
  console.log('Player: Boris Petrov, PIN: 5678');
  console.log('Player: Chen Wei, PIN: 9012');
  console.log('GM Password: admin123 (from .env)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
