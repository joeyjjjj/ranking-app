import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { groupMeta } from '../data/config'
import { useRankingController } from '../hooks/useRankingController'
import type { Song } from '../types/song'
import { ResultScreen } from './ResultScreen'
import { YouTubeFrame } from './YouTubeFrame'

type CompareScreenProps = {
  songs: Song[]
  onAgain: () => void
}

export function CompareScreen({ songs, onAgain }: CompareScreenProps) {
  const { t } = useTranslation()
  const { snapshot, choose, draw, undo } = useRankingController(songs)
  const [playingSongId, setPlayingSongId] = useState<string | null>(null)

  const pair = snapshot.currentPair
  const pairKey = pair ? `${pair.left.id}:${pair.right.id}` : ''

  useEffect(() => {
    setPlayingSongId(null)
  }, [pairKey])

  if (snapshot.isDone && snapshot.rankedSongs) {
    return (
      <div className="h-full min-h-0 overflow-y-auto overscroll-y-contain pb-6 [-webkit-overflow-scrolling:touch]">
        <ResultScreen
          rankedSongs={snapshot.rankedSongs}
          canUndo={snapshot.canUndo}
          onUndo={undo}
          onAgain={onAgain}
          onHome={onAgain}
        />
      </div>
    )
  }

  const progressMax = Math.max(snapshot.plannedComparisons, 1)
  const progressValue = Math.min(snapshot.completedComparisons, progressMax)
  const progressPercent = Math.round((progressValue / progressMax) * 100)

  return (
    <section className="compare-screen flex h-full min-h-0 w-full flex-col overflow-hidden md:h-auto md:overflow-visible">
      <div className="flex shrink-0 items-center justify-between gap-2 pb-1.5 md:pb-4">
        <p className="font-display text-lg text-ink md:text-3xl">{t('compare.question')}</p>
        <button
          type="button"
          onClick={undo}
          disabled={!snapshot.canUndo}
          className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-ink/70 enabled:hover:bg-white disabled:opacity-30 md:px-4 md:py-2 md:text-sm"
        >
          {t('compare.undo')}
        </button>
      </div>

      <div className="mb-1.5 shrink-0 md:mb-6">
        <div className="mb-1 flex justify-between text-[11px] text-ink/60 md:mb-2 md:text-sm">
          <span>
            {t('compare.progress', {
              done: snapshot.completedComparisons,
              total: snapshot.plannedComparisons,
            })}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/10 md:h-2">
          <div
            className="h-full rounded-full bg-coral transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {pair ? (
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 md:gap-4">
          <div className="grid min-h-0 flex-1 grid-rows-2 gap-1.5 md:grid-cols-2 md:grid-rows-1 md:gap-4">
            <SongChoiceCard
              song={pair.left}
              isPlaying={playingSongId === pair.left.id}
              onPlay={() => setPlayingSongId(pair.left.id)}
              onChoose={() => choose(pair.left.id)}
            />
            <SongChoiceCard
              song={pair.right}
              isPlaying={playingSongId === pair.right.id}
              onPlay={() => setPlayingSongId(pair.right.id)}
              onChoose={() => choose(pair.right.id)}
            />
          </div>
          <button
            type="button"
            onClick={draw}
            className="shrink-0 rounded-full border border-black/20 bg-white/90 px-5 py-2 text-xs font-semibold text-ink/80 shadow-soft hover:bg-white md:mx-auto md:px-8 md:py-2.5 md:text-sm"
          >
            {t('compare.draw')}
          </button>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-3xl bg-white/70 text-ink/50">
          ...
        </div>
      )}
    </section>
  )
}

function SongChoiceCard({
  song,
  isPlaying,
  onPlay,
  onChoose,
}: {
  song: Song
  isPlaying: boolean
  onPlay: () => void
  onChoose: () => void
}) {
  const { t } = useTranslation()
  const accent = groupMeta[song.groupId].accent

  return (
    <article
      className="song-choice relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-black/8 bg-white p-2 shadow-soft md:rounded-3xl md:p-5"
      style={{ ['--accent' as string]: accent }}
    >
      <div className="absolute inset-x-0 top-0 h-1 md:h-1.5" style={{ background: accent }} />

      {song.youtubeId ? (
        <div className="relative mt-1 min-h-0 flex-1 md:mt-2 md:aspect-video md:flex-none">
          <YouTubeFrame
            youtubeId={song.youtubeId}
            title={song.title}
            accent={accent}
            isPlaying={isPlaying}
            onPlay={onPlay}
            fill
          />
        </div>
      ) : null}

      <div className="mt-1 flex shrink-0 flex-col gap-1 md:mt-4 md:gap-3">
        <div className="min-w-0">
          <p
            className="truncate text-[10px] font-semibold tracking-wide md:text-xs"
            style={{ color: accent }}
          >
            {t(`groups.${song.groupId}`)}
          </p>
          <p className="mt-0.5 line-clamp-2 font-display text-sm leading-snug text-ink md:mt-2 md:text-2xl">
            {song.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onChoose}
          className="w-full rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 md:px-4 md:py-3 md:text-sm"
          style={{ background: accent }}
        >
          {t('compare.pickThis')}
        </button>
      </div>
    </article>
  )
}
