import { rankingConfig } from '../data/config'
import type { RankingMode, Song } from '../types/song'
import { resolvePlannedComparisons } from './estimate'
import { interactiveTopK } from './topK'
import type { ChoiceResult, HistoryEntry } from './types'

export type PendingPair = {
  left: Song
  right: Song
}

export type ControllerSnapshot = {
  mode: RankingMode
  plannedComparisons: number
  completedComparisons: number
  currentPair: PendingPair | null
  rankedSongs: Song[] | null
  isDone: boolean
  canUndo: boolean
}

type WaitingBlock = {
  resolve: (result: ChoiceResult) => void
}

export type RankingController = {
  getSnapshot: () => ControllerSnapshot
  subscribe: (listener: () => void) => () => void
  choose: (winnerId: string) => void
  draw: () => void
  undo: () => void
  start: () => void
}

function shuffleSongs(songs: Song[]): Song[] {
  const next = songs.slice()
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const temporary = next[index]
    next[index] = next[swapIndex]
    next[swapIndex] = temporary
  }
  return next
}

export function createRankingController(songs: Song[]): RankingController {
  const mode: RankingMode = 'topK'
  const orderedSongs = shuffleSongs(songs)
  let plannedComparisons = resolvePlannedComparisons(orderedSongs.length)
  let completedComparisons = 0
  let currentPair: PendingPair | null = null
  let rankedSongs: Song[] | null = null
  let isDone = false
  let waiting: WaitingBlock | null = null
  let history: HistoryEntry[] = []
  let replayIndex = 0
  let runId = 0
  const listeners = new Set<() => void>()

  let snapshot: ControllerSnapshot = {
    mode,
    plannedComparisons,
    completedComparisons,
    currentPair,
    rankedSongs,
    isDone,
    canUndo: false,
  }

  const emit = () => {
    snapshot = {
      mode,
      plannedComparisons,
      completedComparisons,
      currentPair,
      rankedSongs,
      isDone,
      canUndo: history.length > 0,
    }
    for (const listener of listeners) {
      listener()
    }
  }

  const isActive = (activeRunId: number) => activeRunId === runId

  const askChoice = (activeRunId: number, left: Song, right: Song): Promise<ChoiceResult> => {
    if (!isActive(activeRunId)) {
      return new Promise(() => undefined)
    }

    if (replayIndex < history.length) {
      const entry = history[replayIndex]
      const matchesForward = entry.leftId === left.id && entry.rightId === right.id
      const matchesSwapped = entry.leftId === right.id && entry.rightId === left.id
      if (matchesForward || matchesSwapped) {
        replayIndex += 1
        if (matchesSwapped) {
          if (entry.result === 'left') {
            return Promise.resolve('right')
          }
          if (entry.result === 'right') {
            return Promise.resolve('left')
          }
          return Promise.resolve('draw')
        }
        return Promise.resolve(entry.result)
      }
      history = history.slice(0, replayIndex)
    }

    currentPair = { left, right }
    emit()
    return new Promise((resolve) => {
      waiting = {
        resolve: (result) => {
          history.push({ leftId: left.id, rightId: right.id, result })
          replayIndex = history.length
          resolve(result)
        },
      }
    })
  }

  const finish = (activeRunId: number, ranked: Song[]) => {
    if (!isActive(activeRunId)) {
      return
    }
    currentPair = null
    rankedSongs = ranked
    isDone = true
    plannedComparisons = Math.max(plannedComparisons, completedComparisons)
    emit()
  }

  const run = async () => {
    const activeRunId = ++runId
    completedComparisons = 0
    currentPair = null
    rankedSongs = null
    isDone = false
    waiting = null
    replayIndex = 0
    plannedComparisons = resolvePlannedComparisons(orderedSongs.length)
    emit()

    const onComparison = () => {
      if (!isActive(activeRunId)) {
        return
      }
      completedComparisons += 1
      if (completedComparisons > plannedComparisons) {
        plannedComparisons = completedComparisons
      }
      emit()
    }

    const ranked = await interactiveTopK(
      orderedSongs,
      rankingConfig.topK,
      (left, right) => askChoice(activeRunId, left, right),
      onComparison,
    )
    finish(activeRunId, ranked)
  }

  const resolveChoice = (result: ChoiceResult) => {
    if (!currentPair || !waiting) {
      return
    }
    const resolver = waiting.resolve
    waiting = null
    currentPair = null
    emit()
    resolver(result)
  }

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    choose: (winnerId: string) => {
      if (!currentPair) {
        return
      }
      if (currentPair.left.id === winnerId) {
        resolveChoice('left')
        return
      }
      if (currentPair.right.id === winnerId) {
        resolveChoice('right')
      }
    },
    draw: () => {
      resolveChoice('draw')
    },
    undo: () => {
      if (history.length === 0) {
        return
      }
      history = history.slice(0, -1)
      void run()
    },
    start: () => {
      void run()
    },
  }
}
