import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const active = i18n.language.startsWith('ja') ? 'ja' : 'en'

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 p-1 text-xs">
      <button
        type="button"
        className={`rounded-full px-3 py-1 transition ${
          active === 'ja' ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'
        }`}
        onClick={() => void i18n.changeLanguage('ja')}
      >
        {t('lang.ja')}
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1 transition ${
          active === 'en' ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'
        }`}
        onClick={() => void i18n.changeLanguage('en')}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}
