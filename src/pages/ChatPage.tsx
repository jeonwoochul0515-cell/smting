import { useParams, useNavigate } from 'react-router-dom';
import { users, chatMessages } from '../data/mockData';
import Header from '../components/Header';
import TendencyBadge from '../components/TendencyBadge';
import Avatar from '../components/Avatar';
import { useState } from 'react';

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const user = users.find(u => u.id === Number(userId)) || users[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        title={`${user.nickname} ${user.age}세 ${user.distance}`}
        showBack
        onBack={() => navigate(-1)}
        right={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TendencyBadge tendency={user.tendency} />
            <span style={{ fontSize: 12, color: '#FF6B6B' }}>궁합 {user.matchRate}%</span>
          </div>
        }
      />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#111',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#666', padding: '8px 0' }}>
          2026년 2월 15일
        </div>
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {!msg.isMe && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar color={user.avatar} nickname={user.nickname} size={36} />
                <span style={{ fontSize: 10, color: '#999' }}>{user.nickname}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              flexDirection: msg.isMe ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 6,
            }}>
              <div style={{
                maxWidth: 240,
                padding: '10px 14px',
                borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: msg.isMe ? '#8B0000' : '#2A2A2A',
                color: '#F0F0F0',
                fontSize: 14,
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: 10, color: '#666', whiteSpace: 'nowrap' }}>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        padding: '10px 12px',
        gap: 8,
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid #333',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 20,
            border: '1px solid #333',
            backgroundColor: '#2A2A2A',
            color: '#F0F0F0',
            fontSize: 14,
          }}
        />
        <button style={{
          backgroundColor: '#8B0000',
          color: '#fff',
          borderRadius: 20,
          padding: '0 18px',
          fontSize: 14,
          fontWeight: 600,
        }}>
          전송
        </button>
      </div>
    </div>
  );
}
