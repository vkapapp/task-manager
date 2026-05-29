import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

const isProd = process.env.NODE_ENV === 'production'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', details: err.issues })
    return
  }
  if (err instanceof Error) {
    res.status(500).json({ error: isProd ? 'Internal server error' : err.message })
    return
  }
  res.status(500).json({ error: 'Internal server error' })
}
