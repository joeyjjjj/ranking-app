import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { groupMeta, rankingConfig } from '../data/config'
import type { Song } from '../types/song'
import { YouTubeFrame } from './YouTubeFrame'

type ResultScreenProps = {
  rankedSongs: Song[]
  canUndo?: boolean
  onUndo?: () => void
  onAgain?: () => void
  onHome?: () => void
  onBack?: () => void
  onDelete?: () => void
  createdAt?: string
  hideUndo?: boolean
}

export function ResultScreen({
  rankedSongs,
  canUndo = false,
  onUndo,
  onAgain,
  onHome,
  onBack,
  onDelete,
  createdAt,
  hideUndo = false,
}: ResultScreenProps) {
  const { t, i18n } = useTranslation()
  const topK = rankingConfig.topK
  const [playingSongId, setPlayingSongId] = useState<string | null>(null)
  const isHistory = Boolean(onBack || onDelete)

  const firstPlace = rankedSongs[0]
  const secondPlace = rankedSongs[1]
  const thirdPlace = rankedSongs[2]
  const remainingSongs = rankedSongs.slice(3)
  const createdLabel = createdAt
    ? new Date(createdAt).toLocaleString(i18n.language)
    : null

  return (
    <section className="mx-auto w-full max-w-3xl animate-fade-up">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl text-ink md:text-5xl">{t('result.title', { topK })}</p>
          <p className="mt-2 text-sm text-ink/55">{t('result.modeTopK', { topK })}</p>
          {createdLabel ? (
            <p className="mt-1 text-sm text-ink/45">{createdLabel}</p>
          ) : null}
        </div>
        {!hideUndo && onUndo ? (
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="rounded-full border border-black/15 px-4 py-2 text-sm text-ink/70 enabled:hover:bg-white disabled:opacity-30"
          >
            {t('compare.undo')}
          </button>
        ) : null}
      </header>

      <div className="space-y-3">
        {firstPlace ? (
          <PodiumSong
            song={firstPlace}
            rank={1}
            size="hero"
            isPlaying={playingSongId === firstPlace.id}
            onPlay={() => setPlayingSongId(firstPlace.id)}
          />
        ) : null}

        {secondPlace || thirdPlace ? (
          <div className="grid grid-cols-2 gap-3">
            {secondPlace ? (
              <PodiumSong
                song={secondPlace}
                rank={2}
                size="side"
                isPlaying={playingSongId === secondPlace.id}
                onPlay={() => setPlayingSongId(secondPlace.id)}
              />
            ) : (
              <div />
            )}
            {thirdPlace ? (
              <PodiumSong
                song={thirdPlace}
                rank={3}
                size="side"
                isPlaying={playingSongId === thirdPlace.id}
                onPlay={() => setPlayingSongId(thirdPlace.id)}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {remainingSongs.length > 0 ? (
        <ol className="mt-6 space-y-2">
          {remainingSongs.map((song, index) => {
            const accent = groupMeta[song.groupId].accent
            const rank = index + 4
            return (
              <li
                key={song.id}
                className="flex items-center gap-4 rounded-2xl border border-black/6 bg-white/80 px-4 py-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: accent }}
                >
                  {rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{song.title}</p>
                  <p className="text-xs" style={{ color: accent }}>
                    {t(`groups.${song.groupId}`)}
                    {song.isTitle ? ` · ${t('compare.titleBadge')}` : ''}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      ) : null}

      {isHistory ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-black/15 bg-white px-6 py-4 text-base font-semibold text-ink transition hover:bg-white/80"
            >
              {t('history.back')}
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-coral/40 bg-white px-6 py-4 text-base font-semibold text-coral transition hover:bg-coral/10"
            >
              {t('history.delete')}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {onHome ? (
            <button
              type="button"
              onClick={onHome}
              className="rounded-full border border-black/15 bg-white px-6 py-4 text-base font-semibold text-ink transition hover:bg-white/80"
            >
              {t('app.home')}
            </button>
          ) : null}
          {onAgain ? (
            <button
              type="button"
              onClick={onAgain}
              className="rounded-full bg-ink px-6 py-4 text-base font-semibold text-white transition hover:bg-ink/90"
            >
              {t('result.again')}
            </button>
          ) : null}
        </div>
      )}
    </section>
  )
}

function PodiumSong({
  song,
  rank,
  size,
  isPlaying,
  onPlay,
}: {
  song: Song
  rank: number
  size: 'hero' | 'side'
  isPlaying: boolean
  onPlay: () => void
}) {
  const { t } = useTranslation()
  const accent = groupMeta[song.groupId].accent
  const isHero = size === 'hero'

  return (
    <article
      className={`overflow-hidden border border-black/6 bg-white/90 shadow-soft ${
        isHero ? 'rounded-3xl p-4 md:p-5' : 'rounded-2xl p-3'
      }`}
      style={{ ['--accent' as string]: accent }}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${
            isHero ? 'h-12 w-12 text-base' : 'h-9 w-9 text-sm'
          }`}
          style={{ background: accent }}
        >
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-medium text-ink ${isHero ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}
          >
            {song.title}
          </p>
          <p className={`truncate ${isHero ? 'text-xs md:text-sm' : 'text-[11px]'}`} style={{ color: accent }}>
            {t(`groups.${song.groupId}`)}
            {song.isTitle ? ` · ${t('compare.titleBadge')}` : ''}
          </p>
        </div>
      </div>

      {song.youtubeId ? (
        <YouTubeFrame
          youtubeId={song.youtubeId}
          title={song.title}
          accent={accent}
          isPlaying={isPlaying}
          onPlay={onPlay}
        />
      ) : null}
    </article>
  )
}
