import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LanguageWrapper from './components/LanguageWrapper'
import ProductExperience from './pages/ProductExperience'
import './lib/i18n' // Initialize i18n

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to English landing */}
        <Route path="/" element={<Navigate to="/en" replace />} />

        {/* Language-based routes */}
        <Route path="/:lang" element={<LanguageWrapper />}>
          {/* Product experience page */}
          <Route path="product/:brand" element={<ProductExperience />} />

          {/* Landing page (optional for V1) */}
          <Route index element={<LandingPlaceholder />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

// Placeholder landing page
function LandingPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">NFC Experience</h1>
        <p className="text-gray-600 mb-4">
          Scan an NFC tag on your product to begin your journey.
        </p>
        <div className="text-sm text-gray-500 mt-8">
          <p className="font-medium mb-2">Test URLs:</p>
          <ul className="space-y-1">
            <li>
              <a
                href="/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001"
                className="text-campaign-primary hover:underline"
              >
                Electric Blue ILUMAi PRIME (EN)
              </a>
            </li>
            <li>
              <a
                href="/fr/product/IQOS?type=d&cc=102&prd=1001&uid=999002"
                className="text-campaign-primary hover:underline"
              >
                Slate ILUMAi PRIME (FR)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// 404 Not Found page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-campaign-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

export default App
