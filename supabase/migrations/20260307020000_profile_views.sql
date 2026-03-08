-- 나를 본 사람 기록 테이블
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(viewer_id, viewed_id)
);

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- 내 프로필을 본 사람 목록 조회 (viewed_id = 나)
CREATE POLICY "profile_views_select" ON profile_views
  FOR SELECT USING (auth.uid() = viewed_id);

-- 조회 기록 삽입 (viewer_id = 나)
CREATE POLICY "profile_views_insert" ON profile_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- 중복 조회 시 created_at 업데이트 (upsert용)
CREATE POLICY "profile_views_update" ON profile_views
  FOR UPDATE USING (auth.uid() = viewer_id);

CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_id ON profile_views(viewed_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON profile_views(viewer_id);
