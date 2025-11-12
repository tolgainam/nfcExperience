-- NFC Experience Database Schema and Seed Data
-- Run this in your Supabase SQL Editor

-- ============================================
-- CREATE TABLES
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  prd INTEGER NOT NULL,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('d', 'f', 'a')),
  model_url TEXT,
  model_scale DECIMAL DEFAULT 10.0,
  model_position_x DECIMAL DEFAULT 0.0,
  model_position_y DECIMAL DEFAULT 0.0,
  model_position_z DECIMAL DEFAULT 0.0,
  model_rotation_x DECIMAL DEFAULT 0.0,
  model_rotation_y DECIMAL DEFAULT 0.0,
  model_rotation_z DECIMAL DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (prd, brand)
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  cc INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  theme_primary TEXT NOT NULL,
  theme_secondary TEXT NOT NULL,
  theme_accent TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units table (individual physical devices)
CREATE TABLE IF NOT EXISTS units (
  uid BIGINT PRIMARY KEY,
  prd INTEGER NOT NULL,
  brand TEXT NOT NULL,
  cc INTEGER NOT NULL,
  manufactured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (prd, brand) REFERENCES products(prd, brand),
  FOREIGN KEY (cc) REFERENCES campaigns(cc)
);

-- Scans table (track unit scans - UID only, no fingerprinting)
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid BIGINT NOT NULL UNIQUE,
  scan_count INTEGER DEFAULT 1,
  first_scan_at TIMESTAMPTZ DEFAULT NOW(),
  last_scan_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT
);
-- Note: No foreign key constraint on uid - allows scans without pre-registration
-- Note: One scan record per unit (uid). First scan = unboxing, subsequent = support hub

-- Settings table (global configuration)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_units_uid ON units(uid);
CREATE INDEX IF NOT EXISTS idx_scans_uid ON scans(uid);

-- ============================================
-- INSERT SEED DATA
-- ============================================

-- Clear existing data (optional - remove if you want to keep data)
-- TRUNCATE TABLE scans, units, campaigns, products CASCADE;

-- Products
-- Note: model_scale, model_position, and model_rotation values should be customized per product
-- Default values: scale=10.0, position=[0.0, 0.0, 0.0], rotation=[0.0, 0.0, 0.0] (in degrees)
INSERT INTO products (prd, brand, name, type, model_url, model_scale, model_position_x, model_position_y, model_position_z, model_rotation_x, model_rotation_y, model_rotation_z) VALUES
  (1001, 'IQOS', 'IQOS ILUMAi PRIME', 'd', '/models/iluma-i-prime.glb', 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
  (1002, 'IQOS', 'IQOS ILUMAi', 'd', '/models/iluma-i.glb', 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
  (1003, 'IQOS', 'IQOS ILUMA ONE', 'd', '/models/iluma-one.glb', 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
ON CONFLICT (prd, brand) DO NOTHING;

-- Campaigns
INSERT INTO campaigns (cc, name, theme_primary, theme_secondary, theme_accent, description) VALUES
  (101, 'Electric Blue', '#0066CC', '#00AAFF', '#66D9FF', 'Bold, energetic, modern blue theme'),
  (102, 'Slate', '#4A5568', '#718096', '#A0AEC0', 'Sophisticated, minimal, elegant gray theme'),
  (103, 'Electric Purple', '#7C3AED', '#A78BFA', '#C4B5FD', 'Creative, premium, distinctive purple theme')
ON CONFLICT (cc) DO NOTHING;

-- Test Units (for development)
INSERT INTO units (uid, prd, brand, cc, manufactured_at) VALUES
  (999001, 1001, 'IQOS', 101, NOW()),  -- ILUMAi PRIME in Electric Blue
  (999002, 1001, 'IQOS', 102, NOW()),  -- ILUMAi PRIME in Slate
  (999003, 1001, 'IQOS', 103, NOW()),  -- ILUMAi PRIME in Electric Purple
  (999004, 1002, 'IQOS', 101, NOW()),  -- ILUMAi in Electric Blue
  (999005, 1002, 'IQOS', 102, NOW()),  -- ILUMAi in Slate
  (999006, 1003, 'IQOS', 101, NOW())   -- ILUMA ONE in Electric Blue
ON CONFLICT (uid) DO NOTHING;

-- Global Settings
INSERT INTO settings (key, value, description) VALUES
  ('scan_cooldown_seconds', '300', 'Seconds after first scan before showing return experience (300s = 5min, 3600s = 1hr)'),
  ('pre_registration_required', 'true', 'Whether UIDs must exist in units table (true) or can be any value from URL (false). Set once at deployment.')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public-facing app)
-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on campaigns" ON campaigns;
DROP POLICY IF EXISTS "Allow public read access on units" ON units;
DROP POLICY IF EXISTS "Allow public read access on settings" ON settings;
DROP POLICY IF EXISTS "Allow public read access on scans" ON scans;
DROP POLICY IF EXISTS "Allow public insert on scans" ON scans;
DROP POLICY IF EXISTS "Allow public update on scans" ON scans;

CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public read access on units" ON units FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);

-- Scans: Allow public read and insert (users can read and create their own scans)
CREATE POLICY "Allow public read access on scans" ON scans FOR SELECT USING (true);
CREATE POLICY "Allow public insert on scans" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on scans" ON scans FOR UPDATE USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check data was inserted correctly
SELECT 'Products:', COUNT(*) FROM products;
SELECT 'Campaigns:', COUNT(*) FROM campaigns;
SELECT 'Units:', COUNT(*) FROM units;
SELECT 'Scans:', COUNT(*) FROM scans;
SELECT 'Settings:', COUNT(*) FROM settings;

-- View test units with full details
SELECT
  u.uid,
  p.name as product_name,
  c.name as campaign_name,
  c.theme_primary,
  u.brand
FROM units u
JOIN products p ON u.prd = p.prd AND u.brand = p.brand
JOIN campaigns c ON u.cc = c.cc
WHERE u.uid >= 999001 AND u.uid <= 999006
ORDER BY u.uid;
