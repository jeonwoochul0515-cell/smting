import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import Avatar from './Avatar';
import TendencyBadge from './TendencyBadge';
import Icon from './Icon';

interface EmptyStateProps {
  type: 'messages' | 'nearby' | 'talk' | 'block';
}

const hotUsers = users.filter(u => u.matchRate >= 85).slice(0, 3);

export default function EmptyState({ type }: EmptyStateProps) {
  const navigate = useNavigate();

  const config = {
    messages: {
      icon: 'mail',
      title: '아직 쪽지가 없어요',
      desc: '먼저 인사를 건네보세요!',
      cta: '주변 사람 둘러보기',
      ctaPath: '/nearby',
    },
    nearby: {
      icon: 'search',
      title: '조건에 맞는 사용자가 없어요',
      desc: '필터를 조정하면 더 많은 사람을 만날 수 있어요',
      cta: '필터 초기화',
      ctaPath: '',
    },
    talk: {
      icon: 'chat',
      title: '아직 게시글이 없어요',
      desc: '첫 번째 글의 주인공이 되어보세요!',
      cta: '토크 쓰러 가기',
      ctaPath: '/talk/write',
    },
    block: {
      icon: 'lock',
      title: '차단한 사용자가 없어요',
      desc: '쾌적한 사용 환경이네요!',
      cta: '주변 사람 둘러보기',
      ctaPath: '/nearby',
    },
  };

  const c = config[type];

  return (
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
      animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name={c.icon} size={48} color="#555" />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ddd', marginBottom: 6 }}>{c.title}</h3>
      <p style={{ fontSize: 13, color: '#777', marginBottom: 20, lineHeight: 1.5 }}>{c.desc}</p>

      {c.ctaPath && (
        <button
          onClick={() => navigate(c.ctaPath)}
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            background: 'linear-gradient(135deg, #8B0000, #5C0029)',
            border: 'none',
            boxShadow: '0 4px 16px rgba(139,0,0,0.35)',
            cursor: 'pointer',
            marginBottom: 32,
          }}
        >
          {c.cta}
        </button>
      )}

      {/* Cross-selling */}
      {(type === 'messages' || type === 'nearby') && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontSize: 12,
            color: '#C9A96E',
            fontWeight: 600,
            marginBottom: 14,
            letterSpacing: 0.5,
          }}>
            지금 인기 있는 사람들
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hotUsers.map(user => (
              <div
                key={user.id}
                onClick={() => navigate(`/user/${user.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(201,169,110,0.04)',
                  border: '1px solid rgba(201,169,110,0.1)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}
              >
                <Avatar color={user.avatar} nickname={user.nickname} size={40} online={user.online} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TendencyBadge tendency={user.tendency} size="sm" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{user.nickname}</span>
                    <span style={{ fontSize: 11, color: '#888' }}>{user.age}세</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#666' }}>{user.intro}</span>
                </div>
                <span style={{ fontSize: 11, color: '#C9A96E', fontWeight: 600 }}>궁합 {user.matchRate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
