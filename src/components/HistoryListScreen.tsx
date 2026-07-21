import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteRankingRecord, listRankingRecords } from '../data/rankingRecords'
import { resolveSongsByIds } from '../data/songs'
import type { RankingRecord } from '../types/rankingRecord'

type HistoryListScreenProps = {
  onOpenRecord: (recordId: string) => void
}

export function HistoryListScreen({ onOpenRecord }: HistoryListScreenProps) {
  const { t, i18n } = useTranslation()
  const [records, setRecords] = useState(() => listRankingRecords())

  const handleDelete = (recordId: string) => {
    const confirmed = window.confirm(t('history.deleteConfirm'))
    if (!confirmed) {
      return
    }
    deleteRankingRecord(recordId)
    setRecords(listRankingRecords())
  }

  return (
    <section className="mx-auto w-full max-w-3xl animate-fade-up">
      <header className="mb-8">
        <p className="font-display text-4xl text-ink md:text-5xl">{t('history.title')}</p>
        <p className="mt-2 text-sm text-ink/55">{t('history.subtitle')}</p>
      </header>

      {records.length === 0 ? (
        <p className="rounded-2xl border border-black/8 bg-white/70 px-5 py-8 text-center text-ink/55">
          {t('history.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {records.map((record) => (
            <HistoryRecordRow
              key={record.id}
              record={record}
              locale={i18n.language}
              onOpen={() => onOpenRecord(record.id)}
              onDelete={() => handleDelete(record.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function HistoryRecordRow({
  record,
  locale,
  onOpen,
  onDelete,
}: {
  record: RankingRecord
  locale: string
  onOpen: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const songs = useMemo(() => resolveSongsByIds(record.songIds), [record.songIds])
  const createdLabel = new Date(record.createdAt).toLocaleString(locale)
  const previewTitles = songs
    .slice(0, 3)
    .map((song) => song.title)
    .join(' / ')

  return (
    <li className="rounded-2xl border border-black/6 bg-white/80 px-4 py-4">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <p className="text-xs text-ink/50">{createdLabel}</p>
        <p className="mt-1 font-medium text-ink">
          {t('history.songCount', { count: record.songIds.length })}
        </p>
        {previewTitles ? (
          <p className="mt-1 truncate text-sm text-ink/60">{previewTitles}</p>
        ) : null}
      </button>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-ink/60 hover:border-coral hover:text-coral"
        >
          {t('history.delete')}
        </button>
      </div>
    </li>
  )
}
