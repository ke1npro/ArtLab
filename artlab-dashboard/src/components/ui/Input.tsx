import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border bg-surface-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted',
            'border-surface-border focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all',
            error && 'border-status-offline',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-offline">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
