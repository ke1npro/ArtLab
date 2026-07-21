export interface QueueCard {
  id: string
  title: string
  description: string
  tags: string[]
  thumbnail?: string
  columnId: string
  order: number
  createdAt: number
}

export interface QueueColumn {
  id: string
  title: string
  cards: QueueCard[]
}
