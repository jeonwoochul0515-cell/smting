import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PACKAGES = [
  { kane: 100, price: 1000, label: '100 케인', note: '₩1,000' },
  { kane: 300, price: 2900, label: '300 케인', note: '₩2,900', tag: '인기' },
  { kane: 700, price: 6500, label: '700 케인', note: '₩6,500', tag: '추천' },
  { kane: 1500, price: 13000, label: '1,500 케인', note: '₩13,000' },
];

export default function KanePurchasePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('kane')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setBalance(data?.kane || 0));
  }, [user]);

  const handlePurchase = async () => {
    if (selected === null || !user) return;
    const pkg = PACKAGES[selected];
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('kane')
        .eq('id', user.id)
        .single();

      const newBalance = (profile?.kane || 0) + pkg.kane;
      await supabase.from('profiles').update({ kane: newBalance }).eq('id', user.id);
      await supabase.from('kane_transactions').insert([{
        user_id: user.id,
        amount: pkg.kane,
        reason: 'purchase',
      }]);
      setBalance(newBalance);
      setSuccess(true);
    } catch (err) {
      alert('구매 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid rgba(201,169,110,0.15)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' }}
        >←</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>케인 충전</span>
      </div>

      <div style={{ padding: '24px 20px 60px', maxWidth: 480, margin: '0 auto' }}>
        {/* Current balance */}
        <div style={{
          backgroundColor: 'rgba(201,169,110,0.08)',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: 16,
          padding: '20px',
          textAlign: 'center',
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>현재 잔액</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#C9A96E' }}>{balance.toLocaleString()} 케인</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>100 케인 = ₩1,000</div>
        </div>

        {success ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'rgba(0,200,83,0.06)',
            border: '1px solid rgba(0,200,83,0.2)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#00C853', marginBottom: 8 }}>충전 완료!</div>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
              {selected !== null && `${PACKAGES[selected].kane.toLocaleString()} 케인이 충전되었습니다`}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#C9A96E', marginBottom: 24 }}>
              잔액: {balance.toLocaleString()} 케인
            </div>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '12px 32px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #8B0000, #5C0029)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#C9A96E', marginBottom: 14 }}>충전 패키지 선택</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {PACKAGES.map((pkg, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 14,
                    border: selected === i
                      ? '1px solid rgba(201,169,110,0.6)'
                      : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: selected === i
                      ? 'rgba(201,169,110,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: selected === i ? '2px solid #C9A96E' : '2px solid #444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {selected === i && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#C9A96E' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F0F0' }}>{pkg.label}</div>
                      {pkg.tag && (
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          color: '#8B0000',
                          backgroundColor: 'rgba(139,0,0,0.15)',
                          padding: '2px 6px',
                          borderRadius: 4,
                          marginTop: 2,
                          display: 'inline-block',
                        }}>{pkg.tag}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#C9A96E' }}>{pkg.note}</div>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: 'rgba(139,0,0,0.1)',
              border: '1px solid rgba(139,0,0,0.25)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 12,
              color: '#888',
              lineHeight: 1.7,
              marginBottom: 24,
            }}>
              · 쪽지 전송 시 3 케인 차감<br />
              · 토크 작성 시 하루 1회 10 케인 무료 지급<br />
              · 구매한 케인은 환불되지 않습니다<br />
              · 결제는 별도 결제 시스템 연동 예정입니다
            </div>

            <button
              onClick={handlePurchase}
              disabled={selected === null || loading}
              style={{
                width: '100%',
                padding: '16px 0',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                color: selected === null || loading ? '#555' : '#fff',
                background: selected === null || loading
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(135deg, #8B0000, #5C0029)',
                border: 'none',
                boxShadow: selected === null || loading ? 'none' : '0 4px 20px rgba(139,0,0,0.4)',
                cursor: selected === null || loading ? 'default' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {loading ? '처리 중...' : selected !== null ? `${PACKAGES[selected].note} 결제하기` : '패키지를 선택해주세요'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
