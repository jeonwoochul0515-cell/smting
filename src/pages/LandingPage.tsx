import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const privacyPoints = [
  { emoji: '📵', title: '전화번호 불필요', desc: '이메일 하나면 충분합니다. 번호 인증 없음.' },
  { emoji: '🎭', title: '닉네임만 사용', desc: '실명·SNS 연동 없음. 내가 원하는 이름으로만 활동.' },
  { emoji: '📍', title: '거리만 표시', desc: '정확한 위치는 절대 공개되지 않습니다. 몇 km인지만 표시.' },
  { emoji: '🗑️', title: '언제든 완전 삭제', desc: '계정 탈퇴 시 대화·게시글·프로필 모두 즉시 삭제.' },
];

const features = [
  { emoji: '🧭', title: '주변 성향자 탐색', desc: 'S / M / SW 성향 + 취향 기반 주변 사람 탐색' },
  { emoji: '💬', title: '실시간 토크', desc: '위치 기반 토크 피드. 내 주변 이야기를 나눠요.' },
  { emoji: '🎀', title: '익명 자유게시판', desc: 'FS · FD · MS · MD 카테고리별 완전 익명 게시판' },
  { emoji: '✉️', title: '1:1 쪽지', desc: '마음에 드는 상대에게 조용히 쪽지를 보내세요.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('smting_ref', ref);
    }
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0A0A0A',
      color: '#F0F0F0',
      overflowX: 'hidden',
    }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        padding: '60px 24px 48px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,0,0,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 44,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #C9A96E, #E8D5B0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 2,
            marginBottom: 10,
            animation: 'fadeIn 0.6s ease both',
          }}>
            SMting
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#E0E0E0',
            marginBottom: 8,
            animation: 'fadeIn 0.6s ease 0.1s both',
          }}>
            성향자들의 익명 소셜 커뮤니티
          </div>
          <div style={{
            fontSize: 13,
            color: '#666',
            letterSpacing: 1,
            animation: 'fadeIn 0.6s ease 0.2s both',
          }}>
            YOUR DESIRE, YOUR MATCH
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{
          background: 'rgba(139,0,0,0.06)',
          border: '1px solid rgba(139,0,0,0.2)',
          borderRadius: 20,
          padding: '24px 20px',
          marginBottom: 12,
          animation: 'fadeIn 0.5s ease 0.3s both',
        }}>
          <div style={{ fontSize: 12, color: '#8B0000', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16 }}>
            🔒  프라이버시 보장
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {privacyPoints.map((p, i) => (
              <div key={p.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                animation: `fadeIn 0.4s ease ${0.4 + i * 0.08}s both`,
              }}>
                <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#E8D5B0', marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tagline under privacy */}
        <div style={{
          textAlign: 'center', fontSize: 12, color: '#555',
          animation: 'fadeIn 0.5s ease 0.7s both',
        }}>
          이 커뮤니티에 있다는 것 자체가 알려지면 안 되죠. 알고 있어요.
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{ fontSize: 13, color: '#666', fontWeight: 600, letterSpacing: 1, marginBottom: 16 }}>
          주요 기능
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '18px 14px',
              animation: `fadeIn 0.4s ease ${0.8 + i * 0.08}s both`,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E0E0E0', marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div style={{ padding: '0 20px 40px', animation: 'fadeIn 0.5s ease 1.1s both' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 16,
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#C9A96E', marginBottom: 4 }}>무료</div>
          <div style={{ fontSize: 13, color: '#888' }}>가입비 없음 · 기본 기능 모두 무료</div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '0 20px 48px',
        marginTop: 'auto',
        animation: 'fadeIn 0.6s ease 1.2s both',
      }}>
        <button
          onClick={() => navigate('/auth')}
          style={{
            width: '100%',
            padding: '18px 0',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            background: 'linear-gradient(135deg, #8B0000, #5C0029)',
            border: 'none',
            boxShadow: '0 4px 24px rgba(139,0,0,0.5)',
            cursor: 'pointer',
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          이메일로 시작하기 (무료)
        </button>
        <p style={{
          textAlign: 'center', fontSize: 11, color: '#444',
          lineHeight: 1.6, margin: 0,
        }}>
          전화번호 없이 이메일만으로 가입 완료
          <br />
          가입 시 <span
            onClick={() => navigate('/terms')}
            style={{ color: '#666', textDecoration: 'underline', cursor: 'pointer' }}
          >이용약관</span> 및 <span
            onClick={() => navigate('/privacy')}
            style={{ color: '#666', textDecoration: 'underline', cursor: 'pointer' }}
          >개인정보처리방침</span>에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
