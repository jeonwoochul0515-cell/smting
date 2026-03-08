-- Talk 좋아요 테이블
CREATE TABLE IF NOT EXISTS talk_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES talk_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE talk_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "talk_likes_select" ON talk_likes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "talk_likes_insert" ON talk_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "talk_likes_delete" ON talk_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_talk_likes_post_id ON talk_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_talk_likes_user_id ON talk_likes(user_id);
