import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { talkPosts } from '../data/mockData';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import TendencyBadge from '../components/TendencyBadge';

const subTabs = ['전체', '사진', '지역', '동네', '근처', '내토크', '토크쓰기'];

export default function TalkPage() {
  const [activeTab, setActiveTab] = useState('전체');
  const navigate = useNavigate();

  const handleTabSelect = (tab: string) => {
    if (tab === '토크쓰기') {
      navigate('/talk/write');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={handleTabSelect} />
      <div>
        {talkPosts.map((post, i) => (
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
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
                <span>{post.timeAgo}</span>
                <TendencyBadge tendency={post.tendency} size="sm" />
                <span style={{ fontWeight: 600, color: '#ccc' }}>{post.nickname}</span>
                <span>{post.age}세</span>
                <span>{post.distance}</span>
              </div>
            </div>
            <button style={{
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              color: '#fff',
              fontSize: 11,
              padding: '6px 12px',
              borderRadius: 8,
              flexShrink: 0,
              marginLeft: 8,
              boxShadow: '0 2px 8px rgba(139,0,0,0.3)',
              fontWeight: 600,
            }}>
              쪽지쓰기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
