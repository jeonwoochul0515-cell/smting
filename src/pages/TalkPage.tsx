import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import TendencyBadge from '../components/TendencyBadge';
import TalkWriteModal from '../components/TalkWriteModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface TalkPost {
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
  distance_km: number;
}

const subTabs = ['전체', '지역', '등네', '근처', '내토크'];
const distanceFilters = ['전체', '10km', '20km', '50km'];

export default function TalkPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('전체');
  const [distanceFilter, setDistanceFilter] = useState('전체');
  const [posts, setPosts] = useState<TalkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(false);

  // Load talk posts with useCallback for external access
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Load posts
      let query = supabase
        .from('talk_posts')
        .select('*');

      // Filter by tab
      if (activeTab === '지역') {
        query = query.eq('category', '지역');
      } else if (activeTab === '등네') {
        query = query.eq('category', '등네');
      } else if (activeTab === '내토크') {
        query = query.eq('user_id', currentUser?.id);
      }

      const { data: postsData, error: postsError } = await query.order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // 2. Get unique user IDs from posts
      const userIds = [...new Set(postsData.map(p => p.user_id))];

      // 3. Load profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nickname, age, tendency, gender')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // 4. Create profile lookup map
      const profileMap = new Map<string, any>();
      (profilesData || []).forEach(p => profileMap.set(p.id, p));

      // 5. Transform and merge data
      const transformedPosts: TalkPost[] = postsData.map((post: any) => {
        const profile = profileMap.get(post.user_id);
        return {
          id: post.id,
          user_id: post.user_id,
          title: post.title || '',
          content: post.content || '',
          category: post.category || '전체',
          created_at: post.created_at,
          user_nickname: profile?.nickname || '알 수 없음',
          user_age: profile?.age || 0,
          user_tendency: profile?.tendency || 'S',
          user_gender: profile?.gender || '',
          distance_km: Math.random() * 50 + 0.1,
        };
      });

      setPosts(transformedPosts);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentUser?.id]);

  // Load posts on mount and when tab changes
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    setDistanceFilter('전체'); // Reset distance filter when changing tabs
  };

  const parseDistance = (d: string) => parseFloat(d.replace('km', ''));

  // Filter posts
  const filteredPosts = activeTab === '근처'
    ? posts.filter(post => {
        if (distanceFilter === '전체') return true;
        const maxDist = parseDistance(distanceFilter);
        return post.distance_km <= maxDist;
      })
    : posts;

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분`;
    if (diffHours < 24) return `${diffHours}시간`;
    if (diffDays < 7) return `${diffDays}일`;
    return then.toLocaleDateString('ko-KR');
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header
        right={
          <button
            onClick={() => setShowWriteModal(true)}
            style={{
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              color: '#fff',
              fontSize: 13,
              padding: '5px 12px',
              borderRadius: 8,
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 2px 8px rgba(139,0,0,0.3)',
              cursor: 'pointer',
            }}
          >
            토크쓰기
          </button>
        }
      />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={handleTabSelect} />

      {/* Distance Filter for 근처 tab */}
      {activeTab === '근처' && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(20,20,20,0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: 6,
          }}
        >
          {distanceFilters.map((d) => (
            <button
              key={d}
              onClick={() => setDistanceFilter(d)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: distanceFilter === d ? '#C9A96E' : '#777',
                background: distanceFilter === d ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.04)',
                border: distanceFilter === d ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Posts List */}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            토크를 불러오는 중...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            <p>토크가 없습니다</p>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <div
              key={post.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {post.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
                  <span>{getTimeAgo(post.created_at)}</span>
                  <TendencyBadge tendency={post.user_tendency as any} size="sm" />
                  <span style={{ fontWeight: 600, color: '#ccc' }}>{post.user_nickname}</span>
                  <span>
                    {post.user_gender}
                    {post.user_age}세
                  </span>
                  <span>{post.distance_km.toFixed(1)}km</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${post.user_id}`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #8B0000, #5C0029)',
                  color: '#fff',
                  fontSize: 11,
                  padding: '6px 12px',
                  borderRadius: 8,
                  flexShrink: 0,
                  marginLeft: 8,
                  boxShadow: '0 2px 8px rgba(139,0,0,0.3)',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                쪽지쓰기
              </button>
            </div>
          ))
        )}
      </div>

      {/* Talk Write Modal */}
      {showWriteModal && (
        <TalkWriteModal
          onClose={() => setShowWriteModal(false)}
          onSuccess={() => {
            setShowWriteModal(false);
            // Reload posts
            loadPosts();
          }}
        />
      )}
    </div>
  );
}
