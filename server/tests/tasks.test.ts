import { describe, it, expect } from 'vitest'
import { createTaskSchema, updateTaskSchema } from '../src/middleware/validate'

describe('createTaskSchema', () => {
  it('accepts valid data', () => {
    const result = createTaskSchema.safeParse({ title: 'Buy milk', priority: 'high' })
    expect(result.success).toBe(true)
  })

  it('accepts minimal data (title only)', () => {
    const result = createTaskSchema.safeParse({ title: 'Buy milk' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.priority).toBeUndefined()
    }
  })

  it('rejects missing title', () => {
    const result = createTaskSchema.safeParse({ priority: 'low' })
    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = createTaskSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects whitespace-only title', () => {
    const result = createTaskSchema.safeParse({ title: '   ' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid priority', () => {
    const result = createTaskSchema.safeParse({ title: 'Test', priority: 'urgent' })
    expect(result.success).toBe(false)
  })
})

describe('updateTaskSchema', () => {
  it('accepts valid partial update', () => {
    const result = updateTaskSchema.safeParse({ status: 'done' })
    expect(result.success).toBe(true)
  })

  it('accepts multiple fields', () => {
    const result = updateTaskSchema.safeParse({ title: 'Updated', priority: 'low', status: 'in_progress' })
    expect(result.success).toBe(true)
  })

  it('rejects empty object', () => {
    const result = updateTaskSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = updateTaskSchema.safeParse({ status: 'archived' })
    expect(result.success).toBe(false)
  })

  it('accepts null description to clear the field', () => {
    const result = updateTaskSchema.safeParse({ description: null })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toBeNull()
    }
  })
})
