import { useState, useCallback, useMemo } from 'react'
import type { ContextDocument } from '@/types/prompt'
import { getAvailableDocuments, buildContextBlock } from '@/services/context.service'
import { estimateTokens, formatSize } from '@/utils/tokenCounter'

export function useContextDocuments() {
  const [documents, setDocuments] = useState<ContextDocument[]>(() => getAvailableDocuments())
  const [contextPreview, setContextPreview] = useState<string | null>(null)

  const toggleDocument = useCallback((path: string) => {
    setDocuments((prev) => prev.map((d) =>
      d.path === path ? { ...d, selected: !d.selected } : d
    ))
  }, [])

  const selectedDocs = useMemo(() => documents.filter((d) => d.selected), [documents])

  const stats = useMemo(() => {
    const totalSize = selectedDocs.reduce((acc, d) => acc + d.size, 0)
    const fullText = selectedDocs.map((d) => d.content).join('\n')
    return {
      count: selectedDocs.length,
      size: formatSize(totalSize),
      tokens: estimateTokens(fullText),
    }
  }, [selectedDocs])

  const buildContext = useCallback(() => {
    const block = buildContextBlock(selectedDocs)
    setContextPreview(block)
  }, [selectedDocs])

  const clearPreview = useCallback(() => {
    setContextPreview(null)
  }, [])

  return {
    documents,
    selectedDocs,
    stats,
    contextPreview,
    toggleDocument,
    buildContext,
    clearPreview,
  }
}
