# NFC Experience - Setup Guide

## Phase 1 Complete! ✅

The foundation is ready. Here's how to get started.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)

## Setup Steps

### 1. Install Dependencies

Dependencies are already installed! If you need to reinstall:

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to initialize (2-3 minutes)

#### Run Database Setup

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase-seed.sql`
5. Paste into the SQL editor
6. Click "Run" to execute

This will:
- Create all necessary tables (products, campaigns, units, scans, settings)
- Set up foreign key relationships
- Insert seed data (3 products, 3 campaigns, 6 test units, global settings)
- Configure Row Level Security policies

#### Get Your Supabase Credentials

1. Go to Project Settings (gear icon)
2. Click "API" in the sidebar
3. Copy your:
   - Project URL
   - `anon` `public` API key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Testing the App

### Test URLs

Once the dev server is running, try these URLs:

**English - Electric Blue Campaign:**
```
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001
```

**French - Slate Campaign:**
```
http://localhost:5173/fr/product/IQOS?type=d&cc=102&prd=1001&uid=999002
```

**Electric Purple Campaign:**
```
http://localhost:5173/en/product/IQOS?type=d&cc=103&prd=1001&uid=999003
```

### What to Test

✅ **Language Switching:**
- Click the language toggle in the top right
- URL should update from `/en/...` to `/fr/...`
- All text should translate
- Reload the page - language should persist

✅ **Campaign Theming:**
- Load different `cc` values (101, 102, 103)
- Observe color changes in heading and buttons
- Check CSS variables in browser DevTools

✅ **Scan History:**
- First visit to a `uid` = "Welcome to..." (Unboxing)
- Reload same `uid` = "Welcome Back" (Support Hub)
- Try different `uid` = Back to unboxing experience
- Clear localStorage to reset

✅ **Different Products:**
- Try `prd=1001` (ILUMAi PRIME)
- Try `prd=1002` (ILUMAi)
- Try `prd=1003` (ILUMA ONE)

## Project Structure

```
/src
  /components      - React components (LanguageWrapper, LanguageSwitcher)
  /pages           - Route pages (ProductExperience)
  /lib             - Utilities (supabase client, i18n, fingerprinting, URL parsing)
  /hooks           - Custom hooks (useCampaignTheme)
  /types           - TypeScript types (database types)
  /locales         - Translation files (en, fr)
    /en            - English translations
    /fr            - French translations
  /themes          - Campaign theme configurations (future use)
  /assets/models   - 3D models (Phase 2)
```

## What's Built (Phase 1) ✅

- ✅ Vite + React + TypeScript setup
- ✅ Tailwind CSS with campaign CSS variables
- ✅ React Router with language (`/:lang`) and brand parameters
- ✅ i18next internationalization (English + French)
- ✅ Supabase database with all tables and seed data
- ✅ URL parameter parsing (type, cc, prd, uid)
- ✅ Device fingerprinting for scan tracking
- ✅ Language switcher component
- ✅ Campaign-based theming system
- ✅ Scan history logic (first scan vs return scan)
- ✅ Placeholder unboxing and support hub pages

## Next Steps (Phase 2)

- [ ] 3D model integration (React Three Fiber)
- [ ] Unboxing page with parallax scroll
- [ ] Framer Motion animations
- [ ] First product experience complete

## Available Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Linting
npm run lint             # Run ESLint
```

## Scan Cooldown Period

The app includes a configurable cooldown period to control when users see the "return scan" experience.

### How It Works

- **First Scan**: Shows unboxing experience
- **Within Cooldown** (default 300s = 5 minutes): Still shows unboxing
- **After Cooldown**: Shows support hub

### Changing the Cooldown

Go to Supabase → Table Editor → `settings` → Edit `scan_cooldown_seconds`:

| Value | Duration |
|-------|----------|
| 0 | No cooldown (immediate transition) |
| 60 | 1 minute |
| 300 | 5 minutes (default) |
| 600 | 10 minutes |
| 3600 | 1 hour |

Or via SQL:
```sql
UPDATE settings SET value = '60' WHERE key = 'scan_cooldown_seconds';
```

### Testing Within Cooldown

1. Visit a test URL
2. See unboxing experience
3. Refresh within 5 minutes
4. Still see unboxing (cooldown active)
5. Wait 5+ minutes or manually adjust timestamp
6. Refresh → See support hub

## Pre-Registration Modes

The app supports two deployment models controlled by the `pre_registration_required` setting. This is a powerful feature for demonstrating different use cases to stakeholders.

### Mode 1: Pre-Registration Required (Default)

**Setting**: `pre_registration_required = 'true'`

**How It Works**:
- Only UIDs that exist in the `units` table will work
- Each UID must be pre-registered with its product (prd), brand, and campaign (cc)
- Attempting to scan an unregistered UID shows an error
- **Use Case**: Enterprise/production deployments with controlled inventory

**Example**:
```sql
-- Only these UIDs will work:
SELECT uid FROM units; -- Returns: 999001, 999002, 999003, etc.
```

### Mode 2: Open Access (Flexible Demo Mode)

**Setting**: `pre_registration_required = 'false'`

**How It Works**:
- Any UID in the URL will work (no units table validation)
- App fetches product and campaign data from URL parameters (prd, cc, brand)
- Units table is not used (though it can still exist)
- Scan tracking still works in the `scans` table
- **Use Case**: Demos, prototypes, POCs where you need flexibility

**Example**:
```
# Any uid value will work:
/en/product/IQOS?type=d&cc=101&prd=1001&uid=888888  ✅
/en/product/IQOS?type=d&cc=102&prd=1002&uid=777777  ✅
```

### Changing Pre-Registration Mode

⚠️ **Important**: This setting should be configured once at deployment and not changed mid-demo.

**Via Supabase Table Editor**:
1. Go to Table Editor → `settings` table
2. Find row with key = `pre_registration_required`
3. Edit `value` to `'true'` or `'false'`

**Via SQL**:
```sql
-- Enable pre-registration (secure mode)
UPDATE settings SET value = 'true' WHERE key = 'pre_registration_required';

-- Disable pre-registration (flexible mode)
UPDATE settings SET value = 'false' WHERE key = 'pre_registration_required';
```

### Comparison Table

| Feature | Pre-Registration ON | Pre-Registration OFF |
|---------|---------------------|----------------------|
| UID Validation | Required in units table | Any UID accepted |
| Units Table | Required | Optional (unused) |
| Security | High (controlled inventory) | Low (open access) |
| Flexibility | Low (must pre-register) | High (any UID works) |
| Use Case | Production, Enterprise | Demos, Prototypes |
| Scan Tracking | ✅ Works | ✅ Works |
| Campaign Theming | ✅ Works | ✅ Works |
| Language Support | ✅ Works | ✅ Works |

### Testing Pre-Registration Modes

**Test Pre-Registration ON (default)**:
1. Ensure setting is `'true'`
2. Try registered UID: `/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001` → ✅ Works
3. Try unregistered UID: `/en/product/IQOS?type=d&cc=101&prd=1001&uid=888888` → ❌ Error

**Test Pre-Registration OFF**:
1. Change setting to `'false'`
2. Try any UID: `/en/product/IQOS?type=d&cc=101&prd=1001&uid=888888` → ✅ Works
3. Try another UID: `/en/product/IQOS?type=d&cc=102&prd=1002&uid=777777` → ✅ Works
4. Scan tracking still works (check `scans` table)

## Troubleshooting

### "Missing Supabase environment variables" error

Make sure `.env.local` exists and contains valid credentials:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### Database queries failing

1. Check Supabase dashboard - is the project active?
2. Verify you ran the `supabase-seed.sql` script
3. Check RLS policies are enabled
4. Check browser console for detailed error messages

### Language not switching

1. Check browser console for errors
2. Verify translation files exist in `/src/locales/`
3. Clear browser cache and localStorage

### Campaign colors not changing

1. Open browser DevTools
2. Go to Elements > Inspect `<html>` element
3. Check if CSS variables are being set:
   - `--campaign-primary`
   - `--campaign-secondary`
   - `--campaign-accent`

## Database Schema Quick Reference

**URL Format:**
```
/:lang/product/:BRAND?type=:type&cc=:cc&prd=:prd&uid=:uid
```

**Example:**
```
/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001
```

**Parameters:**
- `lang`: en, fr
- `BRAND`: IQOS, VEEV, ZYN
- `type`: d (device), f (flavour), a (accessory)
- `cc`: Campaign code (101, 102, 103)
- `prd`: Product code (1001, 1002, 1003)
- `uid`: Unique unit identifier

**Test Units in Database:**
| UID | Product | Campaign | URL |
|-----|---------|----------|-----|
| 999001 | ILUMAi PRIME | Electric Blue | cc=101&prd=1001&uid=999001 |
| 999002 | ILUMAi PRIME | Slate | cc=102&prd=1001&uid=999002 |
| 999003 | ILUMAi PRIME | Electric Purple | cc=103&prd=1001&uid=999003 |
| 999004 | ILUMAi | Electric Blue | cc=101&prd=1002&uid=999004 |
| 999005 | ILUMAi | Slate | cc=102&prd=1002&uid=999005 |
| 999006 | ILUMA ONE | Electric Blue | cc=101&prd=1003&uid=999006 |

## Support

For issues or questions:
1. Check `/Requirements/prd.md` for full specifications
2. Check `CLAUDE.md` for development guidelines
3. Review this SETUP.md for configuration help

Happy coding! 🚀
