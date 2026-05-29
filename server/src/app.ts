import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import tasksRouter from './routes/tasks'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }),
)

app.use(express.json())

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', apiLimiter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/tasks', tasksRouter)

app.use(errorHandler)

export default app
