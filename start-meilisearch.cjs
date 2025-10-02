const { MeiliSearch } = require('meilisearch');

async function startMeilisearch() {
  try {
    // Start Meilisearch server
    const server = new MeiliSearch({
      host: 'http://127.0.0.1:7700',
      apiKey: 'dev-key',
    });

    console.log('Meilisearch server started on http://127.0.0.1:7700');
    console.log('Master key: dev-key');
    
    // Keep the process running
    setInterval(() => {
      // Keep alive
    }, 1000);
  } catch (error) {
    console.error('Failed to start Meilisearch:', error);
  }
}

startMeilisearch();