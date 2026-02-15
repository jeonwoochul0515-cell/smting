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
}

const subTabs = ['근처여자', '근처남자', '최근여자', '최근남자'];
const tendencyFilters: (Tendency | '전체')[] = ['전체', 'S', 'M', 'SW'];
const distanceFilters = ['전체', '10km', '20km', '50km'];

export default function NearbyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('근처여자');
  const [showFilter, setShowFilter] = useState(false);
  const [tendencyFilter, setTendencyFilter] = useState<Tendency | '전체'>('전체');
  const [distanceFilter, setDistanceFilter] = useState('전체');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [cai, setCai] = useState(0);

  // 앱 로드 시 모든 프로필 불러오기
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);

        // 현재 사용자 프로필 불러오기
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
            // 처음 로그인 후 토크 팝업 띄우기 (localStorage 체크)
            const hasSeenTalkModal = localStorage.getItem(`talk_modal_${user.id}`);
            if (!hasSeenTalkModal) {
              setShowTalkModal(true);
              localStorage.setItem(`talk_modal_${user.id}`, 'true');
            }
          }
        }

        // 모든 사용자 프로필 불러오기 (본인 제외)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user?.id || '');

        if (error) throw error;

        // 거리 계산 (내 좌표와 상대방 좌표 기반)
        const usersWithDistance = (data || []).map(u => ({
          ...u,
          distance_km: (myLat && myLng && u.latitude && u.longitude)
            ? getDistanceKm(myLat, myLng, u.latitude, u.longitude)
            : 999,
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

  const parseDistance = (d: string) => parseFloat(d.replace('km', ''));

  const filtered = users.filter(u => {
    // Gender filter
    if (activeTab === '근처여자' || activeTab === '최근여자') {
      if (u.gender !== '여') return false;
    } else {
      if (u.gender !== '남') return false;
    }
    // Tendency filter
    if (tendencyFilter !== '전체' && u.tendency !== tendencyFilter) return false;
    // Distance filter
    if (distanceFilter !== '전체') {
      const maxDist = parseDistance(distanceFilter);
      if ((u.distance_km || 0) > maxDist) return false;
    }
    return true;
  });

  // 매칭률 계산 (현재 사용자와 비교)
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

  // 최신순으로 정렬 (실제로는 생성 시간으로 정렬)
  const sorted = filteredWithMatch.sort((a, b) => {
    if (activeTab.includes('최근')) {
      // 최근순: 생성 시간 내림차순
      return 0; // 목데이터이므로 유지
    }
    // 근처순: 거리 오름차순
    return (a.distance_km || 0) - (b.distance_km || 0);
  });

  const activeFilterCount =
    (tendencyFilter !== '전체' ? 1 : 0) + (distanceFilter !== '전체' ? 1 : 0);

  if (loading) {
    return (
      <div style={{ paddingBottom: 60, textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: 14, color: '#888' }}>사용자 불러오는 중...</p>
      </div>
    );
  }

  const handleTalkSuccess = () => {
    // Cai +30
    setCai(prev => prev + 30);
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header
        cai={cai}
        right={
          <button
            onClick={() => setShowFilter(!showFilter)}
            style={{
              background: activeFilterCount > 0
                ? 'rgba(201,169,110,0.15)'
                : 'rgba(255,255,255,0.1)',
              color: activeFilterCount > 0 ? '#C9A96E' : '#fff',
              fontSize: 13,
              padding: '5px 12px',
              borderRadius: 8,
              fontWeight: 600,
              border: activeFilterCount > 0
                ? '1px solid rgba(201,169,110,0.3)'
                : 'none',
            }}
          >
            필터 {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
        }
      />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={setActiveTab} />

      {/* Filter Panel */}
      {showFilter && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(20,20,20,0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Tendency Filter */}
          <div style={{ marginBottom: 14 }}>
            <span
              style={{
                fontSize: 12,
                color: '#C9A96E',
                fontWeight: 600,
                marginBottom: 8,
                display: 'block',
              }}
            >
              성향
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {tendencyFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setTendencyFilter(t)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: tendencyFilter === t ? '#fff' : '#777',
                    background:
                      tendencyFilter === t
                        ? t === 'S'
                          ? 'linear-gradient(135deg, #8B0000, #CC0000)'
                          : t === 'M'
                          ? 'linear-gradient(135deg, #4A0080, #7B2FBE)'
                          : t === 'SW'
                          ? 'linear-gradient(135deg, #005C5C, #008B8B)'
                          : 'linear-gradient(135deg, #333, #555)'
                        : 'rgba(255,255,255,0.04)',
                    border: tendencyFilter === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.2s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <span
              style={{
                fontSize: 12,
                color: '#C9A96E',
                fontWeight: 600,
                marginBottom: 8,
                display: 'block',
              }}
            >
              거리
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
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
                    background:
                      distanceFilter === d
                        ? 'rgba(201,169,110,0.1)'
                        : 'rgba(255,255,255,0.04)',
                    border: distanceFilter === d
                      ? '1px solid rgba(201,169,110,0.3)'
                      : '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.2s',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User List */}
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <TendencyBadge tendency={user.tendency} size="sm" />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {user.nickname}
                  </span>
                  <span style={{ fontSize: 12, color: '#888' }}>
                    ({user.gender}{user.age}세) {user.distance_km?.toFixed(1)}km
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#888',
                    marginBottom: 5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.intro || '자기소개 없음'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
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
                  <span
                    style={{
                      fontSize: 10,
                      color: '#C9A96E',
                      marginLeft: 'auto',
                      fontWeight: 600,
                    }}
                  >
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

      {/* Talk Write Modal */}
      {showTalkModal && (
        <TalkWriteModal
          onClose={() => setShowTalkModal(false)}
          onSuccess={handleTalkSuccess}
        />
      )}
    </div>
  );
}
