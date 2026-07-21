import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ja from './ja.json'

void i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: 'ja',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
