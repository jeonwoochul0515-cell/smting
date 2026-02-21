import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playTypes, type Tendency } from '../data/mockData';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import Icon from '../components/Icon';
import { calcMatchRate } from '../utils/matchAlgo';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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

const rankColors = [
  { bg: 'linear-gradient(135deg, #C9A96E, #E8D5B0)', color: '#1A1A1A', label: '1st' },
  { bg: 'linear-gradient(135deg, #888, #BBB)', color: '#1A1A1A', label: '2nd' },
  { bg: 'linear-gradient(135deg, #8B5E3C, #C4834E)', color: '#fff', label: '3rd' },
];

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfiles = async () => {
      if (!userId || !currentUser) return;

      try {
        setLoading(true);

        // Load target user profile
        const { data: targetUser, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        if (!targetUser) {
          setError('사용자를 찾을 수 없습니다');
          return;
        }

        // Load current user profile
        const { data: myData, error: myError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (myError && myError.code !== 'PGRST116') throw myError;

        setUserProfile(targetUser);
        setCurrentUserProfile(myData || null);
      } catch (err: any) {
        setError(err.message || '프로필 로드 실패');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [userId, currentUser]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
        사용자 정보를 불러오는 중...
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        {error || '사용자를 찾을 수 없습니다'}
      </div>
    );
  }

  const plays = userProfile.all_plays || [];
  const topPlays = userProfile.top_plays || [];
  const myPlays = currentUserProfile?.all_plays || [];
  const matchRate = currentUserProfile
    ? calcMatchRate(userProfile.tendency, currentUserProfile.tendency, plays, myPlays)
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      <Header title="프로필" showBack onBack={() => navigate(-1)} />

      {/* Profile Header */}
      <div style={{
        padding: '28px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <Avatar color={userProfile.avatar} nickname={userProfile.nickname} size={80} imageUrl={userProfile.avatar_url} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>{userProfile.nickname}</span>
          <TendencyBadge tendency={userProfile.tendency} />
        </div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
          {userProfile.gender} · {userProfile.age}세
        </div>

        {/* Match Rate */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          borderRadius: 20,
          background: 'rgba(201, 169, 110, 0.08)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 13, color: '#C9A96E', fontWeight: 600 }}>궁합</span>
          <span style={{
            fontSize: 24,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #C9A96E, #E8D5B0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {matchRate}%
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Intro */}
        {userProfile.intro && (
          <section style={{ marginBottom: 24 }}>
            <h3 style={sectionTitle}>소개</h3>
            <div style={{
              padding: '14px 16px',
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 14,
              color: '#ccc',
              lineHeight: 1.6,
            }}>
              {userProfile.intro}
            </div>
          </section>
        )}

        {/* Top 3 Plays */}
        {topPlays.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h3 style={sectionTitle}>최애플 TOP 3</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              {topPlays.slice(0, 3).map((playId, idx) => {
                const play = playTypes.find(p => p.id === playId);
                if (!play) return null;
                return (
                  <div key={playId} style={{
                    flex: 1,
                    padding: '16px 8px',
                    borderRadius: 14,
                    textAlign: 'center',
                    backgroundColor: 'rgba(26,26,26,0.9)',
                    border: '1px solid rgba(201, 169, 110, 0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 10,
                      fontWeight: 800,
                      background: rankColors[idx].bg,
                      color: rankColors[idx].color,
                      padding: '2px 10px',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}>{rankColors[idx].label}</span>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>
                      <Icon name={play.icon} size={24} color="#C9A96E" />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#E8D5B0' }}>{play.name}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* All Play Tags */}
        {plays.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h3 style={sectionTitle}>관심 플레이</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {plays.map(playId => {
                const play = playTypes.find(p => p.id === playId);
                if (!play) return null;
                const isShared = myPlays.includes(playId);
                return (
                  <span key={playId} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    color: isShared ? '#C9A96E' : '#999',
                    backgroundColor: isShared ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                    padding: '6px 14px',
                    borderRadius: 12,
                    border: isShared ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <Icon name={play.icon} size={16} color="currentColor" />
                    <span>{play.name}</span>
                    {isShared && <span style={{ fontSize: 10, color: '#C9A96E' }}>공통</span>}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={() => navigate(`/chat/${userProfile.id}`)}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              border: 'none',
              boxShadow: '0 4px 16px rgba(139,0,0,0.35)',
              cursor: 'pointer',
            }}
          >
            쪽지 보내기
          </button>
          <button
            onClick={() => navigate('/more')}
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="차단 및 신고"
          >
            <Icon name="more" size={20} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: '#C9A96E',
  marginBottom: 12,
  letterSpacing: 0.5,
};
