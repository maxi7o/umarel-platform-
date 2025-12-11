-- Migration: Update for Umarel-First Launch
-- Run this with: psql -d your_database -f migrations/umarel_launch_update.sql

-- Make slice_id nullable in community_rewards
ALTER TABLE community_rewards ALTER COLUMN slice_id DROP NOT NULL;

-- Add savings_generated to comments
ALTER TABLE comments ADD COLUMN IF NOT EXISTS savings_generated INTEGER DEFAULT 0;

-- Add index for savings_generated to quickly find helpful comments
CREATE INDEX IF NOT EXISTS idx_comments_savings ON comments(savings_generated) WHERE savings_generated > 0;
