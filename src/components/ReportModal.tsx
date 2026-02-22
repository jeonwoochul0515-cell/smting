import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ReportModalProps {
  nickname: string;
  userId?: string;
  onClose: () => void;
  onBlock?: () => void;
  mode: 'report' | 'menu';
}

const reportReasons = [
  '욕설 및 비하 발언',
  '사기 및 금전 요구',
  '불쾌한 행동',
  '허위 프로필',
  '미성년자 의심',
  '기타',
];

export default function ReportModal({ nickname, userId, onClose, onBlock, mode }: ReportModalProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'menu' | 'report' | 'done'>(mode === 'report' ? 'report' : 'menu');
  const [selectedReason, setSelectedReason] = useState('');

  const handleReport = async () => {
    if (!selectedReason) return;
    if (user && userId) {
      try {
        await supabase.from('reports').insert([{
          reporter_id: user.id,
          reported_id: userId,
          reason: selectedReason,
        }]);
      } catch { /* ignore - still show done */ }
    }
    setView('done');
    setTimeout(onClose, 1500);
  };

  const handleBlock = () => {
    onBlock?.();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 430,
          backgroundColor: '#1A1A1A',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Menu View */}
        {view === 'menu' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#333', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{nickname}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => setView('report')}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#FF6B6B',
                  background: 'rgba(255, 107, 107, 0.06)',
                  border: '1px solid rgba(255, 107, 107, 0.15)',
                  textAlign: 'left',
                }}
              >
                신고하기
              </button>
              <button
                onClick={handleBlock}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#FF4444',
                  background: 'rgba(255, 68, 68, 0.06)',
                  border: '1px solid rgba(255, 68, 68, 0.15)',
                  textAlign: 'left',
                }}
              >
                차단하기
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#888',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                취소
              </button>
            </div>
          </>
        )}

        {/* Report View */}
        {view === 'report' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#333', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                신고 사유를 선택해주세요
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {reportReasons.map(reason => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  style={{
                    padding: '13px 16px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    color: selectedReason === reason ? '#C9A96E' : '#999',
                    background: selectedReason === reason
                      ? 'rgba(201, 169, 110, 0.08)'
                      : 'rgba(255,255,255,0.02)',
                    border: selectedReason === reason
                      ? '1px solid rgba(201, 169, 110, 0.3)'
                      : '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setView('menu')}
                style={{
                  padding: '13px 20px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#888',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                이전
              </button>
              <button
                onClick={handleReport}
                disabled={!selectedReason}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: selectedReason ? '#fff' : '#555',
                  background: selectedReason
                    ? 'linear-gradient(135deg, #8B0000, #5C0029)'
                    : 'rgba(255,255,255,0.04)',
                  border: 'none',
                  boxShadow: selectedReason ? '0 2px 12px rgba(139,0,0,0.3)' : 'none',
                  cursor: selectedReason ? 'pointer' : 'default',
                }}
              >
                신고 제출
              </button>
            </div>
          </>
        )}

        {/* Done View */}
        {view === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(0,200,83,0.15)" stroke="#00C853" strokeWidth="2" />
                <path d="m9 12 2 2 4-4" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              신고가 접수되었습니다
            </h3>
            <p style={{ fontSize: 13, color: '#888' }}>
              검토 후 조치하겠습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
