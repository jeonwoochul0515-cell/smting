import { useState } from 'react';
import { talkPosts } from '../data/mockData';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import TendencyBadge from '../components/TendencyBadge';

const subTabs = ['전체', '사진', '지역', '동네', '근처', '내토크', '토크쓰기'];

export default function TalkPage() {
  const [activeTab, setActiveTab] = useState('전체');

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={setActiveTab} />
      <div>
        {talkPosts.map(post => (
          <div
            key={post.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #1A1A1A',
              cursor: 'pointer',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#999' }}>
                <span>{post.timeAgo}</span>
                <TendencyBadge tendency={post.tendency} size="sm" />
                <span style={{ fontWeight: 600, color: '#ccc' }}>{post.nickname}</span>
                <span>{post.age}세</span>
                <span>{post.distance}</span>
              </div>
            </div>
            <button style={{
              backgroundColor: '#8B0000',
              color: '#fff',
              fontSize: 11,
              padding: '5px 10px',
              borderRadius: 4,
              flexShrink: 0,
              marginLeft: 8,
            }}>
              쪽지쓰기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
