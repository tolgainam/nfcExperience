-- Migration: Remove device fingerprinting from scans table
-- This migration transitions from per-user tracking to per-unit tracking
-- Run this in your Supabase SQL Editor AFTER the initial seed

-- ============================================
-- BACKUP EXISTING DATA (Optional)
-- ============================================
-- Uncomment if you want to preserve scan history
-- CREATE TABLE scans_backup AS SELECT * FROM scans;

-- ============================================
-- CLEAN UP DUPLICATE RECORDS FIRST
-- ============================================

-- If there are multiple scan records for the same uid (from different fingerprints),
-- keep only the earliest one and delete the rest
WITH ranked_scans AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY uid ORDER BY first_scan_at ASC) as rn
  FROM scans
)
DELETE FROM scans
WHERE id IN (
  SELECT id FROM ranked_scans WHERE rn > 1
);

-- ============================================
-- DROP OLD CONSTRAINTS AND INDEXES
-- ============================================

-- Drop the old unique constraint that included device_fingerprint
ALTER TABLE scans DROP CONSTRAINT IF EXISTS scans_uid_device_fingerprint_key;

-- Drop the old index
DROP INDEX IF EXISTS idx_scans_uid_fingerprint;

-- ============================================
-- REMOVE FINGERPRINT COLUMN
-- ============================================

-- Remove device_fingerprint column
ALTER TABLE scans DROP COLUMN IF EXISTS device_fingerprint;

-- ============================================
-- ADD NEW CONSTRAINTS
-- ============================================

-- Add unique constraint on uid only (one scan record per unit)
ALTER TABLE scans ADD CONSTRAINT scans_uid_key UNIQUE (uid);

-- ============================================
-- CREATE NEW INDEX
-- ============================================

CREATE INDEX IF NOT EXISTS idx_scans_uid ON scans(uid);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'scans'
ORDER BY ordinal_position;

-- Check for any duplicate uids (should return 0 rows)
SELECT uid, COUNT(*) as count
FROM scans
GROUP BY uid
HAVING COUNT(*) > 1;
