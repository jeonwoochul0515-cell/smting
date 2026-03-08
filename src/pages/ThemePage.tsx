import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const boards = [
  {
    id: 'fs',
    label: 'FS',
    name: '여성 서브미시브',
    desc: '리드를 따르고 복종하는 역할을 즐기는 여성',
    gradient: 'linear-gradient(135deg, #8B0000, #5C0029)',
    color: '#8B0000',
    emoji: '🎀',
  },
  {
    id: 'fd',
    label: 'FD',
    name: '여성 도미넌트',
    desc: '주도권을 갖고 이끄는 역할을 즐기는 여성',
    gradient: 'linear-gradient(135deg, #1A3A5C, #0D1F33)',
    color: '#1A3A5C',
    emoji: '👑',
  },
  {
    id: 'ms',
    label: 'MS',
    name: '남성 서브미시브',
    desc: '리드를 따르고 복종하는 역할을 즐기는 남성',
    gradient: 'linear-gradient(135deg, #1A4A1A, #0D2D0D)',
    color: '#1A4A1A',
    emoji: '⛓️',
  },
  {
    id: 'md',
    label: 'MD',
    name: '남성 도미넌트',
    desc: '주도권을 갖고 이끄는 역할을 즐기는 남성',
    gradient: 'linear-gradient(135deg, #2A1A5C, #150D33)',
    color: '#2A1A5C',
    emoji: '🔱',
  },
];

export default function ThemePage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />
      <div style={{ padding: '20px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#F0F0F0' }}>자유게시판</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>게시판을 선택해주세요</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {boards.map((board, i) => (
            <div
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              style={{
                borderRadius: 18,
                padding: '28px 24px',
                cursor: 'pointer',
                border: `1px solid ${board.color}55`,
                background: 'rgba(10,10,10,0.9)',
                boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 ${board.color}22`,
                animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.5), 0 0 20px ${board.color}44`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 ${board.color}22`;
              }}
            >
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 120, height: 120, borderRadius: '50%',
                background: board.gradient, opacity: 0.12, pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: board.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, flexShrink: 0,
                  boxShadow: `0 4px 12px ${board.color}55`,
                }}>
                  {board.emoji}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 22, fontWeight: 800,
                      background: board.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>{board.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#ddd' }}>{board.name}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5, margin: 0 }}>{board.desc}</p>
                </div>
                <div style={{ marginLeft: 'auto', color: '#555', fontSize: 18, flexShrink: 0 }}>›</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
