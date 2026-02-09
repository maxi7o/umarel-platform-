-- Add notifications system tables
-- Run this migration: npm run db:push or drizzle-kit push

-- Create notification_type enum
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'payment_received',
        'payment_released',
        'proposal_received',
        'proposal_accepted',
        'proposal_rejected',
        'milestone_completed',
        'milestone_approved',
        'audit_requested',
        'audit_completed',
        'verification_approved',
        'verification_rejected',
        'message_received',
        'system_announcement'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    related_entity_id UUID,
    related_entity_type TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    metadata JSONB,
    email_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- In-app
    in_app_payments BOOLEAN DEFAULT true,
    in_app_proposals BOOLEAN DEFAULT true,
    in_app_milestones BOOLEAN DEFAULT true,
    in_app_audits BOOLEAN DEFAULT true,
    in_app_messages BOOLEAN DEFAULT true,
    
    -- Email
    email_payments BOOLEAN DEFAULT true,
    email_proposals BOOLEAN DEFAULT true,
    email_milestones BOOLEAN DEFAULT false,
    email_audits BOOLEAN DEFAULT false,
    email_messages BOOLEAN DEFAULT false,
    
    -- Push
    push_payments BOOLEAN DEFAULT true,
    push_proposals BOOLEAN DEFAULT true,
    push_milestones BOOLEAN DEFAULT false,
    
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Create function to auto-create preferences for new users
CREATE OR REPLACE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_notification_preferences ON users;
CREATE TRIGGER trigger_create_notification_preferences
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_preferences_for_user();

COMMENT ON TABLE notifications IS 'User notifications with real-time support';
COMMENT ON TABLE notification_preferences IS 'User notification preferences per channel';
