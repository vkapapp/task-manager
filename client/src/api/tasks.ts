import type { Task, TaskStatus, TaskPriority, CreateTaskDto, UpdateTaskDto } from '../types'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Request failed: HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as unknown as T
  const data: unknown = await res.json()
  return data as T
}

export const tasksApi = {
  getAll(params?: { status?: TaskStatus; priority?: TaskPriority }): Promise<Task[]> {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.priority) query.set('priority', params.priority)
    const qs = query.toString()
    return request<Task[]>(`/api/tasks${qs ? `?${qs}` : ''}`)
  },

  create(dto: CreateTaskDto): Promise<Task> {
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  update(id: number, dto: UpdateTaskDto): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  remove(id: number): Promise<void> {
    return request<void>(`/api/tasks/${id}`, { method: 'DELETE' })
  },
}
