import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';

const subTabs = ['근처여자', '근처남자', '최근여자', '최근남자'];

export default function NearbyPage() {
  const [activeTab, setActiveTab] = useState('근처여자');
  const navigate = useNavigate();

  const filtered = users.filter(u => {
    if (activeTab === '근처여자' || activeTab === '최근여자') return u.gender === '여';
    return u.gender === '남';
  });

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={setActiveTab} />
      <div>
        {filtered.map((user, i) => (
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
                <span style={{
                  fontSize: 10,
                  color: '#C9A96E',
                  marginLeft: 'auto',
                  fontWeight: 600,
                }}>
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
        ))}
      </div>
    </div>
  );
}
