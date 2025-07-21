// Create realistic sample data for testing
const sampleData = [
  {
    competitor: "Notion",
    title: "Enhanced Table Filtering and New Calendar View",
    content: "We've rolled out powerful new table filtering options that let you create complex queries with AND/OR logic. Plus, our redesigned calendar view now supports drag-and-drop scheduling and better mobile responsiveness.",
    category: "Feature",
    impact: "High",
    url: "https://notion.so/changelog/enhanced-table-filtering",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    competitor: "Linear",
    title: "Sidebar Customization and Keyboard Shortcuts",
    content: "Teams can now customize their sidebar layout with drag-and-drop organization. We've also added 15 new keyboard shortcuts for faster issue management and improved the search performance by 40%.",
    category: "UI Update",
    impact: "Medium",
    url: "https://linear.app/changelog/sidebar-customization",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    competitor: "GitHub",
    title: "GitHub Copilot Chat Integration in Pull Requests",
    content: "GitHub Copilot Chat is now integrated directly into pull request reviews. Developers can ask Copilot to explain code changes, suggest improvements, and generate test cases right from the PR interface.",
    category: "Integration",
    impact: "High",
    url: "https://github.blog/changelog/copilot-pr-integration",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    competitor: "Vercel",
    title: "Edge Runtime Performance Improvements",
    content: "Cold start times reduced by 60% and memory usage optimized for Edge Runtime functions. New automatic scaling based on traffic patterns and improved error reporting for debugging.",
    category: "Performance",
    impact: "High",
    url: "https://vercel.com/changelog/edge-runtime-improvements",
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    competitor: "Supabase",
    title: "Database Migrations UI and Real-time Subscriptions",
    content: "New visual database migration tool in the dashboard makes schema changes easier. Enhanced real-time subscriptions now support row-level security and can handle 10x more concurrent connections.",
    category: "Feature",
    impact: "High",
    url: "https://supabase.com/changelog/migrations-ui",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    competitor: "Figma",
    title: "Advanced Prototyping with Smart Animate",
    content: "Smart Animate now supports component variants and nested instances. New interaction triggers include voice commands and device orientation changes. Performance improved for complex prototypes.",
    category: "Feature",
    impact: "Medium",
    url: "https://figma.com/release-notes/smart-animate",
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  }
];

async function createSampleUpdates() {
  console.log('🌱 Creating sample update data...');
  
  for (const data of sampleData) {
    try {
      // Get competitor ID
      const competitorResponse = await fetch('http://localhost:5000/api/competitors');
      const competitors = await competitorResponse.json();
      const competitor = competitors.find(c => c.name === data.competitor);
      
      if (!competitor) {
        console.log(`❌ Competitor ${data.competitor} not found`);
        continue;
      }

      // Create update
      const updateResponse = await fetch('http://localhost:5000/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorId: competitor.id,
          title: data.title,
          content: data.content,
          url: data.url,
          publishedAt: data.publishedAt.toISOString()
        })
      });

      if (!updateResponse.ok) {
        console.log(`❌ Failed to create update for ${data.competitor}`);
        continue;
      }

      const update = await updateResponse.json();
      console.log(`✓ Created update: ${data.title}`);

      // Create classification
      const classificationResponse = await fetch('http://localhost:5000/api/classifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updateId: update.id,
          category: data.category,
          impact: data.impact,
          confidence: 0.95,
          summary: data.content.substring(0, 150) + '...'
        })
      });

      if (classificationResponse.ok) {
        console.log(`  ✓ Added classification: ${data.category} (${data.impact} impact)`);
      }

    } catch (error) {
      console.error(`❌ Error creating sample data for ${data.competitor}:`, error);
    }
  }

  console.log('🎉 Sample data creation completed!');
}

createSampleUpdates();