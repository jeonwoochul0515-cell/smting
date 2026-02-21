# Security Implementation Guide

## Row Level Security (RLS) Policies

This project implements comprehensive RLS policies to protect user data at the database level.

### Overview

All tables have RLS enabled with the following security model:

#### 1. Profiles Table
- **Read (SELECT)**: Public - anyone can view all profiles
- **Create (INSERT)**: Users can only create their own profile (id must match auth.uid())
- **Update**: Users can only update their own profile
- **Delete**: Users can only delete their own profile

#### 2. Messages Table
- **Read (SELECT)**: Users can only read messages where they are either the sender or recipient
- **Create (INSERT)**: Users can only create messages as themselves (sender_id must match auth.uid())
- **Update**: Only the sender can update their own messages
- **Delete**: Both sender and recipient can delete messages

#### 3. Talk Posts Table
- **Read (SELECT)**: Public - anyone can view all posts
- **Create (INSERT)**: Authenticated users can create posts (user_id must match auth.uid())
- **Update**: Only the post author can update their posts
- **Delete**: Only the post author can delete their posts

#### 4. Locations Table
- **Read (SELECT)**: Users can only read their own location data
- **Create (INSERT)**: Users can only create their own location record
- **Update**: Users can only update their own location
- **Delete**: Users can only delete their own location

### Migration

To apply these policies to your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration file
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20260221000000_enable_rls_policies.sql
```

### Testing RLS Policies

After applying the migration, test each policy:

1. **Test as authenticated user**: Ensure you can only access your own data
2. **Test as different user**: Verify you cannot access other users' private data
3. **Test as anonymous**: Confirm public data is accessible but private data is not

### Performance Considerations

The migration includes performance indexes on foreign key columns used in RLS policies:
- `idx_messages_sender_id` and `idx_messages_recipient_id` for messages
- `idx_talk_posts_user_id` for talk posts
- `idx_profiles_id` and `idx_locations_id` for user lookups

## Environment Variables Security

### Setup

1. **Never commit** `.env.local` to version control
2. Copy `.env.example` to `.env.local`
3. Fill in your actual Supabase credentials in `.env.local`

### Required Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Key Security Notes

- The **anon key** is safe to expose in client-side code - RLS policies protect your data
- Never expose your **service role key** in client-side code
- The service role key bypasses RLS - use only in secure server environments

### Validation

The supabase client will throw an error if environment variables are missing, preventing accidental deployment without proper configuration.

## Additional Security Recommendations

1. **Enable email verification** in Supabase Auth settings
2. **Configure CORS** properly in Supabase dashboard
3. **Set up rate limiting** for API endpoints
4. **Enable MFA** for admin accounts
5. **Regularly rotate** service role keys
6. **Monitor** database logs for suspicious activity
7. **Keep dependencies updated** to patch security vulnerabilities

## Reporting Security Issues

If you discover a security vulnerability, please email security@yourdomain.com instead of using the issue tracker.
