import { useNavigate } from 'react-router-dom';
import { messages } from '../data/mockData';
import Header from '../components/Header';
import SubTabs from '../components/SubTabs';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import { useState } from 'react';

const subTabs = ['전체읽음', '전체삭제', '친구쪽지'];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체읽음');

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />
      <SubTabs tabs={subTabs} active={activeTab} onSelect={setActiveTab} />
      <div>
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            onClick={() => navigate(`/chat/${msg.user.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px',
              gap: 12,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              backgroundColor: msg.unread ? 'rgba(139,0,0,0.04)' : 'transparent',
              animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = msg.unread ? 'rgba(139,0,0,0.04)' : 'transparent'}
          >
            <Avatar color={msg.user.avatar} nickname={msg.user.nickname} size={50} online={msg.user.online} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TendencyBadge tendency={msg.user.tendency} size="sm" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{msg.user.nickname}</span>
                <span style={{ fontSize: 12, color: '#888' }}>{msg.user.age}세 {msg.user.distance}</span>
              </div>
              <div style={{
                fontSize: 13,
                color: msg.unread ? '#ccc' : '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {msg.lastMessage}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#555' }}>{msg.timeAgo}</span>
              {msg.unread && (
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B0000, #CC0000)',
                  display: 'block',
                  boxShadow: '0 0 6px rgba(139,0,0,0.5)',
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
