-- Demo Data for Umarel Investor Meeting
-- Run this to populate the database with realistic demo data

-- 1. Create Demo Users
INSERT INTO users (id, email, full_name, avatar_url, aura_points, aura_level, total_savings_generated, role, created_at)
VALUES 
  -- Demo user (for wallet page)
  ('00000000-0000-0000-0000-000000000001', 'seed@umarel.com.ar', 'Sistema Umarel', NULL, 0, 'bronze', 0, 'user', NOW()),
  
  -- María (Consumer)
  ('11111111-1111-1111-1111-111111111111', 'maria@demo.com', 'María González', NULL, 120, 'bronze', 0, 'user', NOW()),
  
  -- Carlos (Provider)
  ('22222222-2222-2222-2222-222222222222', 'carlos@demo.com', 'Carlos Rodríguez', NULL, 450, 'silver', 234500, 'user', NOW()),
  
  -- Diego (Umarel - Community Helper)
  ('33333333-3333-3333-3333-333333333333', 'diego@demo.com', 'Diego Martínez', NULL, 847, 'gold', 1250000, 'user', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Create Wallet for Diego (Umarel)
INSERT INTO user_wallets (id, user_id, balance, total_earned, total_withdrawn, created_at, updated_at)
VALUES 
  ('wallet-diego', '33333333-3333-3333-3333-333333333333', 12500, 45000, 32500, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  balance = EXCLUDED.balance,
  total_earned = EXCLUDED.total_earned,
  total_withdrawn = EXCLUDED.total_withdrawn;

-- 3. Create Community Rewards for Diego
INSERT INTO community_rewards (id, user_id, amount, reason, created_at, paid_at)
VALUES 
  ('reward-1', '33333333-3333-3333-3333-333333333333', 1250, 'Helpful suggestion: Use national ceramics, save 30%', NOW() - INTERVAL '1 day', NOW()),
  ('reward-2', '33333333-3333-3333-3333-333333333333', 850, 'Optimized bathroom renovation scope', NOW() - INTERVAL '2 days', NOW()),
  ('reward-3', '33333333-3333-3333-3333-333333333333', 1100, 'Provided cost-saving alternatives', NOW() - INTERVAL '3 days', NOW()),
  ('reward-4', '33333333-3333-3333-3333-333333333333', 950, 'Expert advice on plumbing materials', NOW() - INTERVAL '4 days', NULL),
  ('reward-5', '33333333-3333-3333-3333-333333333333', 1350, 'Detailed project breakdown', NOW() - INTERVAL '5 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Update demo user to have some wallet data too
INSERT INTO user_wallets (id, user_id, balance, total_earned, total_withdrawn, created_at, updated_at)
VALUES 
  ('wallet-demo', '00000000-0000-0000-0000-000000000001', 5000, 15000, 10000, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  balance = EXCLUDED.balance,
  total_earned = EXCLUDED.total_earned,
  total_withdrawn = EXCLUDED.total_withdrawn;

-- 5. Add some rewards for demo user
INSERT INTO community_rewards (id, user_id, amount, reason, created_at, paid_at)
VALUES 
  ('reward-demo-1', '00000000-0000-0000-0000-000000000001', 2500, 'Today\'s Aura earnings', NOW(), NULL),
  ('reward-demo-2', '00000000-0000-0000-0000-000000000001', 1500, 'Helpful community contribution', NOW() - INTERVAL '1 day', NOW()),
  ('reward-demo-3', '00000000-0000-0000-0000-000000000001', 3000, 'Expert optimization advice', NOW() - INTERVAL '2 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Update aura levels for leaderboard
UPDATE users 
SET aura_level = 'gold', aura_points = 847, total_savings_generated = 1250000
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE users 
SET aura_level = 'silver', aura_points = 450, total_savings_generated = 234500
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE users 
SET aura_level = 'bronze', aura_points = 250, total_savings_generated = 75000
WHERE id = '00000000-0000-0000-0000-000000000001';
