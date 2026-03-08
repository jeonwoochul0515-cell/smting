-- free_posts 카테고리에 MS/MD 추가
ALTER TABLE free_posts DROP CONSTRAINT IF EXISTS free_posts_category_check;

ALTER TABLE free_posts ADD CONSTRAINT free_posts_category_check
  CHECK (category IN ('fs', 'fd', 'ms', 'md'));
