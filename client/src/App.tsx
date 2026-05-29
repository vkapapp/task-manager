import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { useToast } from './hooks/useToast'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { FilterBar } from './components/FilterBar'
import { ToastContainer } from './components/Toast'
import type { Task, CreateTaskDto, UpdateTaskDto } from './types'

function App() {
  const { tasks, loading, error, filters, setFilters, createTask, updateTask, deleteTask } =
    useTasks()
  const { toasts, showToast, removeToast } = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const openCreateForm = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTask(null)
  }

  const handleFormSubmit = async (dto: CreateTaskDto | UpdateTaskDto): Promise<void> => {
    if (editingTask) {
      await updateTask(editingTask.id, dto as UpdateTaskDto)
      showToast('Task updated', 'success')
    } else {
      await createTask(dto as CreateTaskDto)
      showToast('Task created', 'success')
    }
    closeForm()
  }

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteTask(id)
      showToast('Task deleted', 'success')
    } catch {
      showToast('Failed to delete task', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Task Manager</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <FilterBar filters={filters} onChange={setFilters} />
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shrink-0"
          >
            + Add Task
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400">
            <p>Loading tasks...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onEdit={openEditForm}
            onDelete={(id) => void handleDelete(id)}
          />
        )}
      </main>

      {formOpen && (
        <TaskForm
          task={editingTask ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}

export default App
