# Model Scale, Position, and Rotation Configuration Guide

## Overview

The app now supports per-product scale, position, and rotation multipliers stored in the database. This allows each 3D model to be sized, positioned, and oriented consistently regardless of their original dimensions and orientations.

## Database Changes

### New Columns Added to `products` Table

- `model_scale` (DECIMAL, default: 10.0) - Scale multiplier for the 3D model
- `model_position_x` (DECIMAL, default: 0.0) - X-axis position offset
- `model_position_y` (DECIMAL, default: 0.0) - Y-axis position offset
- `model_position_z` (DECIMAL, default: 0.0) - Z-axis position offset
- `model_rotation_x` (DECIMAL, default: 0.0) - X-axis rotation in **degrees**
- `model_rotation_y` (DECIMAL, default: 0.0) - Y-axis rotation in **degrees**
- `model_rotation_z` (DECIMAL, default: 0.0) - Z-axis rotation in **degrees**

## How to Apply the Changes

### Step 1: Run the Migration

Execute the migration SQL file in your Supabase SQL Editor:

```sql
-- File: supabase-migration-add-model-transforms.sql
-- This adds the new columns to existing database
```

Or if creating a fresh database, the updated `supabase-seed.sql` already includes these columns.

### Step 2: Set Scale, Position, and Rotation Values for Each Product

You need to provide specific values for each product model. Here's the template:

```sql
UPDATE products
SET
  model_scale = [YOUR_SCALE_VALUE],
  model_position_x = [X_OFFSET],
  model_position_y = [Y_OFFSET],
  model_position_z = [Z_OFFSET],
  model_rotation_x = [X_ROTATION_DEGREES],
  model_rotation_y = [Y_ROTATION_DEGREES],
  model_rotation_z = [Z_ROTATION_DEGREES]
WHERE prd = [PRODUCT_CODE] AND brand = '[BRAND_NAME]';
```

### Current Products That Need Configuration

Based on the seed data, you have these products:

1. **IQOS ILUMAi PRIME** (prd: 1001)
   - Model: `iluma-i-prime.glb` (14.8 MB)
   - Current defaults: scale=10.0, position=[0, 0, 0], rotation=[0, 0, 0]

2. **IQOS ILUMAi** (prd: 1002)
   - Model: `iluma-i.glb`
   - Current defaults: scale=10.0, position=[0, 0, 0], rotation=[0, 0, 0]

3. **IQOS ILUMA ONE** (prd: 1003)
   - Model: `iluma-one.glb` (9.4 KB - likely placeholder)
   - Current defaults: scale=10.0, position=[0, 0, 0], rotation=[0, 0, 0]

## Example SQL Updates

```sql
-- Example: Make ILUMAi PRIME larger, shift it down, and tilt it slightly
UPDATE products
SET
  model_scale = 12.0,
  model_position_x = 0.0,
  model_position_y = -0.5,
  model_position_z = 0.0,
  model_rotation_x = 5.0,   -- Slight 5° tilt forward
  model_rotation_y = 0.0,   -- No base Y rotation (scroll handles this)
  model_rotation_z = 0.0
WHERE prd = 1001 AND brand = 'IQOS';

-- Example: Make ILUMAi smaller, shift it up, and rotate 45 degrees
UPDATE products
SET
  model_scale = 8.0,
  model_position_x = 0.0,
  model_position_y = 0.3,
  model_position_z = 0.0,
  model_rotation_x = 0.0,
  model_rotation_y = 45.0,  -- 45 degrees starting angle
  model_rotation_z = 0.0
WHERE prd = 1002 AND brand = 'IQOS';

-- Example: Make ILUMA ONE much larger and rotate to show best angle
UPDATE products
SET
  model_scale = 20.0,
  model_position_x = 0.0,
  model_position_y = 0.0,
  model_position_z = 0.0,
  model_rotation_x = 0.0,
  model_rotation_y = 90.0,  -- 90 degrees to show side view
  model_rotation_z = 0.0
WHERE prd = 1003 AND brand = 'IQOS';
```

## How to Determine the Right Values

### Method 1: Trial and Error (Recommended)

1. Start your development server: `npm run dev`
2. Navigate to a product page with a test UID
3. Open browser console to see current scale/position values logged
4. Update the database values using SQL
5. Refresh the page to see changes
6. Repeat until satisfied

### Method 2: Camera Distance Reference

With the current camera setup:
- Camera position: `[0, 0, 15]`
- Camera FOV: `50`

**Scale Guidelines:**
- `scale = 5`: Very small, about 1/3 of viewport
- `scale = 10`: Medium (current default), about 2/3 of viewport
- `scale = 15`: Large, fills most of viewport
- `scale = 20`: Very large, may overflow viewport

**Position Guidelines:**
- `position_y = -1.0`: Move model down noticeably
- `position_y = 1.0`: Move model up noticeably
- `position_x = -1.0`: Move model left
- `position_x = 1.0`: Move model right
- `position_z` is usually kept at 0 (moving forward/backward can cause clipping)

**Rotation Guidelines (in degrees):**
- `rotation_x`: Pitch (tilt forward/backward)
  - `0` = no tilt
  - `5` = slight tilt forward
  - `15` = noticeable tilt
  - `90` = fully tilted forward
- `rotation_y`: Yaw (rotate left/right) - **Note:** Scroll animation adds to this
  - `0` = facing forward
  - `45` = 45° rotation
  - `90` = side view
  - `180` = facing backward
- `rotation_z`: Roll (tilt sideways)
  - `0` = upright
  - `5` = slight lean
  - `15` = noticeable lean
  - `90` = fully on its side

**Common Rotation Values:**
- `15°` - Slight angle
- `30°` - Noticeable angle
- `45°` - Diagonal view
- `60°` - Strong angle
- `90°` - Quarter turn (side view)
- `180°` - Half turn (rear view)

## Testing URLs

Use these URLs to test each product (assumes pre-registration is disabled):

```
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1001&uid=999001
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1002&uid=999002
http://localhost:5173/en/product/IQOS?type=d&cc=101&prd=1003&uid=999003
```

## Implementation Details

The changes affect these components:
- `UnboxingExperience.tsx` - Main unboxing experience (scroll-based rotation on Y-axis)
- `ModelViewer.tsx` - Reusable 3D viewer component

Both components now:
1. Fetch scale/position/rotation from `unitData.products` (from database)
2. Apply these values to the 3D model
3. Fall back to defaults if values are not provided
4. Log the values to console for debugging

**Important Notes:**
- Rotation values are stored in **degrees** in the database
- Components automatically convert degrees to radians internally
- In `UnboxingExperience.tsx`, the Y-axis rotation is **additive**: `base_rotation_y + scroll_rotation`
- X and Z rotations are static (set once from database)
- In `ModelViewer.tsx`, auto-rotation also adds to the base Y rotation

## Console Debugging

When you load a product page, check the browser console for:

```
Loading 3D model from: /src/assets/models/iluma-i-prime.glb
Model transform: { scale: 10, position: [0, 0, 0], rotation: [0, 0, 0], rotationUnit: 'degrees' }
Model loaded: [THREE.Group]
```

This confirms what scale, position, and rotation values (in degrees) are being applied.

## Next Steps

1. Run the migration SQL in Supabase
2. Test each product URL in your browser
3. Provide the specific scale/position/rotation values you want for each product
4. Apply those values using UPDATE SQL statements
5. Refresh and verify the models look correct

## Need Help?

If you're unsure about values, start with these safe adjustments:
- Adjust scale in increments of 2 (8, 10, 12, 14, 16...)
- Adjust position in increments of 0.5 (-1.0, -0.5, 0, 0.5, 1.0...)
- Adjust rotation in increments of 5° or 15° for testing
- Always keep Z position at 0 to avoid clipping issues
- Keep Y rotation at 0 unless you want a specific starting angle (scroll will add rotation)

**Pro Tip:** Use simple values like 15, 30, 45, 90 degrees for clean, predictable rotations!
