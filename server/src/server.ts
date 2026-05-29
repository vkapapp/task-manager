import app from './app'
import { runMigrations } from './db/migrations'

const PORT = process.env.PORT ?? 3001

runMigrations()

const server = app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    process.stderr.write(`Port ${PORT} is already in use\n`)
    process.exit(1)
  }
  throw err
})
