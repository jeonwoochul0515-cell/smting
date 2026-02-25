-- Kane (케인) currency system migration

-- cai → kane 컬럼 이름 변경 (이미 변경된 경우 스킵)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cai') THEN
    ALTER TABLE profiles RENAME COLUMN cai TO kane;
  END IF;
END $$;

-- cai_transactions → kane_transactions 테이블 이름 변경 (이미 변경된 경우 스킵)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cai_transactions') THEN
    ALTER TABLE cai_transactions RENAME TO kane_transactions;
  END IF;
END $$;

-- kane_transactions 테이블이 없으면 새로 생성
CREATE TABLE IF NOT EXISTS kane_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  purchase_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 설정
DROP POLICY IF EXISTS "Users can view own cai transactions" ON kane_transactions;
DROP POLICY IF EXISTS "Users can insert own cai transactions" ON kane_transactions;
DROP POLICY IF EXISTS "Users can view own kane transactions" ON kane_transactions;
DROP POLICY IF EXISTS "Users can insert own kane transactions" ON kane_transactions;

ALTER TABLE kane_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own kane transactions"
  ON kane_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kane transactions"
  ON kane_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- purchase_id 컬럼 추가 (이미 있으면 스킵)
ALTER TABLE kane_transactions ADD COLUMN IF NOT EXISTS purchase_id text;
