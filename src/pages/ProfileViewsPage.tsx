import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import type { Tendency } from '../data/mockData';

interface ProfileView {
  viewer_id: string;
  created_at: string;
  profiles: {
    id: string;
    nickname: string;
    age: number;
    gender: string;
    tendency: Tendency;
    avatar: string;
    avatar_url?: string | null;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function ProfileViewsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [views, setViews] = useState<ProfileView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadViews = async () => {
      if (!user) return;
      try {
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from('profile_views')
          .select('viewer_id, created_at, profiles:viewer_id(id, nickname, age, gender, tendency, avatar, avatar_url)')
          .eq('viewed_id', user.id)
          .gte('created_at', since)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setViews((data as any) || []);
      } catch (err) {
        console.error('Failed to load profile views:', err);
      } finally {
        setLoading(false);
      }
    };

    loadViews();
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)' }}>
      <Header title="나를 본 사람" showBack onBack={() => navigate(-1)} />

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#666' }}>
          불러오는 중...
        </div>
      ) : views.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: '#555', gap: 10 }}>
          <div style={{ fontSize: 40 }}>👀</div>
          <div style={{ fontSize: 14 }}>최근 7일간 내 프로필을 본 사람이 없어요</div>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>최근 7일 · {views.length}명</div>
          {views.map((v, i) => {
            const p = v.profiles;
            if (!p) return null;
            return (
              <div
                key={v.viewer_id}
                onClick={() => navigate(`/user/${p.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                }}
              >
                <Avatar color={p.avatar} nickname={p.nickname} size={48} imageUrl={p.avatar_url} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{p.nickname}</span>
                    <TendencyBadge tendency={p.tendency} />
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {p.gender} · {p.age}세
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>
                  {timeAgo(v.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
