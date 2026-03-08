import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ConversationUser {
  id: string;
  nickname: string;
  age: number;
  tendency: string;
  avatar: string;
  avatar_url?: string | null;
}

interface Conversation {
  userId: string;
  user: ConversationUser;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [kane, setKane] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    supabase
      .from('profiles')
      .select('kane')
      .eq('id', currentUser.id)
      .single()
      .then(({ data }) => setKane(data?.kane || 0));
  }, [currentUser]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Get all unique users from messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Group by conversation (최신 메시지만 보존)
        const conversationMap = new Map<string, { msg: typeof messagesData[0]; otherUserId: string }>();
        if (messagesData) {
          for (const msg of messagesData) {
            const otherUserId = msg.sender_id === currentUser.id ? msg.recipient_id : msg.sender_id;
            if (!conversationMap.has(otherUserId)) {
              conversationMap.set(otherUserId, { msg, otherUserId });
            }
          }
        }

        // 프로필을 한 번의 쿼리로 일괄 fetch (N+1 방지)
        const otherUserIds = Array.from(conversationMap.keys());

        // 차단한 사용자 목록 조회
        const { data: blockData } = await supabase
          .from('block_list')
          .select('blocked_id')
          .eq('blocker_id', currentUser.id);
        const blockedIds = new Set((blockData || []).map((b: any) => b.blocked_id));

        // otherUserIds에서 차단된 사용자 제외
        const filteredUserIds = otherUserIds.filter(id => !blockedIds.has(id));

        const profileMap = new Map<string, ConversationUser>();
        if (filteredUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, nickname, age, tendency, avatar, avatar_url')
            .in('id', filteredUserIds);
          profiles?.forEach((p) => profileMap.set(p.id, p));
        }

        const conversationList: Conversation[] = [];
        conversationMap.forEach(({ msg, otherUserId }) => {
          if (blockedIds.has(otherUserId)) return; // 차단된 사용자 스킵
          const user = profileMap.get(otherUserId);
          if (user) {
            conversationList.push({
              userId: otherUserId,
              user,
              lastMessage: msg.content,
              lastMessageTime: msg.created_at,
              unread: msg.recipient_id === currentUser.id && !msg.read_at,
            });
          }
        });

        conversationList.sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        setConversations(conversationList);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // 내가 받는 새 메시지 구독 (단일 컬럼 필터만 지원)
    const subscription = supabase
      .channel(`messages:${currentUser?.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${currentUser?.id}`,
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const then = new Date(date.endsWith('Z') || date.includes('+') ? date : date + 'Z');
    if (isNaN(then.getTime())) return '';
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분`;
    if (diffHours < 24) return `${diffHours}시간`;
    if (diffDays < 7) return `${diffDays}일`;
    return then.toLocaleDateString('ko-KR');
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header kane={kane} />

      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            메시지를 불러오는 중...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            <p>대화 내역이 없습니다</p>
          </div>
        ) : (
          conversations.map((conv, i) => (
            <div
              key={conv.userId}
              onClick={() => navigate(`/chat/${conv.userId}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                gap: 12,
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                backgroundColor: conv.unread ? 'rgba(139,0,0,0.04)' : 'transparent',
                animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.08)')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = conv.unread ? 'rgba(139,0,0,0.04)' : 'transparent')
              }
            >
              <Avatar color={conv.user.avatar} nickname={conv.user.nickname} size={50} imageUrl={conv.user.avatar_url} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <TendencyBadge tendency={conv.user.tendency as any} size="sm" />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{conv.user.nickname}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{conv.user.age}세</span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: conv.unread ? '#ccc' : '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {conv.lastMessage}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#555' }}>{getTimeAgo(conv.lastMessageTime)}</span>
                {conv.unread && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8B0000, #CC0000)',
                      display: 'block',
                      boxShadow: '0 0 6px rgba(139,0,0,0.5)',
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
