-- Migration: Add Wizard System
-- Run this with: psql -d your_database -f migrations/add_wizard_system.sql

-- Add new enums
CREATE TYPE aura_level AS ENUM ('bronze', 'silver', 'gold', 'diamond');
CREATE TYPE wizard_message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE currency AS ENUM ('ARS', 'USD', 'BRL', 'MXN', 'COP');

-- Update users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS aura_level aura_level DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS total_savings_generated INTEGER DEFAULT 0;

-- Create slice_cards table
CREATE TABLE IF NOT EXISTS slice_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slice_id UUID NOT NULL UNIQUE REFERENCES slices(id),
    request_id UUID NOT NULL REFERENCES requests(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    final_price INTEGER,
    currency currency DEFAULT 'ARS',
    skills JSONB DEFAULT '[]'::jsonb,
    estimated_time TEXT,
    dependencies JSONB DEFAULT '[]'::jsonb,
    acceptance_criteria JSONB DEFAULT '[]'::jsonb,
    version INTEGER DEFAULT 1,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create wizard_messages table
CREATE TABLE IF NOT EXISTS wizard_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slice_card_id UUID NOT NULL REFERENCES slice_cards(id),
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    role wizard_message_role DEFAULT 'user',
    hearts INTEGER DEFAULT 0,
    is_marked_helpful BOOLEAN DEFAULT FALSE,
    marked_helpful_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create daily_payouts table
CREATE TABLE IF NOT EXISTS daily_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP NOT NULL,
    total_pool INTEGER NOT NULL,
    distributed BOOLEAN DEFAULT FALSE,
    recipients JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency currency NOT NULL,
    target_currency currency NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_slice_cards_slice ON slice_cards(slice_id);
CREATE INDEX IF NOT EXISTS idx_slice_cards_request ON slice_cards(request_id);
CREATE INDEX IF NOT EXISTS idx_wizard_messages_slice_card ON wizard_messages(slice_card_id);
CREATE INDEX IF NOT EXISTS idx_wizard_messages_user ON wizard_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_wizard_messages_helpful ON wizard_messages(is_marked_helpful) WHERE is_marked_helpful = TRUE;
CREATE INDEX IF NOT EXISTS idx_daily_payouts_date ON daily_payouts(date);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON exchange_rates(base_currency, target_currency);

-- Create function to update slice_card updated_at
CREATE OR REPLACE FUNCTION update_slice_card_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_slice_card_timestamp
BEFORE UPDATE ON slice_cards
FOR EACH ROW
EXECUTE FUNCTION update_slice_card_timestamp();

COMMENT ON TABLE slice_cards IS 'Live artifact state for Wizard interface';
COMMENT ON TABLE wizard_messages IS 'ChatGPT-like message thread for each slice';
COMMENT ON TABLE daily_payouts IS 'Automated daily distribution of 3% community pool';
COMMENT ON TABLE exchange_rates IS 'Multi-currency support with real-time rates';
