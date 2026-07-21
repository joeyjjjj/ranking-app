import { useEffect, useMemo, useSyncExternalStore } from 'react'
import {
  createRankingController,
  type ControllerSnapshot,
  type RankingController,
} from '../ranking/sessionController'
import type { Song } from '../types/song'

const emptySnapshot: ControllerSnapshot = {
  mode: 'topK',
  plannedComparisons: 0,
  completedComparisons: 0,
  currentPair: null,
  rankedSongs: null,
  isDone: false,
  canUndo: false,
}

export function useRankingController(songs: Song[] | null) {
  const controller = useMemo<RankingController | null>(() => {
    if (!songs || songs.length < 2) {
      return null
    }
    return createRankingController(songs)
  }, [songs])

  useEffect(() => {
    controller?.start()
  }, [controller])

  const snapshot = useSyncExternalStore(
    (listener) => {
      if (!controller) {
        return () => undefined
      }
      return controller.subscribe(listener)
    },
    () => controller?.getSnapshot() ?? emptySnapshot,
    () => emptySnapshot,
  )

  return {
    snapshot,
    choose: (winnerId: string) => controller?.choose(winnerId),
    draw: () => controller?.draw(),
    undo: () => controller?.undo(),
  }
}
