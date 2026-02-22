-- Kane non-negative constraint
ALTER TABLE profiles ADD CONSTRAINT kane_non_negative CHECK (kane >= 0);

-- Daily talk reward uniqueness (prevent duplicate daily rewards)
CREATE UNIQUE INDEX IF NOT EXISTS daily_talk_reward_idx
  ON kane_transactions (user_id, DATE(created_at AT TIME ZONE 'Asia/Seoul'))
  WHERE reason = 'talk_post';

-- Notification settings columns
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS message_notify boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS talk_notify boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS marketing_notify boolean DEFAULT false;
