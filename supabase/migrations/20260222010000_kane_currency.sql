-- Kane (케인) currency system migration
-- Rename cai → kane in profiles table
ALTER TABLE profiles RENAME COLUMN cai TO kane;

-- Rename cai_transactions → kane_transactions
ALTER TABLE cai_transactions RENAME TO kane_transactions;

-- Update RLS policies for kane_transactions (drop old, create new)
DROP POLICY IF EXISTS "Users can view own cai transactions" ON kane_transactions;
DROP POLICY IF EXISTS "Users can insert own cai transactions" ON kane_transactions;

ALTER TABLE kane_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own kane transactions"
  ON kane_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kane transactions"
  ON kane_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add purchase_id column for tracking purchases
ALTER TABLE kane_transactions ADD COLUMN IF NOT EXISTS purchase_id text;
