import type { Song } from '../types/song'
import type { ChoiceResult } from './types'

export type AskChoice = (left: Song, right: Song) => Promise<ChoiceResult>

async function merge(
  leftList: Song[],
  rightList: Song[],
  askChoice: AskChoice,
  onComparison: () => void,
): Promise<Song[]> {
  const merged: Song[] = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < leftList.length && rightIndex < rightList.length) {
    const left = leftList[leftIndex]
    const right = rightList[rightIndex]
    const result = await askChoice(left, right)
    onComparison()
    if (result === 'right') {
      merged.push(right)
      rightIndex += 1
    } else {
      merged.push(left)
      leftIndex += 1
    }
  }

  while (leftIndex < leftList.length) {
    merged.push(leftList[leftIndex])
    leftIndex += 1
  }
  while (rightIndex < rightList.length) {
    merged.push(rightList[rightIndex])
    rightIndex += 1
  }

  return merged
}

export async function interactiveMergeSort(
  songs: Song[],
  askChoice: AskChoice,
  onComparison: () => void,
): Promise<Song[]> {
  if (songs.length <= 1) {
    return songs
  }

  const mid = Math.floor(songs.length / 2)
  const leftSorted = await interactiveMergeSort(songs.slice(0, mid), askChoice, onComparison)
  const rightSorted = await interactiveMergeSort(songs.slice(mid), askChoice, onComparison)
  return merge(leftSorted, rightSorted, askChoice, onComparison)
}
