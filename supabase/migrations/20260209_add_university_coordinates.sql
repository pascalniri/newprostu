-- Add latitude and longitude columns to universities table
-- This migration adds coordinate fields to support map visualization

ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add comment for documentation
COMMENT ON COLUMN universities.latitude IS 'Latitude coordinate for map display (e.g., 42.2780)';
COMMENT ON COLUMN universities.longitude IS 'Longitude coordinate for map display (e.g., -83.7382)';
