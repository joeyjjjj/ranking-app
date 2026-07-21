import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { CompareScreen } from './components/CompareScreen'
import { HistoryDetailScreen } from './components/HistoryDetailScreen'
import { HistoryListScreen } from './components/HistoryListScreen'
import { LanguageToggle } from './components/LanguageToggle'
import { SetupScreen } from './components/SetupScreen'
import type { Song } from './types/song'

type AppPhase = 'setup' | 'ranking' | 'history' | 'historyDetail'

export default function App() {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<AppPhase>('setup')
  const [selectedSongs, setSelectedSongs] = useState<Song[] | null>(null)
  const [viewingRecordId, setViewingRecordId] = useState<string | null>(null)

  const goHome = () => {
    setSelectedSongs(null)
    setViewingRecordId(null)
    setPhase('setup')
  }

  const handleStart = (songs: Song[]) => {
    setSelectedSongs(songs)
    setPhase('ranking')
  }

  const handleHomeClick = () => {
    if (phase === 'ranking' && selectedSongs) {
      const confirmed = window.confirm(t('app.leaveConfirm'))
      if (!confirmed) {
        return
      }
    }
    goHome()
  }

  const openHistory = () => {
    setViewingRecordId(null)
    setPhase('history')
  }

  const openRecord = (recordId: string) => {
    setViewingRecordId(recordId)
    setPhase('historyDetail')
  }

  const isRanking = phase === 'ranking' && selectedSongs !== null
  const showHomeButton = phase !== 'setup'

  return (
    <div className={`app-shell ${isRanking ? 'h-[100dvh] overflow-hidden md:min-h-screen md:overflow-visible' : 'min-h-screen'}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>

      <div
        className={`relative z-10 mx-auto flex max-w-5xl flex-col px-3 md:px-8 ${
          isRanking ? 'h-full py-2 md:min-h-screen md:py-10' : 'px-4 py-6 md:py-10'
        }`}
      >
        <div className="mb-2 flex shrink-0 items-center justify-between gap-2 md:mb-8">
          <div className="flex items-center gap-2">
            {showHomeButton ? (
              <button
                type="button"
                onClick={handleHomeClick}
                className="rounded-full border border-black/15 bg-white/80 px-3 py-1.5 text-xs text-ink/70 hover:bg-white md:px-4 md:py-2 md:text-sm"
              >
                {t('app.home')}
              </button>
            ) : (
              <button
                type="button"
                onClick={openHistory}
                className="rounded-full border border-black/15 bg-white/80 px-3 py-1.5 text-xs text-ink/70 hover:bg-white md:px-4 md:py-2 md:text-sm"
              >
                {t('history.title')}
              </button>
            )}
          </div>
          <LanguageToggle />
        </div>

        <div className={isRanking ? 'min-h-0 flex-1' : ''}>
          {phase === 'history' ? (
            <HistoryListScreen onOpenRecord={openRecord} />
          ) : phase === 'historyDetail' && viewingRecordId ? (
            <HistoryDetailScreen
              recordId={viewingRecordId}
              onBack={openHistory}
              onDeleted={openHistory}
            />
          ) : phase === 'setup' || !selectedSongs ? (
            <SetupScreen onStart={handleStart} />
          ) : (
            <CompareScreen
              key={selectedSongs.map((song) => song.id).join('|')}
              songs={selectedSongs}
              onAgain={goHome}
            />
          )}
        </div>
      </div>
    </div>
  )
}
