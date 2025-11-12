# Codebase Structure

This document provides an overview of all files in the NFC Experience codebase and their purposes.

## Root Configuration Files

- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript compiler configuration
- `vite.config.ts` - Vite build tool configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for CSS processing
- `.env.local` - Environment variables (Supabase credentials)
- `CLAUDE.md` - Project instructions and guidelines for development

## Source Code (`/src`)

### Entry Points

- **`main.tsx`** - Application entry point, renders App component and sets up React
- **`App.tsx`** - Main app component with React Router setup and language routing
- **`index.css`** - Global CSS styles and Tailwind directives

### Pages (`/src/pages`)

- **`ProductExperience.tsx`** - Main product experience page
  - Handles NFC URL parameter parsing
  - Manages scan tracking and fingerprinting
  - Determines first scan vs. return scan
  - Renders UnboxingExperience or SupportHub based on scan history
  - Applies campaign theme colors

### Components (`/src/components`)

- **`UnboxingExperience.tsx`** - First scan experience component
  - Hero section with 3D model and campaign gradient
  - Scroll-based animations using Framer Motion
  - Feature cards with product highlights
  - Getting started section
  - Integrates Three.js 3D box with rotation

- **`ModelViewer.tsx`** - Reusable 3D model viewer component
  - React Three Fiber Canvas wrapper
  - OrbitControls for interaction
  - Lighting setup for 3D scenes
  - Suspense boundary with loading fallback
  - (Currently unused, UnboxingExperience uses inline Three.js)

- **`ErrorBoundary.tsx`** - Error boundary component
  - Catches React errors gracefully
  - Displays error UI instead of white screen
  - Provides error details for debugging

- **`LanguageSwitcher.tsx`** - Language selection toggle
  - Switches between English (en) and French (fr)
  - Updates URL path and i18n context
  - Persists language choice to localStorage

- **`LanguageWrapper.tsx`** - Language routing wrapper
  - Extracts language from URL params
  - Updates i18n language on route changes
  - Wraps child routes with language context

### Hooks (`/src/hooks`)

- **`useCampaignTheme.ts`** - Campaign theme management hook
  - Applies campaign colors to CSS variables
  - Sets --campaign-primary, --campaign-secondary, --campaign-accent
  - Provides getCampaignColors utility function
  - Adds data-campaign attribute to document root

### Library/Utilities (`/src/lib`)

- **`supabase.ts`** - Supabase client configuration
  - Creates and exports Supabase client instance
  - Uses environment variables for credentials

- **`i18n.ts`** - Internationalization setup
  - Configures react-i18next
  - Sets up language detection and fallbacks
  - Loads translation resources for en/fr

- **`urlParams.ts`** - NFC URL parameter parsing
  - parseNFCParams: Extracts lang, brand, type, cc, prd, uid from URL
  - areParamsValid: Validates all required parameters are present
  - Type-safe parameter handling

- **`fingerprint.ts`** - Device fingerprinting
  - Generates unique device fingerprint for scan tracking
  - Uses @fingerprintjs/fingerprintjs library
  - Enables anonymous user identification across sessions

### Types (`/src/types`)

- **`database.ts`** - TypeScript types for database schema
  - Campaign type (cc, name, theme colors)
  - Product type (prd, brand, name, type, model_url)
  - Unit type (uid, prd, brand, cc)
  - Scan type (scan tracking records)
  - UnitWithRelations (joined query result type)

### Translations (`/src/locales`)

- **`en/translation.json`** - English translations
  - Welcome messages
  - Unboxing experience content
  - Feature descriptions
  - Error messages

- **`fr/translation.json`** - French translations
  - All content translated to French
  - Mirrors structure of English translations

### Assets (`/src/assets`)

- **`models/`** - 3D model files (GLTF/GLB format)
  - Currently placeholder directory
  - Will contain product 3D models for different campaigns

## Requirements Documentation (`/Requirements`)

- **`vision.md`** - Original project vision and concept
- **`prd.md`** - Full product requirements document (v2.0)
- **`codebase-structure.md`** - This file

## Implementation Status

### ✅ Phase 1 Complete
- Foundation setup (Vite, React, TypeScript, Tailwind)
- Supabase integration
- URL parameter parsing and validation
- Pre-registration toggle system
- Campaign-based theming
- Internationalization (en/fr)
- Scan tracking with fingerprinting
- Language switching

### ✅ Phase 2 Complete
- UnboxingExperience component with hero section
- Three.js 3D rotating box (placeholder model)
- Framer Motion scroll animations
- Campaign-themed gradient backgrounds
- Feature cards with animations
- Error boundary implementation
- Translations for unboxing content

### 🚧 Phase 3 (Pending)
- Return Scan Experience (SupportHub component)
- Features, tutorials, troubleshooting sections
- Campaign-specific content delivery

### 🚧 Future Phases
- Real 3D product models (GLTF/GLB)
- Video scrubbing with GSAP ScrollTrigger
- Advanced parallax effects
- Mobile optimization and testing
- Production deployment

## Key Architecture Patterns

1. **Component Organization**: Pages vs. Components separation
2. **Type Safety**: TypeScript throughout, database types defined
3. **State Management**: React hooks (useState, useEffect, useRef)
4. **Routing**: React Router v6 with language prefixes
5. **Styling**: Tailwind CSS with CSS variables for theming
6. **Data Fetching**: Direct Supabase queries (no separate API layer)
7. **Animation**: Framer Motion for UI, Three.js for 3D
8. **i18n**: react-i18next with language routing
9. **Error Handling**: ErrorBoundary for graceful failures
10. **Scan Tracking**: Browser fingerprinting + Supabase persistence

## Development Workflow

1. Local dev: `npm run dev` (Vite dev server on port 5173)
2. Build: `npm run build` (outputs to /dist)
3. Preview: `npm run preview` (test production build)
4. Lint: `npm run lint` (ESLint checks)

## Environment Variables Required

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Tables (Supabase)

1. **products** - Product catalog (prd + brand composite PK)
2. **campaigns** - Campaign configurations (cc PK)
3. **units** - Individual physical units (uid PK)
4. **scans** - Scan history tracking (uid + device_fingerprint unique)
5. **settings** - App configuration (key-value pairs)

See `prd.md` for detailed schema definitions.
