import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/talk');
    } catch (err: any) {
      let errorMessage = err.message || '오류가 발생했습니다';

      // Better error messages
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = '이메일 또는 비밀번호가 일치하지 않습니다';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = '이미 가입된 이메일입니다. 로그인해주세요';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: 'rgba(255, 100, 100, 0.1)',
              border: '1px solid rgba(255, 100, 100, 0.3)',
              color: '#FF6464',
              fontSize: 13,
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#C9A96E',
              marginBottom: 8,
            }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#F0F0F0',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.2s',
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#C9A96E',
              marginBottom: 8,
            }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#F0F0F0',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.2s',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: loading || !email || !password ? '#555' : '#fff',
              background: loading || !email || !password
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, #8B0000, #5C0029)',
              border: 'none',
              boxShadow: (loading || !email || !password)
                ? 'none'
                : '0 4px 16px rgba(139,0,0,0.35)',
              cursor: loading || !email || !password ? 'default' : 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {loading ? '처리 중...' : isSignUp ? '가입하기' : '로그인'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '4px 0',
          }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: '#555' }}>또는</span>
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={async () => {
              setError('');
              setLoading(true);
              try {
                await signInWithGoogle();
              } catch (err: any) {
                setError(err.message || '구글 로그인 중 오류가 발생했습니다');
                setLoading(false);
              }
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              color: loading ? '#555' : '#F0F0F0',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: loading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s',
            }}
          >
            {/* Google Icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            구글로 계속하기
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 13, color: '#777' }}>
              {isSignUp ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmail('');
                setPassword('');
              }}
              style={{
                fontSize: 13,
                color: '#C9A96E',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              {isSignUp ? '로그인' : '가입'}
            </button>
          </div>

          {/* 비밀번호 재설정 */}
          {!isSignUp && (
            <div style={{ textAlign: 'center' }}>
              {!showResetPassword ? (
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  style={{ fontSize: 12, color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  비밀번호를 잊으셨나요?
                </button>
              ) : resetSent ? (
                <p style={{ fontSize: 12, color: '#00C853', textAlign: 'center' }}>재설정 링크를 이메일로 전송했습니다</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="가입한 이메일 입력"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#F0F0F0', fontSize: 13, outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!resetEmail) return;
                      try {
                        await resetPassword(resetEmail);
                        setResetSent(true);
                      } catch (err: any) {
                        setError(err.message || '재설정 메일 전송 실패');
                      }
                    }}
                    style={{ padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #8B0000, #5C0029)', border: 'none', cursor: 'pointer' }}
                  >
                    재설정 링크 전송
                  </button>
                  <button type="button" onClick={() => setShowResetPassword(false)} style={{ fontSize: 12, color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>취소</button>
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          <div style={{
            fontSize: 12,
            color: '#777',
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 1.5,
          }}>
            {isSignUp ? (
              <>새로운 계정을 만드시려면 <br /> 이메일과 비밀번호를 입력해주세요</>
            ) : (
              <>가입하신 이메일과 비밀번호로 <br /> 로그인해주세요</>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
