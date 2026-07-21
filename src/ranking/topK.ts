import type { Song } from '../types/song'
import { interactiveMergeSort, type AskChoice } from './mergeSort'

async function binaryInsert(
  sortedBestFirst: Song[],
  candidate: Song,
  askChoice: AskChoice,
  onComparison: () => void,
): Promise<Song[]> {
  let low = 0
  let high = sortedBestFirst.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const result = await askChoice(candidate, sortedBestFirst[mid])
    onComparison()
    if (result === 'left') {
      high = mid
    } else {
      low = mid + 1
    }
  }

  const next = sortedBestFirst.slice()
  next.splice(low, 0, candidate)
  return next
}

export async function interactiveTopK(
  songs: Song[],
  topK: number,
  askChoice: AskChoice,
  onComparison: () => void,
): Promise<Song[]> {
  if (songs.length <= topK) {
    return interactiveMergeSort(songs, askChoice, onComparison)
  }

  const seed = songs.slice(0, topK)
  let ranked = await interactiveMergeSort(seed, askChoice, onComparison)

  for (const candidate of songs.slice(topK)) {
    const threshold = ranked[topK - 1]
    const gate = await askChoice(candidate, threshold)
    onComparison()
    if (gate !== 'left') {
      continue
    }

    const withoutThreshold = ranked.slice(0, topK - 1)
    ranked = await binaryInsert(withoutThreshold, candidate, askChoice, onComparison)
  }

  return ranked
}
