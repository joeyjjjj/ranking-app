import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteRankingRecord, getRankingRecord } from '../data/rankingRecords'
import { resolveSongsByIds } from '../data/songs'
import { ResultScreen } from './ResultScreen'

type HistoryDetailScreenProps = {
  recordId: string
  onBack: () => void
  onDeleted: () => void
}

export function HistoryDetailScreen({
  recordId,
  onBack,
  onDeleted,
}: HistoryDetailScreenProps) {
  const { t } = useTranslation()
  const record = useMemo(() => getRankingRecord(recordId), [recordId])
  const rankedSongs = useMemo(
    () => (record ? resolveSongsByIds(record.songIds) : []),
    [record],
  )

  if (!record || rankedSongs.length === 0) {
    return (
      <section className="mx-auto w-full max-w-3xl animate-fade-up">
        <p className="rounded-2xl border border-black/8 bg-white/70 px-5 py-8 text-center text-ink/55">
          {t('history.missing')}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 w-full rounded-full border border-black/15 bg-white px-6 py-4 text-base font-semibold text-ink"
        >
          {t('history.back')}
        </button>
      </section>
    )
  }

  const handleDelete = () => {
    const confirmed = window.confirm(t('history.deleteConfirm'))
    if (!confirmed) {
      return
    }
    deleteRankingRecord(recordId)
    onDeleted()
  }

  return (
    <ResultScreen
      rankedSongs={rankedSongs}
      createdAt={record.createdAt}
      hideUndo
      onBack={onBack}
      onDelete={handleDelete}
    />
  )
}
