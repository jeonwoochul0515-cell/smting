import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
}

const reasonLabel: Record<string, string> = {
  talk_post: '토크 작성 보상',
  message_send: '쪽지 전송',
  purchase: '케인 충전',
};

export default function KaneHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: profile }, { data: txs }] = await Promise.all([
        supabase.from('profiles').select('kane').eq('id', user.id).single(),
        supabase.from('kane_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      ]);
      setBalance(profile?.kane || 0);
      setTransactions(txs || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date.endsWith('Z') ? date : date + 'Z');
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 30) return `${diffDays}일 전`;
    return then.toLocaleDateString('ko-KR');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0A0A0A', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' }}>←</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>케인 내역</span>
      </div>

      <div style={{ padding: '20px 16px 60px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ backgroundColor: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 16, padding: '20px', textAlign: 'center', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>현재 잔액</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#C9A96E' }}>{balance.toLocaleString()} 케인</div>
          </div>
          <button onClick={() => navigate('/kane/purchase')} style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #8B0000, #5C0029)', border: 'none', cursor: 'pointer' }}>
            충전하기
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>불러오는 중...</div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>거래 내역이 없습니다</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {transactions.map((tx, i) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F0', marginBottom: 4 }}>{reasonLabel[tx.reason] || tx.reason}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{getTimeAgo(tx.created_at)}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: tx.amount > 0 ? '#C9A96E' : '#FF6B6B' }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} 케인
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
