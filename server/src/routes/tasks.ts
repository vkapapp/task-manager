import { Router } from 'express'
import db from '../db/index'
import { validate, createTaskSchema, updateTaskSchema } from '../middleware/validate'
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/index'

const router = Router()

router.get('/', (req, res) => {
  const { status, priority } = req.query as Record<string, string | undefined>

  let query = 'SELECT * FROM tasks'
  const params: string[] = []
  const conditions: string[] = []

  if (status) {
    conditions.push('status = ?')
    params.push(status)
  }
  if (priority) {
    conditions.push('priority = ?')
    params.push(priority)
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  query += ' ORDER BY created_at DESC'

  const tasks = db.prepare(query).all(...params) as Task[]
  res.json(tasks)
})

router.post('/', validate(createTaskSchema), (req, res) => {
  const dto = req.body as CreateTaskDto
  const now = new Date().toISOString()

  const stmt = db.prepare(
    'INSERT INTO tasks (title, description, status, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
  )
  const result = stmt.run(dto.title, dto.description ?? null, 'todo', dto.priority ?? 'medium', now, now)

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task
  res.status(201).json(task)
})

router.patch('/:id', validate(updateTaskSchema), (req, res) => {
  const id = Number(req.params.id)
  const dto = req.body as UpdateTaskDto

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined
  if (!existing) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  const fields = Object.keys(dto) as (keyof UpdateTaskDto)[]
  const setClauses = fields.map((f) => `${f} = ?`).join(', ')
  const values = fields.map((f) => dto[f] ?? null)
  const now = new Date().toISOString()

  db.prepare(`UPDATE tasks SET ${setClauses}, updated_at = ? WHERE id = ?`).run(...values, now, id)

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task
  res.json(updated)
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM tasks WHERE id = ?').get(id)
  if (!existing) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
  res.status(204).send()
})

export default router
