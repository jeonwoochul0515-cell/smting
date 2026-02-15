import { useParams, useNavigate } from 'react-router-dom';
import { users, chatMessages } from '../data/mockData';
import Header from '../components/Header';
import TendencyBadge from '../components/TendencyBadge';
import Avatar from '../components/Avatar';
import ReportModal from '../components/ReportModal';
import { useState } from 'react';

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [blocked, setBlocked] = useState(false);

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
            <span style={{ fontSize: 12, color: '#C9A96E', fontWeight: 600 }}>궁합 {user.matchRate}%</span>
            <button
              onClick={() => setShowMenu(true)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 16,
                padding: '2px 8px',
                borderRadius: 6,
                marginLeft: 4,
              }}
            >
              ⋮
            </button>
          </div>
        }
      />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0F0808 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{
          textAlign: 'center',
          fontSize: 11,
          color: '#555',
          padding: '8px 16px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          alignSelf: 'center',
        }}>
          2026년 2월 15일
        </div>
        {chatMessages.map((msg, i) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8,
              animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
            }}
          >
            {!msg.isMe && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar color={user.avatar} nickname={user.nickname} size={34} />
                <span style={{ fontSize: 9, color: '#666' }}>{user.nickname}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              flexDirection: msg.isMe ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 6,
            }}>
              <div style={{
                maxWidth: 230,
                padding: '10px 14px',
                borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.isMe
                  ? 'linear-gradient(135deg, #8B0000, #5C0029)'
                  : 'rgba(255,255,255,0.06)',
                color: '#F0F0F0',
                fontSize: 14,
                lineHeight: 1.5,
                wordBreak: 'break-word',
                boxShadow: msg.isMe
                  ? '0 2px 8px rgba(139,0,0,0.3)'
                  : '0 2px 6px rgba(0,0,0,0.2)',
                border: msg.isMe ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>{msg.time}</span>
            </div>
          </div>
        ))}

        {blocked && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: 'rgba(255,68,68,0.06)',
            borderRadius: 12,
            border: '1px solid rgba(255,68,68,0.15)',
            color: '#FF6B6B',
            fontSize: 13,
          }}>
            이 사용자를 차단했습니다
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        padding: '10px 12px',
        gap: 8,
        backgroundColor: 'rgba(20,20,20,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={blocked ? '차단된 사용자입니다' : '메시지를 입력하세요...'}
          disabled={blocked}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: '#F0F0F0',
            fontSize: 14,
          }}
        />
        <button
          disabled={blocked}
          style={{
            background: blocked ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #8B0000, #5C0029)',
            color: blocked ? '#555' : '#fff',
            borderRadius: 20,
            padding: '0 20px',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: blocked ? 'none' : '0 2px 8px rgba(139,0,0,0.3)',
          }}
        >
          전송
        </button>
      </div>

      {showMenu && (
        <ReportModal
          nickname={user.nickname}
          mode="menu"
          onClose={() => setShowMenu(false)}
          onBlock={() => setBlocked(true)}
        />
      )}
    </div>
  );
}
