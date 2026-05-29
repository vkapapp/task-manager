import { useState, useCallback } from 'react'

export interface ToastMessage {
  id: string
  text: string
  type: 'success' | 'error'
}

export interface UseToastReturn {
  toasts: ToastMessage[]
  showToast: (text: string, type: 'success' | 'error') => void
  removeToast: (id: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (text: string, type: 'success' | 'error') => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, text, type }])
      setTimeout(() => removeToast(id), 3000)
    },
    [removeToast],
  )

  return { toasts, showToast, removeToast }
}
