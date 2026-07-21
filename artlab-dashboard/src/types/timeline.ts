export interface TimelineEvent {
  id: string
  timestamp: number
  type: 'generation' | 'publication' | 'review' | 'idea'
  title: string
  description: string
  tags: string[]
  thumbnail?: string
  promptUsed?: string
  references?: string[]
  status: 'completed' | 'published' | 'draft' | 'cancelled' | 'error'
}
