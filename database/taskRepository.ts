import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'tasks.db';
const DATABASE_VERSION = 1;

export type Task = {
    id: number;
    title: string;
    completed: number;
    createdAt: string;
};
const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

export async function initializeDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value INTEGER NOT NULL
    );
  `);

  const version = await db.getFirstAsync<{ value: number }>(
    `SELECT value 
    FROM metadata 
    WHERE key = ?`,
    'schema_version'
  );

  const currentVersion = version?.value ?? 0;

  if (currentVersion < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_completed
      ON tasks(completed);
    `);

    await db.runAsync(
      `INSERT OR REPLACE INTO metadata (key, value)
       VALUES (?, ?)`,
      'schema_version',
      DATABASE_VERSION
    );
  }
}

export async function createTask(title: string) {
    const createdAt = new Date().toString();

    const result = await db.runAsync(
        `INSERT INTO tasks (title, completed, createdAt)
        VALUES (?, ?, ?)`,
        title, 0, createdAt
    );

    return result.lastInsertRowId
}

export async function getAllTasks() {
    const tasks = await db.getAllAsync(
        `SELECT * FROM tasks ORDER BY id ASC`
    );

    return tasks;
}

export async function getTaskById(id: number) {
    const task = await db.getFirstAsync(
        `SELECT * FROM tasks
        WHERE id = ?`,
        id
    );

    return task;
}

export async function updateTask(id: number, completed: number) {
    await db.runAsync(
        `UPDATE tasks
        SET completed = ?
        WHERE id = ?`,
        id,
        completed
    )
}

export async function deleteTask(id: number) {
    await db.runAsync(
        `DELETE FROM tasks
        WHERE id = ?`,
        id
    )
}