import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #1A0508 40%, #0A0A0A 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,0,0,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          fontSize: 48,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #C9A96E, #E8D5B0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 3,
          marginBottom: 8,
          textShadow: 'none',
        }}>
          SMting
        </div>
        <div style={{
          fontSize: 14,
          color: '#888',
          letterSpacing: 2,
          marginBottom: 48,
        }}>
          YOUR DESIRE, YOUR MATCH
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 320, marginBottom: 48 }}>
          {[
            { icon: '🔥', title: '성향 매칭', desc: 'S / M / SW 성향 기반으로 궁합이 맞는 파트너를 찾아드립니다' },
            { icon: '🎭', title: '플레이 취향', desc: '20가지 이상의 플레이 중 나의 취향을 설정하고 맞는 상대를 만나세요' },
            { icon: '📍', title: '주변 탐색', desc: '내 주변의 같은 성향을 가진 사람들을 실시간으로 확인하세요' },
            { icon: '🔒', title: '안전한 만남', desc: '본인 인증을 통한 안전하고 신뢰할 수 있는 커뮤니티' },
          ].map((feat, i) => (
            <div
              key={feat.title}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                animation: `fadeIn 0.5s ease ${0.2 + i * 0.15}s both`,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(139, 0, 0, 0.12)',
                border: '1px solid rgba(139, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}>
                {feat.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E8D5B0', marginBottom: 3 }}>
                  {feat.title}
                </div>
                <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5 }}>
                  {feat.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '16px 24px 36px',
        animation: 'fadeIn 0.6s ease 0.8s both',
      }}>
        <button
          onClick={() => navigate('/verify')}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            background: 'linear-gradient(135deg, #8B0000, #5C0029)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(139,0,0,0.4)',
            cursor: 'pointer',
            letterSpacing: 1,
          }}
        >
          휴대폰 인증하고 시작하기
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#555', marginTop: 12, lineHeight: 1.5 }}>
          가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
