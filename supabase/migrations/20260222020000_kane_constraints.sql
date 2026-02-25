-- Kane non-negative constraint (이미 있으면 스킵)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'kane_non_negative'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT kane_non_negative CHECK (kane >= 0);
  END IF;
END $$;

-- 중복 talk_post 데이터 정리 (가장 오래된 것 하나만 남김)
DELETE FROM kane_transactions
WHERE reason = 'talk_post'
  AND id NOT IN (
    SELECT DISTINCT ON (user_id, DATE(created_at)) id
    FROM kane_transactions
    WHERE reason = 'talk_post'
    ORDER BY user_id, DATE(created_at), created_at ASC
  );

-- Daily talk reward uniqueness (UTC 기준)
CREATE UNIQUE INDEX IF NOT EXISTS daily_talk_reward_idx
  ON kane_transactions (user_id, DATE(created_at))
  WHERE reason = 'talk_post';

-- Notification settings columns
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS message_notify boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS talk_notify boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS marketing_notify boolean DEFAULT false;
