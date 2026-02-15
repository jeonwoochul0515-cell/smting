import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import type { Tendency } from '../data/mockData';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';

const subTabs = ['근처여자', '근처남자', '최근여자', '최근남자'];
const tendencyFilters: (Tendency | '전체')[] = ['전체', 'S', 'M', 'SW'];
const distanceFilters = ['전체', '10km', '20km', '50km'];

export default function NearbyPage() {
  const [activeTab, setActiveTab] = useState('근처여자');
  const [showFilter, setShowFilter] = useState(false);
  const [tendencyFilter, setTendencyFilter] = useState<Tendency | '전체'>('전체');
  const [distanceFilter, setDistanceFilter] = useState('전체');
  const navigate = useNavigate();

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
      if (parseDistance(u.distance) > maxDist) return false;
    }
    return true;
  });

  const activeFilterCount = (tendencyFilter !== '전체' ? 1 : 0) + (distanceFilter !== '전체' ? 1 : 0);

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header
        right={
          <button
            onClick={() => setShowFilter(!showFilter)}
            style={{
              background: activeFilterCount > 0 ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.1)',
              color: activeFilterCount > 0 ? '#C9A96E' : '#fff',
              fontSize: 13,
              padding: '5px 12px',
              borderRadius: 8,
              fontWeight: 600,
              border: activeFilterCount > 0 ? '1px solid rgba(201,169,110,0.3)' : 'none',
            }}
          >
            필터 {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
        }
      />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={setActiveTab} />

      {/* Filter Panel */}
      {showFilter && (
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(20,20,20,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Tendency Filter */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: '#C9A96E', fontWeight: 600, marginBottom: 8, display: 'block' }}>
              성향
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {tendencyFilters.map(t => (
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
                    background: tendencyFilter === t
                      ? t === 'S' ? 'linear-gradient(135deg, #8B0000, #CC0000)'
                      : t === 'M' ? 'linear-gradient(135deg, #4A0080, #7B2FBE)'
                      : t === 'SW' ? 'linear-gradient(135deg, #005C5C, #008B8B)'
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
            <span style={{ fontSize: 12, color: '#C9A96E', fontWeight: 600, marginBottom: 8, display: 'block' }}>
              거리
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {distanceFilters.map(d => (
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
                    background: distanceFilter === d
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
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            <p style={{ fontSize: 14 }}>조건에 맞는 사용자가 없습니다</p>
          </div>
        ) : (
          filtered.map((user, i) => (
            <div
              key={user.id}
              onClick={() => navigate(`/chat/${user.id}`)}
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
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Avatar color={user.avatar} nickname={user.nickname} online={user.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <TendencyBadge tendency={user.tendency} size="sm" />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{user.nickname}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>
                    ({user.gender}{user.age}세) {user.distance}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.intro}
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  {user.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 10,
                      color: '#C9A96E',
                      backgroundColor: 'rgba(201, 169, 110, 0.08)',
                      padding: '2px 8px',
                      borderRadius: 10,
                      border: '1px solid rgba(201, 169, 110, 0.15)',
                    }}>
                      {tag}
                    </span>
                  ))}
                  <span style={{ fontSize: 10, color: '#C9A96E', marginLeft: 'auto', fontWeight: 600 }}>
                    궁합 {user.matchRate}%
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/chat/${user.id}`); }}
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
                }}
              >
                쪽지
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
