# Testing Scan Logic

## Understanding the Scan Flow

The current implementation records a scan **immediately** on page load. This is intentional for tracking purposes, but it means:

1. **First visit**: No scan record → Show "Unboxing" → Record scan
2. **Second visit**: Scan record exists → Show "Support Hub"

## How to Test Fresh Scans

### Method 1: Use Different UIDs (Recommended)

Each `uid` is tracked separately, so use different test units:

```
First scan tests:
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001
http://localhost:5173/en/product/IQOS?type=d&cc=102&prd=1001&uid=999002
http://localhost:5173/en/product/IQOS?type=d&cc=103&prd=1001&uid=999003
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1002&uid=999004
http://localhost:5173/en/product/IQOS?type=d&cc=102&prd=1002&uid=999005
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1003&uid=999006
```

### Method 2: Clear Browser Fingerprint

Open browser console and run:
```javascript
localStorage.removeItem('device-fingerprint')
```
Then reload the page - a new fingerprint will be generated.

### Method 3: Use Incognito/Private Browsing

- Open incognito window
- Visit any test URL
- Will always be "first scan" since no fingerprint is stored

### Method 4: Clear All localStorage

Open browser console and run:
```javascript
localStorage.clear()
```

### Method 5: Delete Scan Records (Database)

Go to Supabase SQL Editor and run:
```sql
-- Delete all scan records
DELETE FROM scans;

-- Or delete specific uid
DELETE FROM scans WHERE uid = 999001;
```

## Testing Both States

### To see "First Scan" (Unboxing):
1. Use a fresh `uid` you haven't visited before
2. OR clear your fingerprint (Method 2)
3. OR use incognito mode (Method 3)

### To see "Return Scan" (Support Hub):
1. Visit the same `uid` a second time
2. Keep the same fingerprint
3. The scan record will exist, triggering support hub view

## Why It Works This Way

This mimics real-world NFC behavior:
- Each physical device has a unique `uid`
- Same user scanning same device = "return visit"
- Same user scanning different device = "new experience"
- Different user scanning same device = "new experience" (different fingerprint)

## Quick Test Sequence

1. **Visit**: `uid=999001` → See "Welcome to IQOS ILUMAi PRIME" (Unboxing)
2. **Reload**: `uid=999001` → See "Welcome Back" (Support Hub)
3. **Visit**: `uid=999002` → See "Welcome to IQOS ILUMAi PRIME" (Unboxing) ← New device!
4. **Reload**: `uid=999002` → See "Welcome Back" (Support Hub)

## Observing the State Change

If you're seeing a flash where it shows unboxing then immediately jumps to support hub, this is because:

1. React renders with initial state (`isFirstScan = true`)
2. Data loads from Supabase
3. Scan record is found
4. State updates to `isFirstScan = false`
5. Component re-renders with support hub

This is expected behavior during the loading phase. The loading spinner should prevent this flash in most cases.

## Debugging Tips

Open browser console and check:
```javascript
// Check your current fingerprint
localStorage.getItem('device-fingerprint')

// Check Supabase scans
// (Go to Supabase dashboard → Table Editor → scans)
```

## Production Behavior

In production, this will work perfectly:
- User scans NFC tag on box → First experience (unboxing)
- User scans again later → Return experience (support)
- User scans different product box → New first experience
