import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'tasks.db';
const DATABASE_VERSION = 1;

export type Task = {
    id: number;
    title: string;
    completed: number;
    createdAt : string;
};
const db = SQLite.openDatabaseAsync(DATABASE_NAME);

export async function initializeDatabase() {
  const database = await db;

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value INTEGER NOT NULL
    );
  `);

  const version = await database.getFirstAsync<{ value: number }>(
    `SELECT value 
    FROM metadata 
    WHERE key = ?`,'schema_version'
  );

  const currentVersion = version?.value ?? 0;

  if (currentVersion < 1) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_createdAt
      ON tasks(createdAt);
    `);

    await database.runAsync(
      `INSERT OR REPLACE INTO metadata (key, value)
       VALUES (?, ?)`,
      'schema_version',
      DATABASE_VERSION
    );
  }
}