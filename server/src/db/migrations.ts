import db from './index'

export function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      status      TEXT    NOT NULL DEFAULT 'todo',
      priority    TEXT    NOT NULL DEFAULT 'medium',
      created_at  TEXT    NOT NULL,
      updated_at  TEXT    NOT NULL
    )
  `)
}
