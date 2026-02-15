import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tendency } from '../data/mockData';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import TalkWriteModal from '../components/TalkWriteModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { calcMatchRate } from '../utils/matchAlgo';
import { getDistanceKm } from '../utils/geolocation';

interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  gender: string;
  tendency: Tendency;
  intro: string;
  avatar: string;
  all_plays: string[];
  top_plays: string[];
  distance_km?: number;
  last_active_at?: string;
}

const subTabs = ['근처여자', '근처남자', '최근여자', '최근남자'];

export default function NearbyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('근처여자');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [cai, setCai] = useState(0);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);

        let myLat: number | null = null;
        let myLng: number | null = null;
        if (user) {
          const { data: myData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (myData) {
            setCurrentUserProfile(myData);
            setCai(myData.cai || 0);
            myLat = myData.latitude ?? null;
            myLng = myData.longitude ?? null;
            const hasSeenTalkModal = localStorage.getItem(`talk_modal_${user.id}`);
            if (!hasSeenTalkModal) {
              setShowTalkModal(true);
              localStorage.setItem(`talk_modal_${user.id}`, 'true');
            }
          }
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user?.id || '');

        if (error) throw error;

        const usersWithDistance = (data || []).map(u => ({
          ...u,
          distance_km: (myLat && myLng && u.latitude && u.longitude)
            ? getDistanceKm(myLat, myLng, u.latitude, u.longitude)
            : undefined,
        }));

        setUsers(usersWithDistance);
      } catch (err) {
        console.error('Failed to load profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [user]);

  const getTimeAgo = (date: string | undefined): string => {
    if (!date) return '';
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

  const filtered = users.filter(u => {
    // Gender
    if (activeTab === '근처여자' || activeTab === '최근여자') {
      if (u.gender !== '여') return false;
    } else {
      if (u.gender !== '남') return false;
    }

    if (activeTab === '근처여자' || activeTab === '근처남자') {
      // 근처: 20km 이내 (거리 모르면 포함)
      if (u.distance_km !== undefined && u.distance_km > 20) return false;
    } else {
      // 최근: 10시간 이내 접속 (접속기록 없으면 포함)
      if (u.last_active_at) {
        const now = new Date();
        const lastActive = new Date(u.last_active_at + (u.last_active_at.endsWith('Z') ? '' : 'Z'));
        const diffHours = (now.getTime() - lastActive.getTime()) / 3600000;
        if (diffHours > 10) return false;
      }
    }

    return true;
  });

  const filteredWithMatch = filtered.map(u => ({
    ...u,
    matchRate: currentUserProfile
      ? calcMatchRate(
          currentUserProfile.tendency,
          u.tendency,
          currentUserProfile.all_plays || [],
          u.all_plays || []
        )
      : 0,
  }));

  const sorted = filteredWithMatch.sort((a, b) => {
    if (activeTab.includes('최근')) {
      const aTime = a.last_active_at ? new Date(a.last_active_at).getTime() : 0;
      const bTime = b.last_active_at ? new Date(b.last_active_at).getTime() : 0;
      return bTime - aTime;
    }
    // 근처: 거리 오름차순 (거리 없으면 뒤로)
    const aDist = a.distance_km ?? 9999;
    const bDist = b.distance_km ?? 9999;
    return aDist - bDist;
  });

  if (loading) {
    return (
      <div style={{ paddingBottom: 60, textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: 14, color: '#888' }}>사용자 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header cai={cai} />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={setActiveTab} />

      <div>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            <p style={{ fontSize: 14 }}>조건에 맞는 사용자가 없습니다</p>
          </div>
        ) : (
          sorted.map((user, i) => (
            <div
              key={user.id}
              onClick={() => navigate(`/user/${user.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                gap: 12,
                cursor: 'pointer',
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.06)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <Avatar color={user.avatar} nickname={user.nickname} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* 1행: 성향뱃지 + 닉네임 + 나이 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <TendencyBadge tendency={user.tendency} size="sm" />
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#F0F0F0' }}>
                    {user.nickname}
                  </span>
                  <span style={{ fontSize: 12, color: '#777' }}>
                    {user.age}세
                  </span>
                </div>

                {/* 2행: 거리 + 접속시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#888', marginBottom: 4 }}>
                  <span>
                    {user.distance_km !== undefined
                      ? `${user.distance_km < 1 ? (user.distance_km * 1000).toFixed(0) + 'm' : user.distance_km.toFixed(1) + 'km'}`
                      : '거리 미확인'}
                  </span>
                  <span style={{ color: '#444' }}>·</span>
                  <span>{user.last_active_at ? getTimeAgo(user.last_active_at) + ' 접속' : '접속 정보 없음'}</span>
                </div>

                {/* 3행: 자기소개 */}
                <div style={{
                  fontSize: 12,
                  color: '#999',
                  marginBottom: 5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user.intro || '자기소개 없음'}
                </div>

                {/* 4행: 최애플 + 궁합 */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  {(user.top_plays || []).slice(0, 3).map((playId) => (
                    <span
                      key={playId}
                      style={{
                        fontSize: 10,
                        color: '#C9A96E',
                        backgroundColor: 'rgba(201, 169, 110, 0.08)',
                        padding: '2px 8px',
                        borderRadius: 10,
                        border: '1px solid rgba(201, 169, 110, 0.15)',
                      }}
                    >
                      #{playId}
                    </span>
                  ))}
                  <span style={{ fontSize: 10, color: '#C9A96E', marginLeft: 'auto', fontWeight: 600 }}>
                    궁합 {user.matchRate}%
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${user.id}`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #8B0000, #5C0029)',
                  color: '#fff',
                  fontSize: 12,
                  padding: '7px 14px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(139,0,0,0.3)',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                쪽지
              </button>
            </div>
          ))
        )}
      </div>

      {showTalkModal && (
        <TalkWriteModal
          onClose={() => setShowTalkModal(false)}
          onSuccess={() => {
            setShowTalkModal(false);
            setCai(prev => prev + 30);
          }}
        />
      )}
    </div>
  );
}
