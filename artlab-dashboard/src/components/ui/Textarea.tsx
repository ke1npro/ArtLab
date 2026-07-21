import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border bg-surface-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted resize-y min-h-[60px]',
            'border-surface-border focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
