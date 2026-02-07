-- Universal Slice Migration
-- Author: Antigravity
-- Date: 2026-02-07

-- 1. Update ENUMs
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'active';
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'full';
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'cancelled';

-- 2. Update slices table for Universal Architecture
ALTER TABLE slices ALTER COLUMN request_id DROP NOT NULL;

ALTER TABLE slices 
  ADD COLUMN IF NOT EXISTS experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slice_type TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS current_bookings INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS waitlist_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS activation_type TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS activation_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS decision_window_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS pricing_type TEXT DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '🔨';

-- 3. Create Slice Reservations / Bookings table
CREATE TABLE IF NOT EXISTS slice_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slice_id UUID REFERENCES slices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES experiences(id),
  
  booking_status TEXT DEFAULT 'pending',
  price_paid_cents INTEGER DEFAULT 0,
  
  booked_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  check_in_status TEXT DEFAULT 'pending',
  check_in_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_experience_slice UNIQUE(slice_id, user_id)
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_slices_experience ON slices(experience_id);
CREATE INDEX IF NOT EXISTS idx_slice_bookings_user ON slice_bookings(user_id);
