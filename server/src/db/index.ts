import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'tasks.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export default db
