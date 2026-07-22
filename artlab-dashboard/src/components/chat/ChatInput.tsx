import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ChatContextModal } from './ChatContextModal'

interface ChatInputProps {
  onSend: (message: string, context?: string, image?: string) => void
  disabled?: boolean
  loading?: boolean
}

export function ChatInput({ onSend, disabled, loading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [showContextModal, setShowContextModal] = useState(false)
  const [activeContext, setActiveContext] = useState<string | null>(null)
  const [contextLabel, setContextLabel] = useState('')
  const [attachedImage, setAttachedImage] = useState<string | null>(null)
  const [attachedImageName, setAttachedImageName] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || loading) return
    onSend(trimmed, activeContext ?? undefined, attachedImage ?? undefined)
    setValue('')
    setAttachedImage(null)
    setAttachedImageName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue
        setAttachedImageName(file.name || 'clipboard.png')
        const reader = new FileReader()
        reader.onload = () => setAttachedImage(reader.result as string)
        reader.readAsDataURL(file)
        break
      }
    }
  }

  const handleContextImport = useCallback((content: string, label: string) => {
    setActiveContext(content)
    setContextLabel(label)
    setShowContextModal(false)
  }, [])

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachedImageName(file.name)
    const reader = new FileReader()
    reader.onload = () => setAttachedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const hasAttachments = activeContext || attachedImage

  return (
    <>
      <div className="border-t border-surface-border bg-surface-base">
        {hasAttachments && (
          <div className="flex flex-wrap gap-2 px-4 pt-3">
            {activeContext && (
              <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-xs rounded-lg px-2.5 py-1">
                <FileText size={12} />
                {contextLabel}
                <button onClick={() => { setActiveContext(null); setContextLabel('') }} className="hover:text-accent-hover ml-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
            {attachedImage && (
              <span className="inline-flex items-center gap-1.5 bg-surface-hover text-text-secondary text-xs rounded-lg px-2.5 py-1">
                <Paperclip size={12} />
                {attachedImageName}
                <button onClick={() => { setAttachedImage(null); setAttachedImageName('') }} className="hover:text-text-primary ml-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-3 items-end p-4 max-w-4xl mx-auto">
          <div className="flex-1 flex items-end gap-2 bg-surface-input border border-surface-border rounded-xl px-3 py-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Escribe un mensaje... (Enter para enviar)"
              rows={1}
              disabled={disabled}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none max-h-32 outline-none"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowContextModal(true)}
                disabled={disabled}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all disabled:opacity-40"
                title="Adjuntar contexto (.md)"
              >
                <FileText size={16} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all disabled:opacity-40"
                title="Adjuntar imagen"
              >
                <Paperclip size={16} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageAttach} className="hidden" />
            </div>
          </div>
          <Button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            loading={loading}
            size="lg"
            className="mb-0.5 shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      <ChatContextModal
        open={showContextModal}
        onClose={() => setShowContextModal(false)}
        onImport={handleContextImport}
      />
    </>
  )
}
