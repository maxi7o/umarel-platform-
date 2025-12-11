-- Migration: Add Payment System Tables
-- Run this with: psql -d your_database -f migrations/add_payment_system.sql

-- Add new enum values to existing slice_status enum
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'approved_by_client';
ALTER TYPE slice_status ADD VALUE IF NOT EXISTS 'paid';

-- Create new enums
CREATE TYPE payment_status AS ENUM ('pending_escrow', 'in_escrow', 'released', 'refunded', 'failed');
CREATE TYPE payment_method AS ENUM ('stripe', 'mercado_pago');

-- Add new columns to slices table
ALTER TABLE slices 
ADD COLUMN IF NOT EXISTS final_price INTEGER,
ADD COLUMN IF NOT EXISTS escrow_payment_id TEXT,
ADD COLUMN IF NOT EXISTS approved_by_client_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Add new columns to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS hearts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_marked_helpful BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS marked_helpful_by UUID REFERENCES users(id);

-- Create escrow_payments table
CREATE TABLE IF NOT EXISTS escrow_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slice_id UUID NOT NULL REFERENCES slices(id),
    client_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID NOT NULL REFERENCES users(id),
    total_amount INTEGER NOT NULL,
    slice_amount INTEGER NOT NULL,
    platform_fee INTEGER NOT NULL,
    community_reward_pool INTEGER NOT NULL,
    payment_method payment_method NOT NULL,
    stripe_payment_intent_id TEXT,
    mercado_pago_preapproval_id TEXT,
    status payment_status DEFAULT 'pending_escrow',
    created_at TIMESTAMP DEFAULT NOW(),
    released_at TIMESTAMP,
    refunded_at TIMESTAMP
);

-- Create community_rewards table
CREATE TABLE IF NOT EXISTS community_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    slice_id UUID NOT NULL REFERENCES slices(id),
    comment_id UUID REFERENCES comments(id),
    amount INTEGER NOT NULL,
    reason TEXT,
    paid_at TIMESTAMP,
    payment_method TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_wallets table
CREATE TABLE IF NOT EXISTS user_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_withdrawn INTEGER DEFAULT 0,
    mercado_pago_email TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create comment_hearts table
CREATE TABLE IF NOT EXISTS comment_hearts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_escrow_payments_slice ON escrow_payments(slice_id);
CREATE INDEX IF NOT EXISTS idx_escrow_payments_status ON escrow_payments(status);
CREATE INDEX IF NOT EXISTS idx_community_rewards_user ON community_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_community_rewards_slice ON community_rewards(slice_id);
CREATE INDEX IF NOT EXISTS idx_comment_hearts_comment ON comment_hearts(comment_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user ON user_wallets(user_id);

-- Create function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_wallets
    SET 
        balance = balance + NEW.amount,
        total_earned = total_earned + NEW.amount,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Create wallet if it doesn't exist
    INSERT INTO user_wallets (user_id, balance, total_earned)
    VALUES (NEW.user_id, NEW.amount, NEW.amount)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic wallet updates
CREATE TRIGGER trigger_update_wallet_on_reward
AFTER INSERT ON community_rewards
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balance();

COMMENT ON TABLE escrow_payments IS 'Holds payment in escrow until slice is approved by client';
COMMENT ON TABLE community_rewards IS 'Tracks 3% community rewards distributed to helpful Umarels';
COMMENT ON TABLE user_wallets IS 'User wallet balances for community earnings';
COMMENT ON TABLE comment_hearts IS 'Tracks which users hearted which comments';
