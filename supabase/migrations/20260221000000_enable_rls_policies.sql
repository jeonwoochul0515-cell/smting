-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE talk_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Allow everyone to read all profiles
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete only their own profile
CREATE POLICY "profiles_delete_policy"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================

-- Allow sender and recipient to read messages
CREATE POLICY "messages_select_policy"
ON messages FOR SELECT
USING (
  auth.uid() = sender_id OR
  auth.uid() = recipient_id
);

-- Allow only authenticated users to send messages (insert as sender)
CREATE POLICY "messages_insert_policy"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Allow sender to update their own messages (e.g., for edit functionality)
CREATE POLICY "messages_update_policy"
ON messages FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- Allow sender and recipient to delete messages
CREATE POLICY "messages_delete_policy"
ON messages FOR DELETE
USING (
  auth.uid() = sender_id OR
  auth.uid() = recipient_id
);

-- ============================================
-- TALK_POSTS TABLE POLICIES
-- ============================================

-- Allow everyone to read all talk posts
CREATE POLICY "talk_posts_select_policy"
ON talk_posts FOR SELECT
USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "talk_posts_insert_policy"
ON talk_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow only post author to update their posts
CREATE POLICY "talk_posts_update_policy"
ON talk_posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow only post author to delete their posts
CREATE POLICY "talk_posts_delete_policy"
ON talk_posts FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- LOCATIONS TABLE POLICIES
-- ============================================

-- Allow users to read only their own location
CREATE POLICY "locations_select_policy"
ON locations FOR SELECT
USING (auth.uid() = id);

-- Allow users to insert their own location
CREATE POLICY "locations_insert_policy"
ON locations FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update only their own location
CREATE POLICY "locations_update_policy"
ON locations FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete only their own location
CREATE POLICY "locations_delete_policy"
ON locations FOR DELETE
USING (auth.uid() = id);

-- ============================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================

-- Create indexes for better performance on RLS checks
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_talk_posts_user_id ON talk_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_locations_id ON locations(id);

-- Grant appropriate permissions to authenticated users
GRANT SELECT ON profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON profiles TO authenticated;

GRANT SELECT ON messages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON messages TO authenticated;

GRANT SELECT ON talk_posts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON talk_posts TO authenticated;

GRANT SELECT ON locations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON locations TO authenticated;
