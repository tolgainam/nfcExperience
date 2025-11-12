-- Migration: Add model scale, position, and rotation fields to products table
-- This allows each product to have custom 3D model transformations

ALTER TABLE products
ADD COLUMN model_scale DECIMAL DEFAULT 10.0,
ADD COLUMN model_position_x DECIMAL DEFAULT 0.0,
ADD COLUMN model_position_y DECIMAL DEFAULT 0.0,
ADD COLUMN model_position_z DECIMAL DEFAULT 0.0,
ADD COLUMN model_rotation_x DECIMAL DEFAULT 0.0,
ADD COLUMN model_rotation_y DECIMAL DEFAULT 0.0,
ADD COLUMN model_rotation_z DECIMAL DEFAULT 0.0;

-- Add comments for documentation
COMMENT ON COLUMN products.model_scale IS 'Scale multiplier for 3D model rendering (default: 10.0)';
COMMENT ON COLUMN products.model_position_x IS 'X-axis position offset for 3D model (default: 0.0)';
COMMENT ON COLUMN products.model_position_y IS 'Y-axis position offset for 3D model (default: 0.0)';
COMMENT ON COLUMN products.model_position_z IS 'Z-axis position offset for 3D model (default: 0.0)';
COMMENT ON COLUMN products.model_rotation_x IS 'X-axis rotation in degrees for 3D model (default: 0.0)';
COMMENT ON COLUMN products.model_rotation_y IS 'Y-axis rotation in degrees for 3D model (default: 0.0)';
COMMENT ON COLUMN products.model_rotation_z IS 'Z-axis rotation in degrees for 3D model (default: 0.0)';
