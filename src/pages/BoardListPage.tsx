import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const BOARD_INFO = {
  fs: { label: 'FS', name: '여성 서브미시브', emoji: '🎀', color: '#8B0000', gradient: 'linear-gradient(135deg, #8B0000, #5C0029)', textColor: '#C9A96E' },
  fd: { label: 'FD', name: '여성 도미넌트', emoji: '👑', color: '#1A3A5C', gradient: 'linear-gradient(135deg, #1A3A5C, #0D1F33)', textColor: '#6A9FD8' },
  ms: { label: 'MS', name: '남성 서브미시브', emoji: '⛓️', color: '#1A4A1A', gradient: 'linear-gradient(135deg, #1A4A1A, #0D2D0D)', textColor: '#6ABF6A' },
  md: { label: 'MD', name: '남성 도미넌트', emoji: '🔱', color: '#2A1A5C', gradient: 'linear-gradient(135deg, #2A1A5C, #150D33)', textColor: '#9A7FD8' },
};

interface Post {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  comment_count?: number;
}

export default function BoardListPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const board = BOARD_INFO[category as 'fs' | 'fd' | 'ms' | 'md'];

  const loadPosts = async () => {
    if (!category) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('free_posts')
        .select('*, free_comments(count)')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(50);

      const mapped = (data || []).map((p: any) => ({
        ...p,
        comment_count: p.free_comments?.[0]?.count ?? 0,
      }));
      setPosts(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    const sub = supabase
      .channel(`free_posts_${category}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'free_posts' }, (payload) => {
        const newPost = payload.new as Post & { category: string };
        if (newPost.category === category) loadPosts();
      })
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, [category]);

  const handleSubmit = async () => {
    if (!input.trim() || !user || submitting || !category) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('free_posts')
        .insert([{ author_id: user.id, content: input.trim(), category }]);
      if (error) throw error;
      setInput('');
      setWriting(false);
    } catch {
      alert('글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date.endsWith('Z') ? date : date + 'Z').getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return '방금';
    if (m < 60) return `${m}분 전`;
    if (h < 24) return `${h}시간 전`;
    return `${d}일 전`;
  };

  if (!board) {
    navigate('/theme', { replace: true });
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0', paddingBottom: 60 }}>
      {/* 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate('/theme')}
          style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' }}
        >←</button>
        <span style={{ fontSize: 16, fontWeight: 800, background: board.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {board.emoji} {board.label}
        </span>
        <span style={{ fontSize: 14, color: '#888' }}>{board.name}</span>
        <button
          onClick={() => setWriting(true)}
          style={{
            marginLeft: 'auto',
            background: board.gradient,
            color: '#fff', border: 'none', borderRadius: 20,
            padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 2px 8px ${board.color}55`,
          }}
        >
          + 글쓰기
        </button>
      </div>

      {/* 글쓰기 폼 */}
      {writing && (
        <div style={{
          margin: '12px 16px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: `1px solid ${board.color}44`,
          borderRadius: 14, padding: 16,
        }}>
          <textarea
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="하고 싶은 말을 자유롭게 써보세요 (익명)"
            maxLength={1000}
            rows={4}
            style={{
              width: '100%', background: 'none', border: 'none',
              color: '#F0F0F0', fontSize: 14, lineHeight: 1.6,
              resize: 'none', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#555' }}>{input.length}/1000</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setWriting(false); setInput(''); }}
                style={{ background: 'none', border: '1px solid #333', color: '#888', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}
              >취소</button>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || submitting}
                style={{
                  background: !input.trim() || submitting ? 'rgba(255,255,255,0.05)' : board.gradient,
                  color: !input.trim() || submitting ? '#555' : '#fff',
                  border: 'none', borderRadius: 8, padding: '6px 16px',
                  fontSize: 13, fontWeight: 600,
                  cursor: !input.trim() || submitting ? 'default' : 'pointer',
                }}
              >{submitting ? '등록 중...' : '등록'}</button>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 목록 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{board.emoji}</div>
          <div>첫 글을 남겨보세요</div>
        </div>
      ) : (
        <div>
          {posts.map((post, i) => (
            <div
              key={post.id}
              onClick={() => navigate(`/board/post/${post.id}`)}
              style={{
                padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: board.textColor, fontWeight: 600 }}>익명</span>
                <span style={{ fontSize: 11, color: '#555' }}>{getTimeAgo(post.created_at)}</span>
              </div>
              <p style={{
                fontSize: 14, color: '#ddd', lineHeight: 1.6, margin: 0,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
              }}>
                {post.content}
              </p>
              {(post.comment_count ?? 0) > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  💬 댓글 {post.comment_count}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
