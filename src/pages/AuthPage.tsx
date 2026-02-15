import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      navigate('/nearby');
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
