import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import ReportModal from '../components/ReportModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  gender: string;
  tendency: string;
  avatar: string;
  avatar_url?: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [kane, setKane] = useState<number>(0);
  const [hasSentBefore, setHasSentBefore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation
  useEffect(() => {
    const loadConversation = async () => {
      if (!userId || !currentUser) return;

      try {
        setLoading(true);

        // Load current user's kane balance
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('kane')
          .eq('id', currentUser.id)
          .single();
        setKane(myProfile?.kane || 0);

        // Load other user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        setOtherUser(userData);

        // Load messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${currentUser.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${currentUser.id})`
          )
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // 이전에 내가 보낸 메시지 있으면 이후 무료
        if (messagesData?.some(m => m.sender_id === currentUser.id)) {
          setHasSentBefore(true);
        }

        // Mark as read
        if (messagesData && messagesData.length > 0) {
          await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('recipient_id', currentUser.id)
            .eq('sender_id', userId);
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${currentUser?.id}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id=eq.${currentUser?.id},recipient_id=eq.${userId}),and(sender_id=eq.${userId},recipient_id=eq.${currentUser?.id}))`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, currentUser]);

  const handleSend = async () => {
    if (!input.trim() || !currentUser || !userId || blocked) return;

    // 첫 메시지일 때만 3케인 차감
    if (!hasSentBefore) {
      if (kane < 3) {
        alert('케인이 부족합니다. 첫 쪽지 전송에 3 케인이 필요합니다.\n케인 충전 후 이용해주세요.');
        return;
      }
    }

    setSending(true);
    try {
      // 첫 메시지만 3케인 차감
      if (!hasSentBefore) {
        const newKane = kane - 3;
        await supabase.from('profiles').update({ kane: newKane }).eq('id', currentUser.id);
        await supabase.from('kane_transactions').insert([{ user_id: currentUser.id, amount: -3, reason: 'message_send' }]);
        setKane(newKane);
      }

      const { error } = await supabase.from('messages').insert([
        { sender_id: currentUser.id, recipient_id: userId, content: input },
      ]);

      if (error) throw error;
      setInput('');
      setHasSentBefore(true); // 이후 무료
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('메시지 전송 실패');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' }}>
        채팅을 불러오는 중...
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' }}>
        사용자를 찾을 수 없습니다
      </div>
    );
  }

  const isSender = (msg: Message) => msg.sender_id === currentUser?.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        title={`${otherUser.nickname} ${otherUser.age}세`}
        showBack
        onBack={() => navigate(-1)}
        right={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TendencyBadge tendency={otherUser.tendency as any} />
            <button
              onClick={() => setShowMenu(true)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 16,
                padding: '2px 8px',
                borderRadius: 6,
                marginLeft: 4,
              }}
            >
              ⋮
            </button>
          </div>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          background: 'linear-gradient(180deg, #0A0A0A 0%, #0F0808 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
            <p>대화를 시작해보세요</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isSender(msg) ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: 8,
                animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
              }}
            >
              {!isSender(msg) && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Avatar color={otherUser.avatar} nickname={otherUser.nickname} size={34} imageUrl={otherUser.avatar_url} />
                  <span style={{ fontSize: 9, color: '#666' }}>{otherUser.nickname}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: isSender(msg) ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    maxWidth: 230,
                    padding: '10px 14px',
                    borderRadius: isSender(msg) ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isSender(msg)
                      ? 'linear-gradient(135deg, #8B0000, #5C0029)'
                      : 'rgba(255,255,255,0.06)',
                    color: '#F0F0F0',
                    fontSize: 14,
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    boxShadow: isSender(msg)
                      ? '0 2px 8px rgba(139,0,0,0.3)'
                      : '0 2px 6px rgba(0,0,0,0.2)',
                    border: isSender(msg) ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  {msg.content}
                </div>
                <span style={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>
                  {new Date(msg.created_at + (msg.created_at.endsWith('Z') ? '' : 'Z')).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />

        {blocked && (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'rgba(255,68,68,0.06)',
              borderRadius: 12,
              border: '1px solid rgba(255,68,68,0.15)',
              color: '#FF6B6B',
              fontSize: 13,
            }}
          >
            이 사용자를 차단했습니다
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'rgba(20,20,20,0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ padding: '6px 16px 0', fontSize: 11, color: !hasSentBefore && kane < 3 ? '#FF6464' : '#888' }}>
          {hasSentBefore ? `잔액: ${kane} 케인 · 이후 쪽지 무료` : `잔액: ${kane} 케인 · 첫 쪽지 3 케인`}
        </div>
      <div
        style={{
          display: 'flex',
          padding: '6px 12px 10px',
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={blocked ? '차단된 사용자입니다' : '메시지를 입력하세요...'}
          disabled={blocked || sending}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: '#F0F0F0',
            fontSize: 14,
          }}
        />
        <button
          onClick={handleSend}
          disabled={blocked || sending || !input.trim()}
          style={{
            background:
              blocked || sending || !input.trim()
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, #8B0000, #5C0029)',
            color: blocked || sending || !input.trim() ? '#555' : '#fff',
            borderRadius: 20,
            padding: '0 20px',
            fontSize: 14,
            fontWeight: 600,
            boxShadow:
              blocked || sending || !input.trim()
                ? 'none'
                : '0 2px 8px rgba(139,0,0,0.3)',
            cursor: blocked || sending || !input.trim() ? 'default' : 'pointer',
          }}
        >
          {sending ? '전송 중...' : '전송'}
        </button>
      </div>
      </div>

      {showMenu && (
        <ReportModal
          nickname={otherUser.nickname}
          userId={otherUser.id}
          mode="menu"
          onClose={() => setShowMenu(false)}
          onBlock={async () => {
            setBlocked(true);
            if (currentUser) {
              await supabase.from('block_list').insert([{ blocker_id: currentUser.id, blocked_id: otherUser.id }]);
            }
          }}
        />
      )}
    </div>
  );
}
