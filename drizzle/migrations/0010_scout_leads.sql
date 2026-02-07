-- Migration: Create Scout Leads table for Marketing Automation

CREATE TYPE scout_lead_status AS ENUM ('pending_review', 'approved', 'rejected', 'auto_posted', 'posted_manually', 'failed');
CREATE TYPE scout_source AS ENUM ('instagram', 'facebook', 'twitter', 'linkedin', 'other');

CREATE TABLE IF NOT EXISTS scout_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source scout_source NOT NULL,
    external_id TEXT NOT NULL, -- ID of the post on the platform
    post_url TEXT NOT NULL,
    post_content TEXT NOT NULL,
    author_name TEXT,
    author_username TEXT,
    
    -- AI Analysis
    intent_score INTEGER NOT NULL, -- 0-10
    intent_reasoning TEXT,
    suggested_reply TEXT,
    
    -- Status & Workflow
    status scout_lead_status DEFAULT 'pending_review',
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id), -- Admin who approved/rejected
    posted_at TIMESTAMP,
    
    -- Metadata
    keywords_matched TEXT[], -- Tags found (e.g. #reformas)
    raw_data JSONB, -- Full payload from Apify/Scraper
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_external_id UNIQUE(source, external_id) -- Avoid duplicate leads
);

-- Indexes for Admin Dashboard performance
CREATE INDEX IF NOT EXISTS idx_scout_leads_status ON scout_leads(status);
CREATE INDEX IF NOT EXISTS idx_scout_leads_score ON scout_leads(intent_score DESC);
CREATE INDEX IF NOT EXISTS idx_scout_leads_created ON scout_leads(created_at DESC);
