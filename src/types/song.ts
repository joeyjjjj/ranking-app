import type { GroupId } from '../data/config'

export type Song = {
  id: string
  title: string
  groupId: GroupId
  isTitle: boolean
  youtubeId?: string
}

export type SongScope = 'titleOnly' | 'full'

export type RankingMode = 'topK'
