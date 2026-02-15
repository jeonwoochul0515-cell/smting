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
        {filtered.map(user => (
          <div
            key={user.id}
            onClick={() => navigate(`/chat/${user.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #1A1A1A',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <Avatar color={user.avatar} nickname={user.nickname} online={user.online} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <TendencyBadge tendency={user.tendency} size="sm" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{user.nickname}</span>
                <span style={{ fontSize: 12, color: '#999' }}>
                  ({user.gender}{user.age}세) {user.distance}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.intro}
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {user.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 10, color: '#8B0000', backgroundColor: '#1A0000', padding: '1px 6px', borderRadius: 8 }}>
                    {tag}
                  </span>
                ))}
                <span style={{ fontSize: 10, color: '#FF6B6B', marginLeft: 'auto' }}>
                  궁합 {user.matchRate}%
                </span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/chat/${user.id}`); }}
              style={{
                backgroundColor: '#8B0000',
                color: '#fff',
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                flexShrink: 0,
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
