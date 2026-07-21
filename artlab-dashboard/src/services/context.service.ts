import type { ContextDocument } from '@/types/prompt'

const mdFiles = import.meta.glob('/context/**/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function getCategory(filePath: string): string {
  const parts = filePath.replace('/context/', '').split('/')
  return parts.length > 1 ? parts[0] : 'general'
}

export function getAvailableDocuments(): ContextDocument[] {
  return Object.entries(mdFiles).map(([path, content]) => {
    const name = path.split('/').pop() || ''
    return {
      path,
      name,
      category: getCategory(path),
      content: content as string,
      size: new TextEncoder().encode(content as string).length,
      selected: false,
    }
  })
}

export function buildContextBlock(selectedDocs: ContextDocument[]): string {
  const sorted = [...selectedDocs].sort((a, b) => a.path.localeCompare(b.path))
  return sorted.map((doc) => {
    const header = `=== ${doc.name} (${doc.category}) ===`
    return `${header}\n${doc.content}\n`
  }).join('\n')
}
