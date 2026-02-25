-- 자유게시판 테이블
create table if not exists free_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 1000),
  created_at timestamptz default now() not null
);

-- 댓글 테이블
create table if not exists free_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references free_posts(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 300),
  created_at timestamptz default now() not null
);

-- RLS 활성화
alter table free_posts enable row level security;
alter table free_comments enable row level security;

-- 게시글: 로그인 유저 누구나 읽기 가능
create policy "free_posts_select" on free_posts
  for select using (auth.role() = 'authenticated');

-- 게시글: 로그인 유저 누구나 작성 가능
create policy "free_posts_insert" on free_posts
  for insert with check (auth.uid() = author_id);

-- 게시글: 본인만 삭제 가능
create policy "free_posts_delete" on free_posts
  for delete using (auth.uid() = author_id);

-- 댓글: 로그인 유저 누구나 읽기 가능
create policy "free_comments_select" on free_comments
  for select using (auth.role() = 'authenticated');

-- 댓글: 로그인 유저 누구나 작성 가능
create policy "free_comments_insert" on free_comments
  for insert with check (auth.uid() = author_id);

-- 댓글: 본인만 삭제 가능
create policy "free_comments_delete" on free_comments
  for delete using (auth.uid() = author_id);
