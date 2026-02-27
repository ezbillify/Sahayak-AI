import { createContext, useContext, useState, useCallback } from 'react'
import Toast, { ToastProps } from './Toast'

interface ToastContextType {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = useCallback((message: string, type: ToastProps['type'], duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      id,
      message,
      type,
      duration,
      onClose: removeToast
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
