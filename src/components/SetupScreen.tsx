import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { groupMeta, rankingConfig, type GroupId } from '../data/config'
import { countSongs, filterSongs } from '../data/songs'
import { resolvePlannedComparisons } from '../ranking/estimate'
import type { Song, SongScope } from '../types/song'

type SetupScreenProps = {
  onStart: (songs: Song[]) => void
}

const allGroupIds = Object.keys(groupMeta) as GroupId[]

export function SetupScreen({ onStart }: SetupScreenProps) {
  const { t } = useTranslation()
  const [selectedGroups, setSelectedGroups] = useState<GroupId[]>(['equalLove'])
  const [scope, setScope] = useState<SongScope>('titleOnly')

  const songCount = useMemo(
    () => countSongs(selectedGroups, scope),
    [selectedGroups, scope],
  )
  const plannedComparisons = useMemo(
    () => resolvePlannedComparisons(songCount),
    [songCount],
  )

  const toggleGroup = (groupId: GroupId) => {
    setSelectedGroups((current) => {
      if (current.includes(groupId)) {
        return current.filter((id) => id !== groupId)
      }
      return [...current, groupId]
    })
  }

  const handleStart = () => {
    if (selectedGroups.length === 0 || songCount < 2) {
      return
    }
    onStart(filterSongs(selectedGroups, scope))
  }

  return (
    <section className="mx-auto w-full max-w-3xl animate-fade-up">
      <header className="mb-10">
        <p className="font-display text-4xl tracking-tight text-ink md:text-6xl">
          {t('app.brand')}
        </p>
        <p className="mt-3 max-w-xl text-base text-ink/70 md:text-lg">{t('app.tagline')}</p>
      </header>

      <div className="space-y-8">
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink/60 uppercase">
            {t('setup.groups')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {allGroupIds.map((groupId) => {
              const meta = groupMeta[groupId]
              const selected = selectedGroups.includes(groupId)
              return (
                <button
                  key={groupId}
                  type="button"
                  onClick={() => toggleGroup(groupId)}
                  className={`group-card border-2 px-4 py-5 text-left transition ${
                    selected ? 'shadow-soft' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    borderColor: selected ? meta.accent : 'transparent',
                    background: selected
                      ? `linear-gradient(145deg, ${meta.accent}22, white)`
                      : 'white',
                  }}
                >
                  <span className="block font-display text-2xl" style={{ color: meta.accent }}>
                    {t(`groups.${groupId}`)}
                  </span>
                  <span className="mt-1 block text-xs text-ink/50">{meta.shortJa}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink/60 uppercase">
            {t('setup.scope')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ScopeOption
              active={scope === 'titleOnly'}
              label={t('setup.titleOnly')}
              onClick={() => setScope('titleOnly')}
            />
            <ScopeOption
              active={scope === 'full'}
              label={t('setup.fullList')}
              onClick={() => setScope('full')}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white/70 px-5 py-4">
          <p className="text-lg font-medium">{t('setup.selectedCount', { count: songCount })}</p>
          <p className="mt-1 text-sm text-ink/55">
            {t('setup.modeHintTopK', { topK: rankingConfig.topK })}
          </p>
          {songCount >= 2 && (
            <p className="mt-1 text-sm text-ink/55">
              {t('setup.estimate', { count: plannedComparisons })}
            </p>
          )}
          {selectedGroups.length === 0 && (
            <p className="mt-2 text-sm text-coral">{t('setup.needGroup')}</p>
          )}
          {selectedGroups.length > 0 && songCount < 2 && (
            <p className="mt-2 text-sm text-coral">{t('setup.needSongs')}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={selectedGroups.length === 0 || songCount < 2}
          className="w-full rounded-full bg-ink px-6 py-4 text-base font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('setup.start')}
        </button>
      </div>
    </section>
  )
}

function ScopeOption({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? 'border-ink bg-ink text-white'
          : 'border-black/10 bg-white text-ink hover:border-ink/30'
      }`}
    >
      {label}
    </button>
  )
}
