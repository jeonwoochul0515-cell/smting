import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TendencyBadge from '../components/TendencyBadge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getDistanceKm } from '../utils/geolocation';
import type { Tendency } from '../data/mockData';

interface TalkPostDetail {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_nickname: string;
  user_age: number;
  user_tendency: string;
  user_gender: string;
  user_avatar: string | null;
  distance_km?: number;
}

export default function TalkDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [post, setPost] = useState<TalkPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setError('게시글을 찾을 수 없습니다');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Load post
        const { data: postData, error: postError } = await supabase
          .from('talk_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (postError) throw postError;
        if (!postData) {
          setError('게시글을 찾을 수 없습니다');
          setLoading(false);
          return;
        }

        // 2. Load author profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, nickname, age, tendency, gender, avatar, latitude, longitude')
          .eq('id', postData.user_id)
          .single();

        if (profileError) throw profileError;

        // 3. Load current user's coordinates for distance calculation
        let distance_km: number | undefined;
        if (currentUser) {
          const { data: myProfile } = await supabase
            .from('profiles')
            .select('latitude, longitude')
            .eq('id', currentUser.id)
            .single();

          if (myProfile?.latitude && myProfile?.longitude && profileData?.latitude && profileData?.longitude) {
            distance_km = getDistanceKm(
              myProfile.latitude,
              myProfile.longitude,
              profileData.latitude,
              profileData.longitude
            );
          }
        }

        // 4. Combine data
        const postDetail: TalkPostDetail = {
          id: postData.id,
          user_id: postData.user_id,
          title: postData.title || '',
          content: postData.content || '',
          category: postData.category || '전체',
          created_at: postData.created_at,
          user_nickname: profileData?.nickname || '알 수 없음',
          user_age: profileData?.age || 0,
          user_tendency: profileData?.tendency || 'S',
          user_gender: profileData?.gender || '',
          user_avatar: profileData?.avatar || null,
          distance_km,
        };

        setPost(postDetail);
      } catch (err) {
        console.error('Failed to load post:', err);
        setError('게시글을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, currentUser?.id]);

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const then = new Date(date.endsWith('Z') || date.includes('+') ? date : date + 'Z');
    if (isNaN(then.getTime())) return '';
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 30) return `${diffDays}일 전`;
    return then.toLocaleDateString('ko-KR');
  };

  const getAvatarUrl = (avatar: string | null): string => {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`;
  };

  if (loading) {
    return (
      <div style={{ paddingBottom: 60 }}>
        <Header title="토크 상세" showBack onBack={() => navigate(-1)} />
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
          게시글을 불러오는 중...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ paddingBottom: 60 }}>
        <Header title="토크 상세" showBack onBack={() => navigate(-1)} />
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
          <p>{error || '게시글을 찾을 수 없습니다'}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              color: '#fff',
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              marginTop: 16,
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header title="토크 상세" showBack onBack={() => navigate(-1)} />

      <div style={{ padding: '20px 16px' }}>
        {/* Author Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
            padding: '16px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid rgba(139,0,0,0.3)',
              background: 'rgba(139,0,0,0.1)',
            }}
          >
            {post.user_avatar ? (
              <img
                src={getAvatarUrl(post.user_avatar)}
                alt={post.user_nickname}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: '#8B0000',
                  fontWeight: 700,
                }}
              >
                {post.user_nickname.charAt(0)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 4,
              }}
            >
              {post.user_nickname}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: '#aaa',
              }}
            >
              <TendencyBadge tendency={post.user_tendency as Tendency} size="sm" />
              <span>
                {post.user_gender}
                {post.user_age}세
              </span>
              {post.distance_km !== undefined && (
                <span>
                  {post.distance_km < 1
                    ? `${(post.distance_km * 1000).toFixed(0)}m`
                    : `${post.distance_km.toFixed(1)}km`}
                </span>
              )}
            </div>
          </div>

          {/* Message Button */}
          <button
            onClick={() => navigate(`/chat/${post.user_id}`)}
            style={{
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              color: '#fff',
              fontSize: 13,
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(139,0,0,0.3)',
              flexShrink: 0,
            }}
          >
            쪽지쓰기
          </button>
        </div>

        {/* Post Title */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 12,
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </div>

        {/* Post Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12,
            color: '#888',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span style={{ color: '#8B0000', fontWeight: 600 }}>{post.category}</span>
          <span>•</span>
          <span>{getTimeAgo(post.created_at)}</span>
        </div>

        {/* Post Content */}
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: '#ddd',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: 200,
          }}
        >
          {post.content}
        </div>
      </div>
    </div>
  );
}
