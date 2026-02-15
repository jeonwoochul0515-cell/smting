import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface TalkWriteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TalkWriteModal({ onClose, onSuccess }: TalkWriteModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    setError('');

    try {
      // 토크 포스트 저장
      const { error: postError } = await supabase
        .from('talk_posts')
        .insert([{
          user_id: user.id,
          title: content.slice(0, 100), // Use first 100 chars as title
          content,
          category: '전체',
        }]);

      if (postError) throw postError;

      // Cai +30 추가
      const { data: profile } = await supabase
        .from('profiles')
        .select('cai')
        .eq('id', user.id)
        .single();

      const newCai = (profile?.cai || 0) + 30;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cai: newCai })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 거래 내역 기록
      await supabase
        .from('cai_transactions')
        .insert([{
          user_id: user.id,
          amount: 30,
          reason: 'talk_post',
        }]);

      onSuccess();
    } catch (err: any) {
      setError(err.message || '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 300,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 430,
          backgroundColor: '#1A1A1A',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#333', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            새 토크 쓰기
          </h2>
          <p style={{ fontSize: 13, color: '#888' }}>
            토크를 작성하면 30 Cai를 얻습니다!
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            backgroundColor: 'rgba(255, 100, 100, 0.1)',
            border: '1px solid rgba(255, 100, 100, 0.3)',
            color: '#FF6464',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="토크를 작성하세요"
              rows={8}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#F0F0F0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: '#888',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: loading || !content.trim() ? '#555' : '#fff',
                background: loading || !content.trim()
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(135deg, #8B0000, #5C0029)',
                border: 'none',
                cursor: loading || !content.trim() ? 'default' : 'pointer',
                boxShadow: (loading || !content.trim())
                  ? 'none'
                  : '0 2px 12px rgba(139,0,0,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? '저장 중...' : '토크 작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
