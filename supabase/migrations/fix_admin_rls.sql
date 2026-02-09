-- Fix for Admin Login Issue
-- This script disables RLS or fixes the admin query issue
-- Run this in Supabase SQL Editor

-- Option 1: Verify the admins table has your user
SELECT * FROM admins;

-- Option 2: Check if RLS is causing issues by temporarily disabling it for testing
-- (You can re-enable it after confirming this fixes the issue)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Option 3: If the above works, create a proper policy instead of disabling RLS
-- First re-enable RLS:
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Then create a policy that allows service role to read:
-- CREATE POLICY "Service role can read admins"
--   ON admins FOR SELECT
--   TO service_role
--   USING (true);

-- Option 4: Check the actual user ID that's trying to authenticate
-- Compare this with what's in the admins table
