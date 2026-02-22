import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import Icon from '../components/Icon';

interface BlockedUser {
  block_id: string;
  id: string;
  nickname: string;
  age: number;
  gender: string;
  tendency: string;
  avatar: string;
  avatar_url?: string | null;
  intro: string;
}

export default function BlockListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('block_list')
        .select('id, blocked_id')
        .eq('blocker_id', user.id);

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      const blockedIds = data.map(r => r.blocked_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nickname, age, gender, tendency, avatar, avatar_url, intro')
        .in('id', blockedIds);

      const merged = (profiles || []).map(p => ({
        ...p,
        block_id: data.find(r => r.blocked_id === p.id)?.id || '',
      }));
      setBlockedUsers(merged);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleUnblock = async (blockId: string, userId: string) => {
    await supabase.from('block_list').delete().eq('id', blockId);
    setBlockedUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)' }}>
      <Header title="차단 관리" showBack onBack={() => navigate(-1)} />
      <div style={{ padding: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>불러오는 중...</div>
        ) : blockedUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Icon name="lock" size={48} color="#555" />
            </div>
            <p style={{ fontSize: 15 }}>차단한 사용자가 없습니다</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>차단된 사용자: {blockedUsers.length}명</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {blockedUsers.map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', animation: `fadeIn 0.3s ease ${i * 0.08}s both` }}>
                  <Avatar color={u.avatar} nickname={u.nickname} size={44} imageUrl={u.avatar_url} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <TendencyBadge tendency={u.tendency as any} size="sm" />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u.nickname}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>{u.age}세</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#666' }}>{u.intro}</span>
                  </div>
                  <button
                    onClick={() => handleUnblock(u.block_id, u.id)}
                    style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#FF6B6B', background: 'rgba(255, 107, 107, 0.08)', border: '1px solid rgba(255, 107, 107, 0.2)', cursor: 'pointer', flexShrink: 0 }}
                  >
                    차단 해제
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
