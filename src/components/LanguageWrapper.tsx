import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

/**
 * Wrapper component that handles language switching and persistence
 * Renders language switcher and child routes
 */
export default function LanguageWrapper() {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  // Initialize language from URL parameter
  useEffect(() => {
    const validLang = lang === 'fr' ? 'fr' : 'en'

    if (i18n.language !== validLang) {
      i18n.changeLanguage(validLang)
    }

    // Persist language choice to localStorage
    localStorage.setItem('preferred-language', validLang)
  }, [lang, i18n])

  // Handle language change
  const handleLanguageChange = (newLang: 'en' | 'fr') => {
    // Get current path and update language parameter
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(/^\/(en|fr)/, `/${newLang}`)
    const search = window.location.search

    navigate(`${newPath}${search}`)
  }

  return (
    <div className="min-h-screen">
      <LanguageSwitcher
        currentLanguage={lang === 'fr' ? 'fr' : 'en'}
        onLanguageChange={handleLanguageChange}
      />
      <Outlet />
    </div>
  )
}
