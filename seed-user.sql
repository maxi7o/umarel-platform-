-- Run this SQL to create the seed user
-- Execute in your PostgreSQL database or via Drizzle Studio

INSERT INTO users (id, email, full_name, avatar_url, aura_points, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'seed@umarel.com.ar',
  'Sistema Umarel',
  NULL,
  0,
  'user',
  NOW()
)
ON CONFLICT (id) DO NOTHING;
