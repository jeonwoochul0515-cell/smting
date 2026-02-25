import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Post {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  category?: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
}

export default function BoardDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    if (!postId) return;
    const [{ data: postData }, { data: commentsData }] = await Promise.all([
      supabase.from('free_posts').select('*').eq('id', postId).single(),
      supabase.from('free_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true }),
    ]);
    setPost(postData);
    setComments(commentsData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const sub = supabase
      .channel(`board_comments:${postId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'free_comments',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        setComments(prev => [...prev, payload.new as Comment]);
      })
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, [postId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = async () => {
    if (!input.trim() || !user || submitting || !postId) return;
    setSubmitting(true);
    const content = input.trim();
    setInput('');
    try {
      const { data, error } = await supabase
        .from('free_comments')
        .insert([{ post_id: postId, author_id: user.id, content }])
        .select()
        .single();
      if (error) throw error;
      if (data) setComments(prev => [...prev, data as Comment]);
    } catch {
      setInput(content);
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !user || post.author_id !== user.id) return;
    if (!confirm('게시글을 삭제할까요?')) return;
    await supabase.from('free_posts').delete().eq('id', post.id);
    navigate(`/board/${post.category || 'fs'}`, { replace: true });
  };

  const handleDeleteComment = async (commentId: string, authorId: string) => {
    if (!user || authorId !== user.id) return;
    await supabase.from('free_comments').delete().eq('id', commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' }}>
        불러오는 중...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' }}>
        게시글을 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0' }}>
      {/* 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' }}
        >←</button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>자유게시판</span>
      </div>

      {/* 스크롤 영역 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 게시글 본문 */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#C9A96E', fontWeight: 600 }}>익명</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: '#555' }}>{getTimeAgo(post.created_at)}</span>
              {user?.id === post.author_id && (
                <button
                  onClick={handleDeletePost}
                  style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer' }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: '#E0E0E0', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </p>
        </div>

        {/* 댓글 목록 */}
        <div style={{ padding: '8px 0' }}>
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: '#555', fontSize: 13 }}>
              첫 댓글을 남겨보세요
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>익명</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: '#444' }}>{getTimeAgo(comment.created_at)}</span>
                    {user?.id === comment.author_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id, comment.author_id)}
                        style={{ background: 'none', border: 'none', color: '#444', fontSize: 11, cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div style={{
        backgroundColor: 'rgba(20,20,20,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 12px',
        display: 'flex',
        gap: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="댓글을 입력하세요 (익명)"
          maxLength={300}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: '#F0F0F0',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || submitting}
          style={{
            background: !input.trim() || submitting
              ? 'rgba(255,255,255,0.04)'
              : 'linear-gradient(135deg, #8B0000, #5C0029)',
            color: !input.trim() || submitting ? '#555' : '#fff',
            border: 'none',
            borderRadius: 20,
            padding: '0 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: !input.trim() || submitting ? 'default' : 'pointer',
            boxShadow: !input.trim() || submitting ? 'none' : '0 2px 8px rgba(139,0,0,0.3)',
          }}
        >
          {submitting ? '...' : '등록'}
        </button>
      </div>
    </div>
  );
}
