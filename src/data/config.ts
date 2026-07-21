export const rankingConfig = {
  topK: 20,
} as const

export type GroupId = 'equalLove' | 'notEqualMe' | 'nearlyEqualJoy'

export const groupMeta: Record<
  GroupId,
  { id: GroupId; labelJa: string; labelEn: string; shortJa: string; shortEn: string; accent: string }
> = {
  equalLove: {
    id: 'equalLove',
    labelJa: '＝LOVE',
    labelEn: '=LOVE',
    shortJa: 'イコラブ',
    shortEn: 'Ikorabu',
    accent: '#ea6c81',
  },
  notEqualMe: {
    id: 'notEqualMe',
    labelJa: '≠ME',
    labelEn: '≠ME',
    shortJa: 'ノイミー',
    shortEn: 'Noimi',
    accent: '#79ccbd',
  },
  nearlyEqualJoy: {
    id: 'nearlyEqualJoy',
    labelJa: '≒JOY',
    labelEn: '≒JOY',
    shortJa: 'ニアジョイ',
    shortEn: 'Niajoy',
    accent: '#f5c542',
  },
}
