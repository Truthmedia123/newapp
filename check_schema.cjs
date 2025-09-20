const Database = require('better-sqlite3');
const path = require('path');

try {
  const dbPath = path.join(__dirname, '.db', 'dev.db');
  console.log('Checking database at:', dbPath);
  
  const db = new Database(dbPath);
  const columns = db.prepare('PRAGMA table_info(weddings)').all();
  
  console.log('Weddings table columns:');
  columns.forEach(col => {
    console.log(`- ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });
  
  db.close();
} catch (error) {
  console.error('Error checking database schema:', error.message);
}