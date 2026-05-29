import type { FilterParams } from '../hooks/useTasks'
import type { TaskStatus, TaskPriority } from '../types'

interface FilterBarProps {
  filters: FilterParams
  onChange: (f: FilterParams) => void
}

const STATUS_OPTIONS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.status ?? ''}
        onChange={(e) => {
          const val = e.target.value
          onChange({ ...filters, status: val === '' ? undefined : (val as TaskStatus) })
        }}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.priority ?? ''}
        onChange={(e) => {
          const val = e.target.value
          onChange({ ...filters, priority: val === '' ? undefined : (val as TaskPriority) })
        }}
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
