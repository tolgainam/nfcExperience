# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NFC Experience is a responsive web application that provides interactive product experiences when users scan NFC tags on product packaging. The application delivers different experiences based on scan history:
- **First scan**: Immersive unboxing experience with 3D models and animations
- **Subsequent scans**: Product support hub with features, tutorials, and resources

**Target**: Mobile-first web app (not PWA) for senior stakeholder demo

## Tech Stack

- **Build Tool**: Vite 5+
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with CSS Variables for color variant theming
- **UI Components**: shadcn/ui (selective use)
- **3D**: React Three Fiber + Drei for 3D model rendering
- **Animation**: Framer Motion (primary), GSAP with ScrollTrigger (video scrubbing)
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Internationalization**: react-i18next (English and French)
- **Deployment**: Vercel / Netlify / Cloudflare Pages

## Project Structure

```
/Requirements/        - Project documentation
  vision.md          - Original project vision
  prd.md             - Full product requirements (v2.0 - MAJOR UPDATE)
/src/
  /components/       - React components
  /pages/            - Route pages
  /lib/              - Utilities and helpers
  /hooks/            - Custom React hooks
  /styles/           - Global styles and Tailwind config
  /assets/           - Static assets
    /models/         - 3D models (GLTF/GLB)
  /locales/          - Translation files
    /en/             - English translations
    /fr/             - French translations
  /themes/           - Campaign theme configurations (cc-based)
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Type check
npm run type-check  # (if configured)
```

## Key Architecture Concepts

### URL Structure & NFC Tags

NFC tags encode URLs with numerical codes:
```
/:lang/product/:BRAND?type=:type&cc=:cc&prd=:prd&uid=:uid
```

Example: `/en/product/IQOS?type=d&cc=101&prd=1001&uid=789456`

**Parameters:**
- `lang`: Language code (en, fr) - determines initial UI language
- `BRAND`: Brand name in path (IQOS, VEEV, ZYN) - case-sensitive
- `type`: Product type
  - `d` = device
  - `f` = flavour
  - `a` = accessory
- `cc`: Campaign code (numerical, e.g., 101) - determines theme and colors
- `prd`: Product code (numerical, e.g., 1001 = ILUMAi PRIME) - identifies product model
- `uid`: Unique unit identifier (numerical) - identifies specific physical device

**Key Concept**: Campaign code (`cc`) controls the entire visual experience (colors, theme, content). Same product (`prd`) can exist in multiple campaigns.

### Scan History Logic

The app uses a simple UID-based approach to track if a specific unit has been scanned before:
1. Extract `uid` from URL parameters
2. Query Supabase `scans` table for existing record matching the `uid`
3. If no record: Show unboxing experience (first scan)
4. If record exists: Show support hub (return scan)
5. Insert/update scan record with updated count and timestamp

**Key Concept**: Tracking is per-unit (`uid`), not per-user. The first person to scan a unit gets the unboxing experience, all subsequent scans (by anyone) show the support hub. This matches the physical reality: one unboxing per device.

**Why UID-only (no fingerprinting)?**
- Physical possession is the key indicator of ownership
- Simpler, more reliable than browser fingerprinting
- No issues with browser changes, incognito mode, or multiple devices
- Better for demos and testing (consistent behavior)

### Pre-Registration Modes

The app supports two deployment models via the `pre_registration_required` setting in the database. This provides flexibility for different use cases and is excellent for stakeholder demos.

**Mode 1: Pre-Registration Required (Default - `pre_registration_required = 'true'`)**
- Only UIDs registered in the `units` table will work
- Each UID must be pre-registered with its product, brand, and campaign
- Provides controlled inventory and security
- Best for: Production deployments, enterprise use cases

**Mode 2: Open Access (`pre_registration_required = 'false'`)**
- Any UID value in the URL will work
- App fetches product and campaign data directly from URL parameters (prd, cc, brand)
- Units table is not queried (though it can still exist)
- Scan tracking still functions normally in the `scans` table
- Best for: Demos, prototypes, POCs, flexibility testing

**Implementation Details:**
```typescript
// ProductExperience.tsx checks the setting
const { data: preRegSetting } = await supabase
  .from('settings')
  .select('value')
  .eq('key', 'pre_registration_required')
  .maybeSingle()

const preRegRequired = preRegSetting?.value === 'true'

if (preRegRequired) {
  // Mode 1: Validate uid exists in units table
  // Fetch from units with joined products and campaigns
} else {
  // Mode 2: Build unit data from URL parameters
  // Fetch products and campaigns separately, create virtual unit
}
```

**Switching Modes:**
```sql
-- Enable pre-registration (secure mode)
UPDATE settings SET value = 'true' WHERE key = 'pre_registration_required';

-- Disable pre-registration (flexible mode)
UPDATE settings SET value = 'false' WHERE key = 'pre_registration_required';
```

⚠️ **Important**: This setting should be configured once at deployment and not changed mid-demo to avoid confusion.

### Campaign-Based Product System

**V1 Scope**: IQOS devices only across multiple campaigns

**Product Codes (prd):**
- 1001: IQOS ILUMAi PRIME
- 1002: IQOS ILUMAi
- 1003: IQOS ILUMA ONE

**Campaign Codes (cc):**
- 101: Electric Blue campaign
- 102: Slate campaign
- 103: Electric Purple campaign

**Architecture:**
- Each unit (`uid`) links to a product (`prd`) and campaign (`cc`)
- Campaigns define visual theme (colors, materials, content)
- Same product can exist in multiple campaigns
- Database structure: products ← units → campaigns

**Future**: VEEV and ZYN products, flavour and accessory types (out of scope for V1)

### Database Schema (Supabase)

**products table**: (Composite PK: prd + brand)
- `prd` (INTEGER): Product code (1001 = ILUMAi PRIME, 1002 = ILUMAi, etc.)
- `brand` (TEXT): Brand name (IQOS, VEEV, ZYN)
- `name` (TEXT): Product name (e.g., "IQOS ILUMAi PRIME")
- `type` (TEXT): Type code ('d', 'f', 'a')
- `model_url` (TEXT): URL to base 3D model

**campaigns table**:
- `cc` (INTEGER): Campaign code (101, 102, 103, etc.) - PK
- `name` (TEXT): Campaign name (e.g., "Electric Blue")
- `theme_primary` (TEXT): Primary color hex
- `theme_secondary` (TEXT): Secondary color hex
- `theme_accent` (TEXT): Accent color hex
- `description` (TEXT): Campaign description

**units table**: (Represents individual physical devices)
- `uid` (BIGINT): Unique unit identifier - PK
- `prd` (INTEGER): Product code - FK to products
- `brand` (TEXT): Brand - FK to products
- `cc` (INTEGER): Campaign code - FK to campaigns
- `manufactured_at` (TIMESTAMP): Optional manufacturing date

**scans table**:
- `id` (UUID): Scan record ID - PK
- `uid` (BIGINT): Unit identifier - UNIQUE (no FK constraint - allows scans without pre-registration)
- `scan_count` (INTEGER): Number of times this unit has been scanned
- `first_scan_at` (TIMESTAMP): Initial scan timestamp (first unboxing)
- `last_scan_at` (TIMESTAMP): Most recent scan
- `user_agent` (TEXT): Browser user agent (optional metadata)
- One record per unit (uid) - tracks unit activation, not individual users

**settings table**:
- `key` (TEXT): Setting key - PK
- `value` (TEXT): Setting value
- `description` (TEXT): Setting description
- `updated_at` (TIMESTAMP): Last update timestamp

**Important Settings**:
- `scan_cooldown_seconds` (default: 300): Time in seconds before showing return experience
- `pre_registration_required` (default: 'true'): Controls UID validation mode (see Pre-Registration Modes below)

## Design System

### Campaign-Based Theming

Use CSS variables for campaign-specific theming:
```css
--campaign-primary    /* Changes per campaign code (cc) */
--campaign-secondary  /* Changes per campaign code (cc) */
--campaign-accent     /* Changes per campaign code (cc) */
--brand-text
--brand-background
```

**Implementation:**
Each campaign code (`cc`) defines its own color palette fetched from the `campaigns` table. CSS variables are dynamically updated based on campaign data.

```typescript
// Fetch campaign theme from database
const { data: unitData } = await supabase
  .from('units')
  .select('*, campaigns(*)')
  .eq('uid', uid)
  .single()

// Apply campaign theme
document.documentElement.style.setProperty('--campaign-primary', unitData.campaigns.theme_primary)
document.documentElement.style.setProperty('--campaign-secondary', unitData.campaigns.theme_secondary)
document.documentElement.style.setProperty('--campaign-accent', unitData.campaigns.theme_accent)
```

**Example Campaign Themes:**
- cc=101 (Electric Blue): Primary #0066CC, Secondary #00AAFF, Accent #66D9FF
- cc=102 (Slate): Primary #4A5568, Secondary #718096, Accent #A0AEC0
- cc=103 (Electric Purple): Primary #7C3AED, Secondary #A78BFA, Accent #C4B5FD

Tailwind config should reference these CSS variables for dynamic theming.

### Internationalization (i18n)

**Languages**: English (en), French (fr)

**Implementation**: react-i18next
- Translation files in `/src/locales/en/` and `/src/locales/fr/`
- Language detection from URL path (`/:lang/...`)
- Language switcher component in navigation
- Language choice persists to localStorage
- All UI text, marketing copy, and support content must be translated

**Route Structure:**
```typescript
<Route path="/:lang" element={<LanguageWrapper />}>
  <Route path="product/:productId" element={<ProductExperience />} />
</Route>
```

### Component Patterns

**3D Model Viewer**: Reusable component that accepts product model URL, handles loading states, and provides touch controls.

**Page Transitions**: Use Framer Motion's `AnimatePresence` for smooth route transitions.

**Responsive Breakpoints**: Mobile-first (375px), Tablet (768px), Desktop (1024px+)

## Performance Considerations

- 3D models must be optimized (<5MB)
- Use `React.lazy()` for route-based code splitting
- Implement Suspense boundaries around 3D components
- Lazy load images and videos
- Target load time <3s on 4G
- Use `useScroll` from Framer Motion for scroll animations (better performance than event listeners)

## Common Development Tasks

### Adding a New Campaign

1. Add campaign to Supabase `campaigns` table:
   ```sql
   INSERT INTO campaigns (cc, name, theme_primary, theme_secondary, theme_accent, description) VALUES
   (104, 'Midnight Black', '#1A1A1A', '#2D2D2D', '#4A4A4A', 'Sleek and sophisticated dark theme');
   ```
2. Create campaign-specific 3D materials/textures if needed
3. Test URL with existing product: `/en/product/IQOS?type=d&cc=104&prd=1001&uid=[test-uid]`
4. Verify theme colors apply correctly across UI
5. Ensure both English and French content displays correctly

### Adding a New Product

1. Add product to Supabase `products` table:
   ```sql
   INSERT INTO products (prd, brand, name, type, model_url) VALUES
   (1004, 'IQOS', 'IQOS ILUMA', 'd', '/models/iluma.glb');
   ```
2. Add 3D model file to `/src/assets/models/`
3. Add product translations to locales
4. Test with existing campaign: `/en/product/IQOS?type=d&cc=101&prd=1004&uid=[test-uid]`

### Creating Test Units

For development/testing, create unit entries:
```sql
INSERT INTO units (uid, prd, brand, cc) VALUES
(999001, 1001, 'IQOS', 101),  -- ILUMAi PRIME in Electric Blue
(999002, 1001, 'IQOS', 102),  -- ILUMAi PRIME in Slate
(999003, 1002, 'IQOS', 101);  -- ILUMAi in Electric Blue
```

Test URLs:
```
/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001
/fr/product/IQOS?type=d&cc=102&prd=1001&uid=999002
```

### Working with 3D Models

- Use GLTF/GLB format
- Optimize with gltf-pipeline or similar tools
- Test on mobile devices early
- Implement loading fallbacks

### Implementing Animations

- **Scroll-based**: Use Framer Motion `useScroll` hook
- **Video scrubbing**: Use GSAP ScrollTrigger with HTML5 video
- **Page transitions**: Use Framer Motion `AnimatePresence`
- Always test on mobile devices (performance)

### Adding/Updating Translations

1. Add new translation keys to `/src/locales/en/translation.json`
2. Add corresponding French translations to `/src/locales/fr/translation.json`
3. Use translations in components:
   ```typescript
   import { useTranslation } from 'react-i18next'

   const { t } = useTranslation()
   return <h1>{t('welcome.title', { productName: 'IQOS ILUMAi PRIME' })}</h1>
   ```
4. Test both languages to ensure context is preserved

### Testing Scan Logic Locally

Use query parameters to simulate NFC scans:
```
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001
http://localhost:5173/fr/product/IQOS?type=d&cc=102&prd=1001&uid=999002
```

**Test first scan vs. return scan:**
1. Load URL with test uid (e.g., uid=999001)
2. Should show unboxing experience (first scan)
3. Reload same URL
4. Should show support hub (return scan)
5. Clear localStorage/IndexedDB to reset

**Test campaign theming:**
1. Load with cc=101 (Electric Blue) - verify blue theme
2. Load with cc=102 (Slate) - verify gray theme
3. Verify CSS variables are updated correctly
4. Check 3D model materials match campaign

**Test language switching:**
1. Load page in English (`/en/...`)
2. Switch to French via language selector
3. Verify URL updates to `/fr/...`
4. Verify all content translates
5. Verify product and campaign data still loads correctly
6. Reload page - should persist French

**Test different unit combinations:**
- Same product, different campaigns: prd=1001, cc=101 vs cc=102
- Different products, same campaign: prd=1001, cc=101 vs prd=1002, cc=101
- Verify each uid tracks scan history independently

## Supabase Configuration

Create `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Initialize Supabase client in `/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

## Deployment

Build production bundle:
```bash
npm run build
```

Deploy `dist/` folder to hosting platform. Ensure environment variables are configured in deployment settings.

## Browser Compatibility

Primary targets:
- iOS Safari 15+ (iPhone NFC support)
- Android Chrome 90+

Test 3D rendering and animations on actual devices, not just dev tools mobile emulation.

## Out of Scope (V1)

- User authentication
- CMS/admin panel for campaign/product management
- Real customer support integration (chat, tickets)
- Analytics dashboard
- E-commerce integration
- Push notifications
- Offline functionality
- Additional languages beyond English and French
- VEEV and ZYN products (IQOS only for V1)
- Flavour (type='f') and Accessory (type='a') support (devices only for V1)
- Dynamic campaign creation through UI
- A/B testing
- Backend API (using Supabase directly)

Refer to `/Requirements/prd.md` (v2.0 - MAJOR UPDATE) for complete feature scope and implementation phases.
