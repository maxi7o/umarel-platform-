-- Lead Queue Table for Scout Agent
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS scout_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Source data
    platform TEXT NOT NULL, -- 'instagram', 'facebook', 'twitter'
    post_url TEXT NOT NULL UNIQUE,
    post_content TEXT NOT NULL,
    username TEXT,
    user_profile_url TEXT,
    
    -- AI Analysis
    intent_score INTEGER NOT NULL CHECK (intent_score >= 0 AND intent_score <= 10),
    analysis_reason TEXT,
    suggested_reply TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted', 'archived')),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    
    -- Engagement tracking
    posted_at TIMESTAMPTZ,
    reply_text TEXT, -- Actual text posted (may differ from suggested)
    engagement_result JSONB, -- likes, replies, etc.
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_scout_leads_status ON scout_leads(status);
CREATE INDEX idx_scout_leads_intent_score ON scout_leads(intent_score DESC);
CREATE INDEX idx_scout_leads_created_at ON scout_leads(created_at DESC);
CREATE INDEX idx_scout_leads_platform ON scout_leads(platform);

-- RLS Policies (adjust based on your auth setup)
ALTER TABLE scout_leads ENABLE ROW LEVEL SECURITY;

-- Admin can see all
CREATE POLICY "Admins can view all leads"
    ON scout_leads FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Admin can update
CREATE POLICY "Admins can update leads"
    ON scout_leads FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Service role can insert (for n8n)
CREATE POLICY "Service can insert leads"
    ON scout_leads FOR INSERT
    TO service_role
    WITH CHECK (true);

COMMENT ON TABLE scout_leads IS 'Queue of social media leads detected by Scout Agent';
