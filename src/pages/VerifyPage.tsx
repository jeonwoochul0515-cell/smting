import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [fetchingPhone, setFetchingPhone] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
  };

  const handlePhoneChange = (value: string) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 11) setPhone(nums);
  };

  const fetchPhoneFromDevice = () => {
    setFetchingPhone(true);
    // Simulate fetching phone from device contacts
    setTimeout(() => {
      setPhone('01012345678');
      setFetchingPhone(false);
    }, 800);
  };

  const handleSendCode = () => {
    if (phone.length < 10) return;
    setCodeSent(true);
    setTimer(180); // 3 minutes
    setCode(['', '', '', '', '', '']);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (newCode.every(c => c) && newCode.join('').length === 6) {
      setVerifying(true);
      setTimeout(() => {
        navigate('/permissions');
      }, 1200);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: 16,
            padding: '4px 10px',
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          ‹
        </button>
        <h1 style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#C9A96E',
          letterSpacing: 1,
        }}>
          휴대폰 인증
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 20px' }}>
        <p style={{ fontSize: 15, color: '#ccc', marginBottom: 6, lineHeight: 1.6 }}>
          휴대폰 인증해주세요
        </p>
        <p style={{ fontSize: 13, color: '#777', marginBottom: 32, lineHeight: 1.5 }}>
          안전한 서비스 이용을 위해 본인 확인이 필요합니다
        </p>

        {/* Phone Input */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: '#C9A96E',
            marginBottom: 8,
            letterSpacing: 0.5,
          }}>
            휴대폰 번호
          </label>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: 14, color: '#888', marginRight: 8 }}>+82</span>
              <input
                value={formatPhone(phone)}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder="010-0000-0000"
                style={{
                  flex: 1,
                  padding: '14px 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#F0F0F0',
                  fontSize: 16,
                  letterSpacing: 1,
                }}
              />
            </div>
          </div>

          {/* Fetch from device button */}
          <button
            onClick={fetchPhoneFromDevice}
            disabled={fetchingPhone}
            style={{
              width: '100%',
              padding: '10px 0',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              color: '#C9A96E',
              background: 'rgba(201, 169, 110, 0.06)',
              border: '1px solid rgba(201, 169, 110, 0.15)',
              marginBottom: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {fetchingPhone ? '연락처에서 가져오는 중...' : '📱 내 기기에서 번호 가져오기'}
          </button>

          {/* Send Code Button */}
          <button
            onClick={handleSendCode}
            disabled={phone.length < 10 || (codeSent && timer > 0)}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: phone.length >= 10 ? '#fff' : '#555',
              background: phone.length >= 10
                ? 'linear-gradient(135deg, #8B0000, #5C0029)'
                : 'rgba(255,255,255,0.04)',
              border: 'none',
              boxShadow: phone.length >= 10
                ? '0 4px 16px rgba(139,0,0,0.35)'
                : 'none',
              cursor: phone.length >= 10 ? 'pointer' : 'default',
              transition: 'all 0.3s',
            }}
          >
            {codeSent && timer > 0 ? `재전송 (${formatTime(timer)})` : '인증요청'}
          </button>
        </div>

        {/* Verification Code */}
        {codeSent && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#C9A96E',
              marginBottom: 12,
              letterSpacing: 0.5,
            }}>
              인증번호 6자리를 입력하세요
            </label>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  maxLength={1}
                  style={{
                    flex: 1,
                    height: 56,
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#C9A96E',
                    borderRadius: 12,
                    border: digit
                      ? '1px solid rgba(201, 169, 110, 0.4)'
                      : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: digit
                      ? 'rgba(201, 169, 110, 0.06)'
                      : 'rgba(255,255,255,0.04)',
                    boxShadow: digit
                      ? '0 2px 8px rgba(201, 169, 110, 0.1)'
                      : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>

            {timer > 0 && (
              <p style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                남은 시간: <span style={{ color: '#C9A96E' }}>{formatTime(timer)}</span>
              </p>
            )}

            {verifying && (
              <div style={{
                textAlign: 'center',
                padding: '20px 0',
                animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  border: '3px solid rgba(201, 169, 110, 0.2)',
                  borderTopColor: '#C9A96E',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 12px',
                }} />
                <p style={{ fontSize: 14, color: '#C9A96E' }}>인증 확인 중...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
