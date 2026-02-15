import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Permission {
  id: string;
  icon: string;
  title: string;
  description: string;
  required: boolean;
}

const permissions: Permission[] = [
  {
    id: 'notification',
    icon: '🔔',
    title: '알림',
    description: '새로운 쪽지, 매칭 알림을 받을 수 있습니다',
    required: true,
  },
  {
    id: 'location',
    icon: '📍',
    title: '위치 정보',
    description: '주변 사용자를 찾기 위해 위치 정보가 필요합니다',
    required: true,
  },
];

export default function PermissionsPage() {
  const navigate = useNavigate();
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const [requesting, setRequesting] = useState<string | null>(null);

  const allGranted = permissions.filter(p => p.required).every(p => granted[p.id]);

  const requestPermission = (id: string) => {
    setRequesting(id);
    // Simulate permission request
    setTimeout(() => {
      setGranted(prev => ({ ...prev, [id]: true }));
      setRequesting(null);
    }, 1000);
  };

  const handleContinue = () => {
    navigate('/register');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 18px 16px',
        background: 'linear-gradient(135deg, #8B0000 0%, #5C0029 100%)',
        boxShadow: '0 4px 20px rgba(92, 0, 41, 0.4)',
      }}>
        <h1 style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#C9A96E',
          letterSpacing: 1,
        }}>
          SMting
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            앱 권한 설정
          </h2>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
            더 나은 서비스를 위해 아래 권한을 허용해주세요
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
          {permissions.map((perm, i) => {
            const isGranted = granted[perm.id];
            const isRequesting = requesting === perm.id;

            return (
              <div
                key={perm.id}
                style={{
                  padding: '20px 18px',
                  borderRadius: 16,
                  background: isGranted
                    ? 'rgba(0, 200, 83, 0.04)'
                    : 'rgba(255,255,255,0.02)',
                  border: isGranted
                    ? '1px solid rgba(0, 200, 83, 0.2)'
                    : '1px solid rgba(255,255,255,0.06)',
                  animation: `fadeIn 0.4s ease ${i * 0.15}s both`,
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: isGranted
                      ? 'rgba(0, 200, 83, 0.1)'
                      : 'rgba(139, 0, 0, 0.12)',
                    border: isGranted
                      ? '1px solid rgba(0, 200, 83, 0.2)'
                      : '1px solid rgba(139, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}>
                    {isGranted ? '✅' : perm.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                        {perm.title}
                      </span>
                      {perm.required && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#8B0000',
                          backgroundColor: 'rgba(139,0,0,0.15)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}>
                          필수
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                      {perm.description}
                    </p>
                  </div>
                </div>

                {!isGranted && (
                  <button
                    onClick={() => requestPermission(perm.id)}
                    disabled={isRequesting}
                    style={{
                      width: '100%',
                      marginTop: 14,
                      padding: '12px 0',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#fff',
                      background: isRequesting
                        ? 'rgba(255,255,255,0.06)'
                        : 'linear-gradient(135deg, #8B0000, #5C0029)',
                      border: 'none',
                      boxShadow: isRequesting
                        ? 'none'
                        : '0 2px 12px rgba(139,0,0,0.3)',
                      cursor: isRequesting ? 'default' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isRequesting ? '요청 중...' : '허용하기'}
                  </button>
                )}

                {isGranted && (
                  <div style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: 13,
                    color: '#00C853',
                    fontWeight: 600,
                  }}>
                    허용됨
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {/* Continue Button */}
        <div style={{ padding: '16px 0 20px' }}>
          <button
            onClick={handleContinue}
            disabled={!allGranted}
            style={{
              width: '100%',
              padding: '16px 0',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              color: allGranted ? '#fff' : '#555',
              background: allGranted
                ? 'linear-gradient(135deg, #8B0000, #5C0029)'
                : 'rgba(255,255,255,0.04)',
              border: 'none',
              boxShadow: allGranted
                ? '0 4px 20px rgba(139,0,0,0.4)'
                : 'none',
              cursor: allGranted ? 'pointer' : 'default',
              transition: 'all 0.3s',
              letterSpacing: 0.5,
            }}
          >
            {allGranted ? '계속하기' : '모든 필수 권한을 허용해주세요'}
          </button>
        </div>
      </div>
    </div>
  );
}
