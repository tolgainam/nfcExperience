import { useTranslation } from 'react-i18next'

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'fr'
  onLanguageChange: (lang: 'en' | 'fr') => void
}

export default function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => onLanguageChange(currentLanguage === 'en' ? 'fr' : 'en')}
        className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow border border-gray-200 text-sm font-medium"
        aria-label={t('nav.language')}
      >
        {currentLanguage === 'en' ? t('nav.switchToFrench') : t('nav.switchToEnglish')}
      </button>
    </div>
  )
}
