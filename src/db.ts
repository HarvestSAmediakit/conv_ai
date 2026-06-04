import Database from 'better-sqlite3';
import path from 'path';

// Define the path to the SQLite database file
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.sqlite' 
  : path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS publishers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS magazines (
      id TEXT PRIMARY KEY,
      publisherId TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      coverUrl TEXT,
      pdfUrl TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      aiEnabled INTEGER NOT NULL DEFAULT 0,
      aiPersonality TEXT,
      aiContext TEXT,
      ttsEnabled INTEGER NOT NULL DEFAULT 0,
      chatEnabled INTEGER NOT NULL DEFAULT 0,
      viewCount INTEGER NOT NULL DEFAULT 0,
      listenCount INTEGER NOT NULL DEFAULT 0,
      pageCount INTEGER DEFAULT 0,
      FOREIGN KEY (publisherId) REFERENCES publishers (id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS bookshelves (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      publisherId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (publisherId) REFERENCES publishers (id)
    );

    CREATE TABLE IF NOT EXISTS bookshelf_magazines (
      bookshelfId TEXT NOT NULL,
      magId TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (bookshelfId, magId),
      FOREIGN KEY (bookshelfId) REFERENCES bookshelves (id) ON DELETE CASCADE,
      FOREIGN KEY (magId) REFERENCES magazines (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS docupipe_extractions (
      id TEXT PRIMARY KEY,
      fileName TEXT NOT NULL,
      schemaId TEXT,
      schemaName TEXT,
      documentId TEXT,
      jobId TEXT,
      standardizationId TEXT,
      status TEXT NOT NULL,
      resultJson TEXT,
      error TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT (datetime('now')),
      updated_at TIMESTAMPTZ DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding TEXT NOT NULL, -- Stored as JSON string of float array
      metadata TEXT, -- JSON metadata
      created_at TIMESTAMPTZ DEFAULT (datetime('now')),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      stripe_customer_id TEXT NOT NULL,
      stripe_subscription_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TIMESTAMPTZ,
      ended_at TIMESTAMPTZ
    );
  `);

  // Run schema migration for existing databases
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN pageCount INTEGER DEFAULT 0;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN aiContext TEXT;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN hardcover INTEGER DEFAULT 0;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN themeBackground TEXT DEFAULT 'slate';`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN soundEnabled INTEGER DEFAULT 1;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN logoUrl TEXT;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN rtl INTEGER DEFAULT 0;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE magazines ADD COLUMN pageTransitionsSpeed INTEGER DEFAULT 1000;`);
  } catch (err) {}

  // Insert initial mock data if empty
  const publishersCount = db.prepare('SELECT count(*) as count FROM publishers').get() as { count: number };
  if (publishersCount.count === 0) {
    const insertPublisher = db.prepare('INSERT INTO publishers (id, name, slug, createdAt) VALUES (?, ?, ?, ?)');
    insertPublisher.run('pub_1', 'TechNews Media', 'technews', new Date().toISOString());
    insertPublisher.run('pub_2', 'Vogue Publishing', 'vogue', new Date().toISOString());

    const insertMagazine = db.prepare(`
      INSERT INTO magazines 
      (id, publisherId, title, slug, coverUrl, pdfUrl, status, createdAt, aiEnabled, aiPersonality, ttsEnabled, chatEnabled, viewCount, listenCount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMagazine.run(
      'mag_1', 'pub_1', 'The AI Issue 2024', 'ai-issue-2024',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=400',
      'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      'published', new Date().toISOString(), 1, 'Professional', 1, 1, 1450, 320
    );

    insertMagazine.run(
      'mag_2', 'pub_2', 'Winter Collection', 'winter-collection-24',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400',
      'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      'published', new Date().toISOString(), 1, 'Casual', 1, 0, 8200, 50
    );

    insertMagazine.run(
      'mag_3', 'pub_1', 'Q3 Developer Report', 'q3-dev-report',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400',
      '',
      'draft', new Date().toISOString(), 0, null, 0, 0, 0, 0
    );
  }
};

initDb();

export default db;
