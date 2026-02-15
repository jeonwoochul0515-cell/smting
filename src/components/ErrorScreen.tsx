import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorScreen({
  title = '문제가 발생했어요',
  message = '일시적인 오류입니다. 잠시 후 다시 시도해주세요.',
  onRetry,
}: ErrorScreenProps) {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      textAlign: 'center',
      animation: 'fadeIn 0.4s ease',
      minHeight: '60vh',
    }}>
      {/* Error icon */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'rgba(139,0,0,0.1)',
        border: '1px solid rgba(139,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        animation: 'pulse-gold 2s ease infinite',
      }}>
        <Icon name="warning" size={32} color="#C9A96E" />
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#eee', marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 28, maxWidth: 280 }}>
        {message}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              border: 'none',
              boxShadow: '0 4px 16px rgba(139,0,0,0.35)',
              cursor: 'pointer',
            }}
          >
            다시 시도하기
          </button>
        )}
        <button
          onClick={() => navigate('/nearby')}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            color: '#C9A96E',
            background: 'rgba(201,169,110,0.06)',
            border: '1px solid rgba(201,169,110,0.15)',
            cursor: 'pointer',
          }}
        >
          메인으로 돌아가기
        </button>
        <button
          onClick={() => navigate('/more')}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            color: '#888',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
          }}
        >
          고객센터 연결
        </button>
      </div>
    </div>
  );
}
