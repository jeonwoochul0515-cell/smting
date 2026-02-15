import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import Icon from '../components/Icon';

export default function BlockListPage() {
  const navigate = useNavigate();
  // Mock: first 3 users are "blocked"
  const [blockedIds, setBlockedIds] = useState<number[]>([2, 5, 11]);

  const blockedUsers = users.filter(u => blockedIds.includes(u.id));

  const handleUnblock = (id: number) => {
    setBlockedIds(prev => prev.filter(bid => bid !== id));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      <Header title="차단 관리" showBack onBack={() => navigate(-1)} />

      <div style={{ padding: '16px' }}>
        {blockedUsers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#555',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Icon name="lock" size={48} color="#555" />
            </div>
            <p style={{ fontSize: 15 }}>차단한 사용자가 없습니다</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
              차단된 사용자: {blockedUsers.length}명
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {blockedUsers.map((user, i) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    gap: 12,
                    borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
                  }}
                >
                  <Avatar color={user.avatar} nickname={user.nickname} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <TendencyBadge tendency={user.tendency} size="sm" />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{user.nickname}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>{user.age}세</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#666' }}>{user.intro}</span>
                  </div>
                  <button
                    onClick={() => handleUnblock(user.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#FF6B6B',
                      background: 'rgba(255, 107, 107, 0.08)',
                      border: '1px solid rgba(255, 107, 107, 0.2)',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    차단 해제
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
