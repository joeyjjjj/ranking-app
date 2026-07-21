export type ChoiceResult = 'left' | 'right' | 'draw'

export type HistoryEntry = {
  leftId: string
  rightId: string
  result: ChoiceResult
}
