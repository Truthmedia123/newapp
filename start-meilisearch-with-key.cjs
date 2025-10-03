const { spawn } = require('child_process');

// Start Meilisearch with the correct master key
const meilisearch = spawn('docker', [
  'run', 
  '-it', 
  '--rm', 
  '-p', '7700:7700', 
  '-e', 'MEILI_MASTER_KEY=sp7MZNSdzPOgs_LJi9xux51hJfnX2RMtjt10B8b9qSY',
  'getmeili/meilisearch:v1.10'
]);

meilisearch.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

meilisearch.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

meilisearch.on('close', (code) => {
  console.log(`Meilisearch process exited with code ${code}`);
});