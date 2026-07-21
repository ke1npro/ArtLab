import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'

export interface ToastData {
  id: string
  message: string
  type: 'info' | 'warning' | 'error'
}

interface ToastItemProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const colors = {
    info: 'bg-accent/10 border-accent/30 text-accent',
    warning: 'bg-status-warning/10 border-status-warning/30 text-status-warning',
    error: 'bg-status-offline/10 border-status-offline/30 text-status-offline',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm shadow-lg backdrop-blur-sm',
        'transition-all duration-300',
        colors[toast.type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
      )}
    >
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 300) }} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
