import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { playTypes } from '../data/mockData';
import type { Tendency } from '../data/mockData';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import Icon from '../components/Icon';

interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  gender: string;
  tendency: Tendency;
  intro: string;
  avatar: string;
  avatar_url?: string | null;
  all_plays: string[];
  top_plays: string[];
}

const menuItems = [
  { label: '프로필 수정', icon: 'edit', path: '/profile/edit' },
  { label: '성향 설정', icon: 'settings', path: '/profile/edit' },
  { label: '케인 충전', icon: 'star', path: '/kane/purchase' },
  { label: '차단 관리', icon: 'ban', path: '/block-list' },
  { label: '알림 설정', icon: 'bell', path: '' },
  { label: '이용약관', icon: 'doc', path: '/terms' },
  { label: '개인정보처리방침', icon: 'shield', path: '/privacy' },
  { label: '고객센터', icon: 'help', path: '' },
  { label: '로그아웃', icon: 'logout', path: '', action: 'logout' },
  { label: '계정 탈퇴', icon: 'trash', path: '', action: 'delete' },
];

export default function MorePage() {
  const navigate = useNavigate();
  const { user, signOut, deleteAccount } = useAuth();
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) setMyProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
        로딩 중...
      </div>
    );
  }

  const topPlayTags = myProfile?.top_plays?.slice(0, 3).map(playId => {
    const play = playTypes.find(p => p.id === playId);
    return play ? `#${play.name}` : null;
  }).filter(Boolean) || [];

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />

      {/* Profile Card */}
      {myProfile && (
        <div
          onClick={() => navigate('/profile/edit')}
          style={{
            margin: 16,
            padding: 22,
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 18,
            border: '1px solid rgba(201, 169, 110, 0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <Avatar
              color={myProfile.avatar}
              nickname={myProfile.nickname}
              size={64}
              online
              showRing
              imageUrl={myProfile.avatar_url}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{myProfile.nickname}</span>
                <TendencyBadge tendency={myProfile.tendency} />
              </div>
              <span style={{ fontSize: 13, color: '#888' }}>
                {myProfile.gender} · {myProfile.age}세
              </span>
            </div>
            <span style={{ marginLeft: 'auto', color: '#C9A96E', fontSize: 14 }}>편집 ›</span>
          </div>
          <div style={{ fontSize: 14, color: '#bbb', marginBottom: 14, lineHeight: 1.5 }}>{myProfile.intro}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {topPlayTags.map(tag => (
              <span key={tag} style={{
                fontSize: 12,
                color: '#C9A96E',
                backgroundColor: 'rgba(201, 169, 110, 0.08)',
                padding: '4px 12px',
                borderRadius: 12,
                border: '1px solid rgba(201, 169, 110, 0.15)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <div style={{ margin: '0 16px' }}>
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            onClick={async () => {
              if (item.action === 'logout') {
                await signOut();
              } else if (item.action === 'delete') {
                if (window.confirm('정말 탈퇴하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.')) {
                  try {
                    await deleteAccount();
                  } catch (err: any) {
                    alert('탈퇴 처리 중 오류가 발생했습니다: ' + err.message);
                  }
                }
              } else if (item.path) {
                navigate(item.path);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '15px 6px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              fontSize: 15,
              animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
              <Icon name={item.icon} size={18} color="#888" />
            </span>
            <span style={{ color: item.action === 'delete' ? '#FF4444' : undefined }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: '#444', fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
