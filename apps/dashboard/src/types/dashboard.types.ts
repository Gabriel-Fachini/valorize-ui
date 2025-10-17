export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: 'announcement' | 'update' | 'achievement' | 'general'
  author: { name: string; avatar?: string }
  publishedAt: string
  imageUrl?: string
  tags?: string[]
}

export interface EventItem {
  id: string
  title: string
  description: string
  location: string
  startDate: string
  endDate?: string
  category: 'meeting' | 'training' | 'social' | 'celebration'
  attendees?: number
  maxAttendees?: number
  imageUrl?: string
}

