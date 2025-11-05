# Product Requirements Document: NFC Experience

## 1. Project Overview

### Vision
Create a rich, interactive web experience that activates when users scan NFC tags on product packaging. The experience adapts based on scan history—delivering an immersive unboxing journey on first scan, and transitioning to product support and feature exploration on subsequent scans.

### Goals
- **Primary**: Build a polished concept demo for senior stakeholders showcasing NFC-enabled product engagement
- **Secondary**: Demonstrate technical capabilities with 3D models, advanced animations, and interactive elements
- **Tertiary**: Establish a scalable foundation for future multi-brand, multi-product experiences

### Target Audience
- **End Users**: Product purchasers accessing via NFC-enabled mobile devices
- **Stakeholders**: Senior leadership evaluating concept viability

### Project Type
Responsive web application (not PWA) optimized for mobile browsers

---

## 2. Technical Architecture

### Tech Stack

**Core Framework**
- **Build Tool**: Vite 5+
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6

**Styling & UI**
- **CSS Framework**: Tailwind CSS
- **Component Library**: shadcn/ui (selective components)
- **Design Tokens**: CSS Variables for brand theming

**3D & Animation**
- **3D Rendering**: React Three Fiber + Drei
- **Animation Library**: Framer Motion (primary)
- **Advanced Effects**: GSAP with ScrollTrigger (video scrubbing)
- **3D Models**: GLTF/GLB format

**Backend & Data**
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **HTTP Client**: Supabase JS Client
- **Internationalization**: react-i18next

**Deployment**
- **Hosting**: Vercel / Netlify / Cloudflare Pages
- **Domain**: TBD (will integrate with existing brand infrastructure)

### Architecture Rationale

**Why Vite + React:**
- Team familiarity and comfort
- Fast development iteration for 3D/animation work
- Excellent HMR for rapid prototyping
- Smaller bundle sizes than Next.js
- SEO not required for NFC-accessed URLs

**Why Not PWA:**
- NFC scans open URLs directly in browser
- No need for "Add to Home Screen" friction
- Simpler deployment and maintenance
- Occasional use pattern (unboxing + periodic support)

---

## 3. User Flows

### 3.1 NFC Scan Entry Point

**NFC Tag URL Structure:**
```
https://[domain]/[lang]/product/[BRAND]?type=[type]&cc=[campaignCode]&prd=[productCode]&uid=[uniqueId]
```

**Example:**
```
https://experience.iqos.com/en/product/IQOS?type=d&cc=101&prd=1001&uid=789456
```

**Parameters:**
- `lang`: Language code in path (en, fr) - determines initial UI language
- `BRAND`: Brand name in path (IQOS, VEEV, ZYN)
- `type`: Product type
  - `d` = device
  - `f` = flavour
  - `a` = accessory
- `cc`: Campaign code (numerical) - determines theme, colors, and campaign-specific content
- `prd`: Product code (numerical) - identifies specific product
  - `1001` = ILUMAi PRIME
  - `1002` = ILUMAi
  - `1003` = ILUMA ONE
  - etc.
- `uid`: Unique identifier (numerical) - database primary key for this specific device/unit

**Campaign Code Examples:**
- `cc=101`: Electric Blue campaign
- `cc=102`: Slate campaign
- `cc=103`: Electric Purple campaign

**Note**: User can change language after initial load via language switcher

### 3.2 First Scan Experience

```
User scans NFC tag
    ↓
Browser opens URL
    ↓
App checks Supabase for scan history
    ↓
No previous scan found
    ↓
Display: Unboxing/Welcome Experience
    ↓
Features:
    - 3D product model with interaction
    - Welcome animation sequence
    - Brand video or motion graphics
    - Parallax scroll journey
    - "Getting Started" guide
    ↓
Record scan in database
```

### 3.3 Subsequent Scan Experience

```
User scans NFC tag again
    ↓
Browser opens URL
    ↓
App checks Supabase for scan history
    ↓
Previous scan(s) found
    ↓
Display: Support & Features Hub
    ↓
Features:
    - Product feature exploration
    - Support resources
    - Video tutorials (with scrubbing)
    - FAQ/Troubleshooting
    - Link to iqos.com for registration
    ↓
Update scan count in database
```

### 3.4 Multi-Product Support

Users can:
- Scan different products (each has unique productId)
- Scan same product multiple times
- Experience is product-specific (different 3D models, content, branding)

---

## 4. Product Catalog

### 4.1 Product Architecture

**Product Hierarchy:**
1. **Brand**: IQOS, VEEV, ZYN
2. **Product Type**: Device (d), Flavour (f), Accessory (a)
3. **Product Code (prd)**: Numerical identifier for specific product model
4. **Campaign Code (cc)**: Numerical identifier for campaign theme
5. **Unit ID (uid)**: Unique identifier for individual physical unit

**Campaign-Driven Theming:**
- Campaign code (`cc`) controls entire visual experience (colors, theme, content)
- Same product (`prd`) can exist in multiple campaigns
- Campaigns define color palette, design language, and marketing message
- Fixed at manufacturing time

**V1 Scope**: IQOS devices only with campaign-based theming. VEEV and ZYN will be added later.

### 4.2 Product Code Reference (V1)

**IQOS Products (`prd` codes):**
| Product Code | Product Name | Type |
|--------------|--------------|------|
| 1001 | IQOS ILUMAi PRIME | d (device) |
| 1002 | IQOS ILUMAi | d (device) |
| 1003 | IQOS ILUMA ONE | d (device) |

**Future Products** (Out of scope for V1):
- VEEV products (devices and flavours)
- ZYN products (flavours)
- IQOS accessories

### 4.3 Campaign Code Reference (V1)

**Campaign Codes (`cc`):**
| Campaign Code | Campaign Name | Theme Colors | Description |
|--------------|---------------|--------------|-------------|
| 101 | Electric Blue | Blue spectrum | Bold, energetic, modern |
| 102 | Slate | Gray spectrum | Sophisticated, minimal, elegant |
| 103 | Electric Purple | Purple spectrum | Creative, premium, distinctive |

**Campaign Impact:**
- **UI Theming**: Campaign-specific color palette (primary, secondary, accent)
- **3D Models**: Product models with campaign-specific materials/finishes
- **Content**: Campaign-specific marketing copy and imagery
- **Consistency**: All products within a campaign share visual language

### 4.4 URL Parameter Examples

**Same product, different campaigns:**
```
/en/product/IQOS?type=d&cc=101&prd=1001&uid=123  (ILUMAi PRIME - Electric Blue)
/en/product/IQOS?type=d&cc=102&prd=1001&uid=456  (ILUMAi PRIME - Slate)
/en/product/IQOS?type=d&cc=103&prd=1001&uid=789  (ILUMAi PRIME - Electric Purple)
```

**Different products, same campaign:**
```
/en/product/IQOS?type=d&cc=101&prd=1001&uid=123  (ILUMAi PRIME - Electric Blue)
/en/product/IQOS?type=d&cc=101&prd=1002&uid=456  (ILUMAi - Electric Blue)
```

### 4.5 Brand Assets Required

**Per Product (prd):**
- Base 3D model (GLTF/GLB format)
- Product specifications
- Feature descriptions (translated)
- Product photography

**Per Campaign (cc):**
- Campaign-specific 3D materials/textures
- Color palette (primary, secondary, accent)
- Campaign background imagery
- Marketing copy (translated)
- Campaign video content

**Per Brand:**
- Typography specifications
- Logo and brand marks
- Icon set
- Brand guidelines

**Status**: Brand colors, logos, and assets available ✓

---

## 5. Core Features & Requirements

### 5.1 3D Model Display

**Requirements:**
- Load and display product-specific 3D models
- Smooth rotation/interaction (touch gestures on mobile)
- Optimized loading (progressive loading, fallbacks)
- Beautiful lighting and materials
- Auto-rotate with user override

**Technical:**
- React Three Fiber Canvas
- OrbitControls (limited zoom, free rotation)
- Suspense boundaries with loading states
- Model optimization (<5MB per model)

### 5.2 Animation Systems

#### Scroll-Based Animations
- Parallax effects on unboxing page
- Fade-in/fade-out transitions
- Scale and position transformations
- Scroll progress indicators

**Implementation**: Framer Motion with `useScroll` hook

#### Video Scrubbing
- Video playback controlled by scroll position
- Smooth frame-by-frame playback
- Progress indicator
- Works on mobile touch

**Implementation**: GSAP ScrollTrigger + HTML5 Video

#### Page Transitions
- Smooth enter/exit animations
- Brand-appropriate motion design
- Loading states for 3D content

**Implementation**: Framer Motion AnimatePresence

### 5.3 Responsive Design

**Breakpoints:**
- Mobile: 375px - 767px (primary target)
- Tablet: 768px - 1023px
- Desktop: 1024px+ (secondary)

**Mobile-First Requirements:**
- Touch-optimized interactions
- Performance on mid-range devices
- Reduced motion for accessibility
- Optimized asset delivery

### 5.4 Design System

#### Brand Tokens (CSS Variables)
```css
/* Per-campaign color variables */
--campaign-primary        /* Changes per campaign code (cc) */
--campaign-secondary      /* Changes per campaign code (cc) */
--campaign-accent         /* Changes per campaign code (cc) */
--brand-text
--brand-background

/* Typography */
--font-heading
--font-body
--font-mono

/* Spacing (8px grid) */
--space-1 through --space-12
```

**Campaign-Based Theming:**
Each campaign code (`cc`) defines its own color palette and visual theme. CSS variables are dynamically updated based on the `cc` URL parameter.

Example:
```typescript
// Campaign themes configuration
const campaignThemes = {
  101: { // Electric Blue campaign
    name: 'Electric Blue',
    primary: '#0066CC',
    secondary: '#00AAFF',
    accent: '#66D9FF'
  },
  102: { // Slate campaign
    name: 'Slate',
    primary: '#4A5568',
    secondary: '#718096',
    accent: '#A0AEC0'
  },
  103: { // Electric Purple campaign
    name: 'Electric Purple',
    primary: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#C4B5FD'
  }
}
```

#### Component Structure
- Reusable 3D viewer component
- Brand-aware button/link components
- Language switcher (EN/FR toggle)
- Responsive navigation
- Loading skeletons
- Error boundaries

**shadcn/ui Components:**
- Dialog (for modals)
- Card (for content blocks)
- Button (base component)
- Accordion (for FAQs)
- DropdownMenu (for language selector)

### 5.5 Performance Requirements

**Load Time Goals:**
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- 3D Model Load: <2s

**Optimization Strategies:**
- Code splitting by route
- Lazy loading for 3D models
- Image optimization (WebP, lazy load)
- Vite build optimizations
- Asset CDN delivery

### 5.6 Internationalization (i18n)

**Supported Languages (V1):**
- English (en)
- French (fr)

**Implementation: react-i18next**

**Language Detection:**
1. URL path parameter (e.g., `/en/product/...` or `/fr/product/...`)
2. Falls back to browser language if no URL parameter
3. Falls back to English as default

**Language Switching:**
- Language selector component in header/navigation
- Persists language choice to localStorage
- Updates URL when language changes (e.g., `/en/...` → `/fr/...`)
- Preserves all other URL parameters (productId, color, etc.)

**Translation Structure:**
```typescript
// en/translation.json
{
  "welcome": {
    "title": "Welcome to {{productName}}",
    "subtitle": "Your journey begins here"
  },
  "unboxing": {
    "hero": "Experience Innovation",
    "cta": "Start Exploring"
  },
  "support": {
    "title": "Welcome Back",
    "features": "Explore Features",
    "faq": "Frequently Asked Questions"
  }
}
```

**Content to Translate:**
- All UI text (buttons, labels, headings)
- Marketing copy (hero sections, feature descriptions)
- Support content (FAQs, instructions)
- Error messages
- Loading states

**Not Translated:**
- Product names (brand-specific)
- Technical specifications
- URLs (except language prefix)

**Route Structure:**
```typescript
<Routes>
  <Route path="/:lang" element={<LanguageWrapper />}>
    <Route path="product/:productId" element={<ProductExperience />} />
  </Route>
</Routes>
```

---

## 6. Database Design (Supabase)

### 6.1 Schema

#### Table: `products`
```sql
CREATE TABLE products (
  prd INTEGER NOT NULL,             -- Product code (e.g., 1001 = ILUMAi PRIME)
  brand TEXT NOT NULL,              -- Brand (IQOS, VEEV, ZYN)
  name TEXT NOT NULL,               -- Product name (e.g., "IQOS ILUMAi PRIME")
  type TEXT NOT NULL,               -- Type: 'd' (device), 'f' (flavour), 'a' (accessory)
  model_url TEXT,                   -- URL to base 3D model
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (prd, brand)
);
```

#### Table: `campaigns`
```sql
CREATE TABLE campaigns (
  cc INTEGER PRIMARY KEY,           -- Campaign code (e.g., 101, 102, 103)
  name TEXT NOT NULL,               -- Campaign name (e.g., "Electric Blue")
  theme_primary TEXT NOT NULL,      -- Primary color hex
  theme_secondary TEXT NOT NULL,    -- Secondary color hex
  theme_accent TEXT NOT NULL,       -- Accent color hex
  description TEXT,                 -- Campaign description
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `units`
```sql
CREATE TABLE units (
  uid BIGINT PRIMARY KEY,           -- Unique unit identifier
  prd INTEGER NOT NULL,             -- Product code
  brand TEXT NOT NULL,              -- Brand
  cc INTEGER NOT NULL,              -- Campaign code
  manufactured_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (prd, brand) REFERENCES products(prd, brand),
  FOREIGN KEY (cc) REFERENCES campaigns(cc)
);
```

**Example Data:**
```sql
-- Products
INSERT INTO products (prd, brand, name, type, model_url) VALUES
  (1001, 'IQOS', 'IQOS ILUMAi PRIME', 'd', '/models/iluma-i-prime.glb'),
  (1002, 'IQOS', 'IQOS ILUMAi', 'd', '/models/iluma-i.glb'),
  (1003, 'IQOS', 'IQOS ILUMA ONE', 'd', '/models/iluma-one.glb');

-- Campaigns
INSERT INTO campaigns (cc, name, theme_primary, theme_secondary, theme_accent) VALUES
  (101, 'Electric Blue', '#0066CC', '#00AAFF', '#66D9FF'),
  (102, 'Slate', '#4A5568', '#718096', '#A0AEC0'),
  (103, 'Electric Purple', '#7C3AED', '#A78BFA', '#C4B5FD');

-- Units (individual devices)
INSERT INTO units (uid, prd, brand, cc) VALUES
  (789456, 1001, 'IQOS', 101),  -- ILUMAi PRIME in Electric Blue
  (789457, 1001, 'IQOS', 102),  -- ILUMAi PRIME in Slate
  (789458, 1002, 'IQOS', 101);  -- ILUMAi in Electric Blue
```

#### Table: `scans`
```sql
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid BIGINT NOT NULL,              -- References units(uid)
  device_fingerprint TEXT NOT NULL,  -- Browser fingerprint
  scan_count INTEGER DEFAULT 1,
  first_scan_at TIMESTAMP DEFAULT NOW(),
  last_scan_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  FOREIGN KEY (uid) REFERENCES units(uid),
  UNIQUE(uid, device_fingerprint)
);
```

**Note**: The `scans` table tracks unique combinations of physical unit (`uid`) and user device (fingerprint). Each unique user scanning a specific unit creates one record, updated on subsequent scans.

### 6.2 Key Queries

**Fetch Complete Product Experience Data:**
```javascript
// Get unit with product and campaign info
const { data: unit } = await supabase
  .from('units')
  .select(`
    uid,
    prd,
    brand,
    cc,
    products (
      name,
      type,
      model_url
    ),
    campaigns (
      name,
      theme_primary,
      theme_secondary,
      theme_accent
    )
  `)
  .eq('uid', uid)
  .single()

// Result structure:
// {
//   uid: 789456,
//   prd: 1001,
//   brand: 'IQOS',
//   cc: 101,
//   products: { name: 'IQOS ILUMAi PRIME', type: 'd', model_url: '/models/...' },
//   campaigns: { name: 'Electric Blue', theme_primary: '#0066CC', ... }
// }
```

**Check Scan History:**
```javascript
const { data } = await supabase
  .from('scans')
  .select('scan_count, first_scan_at')
  .eq('uid', uid)
  .eq('device_fingerprint', fingerprint)
  .single()
```

**Record New Scan:**
```javascript
await supabase
  .from('scans')
  .upsert({
    uid: uid,
    device_fingerprint: fingerprint,
    scan_count: (existingCount || 0) + 1,
    last_scan_at: new Date().toISOString()
  })
```

### 6.3 Device Identification

**Approach**: Browser fingerprinting (no authentication required)

**Library**: FingerprintJS or custom fingerprint
- Combines: User Agent, Screen Resolution, Canvas Fingerprint, Timezone
- Stored in localStorage as backup
- ~95% accuracy for returning users

**Trade-offs:**
- ✓ No login required (frictionless)
- ✓ Works across sessions
- ✗ Not 100% accurate (acceptable for concept)
- ✗ Cleared on browser data wipe

---

## 7. URL & NFC Handling

### 7.1 URL Structure

**Pattern:**
```
/:lang/product/:brand?type=:type&cc=:cc&prd=:prd&uid=:uid
```

**Example:**
```
/en/product/IQOS?type=d&cc=101&prd=1001&uid=789456
```

**Validation:**
- `lang` must be one of: en, fr
- `brand` must be one of: IQOS, VEEV, ZYN (case-sensitive path param)
- `type` must be one of: d, f, a
- `cc` must exist in `campaigns` table (INTEGER)
- `prd` must exist in `products` table for given brand (INTEGER)
- `uid` must exist in `units` table (BIGINT)

### 7.2 Routing Implementation

```typescript
// routes.tsx
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/:lang" element={<LanguageWrapper />}>
    <Route path="product/:brand" element={<ProductExperience />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>
```

```typescript
// ProductExperience.tsx
const { lang, brand } = useParams()
const [searchParams] = useSearchParams()
const type = searchParams.get('type')      // 'd', 'f', 'a'
const cc = parseInt(searchParams.get('cc')) // Campaign code (e.g., 101)
const prd = parseInt(searchParams.get('prd')) // Product code (e.g., 1001)
const uid = parseInt(searchParams.get('uid')) // Unit ID (e.g., 789456)

// 1. Initialize i18n with lang parameter
// 2. Fetch complete unit data (product + campaign) from Supabase
// 3. Apply campaign theme based on cc (CSS variables)
// 4. Check scan history for this uid + device fingerprint
// 5. Render appropriate experience (first scan vs. return scan)
```

```typescript
// Example data flow
const { data: unitData } = await supabase
  .from('units')
  .select(`
    *,
    products(name, model_url),
    campaigns(name, theme_primary, theme_secondary, theme_accent)
  `)
  .eq('uid', uid)
  .single()

// Apply campaign theme
document.documentElement.style.setProperty('--campaign-primary', unitData.campaigns.theme_primary)
document.documentElement.style.setProperty('--campaign-secondary', unitData.campaigns.theme_secondary)
document.documentElement.style.setProperty('--campaign-accent', unitData.campaigns.theme_accent)
```

### 7.3 Error Handling

**Invalid UID:**
- Query returns no unit → display "Invalid product code"
- Link to brand homepage
- Log error with uid for debugging

**Invalid Parameters:**
- Missing type, cc, prd, or uid → display parameter error
- Invalid parameter formats → display format error
- Non-existent campaign code → fall back to default campaign

**Database Mismatches:**
- Unit's prd doesn't match URL prd → log warning, use unit data
- Unit's cc doesn't match URL cc → log warning, use unit data
- Unit's brand doesn't match URL brand → display error

**Network Errors:**
- Retry logic (3 attempts) for database queries
- Offline message if connection fails
- Loading states during data fetch

---

## 8. Content & Pages

### 8.1 First Scan: Unboxing Experience

**Page Sections:**

1. **Hero Section**
   - Full-screen 3D product model
   - Animated brand logo entrance
   - "Welcome to [Product Name]"

2. **Scroll Journey** (Parallax)
   - Product highlights (3-4 screens)
   - Feature callouts with animations
   - Video content (auto-play on scroll)

3. **Getting Started**
   - Quick setup guide
   - Visual instructions
   - CTA: "Start Exploring"

4. **Footer**
   - Support link
   - Brand information

### 8.2 Subsequent Scans: Support Hub

**Page Sections:**

1. **Welcome Back**
   - Smaller 3D model
   - "Welcome back to [Product Name]"
   - Quick stats (optional)

2. **Feature Grid**
   - Product features with expand/collapse
   - Video demonstrations
   - Interactive guides

3. **Support Resources**
   - FAQ accordion
   - Troubleshooting guides
   - Contact support
   - **Link to iqos.com for registration**

4. **Discover More**
   - Related products
   - Community links

---

## 9. Development Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETED
- [x] Project setup (Vite, React, TypeScript)
- [x] Supabase configuration and database schema (products, campaigns, units, scans)
- [x] Routing implementation with language and brand parameters
- [x] i18n setup (react-i18next, EN/FR translations structure)
- [x] Design system setup (Tailwind, CSS variables)
- [x] Campaign-based theming system (cc parameter → CSS variables)
- [x] Language switcher component
- [x] URL parameter parsing and validation (type, cc, prd, uid)
- [x] Device fingerprinting
- [x] Seed database with initial products and campaigns
- [x] ProductExperience page with placeholder views
- [x] Complete scan history logic
- [x] Error handling and loading states

**Status**: All foundation components complete and functional. Database seeding script ready (`supabase-seed.sql`). Setup documentation in `SETUP.md`. Ready for Phase 2.

### Phase 2: First Scan Experience (Week 2-3)
- [ ] 3D model integration (React Three Fiber)
- [ ] Unboxing page layout with i18n content
- [ ] Parallax scroll implementation
- [ ] Framer Motion animations
- [ ] Campaign theming application (dynamic CSS variables)
- [ ] First product complete (prd=1001, cc=101: ILUMAi PRIME in Electric Blue)

### Phase 3: Scan Tracking (Week 3-4) ✅ COMPLETED IN PHASE 1
- [x] Supabase scan recording
- [x] Device fingerprint storage
- [x] Scan history logic
- [x] Experience routing (first vs. return)
- [x] Error handling

**Note**: Scan tracking was implemented during Phase 1 as part of the foundation.

### Phase 4: Subsequent Scan Experience (Week 4-5)
- [ ] Support hub page layout with i18n content
- [ ] Feature grid with animations
- [ ] FAQ accordion with translated content
- [ ] Video scrubbing implementation (GSAP)
- [ ] External links (iqos.com)
- [ ] Language persistence across scans

### Phase 5: Multi-Campaign & Polish (Week 5-6)
- [ ] Additional campaigns (cc=102 Slate, cc=103 Electric Purple)
- [ ] Additional products (prd=1002 ILUMAi, prd=1003 ILUMA ONE)
- [ ] Campaign-specific 3D materials/textures
- [ ] Complete French translations
- [ ] Performance optimization
- [ ] Mobile testing & refinement (both languages)
- [ ] Loading states & error boundaries
- [ ] Language switcher testing
- [ ] Cross-campaign consistency validation

### Phase 6: Stakeholder Prep (Week 6-7)
- [ ] Demo flow documentation
- [ ] Test NFC tags with URLs
- [ ] Performance audit
- [ ] Cross-browser testing
- [ ] Presentation materials
- [ ] Deployment to production URL

---

## 10. Success Criteria

### Technical Success
- ✅ Multiple IQOS products across multiple campaigns functional
- ✅ Campaign-based theming system works correctly (cc parameter)
- ✅ 3D models load and render on mobile devices
- ✅ Animations smooth on mid-range devices (60fps)
- ✅ First scan vs. return scan logic works reliably (uid tracking)
- ✅ Load time <3s on 4G connection
- ✅ No critical bugs on iOS Safari & Android Chrome
- ✅ English and French translations complete and accurate
- ✅ Language switching works seamlessly
- ✅ URL parameter system works correctly (type, cc, prd, uid)

### Stakeholder Success
- ✅ Visually impressive demo that showcases technical capabilities
- ✅ Smooth presentation flow (scan → experience)
- ✅ Clear differentiation between campaigns (themes, colors)
- ✅ Demonstrates scalability potential (multi-language, multi-campaign, multi-product)
- ✅ Professional polish matching brand standards
- ✅ Bilingual support demonstrates international readiness
- ✅ Campaign system demonstrates marketing flexibility

### Future Considerations
- Analytics integration (if approved)
- CMS for content management (if scaled)
- User authentication (if required)
- Real-time features (notifications, updates)
- Native app considerations

---

## 11. Out of Scope (V1)

**Not included in concept demo:**
- User accounts / authentication
- CMS or admin panel for campaign/product management
- Real customer support integration (chat, tickets)
- Analytics dashboard
- E-commerce integration
- Push notifications
- Offline functionality
- Additional languages beyond English and French
- A/B testing
- Backend API (using Supabase directly)
- VEEV and ZYN products (IQOS only for V1)
- Flavour (type='f') and Accessory (type='a') support (devices only for V1)
- Dynamic campaign creation (campaigns managed in database)

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| 3D models too large for mobile | High | Optimize models, progressive loading, fallback images |
| Animation performance issues | Medium | Use GPU-accelerated animations, reduce motion on low-end devices |
| Browser fingerprinting inaccurate | Low | Acceptable for concept, add localStorage backup |
| NFC tags not working as expected | High | Test early with physical tags, have QR code backup |
| Supabase free tier limits | Low | Monitor usage, upgrade if needed |
| Cross-browser compatibility | Medium | Test early on iOS Safari, Android Chrome |

---

## 13. Open Questions

1. **Deployment URL**: What domain will be used? (e.g., experience.iqos.com)
2. **NFC Tag Encoding**: Who will encode physical NFC tags with complete URLs (lang, brand, type, cc, prd, uid)?
3. **UID Generation**: How are unique unit IDs (uid) assigned? Sequential? Random? Who manages the uid registry?
4. **3D Models**: What level of detail? File size constraints? Who creates campaign-specific materials?
5. **Video Content**: Who creates product videos? Format/duration? Needs French voiceover/subtitles?
6. **Timeline**: Target date for stakeholder presentation?
7. **Testing Devices**: What devices should be prioritized for testing?
8. **Campaign Assets**: Who designs campaign-specific brand assets (backgrounds, images, materials)?
9. **French Translations**: Who will provide/review French translations for accuracy?
10. **Campaign Definitions**: What makes a campaign? How are new campaigns defined and approved?
11. **Product Codes**: Who assigns prd codes? Is there a registry system?
12. **Default Language**: Should NFC tags always specify language, or detect browser default?

---

## 14. Next Steps

1. **Immediate**: Set up project repository and development environment
2. **Week 1**: Build foundation and integrate first IQOS product
3. **Weekly Check-ins**: Review progress, adjust priorities
4. **Ongoing**: Collect 3D models, videos, and content as available
5. **Pre-Demo**: Schedule testing session with physical NFC tags

---

**Document Version**: 2.0
**Last Updated**: 2025-11-04
**Owner**: Product Development Team
**Stakeholders**: Senior Leadership Team

**Changelog:**
- v2.0: **MAJOR REVISION** - New URL structure with numerical codes (type, cc, prd, uid), campaign-based theming system, updated database schema with products/campaigns/units tables, brand in URL path
- v1.1: Added multi-language support (EN/FR), color variant system, updated product catalog to IQOS-only focus with color variants
- v1.0: Initial PRD
