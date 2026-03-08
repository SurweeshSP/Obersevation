import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'observations.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS experiments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    user_email TEXT
  );

  CREATE TABLE IF NOT EXISTS content_items (
    id TEXT PRIMARY KEY,
    experiment_id TEXT NOT NULL,
    type TEXT NOT NULL,
    position INTEGER NOT NULL,
    section TEXT,
    content TEXT,
    FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS observation_tables (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    title TEXT NOT NULL,
    num_rows INTEGER NOT NULL,
    FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS table_columns (
    id TEXT PRIMARY KEY,
    table_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    unit TEXT,
    position INTEGER NOT NULL,
    FOREIGN KEY (table_id) REFERENCES observation_tables(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sub_columns (
    id TEXT PRIMARY KEY,
    column_id TEXT NOT NULL,
    name TEXT NOT NULL,
    unit TEXT,
    position INTEGER NOT NULL,
    FOREIGN KEY (column_id) REFERENCES table_columns(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    caption TEXT,
    data BLOB NOT NULL,
    mime_type TEXT NOT NULL,
    FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
  );
`);

export default db;
