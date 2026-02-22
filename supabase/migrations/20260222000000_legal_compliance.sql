-- ============================================
-- 법령 준수 마이그레이션
-- 1. cai_transactions RLS 추가
-- 2. block_list 테이블 생성
-- 3. reports 테이블 생성
-- 4. delete_user RPC 함수 생성
-- 5. profiles 필드 추가
-- ============================================

-- ============================================
-- 1. cai_transactions 테이블 RLS (개인정보보호법)
-- ============================================
ALTER TABLE IF EXISTS cai_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cai_transactions_select_policy" ON cai_transactions;
DROP POLICY IF EXISTS "cai_transactions_insert_policy" ON cai_transactions;

CREATE POLICY "cai_transactions_select_policy"
ON cai_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "cai_transactions_insert_policy"
ON cai_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. block_list 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS block_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE block_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "block_list_select_policy" ON block_list;
DROP POLICY IF EXISTS "block_list_insert_policy" ON block_list;
DROP POLICY IF EXISTS "block_list_delete_policy" ON block_list;

CREATE POLICY "block_list_select_policy"
ON block_list FOR SELECT
USING (auth.uid() = blocker_id);

CREATE POLICY "block_list_insert_policy"
ON block_list FOR INSERT
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "block_list_delete_policy"
ON block_list FOR DELETE
USING (auth.uid() = blocker_id);

-- ============================================
-- 3. reports 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  detail TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_select_policy" ON reports;
DROP POLICY IF EXISTS "reports_insert_policy" ON reports;

CREATE POLICY "reports_select_policy"
ON reports FOR SELECT
USING (auth.uid() = reporter_id);

CREATE POLICY "reports_insert_policy"
ON reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- ============================================
-- 4. delete_user RPC 함수 (GDPR 잊혀질 권리)
-- ============================================
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM messages
  WHERE sender_id = auth.uid() OR recipient_id = auth.uid();

  DELETE FROM talk_posts
  WHERE user_id = auth.uid();

  DELETE FROM block_list
  WHERE blocker_id = auth.uid() OR blocked_id = auth.uid();

  DELETE FROM reports
  WHERE reporter_id = auth.uid();

  DELETE FROM cai_transactions
  WHERE user_id = auth.uid();

  DELETE FROM profiles
  WHERE id = auth.uid();

  DELETE FROM auth.users
  WHERE id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- ============================================
-- 5. profiles 동의 필드 추가
-- ============================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS marketing_agreed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_agreed_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS privacy_agreed_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 6. 인덱스 추가
-- ============================================
CREATE INDEX IF NOT EXISTS idx_block_list_blocker ON block_list(blocker_id);
CREATE INDEX IF NOT EXISTS idx_block_list_blocked ON block_list(blocked_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON reports(reported_id);
