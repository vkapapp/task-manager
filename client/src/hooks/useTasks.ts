import { useState, useEffect } from 'react'
import { tasksApi } from '../api/tasks'
import type { Task, TaskStatus, TaskPriority, CreateTaskDto, UpdateTaskDto } from '../types'

export interface FilterParams {
  status?: TaskStatus
  priority?: TaskPriority
}

export interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  filters: FilterParams
  setFilters: (f: FilterParams) => void
  createTask: (dto: CreateTaskDto) => Promise<void>
  updateTask: (id: number, dto: UpdateTaskDto) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<FilterParams>({})
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    tasksApi
      .getAll(filters)
      .then((data) => {
        if (active) {
          setTasks(data)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load tasks')
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [filters, tick])

  const triggerRefetch = () => {
    setLoading(true)
    setError(null)
    setTick((t) => t + 1)
  }

  const setFilters = (f: FilterParams) => {
    setLoading(true)
    setError(null)
    setFiltersState(f)
  }

  const createTask = async (dto: CreateTaskDto): Promise<void> => {
    await tasksApi.create(dto)
    triggerRefetch()
  }

  const updateTask = async (id: number, dto: UpdateTaskDto): Promise<void> => {
    await tasksApi.update(id, dto)
    triggerRefetch()
  }

  const deleteTask = async (id: number): Promise<void> => {
    await tasksApi.remove(id)
    triggerRefetch()
  }

  return { tasks, loading, error, filters, setFilters, createTask, updateTask, deleteTask }
}
