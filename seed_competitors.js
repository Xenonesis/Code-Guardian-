// Seed script to add real competitors and sources for testing
import { db } from './server/db.ts';
import { competitors, sources } from './shared/schema.ts';

async function seedCompetitors() {
  console.log('🌱 Seeding competitor data...');

  // Define competitors with real changelog URLs
  const competitorData = [
    // Productivity & PM Tools
    {
      name: 'Notion',
      description: 'All-in-one workspace for notes, docs, and collaboration',
      website: 'https://notion.so',
      sources: [
        { url: 'https://www.notion.so/changelog', type: 'changelog', frequency: 'daily' }
      ]
    },
    {
      name: 'ClickUp',
      description: 'Productivity platform for teams',
      website: 'https://clickup.com',
      sources: [
        { url: 'https://clickup.com/blog/product-updates/', type: 'changelog', frequency: 'daily' }
      ]
    },
    {
      name: 'Linear',
      description: 'Issue tracking for software teams',
      website: 'https://linear.app',
      sources: [
        { url: 'https://linear.app/changelog', type: 'changelog', frequency: 'daily' }
      ]
    },
    {
      name: 'Trello',
      description: 'Kanban-style project management',
      website: 'https://trello.com',
      sources: [
        { url: 'https://trello.com/en/release-notes', type: 'changelog', frequency: 'weekly' }
      ]
    },
    {
      name: 'Coda',
      description: 'Document editor that blends docs and databases',
      website: 'https://coda.io',
      sources: [
        { url: 'https://coda.io/updates', type: 'changelog', frequency: 'weekly' }
      ]
    },
    // Developer Tools
    {
      name: 'GitHub',
      description: 'Code hosting and collaboration platform',
      website: 'https://github.com',
      sources: [
        { url: 'https://github.blog/changelog/', type: 'changelog', frequency: 'daily' }
      ]
    },
    {
      name: 'Vercel',
      description: 'Frontend cloud platform',
      website: 'https://vercel.com',
      sources: [
        { url: 'https://vercel.com/changelog', type: 'changelog', frequency: 'daily' }
      ]
    },
    {
      name: 'Supabase',
      description: 'Open source Firebase alternative',
      website: 'https://supabase.com',
      sources: [
        { url: 'https://supabase.com/changelog', type: 'changelog', frequency: 'daily' }
      ]
    },
    // AI & Design
    {
      name: 'Figma',
      description: 'Collaborative design tool',
      website: 'https://figma.com',
      sources: [
        { url: 'https://help.figma.com/hc/en-us/sections/4407747357719-Release-notes', type: 'changelog', frequency: 'weekly' }
      ]
    },
    {
      name: 'Framer',
      description: 'Website builder for designers',
      website: 'https://framer.com',
      sources: [
        { url: 'https://www.framer.com/updates/', type: 'changelog', frequency: 'weekly' }
      ]
    }
  ];

  // Insert competitors and their sources
  for (const comp of competitorData) {
    try {
      // Create competitor
      const [competitor] = await db.insert(competitors).values({
        name: comp.name,
        description: comp.description,
        website: comp.website,
        isActive: true
      }).returning();

      console.log(`✓ Added competitor: ${competitor.name}`);

      // Add sources for this competitor
      for (const sourceData of comp.sources) {
        await db.insert(sources).values({
          competitorId: competitor.id,
          url: sourceData.url,
          type: sourceData.type,
          frequency: sourceData.frequency,
          isActive: true,
          lastStatus: 'pending'
        });

        console.log(`  ✓ Added source: ${sourceData.url}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${comp.name}:`, error);
    }
  }

  console.log('🎉 Seeding completed!');
}

// Run seeding
seedCompetitors().catch(console.error);