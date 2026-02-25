-- free_posts에 category 컬럼 추가 (fs 또는 fd)
ALTER TABLE free_posts
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'fs'
  CHECK (category IN ('fs', 'fd'));
